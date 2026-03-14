import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      //  REGISTER 
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(userData),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.errors) {
              const firstErrorKey = Object.keys(data.errors)[0];
              throw new Error(data.errors[firstErrorKey][0]);
            }
            throw new Error(data.message || "Registrasi gagal");
          }

          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          set({ error: err.message, isLoading: false });
          return { success: false, message: err.message };
        }
      },

      //  LOGIN 
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const loginResponse = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const loginData = await loginResponse.json();

          if (!loginResponse.ok) {
            throw new Error(loginData.message || "Login failed");
          }

          const token = loginData.access_token;
          localStorage.setItem("token", token);

          console.log("Token found:", token);

          const sessionUrl = loginData.sessionUrl || null;

          const userResponse = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const userData = await userResponse.json();
          console.log("User Data found:", userData);

          if (!userResponse.ok) {
            throw new Error("Failed", error);
          }

          const finalUser = userData.data || userData;
          const userRoles = finalUser.roles || [];

          const isAdmin = userRoles.some((r) => {
            const name = r.name ? r.name.toLowerCase().trim() : "";
            return name === "admin" || name === "administrator";
          });

          console.log("IS ADMIN?:", isAdmin);

          const detectedRole = isAdmin ? "admin" : "member";

          set({
            user: finalUser,
            token: token,
            isAuthenticated: true,
            isLoading: false,
          });

          return { 
            success: true,
            role: detectedRole,
            sessionUrl: sessionUrl,
           };
        } catch (error) {
          console.error("Login Error:", error);
          set({ isLoading: false, error: error.message });
          return { success: false, message: error.message };
        }
      },

      // LOGOUT 
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          authError: null,
        });
        sessionStorage.removeItem("auth-storage");
        localStorage.removeItem("token");
        set({ isAuthenticated: false, user: null, token: null });
      },

      fetchUser: async () => {
        const token = get().token;
        if (!token) return;

        set({ isLoading: true });

        try {
          console.log("Mengambil data user dengan token:", token);

          const response = await fetch(`${API_BASE_URL}/me`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          // DEBUG 2
          console.log("Status Response:", response.status);

          if (!response.ok) {
            if (response.status === 401) {
              console.log("Token Expired/Invalid -> Logout");
              get().logout();
              throw new Error("Sesi habis, silakan login kembali.");
            }
            if (response.status === 404) {
              throw new Error("Route /api/user tidak ditemukan di Laravel.");
            }
            throw new Error(
              `Gagal mengambil data user (Status: ${response.status})`,
            );
          }

          const userData = await response.json();
          console.log("Data User berhasil didapat:", userData);

          set({ user: userData, isLoading: false });
        } catch (err) {
          console.error("Fetch User Error:", err);
          set({ isLoading: false, error: err.message });
        }
      },

      //  UPDATE PROFILE 
      updateProfile: async (formDataObj) => {
        const token = get().token;
        if (!token) return { success: false, message: "No token found" };

        set({ isLoading: true, error: null });

        try {
          const payload = new FormData();

          payload.append("name", formDataObj.name || "");
          payload.append("phone", formDataObj.phone || "");
          payload.append(
            "birthdate",
            formDataObj.birthdate || formDataObj.birth_date || "",
          );
          payload.append("city", formDataObj.city || "");
          payload.append("province", formDataObj.province || "");

          if (formDataObj.profile_picture) {
            payload.append("profile-picture", formDataObj.profile_picture);
          }

          // payload.append("_method", "PUT");

          console.log("Kirim update ke backend menggunakan FormData");

          const response = await fetch(`${API_BASE_URL}/me/profile`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: payload,
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.errors) {
              const firstErrorKey = Object.keys(data.errors)[0];
              throw new Error(data.errors[firstErrorKey][0]);
            }
            throw new Error(data.message || "Gagal mengupdate profil");
          }

          await get().fetchUser();

          set({ isLoading: false });
          return { success: true };
        } catch (err) {
          console.error("Update Profile Error:", err);
          set({ isLoading: false, error: err.message });
          return { success: false, message: err.message };
        }
      },
    }),

    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
