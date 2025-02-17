<script setup lang="ts">
import { ref } from 'vue';
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

const isDark = ref(false);

const toggleDarkMode = () => {
  isDark.value = !isDark.value;
  if (isDark.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
    <!-- Dark mode toggle -->
    <div class="fixed top-4 right-4">
      <button
        @click="toggleDarkMode"
        class="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-white/10 dark:hover:bg-black/10 rounded-lg transition-colors"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <SunIcon v-if="isDark" class="w-6 h-6" />
        <MoonIcon v-else class="w-6 h-6" />
      </button>
    </div>

    <!-- Auth content -->
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <router-view v-slot="{ Component }">
          <transition
            name="fade"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>