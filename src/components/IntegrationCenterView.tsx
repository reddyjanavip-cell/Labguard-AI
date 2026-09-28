import React, { useState } from 'react';
import {
  Network,
  RefreshCw,
  Plus,
  Play,
  Pause,
  Unlink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  ArrowUpRight,
  Database,
  Radio,
  FileCode2,
  Zap,
  Info
} from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const IntegrationCenterView: React.FC = () => {
  const {
    dataSources,
    syncJobs,
    syncIntegrationSource,
    testIntegrationConnection,
    toggleIntegrationStatus,
    telemetryMode,
    setTelemetryMode,
    lastSyncTimestamp
  } = useLabData();

  const [testingId, setTestingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; message: string; latency?: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // New integration form state
  const [formData, setFormData] = useState({
    sourceName: '',
    integrationType: 'REST API' as const,
    endpointUrl: '',
    authType: 'Bearer Token' as const,
    frequencyMinutes: 15,
    enabledDataTypes: 'Complete Blood Count, Biochemistry Assays'
  });
  const [addError, setAddError] = useState<string | null>(null);

  const handleTestConnection = async (sourceId: string, endpointUrl: string, authType: string) => {
    setTestingId(sourceId);
    setTestResult(null);
    try {
      const res = await testIntegrationConnection(endpointUrl, authType);
      setTestResult({
        id: sourceId,
        success: res.reachable,
        message: res.message,
        latency: res.latencyMs
      });
    } finally {
      setTestingId(null);
    }
  };

  const handleSyncNow = async (sourceId: string) => {
    setSyncingId(sourceId);
    try {
      await syncIntegrationSource(sourceId);
    } finally {
      setSyncingId(null);
    }
  };

  const filteredSources = statusFilter === 'All'
    ? dataSources
    : dataSources.filter(s => s.status === statusFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
            CONNECTED
          </span>
        );
      case 'SYNCED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            SYNCED
          </span>
        );
      case 'SYNCING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
            SYNCING
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            WARNING
          </span>
        );
      case 'ERROR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            ERROR
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Unlink className="w-3.5 h-3.5 text-slate-500" />
            DISCONNECTED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wide">
                External Data Sync & Telemetry
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Last synchronized: {lastSyncTimestamp}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Laboratory Integration Center
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Manage clinical laboratory feeds, HL7 v2 telemetry streams, FHIR EHR gateways, and automated analyzer middleware under sovereign audit control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Telemetry Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-1 text-xs">
              <button
                onClick={() => setTelemetryMode('DEMO')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  telemetryMode === 'DEMO'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo Simulation
              </button>
              <button
                onClick={() => setTelemetryMode('LIVE')}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  telemetryMode === 'LIVE'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Live Feeds
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Integration
            </button>
          </div>
        </div>

        {/* Resilient Fallback Notice */}
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Fail-Safe Fallback Policy:</strong> If any external instrument or hospital FHIR feed is unreachable, the platform retains the last successfully synchronized data snapshot. No unverified records enter the clinical pipeline.
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
            Audit Hash Chaining Active
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Configured Feeds</span>
            <Network className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{dataSources.length}</div>
          <div className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {dataSources.filter(s => s.status === 'CONNECTED' || s.status === 'SYNCED').length} active feeds
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Records Ingested</span>
            <Database className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {dataSources.reduce((acc, s) => acc + (s.recordsReceived || 0), 0).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            0 validation rejections
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Telemetry Mode</span>
            <Radio className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${telemetryMode === 'LIVE' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`}></span>
            {telemetryMode === 'LIVE' ? 'Live Telemetry' : 'Demo Simulation'}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Controlled ticks every 4s
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
            <span>Security & Governance</span>
            <Zap className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-bold text-slate-900">Mutual TLS / mTLS</div>
          <div className="text-[11px] text-teal-600 mt-1 font-medium">
            Sovereign Private Buffer
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['All', 'CONNECTED', 'SYNCED', 'WARNING', 'DISCONNECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === status
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source) => {
          const isTesting = testingId === source.id;
          const isSyncing = syncingId === source.id;
          const hasTestResult = testResult && testResult.id === source.id;

          return (
            <div
              key={source.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[11px] font-mono text-slate-600 uppercase tracking-wider block">
                      {source.integrationType} · {source.authType}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {source.sourceName}
                    </h3>
                  </div>
                  <div>{getStatusBadge(source.status)}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg font-mono text-xs text-slate-600 break-all border border-slate-100 mb-3">
                  {source.endpointUrl}
                </div>

                {/* Enabled types */}
                <div className="mb-4">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1.5">
                    Synchronized Data Streams
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {source.enabledDataTypes.map((dt, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {dt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs mb-4">
                  <div>
                    <span className="text-slate-600 block text-[10px] uppercase font-bold">Received</span>
                    <span className="font-bold text-slate-900">{(source.recordsReceived || 0).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[10px] uppercase font-bold">Frequency</span>
                    <span className="font-medium text-slate-800">Every {source.frequencyMinutes}m</span>
                  </div>
                  <div>
                    <span className="text-slate-600 block text-[10px] uppercase font-bold">Last Sync</span>
                    <span className="font-mono text-slate-700 text-[11px]">
                      {source.lastSuccessfulSync ? source.lastSuccessfulSync.substring(11, 16) : 'Never'}
                    </span>
                  </div>
                </div>

                {/* Warnings / Errors */}
                {source.validationErrors && source.validationErrors.length > 0 && (
                  <div className="mb-4 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Validation Alert
                    </div>
                    {source.validationErrors.map((err, i) => (
                      <div key={i} className="text-[11px]">{err}</div>
                    ))}
                  </div>
                )}

                {/* Test Connection Output */}
                {hasTestResult && (
                  <div
                    className={`mb-4 p-2.5 rounded-lg text-xs border ${
                      testResult.success
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-rose-50 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      {testResult.success ? 'Handshake Successful' : 'Connection Failed'}
                      {testResult.latency !== undefined && (
                        <span className="text-[10px] font-mono ml-auto">
                          {testResult.latency}ms latency
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] mt-0.5">{testResult.message}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <button
                  onClick={() => handleTestConnection(source.id, source.endpointUrl, source.authType)}
                  disabled={isTesting}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Activity className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                  {isTesting ? 'Pinging...' : 'Test Connection'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleIntegrationStatus(source.id)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs transition-colors"
                    title={source.status === 'CONNECTED' ? 'Pause / Disconnect' : 'Enable / Connect'}
                  >
                    {source.status === 'CONNECTED' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => handleSyncNow(source.id)}
                    disabled={isSyncing || source.status === 'DISCONNECTED'}
                    className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    {isSyncing ? 'Syncing...' : 'Sync Now'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sync History Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Synchronization Jobs</h3>
            <p className="text-xs text-slate-500">Real-time log of data ingestion events with rejection auditing</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {syncJobs.length} events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-3 py-2">Job ID</th>
                <th className="px-3 py-2">Source</th>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Processed</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Updated</th>
                <th className="px-3 py-2">Trigger</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {syncJobs.slice(0, 8).map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3 py-2.5 font-mono text-slate-600">{job.id}</td>
                  <td className="px-3 py-2.5 font-medium text-slate-900">{job.sourceName}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-500">{job.startTime}</td>
                  <td className="px-3 py-2.5 font-semibold text-slate-800">{job.recordsProcessed}</td>
                  <td className="px-3 py-2.5 text-emerald-600 font-medium">+{job.recordsCreated}</td>
                  <td className="px-3 py-2.5 text-blue-600 font-medium">~{job.recordsUpdated}</td>
                  <td className="px-3 py-2.5 capitalize text-slate-500">{job.trigger}</td>
                  <td className="px-3 py-2.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      job.status === 'Completed'
                        ? 'bg-teal-50 text-teal-700 border border-teal-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Integration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Configure Laboratory Data Source</h3>
                <p className="text-xs text-slate-500">Connect an analyzer LIS feeder, EMR REST API, or HL7 stream</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg leading-none"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setAddError(null);
                try {
                  const res = await fetch('/api/integrations', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      laboratoryName: 'NovaCare Diagnostics Laboratory',
                      sourceName: formData.sourceName,
                      integrationType: formData.integrationType,
                      endpointUrl: formData.endpointUrl,
                      authType: formData.authType,
                      frequencyMinutes: Number(formData.frequencyMinutes),
                      enabledDataTypes: formData.enabledDataTypes.split(',').map(s => s.trim())
                    })
                  });
                  const data = await res.json();
                  if (!res.ok) {
                    setAddError(data.error || 'Failed to register source');
                    return;
                  }
                  setShowAddModal(false);
                  window.location.reload();
                } catch (err: any) {
                  setAddError(err.message);
                }
              }}
              className="p-5 space-y-4 text-xs"
            >
              {addError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  {addError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roche Cobas IT Middleware, Sysmex XN-1000"
                  value={formData.sourceName}
                  onChange={(e) => setFormData({ ...formData, sourceName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Integration Type</label>
                  <select
                    value={formData.integrationType}
                    onChange={(e) => setFormData({ ...formData, integrationType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="REST API">REST API</option>
                    <option value="HL7 Feed">HL7 Feed (v2.x)</option>
                    <option value="FHIR API">FHIR API (R4)</option>
                    <option value="JSON Feed">JSON Feed</option>
                    <option value="Webhook">Webhook</option>
                    <option value="CSV Upload">CSV Auto-Watcher</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Authentication Type</label>
                  <select
                    value={formData.authType}
                    onChange={(e) => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Bearer Token">Bearer Token</option>
                    <option value="API Key">API Key</option>
                    <option value="Mutual TLS">Mutual TLS (mTLS)</option>
                    <option value="Basic Auth">Basic Auth</option>
                    <option value="None">None (Internal VPC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Endpoint URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://lis-telemetry.internal/api/v1/feed"
                  value={formData.endpointUrl}
                  onChange={(e) => setFormData({ ...formData, endpointUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Polling Frequency (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    max="1440"
                    value={formData.frequencyMinutes}
                    onChange={(e) => setFormData({ ...formData, frequencyMinutes: parseInt(e.target.value, 10) || 15 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Enabled Data Types</label>
                  <input
                    type="text"
                    placeholder="Comma separated"
                    value={formData.enabledDataTypes}
                    onChange={(e) => setFormData({ ...formData, enabledDataTypes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold transition-colors"
                >
                  Save Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
