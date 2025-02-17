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

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

const route = useRoute();

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, route: 'dashboard' },
  { name: 'Locations', icon: MapPinIcon, route: 'locations' },
  // { name: 'Events', icon: CalendarIcon, route: 'events' },
  { name: 'Feedback', icon: ChatBubbleLeftIcon, route: 'feedback' },
  { name: 'Inquiries', icon: BuildingStorefrontIcon, route: 'inquiries' },
  { name: 'Contacts', icon: EnvelopeIcon, route: 'contacts' },
  { name: 'Users', icon: UserGroupIcon, route: 'users' },
  { name: 'Gallery', icon: PhotoIcon, route: 'gallery' },
  { name: 'About', icon: InformationCircleIcon, route: 'about' },
];
</script>

<template>
  <nav
    class="w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex-shrink-0 transform transition-all duration-300 ease-in-out"
    :class="[isOpen ? 'w-64' : 'w-20']"
  >
    <!-- Logo and toggle -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-neutral-200 dark:border-neutral-700">
      <router-link
        to="/"
        class="flex items-center space-x-3"
        :class="[isOpen ? 'justify-start' : 'justify-center w-full']"
      >
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
          <span class="text-white font-bold">A</span>
        </div>
        <span v-if="isOpen" class="text-lg font-semibold text-neutral-900 dark:text-white">
          Admin
        </span>
      </router-link>
    </div>

    <!-- Navigation items -->
    <div class="py-4">
      <ul class="space-y-1 px-3">
        <li v-for="item in navItems" :key="item.name">
          <router-link
            :to="{ name: item.route }"
            class="flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative group"
            :class="[
              route.name === item.route
                ? 'text-primary-600 bg-primary-50/80 dark:text-primary-400 dark:bg-primary-900/30'
                : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400'
            ]"
          >
            <!-- Hover background effect -->
            <div
              class="absolute inset-0 rounded-lg bg-primary-50/0 dark:bg-primary-900/0 transition-all duration-200 -z-10"
              :class="[
                route.name !== item.route && 'group-hover:bg-primary-50/60 dark:group-hover:bg-primary-900/20'
              ]"
            ></div>

            <!-- Icon -->
            <component
              :is="item.icon"
              class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
              :class="[
                route.name === item.route
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-neutral-400 dark:text-neutral-500 group-hover:text-primary-600 dark:group-hover:text-primary-400'
              ]"
            />

            <!-- Label -->
            <span
              v-if="isOpen"
              class="ml-3 truncate transition-all duration-200"
              :class="[
                route.name !== item.route && 'group-hover:translate-x-1'
              ]"
            >
              {{ item.name }}
            </span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>