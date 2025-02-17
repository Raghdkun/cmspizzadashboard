<script setup lang="ts">
import { ref } from 'vue';
import { useEventsStore } from '../stores/events';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Select from './ui/Select.vue';
import Switch from './ui/Switch.vue';
import Button from './ui/Button.vue';
import GalleryPicker from './GalleryPicker.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added'): void;
}>();

const eventsStore = useEventsStore();
const showGalleryPicker = ref(false);

// Initialize form data with empty values
const formData = ref({
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  maxAttendees: 100,
  imageUrl: '/images/default-event.jpg',
  status: 'upcoming' as const,
  category: 'community' as const,
  tags: '',
  registrationDeadline: '',
  price: 0,
  isPublic: true,
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    // Process tags if provided
    const processedData = {
      ...formData.value,
      tags: formData.value.tags ? formData.value.tags.split(',').map(tag => tag.trim()) : undefined,
    };

    await eventsStore.addEvent(processedData);
    emit('added');
  } catch (e) {
    error.value = 'Failed to add event';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

// Handle image selection
const handleImageSelect = (url: string) => {
  formData.value.imageUrl = url;
  showGalleryPicker.value = false;
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl my-8 shadow-xl relative">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          Add New Event
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Image Section -->
          <FormSection title="Event Image" description="Choose an image for this event">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-primary-500 transition-colors">
                <img
                  :src="formData.imageUrl"
                  alt="Event image"
                  class="w-full h-full object-cover"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                @click="showGalleryPicker = true"
                class="w-full sm:w-auto"
              >
                Choose Image
              </Button>
            </div>
          </FormSection>

          <!-- Basic Information -->
          <FormSection title="Basic Information" description="Enter the main details about this event">
            <FormGroup label="Title" required>
              <Input
                v-model="formData.title"
                placeholder="Enter event title"
                required
              />
            </FormGroup>

            <FormGroup label="Description" required>
              <Textarea
                v-model="formData.description"
                placeholder="Describe the event"
                rows="3"
                required
              />
            </FormGroup>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Date" required>
                <Input
                  v-model="formData.date"
                  type="date"
                  required
                />
              </FormGroup>

              <FormGroup label="Time" required>
                <Input
                  v-model="formData.time"
                  type="time"
                  required
                />
              </FormGroup>
            </div>

            <FormGroup label="Location" required>
              <Input
                v-model="formData.location"
                placeholder="Enter event location"
                required
              />
            </FormGroup>
          </FormSection>

          <!-- Event Details -->
          <FormSection title="Event Details" description="Configure additional event settings">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Category" required>
                <Select v-model="formData.category">
                  <option value="community">Community</option>
                  <option value="fundraiser">Fundraiser</option>
                  <option value="promotion">Promotion</option>
                  <option value="holiday">Holiday</option>
                  <option value="other">Other</option>
                </Select>
              </FormGroup>

              <FormGroup label="Status" required>
                <Select v-model="formData.status">
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FormGroup>
            </div>

            <FormGroup label="Tags">
              <Input
                v-model="formData.tags"
                placeholder="Enter tags separated by commas"
              />
              <template #hint>
                Separate tags with commas (e.g., food, community, charity)
              </template>
            </FormGroup>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Max Attendees" required>
                <Input
                  v-model="formData.maxAttendees"
                  type="number"
                  min="1"
                  required
                />
              </FormGroup>

              <FormGroup label="Price">
                <Input
                  v-model="formData.price"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </FormGroup>
            </div>

            <FormGroup label="Registration Deadline">
              <Input
                v-model="formData.registrationDeadline"
                type="date"
              />
            </FormGroup>

            <Switch
              v-model="formData.isPublic"
              label="Public Event"
              description="Make this event visible to everyone"
            />
          </FormSection>

          <!-- Error message -->
          <div v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ error }}
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button
          variant="secondary"
          @click="emit('close')"
          class="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          :loading="loading"
          @click="handleSubmit"
          class="w-full sm:w-auto"
        >
          Add Event
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