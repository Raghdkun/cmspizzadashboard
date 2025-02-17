<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon, UsersIcon, ChartBarIcon, ClockIcon } from '@heroicons/vue/24/solid';

const metrics = [
  { 
    label: 'Active Users', 
    value: '2,345', 
    change: '+8.1%',
    pattern: 'dots',
    icon: UsersIcon,
    color: 'blue'
  },
  { 
    label: 'Conversion Rate', 
    value: '3.2%', 
    change: '+2.4%',
    pattern: 'cross',
    icon: ChartBarIcon,
    color: 'green'
  },
  { 
    label: 'Avg. Response Time', 
    value: '1.8s', 
    change: '-12.5%',
    pattern: 'zigzag',
    icon: ClockIcon,
    color: 'purple'
  },
];
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div
      v-for="metric in metrics"
      :key="metric.label"
      class="relative bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700 hover:border-primary dark:hover:border-primary transition-all duration-300 group overflow-hidden"
    >
      <!-- Background pattern -->
      <div 
        class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.05] dark:group-hover:opacity-[0.08]"
        :class="{
          'bg-dots-light dark:bg-dots-dark bg-pattern-sm': metric.pattern === 'dots',
          'bg-diagonal-light dark:bg-diagonal-dark bg-pattern-md': metric.pattern === 'diagonal',
          'bg-cross-light dark:bg-cross-dark bg-pattern-lg': metric.pattern === 'cross',
          'bg-zigzag-light dark:bg-zigzag-dark bg-pattern-md': metric.pattern === 'zigzag',
        }"
      ></div>

      <!-- Content -->
      <div class="relative">
        <!-- Icon and Label -->
        <div class="flex items-center gap-3 mb-4">
          <component 
            :is="metric.icon" 
            class="w-8 h-8"
            :class="{
              'text-blue-500': metric.color === 'blue',
              'text-green-500': metric.color === 'green',
              'text-purple-500': metric.color === 'purple',
            }"
          />
          <h3 class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {{ metric.label }}
          </h3>
        </div>

        <!-- Value and Change -->
        <div class="flex items-baseline justify-between">
          <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
            {{ metric.value }}
          </p>
          <span
            class="ml-2 text-sm flex items-center gap-0.5"
            :class="[
              metric.change.startsWith('+')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
            ]"
          >
            <ArrowUpIcon v-if="metric.change.startsWith('+')" class="w-3 h-3" />
            <ArrowDownIcon v-else class="w-3 h-3" />
            {{ metric.change }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>