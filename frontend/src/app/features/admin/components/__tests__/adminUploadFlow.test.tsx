import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminBrochuresView } from '../brochures/AdminBrochuresView';
import { AdminVideosView } from '../videos/AdminVideosView';

// The views render inside AdminLayout + heavy UI; jsdom is slow on this machine,
// so give each end-to-end flow a generous timeout.
const FLOW_TIMEOUT = 20_000;

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------
// 1. Cloudinary service: the network boundary. uploadFile is stubbed so the
//    real useCloudinaryUpload hook + admin views run end-to-end against a fake.
const { mockUploadFile, mockFormatFileSize, mockFormatDuration } = vi.hoisted(() => ({
  mockUploadFile: vi.fn(),
  mockFormatFileSize: vi.fn((bytes: number) => `${bytes} B`),
  mockFormatDuration: vi.fn((seconds: number) => '01:05'),
}));

vi.mock('../../../../../lib/services/cloudinary.service', () => ({
  cloudinaryService: {
    uploadFile: mockUploadFile,
    formatFileSize: mockFormatFileSize,
    formatDuration: mockFormatDuration,
  },
}));

// 2. useApp: the admin views + AdminLayout read a lot from context; provide a
//    full fake so no real provider tree (auth, API, router) is needed.
const { mockUseApp } = vi.hoisted(() => ({ mockUseApp: vi.fn() }));

vi.mock('../../../../core/providers/AppProvider', () => ({
  useApp: () => mockUseApp(),
}));

// ---------------------------------------------------------------------------
// Fixtures + fake context
// ---------------------------------------------------------------------------
const videoResult = {
  secure_url: 'https://res.cloudinary.com/demo/video/upload/v1/blht/videos/tigers-nest.mp4',
  public_id: 'blht/videos/tigers-nest',
  resource_type: 'video',
  format: 'mp4',
  bytes: 1024 * 1024 * 5,
  created_at: '2024-01-01T00:00:00Z',
  duration: 65,
  eager: [
    { secure_url: 'https://res.cloudinary.com/demo/video/upload/so_5/v1/blht/videos/tigers-nest.jpg', format: 'jpg' },
  ],
};

const pdfResult = {
  secure_url: 'https://res.cloudinary.com/demo/raw/upload/v1/blht/brochures/expedition-guide.pdf',
  public_id: 'blht/brochures/expedition-guide',
  resource_type: 'raw',
  format: 'pdf',
  bytes: 2048,
  created_at: '2024-01-01T00:00:00Z',
};

const makeFile = (name: string, type: string) => new File(['x'], name, { type });

function makeAppContext(overrides: Record<string, unknown> = {}) {
  return {
    currentRoute: 'admin-videos',
    navigate: vi.fn(),
    logoutAdmin: vi.fn(),
    packages: [],
    hotels: [],
    brochures: [],
    videos: [],
    inquiries: [],
    addVideoItem: vi.fn(),
    updateVideoItem: vi.fn(),
    deleteVideoItem: vi.fn(),
    addBrochure: vi.fn(),
    deleteBrochure: vi.fn(),
    setActiveBrochure: vi.fn(),
    showToast: vi.fn(),
    ...overrides,
  };
}

// Declared above beforeEach for clarity; recreated per test so all spy state
// (calls, implementations) is fresh and the fake useApp points at the new one.
let mockAppContext: ReturnType<typeof makeAppContext>;

beforeEach(() => {
  vi.clearAllMocks();
  mockUploadFile.mockReset();
  mockUploadFile.mockResolvedValue(videoResult);
  mockAppContext = makeAppContext();
  mockUseApp.mockReturnValue(mockAppContext);
});

