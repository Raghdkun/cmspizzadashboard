<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}>();
</script>

<template>
  <div class="form-field">
    <label v-if="label" class="form-label">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <slot />
    <p v-if="error" class="form-error">{{ error }}</p>
    <p v-else-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>