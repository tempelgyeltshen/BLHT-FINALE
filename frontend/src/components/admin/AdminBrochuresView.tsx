import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { ImageUploader } from '../common/ImageUploader';
import { MultiImageUploader } from '../common/MultiImageUploader';
import { FileText, Plus, Download, Trash2, Eye, X, Upload, CheckCircle, File, Link as LinkIcon, AlertTriangle } from 'lucide-react';

interface BrochureFormData {
  title: string;
  subtitle: string;
  category: string;
  fileSize: string;
  totalPages: number;
  coverImage: string;
  galleryImages: string[];
  pdfUrl: string;
  year: string;
  featured: boolean;
  tableOfContents: Array<{ page: number; title: string }>;
}

export const AdminBrochuresView: React.FC = () => {
  const { brochures, addBrochure, deleteBrochure, setActiveBrochure } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUploadMode, setPdfUploadMode] = useState<'file' | 'url'>('file');
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  const [formData, setFormData] = useState<BrochureFormData>({
    title: '',
    subtitle: '',
    category: 'Luxury Tours',
    fileSize: 'Auto-calculated',
    totalPages: 0, // Auto-calculated
    coverImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ],
    pdfUrl: '',
    year: '2026',
    featured: true,
    tableOfContents: [
      { page: 1, title: 'Welcome to Bhutan' },
      { page: 5, title: 'Lodge Circuit Details' },
      { page: 10, title: 'Travel Concierge & Permits' }
    ]
  });

  const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert('Please select a valid PDF file.');
        return;
      }
      
      // Check file size limit (5GB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
      if (file.size > MAX_FILE_SIZE) {
        const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
        alert(`File size (${sizeGB} GB) exceeds maximum allowed size of 5GB. Please select a smaller file.`);
        return;
      }
      
      // Auto-calculate file size
      const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      const sizeKB = (file.size / 1024).toFixed(1);
      
      let formattedSize: string;
      if (file.size > 1024 * 1024 * 1024) {
        formattedSize = `${sizeGB} GB`;
      } else if (file.size > 1024 * 1024) {
        formattedSize = `${sizeMB} MB`;
      } else {
        formattedSize = `${sizeKB} KB`;
      }
      
      setPdfFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setFormData(prev => ({
          ...prev,
          pdfUrl: result,
          fileSize: formattedSize,
          totalPages: 0 // Will be auto-calculated from PDF
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      subtitle: '',
      category: 'Luxury Tours',
      fileSize: 'Auto-calculated',
      totalPages: 0, // Will be auto-calculated
      coverImage: 'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      ],
      pdfUrl: '',
      year: '2026',
      featured: true,
      tableOfContents: [
        { page: 1, title: 'Welcome to Bhutan' },
        { page: 5, title: 'Lodge Circuit Details' }
      ]
    });
    setPdfFileName('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const finalPdfUrl = formData.pdfUrl.trim() || '#pdf-demo';

    addBrochure({
      ...formData,
      pdfUrl: finalPdfUrl
    });
    setIsModalOpen(false);
  };

  return (
    <AdminLayout 
      title="E-Brochures & Publications" 
      subtitle="Upload, view, and delete official digital publication files"
    >
      <div className="space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif font-bold text-lg text-amber-950">Publication Library ({brochures.length})</h2>
            <p className="text-stone-600 text-xs">PDF publications available for guests</p>
          </div>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-850 text-amber-50 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Upload New Brochure PDF</span>
          </button>
        </div>

        {/* Brochure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {brochures.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-amber-200 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <img src={b.coverImage} alt="" className="w-full sm:w-28 h-48 sm:h-36 rounded-lg object-cover border border-amber-300 shrink-0" />
              <div className="flex-1 flex flex-col justify-between space-y-2 w-full">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">PDF Document</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-amber-950 mt-1">{b.title}</h3>
                  <p className="text-stone-500 text-xs">{b.fileSize} • {b.totalPages} Pages</p>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => setActiveBrochure(b)}
                    className="flex-1 sm:flex-initial px-3 py-2 rounded bg-amber-950 text-amber-100 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer min-h-[38px]"
                  >
                    <Eye className="w-3.5 h-3.5" /> Launch Reader
                  </button>
                  <button
                    onClick={() => setDeleteConfirm({ id: b.id, title: b.title })}
                    className="p-2 rounded bg-rose-100 text-rose-800 hover:bg-rose-200 cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
                    title="Delete Brochure"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl my-auto max-h-[90vh] overflow-y-auto border border-amber-300">
            <div className="flex items-center justify-between border-b pb-3 sticky top-0 bg-white z-10">
              <h3 className="font-serif font-bold text-lg text-amber-950">Add Publication Brochure</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-800">Brochure Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kingdom of Happiness Expedition Guide 2026"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-800">Category</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  >
                    <option value="Luxury Tours">Luxury Tours</option>
                    <option value="Festivals & Culture">Festivals & Culture</option>
                    <option value="Wellness & Mindfulness">Wellness & Mindfulness</option>
                    <option value="Trekking & Adventure">Trekking & Adventure</option>
                    <option value="Sanctuary Lodges">Sanctuary Lodges</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-800">Subtitle / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Official 2026 Circuit Guide"
                    value={formData.subtitle}
                    onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full p-2.5 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* PDF File Upload Section */}
              <div className="space-y-2 border border-amber-200 bg-amber-50/50 p-3.5 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <FileText className="w-4 h-4 text-amber-800" />
                    <span>Brochure PDF Document *</span>
                  </label>
                  
                  <div className="flex items-center gap-1 bg-amber-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setPdfUploadMode('file')}
                      className={`px-2 py-1 rounded font-semibold transition ${pdfUploadMode === 'file' ? 'bg-amber-900 text-white' : 'text-amber-900 hover:bg-amber-200'}`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setPdfUploadMode('url')}
                      className={`px-2 py-1 rounded font-semibold transition ${pdfUploadMode === 'url' ? 'bg-amber-900 text-white' : 'text-amber-900 hover:bg-amber-200'}`}
                    >
                      PDF Link URL
                    </button>
                  </div>
                </div>

                {pdfUploadMode === 'file' ? (
                  <div className="space-y-2">
                    <label className="border-2 border-dashed border-amber-300 bg-white hover:bg-amber-50/80 transition rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group">
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                      />
                      <Upload className="w-6 h-6 text-amber-700 mb-1 group-hover:scale-110 transition" />
                      <span className="font-bold text-amber-900">Click to choose PDF from Desktop</span>
                      <span className="text-[10px] text-stone-500 mt-0.5">Supports official PDF files (up to 5GB)</span>
                    </label>

                    {pdfFileName && (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-lg text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold truncate">{pdfFileName}</span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded shrink-0">{formData.fileSize}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPdfFileName('');
                            setFormData(prev => ({ ...prev, pdfUrl: '' }));
                          }}
                          className="text-stone-400 hover:text-stone-700 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="url"
                      placeholder="https://example.com/documents/bhutan-guide-2026.pdf"
                      value={formData.pdfUrl}
                      onChange={e => setFormData({ ...formData, pdfUrl: e.target.value })}
                      className="w-full p-2.5 border border-stone-300 bg-white rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                    />
                    <p className="text-[10px] text-stone-500 mt-1">Direct HTTPS web URL to hosted PDF document.</p>
                  </div>
                )}
              </div>

              {/* Auto-calculated Metadata Display */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-900">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Document Metadata (Auto-calculated)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-stone-600">File Size:</span>
                    <span className="ml-1 font-mono font-bold text-amber-900">{formData.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-stone-600">Page Count:</span>
                    <span className="ml-1 font-mono font-bold text-amber-900">{formData.totalPages > 0 ? formData.totalPages : 'Calculating...'}</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-500 italic">Values are automatically calculated from uploaded PDF</p>
              </div>

              <ImageUploader
                label="Brochure Cover Image"
                value={formData.coverImage}
                onChange={url => setFormData({ ...formData, coverImage: url })}
              />

              <MultiImageUploader
                label="Brochure Pages & Interior Gallery Images"
                images={formData.galleryImages || (formData.coverImage ? [formData.coverImage] : [])}
                onChange={urls => setFormData({ ...formData, galleryImages: urls })}
              />

              <div className="flex items-center justify-between pt-2 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-amber-900 hover:bg-amber-850 text-white font-bold rounded-xl shadow-sm cursor-pointer">Publish Brochure PDF</button>
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
                <h3 className="font-serif font-bold text-lg text-stone-900">Delete Brochure?</h3>
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
                  deleteBrochure(deleteConfirm.id);
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

