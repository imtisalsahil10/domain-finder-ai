import React, { useState } from 'react';
import { Search, Building2, MapPin, Briefcase, User, Mail } from 'lucide-react';
import { CompanySearchParams, PersonSearchParams, FormErrors } from '../types';

type SearchMode = 'company' | 'person';

interface InputFormProps {
  onCompanySearch: (params: CompanySearchParams) => void;
  onPersonSearch: (params: PersonSearchParams) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onCompanySearch, onPersonSearch, isLoading }) => {
  const [mode, setMode] = useState<SearchMode>('company');
  
  const [companyParams, setCompanyParams] = useState<CompanySearchParams>({
    companyName: '',
    industry: '',
    location: '',
  });

  const [personParams, setPersonParams] = useState<PersonSearchParams>({
    personName: '',
    companyName: '',
    jobTitle: '',
    location: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (mode === 'company') {
      if (!companyParams.companyName.trim()) newErrors.companyName = "Company name is required";
    } else {
      if (!personParams.personName.trim()) newErrors.personName = "Person name is required";
      if (!personParams.companyName.trim()) newErrors.companyName = "Company name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      if (mode === 'company') {
        onCompanySearch(companyParams);
      } else {
        onPersonSearch(personParams);
      }
    }
  };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyParams(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handlePersonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonParams(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100">
      <div className="mb-6">
        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => { setMode('company'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              mode === 'company' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="w-4 h-4 mr-2" />
            Find Company
          </button>
          <button
            onClick={() => { setMode('person'); setErrors({}); }}
            className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              mode === 'person' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mail className="w-4 h-4 mr-2" />
            Find Email
          </button>
        </div>

        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'company' ? 'Find Corporate Domain' : 'Find Professional Email'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'company' 
              ? 'Enter company details to uncover their official web presence' 
              : 'Enter person and company details to find contact info'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {mode === 'person' && (
          <div className="space-y-2">
            <label htmlFor="personName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                id="personName"
                name="personName"
                value={personParams.personName}
                onChange={handlePersonChange}
                className={`block w-full pl-10 pr-3 py-3 border ${
                  errors.personName ? 'border-red-300 ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
                } rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white`}
                placeholder="e.g. John Doe"
              />
            </div>
            {errors.personName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.personName}</p>}
          </div>
        )}

        {/* Company Name - Shared but different state objects */}
        <div className="space-y-2">
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={mode === 'company' ? companyParams.companyName : personParams.companyName}
              onChange={mode === 'company' ? handleCompanyChange : handlePersonChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.companyName ? 'border-red-300 ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'
              } rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white`}
              placeholder={mode === 'company' ? "e.g. Acme Corp" : "e.g. Acme Corp"}
            />
          </div>
          {errors.companyName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.companyName}</p>}
        </div>

        {/* Fields specific to Company Search */}
        {mode === 'company' && (
          <div className="space-y-2">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">
              Industry <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                id="industry"
                name="industry"
                value={companyParams.industry}
                onChange={handleCompanyChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 focus:ring-blue-100 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white"
                placeholder="e.g. Technology"
              />
            </div>
          </div>
        )}

        {/* Fields specific to Person Search */}
        {mode === 'person' && (
          <div className="space-y-2">
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Job Title <span className="text-gray-400 font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                value={personParams.jobTitle}
                onChange={handlePersonChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 focus:ring-blue-100 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white"
                placeholder="e.g. Marketing Manager"
              />
            </div>
          </div>
        )}

        {/* Location - Shared */}
        <div className="space-y-2">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              id="location"
              name="location"
              value={mode === 'company' ? companyParams.location : personParams.location}
              onChange={mode === 'company' ? handleCompanyChange : handlePersonChange}
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 focus:ring-blue-100 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 text-gray-700 bg-gray-50 focus:bg-white"
              placeholder="e.g. San Francisco, CA"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-xl shadow-lg text-sm font-semibold text-white transition-all duration-300 ${
            isLoading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Searching...
            </>
          ) : (
            <>
              <Search className="h-5 w-5 mr-2" />
              {mode === 'company' ? 'Find Domain' : 'Find Email'}
            </>
          )}
        </button>
      </form>
    </div>
  );
};