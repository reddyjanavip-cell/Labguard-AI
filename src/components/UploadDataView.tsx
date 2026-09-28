import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Play, 
  Sparkles, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { SAMPLE_CSV_DATA } from '../data/mockData';

export const UploadDataView: React.FC = () => {
  const { 
    processCSVUpload, 
    uploadedValidationResult, 
    commitUploadedData, 
    resetUpload,
    setActiveTab
  } = useLabData();

  const [selectedDataset, setSelectedDataset] = useState<'inventory' | 'orders' | 'patients'>('inventory');
  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLoadSample = (type: 'inventory' | 'orders' | 'patients') => {
    setSelectedDataset(type);
    const content = SAMPLE_CSV_DATA[type];
    setRawText(content);
    processCSVUpload(content, `sample_${type}_batch.csv`, type.toUpperCase());
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      processCSVUpload(content, file.name, selectedDataset.toUpperCase());
    };
    reader.readAsText(file);
  };

  const handleDownloadSample = (type: 'inventory' | 'orders' | 'patients') => {
    const content = SAMPLE_CSV_DATA[type];
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `novacare_${type}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCommit = () => {
    setIsProcessing(true);
    commitUploadedData();
    setTimeout(() => {
      setIsProcessing(false);
      setActiveTab('private-processing');
    }, 600);
  };

  const workflowSteps = [
    { num: 1, title: 'Upload CSV', desc: 'Drag-and-drop or select file' },
    { num: 2, title: 'Detect Schema', desc: 'Map columns & datatypes' },
    { num: 3, title: 'Validate Data', desc: 'Scan for missing & duplicate keys' },
    { num: 4, title: 'Secure Processing', desc: 'Run on private Sovereign layer' },
    { num: 5, title: 'AI Analysis', desc: 'Calculate burn rates & bottlenecks' },
    { num: 6, title: 'Generate Insights', desc: 'Deliver explainable recommendations' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <UploadCloud className="h-3.5 w-3.5" />
            Sovereign Ingestion Gateway
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Upload Laboratory Data
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest raw CSV spreadsheets for inventory, test orders, or patient rosters with automated schema validation.
          </p>
        </div>

        {/* Quick Sample Load Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Quick Test Samples:</span>
          <button
            onClick={() => handleLoadSample('inventory')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors"
          >
            Inventory CSV
          </button>
          <button
            onClick={() => handleLoadSample('orders')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Orders CSV
          </button>
          <button
            onClick={() => handleLoadSample('patients')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Patients CSV
          </button>
        </div>
      </div>

      {/* 6-STEP WORKFLOW VISUALIZER */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
          Sovereign Processing Pipeline Workflow
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          {workflowSteps.map((s, idx) => {
            const isCompleted = uploadedValidationResult ? true : idx === 0;
            const isCurrent = uploadedValidationResult ? idx === 2 : idx === 0;
            return (
              <div
                key={s.num}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'border-teal-600 bg-teal-50/40 shadow-xs'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/60'
                    : 'border-slate-100 bg-white opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-slate-400">0{s.num}</span>
                  {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />}
                </div>
                <div className="text-xs font-bold text-slate-900">{s.title}</div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Upload Area & File Dropzone */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: File Dropzone & Template Download */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 hover:bg-slate-50 p-6 text-center transition-colors">
            <UploadCloud className="h-10 w-10 text-teal-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900">Select or Drop CSV Spreadsheet</div>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Upload local inventory, orders, or test records for private validation.
            </p>

            <label className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg cursor-pointer shadow-xs transition-colors">
              <FileText className="h-3.5 w-3.5" />
              <span>Browse CSV File</span>
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample CSV Download cards */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2.5">
            <div className="text-xs font-bold text-slate-900">Download Official CSV Templates</div>
            <div className="space-y-1.5">
              {[
                { type: 'inventory', label: 'Laboratory Inventory Template (.csv)', desc: 'Item ID, Name, Supplier, Qty, Lead Time' },
                { type: 'orders', label: 'Test Orders Template (.csv)', desc: 'Order ID, Patient ID, Priority, Department' },
                { type: 'patients', label: 'Patient Master Template (.csv)', desc: 'Patient ID, Name, Blood Group, Doctor' },
              ].map(t => (
                <div
                  key={t.type}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-semibold text-slate-800">{t.label}</span>
                    <div className="text-[10px] text-slate-500">{t.desc}</div>
                  </div>
                  <button
                    onClick={() => handleDownloadSample(t.type as any)}
                    className="p-1.5 text-teal-700 hover:text-teal-900 hover:bg-teal-100 rounded transition-colors"
                    title="Download template"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Validation Scorecard & Sample Rows */}
        <div className="lg:col-span-7">
          {uploadedValidationResult ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-teal-600" />
                    <span className="text-sm font-bold text-slate-900">
                      {uploadedValidationResult.fileName}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Dataset Type: {uploadedValidationResult.datasetType}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetUpload}
                    className="text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleCommit}
                    disabled={isProcessing}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Start Private Processing</span>
                  </button>
                </div>
              </div>

              {/* Quality Score & Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-center">
                  <div className="text-[10px] text-teal-700 font-bold uppercase">Quality Score</div>
                  <div className="text-2xl font-bold text-teal-900 tabular-nums">
                    {uploadedValidationResult.dataQualityScore}%
                  </div>
                  <span className="text-[10px] text-teal-700 font-medium">Valid for AI engine</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Records Detected</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {uploadedValidationResult.recordsDetected}
                  </div>
                  <span className="text-[10px] text-slate-400">Total lines</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Columns Detected</div>
                  <div className="text-2xl font-bold text-slate-900 tabular-nums">
                    {uploadedValidationResult.columnsDetected}
                  </div>
                  <span className="text-[10px] text-slate-400">Schema fields</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 uppercase">Missing Values</div>
                  <div className="text-2xl font-bold text-amber-600 tabular-nums">
                    {uploadedValidationResult.missingValues}
                  </div>
                  <span className="text-[10px] text-slate-400">Auto-imputed</span>
                </div>
              </div>

              {/* Sample Data Table Preview */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2">
                  Sample Ingested Rows Preview ({uploadedValidationResult.sampleRows.length} rows previewed)
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                      <tr>
                        {uploadedValidationResult.columns.map((col) => (
                          <th key={col} className="px-3 py-2 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uploadedValidationResult.sampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          {uploadedValidationResult.columns.map((col) => (
                            <td key={col} className="px-3 py-1.5 text-slate-700 whitespace-nowrap tabular-nums">
                              {row[col] ?? '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sovereign Notice */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
                <span>
                  <strong>Sovereign AI Verification:</strong> Dataset validated inside client sandbox. No telemetry transmitted outside laboratory boundary.
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
              <FileText className="h-10 w-10 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-700">No Dataset Currently Loaded</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Drop your CSV file on the left or click "Inventory CSV" above to test the live automated validation engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
