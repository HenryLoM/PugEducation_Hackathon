import React from 'react';
import { Heart } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-200 to-orange-300 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <div className="text-6xl">🐶</div>
          </div>
          <div className="absolute -top-2 -right-2 animate-pulse">
            <Heart className="w-8 h-8 text-red-500 fill-current" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          PugEducation
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Учись играя и заботься о своем питомце!
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}