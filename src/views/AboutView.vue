<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { PencilIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useAboutStore, Milestone, TeamMember } from '../stores/about';
import AddMilestoneModal from '../components/AddMilestoneModal.vue';
import AddTeamMemberModal from '../components/AddTeamMemberModal.vue';
import EditMilestoneModal from '../components/EditMilestoneModal.vue';
import EditTeamMemberModal from '../components/EditTeamMemberModal.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';

const aboutStore = useAboutStore();

// Modal states
const showAddMilestoneModal = ref(false);
const showAddTeamMemberModal = ref(false);
const showEditMilestoneModal = ref(false);
const showEditTeamMemberModal = ref(false);
const showDeleteConfirmModal = ref(false);
const selectedItem = ref<Milestone | TeamMember | null>(null);
const deleteType = ref('');

// Fetch data when component is mounted
onMounted(async () => {
  try {
    await aboutStore.fetchData();
    document.addEventListener('click', handleClickOutside);
  } catch (error) {
    console.error('Failed to fetch about data:', error);
  }
});

// Remove event listener on unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// ---------- Milestone Handlers ----------
// Note: The update handler now expects an object that omits createdAt and updatedAt.
const handleAddMilestone = async (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    await aboutStore.addMilestone(milestone);
    showAddMilestoneModal.value = false;
  } catch (error) {
    console.error('Failed to add milestone:', error);
  }
};

const handleEditMilestone = async (updates: Omit<Milestone, 'createdAt' | 'updatedAt'>) => {
  try {
    // updates.id is required; ensure it's provided.
    await aboutStore.updateMilestone(updates.id, updates);
    showEditMilestoneModal.value = false;
    selectedItem.value = null;
  } catch (error) {
    console.error('Failed to update milestone:', error);
  }
};

const handleDeleteMilestone = (milestone: Milestone) => {
  selectedItem.value = milestone;
  deleteType.value = 'milestone';
  showDeleteConfirmModal.value = true;
};

// ---------- Team Member Handlers ----------
const handleAddTeamMember = async (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt' | 'order' | 'socialLinks'>) => {
  try {
    await aboutStore.addTeamMember(member);
    showAddTeamMemberModal.value = false;
  } catch (error) {
    console.error('Failed to add team member:', error);
  }
};

const handleEditTeamMember = async (updates: Omit<TeamMember, 'createdAt' | 'updatedAt' | 'order' | 'socialLinks'>) => {
  try {
    await aboutStore.updateTeamMember(updates.id, updates);
    showEditTeamMemberModal.value = false;
    selectedItem.value = null;
  } catch (error) {
    console.error('Failed to update team member:', error);
  }
};

const handleDeleteTeamMember = (member: TeamMember) => {
  selectedItem.value = member;
  deleteType.value = 'team member';
  showDeleteConfirmModal.value = true;
};

// ---------- Delete Confirmation Handler ----------
const handleConfirmDelete = async () => {
  try {
    if (deleteType.value === 'milestone') {
      await aboutStore.deleteMilestone(selectedItem.value!.id);
    } else {
      await aboutStore.deleteTeamMember(selectedItem.value!.id);
    }
    showDeleteConfirmModal.value = false;
    selectedItem.value = null;
  } catch (error) {
    console.error(`Failed to delete ${deleteType.value}:`, error);
  }
};

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.dropdown-trigger') && !target.closest('.dropdown-menu')) {
    // Clear active dropdown if any.
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8 space-y-8">
    <!-- Loading / Error States -->
    <div v-if="aboutStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
    </div>
    <div v-else-if="aboutStore.error" class="text-center py-12">
      <p class="text-red-600 dark:text-red-400">{{ aboutStore.error }}</p>
    </div>
    <template v-else>
      <!-- Milestones Section -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
              Our Journey
            </h2>
            <p class="text-neutral-500 dark:text-neutral-400">
              Track our company's growth and milestones
            </p>
          </div>
          <button
            @click="showAddMilestoneModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Milestone
          </button>
        </div>
        <!-- Milestones Timeline -->
        <div class="space-y-4">
          <div
            v-for="milestone in aboutStore.sortedMilestones()"
            :key="milestone.id"
            class="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-neutral-700"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-4 mb-2">
                  <span class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ milestone.date }}
                  </span>
                  <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                    {{ milestone.title }}
                  </h3>
                </div>
                <p class="text-neutral-600 dark:text-neutral-400">
                  {{ milestone.description }}
                </p>
              </div>
              <div class="flex gap-2">
                <button
                  @click="selectedItem = milestone; showEditMilestoneModal = true"
                  class="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                >
                  <PencilIcon class="w-5 h-5" />
                </button>
                <button
                  @click="handleDeleteMilestone(milestone)"
                  class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Leadership Team Section -->
      <section>
        <div class="flex justify-between items-center mb-6">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
              Leadership Team
            </h2>
            <p class="text-neutral-500 dark:text-neutral-400">
              Our company's leadership and management
            </p>
          </div>
          <button
            @click="showAddTeamMemberModal = true"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Team Member
          </button>
        </div>
        <!-- Team Members Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="member in aboutStore.activeTeamMembers()"
            :key="member.id"
            class="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-700"
          >
            <div class="aspect-w-16 aspect-h-9 bg-neutral-100 dark:bg-neutral-700">
              <img
                :src="member.imageUrl || '/placeholder-avatar.jpg'"
                :alt="member.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="text-lg font-semibold text-neutral-900 dark:text-white">
                      {{ member.name }}
                    </h3>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': member.status === 'active',
                        'bg-gray-100 text-gray-800': member.status === 'inactive'
                      }"
                    >
                      {{ member.status.charAt(0).toUpperCase() + member.status.slice(1) }}
                    </span>
                  </div>
                  <p class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ member.role }}
                  </p>
                  <p class="mt-2 text-neutral-600 dark:text-neutral-400">
                    {{ member.description }}
                  </p>
                </div>
                <div class="flex gap-2">
                  <button
                    @click="selectedItem = member; showEditTeamMemberModal = true"
                    class="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
                  >
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button
                    @click="handleDeleteTeamMember(member)"
                    class="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Modals -->
    <AddMilestoneModal
      v-if="showAddMilestoneModal"
      @close="showAddMilestoneModal = false"
      @add="handleAddMilestone"
    />
    <EditMilestoneModal
      v-if="showEditMilestoneModal && selectedItem"
      :milestone="selectedItem as Milestone"
      @close="showEditMilestoneModal = false"
      @update="handleEditMilestone"
    />
    <AddTeamMemberModal
      v-if="showAddTeamMemberModal"
      @close="showAddTeamMemberModal = false"
      @add="handleAddTeamMember"
    />
    <EditTeamMemberModal
      v-if="showEditTeamMemberModal && selectedItem"
      :member="selectedItem as TeamMember"
      @close="showEditTeamMemberModal = false"
      @update="handleEditTeamMember"
    />
    <DeleteConfirmationModal
      v-if="showDeleteConfirmModal && selectedItem"
      :title="`Delete ${deleteType}`"
      :message="`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`"
      @confirm="handleConfirmDelete"
      @cancel="showDeleteConfirmModal = false"
    />
  </div>
</template>
