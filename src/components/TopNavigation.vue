<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useNotificationsStore } from '../stores/notifications';
import {
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/vue/24/outline';
import ThemeToggle from './ThemeToggle.vue';
import type { Notification } from '../stores/notifications';
let interval: NodeJS.Timeout;

const props = defineProps<{
  isSidebarOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:isSidebarOpen', value: boolean): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const showUserMenu = ref(false);
const showNotifications = ref(false);

// Load and refresh notifications
const loadNotifications = async () => {
  try {
    await notificationsStore.fetchNotifications();
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

// Single onMounted hook
onMounted(() => {
  loadNotifications();
  interval = setInterval(loadNotifications, 60000);
  document.addEventListener('click', closeDropdowns);
  document.addEventListener('click', handleClickOutside);
});

// Single cleanup function
const cleanup = () => {
  if (typeof interval !== 'undefined' && interval !== null) {
    clearInterval(interval);
  }
  document.removeEventListener('click', closeDropdowns);
  document.removeEventListener('click', handleClickOutside);
};

// Single onUnmounted hook
onUnmounted(() => {
  cleanup();
});
const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const isClickOnSidebar = target.closest('.navigation-menu');
  const isClickOnToggle = target.closest('.sidebar-toggle');
  
  if (!isClickOnSidebar && !isClickOnToggle) {
    emit('update:isSidebarOpen', false);
  }
};
const toggleSidebar = (e: MouseEvent) => {
  e.stopPropagation(); // Stop event propagation
  emit('update:isSidebarOpen', !props.isSidebarOpen);
};
const handleLogout = async () => {
  try {
    await authStore.logout();
    router.push('/auth/login');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Format timestamp to relative time
const formatTime = (timestamp: string) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
};
// Add this function with the other notification handlers
const handleNotificationClick = async (notification: Notification) => {
  try {
    if (!notification.is_read) {
      await notificationsStore.markAsRead(notification.id);
      await loadNotifications(); // Refresh notifications after marking as read
    }
    // You can add additional handling here, like navigation to a specific route
    showNotifications.value = false; // Close the notifications dropdown
  } catch (error) {
    console.error('Failed to handle notification click:', error);
  }
};

// Close dropdowns when clicking outside
const closeDropdowns = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.notifications-button') && !target.closest('.notifications-menu')) {
    showNotifications.value = false;
  }
  if (!target.closest('.user-button') && !target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
};

// Handle mark as read with error handling
const handleMarkAsRead = async (id: string) => {
  try {
    await notificationsStore.markAsRead(id);
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

// Handle mark all as read with error handling
const handleMarkAllAsRead = async () => {
  try {
    await notificationsStore.markAllAsRead();
    showNotifications.value = false;
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 z-40">
    <div class="px-4 sm:px-6">
      <div class="flex justify-between h-16">
        <!-- Left side -->
        <div class="flex items-center">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-3"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center flex-shrink-0">
              <span class="text-white font-bold">P</span>
            </div>
            <span class="text-lg font-semibold text-neutral-900 dark:text-white truncate hidden sm:inline">
              Pizza Admin
            </span>
          </router-link>
        </div>
        
        <!-- Right side -->
        <div class="flex items-center gap-2">
          <!-- Notifications -->
          <div class="relative">
            <!-- Update the notifications button -->
            <button
              class="notifications-button p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700 relative"
              @click.stop="showNotifications = !showNotifications"
            >
              <BellIcon class="h-6 w-6" />
              <span
                v-if="notificationsStore.meta.unread > 0"
                class="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"
              ></span>
            </button>

            <!-- Notifications dropdown -->
            <div
              v-if="showNotifications"
              class="notifications-menu absolute right-0 mt-2 w-96 max-h-[32rem] rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden"
            >
              <!-- Update the notifications header section -->
              <div class="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
                <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                  Notifications ({{ notificationsStore.meta.unread }})
                </h3>
                <div class="flex items-center gap-2">
                  <button
                    @click="loadNotifications"
                    class="p-1.5 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                    :class="{ 'animate-spin': notificationsStore.loading }"
                    :disabled="notificationsStore.loading"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  </button>
                  <button
                    v-if="notificationsStore.meta.unread > 0"
                    @click="handleMarkAllAsRead"
                    class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    Mark all as read
                  </button>
                </div>
              </div>

              <div class="overflow-y-auto max-h-96">
                <div v-if="notificationsStore.loading" class="p-4 text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent mx-auto"></div>
                </div>

                <template v-else-if="notificationsStore.notifications.length > 0">
                  <div
                    v-for="notification in notificationsStore.notifications"
                    :key="notification.id"
                    class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer border-b border-neutral-200 dark:border-neutral-700 transition-colors"
                    :class="{ 'bg-primary-50 dark:bg-primary-900/20': !notification.is_read }"
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="flex gap-3">
                      <div class="flex-1">
                        <p class="text-sm text-neutral-900 dark:text-white">
                          {{ notification.message }}
                        </p>
                        <div class="mt-2 flex items-center justify-between">
                          <span class="text-xs text-neutral-500 dark:text-neutral-400">
                            {{ formatTime(notification.created_at) }}
                          </span>
                          <button
                            v-if="!notification.is_read"
                            @click.stop="handleMarkAsRead(notification.id)"
                            class="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                          >
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <div
                  v-else
                  class="p-4 text-sm text-center text-neutral-500 dark:text-neutral-400"
                >
                  No notifications
                </div>
              </div>
            </div>
          </div>

          <!-- Theme Toggle -->
          <ThemeToggle />

          <!-- User Menu -->
          <div class="relative">
            <button
              @click.stop="showUserMenu = !showUserMenu"
              class="user-button flex items-center gap-2 p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
            >
              <UserCircleIcon class="h-6 w-6" />
              <span class="text-sm font-medium hidden sm:inline">{{ authStore.user?.name }}</span>
              <ChevronDownIcon class="h-4 w-4" :class="{ 'rotate-180': showUserMenu }" />
            </button>
            
            <!-- User dropdown menu -->
            <div
              v-if="showUserMenu"
              class="user-menu absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
              @click.stop
            >
              <div class="py-1">
                <div class="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                  <p class="text-sm font-medium text-neutral-900 dark:text-white">{{ authStore.user?.name }}</p>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ authStore.user?.email }}</p>
                </div>
                <router-link
                  to="/dashboard/profile"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  @click="showUserMenu = false"
                >
                  <UserCircleIcon class="h-5 w-5" />
                  Profile
                </router-link>
                <router-link
                  to="/dashboard/settings"
                  class="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-700"
                  @click="showUserMenu = false"
                >
                  <CogIcon class="h-5 w-5" />
                  Settings
                </router-link>
                <button
                  @click="handleLogout"
                  class="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <ArrowRightOnRectangleIcon class="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>