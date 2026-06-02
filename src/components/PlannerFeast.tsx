import React, { useState, useEffect } from 'react';
import { readPlannerStorage } from '../plannerStorage';
import { ChefHat, Plus, Trash2, Calendar, Users, Scale, AlertCircle, ShoppingBag, Sparkles } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  category: 'Starter' | 'Main Course' | 'Breads' | 'Dessert' | 'Beverage';
  estimatedServingPerGuest: number; // e.g. 1.2 servings
  // Ingredient per guest ratios
  paneerRatioGrams: number;
  basmatiRiceRatioGrams: number;
  cowGheeRatioGrams: number;
  flourRatioGrams: number;
  sugarRatioGrams: number;
  milkYogurtRatioLiters: number;
  spicesRatioGrams: number;
}

interface FeastDayPlan {
  id: string;
  date: string;
  mealType: 'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner';
  expectedGuests: number;
  menuItems: MenuItem[];
}

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  {
    id: 'item-1',
    name: 'Kadhai Paneer Special',
    category: 'Main Course',
    estimatedServingPerGuest: 1.0,
    paneerRatioGrams: 120,
    basmatiRiceRatioGrams: 0,
    cowGheeRatioGrams: 15,
    flourRatioGrams: 0,
    sugarRatioGrams: 0,
    milkYogurtRatioLiters: 0.05,
    spicesRatioGrams: 8,
  },
  {
    id: 'item-2',
    name: 'Basmati Pulao Rice',
    category: 'Main Course',
    estimatedServingPerGuest: 1.2,
    paneerRatioGrams: 0,
    basmatiRiceRatioGrams: 80,
    cowGheeRatioGrams: 10,
    flourRatioGrams: 0,
    sugarRatioGrams: 0,
    milkYogurtRatioLiters: 0,
    spicesRatioGrams: 3,
  },
  {
    id: 'item-3',
    name: 'Butter Tandoori Naan',
    category: 'Breads',
    estimatedServingPerGuest: 2.0,
    paneerRatioGrams: 0,
    basmatiRiceRatioGrams: 0,
    cowGheeRatioGrams: 15,
    flourRatioGrams: 100,
    sugarRatioGrams: 0,
    milkYogurtRatioLiters: 0.02,
    spicesRatioGrams: 0,
  },
  {
    id: 'item-4',
    name: 'Traditional Gulab Jamun',
    category: 'Dessert',
    estimatedServingPerGuest: 1.5,
    paneerRatioGrams: 0,
    basmatiRiceRatioGrams: 0,
    cowGheeRatioGrams: 10,
    flourRatioGrams: 10,
    sugarRatioGrams: 45,
    milkYogurtRatioLiters: 0.05,
    spicesRatioGrams: 1,
  },
  {
    id: 'item-5',
    name: 'Kesari Masala Chai',
    category: 'Beverage',
    estimatedServingPerGuest: 1.2,
    paneerRatioGrams: 0,
    basmatiRiceRatioGrams: 0,
    cowGheeRatioGrams: 0,
    flourRatioGrams: 0,
    sugarRatioGrams: 15,
    milkYogurtRatioLiters: 0.15,
    spicesRatioGrams: 2,
  }
];

