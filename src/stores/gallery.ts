import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { GalleryImage, GalleryFilters, UploadProgress } from '../types/gallery';
import { galleryService } from '../services/galleryService';

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const images = ref<GalleryImage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const uploadProgress = ref<Record<string, UploadProgress>>({});

  // Actions
  const fetchImages = async (filters?: GalleryFilters) => {
    loading.value = true;
    error.value = null;
    try {
      images.value = await galleryService.fetchImages(filters);
    } catch (e) {
      error.value = 'Failed to fetch images';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const uploadImage = async (file: File) => {
    const uploadId = Math.random().toString(36).substr(2, 9);
    
    // Initialize progress tracking
    uploadProgress.value[uploadId] = {
      id: uploadId,
      fileName: file.name,
      progress: 0,
      status: 'uploading',
    };

    try {
      const image = await galleryService.uploadImage(file, (progress) => {
        if (uploadProgress.value[uploadId]) {
          uploadProgress.value[uploadId].progress = progress;
        }
      });

      // Update progress status
      uploadProgress.value[uploadId].status = 'completed';
      
      // Add new image to list
      images.value.unshift(image);

      // Remove progress after delay
      setTimeout(() => {
        delete uploadProgress.value[uploadId];
      }, 2000);

      return image;
    } catch (e) {
      // Update progress with error
      uploadProgress.value[uploadId].status = 'error';
      uploadProgress.value[uploadId].error = e.message;

      // Remove progress after delay
      setTimeout(() => {
        delete uploadProgress.value[uploadId];
      }, 5000);

      throw e;
    }
  };

  const deleteImage = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await galleryService.deleteImage(id);
      images.value = images.value.filter(img => img.id !== id);
    } catch (e) {
      error.value = 'Failed to delete image';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    loading.value = true;
    error.value = null;
    try {
      const updatedImage = await galleryService.updateImage(id, updates);
      const index = images.value.findIndex(img => img.id === id);
      if (index !== -1) {
        images.value[index] = updatedImage;
      }
      return updatedImage;
    } catch (e) {
      error.value = 'Failed to update image';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Computed
  const getImagesByTag = (tag: string) => {
    return images.value.filter(img => img.tags?.includes(tag));
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    images.value.forEach(img => {
      img.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  };

  return {
    // State
    images,
    loading,
    error,
    uploadProgress,
    
    // Actions
    fetchImages,
    uploadImage,
    deleteImage,
    updateImage,
    
    // Computed
    getImagesByTag,
    getAllTags,
  };
});