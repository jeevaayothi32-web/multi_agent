'use client';

import React from 'react';

interface OverallScoreProps {
  score: number;
  verdict: 'High Potential' | 'Moderate Potential' | 'Needs Improvement';
  explanation: string;
  isDemo?: boolean;
}

export default function OverallScore({ score, verdict, explanation, isDemo }: OverallScoreProps) {
  // Styles for each verdict type
  const verdictStyles = {
    'High Potential': {
      bg: 'bg-[#ecfdf5]',
      text: 'text-[#065f46]',
      border: 'border-[#a7f3d0]',
      dot: 'bg-[#10b981]',
    },
    'Moderate Potential': {
      bg: 'bg-[#fff7ed]',
      text: 'text-[#9a3412]',
      border: 'border-[#fed7aa]',
      dot: 'bg-[#f97316]',
    },
    'Needs Improvement': {
      bg: 'bg-[#fff5f5]',
      text: 'text-[#9b1c1c]',
      border: 'border-[#fecaca]',
      dot: 'bg-[#ef4444]',
    },
  }[verdict] || {
    bg: 'bg-[#f3f4f6]',
    text: 'text-[#374151]',
    border: 'border-[#e5e7eb]',
    dot: 'bg-[#9ca3af]',
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
      {/* Overall Score Circle (Academic Look) */}
      <div className="relative flex-shrink-0 flex items-center justify-center h-32 w-32 rounded-full border-4 border-[#f3f4f6] bg-[#fafafa]">
        {/* Simple SVG Track */}
        <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke="#e5e5e5"
            strokeWidth="4"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r="58"
            stroke={score >= 80 ? '#10b981' : score >= 60 ? '#f97316' : '#ef4444'}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={2 * Math.PI * 58}
            strokeDashoffset={2 * Math.PI * 58 * (1 - score / 100)}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="text-center z-10">
          <span className="block text-3xl font-bold text-[#171717] font-mono leading-none">{score}</span>
          <span className="text-[10px] uppercase font-semibold text-[#8e8e8e] tracking-wider mt-1 block">Score / 100</span>
        </div>
      </div>

      {/* Explanation & Verdict Details */}
      <div className="flex-1 text-center md:text-left space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-2 justify-center md:justify-start">
          <span className="text-xs uppercase font-bold text-[#8e8e8e] tracking-wider">Evaluation Verdict:</span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold border ${verdictStyles.bg} ${verdictStyles.text} ${verdictStyles.border}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${verdictStyles.dot}`} />
            {verdict}
          </span>
          {isDemo && (
            <span className="inline-flex items-center rounded bg-[#eff6ff] px-2 py-0.5 text-[10px] font-semibold text-[#2563eb] border border-[#bfdbfe]">
              DEMO ANALYSIS
            </span>
          )}
        </div>

        <h2 className="text-lg font-bold text-[#171717] tracking-tight">
          {score >= 80 ? 'Highly Viable Concept' : score >= 60 ? 'Promising Dynamic Niche' : 'Refinement & Iteration Needed'}
        </h2>

        <p className="text-sm text-[#404040] leading-relaxed font-normal">
          {explanation}
        </p>

        {isDemo && (
          <div className="text-[11px] text-amber-600 bg-amber-50 border border-amber-100 rounded px-2.5 py-1.5 text-left flex gap-1.5 mt-2">
            <span>💡</span>
            <span>
              <strong>Note:</strong> Showing simulated static demo analysis results. To analyze custom ideas with real AI agents, configure your <code>OPENROUTER_API_KEY</code> in a local <code>.env.local</code> file.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
