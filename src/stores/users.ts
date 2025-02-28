import { ref } from 'vue';
import { defineStore } from 'pinia';
const apiUrl = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from the .env file

// Define User interface matching the API response
export interface User {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string; // e.g., "Admin", "Manager", "User"
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

// Define interface for paginated response
export interface PaginatedUsers {
  current_page: number;
  data: User[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export const useUsersStore = defineStore('users', () => {
  // State
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  /**
   * Fetch users with optional filters.
   */
  const fetchUsers = async (filters?: { search?: string; role?: string; status?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      let url = `${apiUrl}/api/v1/manageuser`;
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.search) queryParams.append("search", filters.search);
        if (filters.role) queryParams.append("role", filters.role);
        if (filters.status) queryParams.append("status", filters.status);
        url += "?" + queryParams.toString();
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: PaginatedUsers = await response.json();
        users.value = data.data;
        meta.value = {
          total: data.total,
          page: data.current_page,
          perPage: data.per_page,
          totalPages: data.last_page,
        };
      } else {
        const text = await response.text();
        throw new Error('Invalid JSON response: ' + text.substring(0, 100));
      }
    } catch (e) {
      error.value = 'Failed to fetch users';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add new user.
   */
  const addUser = async (formData: FormData) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/manageuser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add user');
      }

      const data = await response.json();
      users.value.push(data.user);
      return data.user;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to add user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing user.
   */
  const updateUser = async (id: number, formData: FormData) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');
  
      const response = await fetch(`${apiUrl}/api/v1/manageuser/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          // Don't set Content-Type header, let the browser set it with the boundary
        },
        body: formData
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }
  
      const data = await response.json();
      const index = users.value.findIndex(user => user.id === id);
      if (index !== -1) {
        users.value[index] = data.user;
      }
      return data.user;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete user.
   */
  const deleteUser = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/manageuser/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error('Failed to delete user: ' + text.substring(0, 100));
      }
      users.value = users.value.filter(user => user.id !== id);
    } catch (e) {
      error.value = 'Failed to delete user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export users data as CSV.
   */
  const exportUsers = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      // Create CSV content from the users array.
      const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login'];
      // For this example, we'll assume "Last Login" is derived from updated_at
      const rows = users.value.map(user => [
        user.name,
        user.email,
        user.role,
        user.email_verified_at ? 'Active' : 'Inactive',
        user.updated_at || '',
      ]);
      const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      error.value = 'Failed to export users';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    users,
    loading,
    error,
    meta,
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    exportUsers,
  };
});
