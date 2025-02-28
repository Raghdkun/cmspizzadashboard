<script setup lang="ts">
import {
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  BuildingStorefrontIcon,
  UserGroupIcon,
  EnvelopeIcon,
  InformationCircleIcon,
  PhotoIcon,
} from '@heroicons/vue/24/outline';
import { useRoute } from 'vue-router';

interface NavItem {
  name: string;
  icon: any;
  route: string;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const route = useRoute();

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, route: 'dashboard' },
  { name: 'Locations', icon: MapPinIcon, route: 'locations' },
  { name: 'Feedback', icon: ChatBubbleLeftIcon, route: 'feedback' },
  { name: 'Inquiries', icon: BuildingStorefrontIcon, route: 'inquiries' },
  { name: 'Contacts', icon: EnvelopeIcon, route: 'contacts' },
  { name: 'Users', icon: UserGroupIcon, route: 'users' },
  { name: 'Gallery', icon: PhotoIcon, route: 'gallery' },
  { name: 'About', icon: InformationCircleIcon, route: 'about' },
];

// Helper function to check if route is active
// Update the isRouteActive function
const isRouteActive = (itemRoute: string): boolean => {
  if (route.name === 'dashboard' && itemRoute === 'dashboard') {
    return route.path === '/dashboard';
  }
  return route.name === itemRoute || (route.path.startsWith(`/${itemRoute}`) && itemRoute !== 'dashboard');
};
</script>

<template>
  <nav
    class="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0 transform transition-all duration-300 ease-in-out z-30 overflow-y-auto"
    :class="[
      isOpen 
        ? 'translate-x-0 w-64' 
        : 'w-20 translate-x-0'
    ]"
  >
    <!-- Navigation items -->
    <div class="py-4">
      <ul class="space-y-1 px-3">
        <li v-for="item in navItems" :key="item.name">
          <router-link
            :to="{ name: item.route }"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group"
            :class="[
              isRouteActive(item.route)
                ? 'text-primary-600 bg-primary-50/80 dark:text-primary-400 dark:bg-primary-900/30'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            <!-- Icon -->
            <component
              :is="item.icon"
              class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
              :class="[
                isRouteActive(item.route)
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400'
              ]"
            />

            <!-- Label -->
            <span
              v-if="isOpen"
              class="ml-3 truncate transition-all duration-200"
              :class="[
                !isRouteActive(item.route) && 'group-hover:translate-x-1'
              ]"
            >
              {{ item.name }}
            </span>

            <!-- Tooltip for collapsed state -->
            <div
              v-if="!isOpen"
              class="absolute left-full ml-2 px-2 py-1 bg-neutral-900 dark:bg-neutral-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
            >
              {{ item.name }}
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>