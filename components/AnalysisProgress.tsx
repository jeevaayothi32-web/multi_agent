'use client';

import React from 'react';
import { AgentName, AgentErrorsMap } from '../types/analysis';

export interface AgentStatusMap {
  feasibility: 'idle' | 'running' | 'success' | 'error';
  market: 'idle' | 'running' | 'success' | 'error';
  technical: 'idle' | 'running' | 'success' | 'error';
  innovation: 'idle' | 'running' | 'success' | 'error';
  risk: 'idle' | 'running' | 'success' | 'error';
  legal: 'idle' | 'running' | 'success' | 'error';
  suggestion: 'idle' | 'running' | 'success' | 'error';
}

interface AnalysisProgressProps {
  statuses: AgentStatusMap;
  errors: AgentErrorsMap;
}

export default function AnalysisProgress({ statuses, errors }: AnalysisProgressProps) {
  const agentsList = [
    { key: 'feasibility' as AgentName, label: 'Feasibility Agent', desc: 'Practicality & scalability constraints' },
    { key: 'market' as AgentName, label: 'Market Agent', desc: 'Demand & target audience viability' },
    { key: 'technical' as AgentName, label: 'Technical Agent', desc: 'Architecture & technical risks' },
    { key: 'innovation' as AgentName, label: 'Innovation Agent', desc: 'Originality & market differentiation' },
    { key: 'risk' as AgentName, label: 'Risk Agent', desc: 'Business & operational safety metrics' },
    { key: 'legal' as AgentName, label: 'Legal Agent', desc: 'Ethical & compliance considerations' },
    { key: 'suggestion' as AgentName, label: 'Suggestion Agent', desc: 'Practical features & next milestones' },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ef4444]/10 text-[#ef4444] border border-[#ef4444]/30">
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 001.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </div>
        );
      case 'running':
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3b82f6]/10 text-[#3b82f6] border border-[#3b82f6]/30">
            <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        );
      case 'idle':
      default:
        return (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#e5e5e5] text-[#737373] border border-[#d4d4d4]">
            <span className="text-[10px] font-semibold">•</span>
          </div>
        );
    }
  };

  const getStatusLabelText = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="text-xs font-semibold text-[#10b981]">Complete</span>;
      case 'error':
        return <span className="text-xs font-semibold text-[#ef4444]">Failed</span>;
      case 'running':
        return <span className="text-xs font-semibold text-[#3b82f6] animate-pulse">Analyzing...</span>;
      case 'idle':
      default:
        return <span className="text-xs text-[#a3a3a3]">Waiting</span>;
    }
  };

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e5e5e5]">
        <div>
          <h2 className="text-base font-semibold text-[#171717]">Analyzing Your Idea</h2>
          <p className="text-xs text-[#6b7280]">Evaluating multiple expert dimensions concurrently.</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded bg-[#eff6ff] px-2 py-1 text-xs font-medium text-[#2563eb] border border-[#bfdbfe]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2563eb]"></span>
          </span>
          Parallel Execution Active
        </span>
      </div>

      <ul className="space-y-4">
        {agentsList.map((agent) => {
          const status = statuses[agent.key];
          const hasError = status === 'error' && errors[agent.key];
          return (
            <li key={agent.key} className="flex flex-col gap-1 p-2.5 rounded border border-transparent hover:border-[#f3f4f6] hover:bg-[#fafafa] transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(status)}
                  <div>
                    <span className={`text-sm ${status === 'success' ? 'font-semibold text-[#171717]' : 'text-[#404040]'}`}>
                      {agent.label}
                    </span>
                    <span className="hidden sm:inline-block text-[11px] text-[#8e8e8e] ml-2">— {agent.desc}</span>
                  </div>
                </div>
                {getStatusLabelText(status)}
              </div>
              {hasError && (
                <div className="mt-1 ml-8 rounded bg-red-50 border border-red-100 p-2 text-xs text-red-600">
                  ⚠️ {errors[agent.key]}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
