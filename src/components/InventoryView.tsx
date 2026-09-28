import React, { useState } from 'react';
import { Boxes, Search, Filter, AlertTriangle, Plus, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLabData } from '../context/LabDataContext';
import { InventoryItem } from '../types';

export const InventoryView: React.FC = () => {
  const { inventory, restockInventoryItem, createInventoryItem, setActiveTab } = useLabData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // New item form state
  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Reagent' as const,
    quantity: 50,
    unit: 'Kits',
    reorderLevel: 25,
    unitCost: 1500,
    supplier: 'Roche Diagnostics India',
    leadTimeDays: 4,
    weeklyConsumption: 12
  });

  const handleRestock = async (itemId: string, qty: number) => {
    await restockInventoryItem(itemId, qty, `PO-ROCHE-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const res = await createInventoryItem({
      ...formData,
      batchNumber: `LOT-2026-${Math.floor(100 + Math.random() * 900)}`,
      expiryDate: '2026-12-31',
      location: 'Reagent Walk-in Cold Room 2-8°C'
    });
    if (!res.success) {
      setFormError(res.error || 'Failed to add item');
      return;
    }
    setShowAddModal(false);
  };

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalValuation = inventory.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 animate-pulse">Critical Shortage</span>;
      case 'Low Stock':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Low Stock</span>;
      case 'Healthy Stock':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-teal-100 text-teal-800">Healthy Stock</span>;
      case 'Expiring Soon':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-100 text-yellow-800">Expiring Soon</span>;
      case 'Expired':
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800">Expired</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full mb-1">
            <Boxes className="h-3.5 w-3.5" />
            Cold-Chain Reagent Logistics
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Laboratory Inventory & Reagent Store
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitored reagent lines, cold chain lot numbers, expiry dates, and predictive consumption forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 block">Total Inventory Valuation</span>
            <span className="text-sm font-bold text-slate-900 tabular-nums">₹{totalValuation.toLocaleString()}</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Stock Item</span>
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className="px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Restock Actions</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reagent name, lot, or supplier..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Stock Statuses</option>
            <option value="Critical">Critical Shortage</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Healthy Stock">Healthy Stock</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-700 focus:border-teal-500 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Reagent">Reagents</option>
            <option value="Control">Quality Controls</option>
            <option value="Calibrator">Calibrators</option>
            <option value="Consumable">Consumables</option>
          </select>
        </div>
      </div>

      {/* INVENTORY TABLE */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
              <tr>
                <th className="px-3.5 py-2.5">Item Code</th>
                <th className="px-3.5 py-2.5">Item Description</th>
                <th className="px-3.5 py-2.5">Category</th>
                <th className="px-3.5 py-2.5">Current Stock</th>
                <th className="px-3.5 py-2.5">Reorder Level</th>
                <th className="px-3.5 py-2.5">Weekly Burn</th>
                <th className="px-3.5 py-2.5">Lead Time</th>
                <th className="px-3.5 py-2.5">Supplier</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const isCriticalVitaminD = item.itemId === 'INV-101';
                return (
                  <tr
                    key={item.itemId}
                    className={`transition-colors ${
                      isCriticalVitaminD ? 'bg-red-50/50 hover:bg-red-50/80 font-medium' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-3.5 py-2 font-mono text-teal-700 font-semibold">{item.itemId}</td>
                    <td className="px-3.5 py-2">
                      <div className="font-bold text-slate-900">{item.itemName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Lot: {item.batchNumber} · Exp: {item.expiryDate}</div>
                    </td>
                    <td className="px-3.5 py-2 text-slate-600">{item.category}</td>
                    <td className={`px-3.5 py-2 font-bold tabular-nums ${item.quantity <= item.reorderLevel ? 'text-red-600 text-sm' : 'text-slate-900'}`}>
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-3.5 py-2 font-mono text-slate-600 tabular-nums">{item.reorderLevel} {item.unit}</td>
                    <td className="px-3.5 py-2 font-mono text-slate-600 tabular-nums">{item.weeklyConsumption} {item.unit}/wk</td>
                    <td className="px-3.5 py-2 text-slate-600 tabular-nums">{item.leadTimeDays} days</td>
                    <td className="px-3.5 py-2 text-slate-700 font-medium">{item.supplier}</td>
                    <td className="px-3.5 py-2">{getStatusBadge(item.status)}</td>
                    <td className="px-3.5 py-2 text-right">
                      <button
                        onClick={() => handleRestock(item.itemId, 30)}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded transition-colors inline-flex items-center gap-1 ${
                          isCriticalVitaminD
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
                            : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
                        }`}
                        title="Place real restock PO in database"
                      >
                        <Plus className="h-3 w-3" />
                        <span>+30 Units</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Inventory Stock Item</h3>
                <p className="text-xs text-slate-500">Record a new reagent pack or diagnostic kit</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg leading-none">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateItem} className="p-5 space-y-3.5 text-xs">
              {formError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ferritin Calibrator Pack"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600 bg-white"
                  >
                    <option value="Reagent">Reagent</option>
                    <option value="Control">Control</option>
                    <option value="Calibrator">Calibrator</option>
                    <option value="Consumable">Consumable</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reorder Level</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Unit Cost (₹)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.unitCost}
                    onChange={(e) => setFormData({ ...formData, unitCost: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supplier</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Roche Diagnostics India"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-teal-600"
                />
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
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
