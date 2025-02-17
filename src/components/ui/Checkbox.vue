<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  label?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <label class="inline-flex items-center">
    <input
      type="checkbox"
      :checked="modelValue"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
      :disabled="disabled"
      class="form-checkbox"
    />
    <span v-if="label" class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
      {{ label }}
    </span>
  </label>
</template>