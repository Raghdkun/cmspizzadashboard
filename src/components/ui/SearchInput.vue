<template>
  <div class="relative">
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
    </div>
    <input
      type="search"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      class="block w-full pl-10 pr-4 py-2.5 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400"
      :class="{ 'pr-10': modelValue }"
      v-bind="$attrs"
    >
    <button
      v-if="modelValue"
      @click="$emit('update:modelValue', '')"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      <XMarkIcon class="h-5 w-5 text-neutral-400 hover:text-neutral-500 dark:hover:text-neutral-300" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline';

defineProps<{
  modelValue: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>