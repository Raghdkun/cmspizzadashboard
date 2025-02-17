<script setup lang="ts">
import { ref } from 'vue';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/vue/24/outline';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
const showMenu = ref(false);

const themes = [
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
] as const;

const getCurrentIcon = () => {
  const theme = themes.find(t => t.value === themeStore.theme);
  return theme?.icon || SunIcon;
};
</script>

<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
      :aria-label="'Switch theme'"
    >
      <component :is="getCurrentIcon()" class="w-6 h-6" />
    </button>

    <!-- Theme menu -->
    <div
      v-show="showMenu"
      class="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 z-50 py-1"
    >
      <button
        v-for="theme in themes"
        :key="theme.value"
        @click="() => { themeStore.theme = theme.value; showMenu = false; }"
        class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
        :class="{ 'bg-neutral-50 dark:bg-neutral-700/50': themeStore.theme === theme.value }"
      >
        <component :is="theme.icon" class="w-5 h-5 mr-3" />
        {{ theme.label }}
      </button>
    </div>
  </div>
</template>