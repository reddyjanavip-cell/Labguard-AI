import React, { useState } from 'react';
import { useLabData } from '../context/LabDataContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { PharmacyDrugRecord, PrescriptionRecord, PharmacyDeliveryRecord } from '../types';
import { Pill, Plus, Search, ShoppingBag, Truck, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, FileText, DollarSign, PackageCheck, Thermometer } from 'lucide-react';

export const PharmacyView: React.FC = () => {
  const {
    pharmacyMedicines,
    prescriptions,
    pharmacyBills,
    pharmacyDeliveries,
    patients,
    dispensePharmacy,
    restockPharmacyMedicine,
    updatePharmacyDeliveryStatus,
    refreshAllData
  } = useLabData();

  const { effectiveRole } = useAuth();
  const { t } = useLanguage();

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'dispense' | 'prescriptions' | 'deliveries'>('inventory');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Restock Modal
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [restockQuantity, setRestockQuantity] = useState(100);
  const [poNumber, setPoNumber] = useState(`PO-PHARM-${Math.floor(1000 + Math.random() * 9000)}`);
  const [restockLoading, setRestockLoading] = useState(false);
  const [restockError, setRestockError] = useState<string | null>(null);

  // Dispensing Form State
  const [dispensePatientId, setDispensePatientId] = useState(patients[0]?.patientId || 'PT-1001');
  const [dispensePatientName, setDispensePatientName] = useState(patients[0]?.name || 'Aarav Sharma');
  const [selectedRxId, setSelectedRxId] = useState<string>('');
  const [dispensingItems, setDispensingItems] = useState<{ drugId: string; quantity: number }[]>([
    { drugId: 'MED-101', quantity: 20 }
  ]);
  const [dispensePaymentMethod, setDispensePaymentMethod] = useState<'Cash' | 'UPI' | 'Card'>('UPI');
  const [dispenseDeliveryType, setDispenseDeliveryType] = useState<'COUNTER PICKUP' | 'HOME DELIVERY'>('COUNTER PICKUP');
  const [dispenseAddress, setDispenseAddress] = useState('Hospital OPD Counter No. 4');
  const [dispenseContact, setDispenseContact] = useState('+91 98765 43210');
  const [dispenseSuccess, setDispenseSuccess] = useState<string | null>(null);
  const [dispenseError, setDispenseError] = useState<string | null>(null);
  const [dispenseLoading, setDispenseLoading] = useState(false);

  const canManage = effectiveRole === 'administrator' || effectiveRole === 'pharmacist' || effectiveRole === 'lab_manager';

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRestockLoading(true);
    setRestockError(null);
    const res = await restockPharmacyMedicine(selectedDrugId, Number(restockQuantity), poNumber);
    setRestockLoading(false);
    if (res.success) {
      setRestockModalOpen(false);
      refreshAllData();
    } else {
      setRestockError(`Restock failed: ${res.error}`);
    }
  };

  const handleDispenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDispenseLoading(true);
    setDispenseError(null);
    setDispenseSuccess(null);

    const res = await dispensePharmacy({
      patientId: dispensePatientId,
      patientName: dispensePatientName,
      prescriptionId: selectedRxId || undefined,
      items: dispensingItems,
      paymentMethod: dispensePaymentMethod,
      deliveryType: dispenseDeliveryType,
      deliveryAddress: dispenseAddress,
      deliveryContact: dispenseContact
    });

    setDispenseLoading(false);
    if (res.success) {
      setDispenseSuccess(`Medicines successfully dispensed! Generated Bill #${res.data?.bill?.billNumber || 'PB-2025'}`);
      refreshAllData();
      setTimeout(() => {
        setDispenseSuccess(null);
      }, 4000);
    } else {
      setDispenseError(res.error || 'Dispensing failed');
    }
  };

  const filteredMedicines = pharmacyMedicines.filter(med => {
    const matchesSearch = med.drugName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'All' || med.category === categoryFilter;
    const medStatus = med.stockStatus || med.status;
    const matchesStat = statusFilter === 'All' || medStatus === statusFilter;
    return matchesSearch && matchesCat && matchesStat;
  });

  const categories = Array.from(new Set(pharmacyMedicines.map(m => m.category)));

  // Calculate bill estimate
  const estimatedSubtotal = dispensingItems.reduce((acc, item) => {
    const med = pharmacyMedicines.find(m => m.drugId === item.drugId);
    const price = med ? (med.unitPrice ?? med.sellingPrice ?? 0) : 0;
    return acc + (price * item.quantity);
  }, 0);
  const estimatedTax = +(estimatedSubtotal * 0.05).toFixed(2); // 5% GST
  const estimatedTotal = +(estimatedSubtotal + estimatedTax).toFixed(2);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <span className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Pill className="w-6 h-6" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {t('navPharmacy')}
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                Hospital Formulary
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Electronic Pharmacy Management · Drug Dispensing, Stock Control & Delivery Tracking
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => refreshAllData()}
            className="p-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            title="Refresh Pharmacy Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {canManage && (
            <button
              type="button"
              onClick={() => {
                if (pharmacyMedicines.length > 0) setSelectedDrugId(pharmacyMedicines[0].drugId);
                setRestockModalOpen(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('restock')}</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Total Formulary SKUs</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">{pharmacyMedicines.length}</p>
          <span className="text-[11px] text-slate-500">Certified active medicines</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Low / Critical Stock</span>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {pharmacyMedicines.filter(m => (m.stockStatus || m.status) === 'LOW STOCK' || (m.stockStatus || m.status) === 'OUT OF STOCK').length}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Reorder required</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Pending Prescriptions</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {prescriptions.filter(p => p.prescriptionStatus === 'ACTIVE').length}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">Awaiting dispensing</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500">Deliveries in Transit</span>
          <p className="text-2xl font-bold text-teal-600 mt-1">
            {pharmacyDeliveries.filter(d => d.deliveryStatus === 'OUT FOR DELIVERY' || d.deliveryStatus === 'DISPATCHED').length}
          </p>
          <span className="text-[11px] text-teal-600 font-medium">Active logistics</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 space-x-4 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveSubTab('inventory')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'inventory'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Medicine Inventory ({pharmacyMedicines.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dispense')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'dispense'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Dispensing Counter</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('prescriptions')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'prescriptions'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Doctor Prescriptions ({prescriptions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('deliveries')}
          className={`pb-2.5 transition-all border-b-2 flex items-center space-x-1.5 ${
            activeSubTab === 'deliveries'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Deliveries & Pickup ({pharmacyDeliveries.length})</span>
        </button>
      </div>

      {/* Subtab 1: Inventory Table */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter Toolbar */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex-1 min-w-[220px] relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search medicine, generic salt, batch #..."
                className="w-full px-3 py-1.5 pl-9 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
            </div>

            <div className="flex items-center space-x-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
              >
                <option value="All">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white text-slate-700"
              >
                <option value="All">All Stock Levels</option>
                <option value="IN STOCK">In Stock</option>
                <option value="LOW STOCK">Low Stock</option>
                <option value="OUT OF STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                    <th className="py-3 px-4">Medicine & Form</th>
                    <th className="py-3 px-4">Generic Composition</th>
                    <th className="py-3 px-4">Batch & Expiry</th>
                    <th className="py-3 px-4">Storage</th>
                    <th className="py-3 px-4">Available Qty</th>
                    <th className="py-3 px-4">Price (₹)</th>
                    <th className="py-3 px-4">Status</th>
                    {canManage && <th className="py-3 px-4 text-right">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredMedicines.map(med => (
                    <tr key={med.drugId} className="hover:bg-slate-50/70">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{med.drugName}</p>
                        <p className="text-[11px] text-slate-500">{med.dosageForm || 'Formulation'} · {med.strength || med.unit || ''}</p>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {med.genericName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">
                        <p className="text-slate-800">{med.batchNumber}</p>
                        <p className="text-slate-500">Exp: {med.expiryDate}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded font-mono ${
                          med.storageCondition.includes('Refrigerated') ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Thermometer className="w-3 h-3 mr-0.5" />
                          <span>{med.storageCondition}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-slate-900">{med.quantity}</span>
                        <span className="text-[10px] text-slate-400 block">Min: {med.reorderLevel}</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800 font-mono">
                        ₹{(med.unitPrice ?? med.sellingPrice ?? 0).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          (med.stockStatus || med.status) === 'IN STOCK' ? 'bg-emerald-100 text-emerald-800' :
                          (med.stockStatus || med.status) === 'LOW STOCK' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {med.stockStatus || med.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDrugId(med.drugId);
                              setRestockModalOpen(true);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-[11px] font-semibold transition-all"
                          >
                            Restock
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: Dispensing Counter */}
      {activeSubTab === 'dispense' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Dispensing Entry Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">Hospital Pharmacy Dispensing Form</h2>
              <span className="text-xs text-slate-500 font-mono">Counter No. 04</span>
            </div>

            {dispenseSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{dispenseSuccess}</span>
              </div>
            )}

            {dispenseError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{dispenseError}</span>
              </div>
            )}

            <form onSubmit={handleDispenseSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient UHID</label>
                  <select
                    value={dispensePatientId}
                    onChange={(e) => {
                      const pid = e.target.value;
                      setDispensePatientId(pid);
                      const p = patients.find(pat => pat.patientId === pid);
                      if (p) setDispensePatientName(p.name);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {patients.map(p => (
                      <option key={p.patientId} value={p.patientId}>
                        {p.patientId} - {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Link Prescription (Optional)</label>
                  <select
                    value={selectedRxId}
                    onChange={(e) => setSelectedRxId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="">-- Direct Over-The-Counter --</option>
                    {prescriptions.map(rx => (
                      <option key={rx.prescriptionId} value={rx.prescriptionId}>
                        {rx.prescriptionId} ({rx.doctorName || rx.prescribingDoctor} - {rx.patientName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items in dispensing cart */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Prescribed / Selected Medications</label>
                <div className="space-y-2">
                  {dispensingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <select
                        value={item.drugId}
                        onChange={(e) => {
                          const updated = [...dispensingItems];
                          updated[idx].drugId = e.target.value;
                          setDispensingItems(updated);
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                      >
                        {pharmacyMedicines.map(m => (
                          <option key={m.drugId} value={m.drugId}>
                            {m.drugName} ({m.strength || m.unit || ''}) - ₹{m.unitPrice ?? m.sellingPrice ?? 0} | Stock: {m.quantity}
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...dispensingItems];
                          updated[idx].quantity = parseInt(e.target.value, 10) || 1;
                          setDispensingItems(updated);
                        }}
                        className="w-20 px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-center"
                        placeholder="Qty"
                      />

                      {dispensingItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDispensingItems(dispensingItems.filter((_, i) => i !== idx))}
                          className="text-red-500 hover:text-red-700 p-1.5"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setDispensingItems([...dispensingItems, { drugId: pharmacyMedicines[0]?.drugId || 'MED-101', quantity: 10 }])}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Another Medicine</span>
                  </button>
                </div>
              </div>

              {/* Delivery & Fulfillment */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fulfillment Channel</label>
                  <select
                    value={dispenseDeliveryType}
                    onChange={(e) => setDispenseDeliveryType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="COUNTER PICKUP">Hospital Counter Pickup</option>
                    <option value="HOME DELIVERY">Home Delivery (Patient Residence)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                  <select
                    value={dispensePaymentMethod}
                    onChange={(e) => setDispensePaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  >
                    <option value="UPI">UPI / QR Code</option>
                    <option value="Cash">Cash at Counter</option>
                    <option value="Card">Credit / Debit Card</option>
                  </select>
                </div>
              </div>

              {dispenseDeliveryType === 'HOME DELIVERY' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Delivery Address</label>
                    <input
                      type="text"
                      value={dispenseAddress}
                      onChange={(e) => setDispenseAddress(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                    <input
                      type="text"
                      value={dispenseContact}
                      onChange={(e) => setDispenseContact(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={dispenseLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <PackageCheck className="w-4 h-4" />
                <span>{dispenseLoading ? 'Dispensing...' : `Dispense & Charge (₹${estimatedTotal})`}</span>
              </button>
            </form>
          </div>

          {/* Bill Estimate Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between shadow-xl border border-slate-800 text-xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-mono text-slate-400">ESTIMATED INVOICE</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                  LIVE CALC
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Patient:</span>
                  <span className="text-white font-medium">{dispensePatientName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>UHID:</span>
                  <span className="text-white font-mono">{dispensePatientId}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fulfillment:</span>
                  <span className="text-emerald-400">{dispenseDeliveryType}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Subtotal:</span>
                  <span className="text-white font-mono">₹{estimatedSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5%):</span>
                  <span className="text-white font-mono">₹{estimatedTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-emerald-400 pt-2 border-t border-slate-800">
                  <span>Net Payable:</span>
                  <span className="font-mono">₹{estimatedTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p>Certified Pharmacist on duty: Dr. Ananya Deshmukh</p>
              <p className="mt-0.5">Drugs dispensed under valid hospital prescription guidelines.</p>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Doctor Prescriptions */}
      {activeSubTab === 'prescriptions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Clinical Prescriptions Worklist
            </h2>
            <span className="text-xs text-slate-500 font-mono">Direct OPD Integration</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Rx Number</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Prescribing Doctor</th>
                  <th className="py-3 px-4">Prescribed Medicines</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {prescriptions.map(rx => (
                  <tr key={rx.prescriptionId} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-600">
                      {rx.prescriptionId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{rx.patientName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{rx.patientId}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-slate-800">{rx.doctorName || rx.prescribingDoctor}</p>
                      <p className="text-[11px] text-slate-500">{rx.department || 'Outpatient Department'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        {rx.medicines.map((m, i) => (
                          <p key={i} className="text-slate-700 text-[11px]">
                            • <strong>{m.drugName}</strong> ({m.dosageInstructions || m.dosage || 'Standard'}{m.duration ? `, ${m.duration}` : ''})
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono">
                      {rx.date}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rx.prescriptionStatus === 'DISPENSED' ? 'bg-emerald-100 text-emerald-800' :
                        rx.prescriptionStatus === 'PARTIALLY DISPENSED' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rx.prescriptionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 4: Deliveries & Pickup Queue */}
      {activeSubTab === 'deliveries' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Pharmacy Medicine Orders & Deliveries
            </h2>
            <span className="text-xs text-slate-500 font-mono">Live Dispatch Feed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Delivery Type & Address</th>
                  <th className="py-3 px-4">Medicines</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  {canManage && <th className="py-3 px-4 text-right">Logistics Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pharmacyDeliveries.map(del => (
                  <tr key={del.orderId} className="hover:bg-slate-50/70">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                      {del.orderId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{del.patientName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{del.contact}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-semibold block w-fit mb-0.5">
                        {del.deliveryType}
                      </span>
                      <p className="text-slate-600 text-[11px]">{del.address}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {del.items.map((it, idx) => (
                        <p key={idx} className="text-slate-700 text-[11px]">
                          {it.drugName} × {it.quantity}
                        </p>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{del.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        del.deliveryStatus === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        del.deliveryStatus === 'OUT FOR DELIVERY' ? 'bg-teal-100 text-teal-800' :
                        del.deliveryStatus === 'PACKED' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {del.deliveryStatus}
                      </span>
                    </td>
                    {canManage && (
                      <td className="py-3.5 px-4 text-right space-x-1">
                        {del.deliveryStatus === 'ORDERED' && (
                          <button
                            type="button"
                            onClick={() => updatePharmacyDeliveryStatus(del.orderId, 'PACKED')}
                            className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded text-[10px] font-semibold"
                          >
                            Mark Packed
                          </button>
                        )}
                        {del.deliveryStatus === 'PACKED' && (
                          <button
                            type="button"
                            onClick={() => updatePharmacyDeliveryStatus(del.orderId, 'OUT FOR DELIVERY')}
                            className="px-2 py-1 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded text-[10px] font-semibold"
                          >
                            Dispatch
                          </button>
                        )}
                        {del.deliveryStatus === 'OUT FOR DELIVERY' && (
                          <button
                            type="button"
                            onClick={() => updatePharmacyDeliveryStatus(del.orderId, 'DELIVERED')}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-[10px] font-semibold"
                          >
                            Delivered
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Restock Batch Modal */}
      {restockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Restock Hospital Medicine Batch</h3>
              <button
                type="button"
                onClick={() => setRestockModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Medicine</label>
                <select
                  value={selectedDrugId}
                  onChange={(e) => setSelectedDrugId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {pharmacyMedicines.map(m => (
                    <option key={m.drugId} value={m.drugId}>
                      {m.drugName} ({m.genericName}) · Current: {m.quantity}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity to Ingest</label>
                <input
                  type="number"
                  min="10"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(parseInt(e.target.value, 10))}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purchase Order (PO) Ref</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRestockModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={restockLoading}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold shadow-md shadow-emerald-500/20 disabled:opacity-50"
                >
                  {restockLoading ? 'Updating Stock...' : 'Confirm Ingestion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
