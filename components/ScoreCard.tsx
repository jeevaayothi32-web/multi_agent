'use client';

import React from 'react';

interface ScoreMetricProps {
  label: string;
  score: number;
  verdict: string;
  tooltip?: string;
}

function ScoreMetric({ label, score, verdict, tooltip }: ScoreMetricProps) {
  // Determine color coding based on score thresholds
  const getScoreColorClass = (val: number) => {
    if (val >= 80) return 'bg-[#10b981]'; // Green (High potential / low risk / low legal concerns)
    if (val >= 60) return 'bg-[#f97316]'; // Orange (Moderate)
    return 'bg-[#ef4444]'; // Red (Needs improvement / high risk / high legal concerns)
  };

  const getScoreTextColorClass = (val: number) => {
    if (val >= 80) return 'text-[#10b981]';
    if (val >= 60) return 'text-[#f97316]';
    return 'text-[#ef4444]';
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded p-4 flex flex-col gap-2 hover:border-[#cbd5e1] transition-all">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-[#8e8e8e] tracking-wider block">
            {label}
          </span>
          <span className="text-[10px] text-[#6b7280] block font-normal leading-tight mt-0.5">
            {tooltip}
          </span>
        </div>
        <span className={`text-base font-bold font-mono ${getScoreTextColorClass(score)}`}>
          {score}/100
        </span>
      </div>

      {/* Simple Horizontal Bar */}
      <div className="w-full bg-[#e5e5e5] rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${getScoreColorClass(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="text-xs text-[#404040] leading-tight font-medium mt-1">
        <span className="text-[#737373] font-normal">Verdict:</span> {verdict}
      </div>
    </div>
  );
}

interface ScoreCardProps {
  scores: {
    feasibility?: number;
    market?: number;
    technical?: number;
    innovation?: number;
    risk?: number;
    legal?: number;
  };
  verdicts: {
    feasibility?: string;
    market?: string;
    technical?: string;
    innovation?: string;
    risk?: string;
    legal?: string;
  };
}

export default function ScoreCard({ scores, verdicts }: ScoreCardProps) {
  const metrics = [
    {
      key: 'feasibility',
      label: 'Feasibility',
      tooltip: 'Operational complexity & deployment readiness',
      score: scores.feasibility ?? 0,
      verdict: verdicts.feasibility ?? 'Not evaluated',
    },
    {
      key: 'market',
      label: 'Market Potential',
      tooltip: 'Audience demand & competitive posture',
      score: scores.market ?? 0,
      verdict: verdicts.market ?? 'Not evaluated',
    },
    {
      key: 'technical',
      label: 'Technical Execution',
      tooltip: 'Infrastructure, complexity & technical feasibility',
      score: scores.technical ?? 0,
      verdict: verdicts.technical ?? 'Not evaluated',
    },
    {
      key: 'innovation',
      label: 'Innovation Potential',
      tooltip: 'Originality, novelty & product defense',
      score: scores.innovation ?? 0,
      verdict: verdicts.innovation ?? 'Not evaluated',
    },
    {
      key: 'risk',
      label: 'Risk Profile',
      tooltip: 'LOWER risk is safer (90 = low risk, 20 = high risk)',
      score: scores.risk ?? 0,
      verdict: verdicts.risk ?? 'Not evaluated',
    },
    {
      key: 'legal',
      label: 'Legal & Ethical',
      tooltip: 'Fewer concerns is safer (100 = clear, 0 = severe concerns)',
      score: scores.legal ?? 0,
      verdict: verdicts.legal ?? 'Not evaluated',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <ScoreMetric
          key={metric.key}
          label={metric.label}
          score={metric.score}
          verdict={metric.verdict}
          tooltip={metric.tooltip}
        />
      ))}
    </div>
  );
}
