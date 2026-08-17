import React from 'react';
import { useApp } from '../../../core/providers/AppProvider';
import { ArrowLeft } from 'lucide-react';
import { createBrochurePreviewUrl, getBrochurePdfUrl } from '../../../../utils/downloadPdf';

/**
 * Full-screen brochure PDF reader. Rendered OUTSIDE the site layout (no
 * Navbar/Footer) so the page shows nothing but the document. A small floating
 * back control is the only overlay, revealed on hover so it never blocks the
 * document while reading.
 */
export const PdfFullScreenView: React.FC = () => {
  const { activeBrochure, brochures, setActiveBrochure, navigate, brochureReturnRoute } = useApp();

  const currentBrochure = activeBrochure || brochures[0];

  // Resolve the document URL in an effect instead of useMemo so the generated
  // placeholder blob is created and revoked by the same effect. This is
  // StrictMode-safe: each setup creates its own object URL and its cleanup
  // revokes exactly that one, so the double-mount can't revoke the URL the
  // iframe is pointing at (which left the fallback preview blank in dev).
  const [brochurePdfUrl, setBrochurePdfUrl] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!currentBrochure) {
      setBrochurePdfUrl(undefined);
      return;
    }
    // Cloudinary uploads go through the backend proxy (authenticated download),
    // which works even when the account's delivery ACL blocks public raw URLs.
    // Other sources (data:/http/blob) are used directly; otherwise fall back to
    // the generated placeholder PDF.
    const resolved = getBrochurePdfUrl(currentBrochure);
    if (resolved) {
      setBrochurePdfUrl(resolved);
      return;
    }
    const objectUrl = createBrochurePreviewUrl(currentBrochure);
    setBrochurePdfUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [currentBrochure]);

  // Track PDF load state so we can show a spinner and a helpful fallback
  // instead of a silent blank page when the document fails to load.
  const [pdfLoadFailed, setPdfLoadFailed] = React.useState(false);
  const [pdfLoading, setPdfLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setPdfLoadFailed(false);
    setPdfLoading(true);
    const url = brochurePdfUrl;
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
  }, [brochurePdfUrl]);

  // Update the browser tab title to the document being read.
  React.useEffect(() => {
    const previousTitle = document.title;
    if (currentBrochure) {
      document.title = `${currentBrochure.title} — PDF`;
    }
    return () => { document.title = previousTitle; };
  }, [currentBrochure]);

  const handlePdfLoaded = () => setPdfLoading(false);

  const handlePdfError = () => {
    setPdfLoading(false);
    setPdfLoadFailed(true);
  };

  const goBack = () => {
    setActiveBrochure(null);
    navigate(brochureReturnRoute || 'brochures');
  };

  if (!currentBrochure) {
    return (
      <div className="fixed inset-0 bg-stone-950 flex flex-col items-center justify-center gap-5 p-8 text-center">
        <h2 className="font-serif text-2xl font-bold text-amber-100">No Brochure Selected</h2>
        <p className="text-stone-400 text-sm">Please select a publication from our Brochure Library.</p>
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

  return (
    <div className="fixed inset-0 bg-stone-950 overflow-hidden">
      {/* Minimal floating back control — revealed on hover so the document
          stays front and center while reading. */}
      <button
        onClick={goBack}
        className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-black/50 text-white/80 backdrop-blur-sm border border-white/10 text-xs font-bold opacity-40 hover:opacity-100 hover:bg-black/70 hover:text-white transition-opacity cursor-pointer"
        title="Back to brochure library"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Back</span>
      </button>

      {pdfLoadFailed ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-amber-100 font-serif text-lg font-bold">The PDF could not be loaded.</p>
          <p className="text-amber-100/60 text-xs max-w-sm leading-relaxed">
            The document may be temporarily unavailable. Please go back and try again later.
          </p>
          <button
            onClick={goBack}
            className="px-5 py-2.5 rounded-xl bg-amber-800 text-amber-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-amber-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Brochure Library</span>
          </button>
        </div>
      ) : (
        <>
          {pdfLoading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-amber-500/30 border-t-amber-400 animate-spin" />
              <p className="text-amber-100/80 text-xs font-bold tracking-wide">Preparing PDF…</p>
            </div>
          )}
          <iframe
            src={brochurePdfUrl}
            title={currentBrochure.title}
            className="w-full h-full border-0 bg-white"
            onLoad={handlePdfLoaded}
            onError={handlePdfError}
          />
        </>
      )}
    </div>
  );
};
