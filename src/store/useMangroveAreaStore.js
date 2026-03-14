import { create } from "zustand";
import { useAuthStore } from "@/store/useAuthStore"; // 1. IMPORT AUTH STORE

const useMangroveAreaStore = create((set, get) => ({
  areas: [],
  activeAreaEvents: [],
  activeAreaDetail: null,
  isLoading: false,
  error: null,
  isFetched: false,

  // --- 1. FETCH SEMUA AREA ---
  fetchAreas: async () => {
    if (get().isFetched && get().areas.length > 0) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      // 2. AMBIL TOKEN DARI AUTH STORE
      const token = useAuthStore.getState().token;

      const response = await fetch(
        "https://api.satriodev.online/api/mangrove-areas",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            // 3. KIRIM TOKEN KE BACKEND
            Authorization: token ? `Bearer ${token}` : "",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil data area mangrove");
      }

      const result = await response.json();

      // Antisipasi format backend: kadang langsung Array, kadang dibungkus { data: [...] }
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

  // --- 2. FETCH DETAIL AREA & EVENTNYA ---
  fetchAreaDetail: async (id) => {
    set({
      isLoading: true,
      error: null,
      activeAreaEvents: [],
      activeAreaDetail: null,
    });

    try {
      // Ambil Token lagi untuk Detail
      const token = useAuthStore.getState().token;
      const headersConfig = {
        Accept: "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      };

      // A. Ambil Info Detail Lokasi
      const resDetail = await fetch(
        `https://api.satriodev.online/api/mangrove-areas/${id}`,
        { headers: headersConfig },
      );

      if (!resDetail.ok) throw new Error("Gagal mengambil detail lokasi");
      const dataDetail = await resDetail.json();

      // B. Ambil Daftar Event di Lokasi Tersebut
      const resEvents = await fetch(
        `https://api.satriodev.online/api/mangrove-areas/${id}/events`,
        { headers: headersConfig },
      );

      if (!resEvents.ok) throw new Error("Gagal mengambil event lokasi");
      const dataEvents = await resEvents.json();

      // C. Simpan ke Store
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

  // --- 3. TUTUP POPUP ---
  closeDetail: () => {
    set({
      activeAreaDetail: null,
      activeAreaEvents: [],
    });
  },
}));

export default useMangroveAreaStore;
