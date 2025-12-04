/**
 * Celebrity Image Auto-Loader
 * Автоматически загружает фото селебрити по имени из Unsplash API
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UNSPLASH_ACCESS_KEY = (import.meta as any).env?.VITE_UNSPLASH_ACCESS_KEY || '';

export interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    username: string;
  };
  alt_description: string | null;
}

/**
 * Поиск фото селебрити на Unsplash по имени
 */
export async function searchCelebrityPhoto(
  celebrityName: string,
  fallbackKeywords: string[] = []
): Promise<string | null> {
  try {
    // Формируем запрос
    const searchQuery = `${celebrityName} portrait professional`;
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.append('query', searchQuery);
    url.searchParams.append('per_page', '1');
    url.searchParams.append('orientation', 'portrait');
    
    // Если есть Access Key, используем API
    if (UNSPLASH_ACCESS_KEY) {
      const response = await fetch(url.toString(), {
        headers: {
          'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      });

      if (!response.ok) {
        console.warn(`[ImageLoader] Unsplash API error: ${response.status}`);
        return getOptimizedUnsplashUrl(celebrityName);
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const photo: UnsplashPhoto = data.results[0];
        // Возвращаем оптимизированный URL
        return `${photo.urls.raw}?w=400&h=400&fit=crop&crop=face&auto=format&q=80`;
      }
    }

    // Fallback: генерируем URL без API
    return getOptimizedUnsplashUrl(celebrityName, fallbackKeywords);
  } catch (error) {
    console.error(`[ImageLoader] Failed to load photo for ${celebrityName}:`, error);
    return getOptimizedUnsplashUrl(celebrityName, fallbackKeywords);
  }
}

/**
 * Генерирует оптимизированный Unsplash URL без использования API
 * Использует Source API Unsplash для прямого доступа к фото
 */
export function getOptimizedUnsplashUrl(
  celebrityName: string,
  keywords: string[] = []
): string {
  // Очищаем имя от специальных символов
  const cleanName = celebrityName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
  
  // Добавляем ключевые слова для улучшения поиска
  const searchTerms = [cleanName, ...keywords, 'portrait', 'professional'].join(',');
  
  // Используем Source API Unsplash для динамической загрузки
  return `https://source.unsplash.com/400x400/?${encodeURIComponent(searchTerms)}`;
}

/**
 * Генерирует placeholder для фото селебрити
 */
export function getCelebrityPhotoPlaceholder(celebrityName: string): string {
  // UI Avatars API as fallback
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(celebrityName)}&size=400&background=667eea&color=fff&bold=true`;
}

/**
 * Загружает фото с кэшированием
 */
export async function loadCelebrityPhotoWithCache(
  celebrityName: string,
  fallbackKeywords: string[] = []
): Promise<string> {
  const cacheKey = `celebrity_photo_${celebrityName.toLowerCase().replace(/\s+/g, '_')}`;
  
  // Проверяем localStorage cache
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const { url, timestamp } = JSON.parse(cached);
      // Кэш действителен 7 дней
      if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
        return url;
      }
    }
  }

  // Загружаем новое фото
  const photoUrl = await searchCelebrityPhoto(celebrityName, fallbackKeywords);
  const finalUrl = photoUrl || getCelebrityPhotoPlaceholder(celebrityName);

  // Сохраняем в cache
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        url: finalUrl,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('[ImageLoader] Failed to cache photo URL:', error);
    }
  }

  return finalUrl;
}

/**
 * Пакетная загрузка фото для списка селебрити
 */
export async function batchLoadCelebrityPhotos(
  celebrities: Array<{ name: string; niches?: string }>
): Promise<Map<string, string>> {
  const photoMap = new Map<string, string>();
  
  // Загружаем параллельно с лимитом
  const batchSize = 5;
  for (let i = 0; i < celebrities.length; i += batchSize) {
    const batch = celebrities.slice(i, i + batchSize);
    const promises = batch.map(async (celebrity) => {
      try {
        // Парсим niches для keywords
        let keywords: string[] = [];
        if (celebrity.niches) {
          try {
            keywords = JSON.parse(celebrity.niches);
          } catch {
            keywords = [];
          }
        }
        
        const url = await loadCelebrityPhotoWithCache(celebrity.name, keywords);
        return { name: celebrity.name, url };
      } catch (error) {
        console.error(`[ImageLoader] Failed for ${celebrity.name}:`, error);
        return { name: celebrity.name, url: getCelebrityPhotoPlaceholder(celebrity.name) };
      }
    });

    const results = await Promise.all(promises);
    results.forEach(({ name, url }) => photoMap.set(name, url));
  }

  return photoMap;
}

/**
 * Очищает кэш фото
 */
export function clearCelebrityPhotoCache(): void {
  if (typeof window !== 'undefined') {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('celebrity_photo_')) {
        localStorage.removeItem(key);
      }
    });
  }
}
