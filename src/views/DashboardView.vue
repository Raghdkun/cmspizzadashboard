<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardMetrics from '../components/DashboardMetrics.vue';
import NotificationCenter from '../components/NotificationCenter.vue';
import ActionItems from '../components/ActionItems.vue';
import DataVisualizations from '../components/DataVisualizations.vue';
import { useAuthStore } from '@/stores/auth';

// Get current time for greeting
const currentHour = new Date().getHours();
const greeting = ref('');
const authStore = useAuthStore();

const user = ref(authStore.user) ; 
onMounted(() => {
  // Set appropriate greeting based on time of day
  if (currentHour < 12) {
    greeting.value = 'Good morning';
  } else if (currentHour < 18) {
    greeting.value = 'Good afternoon';
  } else {
    greeting.value = 'Good evening';
  }
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main Content -->
    <div class="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
      <!-- Greeting Section -->
      <div class="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <!-- Content -->
        <div class="relative">
          <h1 class="text-3xl md:text-4xl font-bold text-white mb-2">
            {{ greeting }}, {{ user?.name }}
          </h1>
          <p class="text-white/80">
            Welcome back to the dashboard. Most of the elements bellow are static suggested by AI so if you have any suggestions i'm super ready to apply it.
          </p>
        </div>
      </div>

      <!-- Dashboard Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content Area -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Metrics Cards -->
          <div class="flex flex-col gap-6">
            <DashboardMetrics />
          </div>

          <!-- Data Visualizations -->
          <div class="flex flex-col gap-6">
            <DataVisualizations />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="flex flex-col gap-6">
          <!-- Notifications -->
          <div class="flex-1">
            <NotificationCenter />
          </div>

          <!-- Action Items -->
          <div class="flex-1">
            <ActionItems />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-auto border-t border-neutral-200 dark:border-neutral-700">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col items-center justify-center space-y-2">
          <div class="flex items-center gap-2">
            <span class="text-sm text-neutral-500 dark:text-neutral-400">Made with</span>
            <span class="text-red-500 animate-pulse">❤</span>
            <span class="text-sm text-neutral-500 dark:text-neutral-400">by R&D</span>
          </div>
          <div class="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
            Version 1.0.0
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.bg-pattern {
  background-image: radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.1) 1px, transparent 0);
  background-size: 20px 20px;
}
</style>