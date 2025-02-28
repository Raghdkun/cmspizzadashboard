import { ref } from 'vue';
import { defineStore } from 'pinia';
const apiUrl = import.meta.env.VITE_BACKEND_URL; // Get the backend URL from the .env file

// ======================
// Type Definitions
// ======================

/**
 * Represents the API response for a milestone.
 */
export interface MilestoneAPIResponse {
  id: number;
  date: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Local Milestone type.
 */
export interface Milestone {
  id: string;
  date: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents the API response for a team member.
 */
export interface TeamMemberAPIResponse {
  id: number;
  name: string;
  role: string;
  profile_image: string;
  description: string;
  created_at: string;
  updated_at: string;
  status?: 'active' | 'inactive';
}

/**
 * Local TeamMember type.
 */
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}

/**
 * AboutData contains milestones and team members.
 */
export interface AboutData {
  milestones: Milestone[];
  teamMembers: TeamMember[];
}

// ======================
// Mapping Helpers
// ======================

const mapMilestone = (m: MilestoneAPIResponse): Milestone => ({
  id: String(m.id),
  date: m.date,
  title: m.title,
  description: m.description,
  createdAt: m.created_at,
  updatedAt: m.updated_at,
});

const mapTeamMember = (m: TeamMemberAPIResponse): TeamMember => ({
  id: String(m.id),
  name: m.name,
  role: m.role,
  imageUrl: m.profile_image,
  description: m.description,
  createdAt: m.created_at,
  updatedAt: m.updated_at,
  // Provide a default if API doesn't return status.
  status: m.status ?? 'active',
});

// ======================
// About Store
// ======================

export const useAboutStore = defineStore('about', () => {
  // State
  const milestones = ref<Milestone[]>([]);
  const teamMembers = ref<TeamMember[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeTeamMembers = () =>
    teamMembers.value.filter(member => member.status === 'active');
  const sortedMilestones = () =>
    [...milestones.value].sort((a, b) => (b.date > a.date ? 1 : -1));

  // Actions

  /**
   * Fetch data from API endpoints:
   *   GET /api/v1/milestones
   *   GET /api/v1/team-members
   */
  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      // Fetch milestones
      const msRes = await fetch(`${apiUrl}/api/v1/milestones`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!msRes.ok) {
        throw new Error(`Failed to fetch milestones: ${msRes.status}`);
      }
      const msData: MilestoneAPIResponse[] = await msRes.json();
      milestones.value = msData.map(mapMilestone);

      // Fetch team members (assuming API returns an array)
      const tmRes = await fetch(`${apiUrl}/api/v1/team-members`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!tmRes.ok) {
        throw new Error(`Failed to fetch team members: ${tmRes.status}`);
      }
      const tmData: TeamMemberAPIResponse[] = await tmRes.json();
      teamMembers.value = tmData.map(mapTeamMember);
    } catch (e: any) {
      error.value = e.message || 'Failed to fetch about data';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Milestone actions
  const addMilestone = async (milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(milestone),
      });
      if (!response.ok) {
        throw new Error(`Failed to add milestone: ${response.status}`);
      }
      const data: MilestoneAPIResponse = await response.json();
      const newMilestone = mapMilestone(data);
      milestones.value.push(newMilestone);
      return newMilestone;
    } catch (e: any) {
      error.value = e.message || 'Failed to add milestone';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>>) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/milestones/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`Failed to update milestone: ${response.status}`);
      }
      const data: MilestoneAPIResponse = await response.json();
      const updatedMilestone = mapMilestone(data);
      const index = milestones.value.findIndex(m => m.id === id);
      if (index !== -1) {
        milestones.value[index] = updatedMilestone;
      }
      return updatedMilestone;
    } catch (e: any) {
      error.value = e.message || 'Failed to update milestone';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const deleteMilestone = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/milestones/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete milestone: ${response.status}`);
      }
      milestones.value = milestones.value.filter(m => m.id !== id);
      return true;
    } catch (e: any) {
      error.value = e.message || 'Failed to delete milestone';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Team Member actions
  const addTeamMember = async (member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
  
      // Convert `imageUrl` to `profile_image` so the server recognizes it.
      const payload = {
        name: member.name,
        role: member.role,
        description: member.description,
        profile_image: member.imageUrl || null,  // If empty, pass null
        status: member.status, // if you store status too
      };
  
      const response = await fetch(`${apiUrl}/api/v1/team-members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to add team member: ${response.status}`);
      }
  
      // On success, map the server response back to your local type
      const data: TeamMemberAPIResponse = await response.json();
      const newMember = mapTeamMember(data);
      teamMembers.value.push(newMember);
      return newMember;
    } catch (e: any) {
      error.value = e.message || 'Failed to add team member';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
  
      // Convert imageUrl to profile_image
      const payload = {
        name: updates.name,
        role: updates.role,
        description: updates.description,
        profile_image: updates.imageUrl || null,
        status: updates.status,
      };
  
      const response = await fetch(`${apiUrl}/api/v1/team-members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Failed to update team member: ${response.status}`);
      }
  
      const data: TeamMemberAPIResponse = await response.json();
      const updatedMember = mapTeamMember(data);
      const index = teamMembers.value.findIndex(m => m.id === id);
      if (index !== -1) {
        teamMembers.value[index] = updatedMember;
      }
      return updatedMember;
    } catch (e: any) {
      error.value = e.message || 'Failed to update team member';
      throw e;
    } finally {
      loading.value = false;
    }
  };
  
  const deleteTeamMember = async (id: string) => {
    loading.value = true;
    error.value = null;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${apiUrl}/api/v1/team-members/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to delete team member: ${response.status}`);
      }
      teamMembers.value = teamMembers.value.filter(m => m.id !== id);
      return true;
    } catch (e: any) {
      error.value = e.message || 'Failed to delete team member';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    milestones,
    teamMembers,
    loading,
    error,
    activeTeamMembers,
    sortedMilestones,
    fetchData,
    addMilestone,
    updateMilestone,
    deleteMilestone,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
});
