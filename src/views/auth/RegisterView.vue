<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    await authStore.register(email.value, password.value);
    router.push({ name: 'dashboard' });
  } catch (e) {
    error.value = 'Registration failed';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">Create an account</h1>
      <p class="text-neutral-500 dark:text-neutral-400 mt-2">Sign up to get started</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
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

      <div>
        <label for="password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Password
        </label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          class="mt-1 block w-full rounded-lg border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          placeholder="Create a password"
        />
      </div>

      <div>
        <label for="confirm-password" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Confirm Password
        </label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          required
          class="mt-1 block w-full rounded-lg border border-neutral-300 dark:border-neutral-600 px-3 py-2 text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          placeholder="Confirm your password"
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
        <span v-if="loading">Creating account...</span>
        <span v-else>Create account</span>
      </button>

      <p class="text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?
        <router-link
          :to="{ name: 'login' }"
          class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
        >
          Sign in
        </router-link>
      </p>
    </form>
  </div>
</template>