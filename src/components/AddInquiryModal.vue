<script setup lang="ts">
import { ref } from 'vue';
import { useInquiriesStore } from '../stores/inquiries';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Button from './ui/Button.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added'): void;
}>();

const inquiriesStore = useInquiriesStore();

// Initialize form data with only the required fields
const formData = ref({
  name: '',
  info: '',
  email: '',
  phone: '',
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    await inquiriesStore.addInquiry(formData.value);
    emit('added');
  } catch (e) {
    error.value = 'Failed to add inquiry';
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
          Add New Inquiry
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Contact Information -->
          <FormSection title="Contact Information" description="Basic contact details">
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
          <FormSection title="Inquiry Details" description="Additional information about your inquiry">
            <FormGroup label="Info" required>
              <Textarea
                v-model="formData.info"
                placeholder="Enter inquiry details"
                rows="4"
                required
              />
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
        <Button variant="secondary" @click="emit('close')" class="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" :loading="loading" @click="handleSubmit" class="w-full sm:w-auto">
          Add Inquiry
        </Button>
      </div>
    </div>
  </div>
</template>
