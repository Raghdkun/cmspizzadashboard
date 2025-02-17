import { ref } from 'vue';
import { defineStore } from 'pinia';

// Define interfaces for each settings section
interface WebsiteMetadata {
  title: string;
  description: string;
  keywords: string;
  twitterHandle: string;
  analyticsId: string;
  mapsApiKey: string;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordExpiration: number;
}

interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number;
}

interface ContentSettings {
  enableComments: boolean;
  moderateComments: boolean;
  maxUploadSize: number;
}

interface PaymentSettings {
  currency: string;
  taxRate: number;
  minimumOrder: number;
}

export const useSettingsStore = defineStore('settings', () => {
  // State
  const metadata = ref<WebsiteMetadata>({
    title: 'PNE Pizza - Quality Pizza & Community Service',
    description: 'Your local pizza restaurant committed to serving the community with quality food and exceptional service.',
    keywords: 'pizza, community service, love kitchen, restaurant, local business',
    twitterHandle: '@PNEPizza',
    analyticsId: '',
    mapsApiKey: '',
  });

  const security = ref<SecuritySettings>({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiration: 90,
  });

  const backup = ref<BackupSettings>({
    autoBackup: true,
    backupFrequency: 'daily',
    retentionPeriod: 30,
  });

  const content = ref<ContentSettings>({
    enableComments: true,
    moderateComments: true,
    maxUploadSize: 10,
  });

  const payment = ref<PaymentSettings>({
    currency: 'USD',
    taxRate: 8.5,
    minimumOrder: 10.00,
  });

  // Actions
  const updateMetadata = async (updates: Partial<WebsiteMetadata>) => {
    validateMetadata(updates);
    metadata.value = { ...metadata.value, ...updates };
    await saveSettings();
  };

  const updateSecurity = async (updates: Partial<SecuritySettings>) => {
    validateSecurity(updates);
    security.value = { ...security.value, ...updates };
    await saveSettings();
  };

  const updateBackup = async (updates: Partial<BackupSettings>) => {
    validateBackup(updates);
    backup.value = { ...backup.value, ...updates };
    await saveSettings();
  };

  const updateContent = async (updates: Partial<ContentSettings>) => {
    validateContent(updates);
    content.value = { ...content.value, ...updates };
    await saveSettings();
  };

  const updatePayment = async (updates: Partial<PaymentSettings>) => {
    validatePayment(updates);
    payment.value = { ...payment.value, ...updates };
    await saveSettings();
  };

  // Helper function to save settings
  const saveSettings = async () => {
    const settings = {
      metadata: metadata.value,
      security: security.value,
      backup: backup.value,
      content: content.value,
      payment: payment.value,
    };
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  // Load settings
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        metadata.value = { ...metadata.value, ...settings.metadata };
        security.value = { ...security.value, ...settings.security };
        backup.value = { ...backup.value, ...settings.backup };
        content.value = { ...content.value, ...settings.content };
        payment.value = { ...payment.value, ...settings.payment };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Validation functions
  const validateMetadata = (data: Partial<WebsiteMetadata>) => {
    if (data.title && data.title.length > 60) {
      throw new Error('Title must be less than 60 characters');
    }
    if (data.description && data.description.length > 160) {
      throw new Error('Description must be less than 160 characters');
    }
  };

  const validateSecurity = (data: Partial<SecuritySettings>) => {
    if (data.sessionTimeout && (data.sessionTimeout < 5 || data.sessionTimeout > 120)) {
      throw new Error('Session timeout must be between 5 and 120 minutes');
    }
  };

  const validateBackup = (data: Partial<BackupSettings>) => {
    if (data.retentionPeriod && (data.retentionPeriod < 7 || data.retentionPeriod > 365)) {
      throw new Error('Retention period must be between 7 and 365 days');
    }
  };

  const validateContent = (data: Partial<ContentSettings>) => {
    if (data.maxUploadSize && (data.maxUploadSize < 1 || data.maxUploadSize > 50)) {
      throw new Error('Maximum upload size must be between 1 and 50 MB');
    }
  };

  const validatePayment = (data: Partial<PaymentSettings>) => {
    if (data.taxRate && (data.taxRate < 0 || data.taxRate > 100)) {
      throw new Error('Tax rate must be between 0 and 100%');
    }
    if (data.minimumOrder && data.minimumOrder < 0) {
      throw new Error('Minimum order amount cannot be negative');
    }
  };

  return {
    metadata,
    security,
    backup,
    content,
    payment,
    updateMetadata,
    updateSecurity,
    updateBackup,
    updateContent,
    updatePayment,
    loadSettings,
    validateMetadata,
    validateSecurity,
    validateBackup,
    validateContent,
    validatePayment,
  };
});