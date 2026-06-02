import React, { useState, useEffect } from 'react';
import { Gift, Plus, Trash2, IndianRupee, Award, Sparkles } from 'lucide-react';
import { readPlannerStorage } from '../plannerStorage';

interface ChumanGift {
  id: string;
  guestName: string;
  type: 'Cash' | 'Physical Item';
  amountOrValue: number; // Value of cash or physical item
  itemName?: string;      // Physical item descriptors (e.g., Gold Coin)
  date: string;
  notes: string;
}

export const PlannerChuman: React.FC = () => {
  const [chumanList, setChumanList] = useState<ChumanGift[]>(() =>
    readPlannerStorage<ChumanGift[]>('utsav_planner_chuman', [])
  );

  // Filter type selection
  const [activeFilter, setActiveFilter] = useState<'All' | 'Cash' | 'Physical Item'>('All');

  // Inputs
  const [cName, setCName] = useState('');
  const [cType, setCType] = useState<'Cash' | 'Physical Item'>('Cash');
  const [cValue, setCValue] = useState('');
  const [cItemName, setCItemName] = useState('');
  const [cDate, setCDate] = useState('');
  const [cNotes, setCNotes] = useState('');

  useEffect(() => {
    localStorage.setItem('utsav_planner_chuman', JSON.stringify(chumanList));
  }, [chumanList]);

  const handleAddChumanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName || !cValue) return;

    const newGift: ChumanGift = {
      id: `chu-${Date.now()}`,
      guestName: cName,
      type: cType,
      amountOrValue: parseFloat(cValue) || 0,
      itemName: cType === 'Physical Item' ? (cItemName || 'Assorted Gift Box') : undefined,
      date: cDate || new Date().toISOString().split('T')[0],
      notes: cNotes
    };

    setChumanList([newGift, ...chumanList]);
    setCName('');
    setCValue('');
    setCItemName('');
    setCNotes('');
  };

  const handleDeleteChuman = (id: string) => {
    setChumanList(chumanList.filter(item => item.id !== id));
  };

  // CALCULATIONS
  const totalReceivedCombined = chumanList.reduce((acc, item) => acc + item.amountOrValue, 0);
  const totalCashGiftsSum = chumanList.filter(i => i.type === 'Cash').reduce((acc, i) => acc + i.amountOrValue, 0);
  const totalPhysicalEstimatedSum = chumanList.filter(i => i.type === 'Physical Item').reduce((acc, i) => acc + i.amountOrValue, 0);
  const cashEntriesCount = chumanList.filter(i => i.type === 'Cash').length;
  const physicalEntriesCount = chumanList.filter(i => i.type === 'Physical Item').length;

  const filteredChuman = chumanList.filter(item => {
    return activeFilter === 'All' || item.type === activeFilter;
  });

  const averageGiftValue =
    chumanList.length > 0 ? Math.round(totalReceivedCombined / chumanList.length) : 0;

  return (
    <div className="space-y-8 pb-12" id="planner-chuman-root">

      {/* Summary dashboard cards (matches Guests planner layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="chuman-aggregates">

        {/* Cash gifts ledger summary */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Cash Shagun (चुमन राशि)</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white leading-none mt-1">
              ₹ {totalCashGiftsSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-green-600 font-bold font-mono mt-0.5 block">
              💸 {cashEntriesCount} envelopes logged
            </span>
          </div>
        </div>

        {/* Physical gifts ledger summary */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-rose-100 dark:bg-rose-500/10 rounded-xl text-rose-600 dark:text-rose-400">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Physical Gift Valuation</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white leading-none mt-1">
              ₹ {totalPhysicalEstimatedSum.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-orange-600 font-bold font-mono mt-0.5 block">
              🎁 {physicalEntriesCount} assets recorded
            </span>
          </div>
        </div>

        {/* Average gift per entry */}
        <div className="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm text-left flex items-center gap-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-600 dark:text-orange-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold block">Average per Blessing</span>
            <h3 className="text-xl font-semibold text-stone-900 dark:text-white leading-none mt-1">
              ₹ {averageGiftValue.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-400 font-mono mt-0.5 block">
              {chumanList.length} total entries in ledger
            </span>
          </div>
        </div>

        {/* Total blessings — accent card (replaces top banner) */}
        <div className="bg-stone-900 border border-stone-800 text-white p-5 rounded-2xl shadow-sm text-left flex items-center gap-4 relative overflow-hidden">
          <div className="absolute right-[-10px] bottom-[-10px] text-white/5 font-semibold text-7xl select-none pointer-events-none">
            🌸
          </div>
          <div className="p-3 bg-white/10 rounded-xl z-10 shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="z-10 min-w-0">
            <span className="text-[10px] text-stone-300 font-semibold block">Total Auspicious Blessings</span>
            <h3 className="text-2xl font-semibold leading-none mt-1">
              ₹ {totalReceivedCombined.toLocaleString('en-IN')}
            </h3>
            <span className="text-[9px] text-stone-400 font-mono italic mt-1 block truncate">
              Chuman & Shagun — cash + physical valuation
            </span>
          </div>
        </div>

      </div>

      {/* Unified Blessing Registry & Shagun Logs Hub Card */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden text-left" id="unified-shagun-logs-hub">
        
        {/* Card Header (Shared & Integrated) */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-orange-600" />
              <b className="text-base font-semibold text-stone-900 dark:text-white">Utsav Shagun & Chuman Blessing Registry</b>
            </div>
            <p className="text-xs text-stone-400 dark:text-stone-400 mt-1">
              Record auspicious cash envelopes (चुमन राशि) or physical assets received from guests, and track historic blessing logs.
            </p>
          </div>
        </div>

        {/* Card Body - Dual Section Layout inside the same card */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LHS Custom Input Form */}
            <div className="lg:col-span-1 lg:border-r border-stone-100 dark:border-stone-700 lg:pr-6 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-700">
                <Plus className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Record Gift Blessing</h4>
              </div>

              <form onSubmit={handleAddChumanSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Auspicious Giver (Guest Name)</label>
                  <input
                    type="text"
                    placeholder="Name"
                    value={cName}
                    onChange={e => setCName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-orange-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Gift Format Type</label>
                  <select
                    value={cType}
                    onChange={e => setCType(e.target.value as any)}
                    className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 text-stone-900 dark:text-white font-bold"
                  >
                    <option value="Cash">Cash Envelope (Envelope Shagun)</option>
                    <option value="Physical Item">Physical Asset / Ornament / Saree</option>
                  </select>
                </div>

                {cType === 'Physical Item' && (
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Gift Item Name / Descriptors</label>
                    <input
                      type="text"
                      placeholder="e.g. Gold Plated Silver Coin"
                      value={cItemName}
                      onChange={e => setCItemName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-1"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">
                    {cType === 'Cash' ? 'Auspicious Sum (₹ Cash Amount)' : 'Estimated Market Value (₹ Equivalent)'}
                  </label>
                  <input
                    type="number"
                    placeholder="₹ Value"
                    value={cValue}
                    onChange={e => setCValue(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-white font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Presented Date</label>
                  <input
                    type="date"
                    value={cDate}
                    onChange={e => setCDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-stone-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Additional blessing / Custom Notes</label>
                  <textarea
                    placeholder="Details of families background or other descriptions..."
                    value={cNotes}
                    onChange={e => setCNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Blessing</span>
                </button>
              </form>
            </div>

            {/* RHS Reactive Shagun Ledger & Logs */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Filter section inside directory container */}
              <div className="p-3 bg-stone-50 dark:bg-stone-900/40 rounded-xl border border-stone-100 dark:border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex gap-2 flex-wrap items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mr-1">Blessing Envelopes:</span>
                  {(['All', 'Cash', 'Physical Item'] as const).map((fil) => (
                    <button
                      key={fil}
                      onClick={() => setActiveFilter(fil)}
                      className={`px-3 py-1 rounded-full text-[9px] font-bold transition-colors border ${
                        activeFilter === fil
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-300 hover:bg-stone-105 dark:border-stone-700'
                      }`}
                    >
                      {fil === 'All' ? 'Complete Envelopes' : fil} ({fil === 'All' ? chumanList.length : chumanList.filter(c => c.type === fil).length})
                    </button>
                  ))}
                </div>
              </div>

              {/* Table registry list */}
              <div className="overflow-x-auto rounded-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-stone-50 dark:bg-stone-900 text-[10px] font-bold text-stone-500 border-b border-stone-200 dark:border-stone-700 font-mono">
                      <th className="p-3 text-left">Blessing Giver Name</th>
                      <th className="p-3 text-left">Gift Format Type</th>
                      <th className="p-3 text-left">Physical Descriptors description</th>
                      <th className="p-3 text-left">Recorded Date</th>
                      <th className="p-3 text-right">Envelope Valuation (₹)</th>
                      <th className="p-3 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-stone-150">
                    {filteredChuman.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400 font-bold">
                          No recorded blessings found under this list filter.
                        </td>
                      </tr>
                    ) : (
                      filteredChuman.map((item) => (
                        <tr key={item.id} className="hover:bg-orange-500/5 transition-colors">
                          
                          {/* Name and notes */}
                          <td className="p-3 text-left">
                            <b className="text-stone-950 dark:text-white block font-extrabold">{item.guestName}</b>
                            {item.notes && <p className="text-[10px] text-stone-400 italic mt-0.5 font-mono">Note: {item.notes}</p>}
                          </td>

                          {/* Format */}
                          <td className="p-3 text-left">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.type === 'Cash'
                                ? 'bg-emerald-500/10 text-emerald-600'
                                : 'bg-orange-500/10 text-orange-600'
                            }`}>
                              {item.type}
                            </span>
                          </td>

                          {/* Description */}
                          <td className="p-3 text-left text-stone-500">
                            {item.itemName || '— Enveloped Cash Shagun —'}
                          </td>

                          {/* Date */}
                          <td className="p-3 text-stone-400 font-mono text-[11px]">
                            {item.date}
                          </td>

                          {/* Cost/Value */}
                          <td className="p-3 text-right font-bold text-stone-900 dark:text-white font-mono">
                            ₹ {item.amountOrValue.toLocaleString('en-IN')}
                          </td>

                          {/* Action erase */}
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleDeleteChuman(item.id)}
                              className="p-1 hover:bg-stone-100 text-stone-400 hover:text-red-500 rounded"
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

              <div className="mt-4 pt-4 border-t border-stone-200 dark:border-stone-700 text-[10px] text-stone-400 italic">
                <span>ℹ️ These listings represent traditional village wedding record booklets to assist reciprocal family gifting audits in future invitations.</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
