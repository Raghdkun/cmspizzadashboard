import { ref, watch } from 'vue';
import { defineStore } from 'pinia';

type Theme = 'light' | 'dark' | 'system';

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'system';
  });

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