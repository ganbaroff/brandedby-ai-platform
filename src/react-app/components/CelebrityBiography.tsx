import { Celebrity } from "@/shared/types";
import { Award, Calendar, TrendingUp } from "lucide-react";

interface CelebrityBiographyProps {
  celebrity: Celebrity;
}

export default function CelebrityBiography({ celebrity }: CelebrityBiographyProps) {
  return (
    <div className="space-y-8">
      {/* Biography Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
          <span>📖</span>
          <span>Биография</span>
        </h3>
        <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
          {celebrity.biography_ru || celebrity.description}
        </p>
      </div>

      {/* Achievements Section */}
      {celebrity.achievements && celebrity.achievements.length > 0 && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Award className="w-7 h-7 text-purple-600" />
            <span>Достижения</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {celebrity.achievements.map((achievement, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-4 border border-purple-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-800 font-medium flex-1">{achievement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Milestones Timeline */}
      {celebrity.career_milestones && celebrity.career_milestones.length > 0 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            <span>Карьерный путь</span>
          </h3>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-purple-500 hidden sm:block" />
            
            <div className="space-y-6">
              {celebrity.career_milestones
                .sort((a, b) => a.year - b.year)
                .map((milestone, index) => (
                  <div key={index} className="relative flex items-start space-x-4 sm:space-x-6">
                    {/* Year badge */}
                    <div className="flex-shrink-0 w-16 sm:w-20">
                      <div className="bg-gradient-to-br from-purple-500 to-blue-500 text-white rounded-xl px-3 py-2 text-center shadow-lg relative z-10">
                        <Calendar className="w-4 h-4 mx-auto mb-1" />
                        <div className="font-bold text-sm">{milestone.year}</div>
                      </div>
                    </div>
                    
                    {/* Milestone content */}
                    <div className="flex-1 bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 sm:p-5 border border-gray-200 hover:border-purple-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-gray-900 text-base sm:text-lg">
                          {milestone.title}
                        </h4>
                        <span className="text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-full ml-2 whitespace-nowrap">
                          {milestone.category}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
