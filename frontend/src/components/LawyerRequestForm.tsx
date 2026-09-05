import React, { useState } from 'react';
import { AlertCircle, User, Phone, MapPin, Languages, Briefcase, Clock, FileText } from 'lucide-react';

interface LawyerRequestFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

export const LawyerRequestForm: React.FC<LawyerRequestFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    district: '',
    language: '',
    urgency: 'Normal',
    contactInfo: {
      name: '',
      phone: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' || name === 'phone') {
      setFormData(prev => ({
        ...prev,
        contactInfo: { ...prev.contactInfo, [name]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="govt-card bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold font-serif text-slate-900">Legal Representation Request Form</h2>
        <p className="text-sm text-slate-600 mt-1">Please provide details about your case to help us find a suitable advocate.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Briefcase size={16} className="text-slate-400" />
              Case Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white text-slate-900"
            >
              <option value="" disabled>Select category...</option>
              <option value="Criminal">Criminal</option>
              <option value="Civil">Civil</option>
              <option value="Family">Family</option>
              <option value="Property">Property</option>
              <option value="Consumer">Consumer</option>
              <option value="Labour">Labour</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Urgency */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Clock size={16} className="text-slate-400" />
              Urgency
            </label>
            <select
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm bg-white text-slate-900"
            >
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent (Hearing within 7 days)</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <FileText size={16} className="text-slate-400" />
            Case Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Briefly describe what happened and what help you need..."
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900 placeholder:text-slate-400"
          />
          <p className="text-xs text-slate-500">Do not include sensitive personal information like bank details or passwords.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* District */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <MapPin size={16} className="text-slate-400" />
              District / City
            </label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              placeholder="e.g., New Delhi, Lucknow"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900"
            />
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Languages size={16} className="text-slate-400" />
              Preferred Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              placeholder="e.g., Hindi, English, Malayalam"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <User size={16} className="text-slate-400" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.contactInfo.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900"
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Phone size={16} className="text-slate-400" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.contactInfo.phone}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting Request...
              </span>
            ) : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  );
};
