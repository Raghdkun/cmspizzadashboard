<template>
  <div class="p-4 md:p-6 lg:p-8">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
        Gallery
      </h1>
      <p class="text-neutral-500 dark:text-neutral-400">
        Manage your images and media files
      </p>
    </div>

    <!-- Search and filters -->
    <div class="mb-6 space-y-4">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1">
          <FormGroup>
            <Input
              v-model="searchQuery"
              type="search"
              placeholder="Search images by name or tags..."
            >
              <template #prefix>
                <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
              </template>
            </Input>
          </FormGroup>
        </div>

        <!-- Sort -->
        <div class="w-full sm:w-48">
          <FormGroup>
            <Select v-model="sortBy">
              <option value="">Sort by</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
              <option value="size">Size</option>
            </Select>
          </FormGroup>
        </div>

        <!-- Sort order -->
        <div class="w-full sm:w-48">
          <FormGroup>
            <Select v-model="sortOrder">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Select>
          </FormGroup>
        </div>
      </div>

      <!-- Tags filter -->
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in galleryStore.getAllTags()"
          :key="tag"
          @click="toggleTag(tag)"
          class="px-3 py-1 rounded-full text-sm font-medium transition-colors"
          :class="[
            selectedTags.includes(tag)
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
              : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Upload area -->
    <div
      class="mb-8 border-2 border-dashed rounded-lg p-8 text-center relative"
      :class="[
        dragActive
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-neutral-300 dark:border-neutral-700'
      ]"
      @dragenter.prevent="dragActive = true"
      @dragleave.prevent="dragActive = false"
      @dragover.prevent
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="handleFileInput"
      />

      <div class="max-w-xl mx-auto">
        <div class="mb-4">
          <div class="mx-auto h-12 w-12 text-neutral-400">
            <svg stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="mt-4">
            <Button
              variant="secondary"
              @click="$refs.fileInput.click()"
            >
              Select files
            </Button>
            <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              or drag and drop
            </p>
          </div>
        </div>
        <p class="text-xs text-neutral-500 dark:text-neutral-400">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>

      <!-- Upload progress -->
      <div
        v-if="Object.keys(galleryStore.uploadProgress).length > 0"
        class="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700"
      >
        <div class="space-y-3">
          <div
            v-for="progress in galleryStore.uploadProgress"
            :key="progress.id"
            class="flex items-center gap-4"
          >
            <div class="flex-1">
              <div class="flex justify-between text-sm mb-1">
                <span class="font-medium text-neutral-900 dark:text-white">
                  {{ progress.fileName }}
                </span>
                <span
                  :class="{
                    'text-neutral-500 dark:text-neutral-400': progress.status === 'uploading',
                    'text-green-600 dark:text-green-400': progress.status === 'completed',
                    'text-red-600 dark:text-red-400': progress.status === 'error'
                  }"
                >
                  {{ progress.status === 'uploading' ? `${progress.progress}%` : progress.status }}
                </span>
              </div>
              <div class="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-1">
                <div
                  class="h-1 rounded-full transition-all duration-300"
                  :class="{
                    'bg-primary-600': progress.status === 'uploading',
                    'bg-green-600': progress.status === 'completed',
                    'bg-red-600': progress.status === 'error'
                  }"
                  :style="{ width: `${progress.progress}%` }"
                ></div>
              </div>
              <p v-if="progress.error" class="mt-1 text-sm text-red-600 dark:text-red-400">
                {{ progress.error }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error message -->
    <div
      v-if="error"
      class="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
    >
      <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="galleryStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto"></div>
      <p class="mt-4 text-neutral-600 dark:text-neutral-400">Loading images...</p>
    </div>

    <!-- Gallery grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
    >
      <div
        v-for="image in filteredImages"
        :key="image.id"
        class="group relative aspect-square rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
      >
        <img
          :src="image.file_path"
          :alt="image.name"
          class="w-full h-full object-cover"
        />
        
        <!-- Overlay with actions -->
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="absolute inset-x-0 bottom-0 p-4">
            <p class="text-white text-sm font-medium truncate">
              {{ image.name }}
            </p>
            <p class="text-neutral-300 text-xs">
              {{ image.size }}
            </p>
            <div class="mt-2 flex flex-wrap gap-1">
              <span
                v-for="tag in image.tags"
                :key="tag"
                class="px-1.5 py-0.5 rounded-full text-xs bg-white/20 text-white"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          
          <!-- Delete button -->
          <button
            @click="handleDeleteClick(image.id)"
            class="absolute top-2 right-2 p-2 text-white hover:text-red-500 transition-colors"
          >
            <TrashIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteConfirm"
      title="Delete Image"
      message="Are you sure you want to delete this image? This action cannot be undone."
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/vue/24/outline';
import { useGalleryStore } from '../stores/gallery';
import type { GalleryFilters } from '../types/gallery';
import FormGroup from '../components/ui/FormGroup.vue';
import Input from '../components/ui/Input.vue';
import Select from '../components/ui/Select.vue';
import Button from '../components/ui/Button.vue';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal.vue';

const galleryStore = useGalleryStore();
const fileInput = ref<HTMLInputElement | null>(null);
const dragActive = ref(false);
const error = ref('');
const showDeleteConfirm = ref(false);
const selectedImageId = ref<string | null>(null);
  const image = { url: 'api.pnepizza.com/image.url' };

const formattedImageUrl = computed(() => {
  return image.url.startsWith('http') ? image.url : `https://${image.url}`;
});
// Search and filter state
const searchQuery = ref('');
const selectedTags = ref<string[]>([]);
const sortBy = ref<GalleryFilters['sortBy']>('date');
const sortOrder = ref<GalleryFilters['sortOrder']>('desc');
  const apiUrl = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from the .env file

// Fetch images when component is mounted
onMounted(async () => {
  try {
    await galleryStore.fetchImages();
  } catch (e) {
    error.value = 'Failed to load images';
    console.error(e);
  }
});

// Computed filtered images
const filteredImages = computed(() => {
  return galleryStore.images;
});

// Watch for filter changes and refetch
watch([searchQuery, selectedTags, sortBy, sortOrder], async () => {
  try {
    await galleryStore.fetchImages({
      search: searchQuery.value,
      tags: selectedTags.value,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value,
    });
  } catch (e) {
    error.value = 'Failed to filter images';
    console.error(e);
  }
});

// Toggle tag selection
const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index === -1) {
    selectedTags.value.push(tag);
  } else {
    selectedTags.value.splice(index, 1);
  }
};

// Handle file input change
const handleFileInput = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    await handleFiles(input.files);
  }
};

// Handle file drop
const handleDrop = async (event: DragEvent) => {
  dragActive.value = false;
  const files = event.dataTransfer?.files;
  if (files) {
    await handleFiles(files);
  }
};

// Process files
const handleFiles = async (files: FileList) => {
  error.value = '';

  for (const file of files) {
    try {
      await galleryStore.uploadImage(file);
    } catch (e :any) {
      error.value = e.message || 'Failed to upload file';
    }
  }
};

// Handle delete click
const handleDeleteClick = (imageId: string) => {
  selectedImageId.value = imageId;
  showDeleteConfirm.value = true;
};

// Confirm and execute deletion
const confirmDelete = async () => {
  if (selectedImageId.value) {
    try {
      await galleryStore.deleteImage(selectedImageId.value);
      showDeleteConfirm.value = false;
      selectedImageId.value = null;
    } catch (e) {
      error.value = 'Failed to delete image';
      console.error(e);
    }
  }
};
</script>