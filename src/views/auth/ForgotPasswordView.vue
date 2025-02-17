<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const email = ref('');
const loading = ref(false);
const error = ref('');
const success = ref(false);

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = '';
    await authStore.forgotPassword(email.value);
    success.value = true;
  } catch (e) {
    error.value = 'Failed to send reset instructions';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Forgot password?</h1>
      <p class="text-neutral-500 dark:text-neutral-400 mt-2">
        Enter your email to receive reset instructions
      </p>
    </div>

    <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label for="email" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Email
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          class="mt-1 block w-full rounded-lg border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          placeholder="Enter your email"
        />
      </div>

      <div v-if="error" class="text-red-600 dark:text-red-400 text-sm text-center">
        {{ error }}
      </div>

      <button
        type="submit"
        :disabled="loading"
        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading">Sending...</span>
        <span v-else>Send reset instructions</span>
      </button>
    </form>

    <div v-else class="text-center space-y-4">
      <div class="text-green-600 dark:text-green-400">
        Reset instructions have been sent to your email.
      </div>
      <router-link
        :to="{ name: 'login' }"
        class="block text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Back to login
      </router-link>
    </div>

    <div class="mt-6 text-center">
      <router-link
        :to="{ name: 'login' }"
        class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
      >
        Back to login
      </router-link>
    </div>
  </div>
</template>