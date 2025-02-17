<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="border-b border-neutral-200 dark:border-neutral-700 pb-6 mb-6">
    <h3 class="text-lg font-medium text-neutral-900 dark:text-white">
      {{ title }}
    </h3>
    <p v-if="description" class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
      {{ description }}
    </p>
    <div class="mt-6 space-y-6">
      <slot />
    </div>
  </div>
</template>