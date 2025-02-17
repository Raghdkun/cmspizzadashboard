<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data for store performance
const storePerformanceData = {
  labels: ['Downtown', 'Westside', 'North Mall', 'East Side', 'South Plaza'],
  datasets: [
    {
      label: 'Customer Satisfaction',
      data: [4.8, 4.6, 4.9, 4.7, 4.5],
      backgroundColor: '#7c3aed',
    },
    {
      label: 'Order Completion Rate',
      data: [98, 95, 97, 96, 94],
      backgroundColor: '#2563eb',
    }
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: '#9ca3af',
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      ticks: {
        callback: (value) => {
          // Format as percentage for completion rate
          if (value > 5) return value + '%';
          // Format as rating for satisfaction
          return value.toFixed(1);
        }
      }
    }
  },
  plugins: {
    title: {
      display: true,
      text: 'Store Performance Overview',
      color: '#6b7280',
      font: {
        size: 16,
        weight: 'bold'
      }
    }
  }
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700">
    <div class="h-80">
      <Bar :data="storePerformanceData" :options="chartOptions" />
    </div>
  </div>
</template>