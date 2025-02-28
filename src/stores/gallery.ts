import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { GalleryImage, GalleryFilters, UploadProgress } from '../types/gallery';

export const useGalleryStore = defineStore('gallery', () => {
  // State
  const images = ref<GalleryImage[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const uploadProgress = ref<Record<string, UploadProgress>>({});

  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from the .env file

  /**
   * Fetch images with optional filters
   */
  const fetchImages = async (filters?: GalleryFilters) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Build query parameters if filters exist
      const params = new URLSearchParams();
      if (filters?.search) {
        params.append('search', filters.search);
      }
      if (filters?.tags) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters?.type) {
        params.append('type', filters.type);
      }
      if (filters?.sortBy) {
        params.append('sortBy', filters.sortBy);
      }
      if (filters?.sortOrder) {
        params.append('sortOrder', filters.sortOrder);
      }

      const url = `${apiUrl}/api/v1/media?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      images.value = data.data;
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch images';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Upload new image
   */
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
      const formData = new FormData();
      formData.append('file', file);
      
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`${apiUrl}/api/v1/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const image = await response.json();

      // Update progress status
      uploadProgress.value[uploadId].status = 'completed';
      
      // Add new image to list
      images.value.unshift(image);

      // Remove progress after delay
      setTimeout(() => {
        delete uploadProgress.value[uploadId];
      }, 2000);

      return image;
    } catch (e :any) {
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

  /**
   * Delete image
   */
  const deleteImage = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`${apiUrl}/api/v1/media/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      images.value = images.value.filter(img => img.id !== id);
    } catch (e: any) {
      error.value = e.message || 'Failed to delete image';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update image
   */
  const updateImage = async (id: string, updates: Partial<GalleryImage>) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`${apiUrl}/api/v1/media/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedImage = await response.json();
      const index = images.value.findIndex(img => img.id === id);
      if (index !== -1) {
        images.value[index] = updatedImage;
      }
      return updatedImage;
    } catch (e: any) {
      error.value = e.message || 'Failed to update image';
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
