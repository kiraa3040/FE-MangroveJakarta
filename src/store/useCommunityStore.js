import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./useAuthStore";

export const useCommunityStore = create((set, get) => ({
//  STATE
  activeTab: "general",
  posts: [],
  isLoading: false,

  // ACTION
  setTab: (tabName) => set({ activeTab: tabName }),

  // GET POST
  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/posts`);

      const fetchedPosts = response.data.data.data || [];

      set({ posts: fetchedPosts, isLoading: false });
    } catch (error) {
      console.error("Failed Fetched Post:", error);
      set({ isLoading: false });
    }
  },

  // ADD POST
  addPost: (content) => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return;

    const newPost = {
      id: Date.now(),
      user_id: currentUser.id,
      author: currentUser.name || "User",
      avatar: currentUser.name,
      content: content,
      image: null,
      upvotes: 0,
      commentsCount: 0,
    };

    set((state) => ({
      posts: [newPost, ...state.posts],
    }));
  },

  // FILTER (GENERAL ato MY POST)
  getFilteredPosts: () => {
    const { posts, activeTab } = get();
    const currentUser = useAuthStore.getState().user;

    if (activeTab === "general") {
      return posts;
    } else if (activeTab === "my_posts" && currentUser) {
      return posts.filter((post) => {
        const authorId = post.user_id || post.user?.id;
        return authorId == currentUser.id;
      });
    }
    return posts;
  },
}));
