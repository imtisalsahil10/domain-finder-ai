import React from 'react';
import { ExternalLink, Copy, CheckCircle, AlertTriangle, Info, Globe, Link as LinkIcon, Mail, AtSign } from 'lucide-react';
import { SearchResult } from '../types';

interface ResultCardProps {
  result: SearchResult | null;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  if (!result) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      case 'medium': return <Info className="w-4 h-4 mr-1.5" />;
      case 'low': return <AlertTriangle className="w-4 h-4 mr-1.5" />;
      default: return <Info className="w-4 h-4 mr-1.5" />;
    }
  };

  const isEmail = result.type === 'email';
  const mainValue = isEmail ? result.email : result.domain;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-gray-100 animate-fade-in-up">
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${isEmail ? 'bg-purple-50' : 'bg-blue-50'}`}>
          {isEmail ? (
            <Mail className="w-8 h-8 text-purple-600" />
          ) : (
            <Globe className="w-8 h-8 text-blue-600" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {isEmail ? 'Email Found' : 'Domain Found'}
        </h3>
        <p className="text-gray-500 text-sm mt-1">Here is what we discovered</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-6 relative group">
        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
          {isEmail ? 'Email Address' : 'Primary Domain'}
        </p>
        <div className="flex items-center justify-between gap-3">
          {isEmail ? (
             <span className="text-2xl font-bold text-purple-600 truncate select-all">{mainValue}</span>
          ) : (
             <a 
              href={`https://${mainValue}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 hover:underline truncate"
            >
              {mainValue}
            </a>
          )}
         
          <div className="flex space-x-2 flex-shrink-0">
            <button 
              onClick={() => copyToClipboard(mainValue)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
            {!isEmail && (
              <a 
                href={`https://${mainValue}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Open website"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
            {isEmail && (
              <a 
                href={`mailto:${mainValue}`}
                className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Send email"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-start">
          <div className={`flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(result.confidence)}`}>
            {getConfidenceIcon(result.confidence)}
            {result.confidence} Confidence
          </div>
        </div>
        
        {/* Email Pattern (only for email results) */}
        {isEmail && result.pattern && result.pattern !== 'N/A' && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1 flex items-center">
              <AtSign className="w-3 h-3 mr-1 text-gray-400" /> Pattern
            </h4>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded border border-gray-200 text-gray-700">
              {result.pattern}
            </code>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-1">Analysis</h4>
          <p className="text-sm text-gray-600 leading-relaxed bg-white/50">{result.reasoning}</p>
        </div>

        {/* Alternatives (only for domain results) */}
        {!isEmail && result.alternatives && result.alternatives.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Alternatives</h4>
            <div className="flex flex-wrap gap-2">
              {result.alternatives.map((alt, idx) => (
                <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {alt}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.sources && result.sources.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
             <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <LinkIcon className="w-3 h-3 mr-1.5" /> Sources
             </h4>
             <ul className="space-y-1">
               {result.sources.map((source, idx) => (
                 <li key={idx}>
                   <a 
                     href={source.uri}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-xs text-blue-500 hover:text-blue-600 hover:underline truncate block"
                   >
                     {source.title}
                   </a>
                 </li>
               ))}
             </ul>
          </div>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full py-3 px-4 bg-white border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Start New Search
      </button>
    </div>
  );
};