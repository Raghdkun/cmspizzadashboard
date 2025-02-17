<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useLocationsStore } from '../stores/locations';
import AddLocationModal from '../components/AddLocationModal.vue';
import EditLocationModal from '../components/EditLocationModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';

import Button from '../components/ui/Button.vue';
import type { Location } from '../stores/locations';

const locationsStore = useLocationsStore();
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedLocation = ref<Location | null>(null);
const activeDropdown = ref<string | null>(null);
const searchQuery = ref('');

// Fetch locations when component is mounted
onMounted(async () => {
  await locationsStore.fetchLocations();
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Handle location added
const handleLocationAdded = async () => {
  showAddModal.value = false;
  await locationsStore.fetchLocations();
};

// Toggle dropdown for a specific location
const toggleDropdown = (event: Event, locationId: string) => {
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === locationId ? null : locationId;
};

// Handle edit action
const handleEdit = (location: Location) => {
  selectedLocation.value = location;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (location: Location) => {
  selectedLocation.value = location;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedLocation.value) {
    try {
      await locationsStore.deleteLocation(selectedLocation.value.id);
      showDeleteConfirm.value = false;
      selectedLocation.value = null;
      await locationsStore.fetchLocations();
    } catch (error) {
      console.error('Failed to delete location:', error);
    }
  }
};

// Handle successful location update
const handleLocationUpdated = async () => {
  showEditModal.value = false;
  selectedLocation.value = null;
  await locationsStore.fetchLocations();
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
    activeDropdown.value = null;
  }
};

// Filter locations based on search query
const filteredLocations = computed(() => {
  if (!searchQuery.value) return locationsStore.locations;
  
  const query = searchQuery.value.toLowerCase();
  return locationsStore.locations.filter(location => 
    location.name.toLowerCase().includes(query) ||
    location.address.toLowerCase().includes(query) ||
    location.city.toLowerCase().includes(query) ||
    location.state.toLowerCase().includes(query)
  );
});
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Locations
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage your franchise store locations
        </p>
      </div>
      <Button @click="showAddModal = true">
        Add Location
      </Button>
    </div>

    <!-- Search bar with improved visuals -->
    <div class="mb-6">
      <div class="relative max-w-md mx-auto">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
        </div>
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search locations..."
          class="block w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-sm placeholder-neutral-500 dark:placeholder-neutral-400 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
        />
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="locationsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading locations...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="locationsStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ locationsStore.error }}</p>
    </div>

    <!-- Locations grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="location in filteredLocations"
        :key="location.id"
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 relative group hover:border-primary-500 dark:hover:border-primary-500 transition-colors duration-200"
      >
        <div class="p-6">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                {{ location.name }}
              </h3>
              <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                {{ location.address }}, {{ location.city }}
              </p>
            </div>
            
            <div class="relative">
              <button
                @click="(e) => toggleDropdown(e, location.id)"
                class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              >
                <EllipsisVerticalIcon class="h-5 w-5" />
              </button>

              <!-- Dropdown menu -->
              <div
                v-show="activeDropdown === location.id"
                class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10"
              >
                <div class="py-1">
                  <button
                    @click="handleEdit(location)"
                    class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                  >
                    <PencilIcon class="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    @click="handleDelete(location)"
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
              :class="location.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'"
            >
              {{ location.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Location Modal -->
    <AddLocationModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="handleLocationAdded"
    />

    <!-- Edit Location Modal -->
    <EditLocationModal
      v-if="showEditModal && selectedLocation"
      :location="selectedLocation"
      @close="showEditModal = false"
      @updated="handleLocationUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedLocation"
      :location-name="selectedLocation.name"
      title="Delete location"
      message="Are you sure?"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>