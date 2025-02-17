<script setup lang="ts">
import { ref } from 'vue';
import FormGroup from './ui/FormGroup.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Button from './ui/Button.vue';
import type { Milestone } from '../stores/about';

const props = defineProps<{
  milestone: Milestone;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update', milestone: Omit<Milestone, 'createdAt' | 'updatedAt'>): void;
}>();

// Initialize form data using the props.
// We assume that id, date, title, and description are editable.
const formData = ref<Omit<Milestone, 'createdAt' | 'updatedAt'>>({
  id: props.milestone.id,
  date: props.milestone.date,
  title: props.milestone.title,
  description: props.milestone.description,
});

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
          Edit Milestone
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <FormGroup label="Date" required>
            <!-- Using a date input improves UX and ensures proper formatting -->
            <Input v-model="formData.date" type="date" required />
          </FormGroup>

          <FormGroup label="Title" required>
            <Input
              v-model="formData.title"
              type="text"
              required
              placeholder="Milestone title"
            />
          </FormGroup>

          <FormGroup label="Description" required>
            <Textarea
              v-model="formData.description"
              rows="3"
              required
              placeholder="Describe the milestone"
            />
          </FormGroup>
        </form>
      </div>

      <!-- Footer -->
      <div class="p-4 sm:p-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row justify-end gap-3">
        <Button variant="secondary" @click="emit('close')" class="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" @click="handleSubmit" class="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </div>
  </div>
</template>
