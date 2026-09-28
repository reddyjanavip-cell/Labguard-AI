import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Target, 
  ArrowRight, 
  Play, 
  Lock, 
  Activity, 
  Database,
  Building2,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

interface LandingScreenProps {
  onEnter: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const { startDemoMode, setActiveTab } = useLabData();

  const handleStartDemo = () => {
    onEnter();
    startDemoMode();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Top Navigation */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold text-lg shadow-sm">
            LG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white">LABGUARD AI</span>
              <span className="rounded bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
                Sovereign AI Domain
              </span>
            </div>
            <div className="text-xs text-slate-400">Private Laboratory Intelligence Platform</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleStartDemo}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shadow-sm"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>🎯 3-Min Hackathon Demo</span>
          </button>
          <button
            onClick={onEnter}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-500 transition-colors"
          >
            <span>Enter Laboratory</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brief & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/40 px-3.5 py-1 text-xs font-medium text-teal-300">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Sovereign AI for Diagnostic Laboratory Operations
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Private Data. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300">
                  Explainable AI.
                </span> <br />
                Better Laboratory Decisions.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Turn private laboratory data into secure, explainable, and actionable decisions without exposing patient or reagent telemetry to external unauthorized entities.
              </p>
            </div>

            {/* Core Pipeline Micro-Diagram */}
            <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-mono text-slate-300 flex flex-wrap items-center gap-2">
              <span className="text-teal-400 font-semibold">LAB DATA</span>
              <span>→</span>
              <span className="text-cyan-400 font-semibold">PRIVATE PROCESSING</span>
              <span>→</span>
              <span className="text-sky-400 font-semibold">AI ANALYSIS</span>
              <span>→</span>
              <span className="text-amber-400 font-semibold">RISK DETECTION</span>
              <span>→</span>
              <span className="text-indigo-400 font-semibold">EXPLAINABLE AI</span>
              <span>→</span>
              <span className="text-emerald-400 font-semibold">ACTION</span>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onEnter}
                className="flex items-center gap-2 rounded-xl bg-teal-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-teal-400 shadow-lg shadow-teal-500/20 transition-all"
              >
                <span>Launch NovaCare Operating Platform</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                onClick={handleStartDemo}
                className="flex items-center gap-2 rounded-xl border border-amber-400/40 bg-amber-500/10 px-5 py-3 text-sm font-bold text-amber-300 hover:bg-amber-500/20 transition-all"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>Run 3-Minute Hackathon Demo</span>
              </button>
            </div>

            {/* Fictional Diagnostic Entity Details */}
            <div className="pt-4 flex items-center gap-4 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-teal-400" />
                <span className="text-slate-200 font-medium">NovaCare Diagnostics Laboratory</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Prototype Sovereign AI Governance Layer</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Live Card Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
              <img
                src="/src/assets/images/hero_lab_diagnostics_1790181750611.jpg"
                alt="NovaCare Clinical Diagnostics Laboratory"
                className="w-full h-64 object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Inset Sovereign Risk Card */}
              <div className="p-5 relative -mt-16 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 m-3 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
                      Proactive Risk Detected
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">96% Model Confidence</span>
                </div>

                <div className="text-sm font-bold text-white">
                  25-OH Vitamin D Reagent Depletion in 4.1 Days
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">Physical Stock</div>
                    <div className="text-sm font-bold text-red-400 tabular-nums">18 units</div>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">Weekly Burn</div>
                    <div className="text-sm font-bold text-amber-300 tabular-nums">31 units</div>
                  </div>
                  <div className="rounded-lg bg-slate-800/80 p-2 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">Lead Time</div>
                    <div className="text-sm font-bold text-slate-200 tabular-nums">4 days</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-teal-950/50 border border-teal-800/60 p-2.5 rounded-lg flex items-center justify-between">
                  <span>💡 Recommended: Order 30 units from Abbott Diagnostics</span>
                  <button
                    onClick={handleStartDemo}
                    className="shrink-0 text-[11px] font-bold text-teal-400 hover:text-teal-300 underline"
                  >
                    Simulate Action →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillar Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-3 hover:border-teal-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white">🔒 PRIVATE PROCESSING</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Laboratory-controlled sovereign data governance. Role-based access ensures sensitive patient and diagnostic tests never leave local boundaries.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-3 hover:border-cyan-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white">🧠 EXPLAINABLE AI ANALYSIS</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transparent operational risk detection. Every forecast traces directly to verified stock levels, analyzer utilization gauges, and supplier lead times.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-6 space-y-3 hover:border-amber-500/40 transition-colors">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold text-white">🎯 ACTIONABLE DECISIONS</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Simulate workload shifts and purchase orders in real time. Stress test capacity under volume surges before committing lab resources.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
        <p>LABGUARD AI · Prototype Sovereign AI Governance Layer for Private Diagnostic Laboratories · NovaCare Diagnostics Laboratory</p>
      </footer>
    </div>
  );
};
