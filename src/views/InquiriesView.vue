<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useInquiriesStore } from '../stores/inquiries';
import AddInquiryModal from '../components/AddInquiryModal.vue';
import EditInquiryModal from '../components/EditInquiryModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';
import type { Inquiry } from '../stores/inquiries';

const inquiriesStore = useInquiriesStore();
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedInquiry = ref<Inquiry | null>(null);
const activeDropdown = ref<string | null>(null);
const searchQuery = ref('');
const exportLoading = ref(false);

// Fetch inquiries when component is mounted
onMounted(async () => {
  await inquiriesStore.fetchInquiries();
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Filter inquiries based on search query (using name, email, phone, and info)
const filteredInquiries = computed(() => {
  if (!searchQuery.value) return inquiriesStore.inquiries;
  
  const query = searchQuery.value.toLowerCase();
  return inquiriesStore.inquiries.filter(inquiry => 
    inquiry.name.toLowerCase().includes(query) ||
    inquiry.email.toLowerCase().includes(query) ||
    inquiry.phone.toLowerCase().includes(query) ||
    inquiry.info.toLowerCase().includes(query)
  );
});

// Handle export CSV
const handleExport = async () => {
  try {
    exportLoading.value = true;
    await inquiriesStore.exportInquiries('csv');
  } finally {
    exportLoading.value = false;
  }
};

// Handle inquiry added
const handleInquiryAdded = async () => {
  showAddModal.value = false;
  await inquiriesStore.fetchInquiries();
};

// Toggle dropdown for a specific inquiry
const toggleDropdown = (event: Event, inquiryId: string) => {
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === inquiryId ? null : inquiryId;
};

// Handle edit action
const handleEdit = (inquiry: Inquiry) => {
  selectedInquiry.value = inquiry;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (inquiry: Inquiry) => {
  selectedInquiry.value = inquiry;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedInquiry.value) {
    try {
      await inquiriesStore.deleteInquiry(selectedInquiry.value.id);
      showDeleteConfirm.value = false;
      selectedInquiry.value = null;
    } catch (error) {
      console.error('Failed to delete inquiry:', error);
    }
  }
};

// Handle successful inquiry update
const handleInquiryUpdated = async () => {
  showEditModal.value = false;
  selectedInquiry.value = null;
  await inquiriesStore.fetchInquiries();
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
          Store Acquisition Inquiries
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage and track potential store acquisition leads
        </p>
      </div>
      <div class="flex gap-4">
        <Button variant="secondary" :loading="exportLoading" @click="handleExport">
          <template v-if="exportLoading">Exporting...</template>
          <template v-else>Export CSV</template>
        </Button>
        <Button @click="showAddModal = true">
          Add Inquiry
        </Button>
      </div>
    </div>

    <!-- Search bar -->
    <FormGroup class="mb-6">
      <Input v-model="searchQuery" type="search" placeholder="Search by name, email, phone, or info...">
        <template #prefix>
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </template>
      </Input>
    </FormGroup>

    <!-- Loading state -->
    <div v-if="inquiriesStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading inquiries...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="inquiriesStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ inquiriesStore.error }}</p>
    </div>

    <!-- Inquiries table -->
    <div v-else class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div>
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr class="bg-neutral-50 dark:bg-neutral-800">
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Info
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Submitted
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr v-for="item in filteredInquiries" :key="item.id" class="hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-white">
                {{ item.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ item.info }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-neutral-900 dark:text-white">{{ item.email }}</div>
                <div class="text-sm text-neutral-500 dark:text-neutral-400">{{ item.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-blue-100 text-blue-800': item.status === 'New',
                    'bg-yellow-100 text-yellow-800': item.status === 'In Review',
                    'bg-purple-100 text-purple-800': item.status === 'Contacted',
                    'bg-gray-100 text-gray-800': item.status === 'Closed'
                  }"
                >
                  {{ item.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ item.createdAt.split('T')[0] }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative">
                  <button @click="(e) => toggleDropdown(e, item.id)" class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <EllipsisVerticalIcon class="h-5 w-5" />
                  </button>
                  <div v-show="activeDropdown === item.id" class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div class="py-1">
                      <button @click="handleEdit(item)" class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600">
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button @click="handleDelete(item)" class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-600">
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

    <!-- Modals -->
    <AddInquiryModal v-if="showAddModal" @close="showAddModal = false" @added="handleInquiryAdded" />
    <EditInquiryModal v-if="showEditModal && selectedInquiry" :inquiry="selectedInquiry" @close="showEditModal = false" @updated="handleInquiryUpdated" />
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedInquiry"
      :title="'Delete Inquiry'"
      :message="`Are you sure you want to delete the inquiry from ${selectedInquiry.name}? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
