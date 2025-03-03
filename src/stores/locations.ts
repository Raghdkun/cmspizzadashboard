import { ref } from 'vue';
import { defineStore } from 'pinia';
import { LocationAPIResponse, } from '../types/locations';
const apiUrl = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from the .env file


const mockLocations: any[] = []; 
// Types


export interface Location {
  id: string;
  name: string;
  address: string;           // Mapped from API's "street"
  city: string;
  state: string;
  zipCode: string;           // Mapped from API's "zip"
  description: string;
  imageUrl: string;          // Mapped from API's "image_url"
  isActive: boolean;         // Derived from API's "status" ("1" → true, "0" → false)
  createdAt: string;         // Mapped from API's "created_at"
  updatedAt: string;         // Mapped from API's "updated_at"
  lc_number: string;         // New field for location number
  // Optional additional fields:
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contactInfo?: {
    phone: string;
    email: string;
  };
  operatingHours?: {
    [day: string]: {
      open: string;
      close: string;
    };
  };
  amenities?: string[];
  capacity?: number;
}


export interface UpdateLocationDTO {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
  lc_number?: string;        // Add to UpdateLocationDTO
}

export interface LocationsResponse {
  data: Location[];
  meta: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  };
}

export interface LocationFilters {
  search?: string;
  state?: string;
  isActive?: boolean;
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}


export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  description: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  contactInfo?: {
    phone: string;
    email: string;
  };
  operatingHours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  amenities?: string[];
  capacity?: number;
}


export interface UpdateLocationDTO extends Partial<LocationAPIResponse> {}



