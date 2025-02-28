<script setup lang="ts">
import { ref } from 'vue';
import type { User } from '../stores/users';
import { useUsersStore } from '../stores/users';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';

const props = defineProps<{
  user: User & { status?: 'active' | 'inactive' } // extending User with status for editing
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'updated'): void;
}>();

const usersStore = useUsersStore();

// Initialize form data with current user values. We include status and password fields.
const formData = ref({
  name: props.user.name,
  email: props.user.email,
  role: props.user.role.toLowerCase(), // ensure lower-case values for selects
  status: (props.user.status ?? (props.user.email_verified_at ? 'active' : 'inactive')) as 'active' | 'inactive',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    // Basic validation
    if (!formData.value.name.trim()) {
      error.value = 'Name is required';
      return;
    }

    loading.value = true;
    error.value = '';

    // Create FormData for multipart/form-data
    const formDataObj = new FormData();
    
    // Only append fields that have changed
    if (formData.value.name !== props.user.name) {
      formDataObj.append('name', formData.value.name.trim());
    }
    if (formData.value.email !== props.user.email) {
      formDataObj.append('email', formData.value.email.trim());
    }
    if (formData.value.role !== props.user.role.toLowerCase()) {
      formDataObj.append('role', formData.value.role);
    }
    
    // Add method spoofing for Laravel
    formDataObj.append('_method', 'POST');

    // Only include password fields if a new password is provided
    if (formData.value.newPassword) {
      if (!formData.value.currentPassword) {
        error.value = 'Current password is required to change password';
        return;
      }
      if (formData.value.newPassword.length < 8) {
        error.value = 'Password must be at least 8 characters';
        return;
      }
      formDataObj.append('password', formData.value.newPassword);
      formDataObj.append('password_confirmation', formData.value.confirmPassword);
      formDataObj.append('current_password', formData.value.currentPassword);
    }

    // Call updateUser from the store
    await usersStore.updateUser(props.user.id, formDataObj);
    emit('updated');
    emit('close');
  } catch (e: any) {
    error.value = e.message || 'Failed to update user';
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
          Edit User
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Basic Information -->
          <FormSection title="User Information" description="Update the user's basic details">
            <FormGroup label="Name" required>
              <Input
                v-model="formData.name"
                placeholder="Enter user's name"
                required
              />
            </FormGroup>

            <FormGroup label="Email" required>
              <Input
                v-model="formData.email"
                type="email"
                placeholder="Enter user's email"
                required
              />
            </FormGroup>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Role" required>
                <Select v-model="formData.role">
                  <option value="Admin">Admin</option>
                  <option value="Acquisition">Acquisition</option>
                  <option value="user">User</option>
                </Select>
              </FormGroup>

              <FormGroup label="Status" required>
                <Select v-model="formData.status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FormGroup>
            </div>
          </FormSection>

          <!-- Password Section -->
          <FormSection title="Change Password" description="Optionally update the user's password">
            <FormGroup label="Current Password">
              <Input
                v-model="formData.currentPassword"
                type="password"
                placeholder="Enter current password"
              />
            </FormGroup>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="New Password">
                <Input
                  v-model="formData.newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </FormGroup>

              <FormGroup label="Confirm New Password">
                <Input
                  v-model="formData.confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </FormGroup>
            </div>
          </FormSection>

          <!-- Error message -->
          <div v-if="error" class="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {{ error }}
          </div>

          <!-- Footer -->
          <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button
              variant="secondary"
              @click="emit('close')"
              type="button"
              class="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              :loading="loading"
              class="w-full sm:w-auto"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
