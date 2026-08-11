import { Brochure } from '../types';

/**
 * Brochures uploaded to Cloudinary as raw files can have public delivery
 * blocked by the account's Delivery Access Control (raw URLs return 401).
 * When the brochure has a Cloudinary public_id, route viewing/downloading
 * through the backend proxy (which streams via Cloudinary's authenticated
 * download API) so it always works. Other sources (data:, blob:, http/https,
 * or no PDF at all) keep the legacy behavior.
 */
export const isCloudinaryPdf = (brochure: Brochure): boolean =>
  Boolean(brochure.pdf_public_id) &&
  (!brochure.pdfUrl || brochure.pdfUrl.startsWith('https://res.cloudinary.com/'));

// Same-origin relative path (dev Vite proxy + prod nginx proxy forward /api to
// the backend). A relative URL keeps the framed PDF same-origin so the backend's
// CSP `frame-ancestors 'self'` does not block the viewer iframe, and lets the
// `download` attribute save the file directly.
export const getBrochurePdfUrl = (brochure: Brochure, opts: { download?: boolean } = {}): string | null => {
  if (isCloudinaryPdf(brochure) && brochure.id) {
    return `/api/cms/brochures/${encodeURIComponent(brochure.id)}/pdf${opts.download ? '?download=1' : ''}`;
  }
  // Static brochure PDFs served from backend assets/brochures/
  if (brochure.pdfUrl && brochure.pdfUrl.startsWith('/api/uploads/brochures/')) {
    return `${brochure.pdfUrl}${opts.download ? '?download=1' : ''}`;
  }
  // MongoDB GridFS-hosted PDFs (stored when a file exceeds Cloudinary's raw
  // limit) use a same-origin /api path that streams directly from the backend.
  if (brochure.pdfUrl && brochure.pdfUrl.startsWith('/api/')) {
    return `${brochure.pdfUrl}${opts.download ? '?download=1' : ''}`;
  }
  if (brochure.pdfUrl &&
    (brochure.pdfUrl.startsWith('data:') || brochure.pdfUrl.startsWith('http://') || brochure.pdfUrl.startsWith('https://') || brochure.pdfUrl.startsWith('blob:'))) {
    return brochure.pdfUrl;
  }
  return null;
};

const buildFallbackPdfContent = (brochure: Brochure) => {
  return `%PDF-1.7
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 180 >>
stream
BT
/F1 18 Tf
50 720 Td
(${brochure.title.replace(/[()]/g, '')}) Tj
/F1 12 Tf
0 -30 Td
(BHUTAN LUXURY & HERITAGE TOURS - Official Brochure) Tj
0 -20 Td
(Category: ${brochure.category.replace(/[()]/g, '')}) Tj
0 -20 Td
(Edition Year: ${brochure.year || '2026'}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000262 00000 n 
0000000493 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
570
%%EOF`;
};

export const createBrochurePreviewUrl = (brochure: Brochure) => {
  const content = buildFallbackPdfContent(brochure);
  const blob = new Blob([content], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

export const downloadBrochurePdf = (brochure: Brochure, showToast?: (msg: string) => void) => {
  if (showToast) {
    showToast(`Downloading ${brochure.title} (PDF)...`);
  }

  const cleanName = brochure.title.replace(/[^a-zA-Z0-9_\-]/g, '_');
  const fileName = `${cleanName}_BLHT_2026.pdf`;

  const pdfUrl = getBrochurePdfUrl(brochure, { download: true });

  if (pdfUrl) {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    // Same-origin /api paths honor the `download` attribute (direct save).
    // Remote http(s) URLs (e.g. a legacy Cloudinary link) can't be saved
    // directly, so open them in a new tab instead.
    if (!pdfUrl.startsWith('data:') && !pdfUrl.startsWith('/')) {
      link.target = '_blank';
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    const url = createBrochurePreviewUrl(brochure);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};
