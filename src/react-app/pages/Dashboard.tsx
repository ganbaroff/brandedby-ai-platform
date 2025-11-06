import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@getmocha/users-service/react";
import Header from "@/react-app/components/Header";
import Footer from "@/react-app/components/Footer";
import { 
  Video, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Download,
  Plus,
  Sparkles
} from "lucide-react";

interface Project {
  id: number;
  celebrity_id: number | null;
  template_id: number | null;
  package_type: string;
  video_format: string | null;
  niche: string | null;
  description: string | null;
  status: string;
  selfie_url: string | null;
  created_at: string;
  celebrity_name?: string;
  template_name?: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, isPending } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !user) {
      navigate('/');
      return;
    }

    if (user) {
      fetchProjects();
    }
  }, [user, isPending, navigate]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'processing':
        return <Clock className="w-5 h-5 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
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
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
            <div>
              <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Your Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.google_user_data.given_name || 'Creator'}!
              </h1>
              <p className="text-xl text-gray-600">
                Manage your video projects and track their progress
              </p>
            </div>
            
            <button
              onClick={() => navigate('/celebrities')}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>New Project</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {[
              { label: 'Total Projects', value: projects.length, color: 'text-blue-600' },
              { label: 'Completed', value: projects.filter(p => p.status === 'completed').length, color: 'text-green-600' },
              { label: 'Processing', value: projects.filter(p => p.status === 'processing').length, color: 'text-yellow-600' },
              { label: 'Pending', value: projects.filter(p => p.status === 'pending').length, color: 'text-purple-600' }
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className={`text-3xl font-bold ${stat.color} mb-1`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects List */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Projects</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-6">Start creating amazing videos with celebrities or your own selfie</p>
              <button
                onClick={() => navigate('/celebrities')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transition-all"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Video className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold text-lg">
                            {project.celebrity_name || project.template_name || 'Custom Video'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {project.description || 'No description provided'}
                        </p>
                      </div>
                      
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.package_type && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {project.package_type}
                        </span>
                      )}
                      {project.niche && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                          {project.niche}
                        </span>
                      )}
                      {project.video_format && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {project.video_format}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        Created {new Date(project.created_at).toLocaleDateString()}
                      </div>
                      
                      {project.status === 'completed' && (
                        <button className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium">
                          <Download className="w-4 h-4" />
                          <span>Download</span>
                        </button>
                      )}
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
