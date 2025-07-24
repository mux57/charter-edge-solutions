import React from 'react';
import { User, Award, TrendingUp, Shield } from 'lucide-react';

interface ProfessionalAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadges?: boolean;
}

export const ProfessionalAvatar: React.FC<ProfessionalAvatarProps> = ({
  className = '',
  size = 'lg',
  showBadges = true
}) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Avatar */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Background with gradient */}
        <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Professional pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          {/* Professional icon */}
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 mb-4 mx-auto w-fit">
                <User className={`${iconSizes[size]} text-white`} />
              </div>
              <div className="text-white">
                <h3 className="font-bold text-lg mb-1">CA Professional</h3>
                <p className="text-white/80 text-sm">Financial Expert</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full"></div>
          <div className="absolute top-1/3 left-4 w-4 h-4 bg-white/20 rounded-full"></div>
        </div>

        {/* Professional badges */}
        {showBadges && (
          <>
            {/* CA Badge */}
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-2 rounded-full shadow-lg transform rotate-12 animate-pulse">
              <Award className="w-4 h-4" />
            </div>
            
            {/* Experience Badge */}
            <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-green-400 to-blue-500 text-white p-2 rounded-full shadow-lg transform -rotate-12 animate-pulse">
              <TrendingUp className="w-4 h-4" />
            </div>
            
            {/* Trust Badge */}
            <div className="absolute top-1/2 -right-3 bg-gradient-to-r from-purple-400 to-pink-500 text-white p-2 rounded-full shadow-lg animate-pulse">
              <Shield className="w-4 h-4" />
            </div>
          </>
        )}
      </div>

      {/* Floating elements */}
      <div className="absolute -z-10 top-4 left-4 w-full h-full bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-2xl transform rotate-3"></div>
      <div className="absolute -z-20 top-8 left-8 w-full h-full bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-2xl transform -rotate-3"></div>

      {/* Professional stats overlay */}
      {size === 'xl' && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">500+</div>
              <div className="text-xs text-gray-600">Clients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">15+</div>
              <div className="text-xs text-gray-600">Years</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">₹50Cr+</div>
              <div className="text-xs text-gray-600">Saved</div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        .animate-pulse {
          animation: pulse 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
