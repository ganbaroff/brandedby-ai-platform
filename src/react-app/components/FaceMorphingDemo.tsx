import { Sparkles, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const FaceMorphingDemo = () => {
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Массив изображений лиц для демонстрации
  const demoFaces = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentFaceIndex((prev) => (prev + 1) % demoFaces.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);

    return () => clearInterval(interval);
  }, [demoFaces.length]);

  return (
    <div className="relative bg-gradient-to-br from-purple-100 to-blue-100 rounded-3xl p-8 overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="absolute top-20 right-16 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-16 left-20 w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">AI Face Generation</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Watch AI Create Unique Characters
          </h3>
          <p className="text-gray-600">
            Our advanced AI morphs and generates realistic faces in real-time
          </p>
        </div>

        {/* Face morphing container */}
        <div className="flex justify-center">
          <div className="relative">
            {/* Main face display */}
            <div className="relative w-48 h-48 mx-auto mb-6">
              <div className={`absolute inset-0 transition-all duration-300 ${isAnimating ? 'scale-110 blur-sm opacity-80' : 'scale-100 blur-0 opacity-100'}`}>
                <img
                  src={demoFaces[currentFaceIndex]}
                  alt="AI Generated Face"
                  className="w-full h-full rounded-full object-cover shadow-2xl border-4 border-white"
                />
              </div>
              
              {/* Animated ring */}
              <div className="absolute inset-0 rounded-full border-2 border-purple-400 animate-spin" style={{animationDuration: '8s'}}></div>
              
              {/* Processing overlay */}
              {isAnimating && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Preview thumbnails */}
            <div className="flex justify-center space-x-2">
              {demoFaces.map((face, index) => (
                <div 
                  key={index}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    index === currentFaceIndex 
                      ? 'border-purple-500 scale-110' 
                      : 'border-gray-300 opacity-60'
                  }`}
                >
                  <img
                    src={face}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Real-time Generation</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Unlimited Variations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaceMorphingDemo;