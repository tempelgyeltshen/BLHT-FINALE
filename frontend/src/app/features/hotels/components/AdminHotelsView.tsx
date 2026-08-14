import React, { useState } from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { AdminLayout } from '../../admin/components/shared/AdminLayout';
import { ImageUploader } from '../../shared/components/media/ImageUploader';
import { MultiImageUploader } from '../../shared/components/media/MultiImageUploader';
import { Button, ConfirmDialog, Input, Modal, Pagination, Select, TextArea } from '../../shared/components/ui';
import { usePagination } from '../../shared/hooks/usePagination';
import { Plus, Edit3, Trash2, Star, MapPin } from 'lucide-react';
import type { Hotel, HotelFormData } from '../types/hotel.types';

const BRANDS = ['BLHT Sanctuary', 'Six Senses', 'COMO', 'Aman', 'Pemako', 'Zhiwa Ling', 'Boutique'] as const;
const REGIONS = ['Paro', 'Thimphu', 'Punakha', 'Gangtey', 'Bumthang'] as const;

const DEFAULT_HERO = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';

const emptyForm = (): HotelFormData => ({
  name: '',
  slug: '',
  brand: 'BLHT Sanctuary',
  location: 'Paro Valley',
  region: 'Paro',
  starRating: 5,
  pricePerNightUSD: 1850,
  heroImage: DEFAULT_HERO,
  images: [],
  tagline: '',
  description: '',
  amenities: ['Spa', 'Bukhari Fireplace', 'Fine Dining'],
  featured: true,
});

