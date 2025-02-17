<script setup lang="ts">
import { ref } from 'vue';
import type { Inquiry } from '../stores/inquiries';
import { useInquiriesStore } from '../stores/inquiries';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';

const props = defineProps<{
  inquiry: Inquiry;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const inquiriesStore = useInquiriesStore();

// Initialize form data with current inquiry values
const formData = ref({
  name: props.inquiry.name,
  info: props.inquiry.info,
  email: props.inquiry.email,
  phone: props.inquiry.phone,
  status: props.inquiry.status, // Allowed values: "New", "In Review", "Contacted", "Closed"
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    await inquiriesStore.updateInquiry(props.inquiry.id, formData.value);
    emit('updated');
  } catch (e) {
    error.value = `Failed to update inquiry ${e}`;
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
          Edit Inquiry
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Contact Information -->
          <FormSection title="Contact Information" description="Customer contact details">
            <FormGroup label="Name" required>
              <Input
                v-model="formData.name"
                placeholder="Enter full name"
                required
              />
            </FormGroup>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Email" required>
                <Input
                  v-model="formData.email"
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>
              <FormGroup label="Phone" required>
                <Input
                  v-model="formData.phone"
                  type="tel"
                  placeholder="Enter phone number"
                  required
                />
              </FormGroup>
            </div>
          </FormSection>

          <!-- Inquiry Details -->
          <FormSection title="Inquiry Details" description="Additional information">
            <FormGroup label="Info" required>
              <Textarea
                v-model="formData.info"
                placeholder="Enter inquiry details"
                rows="4"
                required
              />
            </FormGroup>
          </FormSection>

          <!-- Status -->
          <FormSection title="Status" description="Manage inquiry status">
            <FormGroup label="Status" required>
              <Select v-model="formData.status">
                <option value="New">New</option>
                <option value="In Review">In Review</option>
                <option value="Contacted">Contacted</option>
                <option value="Closed">Closed</option>
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
