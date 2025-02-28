// Update the TeamMember interface
export interface TeamMember {
  id: number | string; // Allow both number and string
  name: string;
  role: string;
  description: string;
  imageUrl: string;
  status: string;
  // other existing properties...
}