// src/types/location.ts
export interface LocationAPIResponse {
  id: string | number;       // The API might return a number, but we'll convert it to a string locally
  name: string;
  image_url: string;         // API field name for image URL
  street: string;            // API field name for address
  city: string;
  state: string;
  zip: string;               // API field name for ZIP code
  description: string;
  status: "0" | "1";         // "1" means active; "0" means inactive
  latitude?: string;         // Optional latitude as a string
  longitude?: string;        // Optional longitude as a string
  lc_url?: string | null;    // Optional additional URL field (if any)
  lc_number: string;
  created_at: string;
  updated_at: string;
}
// Update DTO used when editing a location; it reflects your form fields:
export interface UpdateLocationDTO {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  description?: string;
  imageUrl?: string;
  isActive?: boolean;
}