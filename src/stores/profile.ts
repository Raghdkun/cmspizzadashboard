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
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'user';
  phone?: string;
  title?: string;
  department?: string;
  location?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    passwordExpiresAt?: string;
    loginHistory: {
      date: string;
      ip: string;
      device: string;
    }[];
  };
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  title?: string;
  department?: string;
  location?: string;
  bio?: string;
  timezone?: string;
  language?: string;
  preferences?: Partial<UserProfile['preferences']>;
}

export interface UpdatePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateSecurityDTO {
  twoFactorEnabled?: boolean;
}

// Mock data
const mockProfile: UserProfile = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin',
  phone: '(555) 123-4567',
  title: 'System Administrator',
  department: 'IT',
  location: 'New York',
  bio: 'Experienced system administrator with a focus on security and performance optimization.',
  timezone: 'America/New_York',
  language: 'en',
  lastLogin: '2024-03-20T10:00:00Z',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2024-03-20T10:00:00Z',
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    theme: 'system',
    language: 'en',
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-01T00:00:00Z',
    passwordExpiresAt: '2024-04-01T00:00:00Z',
    loginHistory: [
      {
        date: '2024-03-20T10:00:00Z',
        ip: '192.168.1.1',
        device: 'Chrome on Windows',
      },
      {
        date: '2024-03-19T15:30:00Z',
        ip: '192.168.1.1',
        device: 'Mobile Safari on iPhone',
      },
    ],
  },
};

export const useProfileStore = defineStore('profile', () => {
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
      await new Promise(resolve => setTimeout(resolve, 500));
      profile.value = mockProfile;
    } catch (e) {
      error.value = 'Failed to fetch profile';
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
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!profile.value) throw new Error('Profile not loaded');

      profile.value = {
        ...profile.value,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      return profile.value;
    } catch (e) {
      error.value = 'Failed to update profile';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update password
   */
  const updatePassword = async (data: UpdatePasswordDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!profile.value) throw new Error('Profile not loaded');

      // In a real implementation, this would make an API call to update the password
      profile.value.security.lastPasswordChange = new Date().toISOString();
      profile.value.security.passwordExpiresAt = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

      return true;
    } catch (e) {
      error.value = 'Failed to update password';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update security settings
   */
  const updateSecurity = async (updates: UpdateSecurityDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!profile.value) throw new Error('Profile not loaded');

      profile.value.security = {
        ...profile.value.security,
        ...updates,
      };

      return profile.value.security;
    } catch (e) {
      error.value = 'Failed to update security settings';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update notification preferences
   */
  const updatePreferences = async (preferences: Partial<UserProfile['preferences']>) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!profile.value) throw new Error('Profile not loaded');

      profile.value.preferences = {
        ...profile.value.preferences,
        ...preferences,
      };

      return profile.value.preferences;
    } catch (e) {
      error.value = 'Failed to update preferences';
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
    updatePassword,
    updateSecurity,
    updatePreferences,
  };
});