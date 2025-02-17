<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  inline?: boolean;
}>();
</script>

<template>
  <div :class="['space-y-1', inline ? 'sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start' : '']">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div :class="[inline ? 'sm:col-span-2' : '']">
      <slot />
      <p v-if="error" class="form-error">{{ error }}</p>
      <p v-else-if="hint" class="form-hint">{{ hint }}</p>
    </div>
  </div>
</template>