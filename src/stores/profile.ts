import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Define the API User interface
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  image: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  image?: File | null;
}

export const useProfileStore = defineStore('profile', () => {
  const authStore = useAuthStore();
  
  // State
  const profile = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  /**
   * Fetch user profile
   */
  const fetchProfile = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      const data = await response.json();
      profile.value = data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch profile';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: UpdateProfileDTO) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const formData = new FormData();
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await fetch(`${apiUrl}/api/v1/manageuser/${profile.value?.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      profile.value = data.user;
      return profile.value;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update profile';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    profile,
    loading,
    error,
    
    // Actions
    fetchProfile,
    updateProfile,
  };
});