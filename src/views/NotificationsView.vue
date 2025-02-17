<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BellIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import { useNotificationsStore } from '../stores/notifications';

const notificationsStore = useNotificationsStore();

onMounted(async () => {
  await notificationsStore.fetchNotifications('admin');
});

// Get notification icon based on type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon;
    case 'warning':
    case 'error':
      return ExclamationCircleIcon;
    default:
      return InformationCircleIcon;
  }
};

// Get notification color based on type
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500 dark:text-green-400';
    case 'warning':
      return 'text-yellow-500 dark:text-yellow-400';
    case 'error':
      return 'text-red-500 dark:text-red-400';
    default:
      return 'text-blue-500 dark:text-blue-400';
  }
};

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
            {{ notificationsStore.notifications.length }} Notifications
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
            :class="{ 'bg-primary-50 dark:bg-primary-900/20': !notification.read }"
          >
            <div class="flex gap-4">
              <component
                :is="getNotificationIcon(notification.type)"
                class="w-6 h-6 flex-shrink-0"
                :class="getNotificationColor(notification.type)"
              />
              <div class="flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-sm font-medium text-neutral-900 dark:text-white">
                      {{ notification.title }}
                    </h3>
                    <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      {{ notification.message }}
                    </p>
                  </div>
                  <span class="text-xs text-neutral-500 dark:text-neutral-400">
                    {{ formatTime(notification.timestamp) }}
                  </span>
                </div>
                
                <div v-if="notification.actions" class="mt-3 flex gap-3">
                  <button
                    v-for="action in notification.actions"
                    :key="action.label"
                    class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    @click="$emit(action.action, notification)"
                  >
                    {{ action.label }}
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