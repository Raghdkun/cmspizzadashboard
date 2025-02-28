<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useLocationsStore } from '../stores/locations';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Switch from './ui/Switch.vue';
import Button from './ui/Button.vue';
import GalleryPicker from './GalleryPicker.vue';
import { LocationAPIResponse } from '../types/locations';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added'): void;
}>();

const locationsStore = useLocationsStore();
const showGalleryPicker = ref(false);

// Initialize form data with empty values, including latitude and longitude
const formData = ref({
  name: '',
  imageUrl: '/images/default-store.jpg', // Default image
  address: '',                           // Street address
  city: '',
  state: '',
  zipCode: '',
  description: '',
  isActive: true,                        // Active status
  latitude: '',
  longitude: '',
});
const loading = ref(false);
const error = ref('');

// Handle image selection from GalleryPicker
const handleImageSelect = (url: string) => {
  formData.value.imageUrl = url;
  showGalleryPicker.value = false;
};

// Handle file upload for direct image selection
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      formData.value.imageUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// Form validation
const validateForm = (): boolean => {
  if (
    !formData.value.name ||
    !formData.value.address ||
    !formData.value.city ||
    !formData.value.state ||
    !formData.value.zipCode
  ) {
    error.value = 'Please fill out all required fields.';
    return false;
  }
  return true;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    loading.value = true;
    error.value = '';

    // Transform formData into the API's expected format
    const locationData: LocationAPIResponse = {
    name: formData.value.name,
    image_url: formData.value.imageUrl, // Map `imageUrl` to `image_url`
    street: formData.value.address, // Map `address` to `street`
    city: formData.value.city,
    state: formData.value.state,
    zip: formData.value.zipCode, // Map `zipCode` to `zip`
    description: formData.value.description,
    status: formData.value.isActive ? "1" : "0", // Convert boolean to "1" or "0"
    latitude: formData.value.latitude, // New: latitude
    longitude: formData.value.longitude,
    id: '',
    created_at: '',
    updated_at: ''
};

    // Call the API with the transformed data
    await locationsStore.addLocation(locationData);

    emit('added');
  } catch (e) {
    error.value = 'Failed to add location';
  } finally {
    loading.value = false;
  }
};

// Close modal on Escape key press
const closeModal = () => {
  emit('close');
};

const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') closeModal();
};

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey);
});
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl my-8 shadow-xl relative">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          Add New Location
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Image Section -->
          <FormSection title="Location Image" description="Choose an image for this location">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-primary-500 transition-colors">
                <img :src="formData.imageUrl" alt="Location image" class="w-full h-full object-cover" />
              </div>
              <div class="flex flex-col gap-2">
                <Button type="button" variant="secondary" @click="showGalleryPicker = true" class="w-full sm:w-auto">
                  Choose Image from Gallery
                </Button>
                <FormGroup label="Upload Image">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleFileUpload"
                    class="hidden"
                    id="image-upload"
                  />
                  <label for="image-upload" class="cursor-pointer w-full sm:w-auto">
                    <Button variant="secondary">Upload Image</Button>
                  </label>
                </FormGroup>
              </div>
            </div>
          </FormSection>

          <!-- Basic Information -->
          <FormSection title="Basic Information" description="Enter the main details about this location">
            <FormGroup label="Name" required>
              <Input v-model="formData.name" placeholder="Enter location name" required />
            </FormGroup>
            <FormGroup label="Description">
              <Textarea v-model="formData.description" placeholder="Describe the location" rows="3" />
            </FormGroup>
          </FormSection>

          <!-- Address Information -->
          <FormSection title="Address Information" description="Provide the complete address details">
            <FormGroup label="Street Address" required>
              <Input v-model="formData.address" placeholder="Enter street address" required />
            </FormGroup>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="City" required>
                <Input v-model="formData.city" placeholder="Enter city" required />
              </FormGroup>
              <FormGroup label="State" required>
                <Input v-model="formData.state" placeholder="Enter state" required />
              </FormGroup>
            </div>
            <FormGroup label="ZIP Code" required>
              <Input v-model="formData.zipCode" placeholder="Enter ZIP code" required />
            </FormGroup>
          </FormSection>

          <!-- Coordinates Section -->
          <FormSection title="Coordinates" description="Enter the geographic coordinates for this location">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormGroup label="Latitude">
                <Input v-model="formData.latitude" placeholder="Enter latitude" />
              </FormGroup>
              <FormGroup label="Longitude">
                <Input v-model="formData.longitude" placeholder="Enter longitude" />
              </FormGroup>
            </div>
          </FormSection>

          <!-- Status -->
          <FormSection title="Status" description="Set the operational status of this location">
            <Switch v-model="formData.isActive" label="Active" description="Location is currently operational" />
          </FormSection>

          <!-- Error message -->
          <div v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="secondary" @click="emit('close')" class="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" :loading="loading" @click="handleSubmit" class="w-full sm:w-auto">
          Add Location
        </Button>
      </div>
    </div>

    <!-- Gallery Picker Modal -->
    <GalleryPicker
      v-if="showGalleryPicker"
      :show="showGalleryPicker"
      @close="showGalleryPicker = false"
      @select="handleImageSelect"
    />
  </div>
</template>
