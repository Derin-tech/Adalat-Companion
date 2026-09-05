import React from 'react';
import { X } from 'lucide-react';

interface LawyerProfileModalProps {
  lawyer: any;
  onClose: () => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({ lawyer, onClose }) => {
  if (!lawyer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <h2 className="text-xl font-bold font-serif text-slate-900">Advocate Profile</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">{lawyer.name}</h3>
          
          <dl className="space-y-4 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-100 pb-4">
              <dt className="font-semibold text-slate-500">Address</dt>
              <dd className="sm:col-span-2 text-slate-900">{lawyer.address}</dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-100 pb-4">
              <dt className="font-semibold text-slate-500">Telephone</dt>
              <dd className="sm:col-span-2 text-slate-900">{lawyer.phone}</dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-100 pb-4">
              <dt className="font-semibold text-slate-500">Email</dt>
              <dd className="sm:col-span-2 text-slate-900">{lawyer.email}</dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-100 pb-4">
              <dt className="font-semibold text-slate-500">Enrolment Details</dt>
              <dd className="sm:col-span-2 text-slate-900 space-y-1">
                <div><span className="font-medium text-slate-700">Number:</span> {lawyer.enrolmentNumber}</div>
                <div><span className="font-medium text-slate-700">Date:</span> {lawyer.enrolmentDate}</div>
                <div><span className="font-medium text-slate-700">State Bar Council:</span> {lawyer.stateBarCouncil}</div>
                <div><span className="font-medium text-slate-700">Bar Association:</span> {lawyer.barAssociation}</div>
              </dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 border-b border-slate-100 pb-4">
              <dt className="font-semibold text-slate-500">Qualifications</dt>
              <dd className="sm:col-span-2 text-slate-900">
                <ul className="list-disc pl-5 space-y-1">
                  {lawyer.qualifications.map((qual: string, i: number) => (
                    <li key={i}>{qual}</li>
                  ))}
                </ul>
              </dd>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 pt-1">
              <dt className="font-semibold text-slate-500">Areas of Practice</dt>
              <dd className="sm:col-span-2 text-slate-900">
                {lawyer.practiceAreas.join(', ')}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded shadow-sm transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
