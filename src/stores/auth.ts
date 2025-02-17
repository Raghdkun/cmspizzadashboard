import { ref } from "vue";
import { defineStore } from "pinia";

// Define User interface
interface User {
  id: number;
  name: string;
  email: string;
  // image?: string;
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuthStore = defineStore("auth", () => {
  // ----- State (using refs) -----
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);
  const token = ref<string>("");
  const errors = ref<Record<string, any>>({});
  const isInitialized = ref(false); // New flag to track initialization

  // ----- Actions -----

  /**
   * Attempt to log in with the provided credentials.
   */
  async function login(formData: Record<string, any>): Promise<void> {
    try {
      const res = await fetch("/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Login response:", res.status, data); // For debugging

      if (!res.ok || !data.token) {
        errors.value =
          data.errors ||
          data.error ||
          { message: "Login failed: Invalid credentials or no token returned." };
        return;
      }

      // If successful, clear errors and store the token/user
      errors.value = {};
      token.value = data.token;
      user.value = data.user;
      isAuthenticated.value = true;

      // Save token to local storage so session is persisted on refresh
      localStorage.setItem("token", data.token);

    } catch (error) {
      console.error("Login error:", error);
      errors.value = { message: "An unexpected error occurred during login." };
    }
  }

  /**
   * Attempt to register with the provided formData (name, email, password, etc.).
   */
  async function register(formData: Record<string, any>): Promise<void> {
    try {
      const res = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("Register response:", res.status, data); // For debugging

      if (!res.ok || !data.token) {
        errors.value =
          data.errors ||
          data.error ||
          { message: "Registration failed: Invalid data or no token returned." };
        return;
      }

      errors.value = {};
      token.value = data.token;
      user.value = data.user;
      isAuthenticated.value = true;

      // Save token in localStorage
      localStorage.setItem("token", data.token);
    } catch (error) {
      console.error("Registration error:", error);
      errors.value = { message: "An unexpected error occurred during registration." };
    }
  }

  /**
   * Log out the current user by calling the logout endpoint,
   * then clearing user, token, isAuthenticated, and localStorage.
   */
  async function logout(): Promise<void> {
    if (!token.value) return;

    try {
      const res = await fetch("/api/v1/logout", {
        method: "POST",
        headers: {
          authorization: `Bearer ${token.value}`,
        },
      });

      // Even if the request fails, we'll clear local auth state
      if (res.ok) {
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        errors.value = {};
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Logout error:", error);
      errors.value = { message: "An unexpected error occurred during logout." };
    }
  }

  /**
   * Fetch the current user if a token is in localStorage.
   * This helps restore user state after a page refresh.
   */
  async function getUser(): Promise<void> {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      isInitialized.value = true; // Mark as initialized even if no token exists
      return;
    }

    token.value = savedToken;

    try {
      const res = await fetch("/api/v1/user", {
        headers: {
          authorization: `Bearer ${token.value}`,
        },
      });
      const data = await res.json();
      console.log("GetUser response:", res.status, data); // For debugging

      if (res.ok) {
        user.value = data;
        isAuthenticated.value = true;
      } else {
        // If the token is invalid or expired, clear the state
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("GetUser error:", error);
      errors.value = { message: "An unexpected error occurred while fetching user data." };
    } finally {
      isInitialized.value = true; // Mark as initialized after attempting to fetch user
    }
  }

  /**
   * Initialize the authentication state.
   * This should be called once when the app starts.
   */
  async function initialize(): Promise<void> {
    if (isInitialized.value) return; // Prevent multiple initializations
    await getUser(); // Restore authentication state
  }

  // Return the reactive state and actions so they can be used in components
  return {
    user,
    isAuthenticated,
    token,
    errors,
    isInitialized,
    login,
    register,
    logout,
    getUser,
    initialize,
  };
});