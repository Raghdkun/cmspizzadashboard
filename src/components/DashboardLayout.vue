<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Navigation from './Navigation.vue';
import TopNavigation from './TopNavigation.vue';

const isSidebarOpen = ref(window.innerWidth >= 1024);

const handleResize = () => {
  if (window.innerWidth >= 1024) {
    isSidebarOpen.value = true;
  } else {
    isSidebarOpen.value = false;
  }
};

// Setup event listeners with debounce
onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="min-h-screen bg-neutral-50 dark:bg-neutral-900">
    <!-- Overlay for mobile when sidebar is open -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-20 lg:hidden"
      @click="isSidebarOpen = false"
    ></div>

    <!-- Navigation -->
    <Navigation :is-open="isSidebarOpen" />

    <!-- Main Content -->
    <div
      class="transition-all duration-300 ease-in-out min-h-screen"
      :class="[isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20']"
    >
      <!-- Top Navigation -->
      <TopNavigation 
        :is-sidebar-open="isSidebarOpen"
        @update:is-sidebar-open="isSidebarOpen = $event"
      />

      <!-- Main Content Area -->
      <main class="p-4 md:p-6 lg:p-8 mt-16">
        <router-view v-slot="{ Component }">
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 transform translate-y-4"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>