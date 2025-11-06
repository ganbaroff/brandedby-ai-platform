import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { 
  Users, 
  Video, 
  Plus, 
  Edit2, 
  Trash2,
  Save,
  X,
  Sparkles
} from "lucide-react";

interface Celebrity {
  id: number;
  name: string;
  role: string;
  description: string;
  image_url: string;
  niches: string;
  rating: number;
  popularity: number;
}

interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  is_azeri: boolean;
  preview_url: string;
}

export default function Admin() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [activeTab, setActiveTab] = useState<'celebrities' | 'templates'>('celebrities');
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Celebrity>>({});

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, isPending, navigate, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'celebrities') {
        const response = await fetch('/api/celebrities');
        const data = await response.json();
        if (data.success) {
          setCelebrities(data.data);
        }
      } else {
        const response = await fetch('/api/templates');
        const data = await response.json();
        if (data.success) {
          setTemplates(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: Celebrity) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveCelebrity = async () => {
    if (!editingId) return;
    
    try {
      // In a real app, this would be an API call
      console.log('Saving celebrity:', editForm);
      
      // Update local state
      setCelebrities(prev => prev.map(c => 
        c.id === editingId ? { ...c, ...editForm } as Celebrity : c
      ));
      
      cancelEdit();
    } catch (error) {
      console.error('Error saving celebrity:', error);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <Sparkles className="w-10 h-10 text-purple-600 animate-spin" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Manage celebrities and templates
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Tabs */}
          <div className="flex space-x-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('celebrities')}
              className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'celebrities'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>Celebrities ({celebrities.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center space-x-2 px-6 py-3 font-semibold transition-colors ${
                activeTab === 'templates'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Video className="w-5 h-5" />
              <span>Templates ({templates.length})</span>
            </button>
          </div>

          {/* Add New Button */}
          <div className="mb-8">
            <button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              <Plus className="w-5 h-5" />
              <span>Add New {activeTab === 'celebrities' ? 'Celebrity' : 'Template'}</span>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'celebrities' ? (
            <div className="space-y-4">
              {celebrities.map((celebrity) => (
                <div key={celebrity.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  {editingId === celebrity.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Name"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="text"
                          value={editForm.role || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                          placeholder="Role"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Description"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows={3}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="number"
                          step="0.1"
                          value={editForm.rating || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                          placeholder="Rating"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="number"
                          value={editForm.popularity || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, popularity: parseInt(e.target.value) }))}
                          placeholder="Popularity"
                          className="p-3 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={saveCelebrity}
                          className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={celebrity.image_url} 
                          alt={celebrity.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{celebrity.name}</h3>
                          <p className="text-purple-600 font-medium">{celebrity.role}</p>
                          <p className="text-sm text-gray-600 mt-1">{celebrity.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-600">Rating: {celebrity.rating}</span>
                            <span className="text-gray-600">Popularity: {celebrity.popularity}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEdit(celebrity)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <div key={template.id} className="bg-white rounded-2xl border border-gray-200 p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{template.name}</h3>
                      <p className="text-purple-600 font-medium">{template.category}</p>
                      <p className="text-sm text-gray-600 mt-2">{template.description}</p>
                    </div>
                    {template.is_azeri && (
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Azeri Template
                      </span>
                    )}
                    <div className="flex space-x-2 pt-4 border-t border-gray-100">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
