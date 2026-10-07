'use client';

import React from 'react';
import Link from 'next/link';
import { AnalysisReport } from '../types/analysis';
import { formatDate } from '../lib/utils/helpers';

interface HistoryListProps {
  reports: AnalysisReport[];
  onClearHistory: () => void;
}

export default function HistoryList({ reports, onClearHistory }: HistoryListProps) {
  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'High Potential':
        return 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';
      case 'Moderate Potential':
        return 'bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]';
      case 'Needs Improvement':
      default:
        return 'bg-[#fff5f5] text-[#9b1c1c] border-[#fecaca]';
    }
  };

  if (reports.length === 0) {
    return (
      <div className="text-center p-8 bg-white border border-[#e5e5e5] rounded-lg shadow-sm">
        <p className="text-sm text-[#6b7280]">No analysis history found.</p>
        <p className="text-xs text-[#a3a3a3] mt-1">Submit an idea above to generate your first analysis report.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e5e5e5] rounded-lg shadow-sm overflow-hidden">
      {/* Title Header */}
      <div className="px-5 py-4 border-b border-[#e5e5e5] flex items-center justify-between bg-[#fafafa]">
        <div>
          <h2 className="text-sm font-semibold text-[#171717]">Previous Analyses</h2>
          <p className="text-xs text-[#6b7280]">Locally saved reports ({reports.length})</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear your local analysis history? This action cannot be undone.')) {
              onClearHistory();
            }
          }}
          className="text-xs font-semibold text-red-600 hover:text-red-700 border border-transparent hover:border-red-200 hover:bg-red-50 rounded px-2.5 py-1 transition-all"
        >
          Clear History
        </button>
      </div>

      {/* History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#171717]">
          <thead className="bg-[#f9fafb] text-xs font-bold uppercase text-[#737373] border-b border-[#e5e5e5] font-mono">
            <tr>
              <th className="px-5 py-3">Date / Time</th>
              <th className="px-5 py-3">Submitted Idea</th>
              <th className="px-5 py-3 text-center">Score</th>
              <th className="px-5 py-3 text-center">Verdict</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-[#fafafa] transition-colors">
                {/* Date */}
                <td className="px-5 py-4 whitespace-nowrap text-xs text-[#737373] font-mono">
                  {formatDate(report.timestamp)}
                </td>

                {/* Idea snippet */}
                <td className="px-5 py-4 font-normal text-[#171717] max-w-[200px] sm:max-w-xs truncate">
                  {report.idea}
                </td>

                {/* Score */}
                <td className="px-5 py-4 text-center font-bold font-mono text-sm">
                  {report.overallScore}
                </td>

                {/* Verdict Badge */}
                <td className="px-5 py-4 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getVerdictStyle(report.verdict)}`}>
                    {report.verdict}
                  </span>
                </td>

                {/* Action Link */}
                <td className="px-5 py-4 text-right whitespace-nowrap text-xs">
                  <Link
                    href={`/results/${report.id}`}
                    className="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    View Report &rarr;
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
