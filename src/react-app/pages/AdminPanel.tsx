import React, { useState, useEffect } from 'react';
import { User, Users, FileText, Plus, Edit, Trash2, Save, X, Upload, Image as ImageIcon, Download, RefreshCw, Database } from 'lucide-react';
import { DataPersistence, CelebrityManager, BlogManager, DevTools } from '@/shared/admin-data-utils';

interface Celebrity {
  id: number;
  name: string;
  image: string;
  description: string;
  category: string;
}

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

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'celebrities' | 'blog' | 'analytics'>('celebrities');
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  
  // Celebrity management states
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  const [showCelebrityForm, setShowCelebrityForm] = useState(false);
  const [newCelebrity, setNewCelebrity] = useState<Omit<Celebrity, 'id'>>({
    name: '',
    image: '',
    description: '',
    category: 'Actor'
  });

  // Blog management states
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    content: '',
    excerpt: '',
    image: '',
    author: '',
    publishedAt: new Date().toISOString().split('T')[0],
    category: 'News'
  });

  // Load data on component mount
  useEffect(() => {
    loadCelebrities();
    loadBlogPosts();
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
      setNewCelebrity({ name: '', image: '', description: '', category: 'Actor' });
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
  const savePost = () => {
    if (editingPost) {
      // Validate post data
      const validation = BlogManager.validatePost(editingPost);
      if (!validation.valid) {
        alert('Please fill in all required fields:\n' + validation.errors.join('\n'));
        return;
      }

      const updatedPosts = blogPosts.map(p => p.id === editingPost.id ? editingPost : p);
      setBlogPosts(updatedPosts);
      BlogManager.saveBlogPosts(updatedPosts);
      setEditingPost(null);
    } else {
      // Validate post data
      const validation = BlogManager.validatePost(newPost);
      if (!validation.valid) {
        alert('Please fill in all required fields:\n' + validation.errors.join('\n'));
        return;
      }

      const newId = BlogManager.generateNewId(blogPosts);
      const postToAdd = { ...newPost, id: newId };
      const updatedPosts = [...blogPosts, postToAdd];
      setBlogPosts(updatedPosts);
      BlogManager.saveBlogPosts(updatedPosts);
      setNewPost({
        title: '',
        content: '',
        excerpt: '',
        image: '',
        author: '',
        publishedAt: new Date().toISOString().split('T')[0],
        category: 'News'
      });
      setShowPostForm(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">BrandedBy Admin Panel</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('celebrities')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'celebrities'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="h-5 w-5 mr-2" />
                Celebrities
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'blog'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Blog
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="h-5 w-5 mr-2" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Celebrities Tab */}
        {activeTab === 'celebrities' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Celebrity Management</h2>
              <button
                onClick={() => setShowCelebrityForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Celebrity
              </button>
            </div>

            {/* Celebrity Form Modal */}
            {(showCelebrityForm || editingCelebrity) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input
                        type="url"
                        value={editingCelebrity ? editingCelebrity.image : newCelebrity.image}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, image: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, image: e.target.value });
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
                            setEditingCelebrity({ ...editingCelebrity, image: url });
                          } else {
                            setNewCelebrity({ ...newCelebrity, image: url });
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={editingCelebrity ? editingCelebrity.category : newCelebrity.category}
                        onChange={(e) => {
                          if (editingCelebrity) {
                            setEditingCelebrity({ ...editingCelebrity, category: e.target.value });
                          } else {
                            setNewCelebrity({ ...newCelebrity, category: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Actor">Actor</option>
                        <option value="Musician">Musician</option>
                        <option value="Athlete">Athlete</option>
                        <option value="Model">Model</option>
                        <option value="Influencer">Influencer</option>
                      </select>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {celebrities.map((celebrity) => (
                <div key={celebrity.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={celebrity.image}
                    alt={celebrity.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{celebrity.name}</h3>
                    <p className="text-sm text-blue-600 mb-2">{celebrity.category}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{celebrity.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCelebrity(celebrity)}
                        className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCelebrity(celebrity.id)}
                        className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Blog Management</h2>
              <button
                onClick={() => setShowPostForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Post
              </button>
            </div>

            {/* Blog Post Form Modal */}
            {(showPostForm || editingPost) && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {editingPost ? 'Edit Post' : 'Create New Post'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowPostForm(false);
                        setEditingPost(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        value={editingPost ? editingPost.title : newPost.title}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, title: e.target.value });
                          } else {
                            setNewPost({ ...newPost, title: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter post title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                      <input
                        type="text"
                        value={editingPost ? editingPost.excerpt : newPost.excerpt}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, excerpt: e.target.value });
                          } else {
                            setNewPost({ ...newPost, excerpt: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Brief description for preview"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                      <textarea
                        value={editingPost ? editingPost.content : newPost.content}
                        onChange={(e) => {
                          if (editingPost) {
                            setEditingPost({ ...editingPost, content: e.target.value });
                          } else {
                            setNewPost({ ...newPost, content: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows={8}
                        placeholder="Main post content (supports Markdown)"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                        <input
                          type="text"
                          value={editingPost ? editingPost.author : newPost.author}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, author: e.target.value });
                            } else {
                              setNewPost({ ...newPost, author: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Author name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                        <input
                          type="date"
                          value={editingPost ? editingPost.publishedAt : newPost.publishedAt}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, publishedAt: e.target.value });
                            } else {
                              setNewPost({ ...newPost, publishedAt: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          value={editingPost ? editingPost.category : newPost.category}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, category: e.target.value });
                            } else {
                              setNewPost({ ...newPost, category: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="News">News</option>
                          <option value="Technology">Technology</option>
                          <option value="Tutorial">Tutorial</option>
                          <option value="Updates">Updates</option>
                          <option value="AI">Artificial Intelligence</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                        <input
                          type="url"
                          value={editingPost ? editingPost.image : newPost.image}
                          onChange={(e) => {
                            if (editingPost) {
                              setEditingPost({ ...editingPost, image: e.target.value });
                            } else {
                              setNewPost({ ...newPost, image: e.target.value });
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Image URL"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={savePost}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setShowPostForm(false);
                        setEditingPost(null);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts List */}
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">{post.title}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{post.excerpt}</p>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>Author: {post.author}</span>
                        <span>Date: {new Date(post.publishedAt).toLocaleDateString('en-US')}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {post.image && (
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => setEditingPost(post)}
                          className="flex items-center px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => deletePost(post.id)}
                          className="flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Analytics & Statistics</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => DevTools.logStorageContents()}
                  className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
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
                  className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
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
                      {new Set(celebrities.map(c => c.category)).size}
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
                    acc[celebrity.category] = (acc[celebrity.category] || 0) + 1;
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
      </div>
    </div>
  );
};

export default AdminPanel;