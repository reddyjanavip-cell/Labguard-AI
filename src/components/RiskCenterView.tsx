import React, { useState } from 'react';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  FileSearch, 
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Terminal
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { AIRisk } from '../types';

export const RiskCenterView: React.FC = () => {
  const { risks, simulatedRestockItem, resolveRisk, setActiveTab, openInspectTrace } = useLabData();
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(risks[0]?.riskId || null);

  const selectedRisk = risks.find(r => r.riskId === selectedRiskId) || risks[0];

  const getSeverityBadge = (level: AIRisk['level']) => {
    switch (level) {
      case 'critical':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">🔴 CRITICAL</span>;
      case 'high':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">🟠 HIGH RISK</span>;
      case 'medium':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">🟡 MEDIUM</span>;
      case 'low':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">🟢 LOW / ADVISORY</span>;
    }
  };

  const handleAction = (risk: AIRisk) => {
    if (risk.actionType === 'restock') {
      simulatedRestockItem('INV-101', 30);
    } else {
      resolveRisk(risk.riskId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full mb-1">
            <AlertOctagon className="h-3.5 w-3.5" />
            Automatic Risk Detection Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Risk Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time proactive detection of inventory shortages, analyzer bottlenecks, and reagent expiration risks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Active Operational Risks:</span>
          <span className="rounded-lg bg-red-100 px-2.5 py-1 text-xs font-bold text-red-700 tabular-nums">
            {risks.length} Detected
          </span>
        </div>
      </div>

      {/* Main Grid: Left List + Right Detailed Explainable Trace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Risk Cards */}
        <div className="lg:col-span-5 space-y-3">
          {risks.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-teal-600 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-900">All Risks Mitigated</div>
              <p className="text-xs text-slate-500 mt-1">No active operational risks detected in current laboratory telemetry.</p>
            </div>
          ) : (
            risks.map((risk) => {
              const isSelected = risk.riskId === selectedRiskId;
              return (
                <div
                  key={risk.riskId}
                  onClick={() => setSelectedRiskId(risk.riskId)}
                  className={`rounded-xl border p-4 cursor-pointer transition-all text-left ${
                    isSelected
                      ? 'border-teal-600 bg-white shadow-md ring-1 ring-teal-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {getSeverityBadge(risk.level)}
                    <span className="text-[11px] font-mono text-slate-400">
                      {risk.confidence}% Model Confidence
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {risk.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                    {risk.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Category: {risk.category}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openInspectTrace(risk.riskId);
                      }}
                      className="text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 transition-colors"
                    >
                      Inspect Trace <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: EXPLAINABLE AI DEEP DIVE (WHAT HAPPENED? WHY? WHAT DATA? WHAT SHOULD I DO?) */}
        {selectedRisk && (
          <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  {getSeverityBadge(selectedRisk.level)}
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-600">
                    ID: {selectedRisk.riskId}
                  </span>
                  <button
                    type="button"
                    onClick={() => openInspectTrace(selectedRisk.riskId)}
                    className="ml-2 px-2.5 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-mono font-bold flex items-center gap-1 border border-blue-200 transition-colors"
                  >
                    <Terminal className="w-3 h-3 text-blue-600" />
                    <span>Inspect 9-Stage Pipeline</span>
                  </button>
                </div>
                <h2 className="text-lg font-bold text-slate-900">{selectedRisk.title}</h2>
                <div className="text-xs text-slate-500 mt-1">
                  Entity Monitored: <span className="font-semibold text-slate-800">{selectedRisk.evidence.itemOrEntity || 'Diagnostic Workstation'}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-teal-700 tabular-nums">{selectedRisk.confidence}%</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Model Confidence</div>
              </div>
            </div>

            {/* 4 CORE EXPLAINABLE AI SECTIONS */}
            <div className="space-y-5">
              {/* 1. What Happened? */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  <span className="h-2 w-2 rounded-full bg-slate-700" />
                  1. What Happened?
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedRisk.description}
                </p>
              </div>

              {/* 2. Why Did AI Flag It? */}
              <div className="rounded-lg bg-amber-50/60 p-3.5 border border-amber-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  2. Why Did the AI Engine Flag It?
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedRisk.reason}
                </p>
              </div>

              {/* 3. What Data Was Used? */}
              <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  <span className="h-2 w-2 rounded-full bg-teal-600" />
                  3. What Data Was Used in Calculation?
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {selectedRisk.evidence.currentStock !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Current Stock</span>
                      <strong className="text-slate-900 tabular-nums">{selectedRisk.evidence.currentStock} units</strong>
                    </div>
                  )}
                  {selectedRisk.evidence.reorderThreshold !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Reorder Threshold</span>
                      <strong className="text-slate-900 tabular-nums">{selectedRisk.evidence.reorderThreshold} units</strong>
                    </div>
                  )}
                  {selectedRisk.evidence.weeklyUsage !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Weekly Consumption</span>
                      <strong className="text-slate-900 tabular-nums">{selectedRisk.evidence.weeklyUsage} units/wk</strong>
                    </div>
                  )}
                  {selectedRisk.evidence.leadTimeDays !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Supplier Lead Time</span>
                      <strong className="text-slate-900 tabular-nums">{selectedRisk.evidence.leadTimeDays} days</strong>
                    </div>
                  )}
                  {selectedRisk.evidence.utilizationPercent !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Analyzer Utilization</span>
                      <strong className="text-red-600 tabular-nums">{selectedRisk.evidence.utilizationPercent}%</strong>
                    </div>
                  )}
                  {selectedRisk.evidence.pendingWorkload !== undefined && (
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-400 block">Pending Queue</span>
                      <strong className="text-amber-700 tabular-nums">{selectedRisk.evidence.pendingWorkload} tests</strong>
                    </div>
                  )}
                </div>

                {/* Factors list */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1">Grounded Trace Factors:</div>
                  <ul className="space-y-1">
                    {selectedRisk.factors.map((f, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-teal-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 4. What Should the User Do? */}
              <div className="rounded-lg bg-teal-50/70 p-4 border border-teal-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-900 uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-teal-600" />
                  4. What Action Should You Take?
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {selectedRisk.recommendation}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleAction(selectedRisk)}
                    className="px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{selectedRisk.actionLabel}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('what-if')}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition-colors"
                  >
                    Simulate What-If Impact
                  </button>
                </div>
              </div>
            </div>

            {/* Sovereign Notice Box */}
            <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-teal-600 shrink-0" />
              <span>
                <strong>Sovereign AI Decision Trace:</strong> Model outputs are mathematically grounded in NovaCare verified batch logs. No personal health records were shared externally.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
