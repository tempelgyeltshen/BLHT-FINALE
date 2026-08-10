import React, { useState } from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { AdminLayout } from '../../admin/components/shared/AdminLayout';
import { ImageUploader } from '../../shared/components/media/ImageUploader';
import { MultiImageUploader } from '../../shared/components/media/MultiImageUploader';
import { Button, ConfirmDialog, Input, Modal, Pagination, Select, TextArea } from '../../shared/components/ui';
import { usePagination } from '../../shared/hooks/usePagination';
import { Plus, Edit3, Trash2, Star } from 'lucide-react';
import { TourPackage } from '../../../../types';

export const AdminPackagesView: React.FC = () => {
  const { packages, addPackage, updatePackage, deletePackage } = useApp();
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

  const { currentPage, totalPages, pageItems, goToPage } = usePagination(packages, 6);

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

          <Button onClick={handleOpenCreate} variant="primary" size="lg">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Create New Tour Package</span>
          </Button>
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
                <th className="p-4 whitespace-nowrap">Rating</th>
                <th className="p-4 whitespace-nowrap text-center">Featured</th>
                <th className="p-4 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {pageItems.map(pkg => (
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
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
                      <span className="font-bold text-amber-900">{pkg.rating ?? '—'}</span>
                      <span className="text-[10px] text-stone-500">({pkg.reviewsCount ?? 0})</span>
                    </div>
                  </td>
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
                      <Button
                        onClick={() => handleOpenEdit(pkg)}
                        variant="iconAmber"
                        size="icon"
                        title="Edit Package"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => setDeleteConfirm({ id: pkg.id, title: pkg.title })}
                        variant="iconRose"
                        size="icon"
                        title="Delete Package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />
        </div>

      {/* Package Form Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Package Details' : 'Create New Tour Package'}
        size="2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Package Title *"
            required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value as any })}
            >
              <option value="Cultural Tours">Cultural Tours</option>
              <option value="Trekking Packages">Trekking Packages</option>
              <option value="Adventure Tours">Adventure Tours</option>
            </Select>

            <Input
              label="Price per person (USD) *"
              type="number"
              value={formData.priceUSD}
              onChange={e => setFormData({ ...formData, priceUSD: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Duration (Days)"
              type="number"
              value={formData.durationDays}
              onChange={e => setFormData({ ...formData, durationDays: Number(e.target.value) })}
            />

            <Input
              label="Hotel Style"
              value={formData.hotelCategory}
              onChange={e => setFormData({ ...formData, hotelCategory: e.target.value as any })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Star Rating (0 – 5)"
              type="number"
              min={0}
              max={5}
              step={0.1}
              hint="Set by admin — e.g. 4.8"
              value={formData.rating ?? 0}
              onChange={e => setFormData({ ...formData, rating: Math.min(5, Math.max(0, Number(e.target.value))) })}
            />

            <Input
              label="Reviews Count"
              type="number"
              min={0}
              step={1}
              hint="Number of reviews displayed"
              value={formData.reviewsCount ?? 0}
              onChange={e => setFormData({ ...formData, reviewsCount: Math.max(0, Math.round(Number(e.target.value))) })}
            />
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

          <TextArea
            label="Description"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primaryFlat">
              {editingId ? 'Save Changes' : 'Publish Package'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Delete Package?"
        message={(
          <span>
            Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm?.title}"</span>?
          </span>
        )}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) deletePackage(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
      />

      </div>
    </AdminLayout>
  );
};
