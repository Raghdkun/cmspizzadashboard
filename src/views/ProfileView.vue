<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useProfileStore } from '../stores/profile';
import FormGroup from '../components/ui/FormGroup.vue';
import FormSection from '../components/ui/FormSection.vue';
import Input from '../components/ui/Input.vue';
import Textarea from '../components/ui/Textarea.vue';
import Select from '../components/ui/Select.vue';
import Switch from '../components/ui/Switch.vue';
import Button from '../components/ui/Button.vue';

const profileStore = useProfileStore();
const loading = ref(false);
const success = ref('');
const error = ref('');

// Password change form
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

// Load profile when component is mounted
onMounted(async () => {
  try {
    await profileStore.fetchProfile();
  } catch (e) {
    error.value = 'Failed to load profile';
    console.error(e);
  }
});

// Update profile information
const handleUpdateProfile = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await profileStore.updateProfile({
      name: profileStore.profile?.name,
      email: profileStore.profile?.email,
      phone: profileStore.profile?.phone,
      title: profileStore.profile?.title,
      department: profileStore.profile?.department,
      location: profileStore.profile?.location,
      bio: profileStore.profile?.bio,
      timezone: profileStore.profile?.timezone,
      language: profileStore.profile?.language,
    });
    
    success.value = 'Profile updated successfully';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e) {
    error.value = 'Failed to update profile';
  } finally {
    loading.value = false;
  }
};

// Update password
const handleUpdatePassword = async () => {
  try {
    if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
      error.value = 'New passwords do not match';
      return;
    }

    loading.value = true;
    error.value = '';
    
    await profileStore.updatePassword({
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });
    
    // Clear password form
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    
    success.value = 'Password updated successfully';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e) {
    error.value = 'Failed to update password';
  } finally {
    loading.value = false;
  }
};

// Update notification preferences
const handleUpdatePreferences = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await profileStore.updatePreferences(profileStore.profile?.preferences || {});
    
    success.value = 'Preferences updated successfully';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e) {
    error.value = 'Failed to update preferences';
  } finally {
    loading.value = false;
  }
};

