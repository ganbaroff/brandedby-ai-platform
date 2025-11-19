/**
 * HTML Sanitizer - Protection against XSS attacks
 * Safely sanitizes HTML content to prevent script injection
 */

// Simple HTML sanitizer function
export function sanitizeHtml(html: string): string {
  // Create a temporary DOM element
  const temp = document.createElement('div');
  temp.textContent = html;
  
  // Get the sanitized content
  let sanitized = temp.innerHTML;
  
  // Basic sanitization - remove dangerous content
  
  // Remove script tags and event handlers
  sanitized = sanitized
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/javascript:/gi, '');
  
  return sanitized;
}

// Safe component for rendering HTML content
export function createSafeHtml(content: string): { __html: string } {
  return { __html: sanitizeHtml(content) };
}

// Validate blog post content
export function validateBlogContent(content: string): {
  isValid: boolean;
  errors: string[];
  sanitizedContent: string;
} {
  const errors: string[] = [];
  
  // Check for dangerous content
  if (content.includes('<script')) {
    errors.push('Script tags are not allowed');
  }
  
  if (content.includes('javascript:')) {
    errors.push('JavaScript URLs are not allowed');
  }
  
  if (content.includes('onload=') || content.includes('onclick=')) {
    errors.push('Event handlers are not allowed');
  }
  
  // Check content length
  if (content.length > 50000) {
    errors.push('Content is too long (max 50,000 characters)');
  }
  
  const sanitizedContent = sanitizeHtml(content);
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitizedContent
  };
}

// Text-only safe extraction
export function extractTextContent(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return temp.textContent || temp.innerText || '';
}