// Gallery types
export interface GalleryImage {
  id: string;
  file_path: string;
  thumbnail_path: string; 
  name: string;
  size: string;
  type: string;
  url: string; 
  dimensions?: {
    width: number;
    height: number;
  };
  uploadedAt: string;
  tags?: string[];
}

export interface UploadProgress {
  id: string;
  progress: number;
  fileName: string;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface GalleryFilters {
  search?: string;
  tags?: string[];
  type?: string;
  sortBy?: 'name' | 'date' | 'size';
  sortOrder?: 'asc' | 'desc';
}