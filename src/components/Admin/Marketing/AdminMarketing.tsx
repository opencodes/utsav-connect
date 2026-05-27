import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { MarketingCampaign } from '../../../types';
import { createCampaign, fetchCampaigns } from '../../../api/admin';
import { MarketingStats } from './MarketingStats';
import { CampaignGrid } from './CampaignGrid';
import { CreateCampaignModal } from './CreateCampaignModal';

export const AdminMarketing: React.FC = () => {
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [showCreatorModal, setShowCreatorModal] = useState(false);

  const reload = () => {
    void fetchCampaigns()
      .then((list) => setCampaigns(list as MarketingCampaign[]))
      .catch(() => setCampaigns([]));
  };

  useEffect(() => {
    reload();
  }, []);

  const handleCreateCampaign = (campData: {
    title: string;
    code: string;
    discount: string;
    type: MarketingCampaign['type'];
  }) => {
    void createCampaign({
      id: `camp-${Date.now()}`,
      title: campData.title,
      code: campData.code,
      discount: campData.discount,
      status: 'Scheduled',
      performance: 0,
      type: campData.type,
      startDate: '2026-05-24',
      endDate: '2026-06-15',
    })
      .then(() => {
        reload();
        setShowCreatorModal(false);
        alert(`Marketing plan "${campData.title}" flagged successfully to dispatch queues.`);
      })
      .catch(() => alert('Failed to create campaign'));
  };

  const handleDeleteCampaign = (id: string) => {
    if (confirm('Erase this campaign record?')) {
      setCampaigns(campaigns.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-marketing-tab">
      
      {/* Promotion top statistics indicators */}
      <MarketingStats campaigns={campaigns} />

      {/* Campaign List Control panel */}
      <div className="admin-card flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <div className="text-left">
          <h3 className="font-semibold text-sm text-stone-900 dark:text-white">Active campaigns</h3>
          <p className="text-xs text-stone-500 font-medium">Visible in customer apps when published</p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreatorModal(true)}
          className="admin-btn-primary"
          id="btn-create-campaign"
        >
          <Plus className="w-4 h-4" aria-hidden />
          <span>New campaign</span>
        </button>
      </div>

      {/* CAMPAIGN CARD GRID LISTING */}
      <CampaignGrid campaigns={campaigns} onDeleteCampaign={handleDeleteCampaign} />

      {/* CREATE DIALOG OVERLAY */}
      <CreateCampaignModal
        isOpen={showCreatorModal}
        onClose={() => setShowCreatorModal(false)}
        onSubmit={handleCreateCampaign}
      />

    </div>
  );
};
