<script setup lang="ts">
import { ref } from 'vue';
import { useContactsStore } from '../stores/contacts';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Textarea from './ui/Textarea.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';

const props = defineProps<{
  contact: {
    id: string;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    status: 'new' | 'in_progress' | 'resolved' | 'archived';
    priority: 'high' | 'medium' | 'low';
    type: 'general' | 'support' | 'feedback' | 'partnership';
    receivedDate: string;
  };
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const contactsStore = useContactsStore();

// Initialize form data with current contact values
const formData = ref({
  name: props.contact.name,
  email: props.contact.email,
  phone: props.contact.phone,
  subject: props.contact.subject,
  message: props.contact.message,
  status: props.contact.status,
  priority: props.contact.priority,
  type: props.contact.type,
  notes: '',
  response: '',
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await contactsStore.updateContact(props.contact.id, {
      ...formData.value,
      response: formData.value.response ? {
        text: formData.value.response,
        respondentName: 'Admin', // This would typically come from the logged-in user
      } : undefined,
    });
    
    emit('updated');
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

          <!-- Message Details -->
          <FormSection title="Message Details" description="Contact message and subject">
            <FormGroup label="Subject" required>
              <Input
                v-model="formData.subject"
                placeholder="Message subject"
                required
              />
            </FormGroup>

            <FormGroup label="Message" required>
              <Textarea
                v-model="formData.message"
                placeholder="Contact message"
                rows="4"
                required
              />
            </FormGroup>
          </FormSection>

          <!-- Status and Priority -->
          <FormSection title="Status and Priority" description="Manage contact status">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Status" required>
                <Select v-model="formData.status">
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </Select>
              </FormGroup>

              <FormGroup label="Priority" required>
                <Select v-model="formData.priority">
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </Select>
              </FormGroup>
            </div>

            <FormGroup label="Contact Type" required>
              <Select v-model="formData.type">
                <option value="general">General</option>
                <option value="support">Support</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
              </Select>
            </FormGroup>
          </FormSection>

          <!-- Response -->
          <FormSection title="Response" description="Add a response to this contact">
            <FormGroup label="Response Message">
              <Textarea
                v-model="formData.response"
                placeholder="Enter your response"
                rows="4"
              />
            </FormGroup>

            <FormGroup label="Internal Notes">
              <Textarea
                v-model="formData.notes"
                placeholder="Add internal notes"
                rows="3"
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