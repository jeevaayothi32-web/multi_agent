'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '../../../components/Navigation';
import OverallScore from '../../../components/OverallScore';
import ScoreCard from '../../../components/ScoreCard';
import AgentResult from '../../../components/AgentResult';
import { AnalysisReport } from '../../../types/analysis';
import { formatDate } from '../../../lib/utils/helpers';

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    try {
      const stored = localStorage.getItem('innovation_analyzer_history');
      if (stored) {
        const history: AnalysisReport[] = JSON.parse(stored);
        const found = history.find((item) => item.id === id);
        if (found) {
          setReport(found);
        }
      }
    } catch (e) {
      console.error('Failed to parse history from local storage:', e);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center p-8 bg-[#fafafa]">
          <div className="text-center space-y-4">
            <svg className="animate-spin h-8 w-8 text-[#3b82f6] mx-auto" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm text-[#737373] font-medium">Retrieving analysis report...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow flex items-center justify-center p-8 bg-[#fafafa]">
          <div className="max-w-md w-full text-center bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm space-y-4">
            <div className="text-4xl">⚠️</div>
            <h1 className="text-lg font-bold text-[#171717]">Report Not Found</h1>
            <p className="text-sm text-[#6b7280]">
              The analysis report with ID <code className="bg-[#f5f5f5] px-1 rounded text-red-600 font-mono text-xs">{id}</code> could not be found in this browser's local storage.
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-block rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold py-2 px-4 shadow transition-colors"
              >
                Back to Analyzer
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Extract score map and verdict map for ScoreCard
  const scores = {
    feasibility: report.results.feasibility?.score,
    market: report.results.market?.score,
    technical: report.results.technical?.score,
    innovation: report.results.innovation?.score,
    risk: report.results.risk?.score,
    legal: report.results.legal?.score,
  };

  const verdicts = {
    feasibility: report.results.feasibility?.verdict,
    market: report.results.market?.verdict,
    technical: report.results.technical?.verdict,
    innovation: report.results.innovation?.verdict,
    risk: report.results.risk?.risk_level,
    legal: report.results.legal?.verdict,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Results Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e5e5] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs font-semibold text-blue-600 hover:underline">
                &larr; Analyze Another Idea
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Analysis Dashboard</h1>
            <p className="text-xs text-[#737373] font-mono">
              Report Generated on: {formatDate(report.timestamp)}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="rounded-md border border-[#d4d4d4] bg-white hover:bg-[#fafafa] text-[#171717] text-xs font-semibold py-2 px-3.5 shadow-sm transition-all"
            >
              🖨️ Print Report
            </button>
            <Link
              href="/"
              className="rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold py-2 px-3.5 shadow-sm transition-all text-center"
            >
              Analyze New Idea
            </Link>
          </div>
        </div>

        {/* User Idea Section */}
        <div className="bg-[#fafafa] border border-[#e5e5e5] rounded p-5">
          <h2 className="text-xs uppercase font-bold text-[#8e8e8e] tracking-wider mb-2">Submitted Concept</h2>
          <blockquote className="text-sm font-medium text-[#171717] border-l-2 border-[#d4d4d4] pl-4 italic whitespace-pre-wrap leading-relaxed">
            "{report.idea}"
          </blockquote>
        </div>

        {/* 1. Overall Score Summary Banner */}
        <OverallScore
          score={report.overallScore}
          verdict={report.verdict}
          explanation={report.explanation}
          isDemo={report.isDemo}
        />

        {/* 2. Core Scoring Metrics Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#171717]">Core Innovation Metrics</h3>
          <ScoreCard scores={scores} verdicts={verdicts} />
        </div>

        {/* 3. Detailed Agent Analysis Cards */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#171717]">Detailed Agent Evaluations</h3>
          <AgentResult results={report.results} errors={report.errors} />
        </div>
      </main>
    </div>
  );
}
