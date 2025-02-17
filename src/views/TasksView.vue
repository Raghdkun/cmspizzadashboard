<script setup lang="ts">
import { ref } from 'vue';
import { ClipboardDocumentListIcon, PlusIcon } from '@heroicons/vue/24/outline';

const tasks = ref([
  {
    id: 1,
    title: 'Review quarterly reports',
    description: 'Analyze Q1 2024 performance metrics and prepare summary',
    priority: 'high',
    dueDate: '2024-03-15',
    status: 'pending',
    assignedTo: 'John Smith'
  },
  {
    id: 2,
    title: 'Update team documentation',
    description: 'Review and update operational procedures',
    priority: 'medium',
    dueDate: '2024-03-20',
    status: 'in-progress',
    assignedTo: 'Sarah Johnson'
  },
  {
    id: 3,
    title: 'Schedule team meeting',
    description: 'Coordinate monthly team sync for project updates',
    priority: 'low',
    dueDate: '2024-03-25',
    status: 'completed',
    assignedTo: 'Mike Wilson'
  },
  {
    id: 4,
    title: 'Vendor contract review',
    description: 'Review and renew supplier agreements',
    priority: 'high',
    dueDate: '2024-03-18',
    status: 'pending',
    assignedTo: 'Emily Brown'
  },
  {
    id: 5,
    title: 'Employee training program',
    description: 'Develop new onboarding materials',
    priority: 'medium',
    dueDate: '2024-03-22',
    status: 'in-progress',
    assignedTo: 'David Lee'
  }
]);

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
    case 'medium':
      return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300';
    case 'low':
      return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
    default:
      return 'bg-neutral-100 dark:bg-neutral-500/20 text-neutral-800 dark:text-neutral-300';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
    case 'in-progress':
      return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300';
    default:
      return 'bg-neutral-100 dark:bg-neutral-500/20 text-neutral-800 dark:text-neutral-300';
  }
};
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex justify-between items-start">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
            <ClipboardDocumentListIcon class="w-8 h-8 text-primary-600" />
            Action Items
          </h1>
          <p class="text-neutral-500 dark:text-neutral-400">
            Track and manage your tasks and action items
          </p>
        </div>
        <button class="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center gap-2">
          <PlusIcon class="w-5 h-5" />
          Add Task
        </button>
      </div>
    </div>

    <!-- Tasks List -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
          <thead>
            <tr class="bg-neutral-50 dark:bg-neutral-800">
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Task
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Assigned To
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Due Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Priority
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-700">
            <tr 
              v-for="task in tasks" 
              :key="task.id"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="text-sm font-medium text-neutral-900 dark:text-white">
                    {{ task.title }}
                  </div>
                  <div class="text-sm text-neutral-500 dark:text-neutral-400">
                    {{ task.description }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ task.assignedTo }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                {{ task.dueDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getPriorityColor(task.priority)"
                >
                  {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="px-2 py-1 text-xs font-medium rounded-full"
                  :class="getStatusColor(task.status)"
                >
                  {{ task.status.charAt(0).toUpperCase() + task.status.slice(1) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>