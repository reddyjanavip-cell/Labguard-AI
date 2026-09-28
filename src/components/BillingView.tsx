import React, { useState } from 'react';
import { Receipt, Search, Filter, DollarSign, CheckCircle2, Clock, CreditCard, ArrowDownRight } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';

export const BillingView: React.FC = () => {
  const { billing, kpis } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredBilling = billing.filter((b) => {
    const matchesSearch = 
      b.invoiceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.patientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Receipt className="h-3.5 w-3.5" />
            Revenue Realization & Invoicing
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Billing & Invoices Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time outpatient cashier receipts, digital UPI payments, and corporate TPA insurance receivables.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-right">
          <span className="text-[11px] text-teal-800 font-semibold block">Today's Realized Revenue</span>
          <span className="text-xl font-bold text-teal-900 tabular-nums">
            ₹{kpis.dailyRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">Paid Invoices</span>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">88 Invoices</div>
          <span className="text-[10px] text-teal-600 font-medium">88% Immediate Clearance</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">Pending Insurance (TPA)</span>
          <div className="text-xl font-bold text-amber-600 tabular-nums mt-0.5">12 Invoices</div>
          <span className="text-[10px] text-slate-500">Under claim adjudication</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">Average Bill Value</span>
          <div className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">₹3,846</div>
          <span className="text-[10px] text-slate-500">Per patient test encounter</span>
        </div>

        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] text-slate-500 uppercase">Digital Collection Share</span>
          <div className="text-xl font-bold text-teal-700 tabular-nums mt-0.5">74.2%</div>
          <span className="text-[10px] text-teal-600 font-medium">UPI & NetBanking</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search invoice ID or patient..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending TPA</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Invoice ID</th>
                <th className="px-3.5 py-2.5">Patient</th>
                <th className="px-3.5 py-2.5">Associated Order</th>
                <th className="px-3.5 py-2.5">Billed Amount</th>
                <th className="px-3.5 py-2.5">Discount</th>
                <th className="px-3.5 py-2.5">Net Paid</th>
                <th className="px-3.5 py-2.5">Method</th>
                <th className="px-3.5 py-2.5">Date / Time</th>
                <th className="px-3.5 py-2.5">Payment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBilling.slice(0, 50).map((b) => (
                <tr key={b.invoiceId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{b.invoiceId}</td>
                  <td className="px-3.5 py-2 font-bold text-slate-900">{b.patientName}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 text-[11px] truncate max-w-xs">{b.tests}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-800 tabular-nums">₹{b.amount.toLocaleString()}</td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 tabular-nums">₹{b.discount}</td>
                  <td className="px-3.5 py-2 font-mono font-bold text-slate-900 tabular-nums">₹{(b.amount - b.discount).toLocaleString()}</td>
                  <td className="px-3.5 py-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="px-3.5 py-2 font-mono text-slate-500 text-[11px] tabular-nums">{b.date}</td>
                  <td className="px-3.5 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      b.paymentStatus === 'Paid' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
