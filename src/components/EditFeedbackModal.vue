<script setup lang="ts">
import { ref } from 'vue';
import type { Feedback } from '../stores/feedback';
import { useFeedbackStore } from '../stores/feedback';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';

const props = defineProps<{
  feedback: Feedback;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const feedbackStore = useFeedbackStore();

const formData = ref({
  customerName: props.feedback.customerName,
  email: props.feedback.email,
  rating: props.feedback.rating,
  comment: props.feedback.comment,
  status: props.feedback.status, // e.g. "Published" | "Pending" | "Archived"
});

const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    // Send the updated data to the store
    await feedbackStore.updateFeedback(props.feedback.id, formData.value);
    emit('updated');
  } catch (e) {
    error.value = `Failed to update feedback ${e}`;
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
          Edit Feedback
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Customer Information -->
          <FormSection title="Customer Information" description="Basic details about the customer">
            <FormGroup label="Customer Name" required>
              <Input
                v-model="formData.customerName"
                placeholder="Enter customer name"
                required
              />
            </FormGroup>

            <FormGroup label="Email">
              <Input
                v-model="formData.email"
                type="email"
                placeholder="Enter customer email"
              />
            </FormGroup>
          </FormSection>

          <!-- Feedback Details -->
          <FormSection title="Feedback Details" description="Review and rating information">
            <FormGroup label="Rating" required>
              <Select v-model="formData.rating">
                <option value="1">1 Star</option>
                <option value="2">2 Stars</option>
                <option value="3">3 Stars</option>
                <option value="4">4 Stars</option>
                <option value="5">5 Stars</option>
              </Select>
            </FormGroup>

            <FormGroup label="Comment" required>
              <Textarea
                v-model="formData.comment"
                placeholder="Customer's feedback"
                rows="4"
                required
              />
            </FormGroup>
          </FormSection>

          <!-- Status -->
          <FormSection title="Status" description="Manage feedback visibility">
            <FormGroup label="Status" required>
              <Select v-model="formData.status">
                <option value="Published">Published</option>
                <option value="Pending">Pending</option>
                <option value="Archived">Archived</option>
              </Select>
            </FormGroup>
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
          Save Changes
        </Button>
      </div>
    </div>
  </div>
</template>
