<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <select
    :value="modelValue"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    :disabled="disabled"
    :required="required"
    class="form-select"
  >
    <slot />
  </select>
</template>