export const useLocationsStore = defineStore('locations', () => {
  // State
  const locations = ref<Location[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const meta = ref({
    total: 0,
    page: 1,
    perPage: 10,
    totalPages: 0,
  });

  // Getters
  const activeLocations = () => locations.value.filter(loc => loc.isActive);
  const locationsByState = (state: string) => locations.value.filter(loc => loc.state === state);
  const getLocationById = (id: string) => locations.value.find(loc => loc.id === id);

  // Actions
  /**
   * Fetch locations with optional filters
   * API endpoint: GET /api/v1/locations
   */
  const fetchLocations = async (filters?: LocationFilters) => {
    loading.value = true;
    error.value = null;
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      const response = await fetch(`${apiUrl}/api/v1/admin/locations`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Parse the API response as an array of LocationAPIResponse objects
      const apiResponse: LocationAPIResponse[] = await response.json();
  
      // Map the API response to our local Location type:
      // In the fetchLocations function, update the mapping:
      const mappedLocations: Location[] = apiResponse.map((loc) => ({
        id: loc.id.toString(), // Convert id to string if needed
        name: loc.name,
        address: loc.street,
        city: loc.city,
        state: loc.state,
        zipCode: loc.zip,
        description: loc.description,
        imageUrl: loc.image_url,
        isActive: loc.status === "1",
        createdAt: loc.created_at,
        updatedAt: loc.updated_at,
        lc_number: loc.lc_number || '',  // Map lc_number from API
        coordinates: loc.latitude && loc.longitude ? {
          latitude: Number(loc.latitude),
          longitude: Number(loc.longitude),
        } : undefined,
      }));
  
      // Apply filters if provided:
      let filteredData = mappedLocations;
  
      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        filteredData = filteredData.filter(loc =>
          loc.name.toLowerCase().includes(searchLower) ||
          loc.city.toLowerCase().includes(searchLower) ||
          loc.state.toLowerCase().includes(searchLower)
        );
      }
  
      // if (filters?.state) {
      //   filteredData = filteredData.filter(
      //     loc => loc.state.toLowerCase() === filters.state.toLowerCase()
      //   );
      // }
  
      if (filters?.isActive !== undefined) {
        filteredData = filteredData.filter(loc => loc.isActive === filters.isActive);
      }
  
      // Update the store state:
      locations.value = filteredData;
      meta.value = {
        total: filteredData.length,
        page: filters?.page || 1,
        perPage: filters?.perPage || 10,
        totalPages: Math.ceil(filteredData.length / (filters?.perPage || 10)),
      };
    } catch (e) {
      error.value = 'Failed to fetch locations';
      throw e;
    } finally {
      loading.value = false;
    }
  };
  

  /**
   * Fetch a single location by ID
   * API endpoint: GET /api/v1/locations/:id
   */
  const fetchLocationById = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const location = mockLocations.find(loc => loc.id === id);
      if (!location) throw new Error('Location not found');
      return location;
    } catch (e) {
      error.value = 'Failed to fetch location';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Add a new location
   * API endpoint: POST /api/v1/locations
   */
  const addLocation = async (location: LocationAPIResponse) => {
    loading.value = true;
    error.value = null;
  
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
  
      // Ensure the token exists
      if (!token) {
        throw new Error('Token not found in localStorage');
      }
  
      // Convert the status field to "0" or "1" (string) and include latitude/longitude
      const locationPayload = {
        ...location,
        status: location.status === "1" ? "1" : "0",
        // The payload will include latitude and longitude if they're provided in the location object.
      };
  
      // Make the POST request to the API with the token in the headers
      const response = await fetch(`${apiUrl}/api/v1/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(locationPayload)
      });
  
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Parse the response as JSON
      const newLocation = await response.json();
  
      // Add the new location to the local state
      locations.value.push(newLocation);
  
      return newLocation;
  
    } catch (e) {
      error.value = 'Failed to add location';
      throw e;
    } finally {
      loading.value = false;
    }
  };
  
 /**
   * Update an existing location
   * API endpoint: PATCH /api/v1/locations/:id
   */
 const updateLocation = async (id: string, updates: UpdateLocationDTO) => {
  loading.value = true;
  error.value = null;
  try {
    // Convert local update DTO to API format:
    const apiUpdates: Partial<LocationAPIResponse> = {};
    if (updates.name !== undefined) apiUpdates.name = updates.name;
    if (updates.imageUrl !== undefined) apiUpdates.image_url = updates.imageUrl;
    if (updates.address !== undefined) apiUpdates.street = updates.address;
    if (updates.city !== undefined) apiUpdates.city = updates.city;
    if (updates.state !== undefined) apiUpdates.state = updates.state;
    if (updates.zipCode !== undefined) apiUpdates.zip = updates.zipCode;
    if (updates.description !== undefined) apiUpdates.description = updates.description;
    if (updates.lc_number !== undefined) apiUpdates.lc_number = updates.lc_number;
    if (updates.isActive !== undefined) {
      apiUpdates.status = updates.isActive ? "1" : "0";
    }
     // Retrieve the token from localStorage
     const token = localStorage.getItem("token");
  
     // Ensure the token exists
     if (!token) {
       throw new Error('Token not found in localStorage');
     }
 
    // Make the PATCH request using fetch
    const response = await fetch(`${apiUrl}/api/v1/locations/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`

      },
      body: JSON.stringify(apiUpdates)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update location');
    }
    
    // Parse the updated location from the API response
    const updatedApiLocation: LocationAPIResponse = await response.json();
    
    // Convert the API response to your local Location shape:
    // Also update the updatedLocation mapping:
    const updatedLocation: Location = {
      id: updatedApiLocation.id.toString(),
      name: updatedApiLocation.name,
      address: updatedApiLocation.street,
      city: updatedApiLocation.city,
      state: updatedApiLocation.state,
      zipCode: updatedApiLocation.zip,
      description: updatedApiLocation.description,
      imageUrl: updatedApiLocation.image_url,
      isActive: updatedApiLocation.status === "1",
      lc_number: updatedApiLocation.lc_number || '',
      // If your API returns these fields, use them; otherwise, preserve local values:
      createdAt: locations.value.find(loc => loc.id === id)?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Update local state:
    const index = locations.value.findIndex(loc => loc.id === id);
    if (index !== -1) {
      locations.value[index] = updatedLocation;
    }
    
    return updatedLocation;
  } catch (e) {
    error.value = 'Failed to update location';
    throw e;
  } finally {
    loading.value = false;
  }
};

  /**
   * Delete a location
   * API endpoint: DELETE /api/v1/locations/:id
   */
  const deleteLocation = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token not found in localStorage');

      const response = await fetch(`${apiUrl}/api/v1/locations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      locations.value = locations.value.filter((inq) => inq.id !== id);
    } catch (e: any) {
      error.value = 'Failed to delete inquiry';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Bulk update location status
   * API endpoint: PATCH /api/v1/locations/bulk-status
   */
  const bulkUpdateStatus = async (ids: string[], isActive: boolean) => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      locations.value = locations.value.map(loc => 
        ids.includes(loc.id) ? { ...loc, isActive, updatedAt: new Date().toISOString() } : loc
      );
    } catch (e) {
      error.value = 'Failed to update locations status';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Export locations data
   * API endpoint: GET /api/v1/locations/export
   */
  const exportLocations = async (format: 'csv' | 'xlsx' = 'csv') => {
    loading.value = true;
    error.value = null;
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock CSV data
      const csvContent = locations.value
        .map(loc => `${loc.name},${loc.address},${loc.city},${loc.state},${loc.zipCode}`)
        .join('\n');
      
      // Create download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `locations.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      error.value = 'Failed to export locations';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    locations,
    loading,
    error,
    meta,
    
    // Getters
    activeLocations,
    locationsByState,
    getLocationById,
    
    // Actions
    fetchLocations,
    fetchLocationById,
    addLocation,
    updateLocation,
    deleteLocation,
    bulkUpdateStatus,
    exportLocations,
  };
});