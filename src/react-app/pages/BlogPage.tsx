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
            title: 'AI Photography Revolution',
            content: `<p>Artificial intelligence is fundamentally changing the way we create and process photographs. New technologies allow for incredibly realistic image generation in seconds.</p>

<h2>What makes AI photography special?</h2>
<p>AI technologies open unlimited possibilities for creativity:</p>
<ul>
<li><strong>Instant creation</strong> - image generation in seconds</li>
<li><strong>Personalization</strong> - adaptation to your preferences</li>
<li><strong>High quality</strong> - professional results without experience</li>
</ul>

<h2>Industry applications</h2>
<p>From film industry to social media - AI photography is changing all areas of visual content.</p>`,
            excerpt: 'How AI technologies are transforming photography and video production',
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=500&fit=crop&auto=format&q=80',
            author: 'BrandedBy Team',
            publishedAt: '2025-11-06',
            category: 'Technology'
          },
          {
            id: 2,
            title: 'Creating Personal Videos with Celebrities',
            content: `<p>Learn how our platform allows you to create unique videos where you can interact with your favorite celebrities.</p>

<h2>Step-by-step process</h2>
<ol>
<li><strong>Upload selfie</strong> - quality face photo</li>
<li><strong>Choose celebrity</strong> - from our star database</li>
<li><strong>Configure settings</strong> - duration and video style</li>
<li><strong>Get result</strong> - HD video in minutes</li>
</ol>

<h2>Tips for best results</h2>
<p>For maximum realistic results, follow these recommendations:</p>
<ul>
<li>Use clear photo with good lighting</li>
<li>Face should be fully visible</li>
<li>Avoid sunglasses and covering accessories</li>
</ul>`,
            excerpt: 'Step-by-step guide to creating AI videos with selfies',
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=500&fit=crop&auto=format&q=80',
            author: 'Alex Johnson',
            publishedAt: '2025-11-05',
            category: 'Tutorial'
          },
          {
            id: 3,
            title: 'The Future of Entertainment: AI and Personalization',
            content: `<p>Exploring how artificial intelligence is shaping the future of the entertainment industry and creating new forms of interaction.</p>

<h2>AI Entertainment Trends</h2>
<p>The entertainment industry is experiencing a revolution thanks to AI:</p>

<h3>1. Personalized Content</h3>
<p>AI analyzes user preferences and creates unique content for everyone.</p>

<h3>2. Interactive Media</h3>
<p>Viewers become part of the story, influencing the plot in real time.</p>

<h3>3. Virtual Actors</h3>
<p>AI characters become increasingly realistic and emotional.</p>

<h2>What awaits us?</h2>
<p>In the near future we will see:</p>
<ul>
<li>Fully personalized movies</li>
<li>AI friends and companions</li>
<li>Interactive AR/VR worlds</li>
</ul>`,
            excerpt: 'A look into the future of AI entertainment and personalized content',
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
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
              Back to Blog
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
              BrandedBy Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              News, updates and articles about AI technology and entertainment
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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
                  <option value="">All Categories</option>
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
                          Read More
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">
                    No articles found for your search
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    Reset Filters
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