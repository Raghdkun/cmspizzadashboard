<script setup lang="ts">
import { ref } from 'vue';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Button from './ui/Button.vue';
import GalleryPicker from './GalleryPicker.vue';

const props = defineProps<{
  member: {
    id: number;
    name: string;
    role: string;
    description: string;
    imageUrl: string;
    status: string;
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', member: any): void;
}>();

const showGalleryPicker = ref(false);

const formData = ref({
  id: props.member.id,
  name: props.member.name,
  role: props.member.role,
  description: props.member.description,
  imageUrl: props.member.imageUrl,
  status: props.member.status,
});

const handleImageSelect = (url: string) => {
  formData.value.imageUrl = url;
  showGalleryPicker.value = false;
};

const handleSubmit = () => {
  emit('update', { ...formData.value });
};
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-2xl my-8 shadow-xl relative">
      <!-- Header -->
      <div class="p-4 sm:p-6 border-b border-neutral-200 dark:border-neutral-700">
        <h2 class="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white">
          Edit Team Member
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Image Section -->
          <FormSection title="Profile Image" description="Choose a profile image">
            <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div class="w-full sm:w-32 h-32 rounded-lg overflow-hidden border-2 border-neutral-200 dark:border-neutral-700 group-hover:border-primary-500 transition-colors">
                <img
                  :src="formData.imageUrl"
                  alt="Team member"
                  class="w-full h-full object-cover"
                />
              </div>
              <Button
                variant="secondary"
                @click="showGalleryPicker = true"
                class="w-full sm:w-auto"
              >
                Choose Image
              </Button>
            </div>
          </FormSection>

          <!-- Basic Information -->
          <FormSection title="Member Information" description="Update the team member's details">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Name" required>
                <Input
                  v-model="formData.name"
                  type="text"
                  required
                />
              </FormGroup>

              <FormGroup label="Role" required>
                <Input
                  v-model="formData.role"
                  type="text"
                  required
                />
              </FormGroup>
            </div>

            <FormGroup label="Description" required>
              <Textarea
                v-model="formData.description"
                rows="3"
                required
              />
            </FormGroup>
          </FormSection>
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
          @click="handleSubmit"
          class="w-full sm:w-auto"
        >
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