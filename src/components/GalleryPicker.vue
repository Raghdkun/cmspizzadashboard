<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline';
import { useGalleryStore } from '../stores/gallery';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', url: string): void;
}>();

const galleryStore = useGalleryStore();
const search = ref('');
const loading = ref(false);
const error = ref('');

// Load images when component is mounted
onMounted(async () => {
  try {
    loading.value = true;
    await galleryStore.fetchImages();
  } catch (e) {
    error.value = 'Failed to load images';
    console.error(e);
  } finally {
    loading.value = false;
  }
});

// Handle search
const handleSearch = async () => {
  try {
    loading.value = true;
    await galleryStore.fetchImages({ search: search.value });
  } catch (e) {
    error.value = 'Failed to search images';
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleSelect = (url: string) => {
  emit('select', url);
  emit('close');
};
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-neutral-800 rounded-lg w-full max-w-4xl mx-4">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-neutral-900 dark:text-white">
            Select Image
          </h2>
          <button
            @click="emit('close')"
            class="p-2 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>

        <!-- Search bar -->
        <div class="mb-6">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon class="h-5 w-5 text-neutral-400" />
            </div>
            <input
              v-model="search"
              type="text"
              placeholder="Search images..."
              @input="handleSearch"
              class="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
          <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading images...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 dark:text-red-400">{{ error }}</p>
        </div>

        <!-- Gallery grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <div
            v-for="image in galleryStore.images"
            :key="image.id"
            class="group relative aspect-square rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 cursor-pointer hover:border-primary-500 dark:hover:border-primary-500"
            @click="handleSelect(image.file_path)"
          >
            <img
              :src="image.file_path"
              :alt="image.name"
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span class="text-white text-sm font-medium">Select</span>
            </div>
            <div class="absolute bottom-0 inset-x-0 p-2 bg-black/75">
              <p class="text-white text-xs truncate">{{ image.name }}</p>
              <p class="text-neutral-400 text-xs">{{ image.size }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>