import AIAssistant from "@/react-app/components/AIAssistant";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import HomerSimpson3D from "@/react-app/components/HomerSimpson3D";
import celebritiesData from "@/shared/celebrities.json";
import { Celebrity } from "@/shared/types";
import { useAuth } from "@getmocha/users-service/react";
import { ArrowLeft, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function CelebrityDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');
  const [customFormat, setCustomFormat] = useState('');
  const [showCustomFormat, setShowCustomFormat] = useState(false);
  const [description, setDescription] = useState('');

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const fetchCelebrity = () => {
      try {
        const celebrityId = parseInt(id || '0');
        const foundCelebrity = celebritiesData.find(c => c.id === celebrityId);
        
        if (foundCelebrity) {
          setCelebrity(foundCelebrity);
        } else {
          setCelebrity(null);
        }
      } catch (error) {
        console.error('Error fetching celebrity:', error);
        setCelebrity(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCelebrity();
  }, [id]);

  const handleContinue = () => {
    if (!user) {
      // Store project data and redirect to login
      sessionStorage.setItem('pendingProject', JSON.stringify({
        type: 'celebrity',
        celebrity_id: id || '',
        niche: selectedNiche,
        video_format: selectedFormat === 'custom' ? customFormat : selectedFormat,
        description,
      }));
      navigate('/');
      return;
    }

    // Store data for payment page
    sessionStorage.setItem('projectData', JSON.stringify({
      celebrity_id: id || '',
      niche: selectedNiche,
      video_format: selectedFormat === 'custom' ? customFormat : selectedFormat,
      description,
    }));

    navigate('/payment');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <Sparkles className="w-10 h-10 text-purple-600 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!celebrity) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Celebrity not found</h2>
            <button 
              onClick={() => navigate('/celebrities')}
              className="text-purple-600 hover:text-purple-700"
            >
              Back to Celebrities
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const parseNiches = (nichesJson: string): string[] => {
    try {
      return JSON.parse(nichesJson);
    } catch {
      return [];
    }
  };

  const videoFormats = [
    { id: 'greeting', name: 'Personal Greeting', icon: '👋', description: 'Warm personal message for special occasions' },
    { id: 'advertisement', name: 'Advertisement', icon: '📺', description: 'Promote your product or service professionally' },
    { id: 'announcement', name: 'Announcement', icon: '📢', description: 'Share important news or updates' },
    { id: 'educational', name: 'Educational', icon: '🎓', description: 'Informative content for learning' },
    { id: 'entertainment', name: 'Entertainment', icon: '🎬', description: 'Fun and engaging content' },
    { id: 'custom', name: 'Custom Format', icon: '✏️', description: 'Create your own video format' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/celebrities')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Celebrities</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left Side - 3D Character */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-4 h-96 relative overflow-hidden">
                <HomerSimpson3D onInteract={() => console.log('Homer interacted!')} />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg">
                  <p className="text-sm text-gray-600">Drag to rotate • Click Homer to interact</p>
                </div>
              </div>
              
              {/* Celebrity Info */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <img 
                    src={celebrity.image_url || undefined} 
                    alt={celebrity.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900">{celebrity.name}</h2>
                    <p className="text-purple-600 font-medium">{celebrity.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{celebrity.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">{celebrity.description}</p>
              </div>
            </div>

            {/* Right Side - Configuration */}
            <div className="space-y-8">
              
              {/* Niche Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Choose Video Purpose</h3>
                <div className="grid grid-cols-2 gap-3">
                  {parseNiches(celebrity.niches).map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedNiche === niche
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold">{niche}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Format Selection */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Video Format</h3>
                
                {/* Dropdown for format selection */}
                <div className="mb-4">
                  <select
                    value={selectedFormat}
                    onChange={(e) => {
                      setSelectedFormat(e.target.value);
                      if (e.target.value === 'custom') {
                        setShowCustomFormat(true);
                      } else {
                        setShowCustomFormat(false);
                        setCustomFormat('');
                      }
                    }}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none bg-white"
                  >
                    <option value="">Select video format...</option>
                    {videoFormats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.icon} {format.name} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom format input */}
                {showCustomFormat && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe your custom video format:
                    </label>
                    <textarea
                      value={customFormat}
                      onChange={(e) => setCustomFormat(e.target.value)}
                      placeholder="Example: Product showcase with testimonials and call-to-action..."
                      className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none h-24"
                    />
                  </div>
                )}

                {/* Selected format preview */}
                {selectedFormat && selectedFormat !== 'custom' && (
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">
                        {videoFormats.find(f => f.id === selectedFormat)?.icon}
                      </span>
                      <div>
                        <div className="font-semibold text-purple-900">
                          {videoFormats.find(f => f.id === selectedFormat)?.name}
                        </div>
                        <div className="text-sm text-purple-700">
                          {videoFormats.find(f => f.id === selectedFormat)?.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Project Description */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Project Description</h3>
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="flex items-center space-x-1 text-purple-600 text-sm hover:text-purple-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assist</span>
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video vision..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Demo Video Section */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Preview Sample Video</h3>
                <div className="bg-gray-100 rounded-xl p-6 text-center">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-2xl">🎬</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Sample Video with {celebrity.name}</h4>
                        <p className="text-sm text-gray-600">See how your video will look</p>
                      </div>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors">
                        ▶ Watch Preview
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    This is a sample video showing the quality and style you can expect from {celebrity.name}
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {user ? 'Continue to Pricing & Payment' : 'Sign In to Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant 
          onSuggestion={(suggestion) => {
            setDescription(suggestion);
            setShowAIAssistant(false);
          }}
          context={{
            celebrity: celebrity.name || undefined,
            niche: selectedNiche || undefined,
            format: selectedFormat || undefined
          }}
        />
      )}
    </div>
  );
}
