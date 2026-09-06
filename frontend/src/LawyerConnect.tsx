import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { LawyerRequestForm } from './components/LawyerRequestForm';
import { RequestStatusCard } from './components/RequestStatusCard';
import { LawyerDirectory } from './components/LawyerDirectory';

const API_BASE = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : '/api');

export const LawyerConnect: React.FC = () => {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [statusData, setStatusData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we have an ID stored, let's load it on mount
    const storedId = localStorage.getItem('lawyerRequestId');
    if (storedId) {
      setRequestId(storedId);
      fetchStatus(storedId);
    }
  }, []);

  const fetchStatus = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/lawyer-connect/requests/${id}`);
      if (!response.ok) throw new Error('Failed to fetch request status');
      const data = await response.json();
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching status.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/lawyer-connect/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to submit request');
      const data = await response.json();
      
      setRequestId(data.id);
      localStorage.setItem('lawyerRequestId', data.id);
      setStatusData(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    if (requestId) {
      fetchStatus(requestId);
    }
  };

  const handleStartNew = () => {
    setRequestId(null);
    setStatusData(null);
    localStorage.removeItem('lawyerRequestId');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Statutory Disclaimer */}
      <div className="bg-slate-50 border border-slate-300 rounded-md p-4 shadow-sm flex items-start gap-3">
        <ShieldAlert className="text-slate-600 w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm text-slate-800">
          <p className="font-bold text-slate-900">Statutory Disclaimer</p>
          <p>
            This tool connects users with legal representatives based on case requirements. 
            <strong> This is a referral tool and does not constitute legal advice. </strong> 
            The Adalat Companion portal does not guarantee the outcome of your case. For immediate free legal aid, contact the NALSA Helpline at <strong>15100</strong>.
          </p>
        </div>
      </div>

      <div className="bg-[#0b1b3d] text-white p-6 rounded-lg shadow-md border-b-4 border-amber-500">
        <h1 className="text-2xl font-extrabold font-serif mb-2">Lawyer Connect</h1>
        <p className="text-slate-300 text-sm max-w-2xl">
          Submit your case details securely. Our system will route your request to active, registered advocates based on your jurisdiction and case category. You will be notified when an advocate accepts your case.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {!requestId ? (
        <LawyerRequestForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <RequestStatusCard 
            statusData={statusData} 
            onRefresh={handleRefresh} 
            isLoading={isLoading} 
          />
          <div className="flex justify-end">
            <button
              onClick={handleStartNew}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Submit a new request
            </button>
          </div>
        </div>
      )}

      {/* Public Directory Section */}
      <LawyerDirectory />
    </div>
  );
};
