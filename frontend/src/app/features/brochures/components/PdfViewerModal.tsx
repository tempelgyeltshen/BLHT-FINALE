import React from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { downloadBrochurePdf, createBrochurePreviewUrl, getBrochurePdfUrl } from '../../../../utils/downloadPdf';

export const PdfViewerModal: React.FC = () => {
  const { activeBrochure, brochures, setActiveBrochure, navigate, currentRoute, brochureReturnRoute, logBrochureDownload, showToast } = useApp();

  // Fallback if activeBrochure is not set directly
  const currentBrochure = activeBrochure || brochures[0];

  const brochurePreviewUrl = React.useMemo(() => {
    if (!currentBrochure) return undefined;
    // Cloudinary uploads go through the backend proxy (authenticated download),
    // which works even when the account's delivery ACL blocks public raw URLs.
    // Other sources (data:/http/blob) are used directly; otherwise fall back to
    // the generated placeholder PDF.
    const resolved = getBrochurePdfUrl(currentBrochure);
    if (resolved) return resolved;
    return createBrochurePreviewUrl(currentBrochure);
  }, [currentBrochure]);

  const isPreviewBlob = Boolean(brochurePreviewUrl && brochurePreviewUrl.startsWith('blob:'));

  React.useEffect(() => {
    return () => {
      if (isPreviewBlob && brochurePreviewUrl) {
        URL.revokeObjectURL(brochurePreviewUrl);
      }
    };
  }, [brochurePreviewUrl, isPreviewBlob]);

  // Track PDF load state so we can show a spinner and a helpful fallback
  // instead of a silent blank box when the document fails to load. An iframe's
  // onError only fires for network failures (not HTTP 404), so a cheap HEAD
  // preflight catches missing documents up front.
  const [pdfLoadFailed, setPdfLoadFailed] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setPdfLoadFailed(false);
    setPdfLoading(true);
    const url = brochurePreviewUrl;
    // blob:/data: previews render instantly — no preflight needed.
    if (!url || url.startsWith('blob:') || url.startsWith('data:')) {
      return () => { cancelled = true; };
    }
    fetch(url, { method: 'HEAD', credentials: 'include' })
      .then(res => {
        if (!cancelled && !res.ok) setPdfLoadFailed(true);
      })
      .catch(() => {
        if (!cancelled) setPdfLoadFailed(true);
      });
    return () => { cancelled = true; };
  }, [brochurePreviewUrl]);

  const handlePdfLoaded = () => setPdfLoading(false);

  const handlePdfError = () => {
    setPdfLoading(false);
    setPdfLoadFailed(true);
  };

  const openInNewTab = () => {
    if (brochurePreviewUrl) {
      window.open(brochurePreviewUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const brochureImages = React.useMemo(() => {
    if (!currentBrochure) return [];
    const list = [currentBrochure.coverImage, ...(currentBrochure.galleryImages || [])];
    return Array.from(new Set(list.filter(Boolean)));
  }, [currentBrochure]);

  if (!currentBrochure) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-amber-950">No Brochure Selected</h2>
        <p className="text-stone-600 text-sm">Please select a publication from our Brochure Library.</p>
        <button
          onClick={() => navigate('brochures')}
          className="px-6 py-3 rounded-xl bg-amber-800 text-amber-100 font-bold text-xs flex items-center gap-2 hover:bg-amber-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View Brochure Directory</span>
        </button>
      </div>
    );
  }

  const totalPages = currentBrochure.totalPages > 0 ? currentBrochure.totalPages : null;

  const handleDownload = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    logBrochureDownload(currentBrochure.id, 'guest@blht.bt');
    downloadBrochurePdf(currentBrochure, showToast);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#3b2314] py-4 sm:py-8 px-2 sm:px-6 lg:px-8 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full bg-[#fdfbf7] border border-[#e2d5c3] rounded-3xl flex flex-col shadow-xl overflow-hidden my-auto min-h-[80vh]">
        
        {/* Top Header Bar - Navigation & Controls */}
        <div className="bg-[#f5eee4] px-3 sm:px-6 py-3 border-b border-[#e2d5c3] flex items-center justify-between gap-2 shrink-0 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => {
                setActiveBrochure(null);
                const target = brochureReturnRoute || (currentRoute.startsWith('admin') ? 'admin-brochures' : 'brochures');
                navigate(target);
              }}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl bg-[#efe2d3] hover:bg-[#e4d3bf] border border-[#d8c7b2] text-[#3b2314] text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              title="Return"
            >
              <ArrowLeft className="w-4 h-4 text-[#d96b27]" />
              <span className="hidden sm:inline">
                {brochureReturnRoute?.startsWith('admin') || currentRoute.startsWith('admin')
                  ? 'Back to Admin Portal'
                  : 'Brochure Library'}
              </span>
            </button>

            <div className="min-w-0 border-l border-[#d8c7b2] pl-2 sm:pl-3">
              <h1 className="font-serif font-bold text-xs sm:text-base text-[#3b2314] truncate max-w-[160px] sm:max-w-md">
                {currentBrochure.title}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-[#d96b27] font-bold truncate">
                PDF • {currentBrochure.fileSize}{totalPages ? ` • ${totalPages} Pgs` : ''}
              </p>
            </div>
          </div>


          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={openInNewTab}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#efe2d3] hover:bg-[#e4d3bf] border border-[#d8c7b2] text-xs font-semibold text-[#3b2314] flex items-center gap-1.5 cursor-pointer min-h-[40px] min-w-[40px] sm:min-w-0 justify-center transition-colors"
              title="Open PDF in new tab"
            >
              <ExternalLink className="w-4 h-4 text-[#d96b27]" />
              <span className="hidden sm:inline">Open</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#efe2d3] hover:bg-[#e4d3bf] border border-[#d8c7b2] text-xs font-semibold text-[#3b2314] flex items-center gap-1.5 cursor-pointer min-h-[40px] min-w-[40px] sm:min-w-0 justify-center transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4 text-[#d96b27]" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Main Viewing Area */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex flex-col items-center justify-center bg-[#eae0d2]/70 relative min-h-[500px] sm:min-h-[600px]">
          {brochurePreviewUrl ? (
            <div className="w-full h-full min-h-[520px] sm:min-h-[620px] bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#e2d5c3] flex flex-col my-auto relative">
              {pdfLoadFailed ? (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center bg-stone-900">
                  <p className="text-amber-100 font-serif text-lg font-bold">The PDF could not be loaded.</p>
                  <p className="text-amber-100/70 text-xs max-w-sm leading-relaxed">
                    The document may be temporarily unavailable. You can still open it in a new tab or download the file directly.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={openInNewTab}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d96b27] to-[#b85c1a] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open in New Tab</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2.5 rounded-xl bg-[#efe2d3] hover:bg-[#e4d3bf] border border-[#d8c7b2] text-[#3b2314] text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 text-[#d96b27]" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {pdfLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-stone-900/95">
                      <div className="w-10 h-10 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin" />
                      <p className="text-amber-100/80 text-xs font-bold tracking-wide">Preparing PDF…</p>
                    </div>
                  )}
                  <iframe
                    src={brochurePreviewUrl}
                    title={currentBrochure.title}
                    className="w-full h-full min-h-[520px] sm:min-h-[620px] border-0"
                    onLoad={handlePdfLoaded}
                    onError={handlePdfError}
                  />
                </>
              )}
            </div>
          ) : (
            <div className="w-full max-w-4xl bg-[#fdfbf7] border border-[#e2d5c3] rounded-2xl p-4 sm:p-6 shadow-inner flex flex-col">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cover Image */}
                <div className="relative rounded-xl overflow-hidden border-2 border-[#e2d5c3] shadow-md">
                  <img 
                    src={currentBrochure.coverImage} 
                    alt={currentBrochure.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="bg-[#d96b27] text-white text-xs font-bold px-2 py-1 rounded">
                      {currentBrochure.category}
                    </span>
                  </div>
                </div>

                {/* Brochure Details */}
                <div className="space-y-4">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#3b2314]">
                      {currentBrochure.title}
                    </h2>
                    <p className="text-stone-600 text-sm mt-1">
                      {currentBrochure.subtitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-[#f5eee4] p-3 rounded-lg border border-[#e2d5c3]">
                      <span className="text-stone-600 text-xs">File Size</span>
                      <p className="font-bold text-[#d96b27]">{currentBrochure.fileSize}</p>
                    </div>
                    {totalPages ? (
                      <div className="bg-[#f5eee4] p-3 rounded-lg border border-[#e2d5c3]">
                        <span className="text-stone-600 text-xs">Pages</span>
                        <p className="font-bold text-[#d96b27]">{totalPages}</p>
                      </div>
                    ) : (
                      <div className="bg-[#f5eee4] p-3 rounded-lg border border-[#e2d5c3]">
                        <span className="text-stone-600 text-xs">Format</span>
                        <p className="font-bold text-[#d96b27]">PDF</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d96b27] to-[#b85c1a] text-white font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>

              {/* Gallery Images */}
              {brochureImages.length > 1 && (
                <div className="mt-6">
                  <h3 className="font-bold text-sm text-[#3b2314] mb-3">Gallery Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {brochureImages.slice(1).map((img, idx) => (
                      <div key={idx} className="aspect-video rounded-lg overflow-hidden border border-[#e2d5c3]">
                        <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};