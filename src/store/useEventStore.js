import { create } from "zustand";

export const useEventStore = create((set, get) => ({
  events: [],
  isLoading: false,
  error: null,

  currentPage: 1,
  totalPages: 1,

  activeEvent: null,
  isLoadingDetail: false,

  tempRegData: null,
  setTempRegData: (data) => set({ tempRegData: data }),
  clearTempRegData: () => set({ tempRegData: null }),

  activeFilter: "all",

  setFilter: (filterType) => {
    set({ activeFilter: filterType });
  },

  // FILTER
  getFilteredEvents: () => {
    const { events, activeFilter } = get();

    if (activeFilter === "all") {
      return events;
    }

    if (activeFilter === "available") {
      return events.filter(
        (item) => item.status === "published" && !item.is_full,
      );
    }

    if (activeFilter === "closed") {
      return events.filter(
        (item) => item.status !== "published" || item.is_full,
      );
    }

    return events;
  },

  //  FETCH EVENT
  fetchEvents: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events?page=${page}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        throw new Error("Gagal fetch events " + response.statusText);
      }

      const result = await response.json();

      const dataEvents = result.data || [];

      const lastPage =
        result.last_page ||
        Math.ceil((result.total || 0) / (result.per_page || 10)) ||
        1;

      set({
        events: dataEvents,
        currentPage: page,
        totalPages: lastPage,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      set({ error: error.message, isLoading: false });
    }
  },

  //  FETCH EVENT DETAIL
  fetchEventDetail: async (slug) => {
    set({ isLoadingDetail: true, error: null, activeEvent: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${slug}`,
      );

      if (!response.ok) {
        throw new Error("Gagal fetch detail event (Error 404/500)");
      }

      const result = await response.json();
      const dataDetail = result.data || result;

      set({
        activeEvent: dataDetail,
        isLoadingDetail: false,
      });
    } catch (err) {
      console.error("Error fetching event detail:", err);
      set({ error: err.message, isLoadingDetail: false });
    }
  },

  registerForEvent: async (eventId, payloadFromData, token) => {
    set({ isRegistering: true, error: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: payloadFromData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed register event");
      }

      set({ isRegistering: false });
      return { success: true, data: result };
    } catch (error) {
      console.error("Error while entry events:", error);
      set({ error: error.message, isRegistering: false });
      return { success: false, message: error.message };
    }
  },

  //  RESET ACTIVE EVENT
  resetActiveEvent: () => set({ activeEvent: null }),

  //  SET PAGE
  setPage: (pageNumber) => {
    const { fetchEvents } = get();
    fetchEvents(pageNumber);
  },
}));
