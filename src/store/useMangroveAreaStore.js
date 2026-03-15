import { create } from "zustand";
import { useAuthStore } from "@/store/useAuthStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const useMangroveAreaStore = create((set, get) => ({
  areas: [],
  activeAreaEvents: [],
  activeAreaDetail: null,
  isLoading: false,
  error: null,
  isFetched: false,

  // FETCH SEMUA AREA
  fetchAreas: async () => {
    if (get().isFetched && get().areas.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const token = useAuthStore.getState().token;

      const response = await fetch(`${apiUrl}/mangrove-areas`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data area mangrove");
      }

      const result = await response.json();

      const dataAreas = result.data || (Array.isArray(result) ? result : []);

      set({
        areas: dataAreas,
        isLoading: false,
        isFetched: true,
      });
    } catch (err) {
      console.error("Error fetching mangrove areas:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  //  FETCH DETAIL AREA
  fetchAreaDetail: async (id) => {
    set({
      isLoading: true,
      error: null,
      activeAreaEvents: [],
      activeAreaDetail: null,
    });

    try {
      const token = useAuthStore.getState().token;
      const headersConfig = {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      const resDetail = await fetch(`${apiUrl}/mangrove-areas/${id}`, {
        headers: headersConfig,
      });

      if (!resDetail.ok) throw new Error("Gagal mengambil detail lokasi");
      const dataDetail = await resDetail.json();

      const resEvents = await fetch(`${apiUrl}/mangrove-areas/${id}/events`, {
        headers: headersConfig,
      });

      if (!resEvents.ok) throw new Error("Gagal mengambil event lokasi");
      const dataEvents = await resEvents.json();

      set({
        activeAreaDetail: dataDetail.data || dataDetail,
        activeAreaEvents:
          dataEvents.data || (Array.isArray(dataEvents) ? dataEvents : []),
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching area detail or events:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  closeDetail: () => {
    set({
      activeAreaDetail: null,
      activeAreaEvents: [],
    });
  },
}));

export default useMangroveAreaStore;
