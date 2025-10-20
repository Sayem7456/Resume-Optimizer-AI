import React from 'react';
import { AnalysisResult } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface AnalysisDisplayProps {
  result: AnalysisResult;
}

const getImpactColor = (impact: string) => {
    switch (impact?.toLowerCase()) {
        case 'high':
            return 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-200';
        case 'low':
            return 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200';
        default:
            return 'bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200';
    }
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const circumference = 2 * Math.PI * 52; // 2 * pi * r
  const offset = circumference - (score / 100) * circumference;
  
  let strokeColor = 'stroke-red-500';
  if (score >= 80) {
    strokeColor = 'stroke-green-500';
  } else if (score >= 60) {
    strokeColor = 'stroke-yellow-500';
  }

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 120 120">
        <circle
          className="text-slate-200"
          strokeWidth="10"
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
        <circle
          className={`transform -rotate-90 origin-center transition-all duration-1000 ease-out ${strokeColor}`}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="currentColor"
          fill="transparent"
          r="52"
          cx="60"
          cy="60"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800">{score}%</span>
        <span className="text-sm text-slate-500">Match</span>
      </div>
    </div>
  );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col items-center text-center">
        <ScoreCircle score={result.compatibilityScore} />
        <h2 className="text-2xl font-bold mt-4 text-slate-800">Compatibility Score</h2>
        <p className="text-slate-600 mt-1">
          Your resume's alignment with the job description.
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
            <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Missing Keywords
        </h3>
        {result.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((keyword, index) => (
                    <span key={index} className="bg-rose-100 text-rose-800 text-sm font-medium px-3 py-1 rounded-full">
                        {keyword}
                    </span>
                ))}
            </div>
        ) : (
            <p className="text-sm text-slate-500 italic">No critical keywords missing. Great job!</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
            Actionable Suggestions
        </h3>
        <ul className="space-y-4">
          {result.suggestions.map((item, index) => (
            <li key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md ${getImpactColor(item.impact)}`}>
                  {item.impact} Impact
                </span>
                <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-800 ring-1 ring-inset ring-slate-200">
                  {item.type}
                </span>
              </div>
              <p className="font-semibold text-slate-800">{item.suggestion}</p>
              <div className="mt-2 p-3 bg-slate-100 rounded text-sm text-slate-600 border-l-4 border-indigo-400">
                <span className="font-bold text-slate-700">Example:</span>
                <p className="italic">"{item.example}"</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};