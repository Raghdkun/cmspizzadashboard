<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useFeedbackStore } from '../stores/feedback';
import EditFeedbackModal from '../components/EditFeedbackModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';
import Button from '../components/ui/Button.vue';
import type { Feedback } from '../stores/feedback';

const feedbackStore = useFeedbackStore();
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedFeedback = ref<Feedback | null>(null);
const activeDropdown = ref<string | null>(null);
const exportLoading = ref(false);

// Fetch feedback when component is mounted
onMounted(async () => {
  await feedbackStore.fetchFeedback();
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Toggle dropdown for a specific feedback
const toggleDropdown = (event: Event, feedbackId: string) => {
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === feedbackId ? null : feedbackId;
};

// Handle edit action
const handleEdit = (feedback: Feedback) => {
  selectedFeedback.value = feedback;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (feedback: Feedback) => {
  selectedFeedback.value = feedback;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedFeedback.value) {
    try {
      await feedbackStore.deleteFeedback(selectedFeedback.value.id);
      showDeleteConfirm.value = false;
      selectedFeedback.value = null;
    } catch (error) {
      console.error('Failed to delete feedback:', error);
    }
  }
};

// Handle successful feedback update
const handleFeedbackUpdated = async () => {
  showEditModal.value = false;
  selectedFeedback.value = null;
  await feedbackStore.fetchFeedback();
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
    activeDropdown.value = null;
  }
};

// Render stars based on rating
const renderStars = (rating: number) => {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
};

// Handle export CSV
const handleExport = async () => {
  try {
    exportLoading.value = true;
    await feedbackStore.exportFeedback('csv');
  } finally {
    exportLoading.value = false;
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header section -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Customer Feedback
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage and analyze customer reviews and ratings
        </p>
      </div>
      <Button
        variant="secondary"
        :loading="exportLoading"
        @click="handleExport"
      >
        <template v-if="exportLoading">Exporting...</template>
        <template v-else>Export CSV</template>
      </Button>
    </div>

    <!-- Loading state -->
    <div v-if="feedbackStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading feedback...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="feedbackStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ feedbackStore.error }}</p>
    </div>

    <!-- Feedback table -->
    <div v-else class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div >
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr class="bg-neutral-50 dark:bg-neutral-800">
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Rating
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Comment
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr 
              v-for="item in feedbackStore.feedback" 
              :key="item.id"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-700/50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                {{ item.customerName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                {{ renderStars(item.rating) }}
              </td>
              <td class="px-6 py-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-md truncate">
                {{ item.comment }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ item.createdAt }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-green-100 text-green-800': item.status === 'Published',
                    'bg-yellow-100 text-yellow-800': item.status === 'Pending',
                    'bg-red-100 text-red-800': item.status === 'Archived'
                  }"
                >
                  {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative">
                  <button
                    @click="(e) => toggleDropdown(e, item.id)"
                    class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <EllipsisVerticalIcon class="h-5 w-5" />
                  </button>

                  <!-- Dropdown menu -->
                  <div
                    v-show="activeDropdown === item.id"
                    class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div class="py-1">
                      <button
                        @click="handleEdit(item)"
                        class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                      >
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        @click="handleDelete(item)"
                        class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                      >
                        <TrashIcon class="h-4 w-4 mr-2" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Feedback Modal -->
    <EditFeedbackModal
      v-if="showEditModal && selectedFeedback"
      :feedback="selectedFeedback"
      @close="showEditModal = false"
      @updated="handleFeedbackUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedFeedback"
      :title="'Delete Feedback'"
      :message="`Are you sure you want to delete feedback from ${selectedFeedback.customerName}? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
