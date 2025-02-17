<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
  rows?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <textarea
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :placeholder="placeholder"
    :rows="rows || 3"
    :disabled="disabled"
    :required="required"
    class="form-textarea"
  ></textarea>
</template>