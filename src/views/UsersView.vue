<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon, ClipboardIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useUsersStore } from '../stores/users';
import type { User } from '../stores/users';
import AddUserModal from '../components/AddUserModal.vue';
import EditUserModal from '../components/EditUserModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import Button from '../components/ui/Button.vue';

const usersStore = useUsersStore();
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const selectedUser = ref<User | null>(null);
const activeDropdown = ref<number | null>(null);
const copiedEmail = ref<string | null>(null);
const searchQuery = ref('');
const exportLoading = ref(false);

// Fetch users when component is mounted
onMounted(async () => {
  await usersStore.fetchUsers();
  document.addEventListener('click', handleClickOutside);
});

// Remove event listener on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return usersStore.users;
  
  const query = searchQuery.value.toLowerCase();
  return usersStore.users.filter(user =>
    user.name.toLowerCase().includes(query) ||
    user.email.toLowerCase().includes(query) ||
    user.role.toLowerCase().includes(query)
  );
});

// Handle user added
const handleUserAdded = async () => {
  showAddModal.value = false;
  await usersStore.fetchUsers();
};

// Toggle dropdown for a specific user
const toggleDropdown = (event: Event, userId: number) => {
  event.stopPropagation();
  activeDropdown.value = activeDropdown.value === userId ? null : userId;
};

// Handle edit action
const handleEdit = (user: User) => {
  selectedUser.value = user;
  showEditModal.value = true;
  activeDropdown.value = null;
};

// Handle delete action
const handleDelete = (user: User) => {
  selectedUser.value = user;
  showDeleteConfirm.value = true;
  activeDropdown.value = null;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedUser.value) {
    try {
      await usersStore.deleteUser(selectedUser.value.id);
      showDeleteConfirm.value = false;
      selectedUser.value = null;
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  }
};

// Handle successful user update
const handleUserUpdated = async () => {
  showEditModal.value = false;
  selectedUser.value = null;
  await usersStore.fetchUsers();
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

// Handle export CSV
const handleExport = async () => {
  try {
    exportLoading.value = true;
    await usersStore.exportUsers('csv');
  } finally {
    exportLoading.value = false;
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
          Users
        </h1>
        <p class="text-neutral-500 dark:text-neutral-400">
          Manage user accounts and permissions
        </p>
      </div>
      <div class="flex gap-4">
        <Button
          variant="secondary"
          :loading="exportLoading"
          @click="handleExport"
        >
          <template v-if="exportLoading">Exporting...</template>
          <template v-else>Export CSV</template>
        </Button>
        <Button @click="showAddModal = true">
          Add User
        </Button>
      </div>
    </div>

    <!-- Search bar -->
    <FormGroup class="mb-6">
      <Input
        v-model="searchQuery"
        type="search"
        placeholder="Search by name, email, or role..."
      >
        <template #prefix>
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
        </template>
      </Input>
    </FormGroup>

    <!-- Loading state -->
    <div v-if="usersStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading users...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="usersStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ usersStore.error }}</p>
    </div>

    <!-- Users table -->
    <div v-else class="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div>
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr class="bg-neutral-50 dark:bg-neutral-800">
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Role
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Last Update
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr 
              v-for="user in filteredUsers" 
              :key="user.id"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 group"
            >
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-hover text-white flex items-center justify-center">
                      <span class="text-sm font-medium">{{ user.name.charAt(0) }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-neutral-900 dark:text-white">
                      {{ user.name }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                      <span>{{ user.email }}</span>
                      <button
                        @click="copyEmail(user.email)"
                        class="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
                        :title="copiedEmail === user.email ? 'Copied!' : 'Copy email'"
                      >
                        <CheckIcon v-if="copiedEmail === user.email" class="w-4 h-4 text-green-500" />
                        <ClipboardIcon v-else class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="{
                    'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400': user.role.toLowerCase() === 'admin',
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400': user.role.toLowerCase() === 'manager',
                    'bg-neutral-100 text-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-400': user.role.toLowerCase() === 'user'
                  }"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ user.updated_at }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="relative">
                  <button
                    @click="(e) => toggleDropdown(e, user.id)"
                    class="dropdown-trigger p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                  >
                    <EllipsisVerticalIcon class="h-5 w-5" />
                  </button>

                  <!-- Dropdown menu -->
                  <div
                    v-show="activeDropdown === user.id"
                    class="dropdown-menu absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-700 ring-1 ring-black ring-opacity-5 z-10"
                  >
                    <div class="py-1">
                      <button
                        @click="handleEdit(user)"
                        class="flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                      >
                        <PencilIcon class="h-4 w-4 mr-2" />
                        Edit
                      </button>
                      <button
                        @click="handleDelete(user)"
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

    <!-- Add User Modal -->
    <AddUserModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @added="handleUserAdded"
    />

    <!-- Edit User Modal -->
    <EditUserModal
      v-if="showEditModal && selectedUser"
      :user="selectedUser"
      @close="showEditModal = false"
      @updated="handleUserUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm && selectedUser"
      :title="'Delete User'"
      :message="`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
