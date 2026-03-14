import { create } from "zustand";

const API_BASE_URL = "process.env.NEXT_PUBLIC_API_URL;";

export const useBlogsStore = create((set, get) => ({
  // --- STATE ---
  blogs: [],
  currentPage: 1,
  totalPages: 1,
  activeFilter: "all",
  activeBlog: null,
  isLoading: false,
  isLoadingDetail: false,
  error: null,

  // --- ACTIONS ---
  fetchBlog: async (page = 1, filter = "all") => {
    set({ isLoading: true, error: null });

    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/blogs?page=${page}`;
      if (filter !== "all") {
        url += `&type=${filter}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `Gagal memuat blog (Error ${response.status}).`,
        );
      }

      const result = await response.json();
      const dataNews = result.data || [];

      set({
        blogs: dataNews,
        currentPage: result.current_page || page,
        totalPages: Math.ceil((result.total || 0) / (result.per_page || 10)),
        activeFilter: filter,
        isLoading: false,
      });
    } catch (err) {
      console.error("Gagal fetch blog:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  fetchBlogDetail: async (id) => {
    set({ isLoadingDetail: true, error: null, activeBlog: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blogs/${id}`,
      );

      if (!response.ok) {
        throw new Error("Gagal fetch detail berita");
      }

      const result = await response.json();
      console.log("📦 HASIL API DETAIL:", result);

      const dataDetail = result.data || result;
      set({
        activeBlog: dataDetail,
        isLoadingDetail: false,
      });
    } catch (error) {
      console.error("Gagal fetch blog detail:", err);
      set({ error: err.message, isLoading: false });
    }
  },

  resetActiveBlog: () => set({ activeBlog: null }),

  // Ganti Halaman
  setPage: (pageNumber) => {
    const { activeFilter, fetchBlog } = get();
    fetchBlog(pageNumber, activeFilter);
  },

  // Next Page
  nextPage: () => {
    const { currentPage, totalPages, setPage } = get();
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  },

  // Prev Page
  // prevPage: () => {
  //   const { currentPage } = get();
  //   if (currentPage > 1) {
  //     set({ currentPage: currentPage - 1 });
  //   }
  // },

  // // Reset Pagination
  // resetPagination: () => {
  //   set({ currentPage: 1 });
  // },

  setFilter: (category) => {
    const { fetchBlog } = get();
    fetchBlog(1, category);
  },
}));
