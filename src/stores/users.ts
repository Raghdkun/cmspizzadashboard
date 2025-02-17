import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

// Define User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  avatarUrl?: string;
}

// Create API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

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

  // Mock data
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '03/19/2024',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '03/18/2024',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.w@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '03/15/2024',
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily.b@example.com',
      role: 'manager',
      status: 'active',
      lastLogin: '03/19/2024',
    },
    {
      id: '5',
      name: 'David Lee',
      email: 'david.l@example.com',
      role: 'user',
      status: 'active',
      lastLogin: '03/17/2024',
    },
  ];

  /**
   * Fetch users with optional filters
   */
  const fetchUsers = async (filters?: { search?: string; role?: string; status?: string }) => {
    loading.value = true;
    error.value = null;
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Filter mock data
      let filteredUsers = [...mockUsers];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower) ||
          user.role.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters?.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      users.value = filteredUsers;
      meta.value = {
        total: filteredUsers.length,
        page: 1,
        perPage: 10,
        totalPages: Math.ceil(filteredUsers.length / 10),
      };
    } catch (e) {
      error.value = 'Failed to fetch users';
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add new user
   */
  const addUser = async (user: Omit<User, 'id'>) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newUser = {
        ...user,
        id: Math.random().toString(36).substr(2, 9),
      };
      users.value.push(newUser);
      return newUser;
    } catch (e) {
      error.value = 'Failed to add user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update existing user
   */
  const updateUser = async (id: string, updates: Partial<User>) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = users.value.findIndex(user => user.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updates };
        return users.value[index];
      }
      throw new Error('User not found');
    } catch (e) {
      error.value = 'Failed to update user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete user
   */
  const deleteUser = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      users.value = users.value.filter(user => user.id !== id);
    } catch (e) {
      error.value = 'Failed to delete user';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export users data
   */
  const exportUsers = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create CSV content
      const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login'];
      const rows = users.value.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.lastLogin,
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');
      
      // Create and trigger download
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
    // State
    users,
    loading,
    error,
    meta,
    
    // Actions
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
    exportUsers,
  };
});