<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import FormGroup from '../components/ui/FormGroup.vue';
import FormSection from '../components/ui/FormSection.vue';
import Input from '../components/ui/Input.vue';
import Select from '../components/ui/Select.vue';
import Switch from '../components/ui/Switch.vue';
import Button from '../components/ui/Button.vue';

const settingsStore = useSettingsStore();
const activeTab = ref('metadata');
const error = ref('');
const success = ref('');

// Load settings when component is mounted
onMounted(() => {
  try {
    settingsStore.loadSettings();
  } catch (e) {
    error.value = 'Failed to load settings';
    console.error(e);
  }
});

// Save changes for a specific section
const saveChanges = async (section: string) => {
  try {
    error.value = '';
    success.value = '';

    // Validate data before saving
    switch (section) {
      case 'metadata':
        settingsStore.validateMetadata(settingsStore.metadata);
        await settingsStore.updateMetadata(settingsStore.metadata);
        break;
      case 'security':
        settingsStore.validateSecurity(settingsStore.security);
        await settingsStore.updateSecurity(settingsStore.security);
        break;
      case 'backup':
        settingsStore.validateBackup(settingsStore.backup);
        await settingsStore.updateBackup(settingsStore.backup);
        break;
      case 'content':
        settingsStore.validateContent(settingsStore.content);
        await settingsStore.updateContent(settingsStore.content);
        break;
      case 'payment':
        settingsStore.validatePayment(settingsStore.payment);
        await settingsStore.updatePayment(settingsStore.payment);
        break;
    }

    success.value = 'Settings saved successfully';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e) {
    error.value = e.message || 'Failed to save settings';
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
        <Cog6ToothIcon class="w-8 h-8 text-primary-600" />
        Settings
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Manage your website settings and configurations
      </p>
    </div>

    <!-- Settings Navigation -->
    <div class="mb-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <nav class="flex overflow-x-auto">
        <button
          v-for="tab in ['metadata', 'security', 'backup', 'content', 'payment']"
          :key="tab"
          @click="activeTab = tab"
          class="px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors"
          :class="[
            activeTab === tab
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
          ]"
        >
          {{ tab.charAt(0).toUpperCase() + tab.slice(1) }}
        </button>
      </nav>
    </div>

    <!-- Settings Content -->
    <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <!-- Metadata Settings -->
      <div v-if="activeTab === 'metadata'" class="divide-y divide-neutral-200 dark:divide-neutral-700">
        <div class="p-6">
          <FormSection title="Website Information" description="Basic information about your website">
            <FormGroup label="Website Title" required>
              <Input
                v-model="settingsStore.metadata.title"
                placeholder="Enter website title"
                required
              />
            </FormGroup>

            <FormGroup label="Description" required>
              <Input
                v-model="settingsStore.metadata.description"
                type="textarea"
                placeholder="Enter website description"
                required
              />
              <template #hint>
                Brief description of your website (max 160 characters)
              </template>
            </FormGroup>

            <FormGroup label="Keywords">
              <Input
                v-model="settingsStore.metadata.keywords"
                placeholder="Enter keywords separated by commas"
              />
              <template #hint>
                Keywords help with SEO (e.g., pizza, restaurant, delivery)
              </template>
            </FormGroup>
          </FormSection>
        </div>

        <div class="p-6">
          <FormSection title="Social Media & Analytics" description="Social media and tracking configurations">
            <FormGroup label="Twitter Handle">
              <Input
                v-model="settingsStore.metadata.twitterHandle"
                placeholder="@yourusername"
              />
            </FormGroup>

            <FormGroup label="Google Analytics ID">
              <Input
                v-model="settingsStore.metadata.analyticsId"
                placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
              />
            </FormGroup>

            <FormGroup label="Google Maps API Key">
              <Input
                v-model="settingsStore.metadata.mapsApiKey"
                type="password"
                placeholder="Enter your Google Maps API key"
              />
              <template #hint>
                Used for location features and store map displays
              </template>
            </FormGroup>
          </FormSection>
        </div>
      </div>

      <!-- Security Settings -->
      <div v-if="activeTab === 'security'" class="p-6">
        <FormSection title="Authentication" description="Security and authentication settings">
          <Switch
            v-model="settingsStore.security.twoFactorAuth"
            label="Two-Factor Authentication"
            description="Require 2FA for all admin accounts"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormGroup label="Session Timeout (minutes)" required>
              <Input
                v-model.number="settingsStore.security.sessionTimeout"
                type="number"
                min="5"
                max="120"
                required
              />
              <template #hint>
                Time before users are automatically logged out
              </template>
            </FormGroup>

            <FormGroup label="Password Expiration (days)" required>
              <Input
                v-model.number="settingsStore.security.passwordExpiration"
                type="number"
                min="30"
                max="365"
                required
              />
              <template #hint>
                Days before password change is required
              </template>
            </FormGroup>
          </div>
        </FormSection>
      </div>

      <!-- Backup Settings -->
      <div v-if="activeTab === 'backup'" class="p-6">
        <FormSection title="Backup Configuration" description="Data backup and retention settings">
          <Switch
            v-model="settingsStore.backup.autoBackup"
            label="Automatic Backup"
            description="Enable automated backups of your data"
          />

          <FormGroup label="Backup Frequency" required>
            <Select v-model="settingsStore.backup.backupFrequency">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </Select>
          </FormGroup>

          <FormGroup label="Retention Period (days)" required>
            <Input
              v-model.number="settingsStore.backup.retentionPeriod"
              type="number"
              min="7"
              max="365"
              required
            />
            <template #hint>
              Number of days to keep backup files
            </template>
          </FormGroup>
        </FormSection>
      </div>

      <!-- Content Settings -->
      <div v-if="activeTab === 'content'" class="p-6">
        <FormSection title="Content Management" description="Content and media settings">
          <Switch
            v-model="settingsStore.content.enableComments"
            label="Enable Comments"
            description="Allow users to leave comments"
          />

          <Switch
            v-model="settingsStore.content.moderateComments"
            label="Moderate Comments"
            description="Review comments before publishing"
          />

          <FormGroup label="Maximum Upload Size (MB)" required>
            <Input
              v-model.number="settingsStore.content.maxUploadSize"
              type="number"
              min="1"
              max="50"
              required
            />
            <template #hint>
              Maximum file size for uploads in megabytes
            </template>
          </FormGroup>
        </FormSection>
      </div>

      <!-- Payment Settings -->
      <div v-if="activeTab === 'payment'" class="p-6">
        <FormSection title="Payment Configuration" description="Payment and currency settings">
          <FormGroup label="Currency" required>
            <Select v-model="settingsStore.payment.currency">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </Select>
          </FormGroup>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <FormGroup label="Tax Rate (%)" required>
              <Input
                v-model.number="settingsStore.payment.taxRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                required
              />
            </FormGroup>

            <FormGroup label="Minimum Order Amount" required>
              <Input
                v-model.number="settingsStore.payment.minimumOrder"
                type="number"
                min="0"
                step="0.01"
                required
              />
            </FormGroup>
          </div>
        </FormSection>
      </div>

      <!-- Footer with save button -->
      <div class="p-6 border-t border-neutral-200 dark:border-neutral-700">
        <div class="flex items-center justify-between">
          <div>
            <p v-if="error" class="text-sm text-red-600 dark:text-red-400">
              {{ error }}
            </p>
            <p v-if="success" class="text-sm text-green-600 dark:text-green-400">
              {{ success }}
            </p>
          </div>
          <Button
            @click="saveChanges(activeTab)"
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>