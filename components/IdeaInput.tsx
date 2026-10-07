'use client';

import React, { useState } from 'react';
import { DEMO_IDEA } from '../lib/ai/fallback';

interface IdeaInputProps {
  onSubmit: (idea: string) => void;
  isLoading: boolean;
}

export default function IdeaInput({ onSubmit, isLoading }: IdeaInputProps) {
  const [idea, setIdea] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmed = idea.trim();
    if (!trimmed) {
      setError('Please describe your idea before starting the analysis.');
      return;
    }

    if (trimmed.length < 20) {
      setError('Please provide a slightly more descriptive explanation of your idea (minimum 20 characters) for a meaningful analysis.');
      return;
    }

    onSubmit(trimmed);
  };

  const handleDemoTrigger = () => {
    setError('');
    setIdea(DEMO_IDEA);
    onSubmit(DEMO_IDEA);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        {/* Label & Description */}
        <div>
          <label htmlFor="idea-description" className="block text-sm font-semibold text-[#171717] mb-1">
            Describe your business or technical idea
          </label>
          <p className="text-xs text-[#6b7280]">
            Provide a clear description of the problem you are solving, how it works, and your target audience.
          </p>
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            id="idea-description"
            rows={6}
            className={`w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-[#171717] placeholder-[#a3a3a3] shadow-inner focus:outline-none focus:ring-1 focus:ring-[#3b82f6] ${
              error ? 'border-red-300 focus:ring-red-400' : 'border-[#d4d4d4] focus:border-[#3b82f6]'
            } disabled:bg-[#f5f5f5] disabled:text-[#737373]`}
            placeholder="For example: An AI-powered application that tracks domestic water consumption through smart pipe attachments and recommends daily water-saving milestones..."
            value={idea}
            onChange={(e) => {
              setIdea(e.target.value);
              if (error) setError('');
            }}
            disabled={isLoading}
          />
        </div>

        {/* Validation Errors & Counters */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-red-500 font-medium">{error}</span>
          <span className="text-[#a3a3a3] font-mono">
            {idea.length} characters
          </span>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 rounded-md bg-[#171717] hover:bg-[#262626] text-white text-sm font-semibold py-2.5 px-4 shadow transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Running Parallel Agents...
              </>
            ) : (
              'Analyze Idea'
            )}
          </button>

          <button
            type="button"
            onClick={handleDemoTrigger}
            disabled={isLoading}
            className="rounded-md border border-[#d4d4d4] hover:bg-[#fafafa] text-[#171717] text-sm font-semibold py-2.5 px-4 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Demo Idea
          </button>
        </div>
      </div>
    </form>
  );
}
