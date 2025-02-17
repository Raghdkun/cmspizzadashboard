<script setup lang="ts">
import { ref } from 'vue';
import FormGroup from './ui/FormGroup.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Button from './ui/Button.vue';
import GalleryPicker from './GalleryPicker.vue';
import type { TeamMember } from '../stores/about';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'add', member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'socialLinks'>): void;
}>();

// Default form data for a new team member
const formData = ref<Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'socialLinks'>>({
  name: '',
  role: '',
  description: '',
  imageUrl: '',
  status: 'active',
});

const showGalleryPicker = ref(false);

const handleImageSelect = (url: string) => {
  formData.value.imageUrl = url;
  showGalleryPicker.value = false;
};

const handleSubmit = () => {
  emit('add', { ...formData.value });
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl my-8 shadow-xl relative">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          Add Team Member
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Image Section -->
          <FormGroup title="Profile Image" description="Choose a profile image">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-primary-500 transition-colors">
                <img
                  :src="formData.imageUrl || '/placeholder-avatar.jpg'"
                  alt="Team member"
                  class="w-full h-full object-cover"
                />
              </div>
              <Button variant="secondary" @click="showGalleryPicker = true" class="w-full sm:w-auto">
                Choose Image
              </Button>
            </div>
          </FormGroup>

          <!-- Basic Information -->
          <FormGroup title="Member Information" description="Enter the team member's details">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Name" required>
                <Input
                  v-model="formData.name"
                  type="text"
                  required
                  placeholder="Team member name"
                />
              </FormGroup>
              <FormGroup label="Role" required>
                <Input
                  v-model="formData.role"
                  type="text"
                  required
                  placeholder="e.g., CEO, CTO"
                />
              </FormGroup>
            </div>
            <FormGroup label="Description" required>
              <Textarea
                v-model="formData.description"
                rows="3"
                required
                placeholder="Brief description of the team member"
              />
            </FormGroup>
          </FormGroup>

          <!-- Error message could be added here if needed -->
        </form>
      </div>

      <!-- Footer -->
      <div class="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="secondary" @click="emit('close')" class="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" @click="handleSubmit" class="w-full sm:w-auto">
          Add Team Member
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
