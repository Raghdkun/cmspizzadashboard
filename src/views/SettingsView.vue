<script setup lang="ts">
// Add GalleryPicker to imports
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settings';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';
import FormGroup from '../components/ui/FormGroup.vue';
import FormSection from '../components/ui/FormSection.vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';
import GalleryPicker from '../components/GalleryPicker.vue';

// Add state for gallery picker
const showGalleryPicker = ref(false);

// Add handler for image selection
const handleImageSelect = (url: string) => {
  settingsStore.settings.logo_image = url;
  showGalleryPicker.value = false;
};

const settingsStore = useSettingsStore();
const error = ref('');
const success = ref('');

// Load settings when component is mounted
onMounted(async () => {
  try {
    await settingsStore.fetchSettings();
  } catch (e) {
    error.value = 'Failed to load settings';
  }
});

// Save changes by updating settings via the store
const saveChanges = async () => {
  try {
    error.value = '';
    success.value = '';
    await settingsStore.updateSettings();
    success.value = 'Settings saved successfully';
    setTimeout(() => (success.value = ''), 3000);
  } catch (e: any) {
    error.value = e.message || 'Failed to update settings';
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
        <Cog6ToothIcon class="w-8 h-8 text-primary-600" />
        Website Settings
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Manage your website settings and configurations
      </p>
    </div>

    <!-- Spinner: displays while loading settings or saving changes -->
    <div v-if="settingsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading settings...</p>
    </div>
    <!-- Settings Form -->
    <div v-else class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
        <!-- Website Information Section -->
        <div class="p-6">
          <FormSection title="Website Information" description="Basic information about your website">
            <FormGroup label="Website Title" required>
              <Input
                v-model="settingsStore.settings.website_title"
                placeholder="Enter website title"
                required
              />
            </FormGroup>
            <FormGroup label="Description" required>
              <Input
                v-model="settingsStore.settings.description"
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
                v-model="settingsStore.settings.keywords"
                placeholder="Enter keywords separated by commas"
              />
              <template #hint>
                Keywords help with SEO (e.g., pizza, restaurant, delivery)
              </template>
            </FormGroup>
          </FormSection>
        </div>
        <!-- Social Media Section -->
        <div class="p-6">
          <FormSection title="Social Media & Analytics" description="Social media and tracking configurations">
            <FormGroup label="Instagram URL">
              <Input
                v-model="settingsStore.settings.instagram_url"
                placeholder="Enter Instagram profile URL"
              />
            </FormGroup>
            <FormGroup label="Facebook URL">
              <Input
                v-model="settingsStore.settings.facebook_url"
                placeholder="Enter Facebook page URL"
              />
            </FormGroup>
            <FormGroup label="Google Analytics ID">
              <Input
                v-model="settingsStore.settings.google_analytics_id"
                placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX"
              />
            </FormGroup>
            <FormGroup label="Google Maps API Key">
              <Input
                v-model="settingsStore.settings.Google_Maps_API_Key"
                type="text"
                placeholder="Enter your Google Maps API key"
              />
              <template #hint>
                Used for location features and store map displays
              </template>
            </FormGroup>
          </FormSection>
        </div>
        <!-- Add this section after the Website Information section -->
        <div class="p-6">
          <FormSection title="Logo" description="Upload your website logo">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-primary-500 transition-colors">
                <img
                  :src="settingsStore.settings.logo_image"
                  alt="Website logo"
                  class="w-full h-full object-contain"
                />
              </div>
              <div class="flex-1 space-y-4">
                <FormGroup label="Logo URL">
                  <Input
                    v-model="settingsStore.settings.logo_image"
                    placeholder="Enter logo image URL"
                  />
                </FormGroup>
                <Button
                  type="button"
                  variant="secondary"
                  @click="showGalleryPicker = true"
                >
                  Choose from Gallery
                </Button>
              </div>
            </div>
          </FormSection>
        </div>
      </div>
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
        <Button @click="saveChanges">Save Changes</Button>
      </div>
    </div>
  </div>

  <!-- Add GalleryPicker component at the end of the template -->
  <GalleryPicker
    v-if="showGalleryPicker"
    :show="showGalleryPicker"
    @close="showGalleryPicker = false"
    @select="handleImageSelect"
  />
</template>
