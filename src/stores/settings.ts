import { ref } from 'vue';
import { defineStore } from 'pinia';

// Define types for website settings and API responses
export interface WebsiteSettings {
  website_title: string;
  description: string;
  keywords: string;
  google_analytics_id: string;
  Google_Maps_API_Key: string;
  logo_image: string;
  instagram_url: string;
  facebook_url: string;
}

export interface SettingsResponse {
  success: boolean;
  data: WebsiteSettings;
}

export const useSettingsStore = defineStore('settings', () => {
  // Start with empty settings since we will fetch the data from the API
  const settings = ref<WebsiteSettings>({
    website_title: '',
    description: '',
    keywords: '',
    google_analytics_id: '',
    Google_Maps_API_Key: '',
    logo_image: '',
    instagram_url: '',
    facebook_url: ''
  });

  // Loading state for spinner functionality
  const loading = ref<boolean>(false);

  // Validate settings before update
  // Update the validateSettings function to include logo validation
  const validateSettings = (data: WebsiteSettings) => {
    if (data.website_title && data.website_title.length > 60) {
      throw new Error('Website title must be less than 60 characters');
    }
    if (data.description && data.description.length > 160) {
      throw new Error('Description must be less than 160 characters');
    }
    if (data.logo_image && !isValidUrl(data.logo_image)) {
      throw new Error('Logo image must be a valid URL');
    }
  };
  
  // Add this helper function after the validateSettings function
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Fetch settings from the API
  const fetchSettings = async () => {
    loading.value = true;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/v1/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: SettingsResponse = await response.json();
        if (data.success && data.data) {
          settings.value = data.data;
        } else {
          throw new Error('Failed to load settings');
        }
      } else {
        // Get some of the HTML for debugging purposes
        const text = await response.text();
        throw new Error('Invalid JSON response: ' + text.substring(0, 100));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update settings via API PUT method
  const updateSettings = async () => {
    loading.value = true;
    try {
      validateSettings(settings.value);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      
      // Updated payload to include all fields
      const payload = {
        website_title: settings.value.website_title,
        description: settings.value.description,
        keywords: settings.value.keywords,
        google_analytics_id: settings.value.google_analytics_id,
        Google_Maps_API_Key: settings.value.Google_Maps_API_Key, // Fixed casing to match interface
        logo_image: settings.value.logo_image,
        instagram_url: settings.value.instagram_url,
        facebook_url: settings.value.facebook_url
      };
      
      const response = await fetch(`${apiUrl}/api/v1/settings/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      // Ensure we have a JSON response back
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data: SettingsResponse = await response.json();
        if (!data.success) {
          throw new Error('Failed to update settings');
        }
      } else {
        const text = await response.text();
        throw new Error('Invalid JSON response: ' + text.substring(0, 100));
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    settings,
    loading,
    validateSettings,
    fetchSettings,
    updateSettings,
  };
});