// Update security settings
const handleUpdateSecurity = async () => {
  try {
    loading.value = true;
    error.value = '';
    
    await profileStore.updateSecurity({
      twoFactorEnabled: profileStore.profile?.security.twoFactorEnabled,
    });
    
    success.value = 'Security settings updated successfully';
    setTimeout(() => {
      success.value = '';
    }, 3000);
  } catch (e) {
    error.value = 'Failed to update security settings';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
        Profile Settings
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="profileStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading profile...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="profileStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ profileStore.error }}</p>
    </div>

    <!-- Profile form -->
    <div v-else-if="profileStore.profile" class="space-y-6">
      <!-- Basic Information -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        <form @submit.prevent="handleUpdateProfile" class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <!-- Profile Section -->
          <div class="p-6">
            <FormSection title="Profile Information" description="Update your personal information">
              <!-- Avatar -->
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center text-2xl font-semibold">
                  {{ profileStore.profile.name.charAt(0) }}
                </div>
                <Button
                  variant="secondary"
                  class="w-full sm:w-auto"
                >
                  Change Avatar
                </Button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <!-- Name -->
                <FormGroup label="Name" required>
                  <Input
                    v-model="profileStore.profile.name"
                    type="text"
                    required
                  />
                </FormGroup>

                <!-- Email -->
                <FormGroup label="Email" required>
                  <Input
                    v-model="profileStore.profile.email"
                    type="email"
                    required
                  />
                </FormGroup>

                <!-- Phone -->
                <FormGroup label="Phone">
                  <Input
                    v-model="profileStore.profile.phone"
                    type="tel"
                  />
                </FormGroup>

                <!-- Title -->
                <FormGroup label="Title">
                  <Input
                    v-model="profileStore.profile.title"
                    type="text"
                  />
                </FormGroup>

                <!-- Department -->
                <FormGroup label="Department">
                  <Input
                    v-model="profileStore.profile.department"
                    type="text"
                  />
                </FormGroup>

                <!-- Location -->
                <FormGroup label="Location">
                  <Input
                    v-model="profileStore.profile.location"
                    type="text"
                  />
                </FormGroup>
              </div>

              <!-- Bio -->
              <FormGroup label="Bio">
                <Textarea
                  v-model="profileStore.profile.bio"
                  rows="4"
                />
              </FormGroup>

              <!-- Save button -->
              <div class="mt-6 flex justify-end">
                <Button
                  type="submit"
                  :loading="loading"
                >
                  Save Changes
                </Button>
              </div>
            </FormSection>
          </div>
        </form>
      </div>

      <!-- Password Section -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        <form @submit.prevent="handleUpdatePassword" class="p-6">
          <FormSection title="Change Password" description="Update your password">
            <FormGroup label="Current Password" required>
              <Input
                v-model="passwordForm.currentPassword"
                type="password"
                required
              />
            </FormGroup>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <FormGroup label="New Password" required>
                <Input
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                />
              </FormGroup>

              <FormGroup label="Confirm New Password" required>
                <Input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                />
              </FormGroup>
            </div>

            <!-- Save button -->
            <div class="mt-6 flex justify-end">
              <Button
                type="submit"
                :loading="loading"
              >
                Update Password
              </Button>
            </div>
          </FormSection>
        </form>
      </div>

      <!-- Preferences Section -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        <form @submit.prevent="handleUpdatePreferences" class="p-6">
          <FormSection title="Notification Preferences" description="Manage your notification settings">
            <div class="space-y-4">
              <Switch
                v-model="profileStore.profile.preferences.emailNotifications"
                label="Email notifications"
                description="Receive notifications via email"
              />

              <Switch
                v-model="profileStore.profile.preferences.pushNotifications"
                label="Push notifications"
                description="Receive push notifications in your browser"
              />

              <Switch
                v-model="profileStore.profile.preferences.marketingEmails"
                label="Marketing emails"
                description="Receive updates about new features and announcements"
              />
            </div>

            <!-- Save button -->
            <div class="mt-6 flex justify-end">
              <Button
                type="submit"
                :loading="loading"
              >
                Save Preferences
              </Button>
            </div>
          </FormSection>
        </form>
      </div>

      <!-- Security Section -->
      <div class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
        <form @submit.prevent="handleUpdateSecurity" class="p-6">
          <FormSection title="Security Settings" description="Manage your account security">
            <Switch
              v-model="profileStore.profile.security.twoFactorEnabled"
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />

            <!-- Login History -->
            <div class="mt-6">
              <h4 class="text-sm font-medium text-neutral-900 dark:text-white mb-4">
                Recent Login Activity
              </h4>
              <div class="space-y-4">
                <div
                  v-for="login in profileStore.profile.security.loginHistory"
                  :key="login.date"
                  class="flex justify-between items-center text-sm"
                >
                  <div>
                    <p class="font-medium text-neutral-900 dark:text-white">
                      {{ login.device }}
                    </p>
                    <p class="text-neutral-500 dark:text-neutral-400">
                      {{ login.ip }}
                    </p>
                  </div>
                  <span class="text-neutral-500 dark:text-neutral-400">
                    {{ new Date(login.date).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Save button -->
            <div class="mt-6 flex justify-end">
              <Button
                type="submit"
                :loading="loading"
              >
                Save Security Settings
              </Button>
            </div>
          </FormSection>
        </form>
      </div>

      <!-- Success/Error messages -->
      <div
        v-if="success || error"
        class="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg"
        :class="[
          success ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
        ]"
      >
        <p
          :class="[
            success ? 'text-green-800 dark:text-green-400' : 'text-red-800 dark:text-red-400'
          ]"
        >
          {{ success || error }}
        </p>
      </div>
    </div>
  </div>
</template>