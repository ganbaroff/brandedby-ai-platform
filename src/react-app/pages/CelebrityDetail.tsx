import AIAssistant from "@/react-app/components/AIAssistant";
import BackButton from "@/react-app/components/BackButton";
import CelebrityBiography from "@/react-app/components/CelebrityBiography";
import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import ScrollProgressIndicator from "@/react-app/components/ScrollProgressIndicator";
import VideoFormatSelectorCompact from "@/react-app/components/VideoFormatSelectorCompact";
import { useAuth } from "@/react-app/contexts/AuthContext";
import { CelebrityManager } from "@/shared/admin-data-utils";
import { Celebrity } from "@/shared/types";
import { ArrowLeft, BookOpen, Briefcase, Sparkles, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function CelebrityDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [celebrity, setCelebrity] = useState<Celebrity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('instagram-story');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'biography'>('overview');

  const [showAIAssistant, setShowAIAssistant] = useState(false);

  useEffect(() => {
    const fetchCelebrity = async () => {
      try {
        const celebrityId = parseInt(id || '0');
        const foundCelebrity = await CelebrityManager.getCelebrityById(celebrityId);
        
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
        video_format: selectedFormat,
        description,
      }));
      navigate('/');
      return;
    }

    // Store data for payment page
    sessionStorage.setItem('projectData', JSON.stringify({
      celebrity_id: id || '',
      niche: selectedNiche,
      video_format: selectedFormat,
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

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BackButton variant="floating" fallbackRoute="/celebrities" />
      <ScrollProgressIndicator position="right" showPercentage={false} />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Back Button */}
          <button 
            onClick={() => navigate('/celebrities')}
            className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm sm:text-base">Back to Celebrities</span>
          </button>

          {/* Tab Navigation */}
          <div className="flex space-x-2 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <Briefcase className="w-5 h-5" />
              <span>Обзор</span>
            </button>
            <button
              onClick={() => setActiveTab('biography')}
              className={`flex items-center space-x-2 px-4 sm:px-6 py-3 font-semibold transition-all ${
                activeTab === 'biography'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              <span>Биография</span>
            </button>
          </div>

          {activeTab === 'overview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Side - 3D Character */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 h-80 sm:h-96 relative overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="w-16 h-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Video Preview</h3>
                  <p className="text-gray-600">Your video will appear here after generation</p>
                </div>
              </div>
              
              {/* Celebrity Info */}
              <div className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-100">
                <div className="flex items-start space-x-4">
                  <img 
                    src={celebrity.image_url || undefined} 
                    alt={celebrity.name}
                    className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{celebrity.name}</h2>
                    <p className="text-purple-600 font-medium text-sm sm:text-base truncate">{celebrity.role}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      <span className="text-sm font-medium">{celebrity.rating}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base mt-4 leading-relaxed line-clamp-3">{celebrity.description}</p>
              </div>
            </div>

            {/* Right Side - Configuration */}
            <div className="space-y-8">
              
              {/* Niche Selection */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Choose Video Purpose</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {parseNiches(celebrity.niches).map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 text-left transition-all text-sm sm:text-base ${
                        selectedNiche === niche
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <div className="font-semibold truncate">{niche}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Format Selection */}
              <VideoFormatSelectorCompact
                selectedFormat={selectedFormat}
                onFormatChange={setSelectedFormat}
              />

              {/* Project Description */}
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">Project Description</h3>
                  <button 
                    onClick={() => setShowAIAssistant(true)}
                    className="flex items-center space-x-1 text-purple-600 text-xs sm:text-sm hover:text-purple-700 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>AI Assist</span>
                  </button>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video vision..."
                  className="w-full h-32 p-3 sm:p-4 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              {/* Demo Video Section */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Preview Sample Video</h3>
                <div className="bg-gray-100 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
                  <div className="aspect-video bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center space-y-3 px-4">
                      <div className="w-14 sm:w-16 h-14 sm:h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-xl sm:text-2xl">🎬</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Sample Video with {celebrity.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">See how your video will look</p>
                      </div>
                      <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm sm:text-base">
                        ▶ Watch Preview
                      </button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    This is a sample video showing the quality and style you can expect from {celebrity.name}
                  </p>
                </div>
              </div>

              {/* Continue Button */}
              <button 
                onClick={handleContinue}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                {user ? 'Continue to Pricing & Payment' : 'Sign In to Continue'}
              </button>
            </div>
          </div>
          ) : (
            <CelebrityBiography celebrity={celebrity} />
          )}
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
