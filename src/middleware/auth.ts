import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';
import { useAuthStore } from '../stores/auth';

export async function authMiddleware(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> {
  const authStore = useAuthStore();

  try {
    // Ensure authentication state is fully loaded (if async)
    if (!authStore.isInitialized) {
      console.debug('Initializing authentication state...');
      await authStore.initialize(); // Fetch authentication state if not initialized
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      console.debug(`Access denied to ${to.fullPath}: Authentication required.`);
      return next({
        name: 'login',
        query: { redirect: to.fullPath }, // Pass the current path as a query param for redirection after login
      });
    }

    // Prevent authenticated users from accessing guest-only routes (e.g., login, register)
    if (to.meta.guestOnly && authStore.isAuthenticated) {
      console.debug(`Authenticated user redirected from ${to.fullPath} to dashboard.`);
      return next({ name: 'dashboard' }); // Redirect to dashboard
    }

    // Prevent authenticated users from accessing auth-related pages (e.g., /auth/*)
    if (authStore.isAuthenticated && to.path.startsWith('/auth')) {
      console.debug(`Authenticated user redirected from ${to.fullPath} to dashboard.`);
      return next({ name: 'dashboard' });
    }

    // If everything checks out, proceed to the route
    return next();
  } catch (error) {
    console.error('Error in authMiddleware:', error);

    // Handle unexpected errors gracefully
    return next({
      name: 'error', // Redirect to a generic error page
      params: { message: 'An unexpected error occurred. Please try again later.' },
    });
  }
}