import React, { useState, useEffect } from 'react';
import { LawyerFilters } from './LawyerFilters';
import { LawyerCard } from './LawyerCard';
import { LawyerProfileModal } from './LawyerProfileModal';

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api');

export const LawyerDirectory: React.FC = () => {
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [location, setLocation] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLawyer, setSelectedLawyer] = useState<any | null>(null);

  const showPhotos = import.meta.env.VITE_SHOW_LAWYER_PHOTOS === 'true';

  const fetchLawyers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (practiceArea) params.append('practiceArea', practiceArea);
      
      const response = await fetch(`${API_BASE}/lawyer-connect/lawyers?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch lawyers directory');
      const data = await response.json();
      setLawyers(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLawyers();
  }, [location, practiceArea]);

  return (
    <div className="mt-12 pt-8 border-t-2 border-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold font-serif text-slate-900">Public Advocates Directory</h2>
        <p className="text-slate-600 text-sm mt-1 max-w-3xl">
          This informational directory lists advocates actively registered with their respective Bar Councils. 
          Information is provided in accordance with the Bar Council of India Rules. 
          You can browse profiles for informational purposes.
        </p>
      </div>

      <LawyerFilters 
        location={location}
        practiceArea={practiceArea}
        onLocationChange={setLocation}
        onPracticeAreaChange={setPracticeArea}
      />

      {error && (
        <div className="p-4 mb-6 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <>
          {lawyers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-sm">
              <p className="text-slate-500">No advocates found matching these filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lawyers.map((lawyer) => (
                <LawyerCard 
                  key={lawyer.id} 
                  lawyer={lawyer} 
                  onClick={() => setSelectedLawyer(lawyer)} 
                  showPhoto={showPhotos}
                />
              ))}
            </div>
          )}
        </>
      )}

      {selectedLawyer && (
        <LawyerProfileModal 
          lawyer={selectedLawyer} 
          onClose={() => setSelectedLawyer(null)} 
        />
      )}
    </div>
  );
};