export const AdminHotelsView: React.FC = () => {
  const { hotels, addHotel, updateHotel, deleteHotel, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<HotelFormData>(emptyForm());
  const [amenitiesText, setAmenitiesText] = useState(formData.amenities.join(', '));

  const slugify = (value: string) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(emptyForm());
    setAmenitiesText('Spa, Bukhari Fireplace, Fine Dining');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hotel: Hotel) => {
    setEditingId(hotel.id);
    setFormData({
      name: hotel.name,
      slug: hotel.slug || slugify(hotel.name),
      brand: hotel.brand,
      location: hotel.location,
      region: hotel.region,
      starRating: hotel.starRating,
      pricePerNightUSD: hotel.pricePerNightUSD,
      heroImage: hotel.heroImage,
      images: hotel.images || [],
      tagline: hotel.tagline,
      description: hotel.description,
      amenities: hotel.amenities || [],
      featured: hotel.featured,
    });
    setAmenitiesText((hotel.amenities || []).join(', '));
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: editingId ? prev.slug : slugify(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Lodge name is required.');
      return;
    }
    const payload: Omit<Hotel, 'id'> = {
      ...formData,
      slug: formData.slug || slugify(formData.name) || 'lodge',
      images: formData.images || [],
      tagline: formData.tagline.trim() || 'A world-class lodge in Bhutan.',
      description: formData.description.trim() || 'A world-class lodge in Bhutan.',
      amenities: amenitiesText
        .split(',')
        .map(a => a.trim())
        .filter(Boolean),
    };

    try {
      if (editingId) {
        await updateHotel(editingId, payload);
      } else {
        await addHotel(payload);
      }
      setIsModalOpen(false);
      showToast(editingId ? 'Lodge listing updated successfully!' : 'New lodge listing added successfully!');
    } catch (error) {
      console.error('Failed to save hotel:', error);
    }
  };

  const { currentPage, totalPages, pageItems, goToPage } = usePagination(hotels, 6);

  return (
    <AdminLayout
      title="5★ Lodges & Hotels Manager"
      subtitle="Create, edit, or delete the 5-star lodges and hotels shown across the website"
    >
      <div className="space-y-6">

        {/* Action Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-950">Active Lodge Directory ({hotels.length})</h2>
            <p className="text-stone-600 text-xs">Manage sanctuary properties displayed across the site</p>
          </div>

          <Button onClick={handleOpenCreate} variant="primary" size="lg">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Luxury Lodge Listing</span>
          </Button>
        </div>

        {/* Hotels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {pageItems.map(h => (
            <div key={h.id} className="bg-white rounded-2xl border border-amber-200 p-5 shadow-sm space-y-3 flex flex-col justify-between group">
              <div>
                <div className="relative rounded-xl overflow-hidden border border-amber-200">
                  <img src={h.heroImage} alt="" className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold bg-amber-950 text-amber-100 px-2 py-0.5 rounded-md shadow-sm">{h.brand}</span>
                    <span className="text-[10px] font-bold bg-white/90 text-amber-900 px-2 py-0.5 rounded-md shadow-sm flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> {h.starRating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold text-amber-900">${h.pricePerNightUSD.toLocaleString()} / night</span>
                  <span className="text-[10px] text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-700" /> {h.region} Valley
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-amber-950 mt-1">{h.name}</h3>
                <p className="text-stone-500 text-xs italic line-clamp-1">"{h.tagline}"</p>
                <p className="text-[10px] text-stone-500 mt-1 font-mono truncate">{h.location}</p>

                <div className="pt-2 mt-2 border-t border-amber-100 flex items-center justify-between">
                  <button
                    onClick={() => updateHotel(h.id, { featured: !h.featured })}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer inline-flex items-center gap-1 transition ${
                      h.featured ? 'bg-amber-600 text-amber-950 hover:bg-amber-500' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {h.featured ? '★ FEATURED' : 'Standard'}
                  </button>

                  <div className="inline-flex items-center gap-1.5">
                    <Button
                      onClick={() => handleOpenEdit(h)}
                      variant="iconAmber"
                      size="icon"
                      title="Edit Lodge"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setDeleteConfirm({ id: h.id, name: h.name })}
                      variant="iconRose"
                      size="icon"
                      title="Delete Lodge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

        {/* Lodge Modal */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingId ? 'Edit Lodge Listing' : 'Add Lodge Listing'}
          size="xl"
        >
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <Input
              label="Lodge Name *"
              required
              value={formData.name}
              onChange={e => handleNameChange(e.target.value)}
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Select
                label="Brand"
                value={formData.brand}
                onChange={e => setFormData({ ...formData, brand: e.target.value as HotelFormData['brand'] })}
              >
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>

              <Select
                label="Region / Valley"
                value={formData.region}
                onChange={e => setFormData({ ...formData, region: e.target.value as HotelFormData['region'] })}
              >
                {REGIONS.map(r => <option key={r} value={r}>{r} Valley</option>)}
              </Select>

              <Input
                label="Star Rating"
                type="number"
                min={1}
                max={5}
                value={formData.starRating}
                onChange={e => setFormData({ ...formData, starRating: Math.min(5, Math.max(1, Number(e.target.value))) })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price / Night (USD)"
                type="number"
                value={formData.pricePerNightUSD}
                onChange={e => setFormData({ ...formData, pricePerNightUSD: Number(e.target.value) })}
              />

              <Input
                label="Exact Location (e.g. Balakha Village, Paro)"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <ImageUploader
              label="Lodge Main Cover Image"
              accept="image/*"
              folder="blht/hotels"
              value={formData.heroImage}
              onChange={url => setFormData({ ...formData, heroImage: url })}
            />

            <MultiImageUploader
              label="Lodge Gallery Photos"
              folder="blht/hotels"
              images={formData.images || []}
              onChange={urls => setFormData({ ...formData, images: urls })}
            />

            <Input
              label="Tagline (short quote shown on cards)"
              value={formData.tagline}
              onChange={e => setFormData({ ...formData, tagline: e.target.value })}
            />

            <TextArea
              label="Description"
              rows={3}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <Input
              label="Amenities (comma separated)"
              value={amenitiesText}
              onChange={e => setAmenitiesText(e.target.value)}
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="hotelFeatured"
                checked={formData.featured}
                onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 accent-amber-700 rounded cursor-pointer"
              />
              <label htmlFor="hotelFeatured" className="text-stone-800 font-bold cursor-pointer">
                Feature on Homepage & Public Listings
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primaryFlat">
                {editingId ? 'Save Changes' : 'Publish Lodge'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          open={Boolean(deleteConfirm)}
          title="Delete Lodge Listing?"
          message={(
            <span>
              Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm?.name}"</span>?
              This will remove it from the website immediately.
            </span>
          )}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm) deleteHotel(deleteConfirm.id);
            setDeleteConfirm(null);
          }}
        />

      </div>
    </AdminLayout>
  );
};
