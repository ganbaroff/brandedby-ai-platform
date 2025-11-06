import { useState } from 'react';
import { Sparkles, Send, X } from 'lucide-react';

interface AIAssistantProps {
  onSuggestion?: (suggestion: string) => void;
  context?: {
    celebrity?: string;
    niche?: string;
    format?: string;
  };
}

const predefinedSuggestions = [
  "Create a professional business introduction video",
  "Make a fun birthday greeting for my friend",
  "Design an exciting product advertisement",
  "Generate an educational content piece",
  "Craft a motivational message for my team",
  "Create a wedding anniversary surprise video"
];

export default function AIAssistant({ onSuggestion, context }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);

  const generateContextualSuggestion = () => {
    const suggestions = [
      `Create a ${context?.niche?.toLowerCase() || 'business'} ${context?.format || 'video'} featuring ${context?.celebrity || 'the celebrity'} promoting sustainable practices and innovation`,
      `Make ${context?.celebrity || 'the celebrity'} deliver an inspiring message about achieving success in ${context?.niche?.toLowerCase() || 'your field'}`,
      `Design a ${context?.format || 'greeting'} where ${context?.celebrity || 'the celebrity'} shares personal insights about ${context?.niche?.toLowerCase() || 'business'} excellence`,
      `Generate a motivational ${context?.format || 'speech'} focusing on overcoming challenges in ${context?.niche?.toLowerCase() || 'your industry'}`,
      `Create an engaging ${context?.format || 'announcement'} where ${context?.celebrity || 'the celebrity'} discusses the future of ${context?.niche?.toLowerCase() || 'technology'}`
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestion = generateContextualSuggestion();
    
    setChatHistory(prev => [
      ...prev,
      { role: 'user', content: userInput || 'Generate a video idea' },
      { role: 'ai', content: suggestion }
    ]);
    
    onSuggestion?.(suggestion);
    setIsGenerating(false);
    setUserInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSuggestion?.(suggestion);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105"
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">AI Assist</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">AI Creative Assistant</h2>
              <p className="text-sm text-gray-600">Let AI help craft your perfect video script</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          
          {/* Quick Suggestions */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Ideas</h3>
            <div className="grid grid-cols-1 gap-2">
              {predefinedSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Conversation</h3>
              <div className="space-y-3">
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      message.role === 'user' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      {message.content}
                      {message.role === 'ai' && (
                        <button
                          onClick={() => handleSuggestionClick(message.content)}
                          className="block mt-2 text-xs text-purple-600 hover:text-purple-700 underline"
                        >
                          Use this suggestion
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 p-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your video vision..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => e.key === 'Enter' && !isGenerating && handleGenerate()}
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {context && (
            <div className="mt-3 text-xs text-gray-500">
              Context: {context.celebrity} • {context.niche} • {context.format}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
