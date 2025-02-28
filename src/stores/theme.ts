import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  // Fix: Initialize ref with a value, not a function
  const theme = ref<Theme>(
    // Get theme from localStorage or use system default
    localStorage.getItem('theme') as Theme || 'system'
  );

  // Watch for theme changes
  watch(theme, (newTheme) => {
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
    
    // Apply theme
    updateTheme(newTheme);
  });

  // Function to update theme
  const updateTheme = (newTheme: Theme) => {
    if (newTheme === 'system') {
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      // Apply theme directly
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Initialize theme on page load
  if (typeof window !== 'undefined') {
    // Apply initial theme
    updateTheme(theme.value);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (theme.value === 'system') {
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    });
  }

  return {
    theme,
    updateTheme,
  };
});