<script setup lang="ts">
import { onMounted } from 'vue';
import { BellIcon } from '@heroicons/vue/24/outline';
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

const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead();
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
        <BellIcon class="w-8 h-8 text-primary-600" />
        Notifications
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Stay updated with the latest alerts and activities
      </p>
    </div>

    <!-- Notifications List -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
      <!-- Loading state -->
      <div v-if="notificationsStore.loading" class="p-8 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
        <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading notifications...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="notificationsStore.error" class="p-8 text-center">
        <p class="text-red-600 dark:text-red-400">{{ notificationsStore.error }}</p>
      </div>

      <!-- Content -->
      <div v-else>
        <div class="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
          <span class="text-sm text-neutral-500 dark:text-neutral-400">
            {{ notificationsStore.meta.count }} Notifications ({{ notificationsStore.meta.unread }} unread)
          </span>
          <button
            v-if="notificationsStore.unreadCount() > 0"
            @click="notificationsStore.markAllAsRead()"
            class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Mark all as read
          </button>
        </div>

        <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
          <div
            v-for="notification in notificationsStore.notifications"
            :key="notification.id"
            class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': !notification.is_read }"
          >
            <div class="flex gap-4">
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <p class="text-sm text-neutral-900 dark:text-white">
                    {{ notification.message }}
                  </p>
                  <span class="text-xs text-neutral-500 dark:text-neutral-400 ml-4">
                    {{ formatTime(notification.created_at) }}
                  </span>
                </div>
                
                <div v-if="!notification.is_read" class="mt-2">
                  <button
                    v-if="!notification.is_read"
                    @click.stop="handleMarkAsRead(notification.id)"
                    class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>