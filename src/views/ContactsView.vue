<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ClipboardIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useContactsStore } from '../stores/contacts';
import EditContactModal from '../components/EditContactModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';

const contactsStore = useContactsStore();
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedContact = ref(null);
const activeDropdown = ref(null);
const copiedEmail = ref(null);
const searchQuery = ref('');
const exportLoading = ref(false);

// Fetch contacts when component is mounted
onMounted(async () => {
  await contactsStore.fetchContacts();
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Filter contacts based on search query
const filteredContacts = computed(() => {
  if (!searchQuery.value) return contactsStore.contacts;
  
  const query = searchQuery.value.toLowerCase();
  return contactsStore.contacts.filter(contact => 
    contact.name.toLowerCase().includes(query) ||
    contact.email.toLowerCase().includes(query) ||
    contact.subject.toLowerCase().includes(query) ||
    contact.message.toLowerCase().includes(query) ||
    contact.location.toLowerCase().includes(query)
  );
});

// Handle export CSV
const handleExport = async () => {
  try {
    exportLoading.value = true;
    await contactsStore.exportContacts('csv');
  } finally {
    exportLoading.value = false;
  }
};

// Toggle dropdown for a specific contact
const toggleDropdown = (event: Event, contactId: string) => {
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === contactId ? null : contactId;
};

// Handle edit action
const handleEdit = (contact) => {
  selectedContact.value = contact;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (contact) => {
  selectedContact.value = contact;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedContact.value) {
    try {
      await contactsStore.deleteContact(selectedContact.value.id);
      showDeleteConfirm.value = false;
      selectedContact.value = null;
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  }
};

// Handle successful contact update
const handleContactUpdated = async () => {
  showEditModal.value = false;
  selectedContact.value = null;
  await contactsStore.fetchContacts();
};

// Copy email to clipboard
const copyEmail = async (email: string) => {
  try {
    await navigator.clipboard.writeText(email);
    copiedEmail.value = email;
    setTimeout(() => {
      copiedEmail.value = null;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy email:', err);
  }
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
          Contact Management
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage and respond to customer inquiries and feedback
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

    <!-- Search bar -->
    <FormGroup class="mb-6">
      <Input
        v-model="searchQuery"
        type="search"
        placeholder="Search by name, email, subject, or message..."
      >
        <template #prefix>
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </template>
      </Input>
    </FormGroup>

    <!-- Loading state -->
    <div v-if="contactsStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading contacts...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="contactsStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ contactsStore.error }}</p>
    </div>

    <!-- Contacts list -->
    <div v-else class="space-y-4">
      <div
        v-for="contact in filteredContacts"
        :key="contact.id"
        class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 p-4"
      >
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                {{ contact.name }}
              </h3>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-blue-100 text-blue-800': contact.status === 'new',
                  'bg-yellow-100 text-yellow-800': contact.status === 'in_progress',
                  'bg-green-100 text-green-800': contact.status === 'resolved'
                }"
              >
                {{ contact.status.replace('_', ' ').charAt(0).toUpperCase() + contact.status.slice(1).replace('_', ' ') }}
              </span>
              <span
                class="px-2 py-1 text-xs font-medium rounded-full"
                :class="{
                  'bg-red-100 text-red-800': contact.priority === 'high',
                  'bg-yellow-100 text-yellow-800': contact.priority === 'medium',
                  'bg-green-100 text-green-800': contact.priority === 'low'
                }"
              >
                {{ contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1) }} Priority
              </span>
            </div>
            <p class="text-neutral-600 dark:text-neutral-400">{{ contact.subject }}</p>
            <div class="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div class="flex items-center gap-2">
                <span>{{ contact.email }}</span>
                <button
                  @click="copyEmail(contact.email)"
                  class="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                  :title="copiedEmail === contact.email ? 'Copied!' : 'Copy email'"
                >
                  <CheckIcon v-if="copiedEmail === contact.email" class="w-4 h-4 text-green-500" />
                  <ClipboardIcon v-else class="w-4 h-4" />
                </button>
              </div>
              <span>{{ contact.phone }}</span>
              <span>Received {{ contact.receivedDate }}</span>
            </div>
          </div>

          <div class="relative">
            <button
              @click="(e) => toggleDropdown(e, contact.id)"
              class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <EllipsisVerticalIcon class="h-5 w-5" />
            </button>

            <!-- Dropdown menu -->
            <div
              v-show="activeDropdown === contact.id"
              class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="py-1">
                <button
                  @click="handleEdit(contact)"
                  class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                >
                  <PencilIcon class="h-4 w-4 mr-2" />
                  Edit
                </button>
                <button
                  @click="handleDelete(contact)"
                  class="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                >
                  <TrashIcon class="h-4 w-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Contact Modal -->
    <EditContactModal
      v-if="showEditModal && selectedContact"
      :contact="selectedContact"
      @close="showEditModal = false"
      @updated="handleContactUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedContact"
      :title="'Delete Contact'"
      :message="`Are you sure you want to delete the contact from ${selectedContact.name}? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>