<script setup lang="ts">
import { onMounted } from 'vue';
import { useNotificationsStore } from '../stores/notifications';

const notificationsStore = useNotificationsStore();

onMounted(async () => {
  await notificationsStore.fetchNotifications();
});

// Format timestamp to relative time
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const handleMarkAsRead = async (id: string) => {
  try {
    await notificationsStore.markAsRead(id);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
    <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
        Notifications ({{ notificationsStore.unreadCount() }})
      </h2>
      <router-link 
        to="/dashboard/notifications" 
        class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        View all
      </router-link>
    </div>
    <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
      <div
        v-for="notification in notificationsStore.notifications.slice(0, 5)"
        :key="notification.id"
        class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer transition-colors"
        :class="{ 'bg-primary-50 dark:bg-primary-900/20': !notification.is_read }"
        @click="handleMarkAsRead(notification.id)"
      >
        <div class="flex items-start">
          <div
            class="w-2 h-2 mt-2 rounded-full mr-3 bg-primary-500"
            :class="{ 'opacity-0': notification.is_read }"
          ></div>
          <div>
            <p class="text-sm text-neutral-900 dark:text-white">
              {{ notification.message }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {{ formatTime(notification.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>