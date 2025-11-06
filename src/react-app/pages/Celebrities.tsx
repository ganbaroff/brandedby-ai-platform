import Footer from "@/react-app/components/Footer";
import Header from "@/react-app/components/Header";
import celebritiesData from "@/shared/celebrities.json";
import { Celebrity } from "@/shared/types";
import { Sparkles, Star, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function Celebrities() {
  const navigate = useNavigate();
  const [celebrities] = useState<Celebrity[]>(celebritiesData);
  const [loading] = useState(false);

  const parseNiches = (nichesJson: string): string[] => {
    try {
      return JSON.parse(nichesJson);
    } catch {
      return [];
    }
  };

  const getNicheColor = (niche: string) => {
    const colors: Record<string, string> = {
      'Business': 'bg-blue-100 text-blue-800',
      'Entertainment': 'bg-purple-100 text-purple-800',
      'Technology': 'bg-green-100 text-green-800',
      'Beauty': 'bg-pink-100 text-pink-800',
      'Fashion': 'bg-indigo-100 text-indigo-800',
      'Lifestyle': 'bg-orange-100 text-orange-800'
    };
    return colors[niche] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
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
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-purple-200 rounded-full px-4 py-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Choose Your Celebrity</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Azerbaijani 
              </span>{' '}
              Celebrities
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Select from our curated collection of 9 talented Azerbaijani celebrities 
              to create your personalized video content.
            </p>

            {/* Skip Option */}
            <button 
              onClick={() => navigate('/selfie-upload')}
              className="group inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              <Upload className="w-5 h-5" />
              <span>Skip Celebrity - Upload Your Selfie</span>
            </button>
          </div>
        </div>
      </section>

      {/* Celebrities Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {celebrities.map((celebrity) => (
              <div 
                key={celebrity.id}
                onClick={() => navigate(`/celebrity/${celebrity.id}`)}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={celebrity.image_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'} 
                    alt={celebrity.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rating */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{celebrity.rating}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {celebrity.name}
                    </h3>
                    <p className="text-lg text-purple-600 font-medium">
                      {celebrity.role}
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed line-clamp-2">
                    {celebrity.description}
                  </p>

                  {/* Niches */}
                  <div className="flex flex-wrap gap-2">
                    {parseNiches(celebrity.niches).map((niche) => (
                      <span 
                        key={niche}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getNicheColor(niche)}`}
                      >
                        {niche}
                      </span>
                    ))}
                  </div>

                  {/* Popularity */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        {celebrity.popularity}% popularity
                      </span>
                    </div>
                    <div className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                      Select →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-7xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Don't see your favorite celebrity?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your own selfie and become the star of your video
          </p>
          <button 
            onClick={() => navigate('/selfie-upload')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
          >
            Upload Your Selfie
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
