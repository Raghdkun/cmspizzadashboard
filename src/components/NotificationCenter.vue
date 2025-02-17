<script setup lang="ts">
const notifications = [
  {
    id: 1,
    title: 'New user registration',
    time: '5 minutes ago',
    type: 'info',
  },
  {
    id: 2,
    title: 'Server CPU usage high',
    time: '15 minutes ago',
    type: 'warning',
  },
  {
    id: 3,
    title: 'Payment processed',
    time: '1 hour ago',
    type: 'success',
  },
];
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
    <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Notifications</h2>
      <router-link 
        to="/dashboard/notifications" 
        class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        View all
      </router-link>
    </div>
    <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
      >
        <div class="flex items-start">
          <div
            :class="[
              'w-2 h-2 mt-2 rounded-full mr-3',
              {
                'bg-blue-500': notification.type === 'info',
                'bg-yellow-500': notification.type === 'warning',
                'bg-green-500': notification.type === 'success',
              },
            ]"
          ></div>
          <div>
            <p class="text-sm font-medium text-neutral-900 dark:text-white">
              {{ notification.title }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {{ notification.time }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>