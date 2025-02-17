<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
}>();
</script>

<template>
  <button
    :type="type || 'button'"
    :disabled="disabled || loading"
    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2"
    :class="[
      variant === 'secondary' 
        ? 'bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 focus:ring-neutral-500'
        : 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
    ]"
  >
    <template v-if="loading">
      <svg
        class="animate-spin -ml-1 mr-2 h-4 w-4"
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
      <slot name="loading">Loading...</slot>
    </template>
    <slot v-else />
  </button>
</template>