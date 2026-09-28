import React from 'react';
import { Building2, Phone, Mail, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const SuppliersView: React.FC = () => {
  const { suppliers } = useLabData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Building2 className="h-3.5 w-3.5" />
            Vendor Logistics & SLAs
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Authorized Diagnostic Suppliers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cold chain delivery lead times, contract terms, active procurement orders, and verified compliance status.
          </p>
        </div>

        <div className="text-xs text-slate-500">
          Contracted Vendor Partners: <strong className="text-slate-900 font-bold tabular-nums">10 Suppliers</strong>
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suppliers.map((s) => (
          <div
            key={s.supplierId}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                    {s.supplierId}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">{s.supplierName}</h3>
                  <div className="text-xs text-slate-500">{s.category}</div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                  {s.reliabilityScore}% Score
                </span>
              </div>

              <div className="my-3 p-2.5 rounded bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Average Delivery</span>
                  <strong className="text-slate-900 tabular-nums">{s.averageDeliveryDays} business days</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pending Purchase Orders</span>
                  <strong className="text-teal-700 tabular-nums">{s.pendingOrders} POs active</strong>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-slate-400" />
                  <span className="font-mono text-[11px]">{s.contact}</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">
                  Supplies: {s.products.join(', ')}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono">Total Orders: {s.orderCount}</span>
              <span className="text-teal-700 font-medium text-[11px] flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" /> SLA Compliant
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
