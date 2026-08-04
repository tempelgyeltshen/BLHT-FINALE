import { Brochure } from '../types';

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

  if (brochure.pdfUrl && (brochure.pdfUrl.startsWith('data:') || brochure.pdfUrl.startsWith('http://') || brochure.pdfUrl.startsWith('https://') || brochure.pdfUrl.startsWith('blob:'))) {
    const link = document.createElement('a');
    link.href = brochure.pdfUrl;
    link.download = fileName;
    if (!brochure.pdfUrl.startsWith('data:')) {
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
