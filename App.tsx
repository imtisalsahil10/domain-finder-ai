import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { CompanySearchParams, PersonSearchParams, SearchResult } from './types';
import { findCompanyDomain, findPersonEmail } from './services/geminiService';
import { Sparkles, Command } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCompanySearch = async (params: CompanySearchParams) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await findCompanyDomain(params);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePersonSearch = async (params: PersonSearchParams) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await findPersonEmail(params);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
            <Command className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Finder<span className="text-blue-600">.ai</span>
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-blue-800 bg-blue-100 px-3 py-1 rounded-full">
           <Sparkles className="w-3 h-3" />
           <span>Powered by Gemini 2.5</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center justify-center flex-1 max-w-4xl">
        {error && (
          <div className="w-full max-w-lg mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Transition container */}
        <div className="w-full flex justify-center perspective-[1000px]">
          {result ? (
            <ResultCard result={result} onReset={handleReset} />
          ) : (
            <InputForm 
              onCompanySearch={handleCompanySearch} 
              onPersonSearch={handlePersonSearch}
              isLoading={isLoading} 
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Finder AI. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;