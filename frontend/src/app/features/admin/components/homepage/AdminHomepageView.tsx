import React, { useState } from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { AdminLayout } from '../shared/AdminLayout';
import { Button, Input, TextArea } from '../../../shared/components/ui';
import { Save } from 'lucide-react';

export const AdminHomepageView: React.FC = () => {
  const { homepageConfig, updateHomepageConfig, showToast } = useApp();
  const [cfg, setCfg] = useState(homepageConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateHomepageConfig(cfg);
    showToast('Homepage hero & banner changes saved live!');
  };

  return (
    <AdminLayout
      title="Homepage Sections Editor"
      subtitle="Edit public hero titles, announcement bar text, and main website text live"
    >
      <div className="max-w-4xl space-y-6">
        
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-6 text-xs">
          
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-base text-amber-950 border-b pb-2">Hero Section Content</h3>
            <Input
              label="Hero Title"
              variant="amber"
              className="font-serif font-bold text-sm text-amber-950"
              value={cfg.heroTitle}
              onChange={e => setCfg({ ...cfg, heroTitle: e.target.value })}
            />

            <TextArea
              label="Hero Subtitle"
              variant="amber"
              className="font-serif text-stone-800"
              rows={3}
              value={cfg.heroSubtitle}
              onChange={e => setCfg({ ...cfg, heroSubtitle: e.target.value })}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
            <Button type="submit" variant="save" size="wide">
              <Save className="w-4 h-4 text-amber-300" />
              <span>Save Changes Live</span>
            </Button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
};
