import React from 'react';
import { 
  Lightbulb, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck,
  AlertTriangle,
  Play
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { AIRecommendation } from '../types';

export const RecommendationsView: React.FC = () => {
  const { recommendations, executeRecommendation, setActiveTab } = useLabData();

  const getPriorityBadge = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">Critical Priority</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High Priority</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Medium Priority</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200">Advisory</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Lightbulb className="h-3.5 w-3.5" />
            Decision Support & Action Center
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            AI Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational recommendations synthesized from private laboratory data, inventory burn rates, and equipment schedules.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('what-if')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
        >
          <span>Run What-If Simulation First</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-5">
        {recommendations.map((rec) => {
          return (
            <div
              key={rec.recId}
              className={`rounded-xl border p-5 transition-all shadow-xs ${
                rec.executed
                  ? 'border-teal-300 bg-teal-50/20'
                  : rec.priority === 'Critical'
                  ? 'border-red-200 bg-white'
                  : 'border-slate-200 bg-white'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  {getPriorityBadge(rec.priority)}
                  <h3 className="text-base font-bold text-slate-900">{rec.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">ID: {rec.recId}</span>
                  {rec.executed && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Executed & Audited
                    </span>
                  )}
                </div>
              </div>

              {/* Problem & Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Problem Identified
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{rec.problem}</p>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Empirical Evidence
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">{rec.evidence}</p>
                </div>
              </div>

              {/* Supporting Data Key-Value Table */}
              <div className="mb-4">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Supporting Laboratory Data Points
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {Object.entries(rec.supportingData).map(([key, value]) => (
                    <div key={key} className="p-2 rounded-lg bg-white border border-slate-200 text-center">
                      <div className="text-[10px] text-slate-400 truncate">{key}</div>
                      <div className="text-xs font-bold text-slate-900 tabular-nums mt-0.5 truncate">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected Operational Effect */}
              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200/80 mb-4 text-xs flex items-start gap-2">
                <TrendingUp className="h-4 w-4 text-teal-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-teal-900">Projected Operational Benefit: </strong>
                  <span className="text-slate-700">{rec.expectedOperationalEffect}</span>
                </div>
              </div>

              {/* Footer / Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <div className="text-xs text-slate-600">
                  <strong>Recommended Action:</strong> {rec.recommendedAction}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => executeRecommendation(rec.recId)}
                    disabled={rec.executed}
                    className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition-all flex items-center gap-1.5 ${
                      rec.executed
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-teal-700 hover:bg-teal-800 text-white'
                    }`}
                  >
                    {rec.executed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Action Completed ✓</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>{rec.actionLabel}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
