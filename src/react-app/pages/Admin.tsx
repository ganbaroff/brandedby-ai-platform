import BackButton from "@/react-app/components/BackButton";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import ScrollProgressIndicator from "@/react-app/components/ScrollProgressIndicator";
import { BlogManager, type BlogPost } from "@/shared/admin-data-utils";
import { useAuth } from "@/react-app/contexts/AuthContext";
import {
    Sparkles
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const [activeTab, setActiveTab] = useState<'celebrities' | 'templates' | 'blog' | 'analytics' | 'api-config'>('celebrities');
  const [celebrities, setCelebrities] = useState<Celebrity[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Celebrity>>({});
  // Blog state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showBlogEditor, setShowBlogEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'celebrities') {
        const response = await fetch('/api/celebrities');
        const data = await response.json();
        if (data.success) {
          setCelebrities(data.data);
        }
      } else if (activeTab === 'templates') {
        const response = await fetch('/api/templates');
        const data = await response.json();
        if (data.success) {
          setTemplates(data.data);
        }
      } else if (activeTab === 'blog') {
        // Local storage for blog
        try {
          const posts = await BlogManager.loadBlogPosts();
          setBlogPosts(posts);
        } catch (err) {
          console.error('Failed loading blog posts in admin fetchData', err);
          setBlogPosts([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    if (!user && !isPending) {
      navigate('/');
      return;
    }
    if (user && activeTab !== 'analytics' && activeTab !== 'api-config') {
      fetchData();
    }
  }, [user, isPending, navigate, activeTab, fetchData]);

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
  }

  if (isPending || loading) {
    return (
      <>
        <div className="min-h-screen bg-white">
          <Header />
          <div className="pt-24 pb-16">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-center min-h-[400px]">
                <Sparkles className="w-10 h-10 text-purple-600 animate-spin" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackButton variant="floating" />
      <ScrollProgressIndicator position="right" showPercentage={false} />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          <p>This page is under construction. Please use the new <a href="/admin-panel" className="text-blue-600 hover:underline">Admin Panel</a>.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
