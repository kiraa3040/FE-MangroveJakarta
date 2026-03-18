"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import axios from "axios";
import {
  ChevronLeft,
  Image as ImageIcon,
  Send,
  Flag,
  ArrowUp,
  ArrowDown,
  MessageCircle,
  X,
  Check,
  Loader2,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import MemberHeader from "../../components/SiteHeaderMember";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import { useCommunityStore } from "@/store/useCommunityStore";
import { useAuthStore } from "@/store/useAuthStore";

import Loading from "../loading";

export default function CommunityPage() {
  const router = useRouter();
  const ACCENT = "#A4CF4A";

  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // STATE POST & FEED
  const { activeTab, setTab, posts, fetchPosts, isLoading, deletePost } =
    useCommunityStore();

  const finalPosts =
    activeTab === "general"
      ? posts
      : posts.filter((post) => {
          const authorId = post.user_id || post.user?.id;
          return authorId == user?.id;
        });

  // STATE CREATE POST
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const fileInputRef = useRef(null);

  const handleCreatePost = async (e) => {
    if (!postContent.trim() && selectedImages.length === 0) return;

    setIsSubmitting(true);
    // const token = localStorage.getItem("token") || "";
    const token = useAuthStore.getState().token;

    try {
      const formData = new FormData();

      // text
      if (postContent.trim()) {
        formData.append("body", postContent.trim());
      }

      // image
      if (selectedImages.length > 0) {
        selectedImages.forEach((file) => {
          formData.append("images[]", file);
        });
        // console.log(`Mengirim post dengan ${selectedImages.length} gambar...`);
      } else {
        // console.log("Mengirim post teks saja...");
      }

      const postRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      // console.log("Respon Create Post:", postRes.data);

      setPostContent("");
      setSelectedImages([]);
      setImagePreviews([]);

      await fetchPosts();
    } catch (error) {
      console.error("Failed to create post:", error);
      alert(
        // `Gagal membuat post:\n${error.response?.data?.message || error.message}.`,
        setLocalError(result.message),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // HANDLE IMAGE
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const validFiles = files.filter((file) => file.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      alert("Image size too large (Max 5MB)");
    }

    const totalFiles = [...selectedImages, ...validFiles];

    if (totalFiles.length > 5) {
      alert("Image Total Max 5");
      const slicedFiles = totalFiles.slice(0, 5);
      setSelectedImages(slicedFiles);
      setImagePreviews(slicedFiles.map((file) => URL.createObjectURL(file)));
    } else {
      setSelectedImages(totalFiles);
      setImagePreviews(totalFiles.map((file) => URL.createObjectURL(file)));
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // DELETE POST
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = async (e, postId) => {
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this post?")) return;

    // const token = localStorage.getItem("token") || "";
    const token = useAuthStore.getState().token;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const openDeleteModal = (e, postId) => {
    e.stopPropagation();
    setPostIdToDelete(postId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postIdToDelete) return;

    setIsDeleting(true);
    // const token = localStorage.getItem("token");
    const token = useAuthStore.getState().token;

    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/SignIn");
      return;
    }

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postIdToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
      );

      // Berhasil
      setIsDeleteModalOpen(false);
      setPostIdToDelete(null);
      await fetchPosts();
    } catch (error) {
      console.error("Delete failed:", error);

      const serverMessage =
        error.response?.data?.message ||
        "You don't have permission to delete this post.";

      alert(`Error ${error.response?.status}: ${serverMessage}`);
      setIsDeleteModalOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  // STATE POPUP REPORT
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [reportCategory, setReportCategory] = useState("");

  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const reportOptions = [
    "Harm",
    "Hate/Abuse/Harassment",
    "Suicide/Self Harm",
    "Violent Speech",
  ];

  const handleOpenReportModal = (id) => {
    setSelectedContentId(id);
    setReportCategory("");
    setIsReportModalOpen(true);
  };

  const handleSubmitReport = async () => {
    if (!reportCategory || !selectedContentId) return;

    try {
      setIsSubmittingReport(true);
      // const token = localStorage.getItem("token") || "";
      const token = useAuthStore.getState().token;

      const payload = {
        reason: reportCategory,
      };

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${selectedContentId}/report`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      setIsReportModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
      const serverMessage = error.response?.data?.message || "Something wrong";
      alert(serverMessage);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  const [isVoting, setIsVoting] = useState(false);
  const handleVote = async (postId, voteType) => {
    if (!isAuthenticated) {
      alert("Login to voting post");
      return;
    }
    if (isVoting) return;

    try {
      setIsVoting(true);
      // const token = localStorage.getItem("token") || "";
      const token = useAuthStore.getState().token;
      
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/vote`,
        { type: voteType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );

      await fetchPosts();
    } catch (error) {
      console.error("Vote error:", error);
      const serverMessage = error.response?.data?.message || "Voted failed.";
      alert(serverMessage);
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  if (!isHydrated) return null;

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.startsWith("/storage")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  const currentUserAvatarPath =
    user?.profile?.profile_picture_url ||
    user?.profile?.profile_picture ||
    user?.profile_picture_url ||
    user?.avatar;

  const currentUserAvatarUrl = getImageUrl(currentUserAvatarPath);

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 flex flex-col relative">
      {/* NAVBAR */}
      {isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-24 md:pt-28 lg:pt-32 pb-16 md:pb-20">
        <div className="mx-auto w-full max-w-[950px] px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-[#A4CF4A] transition mb-6 md:mb-8 font-medium"
          >
            <ChevronLeft size={18} className="md:w-5 md:h-5" />
            Back
          </button>

          <div className="text-center mb-10">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              WELCOME TO
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Mangrove<span style={{ color: "#A4CF4A" }}>Community</span>
            </h1>
          </div>

          {/*  TABS (GENERAL & MY POSTS) */}
          <div className="flex bg-white rounded-full shadow-sm border border-slate-100 p-1 mb-6 md:mb-8">
            <button
              onClick={() => setTab("general")}
              className={`flex-1 py-2.5 md:py-3 rounded-full text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === "general"
                  ? "bg-[#A4CF4A] text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              GENERAL
            </button>
            <button
              onClick={() => setTab("my_posts")}
              className={`flex-1 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all duration-300 ${
                activeTab === "my_posts"
                  ? "bg-slate-500 text-white shadow-md"
                  : "bg-transparent text-slate-500 hover:bg-slate-50"
              }`}
            >
              MY POSTS
            </button>
          </div>

          {/*  POSTS FEED AREA  */}
          <div className="flex flex-col gap-6">
            {/* CREATE POST BOX */}
            {activeTab === "general" && isAuthenticated && (
              <div className="bg-white rounded-[30px] p-4 md:p-6 shadow-sm border border-slate-100 flex items-center gap-3 md:gap-4 mb-2 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#A4CF4A]/20 bg-slate-100 flex items-center justify-center shadow-inner">
                  {currentUserAvatarUrl ? (
                    <Image
                      src={currentUserAvatarUrl}
                      alt="User Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-sm uppercase">
                      {user?.name ? user.name.substring(0, 2) : "ME"}
                    </span>
                  )}
                </div>

                <label className="flex-1 border border-slate-200 rounded-full flex items-center px-4 md:px-5 bg-slate-50 focus-within:border-[#A4CF4A]/50 focus-within:bg-white transition cursor-text">
                  <input
                    type="text"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isSubmitting) {
                        handleCreatePost();
                      }
                    }}
                    placeholder="START CREATE YOUR POST HERE."
                    className="w-full py-3 bg-transparent outline-none text-xs md:text-sm font-medium text-slate-700 placeholder:text-slate-400  tracking-wide"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imagePreviews.length >= 5 || isSubmitting}
                    className={`transition ml-2 flex items-center gap-1.5 shrink-0 ${
                      imagePreviews.length >= 5
                        ? "text-red-400 cursor-not-allowed"
                        : "text-slate-400 hover:text-[#A4CF4A]"
                    }`}
                    title={
                      imagePreviews.length >= 5
                        ? "Up to 5 images"
                        : "Add images"
                    }
                  >
                    <ImageIcon size={20} />
                    <span>{imagePreviews.length}/5</span>
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/webp, image/gif"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                  />
                </label>

                {/* preview img */}
                {imagePreviews.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-1">
                    {imagePreviews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 shadow-sm animate-in zoom-in-95 bg-slate-50 flex items-center justify-center"
                      >
                        <Image
                          src={src}
                          fill
                          alt="preview"
                          className="object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white rounded-full p-1 transition-colors backdrop-blur-sm"
                        >
                          <X size={12} strokeWidth={3} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim() || isSubmitting}
                  className="text-[#A4CF4A] hover:text-[#8cb83d] transition shrink-0 drop-shadow-sm hover:scale-110 transform duration-200 active:scale-95"
                >
                  {isSubmitting ? (
                    <Loader2
                      size={32}
                      className="animate-spin text-[#A4CF4A]"
                    />
                  ) : (
                    <Send
                      size={24}
                      className="md:w-7 md:h-7"
                      strokeWidth={2.5}
                    />
                  )}
                </button>
              </div>
            )}

            {/* FEED */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[30px] shadow-sm border border-slate-100 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute w-full h-full rounded-full border-4 border-gray-200"></div>
                  <div
                    className="absolute w-full h-full rounded-full border-4 border-t-transparent animate-spin"
                    style={{
                      borderColor:
                        "#A4CF4A transparent transparent transparent",
                    }}
                  ></div>
                </div>
                <p className="text-sm font-bold tracking-widest text-[#A4CF4A] animate-pulse">
                  Loading Community...
                </p>
              </div>
            ) : finalPosts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[30px] border border-slate-100 shadow-sm text-slate-400 font-medium">
                {activeTab === "my_posts"
                  ? "You haven't made any posts yet."
                  : "There are no posts in this community yet."}
              </div>
            ) : (
              finalPosts.map((post) => {
                const authorName = post.user?.name || "Unknown";
                const authorRole = post.user?.role || "MEMBER";
                const commentsCount =
                  post.threads_count || post.threads?.length || 0;

                let formattedTime = post.created_at || post.time;
                if (post.created_at) {
                  const dateObj = new Date(post.created_at);
                  formattedTime = dateObj.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                }

                const isMyPost =
                  post.user?.id === user?.id || post.user_id === user?.id;

                const authorAvatarPath =
                  post.user?.profile?.profile_picture_url ||
                  post.user?.profile?.profile_picture ||
                  post.user?.profile_picture_url ||
                  post.user?.profile_picture ||
                  post.user?.avatar ||
                  post.avatar;

                const avatarUrl =
                  isMyPost && currentUserAvatarUrl
                    ? currentUserAvatarUrl
                    : getImageUrl(authorAvatarPath);

                const postImageUrl = getImageUrl(post.picture || post.image);

                return (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/CommunityPage/${post.id}`)}
                    className="bg-white rounded-2xl md:rounded-[30px] p-4 md:p-6 shadow-sm border border-slate-100"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#A4CF4A]/20 shrink-0 bg-slate-100 flex items-center justify-center">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt={authorName}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-slate-400 font-bold text-xs">
                              {authorName.substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-[#A4CF4A]" />
                            <p className="text-[9px] font-bold text-[#A4CF4A] uppercase tracking-wider">
                              {authorRole}
                            </p>
                          </div>
                          <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-none mt-2">
                            {authorName}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-2">
                            {formattedTime}
                          </p>
                        </div>
                      </div>
                      {/* FLAG REPORT*/}
                      {isMyPost ? (
                        <button
                          onClick={(e) => openDeleteModal(e, post.id)}
                          className="text-slate-300 hover:text-red-600 transition-colors p-1"
                          title="Delete My Post"
                        >
                          <Trash2 size={18} />{" "}
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReportModal(post.id);
                          }}
                          className="text-slate-400 hover:text-red-500 transition p-1"
                          title="Report Post"
                        >
                          <Flag size={18} />
                        </button>
                      )}
                    </div>

                    <p className="text-slate-700 text-sm md:text-[15px] font-medium leading-relaxed mb-4 pl-1 line-clamp-4">
                      {post.body}
                    </p>

                    {/* post image */}
                    {post.images &&
                      Array.isArray(post.images) &&
                      post.images.length > 0 && (
                        <div
                          className={`grid gap-2 md:gap-3 mb-4 mt-2 ${
                            post.images.length === 1
                              ? "grid-cols-1"
                              : post.images.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2 md:grid-cols-3"
                          }`}
                        >
                          {post.images.map((imgPath, idx) => {
                            const fullImgUrl = getImageUrl(imgPath);
                            return (
                              <div
                                key={idx}
                                className={`relative w-full rounded-2xl overflow-hidden shadow-inner border border-slate-100 bg-slate-50 ${
                                  post.images.length === 1
                                    ? "h-[300px] md:h-[450px]"
                                    : "h-[140px] sm:h-40 md:h-[200px]"
                                }`}
                              >
                                <Image
                                  src={fullImgUrl}
                                  alt={`Attachment ${idx + 1}`}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            );
                          })}
                        </div>
                      )}

                    {/* FALLBACK JIKA BACKEND MASIH MENGIRIM SINGLE IMAGE PADA POST LAMA */}
                    {!post.images && (post.picture || post.image) && (
                      <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden mb-4 shadow-inner border border-slate-100">
                        <Image
                          src={getImageUrl(post.picture || post.image)}
                          alt="Post Attachment"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex justify-end items-center gap-3 md:gap-4 text-slate-700 pt-3 border-t border-slate-100 mt-2">
                      {/* up vote */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(post.id, "upvote");
                        }}
                        className="flex items-center gap-1 hover:text-[#A4CF4A] cursor-pointer transition group"
                      >
                        <ArrowUp
                          size={20}
                          strokeWidth={2.5}
                          className="group-hover:-translate-y-0.5 transition-transform md:w-5 md:h-5"
                        />
                        <span className="font-bold">
                          {post.upvotes_count || 0}
                        </span>
                      </div>

                      {/* down vote */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(post.id, "downvote");
                        }}
                        className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition group"
                      >
                        <ArrowDown
                          size={20}
                          strokeWidth={2.5}
                          className="group-hover:translate-y-0.5 transition-transform md:w-5 md:h-5"
                        />
                        <span className="font-bold">
                          {post.downvotes_count || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2  cursor-pointer transition">
                        <MessageCircle
                          size={22}
                          className="fill-slate-700 hover:fill-[#A4CF4A] transition-colors"
                        />
                        <span className="font-extrabold text-base md:text-lg leading-none mt-0.5">
                          {commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* MODAL DELETE CONFIRM */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          ></div>

          <div className="relative z-10 w-full max-w-[450px] bg-[#FFBABD] rounded-[40px] p-8 md:p-10 flex flex-col items-center text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Icon Trash Circle */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/30 rounded-full scale-125 animate-pulse"></div>
              <div className="absolute inset-2 bg-white/50 rounded-full scale-110"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <Trash2
                  size={32}
                  className="text-[#FF4D4D]"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-black mb-3 tracking-tight">
              Are you sure you want to delete this post?
            </h2>
            <p className="text-[13px] md:text-sm text-slate-800 font-medium mb-8 px-4 leading-relaxed">
              Once deleted, this post and all its comments will no longer be
              visible in the community
            </p>

            <div className="flex flex-col items-center mb-10 w-full">
              <div className="w-0.5 h-12 bg-white/60"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full -mt-1"></div>
            </div>

            {/* Buttons */}
            <div className="flex w-full gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 py-4 rounded-full bg-[#52B1D3] text-white text-sm md:text-base font-bold shadow-md hover:brightness-105 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50"
              >
                CANCEL
              </button>
              <button
                onClick={confirmDeletePost}
                disabled={isDeleting}
                className="flex-1 py-4 rounded-full bg-[#FF4D4D] text-white text-sm md:text-base font-bold shadow-md hover:brightness-105 active:scale-95 transition-all uppercase tracking-widest disabled:opacity-50 flex justify-center items-center"
              >
                {isDeleting ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "DELETE"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT ISSUE */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsReportModalOpen(false)}
          ></div>
          <div className="bg-white rounded-[30px] p-6 md:p-8 w-full max-w-[400px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={24} strokeWidth={2.5} />
            </button>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 text-center mb-2 mt-2">
              Report an Issue
            </h2>
            <p className="text-[13px] text-slate-600 text-center mb-6 px-2">
              Please choose the category that best describe your issue.
            </p>
            <div className="flex flex-col gap-4 mb-8 px-2">
              {reportOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-5 h-5 rounded-full border-[2.5px] flex items-center justify-center transition-colors ${reportCategory === option ? "border-[#A4CF4A]" : "border-slate-300 group-hover:border-[#A4CF4A]/50"}`}
                  >
                    {reportCategory === option && (
                      <div className="w-2.5 h-2.5 bg-[#A4CF4A] rounded-full" />
                    )}
                  </div>
                  <input
                    type="radio"
                    name="report_category"
                    value={option}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="hidden"
                  />
                  <span
                    className={`text-base font-medium transition-colors ${reportCategory === option ? "text-slate-800" : "text-slate-400 group-hover:text-slate-600"}`}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
            <button
              onClick={handleSubmitReport}
              disabled={!reportCategory || isSubmittingReport}
              className="w-full py-4 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: ACCENT }}
            >
              {isSubmittingReport ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "REPORT"
              )}
            </button>
          </div>
        </div>
      )}

      {/* REPORT SUCCESS */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSuccessModalOpen(false)}
          ></div>
          <div
            className="rounded-[30px] p-8 md:p-10 w-full max-w-[450px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center"
            style={{ backgroundColor: "#F4F9DF" }}
          >
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 rounded-full scale-125"></div>
              <div className="absolute inset-2 bg-white/70 rounded-full scale-110"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <Check size={36} strokeWidth={4} className="text-[#A4CF4A]" />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold text-black mb-2 tracking-tight">
              Report have been sent!
            </h2>
            <p className="text-[13px] md:text-sm text-slate-700 mb-6 px-4">
              Thank you for your contribution, we will processing your report :)
            </p>
            <div className="flex flex-col items-center mb-8">
              <div className="w-0.5 h-10 bg-[#A4CF4A]"></div>
              <div className="w-2.5 h-2.5 bg-[#A4CF4A] rounded-full -mt-0.5"></div>
            </div>
            <button
              onClick={() => setIsSuccessModalOpen(false)}
              className="w-full py-4 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest"
              style={{ backgroundColor: ACCENT }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
