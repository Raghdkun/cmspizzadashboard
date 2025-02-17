<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  value: string | number;
  label?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>

<template>
  <label class="inline-flex items-center">
    <input
      type="radio"
      :checked="modelValue === value"
      @change="emit('update:modelValue', value)"
      :disabled="disabled"
      class="form-radio"
    />
    <span v-if="label" class="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
      {{ label }}
    </span>
  </label>
</template>