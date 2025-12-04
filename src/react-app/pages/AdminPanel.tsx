// AdminPanel.tsx - cleaned version with proper data persistence
import { BlogManager, CelebrityManager, type BlogPost, type Celebrity } from '@/shared/admin-data-utils';
import { SecureAuth } from '@/shared/secure-auth';
import { Database, Edit, FileText, LogOut, Plus, Save, Shield, Trash2, User, Users, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import BackButton from '../components/BackButton';
import EnhancedImage from '../components/EnhancedImage';
import ScrollProgressIndicator from '../components/ScrollProgressIndicator';
import SecureAdminLogin from '../components/SecureAdminLogin';

const AdminPanel: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [activeTab, setActiveTab] = useState<'celebrities' | 'blog' | 'analytics' | 'dashboard' | 'performance'>('celebrities');

  // Bulk operations state
  const [showBulkOperations, setShowBulkOperations] = useState<{ show: boolean; type: 'celebrities' | 'blog'; data: Celebrity[] | BlogPost[] }>({ show: false, type: 'celebrities', data: [] });

  // Data state
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Celebrity management
  const [editingCelebrity, setEditingCelebrity] = useState<Celebrity | null>(null);
  const [showCelebrityForm, setShowCelebrityForm] = useState(false);
  const [newCelebrity, setNewCelebrity] = useState<Omit<Celebrity, 'id'>>({
    name: '',
    role: '',
    description: '',
    image_url: '',
    region: 'international',
    niches: '["Entertainment"]',
    rating: 9.0,
    popularity: 90,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Blog management
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showPostForm, setShowPostForm] = useState(false);

  // Authentication check on mount
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = SecureAuth.validateSession();
      setIsAuthenticated(isLoggedIn);
      setIsCheckingAuth(false);
      if (isLoggedIn) {
        await loadCelebrities();
        await loadBlogPosts();
      }
    };
    checkAuth();
  }, []);

  // Load data helpers
  const loadCelebrities = async () => {
    const stored = await CelebrityManager.loadCelebrities();
    setCelebrities(stored);
  };

  const loadBlogPosts = async () => {
    const posts = await BlogManager.loadBlogPosts();
    setBlogPosts(posts);
  };

  // Save helpers
  const saveCelebrity = async () => {
    try {
      if (editingCelebrity) {
        await CelebrityManager.updateCelebrity(editingCelebrity);
      } else {
        await CelebrityManager.addCelebrity(newCelebrity);
        // Reset new celebrity form
        setNewCelebrity({
          name: '',
          role: '',
          description: '',
          image_url: '',
          region: 'international',
          niches: '["Entertainment"]',
          rating: 9.0,
          popularity: 90,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      await loadCelebrities();
      setShowCelebrityForm(false);
      setEditingCelebrity(null);
    } catch (error) {
      console.error("Failed to save celebrity:", error);
      alert("Failed to save celebrity");
    }
  };

  const deleteCelebrity = async (id: number) => {
    if (confirm('Are you sure you want to delete this celebrity?')) {
      await CelebrityManager.deleteCelebrity(id);
      await loadCelebrities();
    }
  };

  const deletePost = async (id: number) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await BlogManager.deleteBlogPost(id);
      await loadBlogPosts();
    }
  };

  const generateImageUrl = (query: string) => {
    return `https://images.unsplash.com/photo-${Date.now()}?w=400&h=400&fit=crop&crop=face&auto=format&q=80&sig=${encodeURIComponent(query)}`;
  };

  // Login / logout handlers
  const handleLoginSuccess = async () => {
    setIsAuthenticated(true);
    await loadCelebrities();
    await loadBlogPosts();
  };

  const handleLogout = () => {
    SecureAuth.logout();
    setIsAuthenticated(false);
  };

  // UI rendering (trimmed for brevity)
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SecureAdminLogin onLogin={handleLoginSuccess} />;
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <BackButton variant="floating" fallbackRoute="/" />
      <ScrollProgressIndicator position="right" showPercentage={false} />
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-6 space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
              <h1 className="text-3xl font-bold text-gray-900">BrandedBy Admin Panel</h1>
              <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                <Shield className="h-4 w-4" />
                <span>Admin: {SecureAuth.getCurrentSession()?.username || 'Unknown'}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200">
            <nav className="flex space-x-8 pt-4 pb-2">
              <button onClick={() => setActiveTab('celebrities')} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'celebrities' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Users className="h-5 w-5 mr-2" />Celebrities
              </button>
              <button onClick={() => setActiveTab('blog')} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'blog' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                <FileText className="h-5 w-5 mr-2" />Blog Posts
              </button>
              <button onClick={() => setActiveTab('analytics')} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'analytics' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                <User className="h-5 w-5 mr-2" />Analytics
              </button>
              <button onClick={() => setActiveTab('dashboard')} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Database className="h-5 w-5 mr-2" />Dashboard
              </button>
              <button onClick={() => setActiveTab('performance')} className={`flex items-center px-4 py-2 rounded-lg transition-colors ${activeTab === 'performance' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
                <Shield className="h-5 w-5 mr-2" />Performance
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
                <button onClick={() => setShowBulkOperations({ show: true, type: 'celebrities', data: celebrities })} className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full sm:w-auto">
                  <Database className="h-5 w-5 mr-2" />Bulk Operations
                </button>
                <button onClick={() => setShowCelebrityForm(true)} className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                  <Plus className="h-5 w-5 mr-2" />Add Celebrity
                </button>
              </div>
            </div>
            {/* Celebrity Form Modal */}
            {showCelebrityForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{editingCelebrity ? 'Edit Celebrity' : 'Add New Celebrity'}</h3>
                    <button onClick={() => { setShowCelebrityForm(false); setEditingCelebrity(null); }} className="text-gray-500 hover:text-gray-700" title="Close" aria-label="Close">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input type="text" value={editingCelebrity ? editingCelebrity.name : newCelebrity.name} onChange={e => editingCelebrity ? setEditingCelebrity({ ...editingCelebrity, name: e.target.value }) : setNewCelebrity({ ...newCelebrity, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="Celebrity Name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role/Profession</label>
                      <input type="text" value={editingCelebrity ? editingCelebrity.role : newCelebrity.role} onChange={e => editingCelebrity ? setEditingCelebrity({ ...editingCelebrity, role: e.target.value }) : setNewCelebrity({ ...newCelebrity, role: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Actor & Producer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                      <input type="url" value={editingCelebrity ? (editingCelebrity.image_url ?? '') : (newCelebrity.image_url ?? '')} onChange={e => editingCelebrity ? setEditingCelebrity({ ...editingCelebrity, image_url: e.target.value }) : setNewCelebrity({ ...newCelebrity, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-5" placeholder="https://images.unsplash.com/..." />
                      <button onClick={() => {
                        const name = editingCelebrity ? editingCelebrity.name : newCelebrity.name;
                        const url = generateImageUrl(name);
                        if (editingCelebrity) setEditingCelebrity({ ...editingCelebrity, image_url: url }); else setNewCelebrity({ ...newCelebrity, image_url: url });
                      }} className="mt-2 text-sm text-blue-600 hover:text-blue-700">Auto-generate URL</button>
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button onClick={saveCelebrity} className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        <Save className="h-4 w-4 mr-2" />Save
                      </button>
                      <button onClick={() => { setShowCelebrityForm(false); setEditingCelebrity(null); }} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Celebrities Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {celebrities.map(celebrity => (
                <div key={celebrity.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <EnhancedImage src={celebrity.image_url} alt={celebrity.name} className="w-full h-40 sm:h-48 object-cover" height="192" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">{celebrity.name}</h3>
                    <p className="text-sm text-gray-700 mb-2 font-medium">{celebrity.role}</p>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">{celebrity.description}</p>
                    <div className="flex space-x-2">
                      <button onClick={() => setEditingCelebrity(celebrity)} className="flex items-center justify-center px-3 py-2 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors flex-1">
                        <Edit className="h-4 w-4 mr-1" />Edit
                      </button>
                      <button onClick={() => deleteCelebrity(celebrity.id)} className="flex items-center justify-center px-3 py-2 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex-1">
                        <Trash2 className="h-4 w-4 mr-1" />Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Blog Tab (placeholder) */}
        {activeTab === 'blog' && (
          <div>
            {/* Blog management UI would go here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;