// ---------------------------------------------------------------------------
// Brochure flow: select PDF file -> Cloudinary upload -> fill form -> publish
// ---------------------------------------------------------------------------
describe('AdminBrochuresView upload flow', () => {
  it(
    'uploads a PDF to Cloudinary, then publishes the brochure with metadata',
    async () => {
      mockUploadFile.mockResolvedValue(pdfResult);
      render(<AdminBrochuresView />);

      // Open the "Upload New Brochure PDF" modal.
      fireEvent.click(screen.getByRole('button', { name: /Upload New Brochure PDF/i }));

      // Simulate selecting a PDF from disk.
      const fileInput = await screen.findByLabelText(/Click to choose PDF from Desktop/i) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [makeFile('expedition-guide.pdf', 'application/pdf')] } });

      // The upload hook should call the (mocked) Cloudinary service with the PDF.
      await waitFor(() => {
        expect(mockUploadFile).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({ folder: 'blht/brochures', resourceType: 'raw' })
        );
      });

      // After upload resolves, the success banner shows the file name + auto-calculated size.
      expect(await screen.findByText('expedition-guide.pdf')).toBeInTheDocument();

      // Fill in the title and publish.
      fireEvent.change(await screen.findByLabelText(/Brochure Title/i), {
        target: { value: 'Expedition Guide 2026' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Publish Brochure PDF/i }));

      await waitFor(() => {
        expect(mockAppContext.addBrochure).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Expedition Guide 2026',
            pdfUrl: pdfResult.secure_url,
            pdf_public_id: pdfResult.public_id,
            pdf_resource_type: 'raw',
            pdf_format: 'pdf',
            pdf_bytes: 2048,
            fileSize: '2048 B', // auto-calculated from Cloudinary bytes
          })
        );
      });

      // The admin gets a toast confirming the upload with the Cloudinary URL.
      expect(mockAppContext.showToast).toHaveBeenCalledWith(
        expect.stringContaining(pdfResult.secure_url)
      );
    },
    FLOW_TIMEOUT
  );
});

// ---------------------------------------------------------------------------
// Video flow: select video file -> Cloudinary upload (eager poster) -> publish
// ---------------------------------------------------------------------------
describe('AdminVideosView upload flow', () => {
  it(
    'uploads a video, auto-derives the eager poster, and publishes with metadata',
    async () => {
      render(<AdminVideosView />);

      // Open the "Add New Video" modal.
      fireEvent.click(screen.getByRole('button', { name: /Add New Video/i }));

      // Simulate selecting a video file.
      const fileInput = await screen.findByLabelText(/Select Video File from Desktop/i) as HTMLInputElement;
      fireEvent.change(fileInput, { target: { files: [makeFile('tigers-nest.mp4', 'video/mp4')] } });

      // The upload hook calls Cloudinary with the video folder + eager poster transform.
      await waitFor(() => {
        expect(mockUploadFile).toHaveBeenCalledWith(
          expect.any(File),
          expect.objectContaining({ folder: 'blht/videos', resourceType: 'video', eager: 'w_640,h_360,c_fill,so_5/jpg' })
        );
      });

      // The video URL input is populated from the Cloudinary response.
      const videoUrlInput = await screen.findByPlaceholderText(/Paste direct video URL/i) as HTMLInputElement;
      await waitFor(() => {
        expect(videoUrlInput.value).toBe(videoResult.secure_url);
      });

      // Fill in the title and publish.
      fireEvent.change(await screen.findByLabelText(/Video Title/i), {
        target: { value: 'Tiger\'s Nest 4K' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Publish Video/i }));

      await waitFor(() => {
        expect(mockAppContext.addVideoItem).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Tiger\'s Nest 4K',
            videoUrl: videoResult.secure_url,
            public_id: videoResult.public_id,
            resource_type: 'video',
            format: 'mp4',
            bytes: videoResult.bytes,
            duration: '01:05', // auto-populated from Cloudinary duration
            // Eager poster replaces the fragile .mp4 -> .jpg string swap.
            thumbnailUrl: videoResult.eager[0].secure_url,
          })
        );
      });

      expect(mockAppContext.showToast).toHaveBeenCalledWith(
        expect.stringContaining(videoResult.secure_url)
      );
    },
    FLOW_TIMEOUT
  );

  it(
    'blocks publishing when a manually pasted video URL is invalid',
    async () => {
      render(<AdminVideosView />);

      fireEvent.click(screen.getByRole('button', { name: /Add New Video/i }));

      // Paste an invalid URL instead of uploading a file.
      fireEvent.change(await screen.findByPlaceholderText(/Paste direct video URL/i), {
        target: { value: 'not-a-valid-url' },
      });
      fireEvent.change(await screen.findByLabelText(/Video Title/i), {
        target: { value: 'Broken link video' },
      });

      fireEvent.click(screen.getByRole('button', { name: /Publish Video/i }));

      await waitFor(() => {
        expect(mockAppContext.showToast).toHaveBeenCalledWith(
          expect.stringContaining('video URL is invalid')
        );
      });

      expect(mockAppContext.addVideoItem).not.toHaveBeenCalled();
    },
    FLOW_TIMEOUT
  );
});