export const PlannerFeast: React.FC = () => {
  const [plans, setPlans] = useState<FeastDayPlan[]>(() =>
    readPlannerStorage<FeastDayPlan[]>('utsav_planner_feast', [])
  );

  const [allItems, setAllItems] = useState<MenuItem[]>(() => {
    const stored = readPlannerStorage<MenuItem[]>('utsav_planner_menu_items', []);
    return stored.length > 0 ? stored : DEFAULT_MENU_ITEMS;
  });

  // Form Inputs
  const [fDate, setFDate] = useState('');
  const [fMealType, setFMealType] = useState<'Breakfast' | 'Lunch' | 'High Tea' | 'Dinner'>('Dinner');
  const [fExpectedGuests, setFExpectedGuests] = useState('');
  const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);

  // Item custom ratio add state
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemCat, setCustomItemCat] = useState<'Starter' | 'Main Course' | 'Breads' | 'Dessert' | 'Beverage'>('Main Course');
  const [customServingPerGuest, setCustomServingPerGuest] = useState('1.0');
  const [customPaneerG, setCustomPaneerG] = useState('0');
  const [customRiceG, setCustomRiceG] = useState('0');
  const [customGheeG, setCustomGheeG] = useState('0');
  const [customFlourG, setCustomFlourG] = useState('0');
  const [customSugarG, setCustomSugarG] = useState('0');
  const [customMilkL, setCustomMilkL] = useState('0');
  const [customSpicesG, setCustomSpicesG] = useState('0');

  useEffect(() => {
    localStorage.setItem('utsav_planner_feast', JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem('utsav_planner_menu_items', JSON.stringify(allItems));
  }, [allItems]);

  const handleSelectItemToggle = (id: string) => {
    if (selectedItemsIds.includes(id)) {
      setSelectedItemsIds(selectedItemsIds.filter(i => i !== id));
    } else {
      setSelectedItemsIds([...selectedItemsIds, id]);
    }
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    // Verify if it is used in plans
    const isUsed = plans.some(plan => plan.menuItems.some(item => item.id === id));
    if (isUsed) {
      alert('This item is currently scheduled in active meal plans. Remove it from your feast day programs first.');
      return;
    }
    setAllItems(allItems.filter(item => item.id !== id));
    setSelectedItemsIds(selectedItemsIds.filter(i => i !== id));
  };

  const handleCreateCustomItem = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!customItemName.trim()) {
      alert('Please enter a valid menu item name.');
      return;
    }

    const newItem: MenuItem = {
      id: `menu-itm-${Date.now()}`,
      name: customItemName.trim(),
      category: customItemCat,
      estimatedServingPerGuest: parseFloat(customServingPerGuest) || 1.0,
      paneerRatioGrams: parseFloat(customPaneerG) || 0,
      basmatiRiceRatioGrams: parseFloat(customRiceG) || 0,
      cowGheeRatioGrams: parseFloat(customGheeG) || 0,
      flourRatioGrams: parseFloat(customFlourG) || 0,
      sugarRatioGrams: parseFloat(customSugarG) || 0,
      milkYogurtRatioLiters: parseFloat(customMilkL) || 0,
      spicesRatioGrams: parseFloat(customSpicesG) || 0,
    };

    const updatedItems = [...allItems, newItem];
    setAllItems(updatedItems);
    
    // Automatically select the freshly created custom menu item
    setSelectedItemsIds(prev => [...prev, newItem.id]);

    // Reset create custom item inputs
    setCustomItemName('');
    setCustomItemCat('Main Course');
    setCustomServingPerGuest('1.0');
    setCustomPaneerG('0');
    setCustomRiceG('0');
    setCustomGheeG('0');
    setCustomFlourG('0');
    setCustomSugarG('0');
    setCustomMilkL('0');
    setCustomSpicesG('0');

    // Close Section
    setShowQuickCreate(false);
  };

  const handleAddPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fDate || selectedItemsIds.length === 0) {
      alert('Please select at least one menu item.');
      return;
    }

    const compiledItems = allItems.filter(item => selectedItemsIds.includes(item.id));
    const newPlan: FeastDayPlan = {
      id: `fst-${Date.now()}`,
      date: fDate,
      mealType: fMealType,
      expectedGuests: parseInt(fExpectedGuests, 10) || 0,
      menuItems: compiledItems
    };

    setPlans([...plans, newPlan]);
    setFDate('');
    setFExpectedGuests('');
    setSelectedItemsIds([]);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
  };

  // RAW MATERIAL INGREDIENT ESTIMATION AGGREGATOR ENGINE
  const calculateTotalIngredients = () => {
    let totalPaneerKG = 0;
    let totalRiceKG = 0;
    let totalGheeKG = 0;
    let totalFlourKG = 0;
    let totalSugarKG = 0;
    let totalMilkYogurtLiters = 0;
    let totalSpicesKG = 0;

    plans.forEach(plan => {
      const guests = plan.expectedGuests;
      plan.menuItems.forEach(item => {
        const factor = item.estimatedServingPerGuest; // serves multiplier
        
        // Sum ratios
        totalPaneerKG += (item.paneerRatioGrams * guests * factor) / 1000;
        totalRiceKG += (item.basmatiRiceRatioGrams * guests * factor) / 1000;
        totalGheeKG += (item.cowGheeRatioGrams * guests * factor) / 1000;
        totalFlourKG += (item.flourRatioGrams * guests * factor) / 1000;
        totalSugarKG += (item.sugarRatioGrams * guests * factor) / 1000;
        totalMilkYogurtLiters += item.milkYogurtRatioLiters * guests * factor;
        totalSpicesKG += (item.spicesRatioGrams * guests * factor) / 1000;
      });
    });

    return {
      paneer: Math.ceil(totalPaneerKG),
      rice: Math.ceil(totalRiceKG),
      ghee: Math.ceil(totalGheeKG),
      flour: Math.ceil(totalFlourKG),
      sugar: Math.ceil(totalSugarKG),
      milk: Math.ceil(totalMilkYogurtLiters),
      spices: Math.ceil(totalSpicesKG)
    };
  };

  const rawMaterials = calculateTotalIngredients();

  return (
    <div className="space-y-8 pb-12" id="planner-feast-root">
      
      {/* Ingredient Autocalculator Display Board */}
      <div className="bg-white dark:bg-stone-800 border bg-gradient-to-br from-white to-stone-50/10 dark:from-stone-800 dark:to-stone-900 border-orange-600/30 rounded-3xl p-6 text-stone-900 dark:text-white shadow-sm relative overflow-hidden" id="ingredient-autocalc-board">
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.03] dark:opacity-5 pointer-events-none">
          <ChefHat className="w-full h-full text-orange-600" />
        </div>
        
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-stone-100 dark:border-stone-700/60 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-orange-600 text-white font-semibold text-[9px] rounded-md">
                Master Auto-calc engine
              </span>
              <span className="text-orange-600 font-mono text-[10px] font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 animate-spin text-orange-600" />
                Raw Ingredient Demand Chart
              </span>
            </div>
            <h2 className="text-xl font-semibold mt-1 tracking-tight text-stone-900 dark:text-white">Catering Raw Materials Aggregation</h2>
            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-xl">
              This panel automatically aggregates flour, milk, spices, basmati rice, ghee and paneer weights in real-time by multiplying meal plans, item recipes, and expected headcounts.
            </p>
          </div>
          <div className="text-right">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] block font-mono">Total Meal Plans Loaded</span>
            <span className="text-2xl font-semibold text-orange-600">{plans.length} Slots</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 text-center">
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Basmati Rice</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.rice} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Scented Rice</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Royal Ghee</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.ghee} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Pure Cow Ghee</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Fresh Paneer</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.paneer} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Cottage Cheese</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Maida / Flour</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.flour} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Wheat Base</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Pure Sugar</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.sugar} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Sweets / Syrup</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Milk / Dairy</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.milk} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">Litres</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Yogurt/Cream</span>
          </div>
          <div className="bg-stone-50 dark:bg-stone-900/60 p-3 rounded-2xl border border-stone-200/40 dark:border-stone-700/50">
            <span className="text-[9px] font-mono font-bold text-stone-500 dark:text-stone-400 block">Royal Spices</span>
            <b className="text-base text-orange-655 block mt-1">{rawMaterials.spices} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">KG</span></b>
            <span className="text-[8px] text-stone-400 dark:text-stone-500 block font-mono mt-1">Cardamom/Masala</span>
          </div>
        </div>
      </div>

      {/* Unified Feast Day scheduler & Culinary Planners Hub */}
      <div className="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 shadow-sm overflow-hidden text-left" id="unified-feast-planner-hub">
        
        {/* Card Header (Shared & Integrated) */}
        <div className="p-6 border-b border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-orange-600" />
              <b className="text-base font-semibold text-stone-900 dark:text-white">Utsav Culinary & Feast Planner Scheduler Hub</b>
            </div>
            <p className="text-xs text-stone-405 dark:text-stone-400 mt-1">
              Add upcoming festive programs, map scalable ingredient ratios per guest head, and organize master kitchen feast checklists.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold bg-orange-600/10 text-orange-600 px-2 py-1 rounded">
            Scheduled Slots: {plans.length}
          </span>
        </div>

        {/* Card Body - Dual Section Layout inside the same card */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LHS Column: Feast Planners Creator Form */}
            <div className="lg:border-r border-stone-100 dark:border-stone-700 lg:pr-6 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-700">
                <Calendar className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">Schedule Feast Day</h4>
              </div>

              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Feast Date</label>
                  <input
                    type="date"
                    value={fDate}
                    onChange={e => setFDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-orange-500 text-stone-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Meal category</label>
                    <select
                      value={fMealType}
                      onChange={e => setFMealType(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-white focus:outline-none"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="High Tea">High Tea</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold text-stone-400 mb-1">Exp. Headcount</label>
                    <input
                      type="number"
                      placeholder="Expected count"
                      value={fExpectedGuests}
                      onChange={e => setFExpectedGuests(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border dark:border-stone-700 bg-stone-50 dark:bg-stone-900 dark:text-white focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Menu checklist & Inline Quick Creator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-700/60 pt-3">
                    <label className="block text-[10px] font-extrabold text-stone-400">Compose Menu Items</label>
                    <button
                      type="button"
                      onClick={() => setShowQuickCreate(!showQuickCreate)}
                      className="text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      {showQuickCreate ? '✕ Close Quick-Create' : '＋ Create Item Inside Form'}
                    </button>
                  </div>

                  {/* Collapsible Inline Direct Quick Creator Form */}
                  {showQuickCreate && (
                    <div className="p-3 bg-stone-50 dark:bg-stone-900 border border-dashed border-orange-600/30 rounded-xl space-y-3 text-left">
                      <div className="flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">New Item Recipe & Scaling Ratios</span>
                      </div>

                      <div>
                        <label className="block text-[8.5px] font-bold text-stone-400 dark:text-stone-500 mb-0.5">Item Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Kadai Paneer Butter"
                          value={customItemName}
                          onChange={e => setCustomItemName(e.target.value)}
                          className="w-full px-2 py-1 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-white focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[8.5px] font-bold text-stone-400 dark:text-stone-500 mb-0.5">Category</label>
                          <select
                            value={customItemCat}
                            onChange={e => setCustomItemCat(e.target.value as any)}
                            className="w-full px-1.5 py-1 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-white focus:outline-none"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Main Course">Main Course</option>
                            <option value="Breads">Breads</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Beverage">Beverage</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[8.5px] font-bold text-stone-400 dark:text-stone-500 mb-0.5" title="Expected servings consumed per invited guest">Servings/Guest</label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="e.g. 1.2"
                            value={customServingPerGuest}
                            onChange={e => setCustomServingPerGuest(e.target.value)}
                            className="w-full px-2 py-1 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 text-stone-900 dark:text-white focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-stone-200 dark:border-stone-700/60">
                        <span className="text-[8.5px] font-extrabold text-stone-400 dark:text-stone-500 block mb-1">Raw Ingredient weights per-guest (Grams / Litres):</span>
                        
                        <div className="grid grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Paneer (Grams)</label>
                            <input
                              type="number"
                              placeholder="e.g. 120"
                              value={customPaneerG}
                              onChange={e => setCustomPaneerG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Basmati Rice (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 80"
                              value={customRiceG}
                              onChange={e => setCustomRiceG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Cow Ghee (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 15"
                              value={customGheeG}
                              onChange={e => setCustomGheeG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Flour / Maida (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 100"
                              value={customFlourG}
                              onChange={e => setCustomFlourG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Sugar (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 45"
                              value={customSugarG}
                              onChange={e => setCustomSugarG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[8px] font-semibold text-stone-500">Milk/Yogurt (L)</label>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="e.g. 0.05"
                              value={customMilkL}
                              onChange={e => setCustomMilkL(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-[8px] font-semibold text-stone-500">Royal Spices / Masalas (g)</label>
                            <input
                              type="number"
                              placeholder="e.g. 5"
                              value={customSpicesG}
                              onChange={e => setCustomSpicesG(e.target.value)}
                              className="w-full px-2 py-0.5 text-xs rounded border dark:border-stone-700 bg-white dark:bg-stone-850 dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCreateCustomItem}
                        className="w-full py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Save & Auto-Select Item</span>
                      </button>
                    </div>
                  )}

                  {/* Choice Checklist of active items */}
                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto border border-stone-200 dark:border-stone-700 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-900/60 divide-y divide-stone-100 dark:divide-stone-800">
                    {allItems.length === 0 ? (
                      <p className="text-xs text-stone-500 py-4 text-center">No active menu items available. Create one using the toggle or load presets.</p>
                    ) : null}
                    {allItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between group p-1 pt-1.5 first:pt-1">
                        <label className="flex items-center gap-2 text-xs cursor-pointer select-none text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white flex-1 min-w-0">
                          <input
                            type="checkbox"
                            checked={selectedItemsIds.includes(item.id)}
                            onChange={() => handleSelectItemToggle(item.id)}
                            className="rounded border-stone-300 text-orange-600 focus:ring-orange-600 w-3.5 h-3.5 cursor-pointer"
                          />
                          <div className="flex justify-between items-center w-full min-w-0 pr-1.5">
                            <b className="truncate text-stone-800 dark:text-stone-200 font-extrabold">{item.name}</b>
                            <span className="text-[9px] font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-600/10 px-1 rounded flex-shrink-0 ml-1">
                              ({item.category})
                            </span>
                          </div>
                        </label>
                        <button
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="md:opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-red-500 rounded transition-all cursor-pointer"
                          type="button"
                          title="Delete from list catalog"
                        >
                          <Trash2 className="w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record Feast Day</span>
                </button>
              </form>
            </div>

            {/* RHS Column: Active Feast Schedules */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-stone-100 dark:border-stone-700">
                <ChefHat className="w-4 h-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-sans">Active Feast & Meal Planners</h4>
              </div>

              {plans.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <AlertCircle className="w-8 h-8 mx-auto text-orange-605 opacity-60 mb-2" />
                  <p className="text-xs font-bold">No Scheduled Feasts</p>
                  <p className="text-[10px] mt-1">Configure kitchen days on the left to activate auto ingredient scaling.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plans.map(plan => (
                    <div key={plan.id} className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-850 flex flex-col justify-between gap-3 text-left">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <span className="px-2 py-0.5 rounded bg-orange-600 text-white font-mono font-bold text-[9px]">
                            🍛 {plan.mealType}
                          </span>
                          <button
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-red-500 rounded cursor-pointer transition-colors"
                            title="Delete scheduling"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="mt-3 flex items-baseline justify-between gap-1">
                          <h4 className="text-sm font-extrabold text-stone-800 dark:text-white truncate">{plan.date}</h4>
                          <div className="flex items-center gap-1 font-mono text-xs font-bold text-orange-600 flex-shrink-0">
                            <Users className="w-3.5 h-3.5" />
                            <span>{plan.expectedGuests} Guests</span>
                          </div>
                        </div>

                        {/* Food list */}
                        <div className="mt-3 pt-3 border-t border-stone-200 dark:border-stone-750 space-y-1.5">
                          <span className="text-[9px] font-bold text-stone-400 block font-mono">Kitchen Menu</span>
                          <ul className="space-y-1">
                            {plan.menuItems.map((menuItem, idx) => (
                              <li key={idx} className="text-xs flex justify-between text-stone-700 dark:text-stone-350">
                                <span className="truncate">🔹 {menuItem.name}</span>
                                <span className="text-[10px] font-bold font-mono text-stone-400 flex-shrink-0 ml-1">x{menuItem.estimatedServingPerGuest} serves</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Quantity estimates box */}
                      <div className="p-2.5 bg-orange-655/5 dark:bg-orange-600/10 rounded-lg text-[10px] text-stone-550 dark:text-stone-300 flex justify-between items-center">
                        <span className="font-bold">Spices & Seasoning Demands:</span>
                        <b className="font-mono text-orange-600 dark:text-orange-400">
                          ~{Math.ceil(plan.menuItems.reduce((acc, item) => acc + (item.spicesRatioGrams * plan.expectedGuests * item.estimatedServingPerGuest) / 1000, 0))} KG
                        </b>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
