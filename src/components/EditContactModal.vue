<script setup lang="ts">
import { ref } from 'vue';
import FormGroup from './ui/FormGroup.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';
import { useContactsStore } from '@/stores/contacts';


// The contact prop type now includes the required fields.
const props = defineProps<{
  contact: {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'pending' | 'completed';
 
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated', contact: {
    id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'pending' | 'completed';
  }): void;
}>();

// Create reactive form data initialized from props
const formData = ref({
  name: props.contact.name,
  email: props.contact.email,
  phone: props.contact.phone,
  message: props.contact.message,
  status: props.contact.status,
});

const loading = ref(false);
const error = ref('');

const contactsStore = useContactsStore();

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    // Call the API to update the contact
    await contactsStore.updateContact(props.contact.id, { ...formData.value });

    // Emit updated contact data (exclude createdAt/updatedAt)
    emit('updated', { id: props.contact.id, ...formData.value });
  } catch (e) {
    error.value = 'Failed to update contact';
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
          Edit Contact
        </h2>
      </div>

      <!-- Form (wrapped as one form element) -->
      <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-6 sm:space-y-8">
        <!-- Contact Information -->
        <FormGroup label="Name" required>
          <Input v-model="formData.name" placeholder="Enter full name" required />
        </FormGroup>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FormGroup label="Email" required>
            <Input v-model="formData.email" type="email" placeholder="Enter email address" required />
          </FormGroup>
          <FormGroup label="Phone" required>
            <Input v-model="formData.phone" type="tel" placeholder="Enter phone number" required />
          </FormGroup>
        </div>

        <!-- Message -->
        <FormGroup label="Message" required>
          <Textarea v-model="formData.message" rows="4" placeholder="Enter the message" required />
        </FormGroup>

        <!-- Status -->
        <FormGroup label="Status" required>
          <Select v-model="formData.status">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Select>
        </FormGroup>

        <!-- Error message -->
        <div v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          {{ error }}
        </div>

        <!-- Footer Buttons -->
        <div class="flex flex-col sm:flex-row justify-end gap-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <Button variant="secondary" @click.prevent="emit('close')" class="w-full sm:w-auto">
            Cancel
          </Button>
          <Button type="submit" :loading="loading" class="w-full sm:w-auto">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
