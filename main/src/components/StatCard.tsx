import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  maxValue?: number;
  color: 'red' | 'yellow' | 'green' | 'blue' | 'purple';
  suffix?: string;
}

export default function StatCard({ icon: Icon, label, value, maxValue, color, suffix = '' }: StatCardProps) {
  const colorClasses = {
    red: 'text-red-500 bg-red-100',
    yellow: 'text-yellow-500 bg-yellow-100',
    green: 'text-green-500 bg-green-100',
    blue: 'text-blue-500 bg-blue-100',
    purple: 'text-purple-500 bg-purple-100',
  };

  const progressColors = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-lg font-bold text-gray-800">
          {value}{suffix}
        </span>
      </div>
      
      {maxValue && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${progressColors[color]}`}
            style={{ width: `${(value / maxValue) * 100}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}