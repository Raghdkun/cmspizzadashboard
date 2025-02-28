import { createRouter, createWebHistory } from 'vue-router';
import { authMiddleware } from '../middleware/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/auth',
      component: () => import('../layouts/AuthLayout.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          meta: { guestOnly: true },
          component: () => import('../views/auth/LoginView.vue'),
        },
        {
          path: 'register',
          name: 'register',
          meta: { guestOnly: true },
          component: () => import('../views/auth/RegisterView.vue'),
        },
        {
          path: 'forgot-password',
          name: 'forgot-password',
          meta: { guestOnly: true },
          component: () => import('../views/auth/ForgotPasswordView.vue'),
        },
      ],
    },
    {
      path: '/dashboard',
      component: () => import('../layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('../views/DashboardView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'locations',
          name: 'locations',
          component: () => import('../views/LocationsView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'feedback',
          name: 'feedback',
          component: () => import('../views/FeedbackView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'inquiries',
          name: 'inquiries',
          component: () => import('../views/InquiriesView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'contacts',
          name: 'contacts',
          component: () => import('../views/ContactsView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'users',
          name: 'users',
          component: () => import('../views/UsersView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('../views/SettingsView.vue'),
          meta: { requiresAuth: true },
    },
        {
          path: 'gallery',
          name: 'gallery',
          component: () => import('../views/GalleryView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue'),
          meta: { requiresAuth: true },

        },
        {
          path: 'notifications',
          name: 'notifications',
          component: () => import('../views/NotificationsView.vue'),
          meta: { requiresAuth: true },
        },
      ],
    },
  ],
});

// Apply auth middleware
router.beforeEach(authMiddleware);

export default router;