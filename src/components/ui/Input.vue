<script setup lang="ts">
defineProps<{
  modelValue: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <div class="relative">
    <slot name="prefix" />
    <input
      :type="type || 'text'"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="form-input"
      :class="{ 'pl-10': $slots.prefix }"
    />
  </div>
</template>