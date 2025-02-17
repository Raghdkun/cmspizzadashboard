<script setup lang="ts">
defineProps<{
  title: string;
  message: string;
}>();

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
</script>

<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-md mx-4">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
          {{ title }}
        </h2>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">
          {{ message }}
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="emit('cancel')"
            class="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Cancel
          </button>
          <button
            @click="emit('confirm')"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>