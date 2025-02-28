import { ref } from 'vue';
import { defineStore } from 'pinia';

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export interface Notification {
  id: string;
  message: string;
  created_at_message: string;
  read_at: string | null;
  is_read: number;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  data: Notification[];
  readed: number;
  unread: number;
  count: number;
}

export const useNotificationsStore = defineStore('notifications', () => {
  // State
  const notifications = ref<Notification[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    readed: 0,
    unread: 0,
    count: 0
  });

  // Actions
  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch notifications');
      }

      const data: NotificationResponse = await response.json();
      notifications.value = data.data;
      meta.value = {
        readed: data.readed,
        unread: data.unread,
        count: data.count
      };
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch notifications';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/notifications/${id}/mark-as-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark notification as read');
      }

      // Update local state
      const notification = notifications.value.find(n => n.id === id);
      if (notification) {
        notification.is_read = 1;
        notification.read_at = new Date().toISOString();
        meta.value.unread--;
        meta.value.readed++;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to mark notification as read';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const markAllAsRead = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication token not found');

      const response = await fetch(`${apiUrl}/api/v1/notifications/mark-all-read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark all notifications as read');
      }

      // Update local state
      notifications.value.forEach(n => {
        n.is_read = 1;
        n.read_at = new Date().toISOString();
      });
      meta.value.readed = meta.value.count;
      meta.value.unread = 0;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to mark all notifications as read';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    notifications,
    loading,
    error,
    meta,
    
    // Computed
    unreadCount: () => meta.value.unread,
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
});