import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { ImageUploader } from '../common/ImageUploader';
import { Hotel, Plus, Edit3, Trash2, Star, MapPin, X, AlertTriangle } from 'lucide-react';

export const AdminHotelsView: React.FC = () => {
  const { hotels, addHotel, deleteHotel } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    brand: 'BLHT Sanctuary' as const,
    location: 'Paro Valley',
    region: 'Paro' as const,
    starRating: 5,
    pricePerNightUSD: 1850,
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    images: [],
    tagline: 'Sanctuary of peace',
    description: 'A world-class lodge in Bhutan.',
    amenities: ['Spa', 'Bukhari Fireplace', 'Fine Dining'],
    featured: true,
    slug: 'new-lodge'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    addHotel(formData);
    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="5-Star Lodge Directory Manager"
      subtitle="Full CRUD management for luxury lodge partnerships (Six Senses, COMO, Amankora, Pemako, BLHT)"
    >
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-950">Active Lodge Directory ({hotels.length})</h2>
            <p className="text-stone-600 text-xs">Manage sanctuary properties displayed across the site</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Luxury Lodge Listing</span>
          </button>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
              <div>
                <img src={h.heroImage} alt="" className="w-full h-40 rounded-xl object-cover" />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">{h.brand}</span>
                  <span className="text-xs font-bold text-amber-900">${h.pricePerNightUSD} / night</span>
                </div>
                <h3 className="font-serif font-bold text-base text-amber-950 mt-1">{h.name}</h3>
                <p className="text-stone-500 text-xs italic">{h.region} Valley</p>
              </div>

              <div className="pt-2 border-t flex justify-end">
                <button
                  onClick={() => setDeleteConfirm({ id: h.id, name: h.name })}
                  className="p-1.5 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      {/* Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto border border-amber-300">
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif font-bold text-lg text-amber-950">Add Lodge Listing</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Lodge Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={e => setFormData({ ...formData, brand: e.target.value as any })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price / Night (USD)</label>
                  <input
                    type="number"
                    value={formData.pricePerNightUSD}
                    onChange={e => setFormData({ ...formData, pricePerNightUSD: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>

              <ImageUploader
                label="Lodge Hero Image"
                value={formData.heroImage}
                onChange={url => setFormData({ ...formData, heroImage: url })}
              />

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-900 text-white font-bold rounded-lg">Save Lodge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">Delete Hotel?</h3>
                <p className="text-sm text-stone-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-stone-700">
                Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm.name}"</span>?
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-semibold hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteHotel(deleteConfirm.id);
                  setDeleteConfirm(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </AdminLayout>
  );
};
