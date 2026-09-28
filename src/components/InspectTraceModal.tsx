import React, { useState, useEffect } from 'react';
import { useLabData } from '../context/LabDataContext';
import { useLanguage } from '../context/LanguageContext';
import { TraceRecord, TraceStep } from '../types';
import { X, CheckCircle2, AlertTriangle, XCircle, Search, Terminal, ArrowRight, ShieldCheck, Download, RefreshCw, Layers } from 'lucide-react';

export const InspectTraceModal: React.FC = () => {
  const { inspectTraceEntityId, inspectTraceModalOpen, closeInspectTrace } = useLabData();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [traceData, setTraceData] = useState<TraceRecord | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<string>('All');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!inspectTraceModalOpen || !inspectTraceEntityId) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/trace/${inspectTraceEntityId}`)
      .then(res => res.json())
      .then((data: TraceRecord) => {
        if (isMounted) {
          setTraceData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load trace:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [inspectTraceEntityId, inspectTraceModalOpen]);

  if (!inspectTraceModalOpen) return null;

  const handleDownloadTrace = () => {
    if (!traceData) return;
    const blob = new Blob([JSON.stringify(traceData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trace-${traceData.triggerEntityId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const steps = traceData?.steps || [];
  const filteredSteps = activeStageFilter === 'All' 
    ? steps 
    : steps.filter(s => s.stage.toLowerCase().includes(activeStageFilter.toLowerCase()));

  const getStatusIcon = (status: TraceStep['status']) => {
    switch (status) {
      case 'PASSED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-rose-500" />;
    }
  };

  const getStatusBadge = (status: TraceStep['status']) => {
    switch (status) {
      case 'PASSED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WARNING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FAILED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl max-w-4xl w-full text-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                  System Pipeline Data Lineage & Inspect Trace
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  {inspectTraceEntityId}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                9-Stage Sovereign Processing Pipeline · Verifiable Chain of Custody & Evidence
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownloadTrace}
              disabled={!traceData}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-all disabled:opacity-50"
              title="Download Trace JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
            <button
              type="button"
              onClick={closeInspectTrace}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trace Status Summary */}
        {traceData && (
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-slate-400">Execution Status: </span>
                <span className="font-bold text-emerald-400 font-mono">{traceData.status}</span>
              </div>
              <div>
                <span className="text-slate-400">Stages Passed: </span>
                <span className="font-mono text-slate-200">{steps.length} / 9 stages</span>
              </div>
              <div>
                <span className="text-slate-400">Timestamp: </span>
                <span className="font-mono text-slate-300">{traceData.timestamp}</span>
              </div>
            </div>

            {/* Filter pills */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              {['All', 'Validation', 'Risk', 'AI', 'Recommendation'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveStageFilter(f)}
                  className={`px-2 py-0.5 rounded transition-all ${
                    activeStageFilter === f
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3 font-sans">
          {loading ? (
            <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              <p className="text-xs">Reconstructing pipeline trace from sovereign audit memory...</p>
            </div>
          ) : !traceData || filteredSteps.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              No trace telemetry recorded for entity {inspectTraceEntityId}.
            </div>
          ) : (
            filteredSteps.map((step, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 transition-all hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">{getStatusIcon(step.status)}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-100">{step.stage}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-mono border ${getStatusBadge(step.status)}`}>
                            {step.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Stage {idx + 1}/9
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 font-medium">
                          {step.processingStage}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
                          <span>Source: <strong className="text-slate-300">{step.source}</strong></span>
                          <span>Entity: <strong className="text-blue-400">{step.relevantEntity}</strong></span>
                          <span>Time: {step.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-all font-mono"
                    >
                      {isExpanded ? 'Hide Payload' : 'Inspect I/O'}
                    </button>
                  </div>

                  {/* Expanded Payload */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                          <span>STAGE INPUT</span>
                        </div>
                        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-x-auto whitespace-pre-wrap max-h-40">
                          {step.input}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 font-mono">
                          <span>STAGE OUTPUT & EVIDENCE</span>
                        </div>
                        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-blue-300 overflow-x-auto whitespace-pre-wrap max-h-40">
                          {step.output}
                        </div>
                      </div>

                      {step.details && (
                        <div className="md:col-span-2 mt-1">
                          <span className="text-[11px] text-slate-400 font-mono">INTERNAL VERIFICATION METRICS:</span>
                          <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[10px] text-slate-300 font-mono mt-1 overflow-x-auto">
                            {JSON.stringify(step.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Cryptographically sealed audit trail · Immutable trace</span>
          </div>
          <button
            type="button"
            onClick={closeInspectTrace}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
