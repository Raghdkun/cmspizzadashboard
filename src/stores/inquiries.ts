import { ref } from 'vue';
import { defineStore } from 'pinia';

// ======================
// Type Definitions
// ======================

/**
 * Represents the raw API response for an inquiry.
 */
export interface InquiryAPIResponse {
  id: number;
  name: string;
  info: string;
  email: string;
  phone: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Closed';
  created_at: string;
  updated_at: string;
}

/**
 * Represents the local shape of an inquiry item.
 */
export interface Inquiry {
  id: string;
  name: string;
  info: string;
  email: string;
  phone: string;
  status: 'New' | 'In Review' | 'Contacted' | 'Closed';
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new inquiry.
 */
export interface CreateInquiryDTO {
  name: string;
  info: string;
  email: string;
  phone: string;
}

/**
 * DTO for updating an inquiry.
 */
export interface UpdateInquiryDTO extends Partial<CreateInquiryDTO> {
  status?: 'New' | 'In Review' | 'Contacted' | 'Closed';
}

/**
 * Response shape when fetching multiple inquiries.
 */
export interface InquiriesResponse {
  data: Inquiry[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

/**
 * Filters for fetching inquiries.
 */
export interface InquiryFilters {
  search?: string;
  status?: 'New' | 'In Review' | 'Contacted' | 'Closed';
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ======================
// Inquiries Store
// ======================

export const useInquiriesStore = defineStore('inquiries', () => {
  // State
  const inquiries = ref<Inquiry[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  // Getters (example filters)
  const newInquiries = () =>
    inquiries.value.filter((inq) => inq.status === 'New');
  const inReviewInquiries = () =>
    inquiries.value.filter((inq) => inq.status === 'In Review');
  const contactedInquiries = () =>
    inquiries.value.filter((inq) => inq.status === 'Contacted');
  const closedInquiries = () =>
    inquiries.value.filter((inq) => inq.status === 'Closed');

  // Helper: Map API response to local Inquiry type
  const mapInquiry = (apiInquiry: InquiryAPIResponse): Inquiry => ({
    id: String(apiInquiry.id),
    name: apiInquiry.name,
    info: apiInquiry.info,
    email: apiInquiry.email,
    phone: apiInquiry.phone,
    status: apiInquiry.status, // Already one of the allowed values
    createdAt: apiInquiry.created_at,
    updatedAt: apiInquiry.updated_at,
  });

  /**
   * Fetch inquiries with optional filters.
   * API endpoint: GET /api/v1/inquiries
   */
  const fetchInquiries = async (filters?: InquiryFilters) => {
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
      const url = `/api/v1/acquisitions?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: InquiryAPIResponse[] = await response.json();
      const mapped = data.map(mapInquiry);
      inquiries.value = mapped;
      meta.value = {
        total: mapped.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(mapped.length / (filters?.perPage || 10)),
      };
    } catch (e: any) {
      error.value = 'Failed to fetch inquiries';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add a new inquiry.
   * API endpoint: POST /api/v1/inquiries
   */
  const addInquiry = async (inquiryData: CreateInquiryDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const payload = {
        name: inquiryData.name,
        info: inquiryData.info,
        email: inquiryData.email,
        phone: inquiryData.phone,
      };

      const response = await fetch('/api/v1/acquisitions', {
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
      const data: InquiryAPIResponse = await response.json();
      const newInquiry = mapInquiry(data);
      inquiries.value.push(newInquiry);
      return newInquiry;
    } catch (e: any) {
      error.value = 'Failed to add inquiry';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing inquiry.
   * API endpoint: PATCH /api/v1/inquiries/:id
   */
  const updateInquiry = async (id: string, updates: UpdateInquiryDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Build payload in API format
      const payload: Partial<InquiryAPIResponse> = {};
      if (updates.name !== undefined) payload.name = updates.name;
      if (updates.info !== undefined) payload.info = updates.info;
      if (updates.email !== undefined) payload.email = updates.email;
      if (updates.phone !== undefined) payload.phone = updates.phone;
      if (updates.status !== undefined) payload.status = updates.status;

      const response = await fetch(`/api/v1/acquisitions/${id}`, {
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
      const data: InquiryAPIResponse = await response.json();
      const updatedInquiry = mapInquiry(data);
      const index = inquiries.value.findIndex((inq) => inq.id === id);
      if (index !== -1) {
        inquiries.value[index] = updatedInquiry;
      }
      return updatedInquiry;
    } catch (e: any) {
      error.value = 'Failed to update inquiry';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete an inquiry.
   * API endpoint: DELETE /api/v1/inquiries/:id
   */
  const deleteInquiry = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`/api/v1/acquisitions/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      inquiries.value = inquiries.value.filter((inq) => inq.id !== id);
    } catch (e: any) {
      error.value = 'Failed to delete inquiry';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Bulk update inquiry status.
   * API endpoint: PATCH /api/v1/inquiries/bulk-status
   */
  const bulkUpdateStatus = async (ids: string[], status: InquiryAPIResponse['status']) => {
    loading.value = true;
    error.value = null;
    try {
      // For simplicity, we simulate a bulk update locally.
      inquiries.value = inquiries.value.map((inq) => {
        if (ids.includes(inq.id)) {
          return {
            ...inq,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return inq;
      });
    } catch (e: any) {
      error.value = 'Failed to update inquiries status';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export inquiries data.
   * API endpoint: GET /api/v1/inquiries/export
   */
  const exportInquiries = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');
      const url = `/api/v1/acquisitions/export?format=${format}`;
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
      link.setAttribute('download', `inquiries.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      error.value = 'Failed to export inquiries';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    inquiries,
    loading,
    error,
    meta,
    newInquiries,
    inReviewInquiries,
    contactedInquiries,
    closedInquiries,
    bulkUpdateStatus,
    fetchInquiries,
    addInquiry,
    updateInquiry,
    deleteInquiry,
    exportInquiries,
  };
});
