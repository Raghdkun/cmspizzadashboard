<script setup lang="ts">
import { ref } from 'vue';
import { useUsersStore } from '../stores/users';
import FormGroup from './ui/FormGroup.vue';
import FormSection from './ui/FormSection.vue';
import Input from './ui/Input.vue';
import Select from './ui/Select.vue';
import Button from './ui/Button.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'added'): void;
}>();

const usersStore = useUsersStore();

// Initialize form data
const formData = ref({
  name: '',
  email: '',
  role: 'user' as const,
  status: 'active' as const,
  password: '',
  confirmPassword: '',
});

const loading = ref(false);
const error = ref('');

// Handle form submission
const handleSubmit = async () => {
  try {
    // Validate passwords match
    if (formData.value.password !== formData.value.confirmPassword) {
      error.value = 'Passwords do not match';
      return;
    }

    loading.value = true;
    error.value = '';
    await usersStore.addUser({
      name: formData.value.name,
      email: formData.value.email,
      role: formData.value.role,
      status: formData.value.status,
      lastLogin: new Date().toLocaleDateString(),
    });
    emit('added');
  } catch (e) {
    error.value = 'Failed to add user';
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
          Add New User
        </h2>
      </div>

      <!-- Body -->
      <div class="p-4 sm:p-6 max-h-[calc(100vh-16rem)] overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6 sm:space-y-8">
          <!-- Basic Information -->
          <FormSection title="User Information" description="Enter the user's basic details">
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
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
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
          <FormSection title="Set Password" description="Create a secure password for the user">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="Password" required>
                <Input
                  v-model="formData.password"
                  type="password"
                  placeholder="Enter password"
                  required
                />
              </FormGroup>

              <FormGroup label="Confirm Password" required>
                <Input
                  v-model="formData.confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  required
                />
              </FormGroup>
            </div>
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
          Add User
        </Button>
      </div>
    </div>
  </div>
</template>