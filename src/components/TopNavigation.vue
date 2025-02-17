<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline';
import ThemeToggle from './ThemeToggle.vue';

const props = defineProps<{
  isSidebarOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggleSidebar'): void;
}>();

const router = useRouter();
const authStore = useAuthStore();
const notificationsStore = useNotificationsStore();
const showUserMenu = ref(false);
const showNotifications = ref(false);

// Initialize CSRF protection
const initializeCsrf = async () => {
  /* 
  // Uncomment to enable Sanctum CSRF protection
  try {
    // Get CSRF cookie from Laravel Sanctum
    await api.get('/sanctum/csrf-cookie');
  } catch (error) {
    console.error('Failed to initialize CSRF protection:', error);
  }
  */
};

// Load notifications on mount
onMounted(async () => {
  try {
    await notificationsStore.fetchNotifications('admin');
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

// Handle notification click
const handleNotificationClick = async (notification: any) => {
  if (!notification.read) {
    await notificationsStore.markAsRead(notification.id);
  }
  if (notification.link) {
    router.push(notification.link);
    showNotifications.value = false;
  }
};

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

// Close dropdowns when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.user-menu-trigger') && !target.closest('.user-menu')) {
    showUserMenu.value = false;
  }
  if (!target.closest('.notifications-trigger') && !target.closest('.notifications-menu')) {
    showNotifications.value = false;
  }
};

// Add click outside listener
onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav
    class="fixed top-0 right-0 left-0 h-16 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700 z-20 transition-all duration-300 ease-in-out"
    :class="[isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20']"
  >
    <div class="h-full px-4 flex items-center justify-between gap-4">
      <!-- Left side with menu toggle -->
      <div class="flex items-center lg:hidden">
        <button
          @click="$emit('toggleSidebar')"
          class="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Toggle navigation"
        >
          <Bars3Icon class="w-6 h-6 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>

      <!-- Right side actions -->
      <div class="flex items-center gap-2 md:gap-4 ml-auto">
        <!-- Notifications -->
        <div class="relative">
          <button
            @click="showNotifications = !showNotifications"
            class="notifications-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <BellIcon class="w-6 h-6" />
            <span
              v-if="notificationsStore.unreadCount() > 0"
              class="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-primary-600 text-white text-xs font-medium rounded-full"
            >
              {{ notificationsStore.unreadCount() }}
            </span>
          </button>

          <!-- Notifications dropdown -->
          <div
            v-show="showNotifications"
            class="notifications-menu absolute right-0 mt-2 w-96 max-h-[32rem] rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 overflow-hidden"
          >
            <div class="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                Notifications
              </h3>
              <button
                v-if="notificationsStore.unreadCount() > 0"
                @click="notificationsStore.markAllAsRead()"
                class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Mark all as read
              </button>
            </div>

            <div class="overflow-y-auto max-h-96">
              <template v-if="notificationsStore.notifications.length > 0">
                <div
                  v-for="notification in notificationsStore.notifications"
                  :key="notification.id"
                  @click="handleNotificationClick(notification)"
                  class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 cursor-pointer border-b border-neutral-200 dark:border-neutral-700 transition-colors"
                  :class="{ 'bg-primary-50 dark:bg-primary-900/20': !notification.read }"
                >
                  <div class="flex gap-3">
                    <component
                      :is="getNotificationIcon(notification.type)"
                      class="w-5 h-5 flex-shrink-0 mt-1"
                      :class="getNotificationColor(notification.type)"
                    />
                    <div class="flex-1">
                      <p class="text-sm font-medium text-neutral-900 dark:text-white">
                        {{ notification.title }}
                      </p>
                      <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {{ notification.message }}
                      </p>
                      <div class="mt-2 flex items-center justify-between">
                        <span class="text-xs text-neutral-500 dark:text-neutral-400">
                          {{ formatTime(notification.timestamp) }}
                        </span>
                        <div v-if="notification.actions" class="flex gap-2">
                          <button
                            v-for="action in notification.actions"
                            :key="action.label"
                            class="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            @click.stop="$emit(action.action, notification)"
                          >
                            {{ action.label }}
                          </button>
                        </div>
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

        <!-- Theme toggle -->
        <ThemeToggle />

        <!-- User menu -->
        <div class="relative">
          <button
            @click="showUserMenu = !showUserMenu"
            class="user-menu-trigger flex items-center gap-2 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <div
              class="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center shadow-sm"
            >
              <span class="text-sm font-medium">
                {{ authStore.user?.name ? authStore.user.name.charAt(0).toUpperCase() : 'U' }}
              </span>
            </div>
            <ChevronDownIcon class="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </button>

          <!-- User dropdown menu -->
          <div
            v-if="showUserMenu"
            class="user-menu absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-neutral-800 shadow-lg border border-neutral-200 dark:border-neutral-700 z-50"
          >
            <div class="p-3 border-b border-neutral-200 dark:border-neutral-700">
              <p class="text-sm font-medium text-neutral-900 dark:text-white">
                {{ authStore.user?.name || 'User Name' }}
              </p>
              <p class="text-xs text-neutral-500 dark:text-neutral-400">
                {{ authStore.user?.email || 'user@example.com' }}
              </p>
            </div>
            <div class="p-2">
              <router-link
                to="/dashboard/profile"
                class="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              >
                <UserCircleIcon class="w-5 h-5" />
                Profile
              </router-link>
              <router-link
                to="/dashboard/settings"
                class="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              >
                <CogIcon class="w-5 h-5" />
                Settings
              </router-link>
              <button
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md"
              >
                <ArrowRightOnRectangleIcon class="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
