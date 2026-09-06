import React from 'react';
import { MapPin, Briefcase } from 'lucide-react';

interface LawyerFiltersProps {
  location: string;
  practiceArea: string;
  onLocationChange: (val: string) => void;
  onPracticeAreaChange: (val: string) => void;
}

export const LawyerFilters: React.FC<LawyerFiltersProps> = ({ 
  location, 
  practiceArea, 
  onLocationChange, 
  onPracticeAreaChange 
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row gap-4 shadow-sm mb-6">
      <div className="flex-1 space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <MapPin size={16} className="text-slate-400" />
          Location
        </label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white text-slate-900"
        >
          <option value="">All Locations</option>
          <option value="Thiruvananthapuram">Thiruvananthapuram</option>
          <option value="Ernakulam">Ernakulam</option>
          <option value="Kozhikode">Kozhikode</option>
          <option value="Kottayam">Kottayam</option>
          <option value="Kollam">Kollam</option>
        </select>
      </div>

      <div className="flex-1 space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Briefcase size={16} className="text-slate-400" />
          Area of Practice
        </label>
        <select
          value={practiceArea}
          onChange={(e) => onPracticeAreaChange(e.target.value)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white text-slate-900"
        >
          <option value="">All Practice Areas</option>
          <option value="Civil">Civil</option>
          <option value="Criminal">Criminal</option>
          <option value="Family">Family</option>
          <option value="Property">Property</option>
          <option value="Consumer">Consumer</option>
          <option value="Labour">Labour</option>
          <option value="Taxation">Taxation</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};
