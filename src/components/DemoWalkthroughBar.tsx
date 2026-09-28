import React from 'react';
import { 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Flame, 
  Sparkles, 
  Sliders, 
  ShieldCheck,
  Bot
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const DemoWalkthroughBar: React.FC = () => {
  const { 
    demoModeActive, 
    demoStep, 
    nextDemoStep, 
    prevDemoStep, 
    exitDemoMode,
    simulatedRestockItem
  } = useLabData();

  if (!demoModeActive) return null;

  const steps = [
    {
      num: 1,
      title: 'Step 1: Dashboard Brief',
      subtitle: 'Review operational KPIs and AI-detected morning priorities.',
      highlight: 'Notice 1,248 tests today, ₹3,84,600 revenue, and 4 proactive critical alerts.',
      phase: 'DATA'
    },
    {
      num: 2,
      title: 'Step 2: AI Risk Center',
      subtitle: 'Proactive detection of 25-OH Vitamin D Reagent stock depletion.',
      highlight: 'Stock is 18 units (threshold: 20 units). Burn rate is 31 units/week. Depletion in 4.1 days.',
      phase: 'RISK'
    },
    {
      num: 3,
      title: 'Step 3: Evidence & Explainability',
      subtitle: 'Drill down into transparent reasoning factors.',
      highlight: 'Explainable AI shows verified 30-day history, supplier 4-day delivery window, and lack of guesswork.',
      phase: 'EVIDENCE'
    },
    {
      num: 4,
      title: 'Step 4: Action Center & Audit Logging',
      subtitle: 'Execute recommended replenishment of 30 units.',
      highlight: 'Simulate the purchase order to observe real-time inventory restoration and sovereign audit trail entry.',
      phase: 'ACTION',
      actionBtn: {
        label: 'Order 30 Units (Simulate)',
        onClick: () => simulatedRestockItem('INV-101', 30)
      }
    },
    {
      num: 5,
      title: 'Step 5: What-If Simulation',
      subtitle: 'Simulate +25% volume surge and BIO-03 equipment maintenance.',
      highlight: 'Interactive slider simulates stress testing on turnaround times and secondary analyzer capacity.',
      phase: 'INSIGHT'
    },
    {
      num: 6,
      title: 'Step 6: Smart Lab Copilot',
      subtitle: 'Query the Sovereign AI assistant with strict clinical boundaries.',
      highlight: 'Interrogate the system for grounded evidence, direct actions, and sovereign data boundary citations.',
      phase: 'EVIDENCE'
    },
    {
      num: 7,
      title: 'Step 7: Sovereign Control Center',
      subtitle: 'Audit sovereign governance and data access policies.',
      highlight: 'Inspect data ownership policies, zero external leakage enforcement, and role-based access rules.',
      phase: 'ACTION'
    }
  ];

  const current = steps[demoStep - 1] || steps[0];

  const phases = ['DATA', 'INSIGHT', 'RISK', 'EVIDENCE', 'ACTION'];

  return (
    <div className="sticky top-16 z-25 border-b border-amber-200 bg-linear-to-r from-amber-50 via-teal-50 to-amber-50 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Left: Step Info & Badges */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 font-bold text-slate-950 shadow-xs">
            {demoStep}/7
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">{current.title}</span>
              <span className="rounded bg-amber-200/80 px-1.5 py-0.5 text-[10px] font-bold text-amber-900 tracking-wider">
                PHASE: {current.phase}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              {current.highlight}
            </p>
          </div>
        </div>

        {/* Center: Progress Pipeline (DATA -> INSIGHT -> RISK -> EVIDENCE -> ACTION) */}
        <div className="hidden lg:flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white/70 px-3 py-1.5 rounded-lg border border-slate-200/80">
          {phases.map((ph, idx) => {
            const isCompleted = phases.indexOf(current.phase) >= idx;
            const isCurrent = current.phase === ph;
            return (
              <React.Fragment key={ph}>
                <span className={`flex items-center gap-1 ${isCurrent ? 'text-teal-700 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                  {isCompleted ? <CheckCircle className="h-3 w-3 text-teal-600" /> : <span className="h-2 w-2 rounded-full bg-slate-300" />}
                  {ph}
                </span>
                {idx < phases.length - 1 && <span className="text-slate-300 mx-0.5">→</span>}
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Step Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {current.actionBtn && (
            <button
              onClick={current.actionBtn.onClick}
              className="px-2.5 py-1 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{current.actionBtn.label}</span>
            </button>
          )}

          <button
            onClick={prevDemoStep}
            disabled={demoStep === 1}
            className="p-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white rounded-lg border border-slate-200 transition-colors"
            title="Previous Step"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={nextDemoStep}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors"
          >
            <span>{demoStep === 7 ? 'Complete Demo' : 'Next Step'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button
            onClick={exitDemoMode}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            title="Exit Demo Mode"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
