import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Edit, Save } from 'lucide-react';

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
            <h3 className="font-serif font-bold text-base text-amber-950 border-b pb-2">Top Announcement Bar</h3>
            <div>
              <label className="block font-semibold mb-1">Announcement Text</label>
              <input
                type="text"
                value={cfg.announcementText}
                onChange={e => setCfg({ ...cfg, announcementText: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-lg text-stone-800"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-stone-200">
            <h3 className="font-serif font-bold text-base text-amber-950 border-b pb-2">Hero Section Content</h3>
            <div>
              <label className="block font-semibold mb-1">Hero Title</label>
              <input
                type="text"
                value={cfg.heroTitle}
                onChange={e => setCfg({ ...cfg, heroTitle: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-lg font-serif font-bold text-sm text-amber-950"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Hero Subtitle</label>
              <textarea
                rows={3}
                value={cfg.heroSubtitle}
                onChange={e => setCfg({ ...cfg, heroSubtitle: e.target.value })}
                className="w-full p-2.5 border border-stone-300 rounded-lg font-serif text-stone-800"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-200">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Save Changes Live</span>
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
};
