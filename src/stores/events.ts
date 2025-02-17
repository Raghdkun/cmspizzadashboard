import { ref } from 'vue';
import { defineStore } from 'pinia';


// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  currentAttendees?: number;
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  organizer?: {
    id: string;
    name: string;
    email: string;
  };
  category?: string;
  tags?: string[];
  registrationDeadline?: string;
  price?: number;
  isPublic?: boolean;
}

export interface CreateEventDTO {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees: number;
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category?: string;
  tags?: string[];
  registrationDeadline?: string;
  price?: number;
  isPublic?: boolean;
}

export interface UpdateEventDTO extends Partial<CreateEventDTO> {}

export interface EventsResponse {
  data: Event[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface EventFilters {
  search?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  category?: string;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mock data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Love Kitchen Community Service',
    description: 'Join us in serving our community through food and love. We\'ll be preparing and distributing meals to those in need.',
    date: '2024-03-23',
    time: '10:00',
    location: 'Downtown Community Center',
    maxAttendees: 150,
    currentAttendees: 87,
    imageUrl: '/images/community-service.jpg',
    status: 'upcoming',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z',
    organizer: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
    },
    category: 'community',
    tags: ['volunteer', 'community service', 'food distribution'],
    registrationDeadline: '2024-03-22',
    isPublic: true,
  },
  {
    id: '2',
    title: 'School Fundraiser Pizza Night',
    description: 'Support our local school with a delicious pizza night. A portion of all sales will be donated to the school\'s art program.',
    date: '2024-03-26',
    time: '18:00',
    location: 'Lincoln High School',
    maxAttendees: 200,
    currentAttendees: 145,
    imageUrl: '/images/pizza-night.jpg',
    status: 'upcoming',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    organizer: {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
    },
    category: 'fundraiser',
    tags: ['school', 'fundraiser', 'pizza night'],
    registrationDeadline: '2024-03-25',
    price: 15.00,
    isPublic: true,
  },
];

export const useEventsStore = defineStore('events', () => {
  // State
  const events = ref<Event[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  // Getters
  const upcomingEvents = () => events.value.filter(event => event.status === 'upcoming');
  const ongoingEvents = () => events.value.filter(event => event.status === 'ongoing');
  const getEventById = (id: string) => events.value.find(event => event.id === id);

  // Actions
  /**
   * Fetch events with optional filters
   * API endpoint: GET /api/v1/events
   */
  const fetchEvents = async (filters?: EventFilters) => {
    loading.value = true;
    error.value = null;
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Apply filters to mock data
      let filteredData = [...mockEvents];
      
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower)
        );
      }

      if (filters?.status) {
        filteredData = filteredData.filter(event => 
          event.status === filters.status
        );
      }

      if (filters?.startDate) {
        filteredData = filteredData.filter(event => 
          event.date >= filters.startDate!
        );
      }

      if (filters?.endDate) {
        filteredData = filteredData.filter(event => 
          event.date <= filters.endDate!
        );
      }

      if (filters?.category) {
        filteredData = filteredData.filter(event => 
          event.category === filters.category
        );
      }

      // Update state
      events.value = filteredData;
      meta.value = {
        total: filteredData.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(filteredData.length / (filters?.perPage || 10)),
      };
    } catch (e) {
      error.value = 'Failed to fetch events';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Fetch a single event by ID
   * API endpoint: GET /api/v1/events/:id
   */
  const fetchEventById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const event = mockEvents.find(event => event.id === id);
      if (!event) throw new Error('Event not found');
      return event;
    } catch (e) {
      error.value = 'Failed to fetch event';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add a new event
   * API endpoint: POST /api/v1/events
   */
  const addEvent = async (event: CreateEventDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newEvent: Event = {
        ...event,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentAttendees: 0,
      };
      events.value.push(newEvent);
      return newEvent;
    } catch (e) {
      error.value = 'Failed to add event';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Update an existing event
   * API endpoint: PATCH /api/v1/events/:id
   */
  const updateEvent = async (id: string, updates: UpdateEventDTO) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const index = events.value.findIndex(event => event.id === id);
      if (index === -1) throw new Error('Event not found');
      
      const updatedEvent = {
        ...events.value[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      events.value[index] = updatedEvent;
      return updatedEvent;
    } catch (e) {
      error.value = 'Failed to update event';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Delete an event
   * API endpoint: DELETE /api/v1/events/:id
   */
  const deleteEvent = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      events.value = events.value.filter(event => event.id !== id);
    } catch (e) {
      error.value = 'Failed to delete event';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Register attendee for an event
   * API endpoint: POST /api/v1/events/:id/register
   */
  const registerAttendee = async (eventId: string, attendeeData: { name: string; email: string }) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const event = events.value.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      
      if (event.currentAttendees! >= event.maxAttendees) {
        throw new Error('Event is full');
      }
      
      event.currentAttendees = (event.currentAttendees || 0) + 1;
      return true;
    } catch (e) {
      error.value = 'Failed to register for event';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export events data
   * API endpoint: GET /api/v1/events/export
   */
  const exportEvents = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock CSV data
      const csvContent = events.value
        .map(event => `${event.title},${event.date},${event.time},${event.location},${event.status}`)
        .join('\n');
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `events.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      error.value = 'Failed to export events';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    events,
    loading,
    error,
    meta,
    
    // Getters
    upcomingEvents,
    ongoingEvents,
    getEventById,
    
    // Actions
    fetchEvents,
    fetchEventById,
    addEvent,
    updateEvent,
    deleteEvent,
    registerAttendee,
    exportEvents,
  };
});