'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navigation from '../../components/Navigation';
import HistoryList from '../../components/HistoryList';
import { AnalysisReport } from '../../types/analysis';

export default function HistoryPage() {
  const [reports, setReports] = useState<AnalysisReport[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('innovation_analyzer_history');
      if (stored) {
        setReports(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e);
    }
  }, []);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('innovation_analyzer_history');
      setReports([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-grow mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e5e5] pb-5">
          <div>
            <h1 className="text-2xl font-bold text-[#171717] tracking-tight">Analysis History</h1>
            <p className="text-xs text-[#737373]">
              Review previously computed business and technical idea evaluations.
            </p>
          </div>
          <Link
            href="/"
            className="inline-block rounded-md bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold py-2 px-4 shadow transition-colors text-center"
          >
            &larr; Return to Analyzer
          </Link>
        </div>

        {/* History Table List */}
        <div className="pt-2">
          <HistoryList reports={reports} onClearHistory={handleClearHistory} />
        </div>
      </main>
    </div>
  );
}
