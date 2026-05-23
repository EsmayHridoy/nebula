import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { authApi, userApi, setAuthCookies, clearAuthCookies } from "@/lib/api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Register
      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { accessToken, refreshToken, user } = response.data;
          setAuthCookies(accessToken, refreshToken);
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message =
            err.response?.data?.message || "Registration failed";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Login
      login: async (usernameOrEmail, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ usernameOrEmail, password });
          const { accessToken, refreshToken, user } = response.data;
          setAuthCookies(accessToken, refreshToken);
          set({ user, isAuthenticated: true, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || "Login failed";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      // Logout
      logout: async () => {
        try {
          await authApi.logout();
        } catch (_) {
          // Ignore logout errors
        } finally {
          clearAuthCookies();
          set({ user: null, isAuthenticated: false, error: null });
        }
      },

      // Fetch current user (e.g. on app load)
      fetchMe: async () => {
        const token = Cookies.get("accessToken");
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        set({ isLoading: true });
        try {
          const response = await userApi.getMe();
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch (_) {
          clearAuthCookies();
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      // Update profile
      updateProfile: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await userApi.updateMe(data);
          set({ user: response.data, isLoading: false });
          return { success: true };
        } catch (err) {
          const message = err.response?.data?.message || "Update failed";
          set({ error: message, isLoading: false });
          return { success: false, error: message };
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

export default useAuthStore;
