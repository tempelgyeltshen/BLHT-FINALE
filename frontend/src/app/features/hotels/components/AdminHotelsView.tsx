import React, { useState } from 'react';
import { useHotels } from '../hooks/useHotels';
import { ImageUploader } from '../../shared/components/media/ImageUploader';
import { Button, ConfirmDialog, Input, Modal, Pagination } from '../../shared/components/ui';
import { usePagination } from '../../shared/hooks/usePagination';
import { Plus, Trash2 } from 'lucide-react';
import type { HotelFormData } from '../types/hotel.types';

export const AdminHotelsView: React.FC = () => {
  const { hotels, createHotel, deleteHotel } = useHotels();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const [formData, setFormData] = useState<HotelFormData>({
    name: '',
    brand: 'BLHT Sanctuary',
    location: 'Paro Valley',
    region: 'Paro',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    try {
      await createHotel(formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        name: '',
        brand: 'BLHT Sanctuary',
        location: 'Paro Valley',
        region: 'Paro',
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
    } catch (error) {
      console.error('Failed to create hotel:', error);
    }
  };

  const { currentPage, totalPages, pageItems, goToPage } = usePagination(hotels, 6);

  return (
    <div className="min-h-screen bg-[#fcf8f2] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-950">Active Lodge Directory ({hotels.length})</h2>
            <p className="text-stone-600 text-xs">Manage sanctuary properties displayed across the site</p>
          </div>

          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="lg">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Luxury Lodge Listing</span>
          </Button>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pageItems.map(h => (
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
                <Button
                  onClick={() => setDeleteConfirm({ id: h.id, name: h.name })}
                  variant="iconRose"
                  size="iconSm"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      {/* Hotel Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Lodge Listing"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <Input
            label="Lodge Name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Brand"
              value={formData.brand}
              onChange={e => setFormData({ ...formData, brand: e.target.value as any })}
            />
            <Input
              label="Price / Night (USD)"
              type="number"
              value={formData.pricePerNightUSD}
              onChange={e => setFormData({ ...formData, pricePerNightUSD: Number(e.target.value) })}
            />
          </div>

          <ImageUploader
            label="Lodge Hero Image"
            value={formData.heroImage}
            onChange={url => setFormData({ ...formData, heroImage: url })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primaryWhiteFlat">Save Lodge</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Delete Hotel?"
        message={(
          <span>
            Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm?.name}"</span>?
          </span>
        )}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) deleteHotel(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
      />

      </div>
    </div>
  );
};
