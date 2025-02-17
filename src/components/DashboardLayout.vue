<script setup lang="ts">
import { ref } from 'vue';
import Navigation from './Navigation.vue';
import TopNavigation from './TopNavigation.vue';

const isSidebarOpen = ref(window.innerWidth >= 1024);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Handle window resize
const handleResize = () => {
  if (window.innerWidth < 1024) {
    isSidebarOpen.value = false;
  }
};

// Add resize listener
if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
    <!-- Overlay for mobile when sidebar is open -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-20 lg:hidden"
      @click="toggleSidebar"
    ></div>

    <!-- Navigation -->
    <Navigation
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
      class="fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out lg:translate-x-0"
      :class="[isSidebarOpen ? 'translate-x-0' : '-translate-x-full']"
    />

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out min-h-screen"
      :class="[isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20']"
    >
      <!-- Top Navigation -->
      <TopNavigation 
        :is-sidebar-open="isSidebarOpen" 
        @toggle-sidebar="toggleSidebar" 
      />

      <!-- Main Content Area -->
      <main class="p-4 md:p-6 lg:p-8 mt-16">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition-opacity duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>