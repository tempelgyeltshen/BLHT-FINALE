import React, { useState } from 'react';
import { useApp } from '../../../../core/providers/AppProvider';
import { AdminLayout } from '../shared/AdminLayout';
import { ImageUploader } from '../../../shared/components/media/ImageUploader';
import { MultiImageUploader } from '../../../shared/components/media/MultiImageUploader';
import { Button, ConfirmDialog, Input, Modal, Pagination, Select } from '../../../shared/components/ui';
import { usePagination } from '../../../shared/hooks/usePagination';
import { FileText, Plus, Trash2, Eye, X, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { useCloudinaryUpload } from '../../../shared/hooks/useCloudinaryUpload';
import { cloudinaryService } from '../../../../../lib/services/cloudinary.service';
import { api } from '../../../../../lib/api/client';
import { isValidHttpUrl } from '../../../../../utils/helpers';

// Cloudinary's free plan caps raw (PDF) uploads at 10 MB. Larger PDFs are
// stored in MongoDB GridFS and streamed through the backend at /api/uploads/mongo.
const CLOUDINARY_RAW_MAX_BYTES = 10 * 1024 * 1024;

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
  tableOfContents?: Array<{ page: number; title: string }>;
}

export const AdminBrochuresView: React.FC = () => {
  const { brochures, addBrochure, deleteBrochure, setActiveBrochure, showToast } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUploadMode, setPdfUploadMode] = useState<'file' | 'url'>('file');
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [isMongoUploading, setIsMongoUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

  // Cloudinary upload hook for PDFs
  const { uploadFile: uploadPdf, uploadProgress: pdfUploadProgress, isUploading: isPdfUploading, uploadError: pdfUploadError, resetUpload: resetPdfUpload } = useCloudinaryUpload();

  // Cloudinary metadata state
  const [pdfMetadata, setPdfMetadata] = useState<any>(null);

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
    featured: true
  });

  const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Please select a valid PDF file.');
        return;
      }
      
      // Check file size limit (5GB)
      const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
      if (file.size > MAX_FILE_SIZE) {
        const sizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(2);
        showToast(`File size (${sizeGB} GB) exceeds maximum allowed size of 5GB. Please select a smaller file.`);
        return;
      }
      
      resetPdfUpload();

      // Files above Cloudinary's 10 MB raw limit are stored in MongoDB GridFS
      // (streamed through the backend) instead of uploaded to Cloudinary.
      if (file.size > CLOUDINARY_RAW_MAX_BYTES) {
        setIsMongoUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await api.post<{ data: { url: string; fileId: string; size: number } }>(
            '/api/uploads/mongo',
            formData
          );
          const { url, fileId, size } = res.data;

          setPdfFileName(file.name);
          setPdfMetadata({ storage: 'mongo', fileId });
          setFormData(prev => ({
            ...prev,
            pdfUrl: url,
            fileSize: cloudinaryService.formatFileSize(size),
            totalPages: 0 // page count is not available for stored PDFs
          }));

          showToast('PDF stored successfully. Verify the URL before publishing.');
        } catch (error) {
          console.error('PDF upload failed:', error);
          const detail = error instanceof Error && error.message ? error.message : 'Please try again.';
          showToast(`PDF upload failed: ${detail}`);
        } finally {
          setIsMongoUploading(false);
        }
        return;
      }

      try {
        const result = await uploadPdf(file, {
          folder: 'blht/brochures',
          resourceType: 'raw'
        });
        
        // Auto-calculate file size from Cloudinary
        const formattedSize = cloudinaryService.formatFileSize(result.bytes);
        
        setPdfFileName(file.name);
        setPdfMetadata(result);
        
        setFormData(prev => ({
          ...prev,
          pdfUrl: result.secure_url,
          fileSize: formattedSize,
          totalPages: 0 // Cloudinary doesn't provide page count for PDFs
        }));

        showToast(`PDF uploaded to Cloudinary successfully! Verify the URL before publishing: ${result.secure_url}`);
      } catch (error) {
        console.error('PDF upload failed:', error);
        // Surface the real reason (auth, signature, timeout, network, etc.) so
        // the admin can act on it instead of a generic "try again" message.
        const detail = error instanceof Error && error.message ? error.message : 'Please try again.';
        showToast(`PDF upload failed: ${detail}`);
      }
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
      featured: true
    });
    setPdfFileName('');
    setPdfMetadata(null);
    resetPdfUpload();
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      showToast('Please enter a brochure title before publishing.');
      return;
    }

    const finalPdfUrl = formData.pdfUrl.trim();

    // A brochure must point to a real PDF document: either uploaded via Cloudinary
    // (trusted URL) or a manually pasted https:// link that must be validated.
    if (!finalPdfUrl) {
      showToast('Please upload the PDF file or paste a valid PDF URL before publishing.');
      return;
    }
    if (!pdfMetadata && !isValidHttpUrl(finalPdfUrl)) {
      showToast('The PDF URL is invalid. Please paste a valid https:// URL to the document.');
      return;
    }

    const brochureData: any = {
      ...formData,
      pdfUrl: finalPdfUrl
    };

    // Add Cloudinary metadata if available
    if (pdfMetadata && pdfMetadata.public_id) {
      brochureData.pdf_public_id = pdfMetadata.public_id;
      brochureData.pdf_resource_type = pdfMetadata.resource_type;
      brochureData.pdf_format = pdfMetadata.format;
      brochureData.pdf_bytes = pdfMetadata.bytes;
      brochureData.pdf_upload_date = pdfMetadata.created_at;
    }

    // Add MongoDB GridFS metadata for large PDFs (kept for delete-sync)
    if (pdfMetadata && pdfMetadata.storage === 'mongo') {
      brochureData.pdf_storage = 'mongo';
      brochureData.pdf_file_id = pdfMetadata.fileId;
    }

    addBrochure(brochureData);
    setIsModalOpen(false);
  };

  const { currentPage, totalPages, pageItems, goToPage } = usePagination(brochures, 6);

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

          <Button onClick={openAddModal} variant="primary" size="lg">
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Upload New Brochure PDF</span>
          </Button>
        </div>

        {/* Brochure Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pageItems.map(b => (
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
                  <Button
                    onClick={() => setActiveBrochure(b)}
                    variant="dark"
                    size="sm"
                    className="flex-1 sm:flex-initial px-3 py-2 min-h-[38px]"
                  >
                    <Eye className="w-3.5 h-3.5" /> Launch Reader
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirm({ id: b.id, title: b.title })}
                    variant="iconRose"
                    size="iconSm"
                    className="min-h-[38px] min-w-[38px]"
                    title="Delete Brochure"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={goToPage} />

      {/* Upload Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Publication Brochure"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Brochure Title *"
            labelClassName="block font-semibold mb-1 text-stone-800"
            variant="amber"
            required
            placeholder="e.g. Kingdom of Happiness Expedition Guide 2026"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Select
              label="Category"
              labelClassName="block font-semibold mb-1 text-stone-800"
              variant="amber"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Luxury Tours">Luxury Tours</option>
              <option value="Festivals & Culture">Festivals & Culture</option>
              <option value="Wellness & Mindfulness">Wellness & Mindfulness</option>
              <option value="Trekking & Adventure">Trekking & Adventure</option>
              <option value="Sanctuary Lodges">Sanctuary Lodges</option>
            </Select>

            <Input
              label="Subtitle / Tagline"
              labelClassName="block font-semibold mb-1 text-stone-800"
              variant="amber"
              placeholder="e.g. Official 2026 Circuit Guide"
              value={formData.subtitle}
              onChange={e => setFormData({ ...formData, subtitle: e.target.value })}
            />
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
                    <label className={`border-2 border-dashed border-amber-300 ${isPdfUploading ? 'bg-amber-50' : 'bg-white hover:bg-amber-50/80'} transition rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer text-center group`}>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={handlePdfFileChange}
                        className="hidden"
                        disabled={isPdfUploading || isMongoUploading}
                      />
                      {isPdfUploading || isMongoUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 text-amber-700 mb-1 animate-spin" />
                          <span className="font-bold text-amber-900">{isMongoUploading ? 'Uploading to server...' : `Uploading to Cloudinary ${pdfUploadProgress ? `${Math.round(pdfUploadProgress.percentage)}%` : '...'}`}</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-amber-700 mb-1 group-hover:scale-110 transition" />
                          <span className="font-bold text-amber-900">Click to choose PDF from Desktop</span>
                          <span className="text-[10px] text-stone-500 mt-0.5">Supports official PDF files (up to 5GB)</span>
                        </>
                      )}
                    </label>

                    {/* Upload Progress */}
                    {pdfUploadProgress && (
                      <div className="bg-amber-100 rounded-lg p-2">
                        <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
                          <span>Uploading to Cloudinary...</span>
                          <span>{Math.round(pdfUploadProgress.percentage)}%</span>
                        </div>
                        <div className="w-full bg-amber-200 rounded-full h-2">
                          <div 
                            className="bg-amber-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${pdfUploadProgress.percentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Upload Error */}
                    {pdfUploadError && (
                      <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs p-2 rounded-lg">
                        {pdfUploadError}
                      </div>
                    )}

                    {pdfFileName && !isPdfUploading && (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-lg text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-semibold truncate">{pdfFileName}</span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded shrink-0">{formData.fileSize}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Best-effort cleanup of the stored GridFS file when
                            // a large PDF is removed before publishing.
                            if (pdfMetadata && pdfMetadata.storage === 'mongo' && pdfMetadata.fileId) {
                              api.delete(`/api/uploads/mongo/${pdfMetadata.fileId}`).catch(() => {});
                            }
                            setPdfFileName('');
                            setPdfMetadata(null);
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
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primaryWhite">Publish Brochure PDF</Button>
              </div>
            </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteConfirm)}
        title="Delete Brochure?"
        message={(
          <span>
            Are you sure you want to delete <span className="font-bold text-rose-900">"{deleteConfirm?.title}"</span>?
          </span>
        )}
        onCancel={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) deleteBrochure(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
      />

      </div>
    </AdminLayout>
  );
};

