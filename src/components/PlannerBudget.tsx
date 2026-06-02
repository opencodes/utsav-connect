import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, LayoutGrid, Scale, Activity, CheckCircle, AlertCircle } from 'lucide-react';
import { readPlannerStorage } from '../plannerStorage';

interface Expense {
  id: string;
  name: string;
  category: 'Grocery' | 'Catering' | 'Decoration' | 'Attire' | 'Gifts' | 'Miscellaneous' | 'Venue' | 'Vendors';
  cost: number;
  status: 'Paid' | 'Pending';
  date: string;
  paidTo: string; // Beneficiary
}

export const PlannerBudget: React.FC = () => {
  const [masterBudget, setMasterBudget] = useState<number>(() => {
    const saved = localStorage.getItem('utsav_planner_budget_limit');
    return saved ? parseFloat(saved) : 0;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() =>
    readPlannerStorage<Expense[]>('utsav_planner_expenses', [])
  );

  // Form Inputs
  const [tempBudgetInput, setTempBudgetInput] = useState('');
  const [expName, setExpName] = useState('');
  const [expCategory, setExpCategory] = useState<'Grocery' | 'Catering' | 'Decoration' | 'Attire' | 'Gifts' | 'Miscellaneous' | 'Venue' | 'Vendors'>('Catering');
  const [expCost, setExpCost] = useState('');
  const [expStatus, setExpStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [expDate, setExpDate] = useState('');
  const [expPaidTo, setExpPaidTo] = useState('');

  // Category search state
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    localStorage.setItem('utsav_planner_budget_limit', masterBudget.toString());
  }, [masterBudget]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const handleSetBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(tempBudgetInput) || 0;
    if (val > 0) {
      setMasterBudget(val);
      setTempBudgetInput('');
      alert(`Master Event limit configured safely to ₹${val.toLocaleString('en-IN')}.`);
    }
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expName || !expCost || !expPaidTo) return;

    const newExp: Expense = {
      id: `exp-${Date.now()}`,
      name: expName,
      category: expCategory,
      cost: parseFloat(expCost) || 0,
      status: expStatus,
      date: expDate || new Date().toISOString().split('T')[0],
      paidTo: expPaidTo
    };

    setExpenses([...expenses, newExp]);
    setExpName('');
    setExpCost('');
    setExpPaidTo('');
    setExpDate('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const handleTogglePaidStatus = (id: string) => {
    setExpenses(expenses.map(exp => {
      if (exp.id === id) {
        return { ...exp, status: exp.status === 'Paid' ? 'Pending' : 'Paid' };
      }
      return exp;
    }));
  };

  // CALCULATIONS / DRILLS
  const totalCostCombined = expenses.reduce((acc, e) => acc + e.cost, 0);
  const totalPaidSum = expenses.filter(e => e.status === 'Paid').reduce((acc, e) => acc + e.cost, 0);
  const totalPendingSum = expenses.filter(e => e.status === 'Pending').reduce((acc, e) => acc + e.cost, 0);
  const remainingBudgetLeft = masterBudget - totalCostCombined;
  const allocationPercentage = Math.min(100, Math.round((totalCostCombined / masterBudget) * 100));

  // Category wise breaks
  const uniqueCategories: Expense['category'][] = ['Grocery', 'Catering', 'Decoration', 'Attire', 'Gifts', 'Miscellaneous', 'Venue', 'Vendors'];
  const getCategorySum = (cat: Expense['category']) => {
    return expenses.filter(e => e.category === cat).reduce((acc, e) => acc + e.cost, 0);
  };

  const filteredExpenses = expenses.filter(e => {
    return activeCategory === 'All' || e.category === activeCategory;
  });

  return (
    <div className="space-y-8 pb-12" id="planner-budget-root">
      
      {/* Graphical Progress & Stats Bar */}
      <div className="bg-white dark:bg-stone-800 p-6 rounded-3xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left">
        <h2 className="text-sm font-semibold text-stone-400 mb-4">Master Financial Ledger Status</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] text-stone-400 font-bold block">Master Event Budget</span>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-xl font-semibold text-stone-900 dark:text-white leading-none">
                ₹ {masterBudget.toLocaleString('en-IN')}
              </h3>
            </div>
            
            {/* Direct Form Inline to update budget */}
            <form onSubmit={handleSetBudgetSubmit} className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Adjust limit ₹"
                value={tempBudgetInput}
                onChange={e => setTempBudgetInput(e.target.value)}
                className="px-2 py-1 text-[10px] rounded border w-24 bg-white dark:bg-stone-900 text-stone-950 dark:text-white font-mono"
              />
              <button type="submit" className="text-[10px] bg-orange-600 text-white px-2 py-1 rounded font-bold hover:bg-orange-700 transition">
                Set
              </button>
            </form>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] text-stone-400 font-bold block">Consolidated Outlays</span>
            <h3 className="text-xl font-semibold text-orange-600 mt-1 leading-none">
              ₹ {totalCostCombined.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-400 block font-mono mt-1">Sum of {expenses.length} distinct lines</span>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] text-stone-400 font-bold block">Dues Settled (Paid)</span>
            <h3 className="text-xl font-semibold text-emerald-600 dark:text-emerald-400 mt-1 leading-none">
              ₹ {totalPaidSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-emerald-600 font-bold font-mono block mt-1">Ready Clearances</span>
          </div>

          <div className="p-4 bg-stone-50 dark:bg-stone-900 rounded-2xl">
            <span className="text-[10px] text-stone-450 font-bold block">Dues Uncleared (Pending)</span>
            <h3 className="text-xl font-semibold text-rose-600 dark:text-rose-450 mt-1 leading-none">
              ₹ {totalPendingSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-rose-500 font-mono block mt-1">Owed to merchant lists</span>
          </div>
        </div>

        {/* Dynamic Progress indicator */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-700">
          <div className="flex justify-between items-baseline mb-2 text-xs">
            <span className="font-extrabold text-stone-500 text-[10px]">Consolidated Budget Utilization Progress</span>
            <span className={`font-mono font-bold ${remainingBudgetLeft >= 0 ? 'text-emerald-600' : 'text-red-500 font-semibold'}`}>
              {remainingBudgetLeft >= 0 
                ? `Remaining Balance: ₹ ${remainingBudgetLeft.toLocaleString('en-IN')} (${100 - allocationPercentage}% Left)` 
                : `💥 OVERBUDGET SLIPPAGE: ₹ ${Math.abs(remainingBudgetLeft).toLocaleString('en-IN')} OVER CONTRACT`
              }
            </span>
          </div>
          <div className="w-full bg-stone-100 dark:bg-stone-900 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 font-mono text-[9px] text-white flex items-center justify-end pr-2.5 font-bold ${
                allocationPercentage > 90 
                  ? 'bg-[#C51C13]' 
                  : 'bg-stone-600'
              }`}
              style={{ width: `${allocationPercentage}%` }}
            >
              {allocationPercentage}% UTILISED
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Category Breakdown Ledger Charts */}
      <div className="bg-white dark:bg-stone-800 p-5 rounded-3xl border border-stone-200/60 dark:border-stone-700/60 p-4 shadow-sm text-left">
        <h4 className="text-xs font-semibold text-stone-400 mb-3">CONSOLIDATED CATEGORY PIE SCALE</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 text-center">
          {uniqueCategories.map(cat => {
            const sum = getCategorySum(cat);
            const ratio = totalCostCombined > 0 ? Math.round((sum / totalCostCombined) * 105) : 0;
            return (
              <div key={cat} className="p-2.5 bg-stone-50 dark:bg-stone-900 rounded-xl flex flex-col justify-between">
                <span className="text-[10px] font-bold text-stone-400 tracking-tight truncate block">{cat}</span>
                <b className="text-xs text-stone-900 dark:text-white block mt-1.5">₹{sum.toLocaleString('en-IN')}</b>
                {sum > 0 && <span className="text-[8px] font-mono font-bold text-orange-600 mt-1">占比 ~{ratio}%</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Form: List interface */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden text-left" id="utsav-expenditure-registry-ledger-hub">
        
        {/* Card Header (Shared & Integrated) */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-600" />
              <b className="text-base font-semibold text-stone-900 dark:text-white">Utsav Detailed Expenditure Ledger Hub</b>
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-400 mt-1">
              Record new outlay allocations, track chronological category flows, and instantly clear dues in a single unified ledger workspace.
            </p>
          </div>
          
          <span className="text-[10px] font-mono font-bold bg-orange-600/10 text-orange-600 px-2 py-1 rounded">Total Entries: {expenses.length}</span>
        </div>

        {/* Card Body - Dual Section Layout inside the same card */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LHS Outflow Creation Form */}
            <div className="lg:col-span-1 lg:border-r border-stone-100 dark:border-stone-700 lg:pr-6 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-700">
                <Plus className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Record Outflow Line</h4>
              </div>

              <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Expenditure / Line Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Halwai dry fruits"
                    value={expName}
                    onChange={e => setExpName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Group Category</label>
                    <select
                      value={expCategory}
                      onChange={e => setExpCategory(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 text-stone-900 dark:text-white focus:outline-none"
                    >
                      {uniqueCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Total Cost (INR)</label>
                    <input
                      type="number"
                      placeholder="Cost ₹"
                      value={expCost}
                      onChange={e => setExpCost(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Date of billing</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Paid to (Supplier/Merchant)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sudha Dairy Agent"
                    value={expPaidTo}
                    onChange={e => setExpPaidTo(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-600 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Payment Status</label>
                  <select
                    value={expStatus}
                    onChange={e => setExpStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 focus:outline-none"
                  >
                    <option value="Paid">Cleared / Paid In Full</option>
                    <option value="Pending">Pending / Promised dues</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Line</span>
                </button>
              </form>
            </div>

            {/* RHS Detailed Ledger View */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Category selector inside ledger workspace */}
              <div className="p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-100 dark:border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Categories:</span>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border ${
                      activeCategory === 'All'
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 hover:bg-stone-105 dark:border-stone-700'
                    }`}
                  >
                    Show All ({expenses.length})
                  </button>
                  {uniqueCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold transition-all border ${
                        activeCategory === cat
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 hover:bg-stone-105 dark:border-stone-700'
                      }`}
                    >
                      {cat} ({expenses.filter(e => e.category === cat).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* List logs table */}
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                      <th className="p-3">Reference / Category</th>
                      <th className="p-3">Beneficiary Paid-to</th>
                      <th className="p-3">Billing Date</th>
                      <th className="p-3 text-right">Sum Cost (INR)</th>
                      <th className="p-3 text-center">Payment Status</th>
                      <th className="p-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-150 dark:divide-stone-700 text-xs">
                    {filteredExpenses.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400 font-bold">
                          No recorded expenses under this categorical ledger group.
                        </td>
                      </tr>
                    ) : (
                      filteredExpenses.map((exp) => (
                        <tr key={exp.id} className="hover:bg-orange-500/5 transition-colors">
                          
                          {/* Reference name */}
                          <td className="p-3">
                            <div>
                              <b className="text-stone-950 dark:text-white block font-extrabold">{exp.name}</b>
                              <span className="text-[9px] font-bold font-mono text-orange-600 bg-orange-600/10 px-1 py-0.2 rounded w-max block mt-0.5">
                                {exp.category}
                              </span>
                            </div>
                          </td>

                          {/* Paid to */}
                          <td className="p-3 font-mono font-medium text-stone-700 dark:text-stone-300">
                            {exp.paidTo}
                          </td>

                          {/* Date */}
                          <td className="p-3 text-stone-450 font-mono text-[11px]">
                            {exp.date}
                          </td>

                          {/* Cost */}
                          <td className="p-3 text-right font-bold text-stone-950 dark:text-white">
                            ₹ {exp.cost.toLocaleString('en-IN')}
                          </td>

                          {/* Status change toggle switch */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleTogglePaidStatus(exp.id)}
                              className={`px-3 py-1 font-semibold text-[9px] rounded-xl border transition-all ${
                                exp.status === 'Paid'
                                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600'
                                  : 'bg-red-500/10 border-red-500/30 text-red-605 animate-pulse'
                              }`}
                              title="Click to toggle transaction status"
                            >
                              {exp.status === 'Paid' ? '🟢 Paid / Cleared' : '🔴 Unpaid / Pending'}
                            </button>
                          </td>

                          {/* Erase layout */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded animate-none"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-400 italic">
                💡 Pro-tip: Click the status pills in the table to instantly swap transaction payment clearances in real-time.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
