<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  disabled?: boolean;
  label?: string;
  description?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const checked = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  checked.value = newValue;
});

const toggle = () => {
  if (!props.disabled) {
    checked.value = !checked.value;
    emit('update:modelValue', checked.value);
  }
};
</script>

<template>
  <div class="flex items-center">
    <button
      type="button"
      :class="[
        'form-switch',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      ]"
      :aria-checked="checked"
      :aria-disabled="disabled"
      @click="toggle"
    >
      <span class="form-switch-inner" />
    </button>
    <div v-if="label || description" class="ml-3">
      <span v-if="label" class="text-sm font-medium text-neutral-900 dark:text-white">
        {{ label }}
      </span>
      <p v-if="description" class="text-sm text-neutral-500 dark:text-neutral-400">
        {{ description }}
      </p>
    </div>
  </div>
</template>