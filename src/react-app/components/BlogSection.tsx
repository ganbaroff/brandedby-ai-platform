import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, ExternalLink } from 'lucide-react';

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

const BlogSection: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = () => {
    try {
      // Load from localStorage or set default posts
      const saved = localStorage.getItem('blogPosts');
      if (saved) {
        const posts = JSON.parse(saved);
        setBlogPosts(posts.slice(0, 3)); // Show only latest 3 posts
      } else {
        // Default blog posts
        const defaultPosts: BlogPost[] = [
          {
            id: 1,
            title: 'AI Photography Revolution',
            content: 'Artificial intelligence is fundamentally changing the way we create and process photographs. New technologies allow for incredibly realistic image generation in seconds.',
            excerpt: 'How AI technologies are transforming photography and video production',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop&auto=format&q=80',
            author: 'BrandedBy Team',
            publishedAt: '2025-11-06',
            category: 'Technology'
          },
          {
            id: 2,
            title: 'Creating Personal Videos with Celebrities',
            content: 'Learn how our platform allows you to create unique videos where you can interact with your favorite celebrities.',
            excerpt: 'Step-by-step guide to creating AI videos with selfies',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600&h=400&fit=crop&auto=format&q=80',
            author: 'Alex Johnson',
            publishedAt: '2025-11-05',
            category: 'Tutorial'
          },
          {
            id: 3,
            title: 'The Future of Entertainment: AI and Personalization',
            content: 'Exploring how artificial intelligence is shaping the future of the entertainment industry and creating new forms of interaction.',
            excerpt: 'A look into the future of AI entertainment and personalized content',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop&auto=format&q=80',
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
      'Technology': 'bg-blue-100 text-blue-700',
      'Tutorial': 'bg-green-100 text-green-700',
      'AI': 'bg-purple-100 text-purple-700',
      'News': 'bg-orange-100 text-orange-700',
      'Updates': 'bg-red-100 text-red-700'
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Blog & News
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Latest news, updates and articles about AI technology and entertainment
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <article
              key={post.id}
              className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <div className={`relative overflow-hidden ${index === 0 ? 'h-64 md:h-80' : 'h-48'}`}>
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
              </div>

              <div className={`p-6 ${index === 0 ? 'md:p-8' : ''}`}>
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

                <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors ${
                  index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                }`}>
                  {post.title}
                </h3>

                <p className={`text-gray-600 mb-4 line-clamp-3 ${
                  index === 0 ? 'text-lg' : 'text-base'
                }`}>
                  {post.excerpt}
                </p>

                <button className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors group">
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts Button */}
        <div className="text-center">
          <a 
            href="/blog"
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            All Blog Posts
            <ExternalLink className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;