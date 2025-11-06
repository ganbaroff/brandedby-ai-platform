import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowLeft, Search, Filter, Eye } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
}

const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = () => {
    try {
      const saved = localStorage.getItem('blogPosts');
      if (saved) {
        setBlogPosts(JSON.parse(saved));
      } else {
        const defaultPosts: BlogPost[] = [
          {
            id: 1,
            title: 'Революция в мире AI-фотографии',
            content: `<p>Искусственный интеллект кардинально меняет способы создания и обработки фотографий. Новые технологии позволяют создавать невероятно реалистичные изображения за секунды.</p>

<h2>Что делает AI-фотографию особенной?</h2>
<p>AI-технологии открывают безграничные возможности для творчества:</p>
<ul>
<li><strong>Мгновенное создание</strong> - генерация изображений за секунды</li>
<li><strong>Персонализация</strong> - адаптация под ваши предпочтения</li>
<li><strong>Высокое качество</strong> - профессиональный результат без опыта</li>
</ul>

<h2>Применение в индустрии</h2>
<p>От киноиндустрии до социальных сетей - AI-фотография меняет все сферы визуального контента.</p>`,
            excerpt: 'Как AI технологии меняют мир фотографии и видеопроизводства',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&auto=format&q=80',
            author: 'BrandedBy Team',
            publishedAt: '2025-11-06',
            category: 'Технологии'
          },
          {
            id: 2,
            title: 'Создание персональных видео с знаменитостями',
            content: `<p>Узнайте, как наша платформа позволяет создавать уникальные видео, где вы можете взаимодействовать с любимыми знаменитостями.</p>

<h2>Пошаговый процесс</h2>
<ol>
<li><strong>Загрузите селфи</strong> - качественное фото лица</li>
<li><strong>Выберите знаменитость</strong> - из нашей базы звезд</li>
<li><strong>Настройте параметры</strong> - длительность и стиль видео</li>
<li><strong>Получите результат</strong> - HD видео за минуты</li>
</ol>

<h2>Советы для лучшего результата</h2>
<p>Для получения максимально реалистичного результата следуйте этим рекомендациям:</p>
<ul>
<li>Используйте четкое фото с хорошим освещением</li>
<li>Лицо должно быть полностью видно</li>
<li>Избегайте солнцезащитных очков и закрывающих аксессуаров</li>
</ul>`,
            excerpt: 'Пошаговое руководство по созданию AI-видео с селфи',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop&auto=format&q=80',
            author: 'Alex Johnson',
            publishedAt: '2025-11-05',
            category: 'Обучение'
          },
          {
            id: 3,
            title: 'Будущее развлечений: AI и персонализация',
            content: `<p>Исследуем, как искусственный интеллект формирует будущее индустрии развлечений и создает новые форматы взаимодействия.</p>

<h2>Тренды в AI-развлечениях</h2>
<p>Индустрия развлечений переживает революцию благодаря AI:</p>

<h3>1. Персонализированный контент</h3>
<p>AI анализирует предпочтения пользователей и создает уникальный контент для каждого.</p>

<h3>2. Интерактивные медиа</h3>
<p>Зрители становятся частью истории, влияя на сюжет в реальном времени.</p>

<h3>3. Виртуальные актеры</h3>
<p>AI-персонажи становятся все более реалистичными и эмоциональными.</p>

<h2>Что нас ждет?</h2>
<p>В ближайшем будущем мы увидим:</p>
<ul>
<li>Полностью персонализированные фильмы</li>
<li>AI-друзья и компаньоны</li>
<li>Интерактивные AR/VR миры</li>
</ul>`,
            excerpt: 'Взгляд в будущее AI-развлечений и персонализированного контента',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=500&fit=crop&auto=format&q=80',
            author: 'Maria Garcia',
            publishedAt: '2025-11-04',
            category: 'AI'
          }
        ];
        setBlogPosts(defaultPosts);
        localStorage.setItem('blogPosts', JSON.stringify(defaultPosts));
      }
    } catch (error) {
      console.error('Ошибка загрузки постов блога:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Технологии': 'bg-blue-100 text-blue-700',
      'Обучение': 'bg-green-100 text-green-700',
      'AI': 'bg-purple-100 text-purple-700',
      'Новости': 'bg-orange-100 text-orange-700',
      'Обновления': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(blogPosts.map(post => post.category)));

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Назад к блогу
            </button>

            <article className="bg-white rounded-xl shadow-sm overflow-hidden">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              
              <div className="p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-4 mb-6">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(selectedPost.category)}`}>
                    {selectedPost.category}
                  </span>
                  <div className="flex items-center text-gray-600 space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(selectedPost.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{selectedPost.author}</span>
                    </div>
                  </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  {selectedPost.title}
                </h1>

                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>
            </article>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Блог BrandedBy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Новости, обновления и статьи о мире AI-технологий и развлечений
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Поиск статей..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Все категории</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Blog Posts Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(post.publishedAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center text-purple-600 font-semibold">
                        <span className="group-hover:translate-x-1 transition-transform">
                          Читать далее
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">
                    По вашему запросу статьи не найдены
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;