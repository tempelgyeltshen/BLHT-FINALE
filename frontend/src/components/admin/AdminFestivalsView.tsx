import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Calendar, Plus, Edit, Trash2, Search, X, Check, AlertTriangle, Sparkles, MapPin, Star, Upload } from 'lucide-react';
import { Festival } from '../../types';

export const AdminFestivalsView: React.FC = () => {
  const { festivals, addFestival, updateFestival, deleteFestival } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [dzong, setDzong] = useState('');
  const [dates2027, setDates2027] = useState('');
  const [dates2026, setDates2026] = useState('');
  const [month, setMonth] = useState('October');
  const [description, setDescription] = useState('');
  const [significance, setSignificance] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [durationDays, setDurationDays] = useState<number>(3);
  const [featured, setFeatured] = useState<boolean>(false);
  const [slNo, setSlNo] = useState<number>(festivals.length + 1);

  const monthsList = ['all', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const handleOpenAddModal = () => {
    setEditingFestival(null);
    setName('');
    setLocation('Paro');
    setDzong('Paro Dzong');
    setDates2027('March 18 - 22, 2027');
    setDates2026('March 28 - April 1, 2026');
    setMonth('March');
    setDescription('');
    setSignificance('');
    setHeroImage('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80');
    setDurationDays(3);
    setFeatured(false);
    setSlNo(festivals.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (fest: Festival) => {
    setEditingFestival(fest);
    setName(fest.name);
    setLocation(fest.location);
    setDzong(fest.dzong);
    setDates2027(fest.dates2027 || '');
    setDates2026(fest.dates2026 || '');
    setMonth(fest.month || 'October');
    setDescription(fest.description);
    setSignificance(fest.significance);
    setHeroImage(fest.heroImage);
    setDurationDays(fest.durationDays || 3);
    setFeatured(fest.featured || false);
    setSlNo(fest.slNo || 0);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setHeroImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const payload = {
      slug,
      name: name.trim(),
      location: location.trim(),
      dzong: dzong.trim(),
      dates2027: dates2027.trim(),
      dates2026: dates2026.trim(),
      month: month.trim(),
      description: description.trim(),
      significance: significance.trim(),
      heroImage: heroImage.trim() || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80',
      durationDays: Number(durationDays) || 3,
      featured,
      slNo: Number(slNo) || (festivals.length + 1)
    };

    if (editingFestival) {
      updateFestival(editingFestival.id, payload);
    } else {
      addFestival(payload);
    }
    setIsModalOpen(false);
  };

  const filteredFestivals = festivals.filter(fest => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      fest.name.toLowerCase().includes(q) ||
      fest.location.toLowerCase().includes(q) ||
      fest.dzong.toLowerCase().includes(q) ||
      (fest.dates2027 && fest.dates2027.toLowerCase().includes(q));

    const matchesMonth = selectedMonth === 'all' || fest.month.toLowerCase().includes(selectedMonth.toLowerCase());
    return matchesSearch && matchesMonth;
  });

  return (
    <AdminLayout
      title="Sacred Festival Schedule Management"
      subtitle="Add, edit, or manage all 44 sacred Bhutanese Tshechus, Dromchoes, and cultural celebrations"
    >
      <div className="space-y-6">

        {/* Action Header */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-serif font-extrabold text-lg text-amber-950 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-700" />
              <span>Bhutan Festival Registry ({festivals.length} Sacred Events)</span>
            </h2>
            <p className="text-xs text-stone-600 font-serif">Manage dates, places, and descriptions shown on the public Festivals page</p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold text-xs rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Festival Event</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#fcf8f2] p-4 rounded-2xl border border-amber-200">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-amber-700 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search festivals by name, dzong, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-amber-300 rounded-xl py-2 pl-9 pr-4 text-xs font-serif text-stone-800 focus:outline-hidden focus:border-amber-600 shadow-inner"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {monthsList.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 rounded-lg text-xs font-bold font-serif cursor-pointer transition-colors whitespace-nowrap ${
                  selectedMonth === m
                    ? 'bg-amber-950 text-amber-100 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-amber-100 border border-amber-200'
                }`}
              >
                {m === 'all' ? 'All Months' : m}
              </button>
            ))}
          </div>
        </div>

        {/* Festival Table View */}
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-serif text-xs border-collapse">
              <thead>
                <tr className="bg-amber-950 text-amber-100 font-extrabold uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">SL</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Festival Name</th>
                  <th className="py-3 px-4">Dzong & Location</th>
                  <th className="py-3 px-4">2027 Dates</th>
                  <th className="py-3 px-4">Month</th>
                  <th className="py-3 px-4 text-center">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100 text-stone-800">
                {filteredFestivals.map((fest) => (
                  <tr key={fest.id} className="hover:bg-amber-50/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-center text-amber-900">{fest.slNo || '#'}</td>
                    <td className="py-3 px-4">
                      <img src={fest.heroImage} alt={fest.name} className="w-12 h-9 object-cover rounded-lg border border-amber-200 shadow-xs" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-amber-950">{fest.name}</div>
                      <div className="text-[10px] text-stone-500 line-clamp-1">{fest.description}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{fest.dzong}</div>
                      <div className="text-[10px] text-amber-800 font-sans">{fest.location}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-rose-900">
                      <span className="bg-rose-50 border border-rose-200 px-2 py-0.5 rounded text-[11px]">
                        {fest.dates2027 || fest.dates2026}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold">{fest.month}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => updateFestival(fest.id, { featured: !fest.featured })}
                        className={`p-1.5 rounded-lg cursor-pointer transition-colors ${fest.featured ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-400'}`}
                        title="Toggle Featured"
                      >
                        <Star className={`w-4 h-4 ${fest.featured ? 'fill-amber-600' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(fest)}
                        className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: fest.id, name: fest.name })}
                        className="p-1 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form for Add/Edit Festival */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl border-2 border-amber-400 max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 rounded-full text-stone-700 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
                    <Calendar className="w-5 h-5 text-amber-700" />
                    <h3 className="font-serif font-extrabold text-lg text-amber-950">
                      {editingFestival ? 'Edit Festival Event' : 'Add New Festival Event'}
                    </h3>
                  </div>

                  <form onSubmit={handleSave} className="space-y-4 font-serif text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-stone-800 font-bold mb-1">Festival Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paro Tshechu"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Serial No. (SL)</label>
                        <input
                          type="number"
                          value={slNo}
                          onChange={(e) => setSlNo(Number(e.target.value))}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Dzong / Venue *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paro Rinpung Dzong"
                          value={dzong}
                          onChange={(e) => setDzong(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">District / Location *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Paro"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-stone-800 font-bold mb-1">2027 Dates *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. March 18 - 22, 2027"
                          value={dates2027}
                          onChange={(e) => setDates2027(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Month Category</label>
                        <select
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600 font-serif"
                        >
                          {monthsList.filter(m => m !== 'all').map(m => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-800 font-bold mb-1">Duration (Days)</label>
                        <input
                          type="number"
                          value={durationDays}
                          onChange={(e) => setDurationDays(Number(e.target.value))}
                          className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Banner Image URL or Desktop Upload</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="https://..."
                          value={heroImage}
                          onChange={(e) => setHeroImage(e.target.value)}
                          className="flex-1 bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                        />
                        <label className="px-3 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold cursor-pointer inline-flex items-center gap-1 shrink-0">
                          <Upload className="w-4 h-4" />
                          <span>Upload File</span>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                      {heroImage && (
                        <img src={heroImage} alt="Preview" className="w-24 h-16 object-cover rounded-lg border border-amber-300 mt-2" />
                      )}
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Festival Description</label>
                      <textarea
                        rows={3}
                        placeholder="Detailed overview of sacred mask dances, unfurling of Guru Rinpoche Thongdrol..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-800 font-bold mb-1">Spiritual Blessing & Significance</label>
                      <textarea
                        rows={2}
                        placeholder="Spiritual significance, merit accumulation, cleanses sins..."
                        value={significance}
                        onChange={(e) => setSignificance(e.target.value)}
                        className="w-full bg-[#fcf8f2] border border-amber-300 rounded-xl p-2.5 text-stone-900 focus:outline-hidden focus:border-amber-600"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="festFeatured"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="w-4 h-4 accent-amber-700 rounded cursor-pointer"
                      />
                      <label htmlFor="festFeatured" className="text-stone-800 font-bold cursor-pointer">Feature on Homepage</label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-stone-300 text-stone-700 font-bold rounded-xl hover:bg-stone-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-amber-50 font-extrabold rounded-xl shadow-md cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>{editingFestival ? 'Update Festival' : 'Save Festival'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 font-serif">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900">Delete Festival Event?</h3>
                  <p className="text-xs text-stone-600">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-rose-50 border border-rose-200 rounded-lg p-3">
                <p className="text-xs text-stone-700">
                  Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm.name}"</span>?
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteFestival(deleteConfirm.id);
                    setDeleteConfirm(null);
                  }}
                  className="flex-1 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 cursor-pointer"
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
