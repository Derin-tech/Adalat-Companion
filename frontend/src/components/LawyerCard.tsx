import React from 'react';
import { User } from 'lucide-react';

interface LawyerCardProps {
  lawyer: any;
  onClick: () => void;
  showPhoto: boolean;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({ lawyer, onClick, showPhoto }) => {
  return (
    <div 
      onClick={onClick}
      className="govt-card bg-white rounded-lg shadow-sm border border-slate-200 p-5 cursor-pointer hover:shadow-md transition-shadow hover:border-amber-400"
    >
      <div className="flex items-start gap-4">
        {showPhoto && (
          <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center shrink-0 overflow-hidden">
            {lawyer.photoUrl ? (
              <img src={lawyer.photoUrl} alt={lawyer.name} className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-slate-400" />
            )}
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold text-slate-900">{lawyer.name}</h3>
          <p className="text-sm text-slate-600 mt-1">
            <span className="font-semibold text-slate-700">Practice Areas:</span> {lawyer.practiceAreas.join(', ')}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            <span className="font-semibold text-slate-600">Location:</span> {lawyer.location}
          </p>
        </div>
      </div>
    </div>
  );
};
