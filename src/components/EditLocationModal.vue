<script setup lang="ts">
import { ref } from 'vue';
import type { Location } from '../stores/locations';
import { useLocationsStore } from '../stores/locations';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Switch from './ui/Switch.vue';
import Button from './ui/Button.vue';
import GalleryPicker from './GalleryPicker.vue';

const props = defineProps<{
  location: Location;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const locationsStore = useLocationsStore();
const showGalleryPicker = ref(false);

// Initialize form data with current location values (including coordinates)
const formData = ref({
  name: props.location.name,
  address: props.location.address,
  city: props.location.city,
  state: props.location.state,
  zipCode: props.location.zipCode,
  description: props.location.description,
  imageUrl: props.location.imageUrl,
  isActive: props.location.isActive,
  latitude: props.location.coordinates?.latitude?.toString() || '',
  longitude: props.location.coordinates?.longitude?.toString() || '',
});

const loading = ref(false);
const error = ref('');

// Handle image selection from GalleryPicker
const handleImageSelect = (url: string) => {
  formData.value.imageUrl = url;
  showGalleryPicker.value = false;
};

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    // Call the store’s update function with the current form data.
    // Make sure your updateLocation action supports latitude/longitude as needed.
    await locationsStore.updateLocation(props.location.id, formData.value);
    emit('updated');
  } catch (e) {
    error.value = 'Failed to update location';
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl my-8 shadow-xl relative">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          Edit Location
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
              <Button type="button" variant="secondary" @click="showGalleryPicker = true" class="w-full sm:w-auto">
                Choose Image
              </Button>
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
          Save Changes
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
