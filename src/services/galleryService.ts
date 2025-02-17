import type { GalleryImage, GalleryFilters } from '../types/gallery';

// Mock data
const mockImages: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    name: 'pizza-1.jpg',
    size: '1.2 MB',
    type: 'image/jpeg',
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: '2024-03-20',
    tags: ['food', 'pizza'],
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    name: 'pizza-2.jpg',
    size: '980 KB',
    type: 'image/jpeg',
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: '2024-03-20',
    tags: ['food', 'pizza'],
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f',
    name: 'store-front.jpg',
    size: '1.5 MB',
    type: 'image/jpeg',
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: '2024-03-20',
    tags: ['store', 'exterior'],
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5',
    name: 'interior.jpg',
    size: '2.1 MB',
    type: 'image/jpeg',
    dimensions: { width: 1920, height: 1080 },
    uploadedAt: '2024-03-20',
    tags: ['store', 'interior'],
  },
];

// Service class for handling gallery operations
export class GalleryService {
  private static instance: GalleryService;
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  private constructor() {}

  public static getInstance(): GalleryService {
    if (!GalleryService.instance) {
      GalleryService.instance = new GalleryService();
    }
    return GalleryService.instance;
  }

  // Fetch images with optional filters
  async fetchImages(filters?: GalleryFilters): Promise<GalleryImage[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filteredImages = [...mockImages];

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      filteredImages = filteredImages.filter(img => 
        img.name.toLowerCase().includes(searchLower) ||
        img.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (filters?.tags?.length) {
      filteredImages = filteredImages.filter(img =>
        filters.tags?.some(tag => img.tags?.includes(tag))
      );
    }

    if (filters?.type) {
      filteredImages = filteredImages.filter(img => img.type === filters.type);
    }

    // Sort images
    if (filters?.sortBy) {
      filteredImages.sort((a, b) => {
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        switch (filters.sortBy) {
          case 'name':
            return order * a.name.localeCompare(b.name);
          case 'date':
            return order * (new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
          case 'size':
            return order * (this.parseSize(a.size) - this.parseSize(b.size));
          default:
            return 0;
        }
      });
    }

    return filteredImages;
  }

  // Upload image
  async uploadImage(file: File, onProgress?: (progress: number) => void): Promise<GalleryImage> {
    // Validate file
    if (!this.validateFile(file)) {
      throw new Error('Invalid file type or size');
    }

    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      onProgress?.(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 500);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create object URL for preview
    const url = URL.createObjectURL(file);

    // Create new image entry
    const newImage: GalleryImage = {
      id: Math.random().toString(36).substring(7),
      url,
      name: file.name,
      size: this.formatSize(file.size),
      type: file.type,
      uploadedAt: new Date().toISOString(),
      tags: [],
    };

    return newImage;
  }

  // Delete image
  async deleteImage(id: string): Promise<void> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // In real implementation, this would make an API call
    // For now, we just simulate success
  }

  // Update image metadata
  async updateImage(id: string, updates: Partial<GalleryImage>): Promise<GalleryImage> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const image = mockImages.find(img => img.id === id);
    if (!image) {
      throw new Error('Image not found');
    }

    return {
      ...image,
      ...updates,
    };
  }

  // Utility methods
  private validateFile(file: File): boolean {
    return (
      this.ALLOWED_TYPES.includes(file.type) &&
      file.size <= this.MAX_FILE_SIZE
    );
  }

  private formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  }

  private parseSize(sizeStr: string): number {
    const [size, unit] = sizeStr.split(' ');
    const units = { B: 1, KB: 1024, MB: 1024 * 1024, GB: 1024 * 1024 * 1024 };
    return parseFloat(size) * (units[unit as keyof typeof units] || 1);
  }
}

// Export singleton instance
export const galleryService = GalleryService.getInstance();