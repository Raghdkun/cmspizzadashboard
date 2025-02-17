import { ref } from 'vue';
import { defineStore } from 'pinia';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  roleAccess?: string[];
  icon?: string;
  actions?: {
    label: string;
    action: string;
  }[];
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Location Opening',
    message: 'A new store location has been approved in Columbus, OH',
    type: 'success',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    read: false,
    category: 'locations',
    priority: 'high',
    roleAccess: ['admin', 'manager'],
    link: '/locations',
    actions: [
      { label: 'View Details', action: 'view_location' },
      { label: 'Assign Manager', action: 'assign_manager' }
    ]
  },
  {
    id: '2',
    title: 'System Maintenance',
    message: 'Scheduled maintenance in 2 hours. Please save your work.',
    type: 'warning',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    read: false,
    category: 'system',
    priority: 'high',
    roleAccess: ['admin', 'manager', 'user']
  },
  {
    id: '3',
    title: 'New Feedback Received',
    message: 'Customer feedback requires attention at Downtown location',
    type: 'info',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    category: 'feedback',
    priority: 'medium',
    roleAccess: ['admin', 'manager'],
    link: '/feedback',
    actions: [
      { label: 'Review', action: 'review_feedback' }
    ]
  },
  {
    id: '4',
    title: 'Inventory Alert',
    message: 'Low stock warning for key ingredients at 3 locations',
    type: 'error',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
    read: true,
    category: 'inventory',
    priority: 'high',
    roleAccess: ['admin', 'manager'],
    actions: [
      { label: 'Order Supplies', action: 'order_supplies' },
      { label: 'View Report', action: 'view_inventory' }
    ]
  }
];

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const unreadCount = () => notifications.value.filter(n => !n.read).length;
  const getByPriority = (priority: 'low' | 'medium' | 'high') => 
    notifications.value.filter(n => n.priority === priority);
  const getByRole = (role: string) => 
    notifications.value.filter(n => !n.roleAccess || n.roleAccess.includes(role));

  // Actions
  const fetchNotifications = async (userRole: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      notifications.value = mockNotifications.filter(n => !n.roleAccess || n.roleAccess.includes(userRole));
    } catch (e) {
      error.value = 'Failed to fetch notifications';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
    } catch (e) {
      error.value = 'Failed to mark notification as read';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const markAllAsRead = async () => {
    loading.value = true;
    error.value = null;
    try {
      notifications.value.forEach(n => n.read = true);
    } catch (e) {
      error.value = 'Failed to mark all notifications as read';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteNotification = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      notifications.value = notifications.value.filter(n => n.id !== id);
    } catch (e) {
      error.value = 'Failed to delete notification';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    loading.value = true;
    error.value = null;
    try {
      const newNotification: Notification = {
        ...notification,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        read: false,
      };
      notifications.value.unshift(newNotification);
      return newNotification;
    } catch (e) {
      error.value = 'Failed to add notification';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    getByPriority,
    getByRole,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
  };
});