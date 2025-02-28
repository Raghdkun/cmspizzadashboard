import { ref } from 'vue';
import { defineStore } from 'pinia';

const apiUrl = import.meta.env.VITE_BACKEND_URL; // Backend URL from .env

// ======================
// Type Definitions
// ======================

export interface Contact {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
  type: 'general' | 'support' | 'feedback' | 'partnership';
  receivedDate: string;
  lastUpdated?: string;
  response?: {
    text: string;
    date: string;
    respondentName: string;
  };
  notes?: string;
  timeline?: {
    date: string;
    action: string;
    notes?: string;
    user?: string;
  }[];
}

export interface CreateContactDTO {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'feedback' | 'partnership';
  priority?: 'high' | 'medium' | 'low';
}

export interface UpdateContactDTO extends Partial<CreateContactDTO> {
  status?: 'pending' | 'completed';
  response?: {
    text: string;
    respondentName: string;
  };
  notes?: string;
}

export interface ContactsResponse {
  data: Contact[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface ContactFilters {
  search?: string;
  status?: 'pending' | 'completed';
  priority?: 'high' | 'medium' | 'low';
  type?: 'general' | 'support' | 'feedback' | 'partnership';
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ======================
// Contacts Store
// ======================

export const useContactsStore = defineStore('contacts', () => {
  // State
  const contacts = ref<Contact[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  // Getters
  const newContacts = () => contacts.value.filter(c => c.status === 'pending');
  const inProgressContacts = () => contacts.value.filter(c => c.status === 'completed');

  // Actions

  /**
   * Fetch contacts using the token.
   * Endpoint: GET /api/v1/contacts
   */
  const fetchContacts = async (filters?: ContactFilters) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Build query parameters if filters exist
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, String(value));
        });
      }
      const url = `${apiUrl}/api/v1/contacts?${params.toString()}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Assume API returns an array of contacts
      const data: Contact[] = await response.json();
      contacts.value = data;
      meta.value = {
        total: data.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(data.length / (filters?.perPage || 10)),
      };
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch contacts';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add new contact.
   * Endpoint: POST /api/v1/contacts
   */
  const addContact = async (contactData: CreateContactDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const payload = { ...contactData };
      const response = await fetch(`${apiUrl}/api/v1/contacts`, {
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
      const data: Contact = await response.json();
      contacts.value.push(data);
      return data;
    } catch (e: any) {
      error.value = e.message || 'Failed to add contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing contact.
   * Endpoint: PATCH /api/v1/contacts/:id
   */
  const updateContact = async (id: string, updates: UpdateContactDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      // Use PUT if your API expects a full update, or PATCH for partial update.
      const response = await fetch(`${apiUrl}/api/v1/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updated: Contact = await response.json();
      console.log(`response ${response.body}`)
      const index = contacts.value.findIndex(c => c.id === id);
      if (index !== -1) {
        contacts.value[index] = updated;
      }
      return updated;
    } catch (e: any) {
      error.value = e.message || 'Failed to update contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete contact.
   * Endpoint: DELETE /api/v1/contacts/:id
   */
  const deleteContact = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`${apiUrl}/api/v1/contacts/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      contacts.value = contacts.value.filter(c => c.id !== id);
    } catch (e: any) {
      error.value = e.message || 'Failed to delete contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export contacts data.
   * Endpoint: GET /api/v1/contacts/export?format=csv|xlsx
   */
  const exportContacts = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const url = `${apiUrl}/api/v1/contacts/export?format=${format}`;
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
      link.setAttribute('download', `contacts.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e: any) {
      error.value = e.message || 'Failed to export contacts';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    contacts,
    loading,
    error,
    meta,
    newContacts,
    inProgressContacts,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    exportContacts,
  };
});
