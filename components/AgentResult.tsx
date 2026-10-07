'use client';

import React, { useState } from 'react';
import { AgentResultsMap, AgentErrorsMap } from '../types/analysis';

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

function AccordionItem({ title, isOpen, onToggle, icon, badge, badgeColor, children }: AccordionItemProps) {
  return (
    <div className="border border-[#e5e5e5] rounded bg-white overflow-hidden shadow-sm transition-all hover:border-[#cbd5e1]">
      {/* Header Bar */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-[#171717] bg-white transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-semibold">{title}</span>
          {badge && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase border ${badgeColor || 'bg-[#f3f4f6] text-[#4b5563] border-[#e5e7eb]'}`}>
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 text-[#737373] transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body Content */}
      <div
        className={`transition-all duration-300 ease-in-out border-t border-[#e5e5e5] ${
          isOpen ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <div className="p-5 bg-[#fafafa] space-y-4 text-sm text-[#404040]">
          {children}
        </div>
      </div>
    </div>
  );
}

interface AgentResultProps {
  results: AgentResultsMap;
  errors: AgentErrorsMap;
}

export default function AgentResult({ results, errors }: AgentResultProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    feasibility: true, // Keep feasibility open by default
    suggestion: true,  // Keep suggestions open by default
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const hasData = (key: keyof AgentResultsMap) => {
    return !!results[key] && !errors[key];
  };

  const getScoreBadge = (score?: number) => {
    if (typeof score !== 'number') return undefined;
    if (score >= 80) return { text: `${score}/100`, color: 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]' };
    if (score >= 60) return { text: `${score}/100`, color: 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]' };
    return { text: `${score}/100`, color: 'bg-[#fff5f5] text-[#b91c1c] border-[#fecaca]' };
  };

  return (
    <div className="space-y-4">
      {/* 1. FEASIBILITY ANALYSIS */}
      <AccordionItem
        title="Feasibility Analysis"
        isOpen={openSections.feasibility}
        onToggle={() => toggleSection('feasibility')}
        icon="⚙️"
        badge={getScoreBadge(results.feasibility?.score)?.text}
        badgeColor={getScoreBadge(results.feasibility?.score)?.color}
      >
        {errors.feasibility ? (
          <div className="text-red-500 text-xs py-1">⚠️ Feasibility analysis was unavailable: {errors.feasibility}</div>
        ) : hasData('feasibility') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.feasibility!.verdict}</p>
            <p className="leading-relaxed">{results.feasibility!.analysis}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-emerald-700 mb-2">Key Feasibility Strengths</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.feasibility!.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-amber-700 mb-2">Operational Bottlenecks / Weaknesses</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.feasibility!.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] pt-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Feasibility Recommendations</h4>
              <ul className="list-decimal pl-4 space-y-1.5 text-xs">
                {results.feasibility!.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No feasibility data.</p>
        )}
      </AccordionItem>

      {/* 2. MARKET ANALYSIS */}
      <AccordionItem
        title="Market Potential Analysis"
        isOpen={openSections.market}
        onToggle={() => toggleSection('market')}
        icon="📈"
        badge={getScoreBadge(results.market?.score)?.text}
        badgeColor={getScoreBadge(results.market?.score)?.color}
      >
        {errors.market ? (
          <div className="text-red-500 text-xs py-1">⚠️ Market analysis was unavailable: {errors.market}</div>
        ) : hasData('market') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.market!.verdict}</p>
            <p className="leading-relaxed">{results.market!.analysis}</p>
            
            <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Target Customer Segments</h4>
              <div className="flex flex-wrap gap-2">
                {results.market!.target_users.map((user, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb] rounded text-xs font-medium">
                    {user}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-emerald-700 mb-2">Market Advantages</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.market!.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-amber-700 mb-2">Entry Barriers / Threats</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.market!.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] pt-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Market recommendations</h4>
              <ul className="list-decimal pl-4 space-y-1.5 text-xs">
                {results.market!.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <p className="text-[10px] text-[#8e8e8e] italic mt-2 border-t border-[#e5e5e5] pt-2">
              Note: Market insights are AI-modeled projections based on available pre-trained repository knowledge, not live search.
            </p>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No market data.</p>
        )}
      </AccordionItem>

      {/* 3. TECHNICAL ANALYSIS */}
      <AccordionItem
        title="Technical Implementation Analysis"
        isOpen={openSections.technical}
        onToggle={() => toggleSection('technical')}
        icon="💻"
        badge={getScoreBadge(results.technical?.score)?.text}
        badgeColor={getScoreBadge(results.technical?.score)?.color}
      >
        {errors.technical ? (
          <div className="text-red-500 text-xs py-1">⚠️ Technical analysis was unavailable: {errors.technical}</div>
        ) : hasData('technical') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.technical!.verdict}</p>
            <p className="leading-relaxed">{results.technical!.analysis}</p>
            
            <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Suggested Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {results.technical!.suggested_technologies.map((tech, i) => (
                  <span key={i} className="px-2.5 py-1 bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] rounded text-xs font-semibold">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
              <h4 className="text-xs uppercase font-bold text-[#b91c1c] mb-2">Technical Execution Risks</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs">
                {results.technical!.technical_risks.map((tr, i) => <li key={i}>{tr}</li>)}
              </ul>
            </div>

            <div className="border-t border-[#e5e5e5] pt-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Engineering & Architectural Guidance</h4>
              <ul className="list-decimal pl-4 space-y-1.5 text-xs">
                {results.technical!.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No technical data.</p>
        )}
      </AccordionItem>

      {/* 4. INNOVATION ANALYSIS */}
      <AccordionItem
        title="Innovation & Differentiation Analysis"
        isOpen={openSections.innovation}
        onToggle={() => toggleSection('innovation')}
        icon="💡"
        badge={getScoreBadge(results.innovation?.score)?.text}
        badgeColor={getScoreBadge(results.innovation?.score)?.color}
      >
        {errors.innovation ? (
          <div className="text-red-500 text-xs py-1">⚠️ Innovation analysis was unavailable: {errors.innovation}</div>
        ) : hasData('innovation') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.innovation!.verdict}</p>
            <p className="leading-relaxed">{results.innovation!.analysis}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-emerald-700 mb-2">Unique Innovations</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.innovation!.strengths.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-amber-700 mb-2">Defensibility Gaps</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.innovation!.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] pt-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Recommendations for Uniqueness</h4>
              <ul className="list-decimal pl-4 space-y-1.5 text-xs">
                {results.innovation!.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No innovation data.</p>
        )}
      </AccordionItem>

      {/* 5. RISK ANALYSIS */}
      <AccordionItem
        title="Risk & Safety Analysis"
        isOpen={openSections.risk}
        onToggle={() => toggleSection('risk')}
        icon="⚠️"
        badge={results.risk ? `${results.risk.score}/100 (${results.risk.risk_level})` : undefined}
        badgeColor={
          results.risk?.score && results.risk.score >= 80
            ? 'bg-[#ecfdf5] text-[#047857] border-[#a7f3d0]'
            : results.risk?.score && results.risk.score >= 60
            ? 'bg-[#fff7ed] text-[#c2410c] border-[#fed7aa]'
            : 'bg-[#fff5f5] text-[#b91c1c] border-[#fecaca]'
        }
      >
        {errors.risk ? (
          <div className="text-red-500 text-xs py-1">⚠️ Risk analysis was unavailable: {errors.risk}</div>
        ) : hasData('risk') ? (
          <>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold text-[#737373]">Calculated Risk Level:</span>
              <span className="text-xs font-semibold text-[#171717]">{results.risk!.risk_level}</span>
            </div>
            <p className="leading-relaxed">{results.risk!.analysis}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-red-700 mb-2">Major Security & Threat Vectors</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.risk!.major_risks.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-emerald-700 mb-2">Recommended Mitigation Strategies</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.risk!.mitigations.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No risk data.</p>
        )}
      </AccordionItem>

      {/* 6. LEGAL & COMPLIANCE ANALYSIS */}
      <AccordionItem
        title="Legal & Regulatory Analysis"
        isOpen={openSections.legal}
        onToggle={() => toggleSection('legal')}
        icon="⚖️"
        badge={getScoreBadge(results.legal?.score)?.text}
        badgeColor={getScoreBadge(results.legal?.score)?.color}
      >
        {errors.legal ? (
          <div className="text-red-500 text-xs py-1">⚠️ Legal analysis was unavailable: {errors.legal}</div>
        ) : hasData('legal') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.legal!.verdict}</p>
            <p className="leading-relaxed">{results.legal!.analysis}</p>
            
            <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
              <h4 className="text-xs uppercase font-bold text-[#b91c1c] mb-2">Identified Compliance / Privacy Concerns</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs">
                {results.legal!.concerns.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>

            <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
              <h4 className="text-xs uppercase font-bold text-emerald-700 mb-2">Recommended Compliance Steps</h4>
              <ul className="list-disc pl-4 space-y-1.5 text-xs">
                {results.legal!.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>

            <div className="text-[11px] text-[#737373] bg-[#f5f5f5] border border-[#e5e5e5] rounded px-3 py-2 italic">
              ⚖️ <strong>Disclaimer:</strong> AI-generated legal insights are informational and are not professional legal advice. Consult certified legal counsel before launching.
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No legal data.</p>
        )}
      </AccordionItem>

      {/* 7. REFINEMENTS & SUGGESTIONS */}
      <AccordionItem
        title="Refinements & Recommendations"
        isOpen={openSections.suggestion}
        onToggle={() => toggleSection('suggestion')}
        icon="🌟"
        badge="Recommendations"
        badgeColor="bg-blue-50 text-blue-700 border-blue-100"
      >
        {errors.suggestion ? (
          <div className="text-red-500 text-xs py-1">⚠️ Suggestion analysis was unavailable: {errors.suggestion}</div>
        ) : hasData('suggestion') ? (
          <>
            <p className="font-normal italic leading-relaxed text-[#171717]">{results.suggestion!.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-blue-700 mb-2">Practical Improvements</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.suggestion!.improvements.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              <div className="bg-white border border-[#e5e5e5] rounded p-3.5">
                <h4 className="text-xs uppercase font-bold text-purple-700 mb-2">Additional Features to Consider</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs">
                  {results.suggestion!.recommended_features.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            </div>

            <div className="border-t border-[#e5e5e5] pt-3.5">
              <h4 className="text-xs uppercase font-bold text-[#171717] mb-2">Immediate Next Steps / Milestones</h4>
              <ul className="list-decimal pl-4 space-y-1.5 text-xs">
                {results.suggestion!.next_steps.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </>
        ) : (
          <p className="text-xs text-[#a3a3a3] italic">No suggestion data.</p>
        )}
      </AccordionItem>
    </div>
  );
}
