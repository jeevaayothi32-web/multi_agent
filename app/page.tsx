'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import HowItWorks from '../components/HowItWorks';
import IdeaInput from '../components/IdeaInput';
import AnalysisProgress, { AgentStatusMap } from '../components/AnalysisProgress';
import HistoryList from '../components/HistoryList';
import { AnalysisReport, ProgressEvent, AgentResultsMap, AgentErrorsMap, AgentName } from '../types/analysis';
import { calculateOverallScore, getVerdict, generateExplanation } from '../lib/utils/helpers';

const initialStatuses: AgentStatusMap = {
  feasibility: 'idle',
  market: 'idle',
  technical: 'idle',
  innovation: 'idle',
  risk: 'idle',
  legal: 'idle',
  suggestion: 'idle',
};

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<AgentStatusMap>(initialStatuses);
  const [agentErrors, setAgentErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<AnalysisReport[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('innovation_analyzer_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage:', e);
    }
  }, []);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('innovation_analyzer_history');
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history:', e);
    }
  };

  const handleAnalyzeIdea = async (idea: string) => {
    setIsLoading(true);
    setError('');
    setAgentErrors({});
    setAgentStatuses(initialStatuses);

    const tempResults: AgentResultsMap = {};
    const tempErrors: AgentErrorsMap = {};
    const analysisId = `analysis-${Date.now()}`;

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server error starting analysis.');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Your browser does not support response streaming.');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Hold the last potentially partial line

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const dataStr = trimmed.slice(6);
            const event: ProgressEvent = JSON.parse(dataStr);

            setAgentStatuses((prev) => ({
              ...prev,
              [event.agent]: event.type === 'start' ? 'running' : event.type === 'success' ? 'success' : 'error',
            }));

            if (event.type === 'success') {
              tempResults[event.agent] = event.result;
            } else if (event.type === 'error') {
              const errMsg = event.error || 'Analysis agent failed';
              tempErrors[event.agent] = errMsg;
              setAgentErrors((prev) => ({ ...prev, [event.agent]: errMsg }));
            }
          } catch (e) {
            console.error('Error parsing line data:', trimmed, e);
          }
        }
      }

      // Check if we received at least some successful results
      const totalAgents = 7;
      const successCount = Object.keys(tempResults).length;
      const errorCount = Object.keys(tempErrors).length;

      if (successCount === 0) {
        throw new Error('All analysis agents failed to execute. Please verify your OpenRouter API key configurations.');
      }

      // Calculate aggregates
      const calculatedScore = calculateOverallScore({
        feasibility: tempResults.feasibility?.score,
        market: tempResults.market?.score,
        technical: tempResults.technical?.score,
        innovation: tempResults.innovation?.score,
        risk: tempResults.risk?.score,
        legal: tempResults.legal?.score,
      });

      const calculatedVerdict = getVerdict(calculatedScore);
      const programExplanation = generateExplanation(tempResults);

      const newReport: AnalysisReport = {
        id: analysisId,
        idea: idea,
        timestamp: new Date().toISOString(),
        overallScore: calculatedScore,
        verdict: calculatedVerdict,
        explanation: programExplanation,
        results: tempResults,
        errors: tempErrors,
        isDemo: idea.trim().toLowerCase().includes('reduce food waste'), // Mark as demo if matching food waste
      };

      // Save to local storage history
      const currentHistory = [...history];
      currentHistory.unshift(newReport);
      localStorage.setItem('innovation_analyzer_history', JSON.stringify(currentHistory));
      setHistory(currentHistory);

      // Route to results
      router.push(`/results/${analysisId}`);
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during analysis.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-2 py-4">
          <h1 className="text-3xl font-extrabold text-[#171717] sm:text-4xl tracking-tight">
            AI Multi-Agent Innovation Analyzer
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#6b7280]">
            Submit a concept to trigger 7 specialized parallel AI agents. Get immediate metric scoring, risk analysis, compliance feedback, and actionable product next steps.
          </p>
        </div>

        {/* How It Works Diagram */}
        <HowItWorks />

        {/* General Error Banner */}
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <div className="flex gap-2">
              <span>❌</span>
              <div>
                <p className="font-semibold">Analysis Failed</p>
                <p className="mt-1 text-xs text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Input & Progress Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <IdeaInput onSubmit={handleAnalyzeIdea} isLoading={isLoading} />
          </div>
          <div className="lg:col-span-5">
            {isLoading ? (
              <AnalysisProgress statuses={agentStatuses} errors={agentErrors} />
            ) : (
              <div className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm text-center space-y-3">
                <div className="text-3xl">🤖</div>
                <h3 className="text-sm font-semibold text-[#171717]">Ready for Analysis</h3>
                <p className="text-xs text-[#6b7280]">
                  Enter your idea description in the input box and click <strong>Analyze Idea</strong> to begin. The process takes approximately 10-15 seconds.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Browser Section */}
        <div className="border-t border-[#e5e5e5] pt-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-[#171717]">Recent Analysis Reports</h2>
            <p className="text-xs text-[#6b7280]">Browse and review prior innovation scores cached on this browser.</p>
          </div>
          <HistoryList reports={history} onClearHistory={handleClearHistory} />
        </div>
      </main>
    </div>
  );
}
