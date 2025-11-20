import { BlogManager, CelebrityManager, DataPersistence, DevTools, type BlogPost, type Celebrity } from '@/shared/admin-data-utils';
import { SecureAuth } from '@/shared/secure-auth';
import { Database, Download, Edit, FileText, Image as ImageIcon, LogOut, Plus, RefreshCw, Save, Shield, Trash2, Upload, User, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import BlogEditor from '../components/BlogEditor';
import BulkOperations from '../components/BulkOperations';
import EnhancedImage from '../components/EnhancedImage';
import PerformanceDashboard from '../components/PerformanceDashboard';
import SecureAdminLogin from '../components/SecureAdminLogin';

const AdminPanel: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'celebrities' | 'blog' | 'analytics' | 'dashboard' | 'performance'>('celebrities');
  
  // Bulk operations state
  const [showBulkOperations, setShowBulkOperations] = useState<{
    show: boolean;
    type: 'celebrities' | 'blog';
    data: Celebrity[] | BlogPost[];
  }>({ show: false, type: 'celebrities', data: [] });
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  // Celebrity management states
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  const [showCelebrityForm, setShowCelebrityForm] = useState(false);
  const [newCelebrity, setNewCelebrity] = useState<Omit<Celebrity, 'id'>>({
    name: '',
    role: '',
    description: '',
    image_url: '',
    niches: '["Entertainment"]',
    rating: 9.0,
    popularity: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Blog management states
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Checking authentication...');
      const isLoggedIn = SecureAuth.validateSession();
      console.log('🔐 Authentication status:', isLoggedIn);
      
      if (isLoggedIn) {
        const sessionInfo = SecureAuth.getCurrentSession();
        console.log('👤 Session info:', sessionInfo);
      }
      
      setIsAuthenticated(isLoggedIn);
      setIsCheckingAuth(false);
      
      if (isLoggedIn) {
        loadCelebrities();
        loadBlogPosts();
      }
    };

    checkAuth();
  }, []);

  const loadCelebrities = async () => {
    try {
      // Try to load from JSON file first, then fallback to localStorage
      const response = await fetch('/src/shared/celebrities.json');
      if (response.ok) {
        const data = await response.json();
        setCelebrities(data);
      } else {
        throw new Error('JSON file not found');
      }
    } catch {
      console.log('Loading celebrities from localStorage...');
      const celebrities = CelebrityManager.loadCelebrities();
      setCelebrities(celebrities);
    }
  };

  const loadBlogPosts = () => {
    const posts = BlogManager.loadBlogPosts();
    setBlogPosts(posts);
  };

  // Celebrity CRUD operations
  const saveCelebrity = () => {
    if (editingCelebrity) {
      setCelebrities(prev => prev.map(c => c.id === editingCelebrity.id ? editingCelebrity : c));
      setEditingCelebrity(null);
    } else {
      const newId = Math.max(...celebrities.map(c => c.id), 0) + 1;
      const celebrityToAdd = { ...newCelebrity, id: newId };
      setCelebrities(prev => [...prev, celebrityToAdd]);
      setNewCelebrity({
        name: '',
        role: '',
        description: '',
        image_url: '',
        niches: '["Entertainment"]',
        rating: 9.0,
        popularity: 90,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      setShowCelebrityForm(false);
    }
    
    // Save to JSON file (in real app, this would be an API call)
    saveCelebritiesToFile();
  };

  const deleteCelebrity = (id: number) => {
    if (confirm('Are you sure you want to delete this celebrity?')) {
      setCelebrities(prev => prev.filter(c => c.id !== id));
      saveCelebritiesToFile();
    }
  };

  const saveCelebritiesToFile = () => {
    const success = CelebrityManager.saveCelebrities(celebrities);
    if (success) {
      console.log('✅ Celebrities saved successfully');
    } else {
      console.error('❌ Failed to save celebrities');
    }
  };

  // Blog CRUD operations
  const deletePost = (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const updatedPosts = blogPosts.filter(p => p.id !== id);
      setBlogPosts(updatedPosts);
      BlogManager.saveBlogPosts(updatedPosts);
    }
  };

  const generateImageUrl = (query: string) => {
    return `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop&crop=face&auto=format&q=80&sig=${encodeURIComponent(query)}`;
  };

  // Handle login success
  const handleLoginSuccess = () => {
    console.log('🎉 Login success callback called');
    setIsAuthenticated(true);
    loadCelebrities();
    loadBlogPosts();
  };

  // Handle logout
  const handleLogout = () => {
    SecureAuth.logout();
    setIsAuthenticated(false);
  };

  // Show loading screen while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <SecureAdminLogin onLogin={handleLoginSuccess} />;
  }

  // Main admin panel (authenticated users only)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 space-y-4 lg:space-y-0">
            {/* Title and User Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h1 className="text-3xl font-bold text-gray-900">BrandedBy Admin Panel</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4" />
                <span>Admin: {SecureAuth.getCurrentSession()?.username || 'Unknown'}</span>
              </div>
            </div>
            
            {/* Logout Button - Top Right */}
            <div className="flex justify-end">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          
          {/* Navigation Tabs - Separate Row */}
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 pt-4 pb-2">
              <button
                onClick={() => setActiveTab('celebrities')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'celebrities'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Celebrities
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'blog'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Blog Posts
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <User className="h-5 w-5 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Database className="h-5 w-5 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'performance'
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Shield className="h-5 w-5 mr-2" />
                Performance
              </button>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Celebrities Tab */}
        {activeTab === 'celebrities' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-semibold text-gray-900">Celebrity Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setShowBulkOperations({
                    show: true,
                    type: 'celebrities',
                    data: celebrities
                  })}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
                >
                  <Database className="h-5 w-5 mr-2" />
                  Bulk Operations
                </button>
                <button
                  onClick={() => setShowCelebrityForm(true)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Celebrity
                </button>
              </div>
            </div>

            {/* Celebrity Form Modal */}
            {(showCelebrityForm || editingCelebrity) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingCelebrity ? 'Edit Celebrity' : 'Add Celebrity'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowCelebrityForm(false);
                        setEditingCelebrity(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingCelebrity ? editingCelebrity.name : newCelebrity.name}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, name: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, name: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter celebrity name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role/Profession</label>
                      <input
                        type="text"
                        value={editingCelebrity ? editingCelebrity.role : newCelebrity.role}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, role: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, role: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Actor & Producer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={editingCelebrity ? editingCelebrity.image_url : newCelebrity.image_url}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, image_url: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, image_url: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://images.unsplash.com/..."
                      />
                      <button
                        onClick={() => {
                          const name = editingCelebrity ? editingCelebrity.name : newCelebrity.name;
                          const url = generateImageUrl(name);
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, image_url: url });
                          } else {
                            setNewCelebrity({ ...newCelebrity, image_url: url });
                          }
                        }}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        Auto-generate URL
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editingCelebrity ? editingCelebrity.description : newCelebrity.description}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, description: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, description: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                        placeholder="Brief celebrity description"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editingCelebrity ? editingCelebrity.niches : newCelebrity.niches}
                          onChange={(e) => {
                            if (editingCelebrity) {
                              setEditingCelebrity({ ...editingCelebrity, niches: e.target.value });
                            } else {
                              setNewCelebrity({ ...newCelebrity, niches: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder='["Entertainment", "Business"]'
                        />
                        <p className="text-xs text-gray-500">
                          Common categories: Entertainment, Business, Sports, Technology, Fashion, Beauty, Fitness, Activism, Music, Comedy
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {['Entertainment', 'Business', 'Sports', 'Technology', 'Fashion', 'Beauty', 'Fitness', 'Activism', 'Music', 'Comedy'].map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => {
                                const current = editingCelebrity ? editingCelebrity.niches : newCelebrity.niches;
                                try {
                                  const currentNiches = JSON.parse(current || '[]');
                                  const newNiches = currentNiches.includes(cat) 
                                    ? currentNiches.filter((n: string) => n !== cat)
                                    : [...currentNiches, cat];
                                  const newValue = JSON.stringify(newNiches);
                                  
                                  if (editingCelebrity) {
                                    setEditingCelebrity({ ...editingCelebrity, niches: newValue });
                                  } else {
                                    setNewCelebrity({ ...newCelebrity, niches: newValue });
                                  }
                                } catch {
                                  // Handle invalid JSON
                                  const newValue = JSON.stringify([cat]);
                                  if (editingCelebrity) {
                                    setEditingCelebrity({ ...editingCelebrity, niches: newValue });
                                  } else {
                                    setNewCelebrity({ ...newCelebrity, niches: newValue });
                                  }
                                }
                              }}
                              className={`px-2 py-1 text-xs rounded-full border ${
                                (() => {
                                  try {
                                    const current = editingCelebrity ? editingCelebrity.niches : newCelebrity.niches;
                                    const niches = JSON.parse(current || '[]');
                                    return niches.includes(cat) 
                                      ? 'bg-blue-100 text-blue-700 border-blue-200' 
                                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200';
                                  } catch {
                                    return 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200';
                                  }
                                })()
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-10)</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          step="0.1"
                          value={editingCelebrity ? editingCelebrity.rating : newCelebrity.rating}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value);
                            if (editingCelebrity) {
                              setEditingCelebrity({ ...editingCelebrity, rating: value });
                            } else {
                              setNewCelebrity({ ...newCelebrity, rating: value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Popularity (1-100)</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={editingCelebrity ? editingCelebrity.popularity : newCelebrity.popularity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (editingCelebrity) {
                              setEditingCelebrity({ ...editingCelebrity, popularity: value });
                            } else {
                              setNewCelebrity({ ...newCelebrity, popularity: value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={saveCelebrity}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowCelebrityForm(false);
                        setEditingCelebrity(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Celebrities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {celebrities.map((celebrity) => (
                <div key={celebrity.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <EnhancedImage
                    src={celebrity.image_url}
                    alt={celebrity.name}
                    className="w-full h-40 sm:h-48 object-cover"
                    height="192"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900 truncate flex-1">{celebrity.name}</h3>
                      <div className="flex items-center ml-2">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm text-gray-600 ml-1">{celebrity.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 font-medium">{celebrity.role}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(() => {
                        try {
                          const niches = JSON.parse(celebrity.niches || '[]');
                          return niches.slice(0, 3).map((niche: string, index: number) => (
                            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              {niche}
                            </span>
                          ));
                        } catch {
                          return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">Entertainment</span>;
                        }
                      })()}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{celebrity.description}</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <button
                        onClick={() => setEditingCelebrity(celebrity)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCelebrity(celebrity.id)}
                        className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex-1"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-semibold text-gray-900">Blog Management</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setShowBulkOperations({
                    show: true,
                    type: 'blog',
                    data: blogPosts
                  })}
                  className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto"
                >
                  <Database className="h-5 w-5 mr-2" />
                  Bulk Operations
                </button>
                <button
                  onClick={() => setShowPostForm(true)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Post
                </button>
              </div>
            </div>

            {/* Blog Editor Modal */}
            {(showPostForm || editingPost) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-4 md:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <BlogEditor
                    initialData={editingPost || undefined}
                    isLoading={false}
                    onSave={(data) => {
                      try {
                        if (editingPost) {
                          const updated: typeof editingPost = {
                            id: editingPost.id,
                            title: data.title,
                            content: data.content,
                            excerpt: data.excerpt,
                            image_url: data.image_url,
                            author: data.author,
                            publishedAt: data.publishedAt,
                            category: data.category,
                          };
                          BlogManager.updateBlogPost(updated);
                        } else {
                          BlogManager.addBlogPost(data);
                        }
                        loadBlogPosts();
                        setShowPostForm(false);
                        setEditingPost(null);
                      } catch (error) {
                        console.error('Error saving blog post:', error);
                        alert('Failed to save blog post. Please try again.');
                      }
                    }}
                    onCancel={() => {
                      setShowPostForm(false);
                      setEditingPost(null);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Blog Posts List */}
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 space-y-2 sm:space-y-0">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 break-words">{post.title}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full inline-block w-fit">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3 text-sm md:text-base line-clamp-2">{post.excerpt}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 space-y-1 sm:space-y-0 sm:space-x-4">
                        <span className="font-medium">Author: {post.author}</span>
                        <span>Published: {new Date(post.publishedAt).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 sm:ml-4">
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full sm:w-20 md:w-24 h-24 sm:h-16 md:h-20 object-cover rounded-lg"
                        />
                      )}
                      <div className="flex flex-row sm:flex-col gap-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors flex-1 sm:flex-none"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex-1 sm:flex-none"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
              <h2 className="text-2xl font-semibold text-gray-900">Analytics & Statistics</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => DevTools.logStorageContents()}
                  className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors w-full sm:w-auto"
                >
                  <Database className="h-4 w-4 mr-1" />
                  Debug Storage
                </button>
                <button
                  onClick={() => {
                    const data = DataPersistence.exportData();
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `brandedby-backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                  }}
                  className="flex items-center justify-center px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors w-full sm:w-auto"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export Data
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Celebrities</p>
                    <p className="text-3xl font-bold text-blue-600">{celebrities.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                    <p className="text-3xl font-bold text-green-600">{blogPosts.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-green-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Categories</p>
                    <p className="text-3xl font-bold text-purple-600">
                      {new Set(celebrities.flatMap(c => {
                        try { return JSON.parse(c.niches); } catch { return []; }
                      })).size}
                    </p>
                  </div>
                  <ImageIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Storage Used</p>
                    <p className="text-sm font-bold text-orange-600">
                      {DataPersistence.getStorageStats().storageUsed}
                    </p>
                  </div>
                  <Upload className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Data Persistence Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Storage Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Auto-Save Status</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="text-xs text-green-600">All changes saved automatically</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-700">Last Save</span>
                    <Database className="h-4 w-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-blue-600">
                    {DataPersistence.getStorageStats().lastSave 
                      ? new Date(DataPersistence.getStorageStats().lastSave!).toLocaleString('en-US')
                      : 'No saves yet'
                    }
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Data Location</span>
                    <RefreshCw className="h-4 w-4 text-purple-500" />
                  </div>
                  <p className="text-xs text-purple-600">Browser localStorage</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-700">
                  <strong>Note:</strong> Data is stored locally in your browser. For production use, connect to a database API.
                  You can export your data as backup using the Export button above.
                </p>
              </div>
            </div>

            {/* Category distribution */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Celebrity Distribution by Category</h3>
              <div className="space-y-3">
                {Object.entries(
                  celebrities.reduce((acc, celebrity) => {
                    try {
                      const niches = JSON.parse(celebrity.niches || '[]');
                      niches.forEach((niche: string) => {
                        acc[niche] = (acc[niche] || 0) + 1;
                      });
                    } catch {
                      acc['Entertainment'] = (acc['Entertainment'] || 0) + 1;
                    }
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-200 rounded-full w-32 h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(count / celebrities.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
              <div className="space-y-3">
                {blogPosts
                  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
                  .slice(0, 5)
                  .map((post) => (
                    <div key={post.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div>
                        <p className="font-medium text-gray-900">{post.title}</p>
                        <p className="text-sm text-gray-600">Author: {post.author}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <AnalyticsDashboard 
              data={{
                celebrities,
                blogPosts
              }}
            />
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div>
            <PerformanceDashboard />
          </div>
        )}

        {/* Bulk Operations Modal */}
        {showBulkOperations.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {showBulkOperations.type === 'celebrities' ? 'Celebrity' : 'Blog Post'} Bulk Operations
                </h2>
                <button
                  onClick={() => setShowBulkOperations({ show: false, type: 'celebrities', data: [] })}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <BulkOperations
                items={showBulkOperations.data}
                selectedItems={[]}
                onSelectionChange={() => {}}
                onBulkDelete={(items) => {
                  if (showBulkOperations.type === 'celebrities') {
                    const itemIds = items.map(item => (item as Celebrity).id);
                    const updatedCelebrities = celebrities.filter(c => !itemIds.includes(c.id));
                    setCelebrities(updatedCelebrities);
                    CelebrityManager.saveCelebrities(updatedCelebrities);
                  } else {
                    const itemIds = items.map(item => (item as BlogPost).id);
                    const updatedPosts = blogPosts.filter(p => !itemIds.includes(p.id));
                    setBlogPosts(updatedPosts);
                    BlogManager.saveBlogPosts(updatedPosts);
                  }
                  setShowBulkOperations({ show: false, type: 'celebrities', data: [] });
                }}
                getItemId={(item) => showBulkOperations.type === 'celebrities' ? (item as Celebrity).id : (item as BlogPost).id}
                getItemTitle={(item) => showBulkOperations.type === 'celebrities' ? (item as Celebrity).name : (item as BlogPost).title}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;