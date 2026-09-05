import React from 'react';
import { CheckCircle2, Circle, Clock, Mail, Phone, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

interface RequestStatusCardProps {
  statusData: any;
  onRefresh: () => void;
  isLoading: boolean;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({ statusData, onRefresh, isLoading }) => {
  if (!statusData) return null;

  const { status, id, category, createdAt, matchedLawyer } = statusData;

  const steps = [
    { key: 'pending', label: 'Submitted', description: 'Your request has been received.' },
    { key: 'matching', label: 'Matching', description: 'We are locating suitable advocates in your district.' },
    { key: 'matched', label: 'Contact Shared', description: 'An advocate has accepted your request.' },
  ];

  const getCurrentStepIndex = () => {
    if (status === 'pending') return 0;
    if (status === 'matching') return 1;
    if (status === 'matched') return 2;
    return 0;
  };

  const currentStep = getCurrentStepIndex();

  return (
    <div className="space-y-6">
      <div className="govt-card bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold font-serif text-slate-900">Request Status</h2>
            <p className="text-sm text-slate-500 font-mono mt-1">ID: {id}</p>
          </div>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
            Refresh Status
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="relative pt-2 pb-6">
          <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-200 rounded"></div>
          
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              
              return (
                <div key={step.key} className="flex flex-col items-center w-1/3 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${
                    isCompleted 
                      ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-sm' 
                      : 'bg-white border-slate-300 text-slate-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} className="font-bold" /> : <Circle size={10} fill="currentColor" />}
                  </div>
                  <span className={`text-sm font-bold ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                    {step.label}
                  </span>
                  <span className="text-xs text-slate-500 text-center mt-1 hidden sm:block max-w-[120px]">
                    {step.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Matched Lawyer Details */}
      {status === 'matched' && matchedLawyer && (
        <div className="govt-card bg-[#f8faeb] rounded-lg shadow-sm border border-[#d3dd8e] p-6">
          <div className="flex items-start gap-4">
            <div className="mt-1 p-2 bg-[#eaf2b1] rounded-full shrink-0">
              <CheckCircle2 className="text-[#5c6b12] w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-[#3d470d] mb-1">Advocate Found</h3>
              <p className="text-sm text-[#5c6b12] mb-4">An advocate has accepted your request. Please contact them using the details below.</p>
              
              <div className="bg-white rounded border border-[#d3dd8e] p-4 space-y-3">
                <h4 className="font-bold text-slate-900 text-lg">{matchedLawyer.name}</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Phone size={16} className="text-slate-400 shrink-0" />
                    <span>{matchedLawyer.contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <span>{matchedLawyer.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-700">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span>{matchedLawyer.contactInfo.chamber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info/Warning for non-matched states */}
      {status !== 'matched' && (
        <div className="p-4 rounded-md bg-blue-50 border-l-4 border-blue-600 text-blue-900 flex items-start gap-3">
          <AlertCircle size={20} className="text-blue-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold mb-1">What happens next?</p>
            <p>Your request has been routed to our secure matching system. We will notify active advocates matching your case criteria. Once an advocate accepts, their contact information will appear here. This process usually takes 24-48 hours.</p>
          </div>
        </div>
      )}
    </div>
  );
};
