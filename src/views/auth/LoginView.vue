<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const rememberMe = ref(false);
const loading = ref(false);
const error = ref("");

const handleSubmit = async () => {
  try {
    loading.value = true;
    error.value = "";

    await authStore.login({
      email: email.value,
      password: password.value,
      // If your API needs "rememberMe", include it:
      // rememberMe: rememberMe.value,
    });

    // If login is successful:
    if (authStore.isAuthenticated) {
      // Navigate to the Dashboard
      router.push({ name: "dashboard" });
    } else {
      // If authStore.isAuthenticated is still false, there must be errors:
      // We'll show a local error, or you can read authStore.errors
      error.value =
        authStore.errors.message ||
        authStore.errors.error ||
        JSON.stringify(authStore.errors) ||
        "Login failed.";
    }
  } catch (err) {
    // If the store throws an Error (like a network error) or something unexpected
    error.value = "An unexpected error occurred.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="mb-8 text-center">
        <div
          class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4"
        >
          R&D
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 dark:text-white">
          Welcome back
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400 mt-2">
          Sign in to your account
        </p>
      </div>

      <!-- Login Form -->
      <div
        class="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-8"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email field -->
          <div class="form-group">
            <label for="email" class="form-label form-label-required">
              Email
            </label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="form-input"
              placeholder="Enter your email"
            />
          </div>

          <!-- Password field -->
          <div class="form-group">
            <label for="password" class="form-label form-label-required">
              Password
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="form-input"
              placeholder="Enter your password"
            />
          </div>

          <!-- Remember me and Forgot password -->
          <div class="flex items-center justify-between">
            <label class="inline-flex items-center">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="form-checkbox"
              />
              <span class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                Remember me
              </span>
            </label>
            <router-link
              :to="{ name: 'forgot-password' }"
              class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Forgot password?
            </router-link>
          </div>

          <!-- Error message (local error) -->
          <div
            v-if="error"
            class="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
          >
            {{ error }}
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full px-4 py-3 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg
                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </span>
            <span v-else>Sign in</span>
          </button>

          <!-- Register link
          <p class="text-center text-sm text-neutral-500 dark:text-neutral-400">
            Don't have an account?
            <router-link
              :to="{ name: 'register' }"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Sign up
            </router-link>
          </p> -->
        </form>
      </div>
    </div>
  </div>
</template>
