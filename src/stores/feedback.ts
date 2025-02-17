import { ref } from 'vue';
import { defineStore } from 'pinia';

// ======================
// Type Definitions
// ======================

/**
 * Represents the raw API response for a feedback.
 */
export interface FeedbackAPIResponse {
  id: number;
  customer_name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'Published' | 'Pending' | 'Archived';
  created_at: string;
  updated_at: string;
}

/**
 * Represents the local shape of a feedback item.
 */
export interface Feedback {
  id: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  status: 'Published' | 'Pending' | 'Archived';
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating new feedback.
 */
export interface CreateFeedbackDTO {
  customerName: string;
  email: string;
  rating: number;
  comment: string;
}

/**
 * DTO for updating existing feedback.
 */
export interface UpdateFeedbackDTO extends Partial<CreateFeedbackDTO> {
  status?: 'Published' | 'Pending' | 'Archived';
}

/**
 * Response shape when fetching multiple feedback items.
 */
export interface FeedbackResponse {
  data: Feedback[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

/**
 * Filters for fetching feedback.
 */
export interface FeedbackFilters {
  search?: string;
  status?: 'Published' | 'Pending' | 'Archived';
  rating?: number;
  location?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ======================
// Feedback Store
// ======================

export const useFeedbackStore = defineStore('feedback', () => {
  // State
  const feedback = ref<Feedback[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  // Getters
  const publishedFeedback = () =>
    feedback.value.filter(f => f.status === 'Published');

  const averageRating = () => {
    const total = feedback.value.reduce((sum, f) => sum + f.rating, 0);
    return feedback.value.length ? total / feedback.value.length : 0;
  };

  // Helper: Map API response to local Feedback type
  const mapFeedback = (apiFeedback: FeedbackAPIResponse): Feedback => ({
    id: String(apiFeedback.id),
    customerName: apiFeedback.customer_name,
    email: apiFeedback.email,
    rating: apiFeedback.rating,
    comment: apiFeedback.comment,
    status: apiFeedback.status as 'Published' | 'Pending' | 'Archived',
    createdAt: apiFeedback.created_at,
    updatedAt: apiFeedback.updated_at,
  });

  // ======================
  // Actions using fetch
  // ======================

  /**
   * Fetch feedback with optional filters.
   * API endpoint: GET /api/v1/feedback/admin
   */
  const fetchFeedback = async (filters?: FeedbackFilters) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Build query parameters from filters, if provided
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value));
          }
        });
      }
      const url = `/api/v1/feedback/admin?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FeedbackAPIResponse[] = await response.json();
      const mappedFeedback = data.map(mapFeedback);
      feedback.value = mappedFeedback;
      meta.value = {
        total: mappedFeedback.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(mappedFeedback.length / (filters?.perPage || 10)),
      };
    } catch (e: any) {
      error.value = 'Failed to fetch feedback';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add new feedback.
   * API endpoint: POST /api/v1/feedback/admin
   */
  const addFeedback = async (feedbackData: CreateFeedbackDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Prepare payload in API format
      const payload = {
        customer_name: feedbackData.customerName,
        email: feedbackData.email,
        rating: feedbackData.rating,
        comment: feedbackData.comment,
      };

      const response = await fetch('/api/v1/feedback/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FeedbackAPIResponse = await response.json();
      const newFeedback = mapFeedback(data);
      feedback.value.push(newFeedback);
      return newFeedback;
    } catch (e: any) {
      error.value = 'Failed to add feedback';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing feedback.
   * API endpoint: PATCH /api/v1/feedback/admin/:id
   */
  const updateFeedback = async (id: string, updates: UpdateFeedbackDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Convert updates to API format
      const payload: Partial<FeedbackAPIResponse> = {};
      if (updates.customerName !== undefined)
        payload.customer_name = updates.customerName;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.rating !== undefined) payload.rating = updates.rating;
      if (updates.comment !== undefined) payload.comment = updates.comment;
      if (updates.status !== undefined) {
        // Use the exact status from the UI: "Published" | "Pending" | "Archived"
        payload.status = updates.status;
      }

      // Use PATCH (or PUT if your API specifically requires PUT)
      const response = await fetch(`/api/v1/feedback/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FeedbackAPIResponse = await response.json();
      const updatedFeedback = mapFeedback(data);
      const index = feedback.value.findIndex(f => f.id === id);
      if (index !== -1) {
        feedback.value[index] = updatedFeedback;
      }
      return updatedFeedback;
    } catch (e: any) {
      error.value = 'Failed to update feedback';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete feedback.
   * API endpoint: DELETE /api/v1/feedback/admin/:id
   */
  const deleteFeedback = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`/api/v1/feedback/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      feedback.value = feedback.value.filter(f => f.id !== id);
    } catch (e: any) {
      error.value = 'Failed to delete feedback';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update feedback helpfulness.
   * API endpoint: POST /api/v1/feedback/admin/:id/helpful
   */
  const updateHelpfulness = async (id: string, isHelpful: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const payload = { isHelpful };
      const response = await fetch(`/api/v1/feedback/admin/${id}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: FeedbackAPIResponse = await response.json();
      const updatedFeedback = mapFeedback(data);
      const index = feedback.value.findIndex(f => f.id === id);
      if (index !== -1) {
        feedback.value[index] = updatedFeedback;
      }
      return updatedFeedback;
    } catch (e: any) {
      error.value = 'Failed to update helpfulness';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export feedback data.
   * API endpoint: GET /api/v1/feedback/admin/export
   */
  const exportFeedback = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const url = `/api/v1/feedback/admin/export?format=${format}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `feedback.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      error.value = 'Failed to export feedback';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    feedback,
    loading,
    error,
    meta,

    // Getters
    publishedFeedback,
    averageRating,

    // Actions
    fetchFeedback,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    updateHelpfulness,
    exportFeedback,
  };
});
