import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// Create an axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'in_progress' | 'resolved' | 'archived';
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
  status?: 'new' | 'in_progress' | 'resolved' | 'archived';
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
  status?: 'new' | 'in_progress' | 'resolved' | 'archived';
  priority?: 'high' | 'medium' | 'low';
  type?: 'general' | 'support' | 'feedback' | 'partnership';
  startDate?: string;
  endDate?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mock data
const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    subject: 'Question about catering services',
    message: 'I would like to inquire about your catering services for a corporate event next month.',
    status: 'new',
    priority: 'high',
    type: 'general',
    receivedDate: '2024-03-19',
    lastUpdated: '2024-03-19T10:00:00Z',
    timeline: [
      {
        date: '2024-03-19T10:00:00Z',
        action: 'received',
        notes: 'New contact form submission',
      },
    ],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '(555) 987-6543',
    subject: 'Website feedback',
    message: 'I love your new website design, but I noticed a few broken links in the menu section.',
    status: 'in_progress',
    priority: 'medium',
    type: 'feedback',
    receivedDate: '2024-03-18',
    lastUpdated: '2024-03-19T09:30:00Z',
    response: {
      text: 'Thank you for bringing this to our attention. We are working on fixing the broken links.',
      date: '2024-03-19T09:30:00Z',
      respondentName: 'Admin',
    },
    timeline: [
      {
        date: '2024-03-18T15:00:00Z',
        action: 'received',
        notes: 'New contact form submission',
      },
      {
        date: '2024-03-19T09:30:00Z',
        action: 'response_added',
        notes: 'Response added to contact',
        user: 'Admin',
      },
    ],
  },
];

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
  const newContacts = () => contacts.value.filter(contact => contact.status === 'new');
  const inProgressContacts = () => contacts.value.filter(contact => contact.status === 'in_progress');
  const resolvedContacts = () => contacts.value.filter(contact => contact.status === 'resolved');
  const highPriorityContacts = () => contacts.value.filter(contact => contact.priority === 'high');

  // Actions
  /**
   * Fetch contacts with optional filters
   */
  const fetchContacts = async (filters?: ContactFilters) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      let filteredData = [...mockContacts];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(contact => 
          contact.name.toLowerCase().includes(searchLower) ||
          contact.email.toLowerCase().includes(searchLower) ||
          contact.subject.toLowerCase().includes(searchLower) ||
          contact.message.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.status) {
        filteredData = filteredData.filter(contact => 
          contact.status === filters.status
        );
      }

      if (filters?.priority) {
        filteredData = filteredData.filter(contact => 
          contact.priority === filters.priority
        );
      }

      if (filters?.type) {
        filteredData = filteredData.filter(contact => 
          contact.type === filters.type
        );
      }

      if (filters?.startDate) {
        filteredData = filteredData.filter(contact => 
          contact.receivedDate >= filters.startDate!
        );
      }

      if (filters?.endDate) {
        filteredData = filteredData.filter(contact => 
          contact.receivedDate <= filters.endDate!
        );
      }

      contacts.value = filteredData;
      meta.value = {
        total: filteredData.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(filteredData.length / (filters?.perPage || 10)),
      };
    } catch (e) {
      error.value = 'Failed to fetch contacts';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add new contact
   */
  const addContact = async (contact: CreateContactDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newContact: Contact = {
        ...contact,
        id: Math.random().toString(36).substr(2, 9),
        status: 'new',
        priority: contact.priority || 'medium',
        receivedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString(),
        timeline: [
          {
            date: new Date().toISOString(),
            action: 'received',
            notes: 'New contact form submission',
          },
        ],
      };
      contacts.value.push(newContact);
      return newContact;
    } catch (e) {
      error.value = 'Failed to add contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing contact
   */
  const updateContact = async (id: string, updates: UpdateContactDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = contacts.value.findIndex(contact => contact.id === id);
      if (index === -1) throw new Error('Contact not found');
      
      const currentContact = contacts.value[index];
      const updatedContact = {
        ...currentContact,
        ...updates,
        lastUpdated: new Date().toISOString(),
      };

      // Add status change to timeline if status is updated
      if (updates.status && updates.status !== currentContact.status) {
        updatedContact.timeline = [
          ...(currentContact.timeline || []),
          {
            date: new Date().toISOString(),
            action: 'status_changed',
            notes: `Status updated to ${updates.status}`,
          },
        ];
      }

      // Add response to timeline if provided
      if (updates.response) {
        updatedContact.response = {
          ...updates.response,
          date: new Date().toISOString(),
        };
        updatedContact.timeline = [
          ...(currentContact.timeline || []),
          {
            date: new Date().toISOString(),
            action: 'response_added',
            notes: 'Response added to contact',
            user: updates.response.respondentName,
          },
        ];
      }
      
      contacts.value[index] = updatedContact;
      return updatedContact;
    } catch (e) {
      error.value = 'Failed to update contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete contact
   */
  const deleteContact = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      contacts.value = contacts.value.filter(contact => contact.id !== id);
    } catch (e) {
      error.value = 'Failed to delete contact';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export contacts data
   */
  const exportContacts = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock CSV data
      const csvContent = contacts.value
        .map(contact => 
          `${contact.name},${contact.email},${contact.phone},${contact.subject},${contact.status},${contact.priority},${contact.receivedDate}`
        )
        .join('\n');
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      error.value = 'Failed to export contacts';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    contacts,
    loading,
    error,
    meta,
    
    // Getters
    newContacts,
    inProgressContacts,
    resolvedContacts,
    highPriorityContacts,
    
    // Actions
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    exportContacts,
  };
});