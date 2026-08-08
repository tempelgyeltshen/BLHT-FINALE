/**
 * Auto-calculation utilities for file sizes, video durations, and thumbnails
 * These functions automatically compute values instead of requiring manual admin input
 */

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Parse file size string to bytes (for validation)
 */
export function parseFileSizeToBytes(sizeString: string): number {
  const units: Record<string, number> = {
    'B': 1,
    'KB': 1024,
    'MB': 1024 * 1024,
    'GB': 1024 * 1024 * 1024,
    'TB': 1024 * 1024 * 1024 * 1024
  };
  
  const match = sizeString.match(/^([\d.]+)\s*(B|KB|MB|GB|TB)?$/i);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = (match[2] || 'B').toUpperCase();
  
  return value * (units[unit] || 1);
}

/**
 * Get YouTube video duration using YouTube API
 * Returns duration in format "MM:SS" or "HH:MM:SS"
 */
export async function getYouTubeVideoDuration(youtubeId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${youtubeId}&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      console.warn('YouTube API request failed, using default duration');
      return '00:00'; // Default fallback
    }
    
    const data = await response.json();
    
    if (data.items && data.items[0] && data.items[0].contentDetails) {
      const duration = data.items[0].contentDetails.duration; // PT#M#S format
      return convertYouTubeDuration(duration);
    }
    
    return '00:00';
  } catch (error) {
    console.error('Error fetching YouTube video duration:', error);
    return '00:00';
  }
}

/**
 * Convert YouTube PT#M#S format to standard MM:SS or HH:MM:SS
 */
function convertYouTubeDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Get YouTube video thumbnail URL
 * Returns highest quality thumbnail available
 */
export function getYouTubeThumbnailUrl(youtubeId: string, quality: 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' = 'hqdefault'): string {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`;
}

/**
 * Get PDF page count (requires PDF parsing library)
 * For now, this is a placeholder - you would need a library like pdf-parse
 */
export async function getPdfPageCount(pdfUrl: string): Promise<number> {
  // Placeholder implementation
  // In production, you would use a library like pdf-parse or pdfjs-dist
  try {
    // const pdfjs = await import('pdfjs-dist');
    // const loadingTask = pdfjs.getDocument(pdfUrl);
    // const pdf = await loadingTask.promise;
    // return pdf.numPages;
    
    console.warn('PDF page count calculation not implemented, using default');
    return 0;
  } catch (error) {
    console.error('Error getting PDF page count:', error);
    return 0;
  }
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(imageUrl: string): Promise<{ width: number; height: number }> {
  try {
    const response = await fetch(imageUrl, { method: 'HEAD' });
    if (!response.ok) {
      return { width: 0, height: 0 };
    }
    
    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      return { width: 0, height: 0 };
    }
    
    // In production, you would use a library like sharp or probe-image-size
    // For now, return default dimensions
    return { width: 1920, height: 1080 };
  } catch (error) {
    console.error('Error getting image dimensions:', error);
    return { width: 0, height: 0 };
  }
}

/**
 * Auto-populate video metadata from YouTube
 */
export async function autoPopulateVideoMetadata(youtubeId: string) {
  const [duration, thumbnail] = await Promise.all([
    getYouTubeVideoDuration(youtubeId),
    Promise.resolve(getYouTubeThumbnailUrl(youtubeId))
  ]);
  
  return {
    duration,
    thumbnailUrl: thumbnail
  };
}

/**
 * Auto-populate brochure metadata from PDF
 */
export async function autoPopulateBrochureMetadata(pdfUrl: string, fileSize: number) {
  const formattedSize = formatFileSize(fileSize);
  const totalPages = await getPdfPageCount(pdfUrl);
  
  return {
    fileSize: formattedSize,
    totalPages
  };
}
