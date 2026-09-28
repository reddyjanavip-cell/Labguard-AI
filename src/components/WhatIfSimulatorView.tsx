import React from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  AlertTriangle, 
  Clock, 
  Activity, 
  Boxes, 
  Users, 
  Cpu, 
  Zap, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const WhatIfSimulatorView: React.FC = () => {
  const { whatIf, setWhatIf, calculatedSimulation, setActiveTab } = useLabData();

  const handlePreset = (preset: 'baseline' | 'surge' | 'analyzer_down' | 'weekend') => {
    switch (preset) {
      case 'baseline':
        setWhatIf({
          volumeMultiplier: 1.0,
          staffAvailabilityMultiplier: 1.0,
          analyzerOffline: false,
          inventoryLevel: 'current'
        });
        break;
      case 'surge':
        setWhatIf({
          volumeMultiplier: 1.25,
          staffAvailabilityMultiplier: 1.0,
          analyzerOffline: false,
          inventoryLevel: 'current'
        });
        break;
      case 'analyzer_down':
        setWhatIf({
          volumeMultiplier: 1.0,
          staffAvailabilityMultiplier: 1.0,
          analyzerOffline: true,
          inventoryLevel: 'current'
        });
        break;
      case 'weekend':
        setWhatIf({
          volumeMultiplier: 0.9,
          staffAvailabilityMultiplier: 0.8,
          analyzerOffline: false,
          inventoryLevel: 'reduced'
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Decision Stress-Testing Simulator
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            What-If Scenario Simulator
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Model volume surges, staffing constraints, and equipment downtime before committing laboratory resources.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Presets:</span>
          <button
            onClick={() => handlePreset('baseline')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
              whatIf.volumeMultiplier === 1.0 && !whatIf.analyzerOffline
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => handlePreset('surge')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
              whatIf.volumeMultiplier === 1.25
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            +25% Surge
          </button>
          <button
            onClick={() => handlePreset('analyzer_down')}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors border ${
              whatIf.analyzerOffline
                ? 'bg-red-700 text-white border-red-700'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            BIO-03 Offline
          </button>
          <button
            onClick={() => handlePreset('weekend')}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Weekend Shift
          </button>
        </div>
      </div>

      {/* Grid: Left Controls (Inputs) + Right Live Projections (Outputs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Column */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Simulation Variables</h2>
            <button
              onClick={() => handlePreset('baseline')}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Variable 1: Test Volume Multiplier */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Activity className="h-4 w-4 text-teal-600" />
                Test Volume Modifier
              </span>
              <span className="font-bold text-teal-800 tabular-nums">
                {whatIf.volumeMultiplier === 1.0 ? 'Nominal (100%)' : `+${Math.round((whatIf.volumeMultiplier - 1.0) * 100)}%`}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {[1.0, 1.1, 1.25, 1.5].map((val) => (
                <button
                  key={val}
                  onClick={() => setWhatIf(prev => ({ ...prev, volumeMultiplier: val }))}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    whatIf.volumeMultiplier === val
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {val === 1.0 ? 'Normal' : `+${Math.round((val - 1.0) * 100)}%`}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Simulates seasonal viral surges or regional diagnostic campaigns.
            </div>
          </div>

          {/* Variable 2: Staff Availability */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-teal-600" />
                Staff On-Duty Availability
              </span>
              <span className="font-bold text-slate-800 tabular-nums">
                {Math.round(whatIf.staffAvailabilityMultiplier * 100)}% Staffing
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: '-20% (Shortage)', val: 0.8 },
                { label: 'Normal (100%)', val: 1.0 },
                { label: '+20% (Reinforced)', val: 1.2 }
              ].map((item) => (
                <button
                  key={item.val}
                  onClick={() => setWhatIf(prev => ({ ...prev, staffAvailabilityMultiplier: item.val }))}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    whatIf.staffAvailabilityMultiplier === item.val
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Evaluates bench coverage and phlebotomist capacity.
            </div>
          </div>

          {/* Variable 3: Analyzer BIO-03 Status */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-teal-600" />
                Biochemistry Analyzer BIO-03
              </span>
              <span className={`font-bold tabular-nums ${whatIf.analyzerOffline ? 'text-red-600' : 'text-teal-700'}`}>
                {whatIf.analyzerOffline ? 'Simulated OFFLINE' : 'Operational'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWhatIf(prev => ({ ...prev, analyzerOffline: false }))}
                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  !whatIf.analyzerOffline
                    ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Analyzers Online
              </button>
              <button
                onClick={() => setWhatIf(prev => ({ ...prev, analyzerOffline: true }))}
                className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                  whatIf.analyzerOffline
                    ? 'bg-red-50 border-red-600 text-red-900 font-bold'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Take BIO-03 Offline
              </button>
            </div>
            <div className="text-[11px] text-slate-500">
              Tests preventive maintenance during peak operational hours.
            </div>
          </div>

          {/* Variable 4: Inventory Buffer Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Boxes className="h-4 w-4 text-teal-600" />
                Reagent Stock Level
              </span>
              <span className="font-bold text-slate-800 capitalize">
                {whatIf.inventoryLevel}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'reduced', label: 'Reduced (-40%)' },
                { id: 'current', label: 'Current Physical' },
                { id: 'increased', label: 'Buffered (+80%)' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => setWhatIf(prev => ({ ...prev, inventoryLevel: lvl.id as any }))}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                    whatIf.inventoryLevel === lvl.id
                      ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Projections Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Bottleneck Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            calculatedSimulation.bottleneckFlag.includes('CRITICAL')
              ? 'bg-red-50 border-red-300 text-red-900'
              : calculatedSimulation.bottleneckFlag.includes('WARNING') || calculatedSimulation.bottleneckFlag.includes('HIGH')
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <AlertTriangle className={`h-5 w-5 shrink-0 mt-0.5 ${
              calculatedSimulation.bottleneckFlag.includes('CRITICAL')
                ? 'text-red-600'
                : calculatedSimulation.bottleneckFlag.includes('WARNING') || calculatedSimulation.bottleneckFlag.includes('HIGH')
                ? 'text-amber-600'
                : 'text-teal-600'
            }`} />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider">
                Simulation Bottleneck Analysis
              </div>
              <div className="text-sm font-bold mt-0.5">
                {calculatedSimulation.bottleneckFlag}
              </div>
            </div>
          </div>

          {/* 6 Projection Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Projected Test Volume</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                {calculatedSimulation.simulatedTestVolume.toLocaleString()}
              </div>
              <div className="text-[10px] text-teal-600 mt-1">
                +{calculatedSimulation.simulatedTestVolume - 1248} vs baseline
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Projected Pending Tests</div>
              <div className="text-2xl font-bold text-amber-600 tabular-nums mt-1">
                {calculatedSimulation.projectedPendingTests}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Baseline was 72
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Projected Avg. TAT</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                {calculatedSimulation.projectedAvgTAT}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Baseline was 2h 18m
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Biochemistry Load</div>
              <div className={`text-2xl font-bold tabular-nums mt-1 ${
                calculatedSimulation.biochemistryLoadPercent > 95 ? 'text-red-600' : 'text-slate-900'
              }`}>
                {calculatedSimulation.biochemistryLoadPercent}%
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {whatIf.analyzerOffline ? 'Rerouted to backup' : 'Cobas 6000 station'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Vitamin D Burnout</div>
              <div className="text-2xl font-bold text-red-600 tabular-nums mt-1">
                {calculatedSimulation.inventoryBurnoutDays} Days
              </div>
              <div className="text-[10px] text-red-600 mt-1">
                Stock depletion time
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
              <div className="text-[11px] font-semibold text-slate-500">Overtime Required</div>
              <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1">
                {calculatedSimulation.overtimeHoursRequired} hrs
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Technician bench hours
              </div>
            </div>
          </div>

          {/* Actionable Decision Takeaway */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Simulation Decision Synthesis
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Under this scenario ({Math.round(whatIf.volumeMultiplier * 100)}% volume with {whatIf.analyzerOffline ? 'BIO-03 offline' : 'normal analyzer state'}),
              Vitamin D reagent depletion accelerates to <strong>{calculatedSimulation.inventoryBurnoutDays} days</strong>.
              Immediate restock is recommended before any volume campaign is launched.
            </p>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Simulation engine executed locally. Zero data disclosure.
              </span>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Commit Mitigations</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
