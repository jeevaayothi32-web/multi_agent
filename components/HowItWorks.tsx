'use client';

export default function HowItWorks() {
  const steps = [
    { num: '01', title: 'User Idea', desc: 'Raw text description' },
    { num: '02', title: 'Input Processing', desc: 'Context validation' },
    { num: '03', title: '7 Specialized Agents', desc: 'Concurrent analysis' },
    { num: '04', title: 'Parallel Analysis', desc: 'Asynchronous streaming' },
    { num: '05', title: 'Score Aggregation', desc: 'Mathematical averaging' },
    { num: '06', title: 'Overall Score', desc: 'Score & potential level' },
    { num: '07', title: 'Detailed Report', desc: 'Expandable breakdowns' }
  ];

  return (
    <section className="bg-white border border-[#e5e5e5] rounded-lg p-6 shadow-sm">
      <h2 className="text-base font-semibold text-[#171717] mb-4">Multi-Agent Architecture Flow</h2>
      
      {/* Visual Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        {steps.map((step, index) => (
          <div key={step.num} className="relative flex flex-col items-center">
            {/* Step Card */}
            <div className="w-full flex flex-col items-center p-3 rounded border border-[#e5e5e5] bg-[#fafafa] text-center hover:border-[#cbd5e1] transition-all min-h-[96px] justify-center">
              <span className="text-[10px] font-mono font-bold text-[#3b82f6] mb-1">{step.num}</span>
              <h3 className="text-xs font-semibold text-[#171717] leading-tight mb-0.5">{step.title}</h3>
              <p className="text-[10px] text-[#6b7280] leading-normal">{step.desc}</p>
            </div>

            {/* Connection Arrow (Except last) */}
            {index < steps.length - 1 && (
              <>
                {/* Desktop Arrow */}
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <svg className="w-2.5 h-2.5 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Mobile Arrow */}
                <div className="block md:hidden my-1">
                  <svg className="w-3.5 h-3.5 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
      
      <p className="text-xs text-[#6b7280] mt-4 leading-relaxed text-center italic border-t border-[#e5e5e5] pt-3">
        Note: The 7 agents (Feasibility, Market, Technical, Innovation, Risk, Legal, and Suggestions) run in <b>parallel</b> to eliminate sequential roundtrip delays.
      </p>
    </section>
  );
}
