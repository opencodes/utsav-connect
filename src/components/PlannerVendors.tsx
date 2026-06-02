import React, { useState, useEffect } from 'react';
import { readPlannerStorage } from '../plannerStorage';
import { Truck, Plus, Trash2, Phone, IndianRupee, ListChecks, CheckCircle, HelpCircle, AlertTriangle } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  category: 'Kirana / Grocery' | 'Milk Supplier' | 'Curd Supplier' | 'Sweet Shop / Halwai' | 'Tent / Catering Support' | 'Other vendors';
  serviceDetails: string;
  pricing: number; // Contract Pricing
  advancePaid: number;
  contact: string;
  status: 'Contract Created' | 'Advance Paid' | 'Partially Paid' | 'Settle on Completion';
}


export const PlannerVendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(() =>
    readPlannerStorage<Vendor[]>('utsav_planner_vendors', [])
  );

  // Category filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Input states
  const [vName, setVName] = useState('');
  const [vCategory, setVCategory] = useState<'Kirana / Grocery' | 'Milk Supplier' | 'Curd Supplier' | 'Sweet Shop / Halwai' | 'Tent / Catering Support' | 'Other vendors'>('Kirana / Grocery');
  const [vService, setVService] = useState('');
  const [vPricing, setVPric] = useState('');
  const [vAdvance, setVAdv] = useState('');
  const [vContact, setVContact] = useState('');
  const [vStatus, setVStatus] = useState<any>('Contract Created');

  useEffect(() => {
    localStorage.setItem('utsav_planner_vendors', JSON.stringify(vendors));
  }, [vendors]);

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vName || !vPricing || !vContact) return;

    const pricingNum = parseFloat(vPricing) || 0;
    const advanceNum = parseFloat(vAdvance) || 0;

    let calStatus = 'Contract Created';
    if (advanceNum === pricingNum && pricingNum > 0) {
      calStatus = 'Advance Paid';
    } else if (advanceNum > 0 && advanceNum < pricingNum) {
      calStatus = 'Partially Paid';
    } else if (pricingNum > 0 && advanceNum === 0) {
      calStatus = 'Settle on Completion';
    }

    const newVen: Vendor = {
      id: `ven-${Date.now()}`,
      name: vName,
      category: vCategory,
      serviceDetails: vService,
      pricing: pricingNum,
      advancePaid: advanceNum,
      contact: vContact,
      status: calStatus as any
    };

    setVendors([...vendors, newVen]);
    setVName('');
    setVService('');
    setVPric('');
    setVAdv('');
    setVContact('');
  };

  const handleDeleteVendor = (id: string) => {
    setVendors(vendors.filter(v => v.id !== id));
  };

  // Direct Contract Settlements
  const handleQuickAdvanceSettle = (id: string, settleAmount: number) => {
    setVendors(vendors.map(v => {
      if (v.id === id) {
        const nextAdv = Math.min(v.pricing, v.advancePaid + settleAmount);
        const nextStatus = nextAdv === v.pricing ? 'Advance Paid' : 'Partially Paid';
        return { ...v, advancePaid: nextAdv, status: nextStatus as any };
      }
      return v;
    }));
  };

  // CALCULATIONS FOR DIRECT PAYMENT OVERVIEW dashboard
  const totalVendorsCount = vendors.length;
  const totalContractVal = vendors.reduce((acc, v) => acc + v.pricing, 0);
  const totalAdvancesPaid = vendors.reduce((acc, v) => acc + v.advancePaid, 0);
  const totalOutstandingBal = totalContractVal - totalAdvancesPaid;

  // Filter categorization
  const filteredVendors = vendors.filter(v => {
    return activeCategory === 'All' || v.category === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-vendors-root">
      
      {/* Financial health board widget */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="vendors-ledger-dashboard">
        
        {/* Metric 1 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-105 rounded-xl text-orange-600">
            <Truck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Assigned Suppliers</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white mt-1 leading-none">
              {totalVendorsCount} <span className="text-xs font-normal text-stone-500">Contractors</span>
            </h3>
            <span className="text-[9px] text-orange-600 font-mono font-bold mt-1 block">🟢 Active Logistics</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-stone-100 dark:bg-stone-900 rounded-xl text-stone-600 dark:text-stone-300">
            <IndianRupee className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Total Service Budgets</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalContractVal.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-500 mt-1 block font-mono">Consolidated Bids</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Total Paid Advance</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white mt-1 leading-none">
              ₹ {totalAdvancesPaid.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-green-600 font-mono font-bold mt-1 block">🛡️ Guaranteed Deposits</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl text-left flex items-center gap-4">
          <div className="p-3 bg-rose-500/20 rounded-xl text-rose-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-rose-800 dark:text-rose-400 font-bold block">Outstanding Balances due</span>
            <h3 className="text-xl font-semibold text-rose-700 dark:text-rose-400 mt-1 leading-none">
              ₹ {totalOutstandingBal.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-rose-600 hover:underline font-mono mt-1 block font-bold cursor-help" onClick={() => alert('Settle these dues directly inside active rows below.')}>
              ⏳ Settle post ceremony ➔
            </span>
          </div>
        </div>

      </div>

      {/* Unified Vendor Management & Service Logistics Hub */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden text-left" id="unified-vendor-management-hub">
        
        {/* Card Header (Shared & Integrated) */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              <b className="text-base font-semibold text-stone-900 dark:text-white">Utsav Service Logistics & Vendor Directory Hub</b>
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-400 mt-1">
              Maintain supplier contracting pools, track advance deposits, and settle outstanding balances on a unified ledger register.
            </p>
          </div>
          
          <span className="text-[10px] font-mono font-bold bg-orange-600/10 text-orange-600 px-2 py-1 rounded">Total Vendors: {vendors.length}</span>
        </div>

        {/* Card Body - Dual Section Layout inside the same card */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LHS Compact Entry Form */}
            <div className="lg:col-span-1 lg:border-r border-stone-100 dark:border-stone-700 lg:pr-6 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-700">
                <Plus className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">Select & Add Vendor</h4>
              </div>

              <form onSubmit={handleAddVendorSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Supplier Category</label>
                  <select
                    value={vCategory}
                    onChange={e => setVCategory(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Kirana / Grocery">Kirana / Grocery Store</option>
                    <option value="Milk Supplier">Milk Supplier / Dairy</option>
                    <option value="Curd Supplier">Curd Supplier / Halwai</option>
                    <option value="Sweet Shop / Halwai">Sweet Shop / Central Halwai</option>
                    <option value="Tent / Catering Support">Tent & Catering Support</option>
                    <option value="Other vendors">Other Special Vendor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Vendor/Merchant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sudha milk distributors Co-op"
                    value={vName}
                    onChange={e => setVName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+91 xxxxx xxxxx"
                    value={vContact}
                    onChange={e => setVContact(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Contract Price</label>
                    <input
                      type="number"
                      placeholder="Total ₹"
                      value={vPricing}
                      onChange={e => setVPric(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Paid Deposit</label>
                    <input
                      type="number"
                      placeholder="Paid ₹"
                      value={vAdvance}
                      onChange={e => setVAdv(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Service particulars / Items list</label>
                  <textarea
                    placeholder="List specific ingredients weights or material counts..."
                    value={vService}
                    onChange={e => setVService(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Vendor Link</span>
                </button>
              </form>
            </div>

            {/* RHS Reactive Vendors Directory and Ledger */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Category selector inside directory container */}
              <div className="p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-100 dark:border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Categories:</span>
                  {['All', 'Kirana / Grocery', 'Milk Supplier', 'Curd Supplier', 'Sweet Shop / Halwai', 'Tent / Catering Support', 'Other vendors'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border ${
                        activeCategory === cat
                          ? 'bg-orange-600 text-white border-orange-600 font-extrabold'
                          : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 hover:bg-stone-105 dark:border-stone-700'
                      }`}
                    >
                      {cat === 'All' ? 'All Vendors' : cat} ({cat === 'All' ? vendors.length : vendors.filter(v => v.category === cat).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Table Layout */}
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                      <th className="p-3 text-left">Vendor particulars</th>
                      <th className="p-3 text-left">Service details</th>
                      <th className="p-3 text-right">Contract Dues</th>
                      <th className="p-3 text-right">Outstanding Balance</th>
                      <th className="p-3 text-center">Quick Record Settlement</th>
                      <th className="p-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-stone-150 dark:divide-stone-700 text-stone-900 dark:text-stone-105">
                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400 font-semibold">
                          No active vendors match this logistics node category.
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((v) => {
                        const balance = v.pricing - v.advancePaid;
                        return (
                          <tr key={v.id} className="hover:bg-orange-500/5 transition-colors">
                            
                            {/* Vendor and Phone */}
                            <td className="p-3 text-left">
                              <b className="text-stone-900 dark:text-white font-extrabold block">{v.name}</b>
                              <span className="text-[9px] font-mono select-all bg-stone-100 dark:bg-stone-900 text-stone-500 px-1 py-0.2 rounded w-max block mt-1">{v.contact}</span>
                              <span className="text-[10px] font-bold text-orange-605 block mt-0.5">{v.category}</span>
                            </td>

                            {/* Detail summary */}
                            <td className="p-3 text-left">
                              <p className="text-[11px] text-stone-605 leading-relaxed truncate max-w-[200px]" title={v.serviceDetails}>
                                {v.serviceDetails || 'General logistics and deliveries support.'}
                              </p>
                            </td>

                            {/* Pricing total and advance */}
                            <td className="p-3 text-right">
                              <span className="block font-bold">₹ {v.pricing.toLocaleString('en-IN')}</span>
                              <span className="text-[10px] text-emerald-600 block font-mono">Adv: ₹{v.advancePaid.toLocaleString('en-IN')}</span>
                            </td>

                            {/* Outstanding Balance */}
                            <td className="p-3 text-right">
                              <span className={`font-mono font-bold ${balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                ₹ {balance.toLocaleString('en-IN')}
                              </span>
                              <span className={`text-[8px] font-semibold block ${balance > 0 ? 'text-rose-500' : 'text-emerald-500 font-mono'}`}>
                                {balance === 0 ? 'Fully Settled' : 'Dues Pending'}
                              </span>
                            </td>

                            {/* Quick Payment action buttons */}
                            <td className="p-3 text-center">
                              {balance === 0 ? (
                                <span className="text-[10px] font-bold text-emerald-600">💰 Closed Contract</span>
                              ) : (
                                <div className="flex gap-1 justify-center">
                                  <button
                                    onClick={() => handleQuickAdvanceSettle(v.id, Math.min(balance, 5000))}
                                    className="px-2 py-1 bg-stone-100 dark:bg-stone-900 text-[10px] font-bold rounded border dark:border-stone-700 hover:bg-orange-600 hover:text-white text-stone-850 dark:text-stone-200 transition-all font-mono cursor-pointer"
                                    title="Pay ₹5000 Advance"
                                  >
                                    +₹5K Adv
                                  </button>
                                  <button
                                    onClick={() => handleQuickAdvanceSettle(v.id, balance)}
                                    className="px-2 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded hover:bg-emerald-700 transition-all tracking-tight cursor-pointer"
                                    title="Settle all contract dues"
                                  >
                                    Settle All
                                  </button>
                                </div>
                              )}
                            </td>

                            {/* Cancel button */}
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleDeleteVendor(v.id)}
                                className="p-1 hover:bg-stone-105 rounded text-stone-400 hover:text-red-500 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-700 text-[11px] text-stone-400 flex items-center gap-2">
                <span>ℹ️ Advance status categories are calculated automatedly based on paid vs invoice balance ratio.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
