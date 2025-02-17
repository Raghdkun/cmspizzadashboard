<script setup lang="ts">
const actionItems = [
  {
    id: 1,
    title: 'Review quarterly reports',
    priority: 'high',
    dueDate: '2024-03-15',
  },
  {
    id: 2,
    title: 'Update team documentation',
    priority: 'medium',
    dueDate: '2024-03-20',
  },
  {
    id: 3,
    title: 'Schedule team meeting',
    priority: 'low',
    dueDate: '2024-03-25',
  },
];

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
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
    <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">Action Items</h2>
      <router-link 
        to="/tasks" 
        class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
      >
        View all
      </router-link>
    </div>
    <div class="divide-y divide-neutral-200 dark:divide-neutral-700">
      <div
        v-for="item in actionItems"
        :key="item.id"
        class="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-neutral-900 dark:text-white">
              {{ item.title }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Due: {{ item.dueDate }}
            </p>
          </div>
          <span
            :class="[
              'px-2 py-1 text-xs font-medium rounded-full',
              getPriorityColor(item.priority),
            ]"
          >
            {{ item.priority }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>