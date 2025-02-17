<script setup lang="ts">
import { ref } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { CurrencyDollarIcon, ArrowUpIcon } from '@heroicons/vue/24/solid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Revenue data
const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [30000, 45000, 38000, 52000, 48000, 54321, 58000, 62000, 59000, 65000, 71000, 68000],
      borderColor: '#E44217',
      backgroundColor: 'rgba(228, 66, 23, 0.1)',
      tension: 0.4,
      fill: true,
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `$${context.raw.toLocaleString()}`
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `$${value.toLocaleString()}`
      }
    }
  }
};

// Revenue stats
const stats = [
  {
    label: 'Total Revenue',
    value: '$54,321',
    change: '+12.5%',
    period: 'vs last month'
  },
  {
    label: 'Average Order Value',
    value: '$42.50',
    change: '+8.3%',
    period: 'vs last month'
  },
  {
    label: 'Orders',
    value: '1,278',
    change: '+15.2%',
    period: 'vs last month'
  },
  {
    label: 'Revenue per Customer',
    value: '$85.20',
    change: '+5.8%',
    period: 'vs last month'
  }
];

// Time period filter
const selectedPeriod = ref('year');
</script>

<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-3">
        <CurrencyDollarIcon class="w-8 h-8 text-primary-600" />
        Revenue Overview
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Track and analyze your business revenue performance
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700"
      >
        <h3 class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          {{ stat.label }}
        </h3>
        <div class="mt-2 flex items-baseline justify-between">
          <p class="text-2xl font-semibold text-neutral-900 dark:text-white">
            {{ stat.value }}
          </p>
          <div class="text-right">
            <span class="text-sm text-green-600 dark:text-green-400 flex items-center gap-0.5">
              <ArrowUpIcon class="w-3 h-3" />
              {{ stat.change }}
            </span>
            <span class="text-xs text-neutral-500 dark:text-neutral-400">
              {{ stat.period }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Revenue Chart -->
    <div class="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
      <div class="p-6 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
          Revenue Trend
        </h2>
        <select
          v-model="selectedPeriod"
          class="px-3 py-1.5 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="year">Last 12 months</option>
          <option value="quarter">Last 3 months</option>
          <option value="month">Last 30 days</option>
        </select>
      </div>
      <div class="p-6">
        <div class="h-80">
          <Line :data="revenueData" :options="chartOptions" />
        </div>
      </div>
    </div>
  </div>
</template>