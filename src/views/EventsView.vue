<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useEventsStore } from '../stores/events';
import AddEventModal from '../components/AddEventModal.vue';
import EditEventModal from '../components/EditEventModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';
import type { Event } from '../stores/events';

const eventsStore = useEventsStore();
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedEvent = ref<Event | null>(null);
const activeDropdown = ref<string | null>(null);

// Fetch events when component is mounted
onMounted(async () => {
  await eventsStore.fetchEvents();
  // Add click outside listener
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Handle event added
const handleEventAdded = async () => {
  showAddModal.value = false;
  await eventsStore.fetchEvents(); // Refresh the list
};

// Toggle dropdown for a specific event
const toggleDropdown = (event: Event, eventId: string) => {
  event.stopPropagation(); // Prevent event from bubbling up
  activeDropdown.value = activeDropdown.value === eventId ? null : eventId;
};

// Handle edit action
const handleEdit = (event: Event) => {
  selectedEvent.value = event;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (event: Event) => {
  selectedEvent.value = event;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedEvent.value) {
    try {
      await eventsStore.deleteEvent(selectedEvent.value.id);
      showDeleteConfirm.value = false;
      selectedEvent.value = null;
      await eventsStore.fetchEvents(); // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }
};

// Handle successful event update
const handleEventUpdated = async () => {
  showEditModal.value = false;
  selectedEvent.value = null;
  await eventsStore.fetchEvents(); // Refresh the list
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
    activeDropdown.value = null;
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Events
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage your community events and activities
        </p>
      </div>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
      >
        Add Event
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="eventsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading events...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="eventsStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ eventsStore.error }}</p>
    </div>

    <!-- Events grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="event in eventsStore.events"
        :key="event.id"
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 relative"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                {{ event.title }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {{ event.description }}
              </p>
              <div class="mt-4 space-y-2">
                <p class="text-sm text-neutral-600 dark:text-neutral-300">
                  📅 {{ event.date }} at {{ event.time }}
                </p>
                <p class="text-sm text-neutral-600 dark:text-neutral-300">
                  📍 {{ event.location }}
                </p>
                <p class="text-sm text-neutral-600 dark:text-neutral-300">
                  👥 Max attendees: {{ event.maxAttendees }}
                </p>
              </div>
            </div>
            
            <div class="relative">
              <button
                @click="(e) => toggleDropdown(e, event.id)"
                class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <EllipsisVerticalIcon class="h-5 w-5" />
              </button>

              <!-- Dropdown menu -->
              <div
                v-show="activeDropdown === event.id"
                class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1">
                  <button
                    @click="handleEdit(event)"
                    class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  >
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    @click="handleDelete(event)"
                    class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  >
                    <TrashIcon class="h-4 w-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4">
            <span
              class="px-2 py-1 text-xs font-medium rounded-full"
              :class="{
                'bg-green-100 text-green-800': event.status === 'upcoming',
                'bg-blue-100 text-blue-800': event.status === 'ongoing',
                'bg-neutral-100 text-neutral-800': event.status === 'completed',
                'bg-red-100 text-red-800': event.status === 'cancelled'
              }"
            >
              {{ event.status.charAt(0).toUpperCase() + event.status.slice(1) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Event Modal -->
    <AddEventModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="handleEventAdded"
    />

    <!-- Edit Event Modal -->
    <EditEventModal
      v-if="showEditModal && selectedEvent"
      :event="selectedEvent"
      @close="showEditModal = false"
      @updated="handleEventUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedEvent"
      :title="'Delete Event'"
      :message="`Are you sure you want to delete '${selectedEvent.title}'? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>