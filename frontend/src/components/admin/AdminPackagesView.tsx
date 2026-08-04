import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { ImageUploader } from '../common/ImageUploader';
import { MultiImageUploader } from '../common/MultiImageUploader';
import { Plus, Edit3, Trash2, X, MapPin, Star, Check, AlertTriangle } from 'lucide-react';
import { TourPackage } from '../../types';

export const AdminPackagesView: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<TourPackage>>({
    title: '',
    subtitle: '',
    category: 'Cultural Tours',
    durationDays: 7,
    priceUSD: 7500,
    rating: 4.95,
    reviewsCount: 10,
    featured: true,
    heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
    description: '',
    highlights: ['Private Helicopter flight over Himalayan peaks', 'VIP Monastic blessing'],
    included: ['5-Star Lodges', 'Private Guide & SUV', 'SDF Tax ($100/night)'],
    excluded: ['International airfare'],
    destinations: ['Paro', 'Thimphu', 'Punakha'],
    hotelCategory: '5-Star Luxury',
    itinerary: [
      { day: 1, title: 'Arrival in Paro', location: 'Paro', description: 'VIP greeting & transfer to lodge.', highlights: ['Welcome reception'] }
    ]
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      subtitle: '',
      category: 'Cultural Tours',
      durationDays: 7,
      priceUSD: 8500,
      rating: 4.98,
      reviewsCount: 1,
      featured: true,
      heroImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1200&q=80'
      ],
      description: 'An extraordinary luxury journey across Bhutan...',
      highlights: ['VIP Monastic Blessing', 'Private SUV & Butler'],
      included: ['5-Star Luxury Lodge', 'SDF Tax Included'],
      excluded: ['International flights'],
      destinations: ['Paro', 'Thimphu'],
      hotelCategory: '5-Star Luxury',
      itinerary: [
        { day: 1, title: 'Paro Landing', location: 'Paro', description: 'Check into Six Senses Paro.', highlights: ['Welcome tea'] }
      ]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: TourPackage) => {
    setEditingId(pkg.id);
    setFormData({ ...pkg });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      updatePackage(editingId, formData);
    } else {
      addPackage(formData as Omit<TourPackage, 'id'>);
    }
    setIsModalOpen(false);
  };

  return (
    <AdminLayout
      title="Tour Package Manager"
      subtitle="Create, edit, delete, or toggle featured status for public tour itineraries"
    >
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-950">Active Itineraries ({packages.length})</h2>
            <p className="text-stone-600 text-xs">Full CRUD management for luxury itineraries</p>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Tour Package</span>
          </button>
        </div>

        {/* Packages List Table */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700 min-w-[750px]">
            <thead className="bg-amber-950 text-amber-100 font-serif font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4 min-w-[220px]">Package Title</th>
                <th className="p-4 whitespace-nowrap">Category</th>
                <th className="p-4 min-w-[160px]">Duration & Valleys</th>
                <th className="p-4 whitespace-nowrap">Tariff</th>
                <th className="p-4 whitespace-nowrap text-center">Featured</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {packages.map(pkg => (
                <tr key={pkg.id} className="hover:bg-amber-50/50 transition-colors">
                  <td className="p-4 font-semibold text-stone-900">
                    <div className="flex items-center gap-3">
                      <img src={pkg.heroImage} alt="" className="w-10 h-10 rounded-lg object-cover border border-amber-200 shrink-0" />
                      <div>
                        <div className="font-serif font-bold text-sm text-amber-950">{pkg.title}</div>
                        <div className="text-[10px] text-stone-500 font-mono">{pkg.hotelCategory}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-bold uppercase text-[10px] text-amber-900 whitespace-nowrap">{pkg.category}</td>
                  <td className="p-4">
                    <div className="font-semibold text-stone-800">{pkg.durationDays} Days</div>
                    <div className="text-[10px] text-stone-500 max-w-[200px] truncate">{pkg.destinations.join(', ')}</div>
                  </td>
                  <td className="p-4 font-bold text-amber-900 whitespace-nowrap">${pkg.priceUSD.toLocaleString()} USD</td>
                  <td className="p-4 text-center whitespace-nowrap">
                    <button
                      onClick={() => updatePackage(pkg.id, { featured: !pkg.featured })}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer inline-flex items-center gap-1 transition ${
                        pkg.featured ? 'bg-amber-600 text-amber-950 hover:bg-amber-500' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                      }`}
                    >
                      {pkg.featured ? '★ FEATURED' : 'Standard'}
                    </button>
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(pkg)}
                        className="p-2 rounded-lg bg-amber-100 text-amber-950 hover:bg-amber-200 cursor-pointer transition"
                        title="Edit Package"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: pkg.id, title: pkg.title })}
                        className="p-2 rounded-lg bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer transition"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      {/* Package Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto border border-amber-300">
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif font-bold text-lg text-amber-950">
                {editingId ? 'Edit Package Details' : 'Create New Tour Package'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Package Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 border rounded-lg bg-white"
                  >
                    <option value="Cultural Tours">Cultural Tours</option>
                    <option value="Trekking Packages">Trekking Packages</option>
                    <option value="Adventure Tours">Adventure Tours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Price per person (USD) *</label>
                  <input
                    type="number"
                    value={formData.priceUSD}
                    onChange={e => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.durationDays}
                    onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Hotel Style</label>
                  <input
                    type="text"
                    value={formData.hotelCategory}
                    onChange={e => setFormData({ ...formData, hotelCategory: e.target.value as any })}
                    className="w-full p-2.5 border rounded-lg"
                  />
                </div>
              </div>

              <ImageUploader
                label="Package Main Cover Image"
                value={formData.heroImage}
                onChange={url => setFormData({ ...formData, heroImage: url })}
              />

              <MultiImageUploader
                label="Package Gallery Images & Photos"
                images={formData.galleryImages || (formData.heroImage ? [formData.heroImage] : [])}
                onChange={urls => setFormData({ ...formData, galleryImages: urls })}
              />

              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-900 text-amber-50 font-bold"
                >
                  {editingId ? 'Save Changes' : 'Publish Package'}
                </button>
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
                <h3 className="font-serif font-bold text-lg text-stone-900">Delete Package?</h3>
                <p className="text-sm text-stone-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
              <p className="text-sm text-stone-700">
                Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm.title}"</span>?
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
                  deletePackage(deleteConfirm.id);
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
