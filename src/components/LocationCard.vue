<script setup lang="ts">
import { ref } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import type { Location } from '../stores/locations';
import { useLocationsStore } from '../stores/locations';
import EditLocationModal from './EditLocationModal.vue';
import DeleteConfirmationModal from './DeleteConfirmationModal.vue';

// Props for the component
const props = defineProps<{
  location: Location;
}>();

const locationsStore = useLocationsStore();

// UI state management
const showMenu = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);

// Toggle dropdown menu
const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};

// Handle edit button click
const handleEdit = () => {
  showEditModal.value = true;
  showMenu.value = false;
};

// Handle delete button click
const handleDelete = () => {
  showDeleteConfirm.value = true;
  showMenu.value = false;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  try {
    await locationsStore.deleteLocation(props.location.id);
    showDeleteConfirm.value = false;
  } catch (error) {
    console.error('Failed to delete location:', error);
  }
};

// Handle successful location update
const handleLocationUpdated = async () => {
  showEditModal.value = false;
  await locationsStore.fetchLocations(); // Refresh the list
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700">
    <!-- Location image -->
    <img 
      :src="location.imageUrl" 
      :alt="location.name"
      class="w-full h-48 object-cover"
    />
    
    <!-- Actions Menu -->
    <div class="absolute top-2 right-2">
      <button
        @click="toggleMenu"
        class="p-1 rounded-full bg-white/90 dark:bg-black/50 hover:bg-white dark:hover:bg-black/70 text-neutral-700 dark:text-white transition-colors"
      >
        <EllipsisVerticalIcon class="w-6 h-6" />
      </button>

      <!-- Dropdown Menu -->
      <div
        v-if="showMenu"
        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5 z-10"
      >
        <div class="py-1">
          <button
            @click="handleEdit"
            class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <PencilIcon class="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            @click="handleDelete"
            class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <TrashIcon class="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Location details -->
    <div class="p-4">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
          {{ location.name }}
        </h3>
        <span 
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="location.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        >
          {{ location.isActive ? 'Active' : 'Inactive' }}
        </span>
      </div>
      
      <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
        {{ location.address }}, {{ location.city }}, {{ location.state }} {{ location.zipCode }}
      </p>
      
      <p class="text-neutral-500 dark:text-neutral-500 text-sm">
        {{ location.description }}
      </p>
    </div>

    <!-- Edit Modal -->
    <EditLocationModal
      v-if="showEditModal"
      :location="location"
      @close="showEditModal = false"
      @updated="handleLocationUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm"
      :location-name="location.name"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>