"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams, useParams } from "next/navigation";
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
  CornerDownRight,
  Loader2,
} from "lucide-react";

import MemberHeader from "../../../components/SiteHeaderMember";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

import { useAuthStore } from "@/store/useAuthStore";

// Nested comment
const CommentNode = ({
  comment,
  depth = 0,
  onReport,
  onReply,
  currentUser,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const toggleExpand = () => {
    if (comment.replies && comment.replies.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  const getIndentClass = (level) => {
    if (level === 0) return "pl-0";
    if (level === 1) return "pl-4 md:pl-10";
    if (level === 2) return "pl-8 md:pl-16";
    if (level >= 3) return "pl-10 md:pl-24";
    return "pl-0";
  };

  // helper
  const authorName = comment.user?.name || "Unknown";
  const authorRole = comment.user?.role || "Member";

  let formattedTime = comment.created_at;
  if (comment.created_at) {
    const dateObj = new Date(comment.created_at);
    formattedTime = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ||
      "https://admin.yayasanmangroveindonesia.com";
    let cleanPath = path;

    // if (!cleanPath.startsWith("public/")) {
    //   cleanPath = cleanPath.replace("public/", "");
    // }

    // if (cleanPath.startsWith("/public/")) {
    //   cleanPath = cleanPath.replace("/public/", "");
    // }

    // cleanPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    // if (!cleanPath.startsWith("/storage/")) {
    //   cleanPath = `/storage${cleanPath}`;
    // }

    return `${baseUrl}${cleanPath}`;
  };

  const currentUserAvatarPath =
    currentUser?.profile?.profile_picture_url ||
    currentUser?.profile?.profile_picture ||
    currentUser?.profile_picture_url ||
    currentUser?.avatar;

  const currentUserAvatarUrl = getImageUrl(currentUserAvatarPath);

  const isMyComment =
    comment.user?.id === currentUser?.id || comment.user_id === currentUser?.id;
  const commentAvatarPath =
    comment.user?.profile?.profile_picture_url ||
    comment.user?.profile?.profile_picture ||
    comment.user?.profile_picture_url ||
    comment.user?.profile_picture ||
    comment.user?.avatar ||
    comment.avatar;

  const avatarUrl =
    isMyComment && currentUserAvatarUrl
      ? currentUserAvatarUrl
      : getImageUrl(commentAvatarPath);

  // HANDLE REPLY AN
  const handleSubmitReply = async (e) => {
    if (e) e.stopPropagation();

    if (!replyText.trim() || isSubmittingReply) return;

    setIsSubmittingReply(true);
    try {
      await onReply(comment.id, replyText);
      setReplyText("");
      setShowReplyBox(false);
      setIsExpanded(true);
    } catch (error) {
      console.error("Gagal membalas:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  return (
    <>
      {/* comment section */}
      <div
        onClick={toggleExpand}
        className={`p-4 md:p-6 lg:p-8 hover:bg-slate-50/50 transition-colors border-b border-slate-100 ${
          comment.replies?.length > 0 ? "cursor-pointer" : ""
        }`}
      >
        <div
          className={`flex items-start ${getIndentClass(depth)} transition-all duration-300`}
        >
          {depth > 0 && (
            <CornerDownRight
              size={20}
              className="text-slate-400 shrink-0 md:w-6 md:h-6 mr-3 md:mr-5 mt-1"
              strokeWidth={1.5}
            />
          )}

          {/* Container Comment */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#A4CF4A] shrink-0 bg-slate-100 flex items-center justify-center">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={authorName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-xs uppercase">
                      {authorName.substring(0, 2)}
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#A4CF4A]" />
                    <p className="text-[8px] md:text-[9px] font-bold text-[#A4CF4A] uppercase tracking-wider">
                      {authorRole}
                    </p>
                  </div>
                  <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-none mt-0.5 wrap-break-word">
                    {authorName}
                  </h3>
                  <p className="text-[9px] md:text-[10px] text-slate-400 mt-1">
                    {formattedTime}
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReport(comment.id);
                }}
                className="text-slate-400 hover:text-red-500 transition"
              >
                <Flag size={18} />
              </button>
            </div>

            <p
              className={`text-slate-700 text-xs md:text-sm leading-relaxed mb-4 pl-1 ${
                depth === 0 ? "font-medium text-slate-900" : ""
              }`}
            >
              {comment.body}
            </p>

            {/* Comment & count */}
            <div className="flex flex-wrap gap-3 justify-between items-center ">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReplyBox(!showReplyBox);
                }}
                className="text-xs md:text-sm font-bold transition hover:opacity-80 text-[#56B6E4]"
              >
                {showReplyBox ? "Cancel" : "Reply"}
              </button>

              <div className="flex items-center gap-2 group">
                <MessageCircle
                  size={20}
                  className="fill-slate-700 text-slate-700 transition-colors"
                />
                <span className="font-extrabold text-base md:text-lg leading-none mt-0.5 transition-colors">
                  {comment.replies?.length || 0}
                </span>
              </div>
            </div>

            {/* reply box */}
            {showReplyBox && currentUser && (
              <div
                className="mt-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-[#A4CF4A]/30 bg-slate-100 flex items-center justify-center">
                  {currentUserAvatarUrl ? (
                    <Image
                      src={currentUserAvatarUrl}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-[10px] uppercase">
                      {currentUser?.name
                        ? currentUser.name.substring(0, 2)
                        : "ME"}
                    </span>
                  )}
                </div>

                <label className="flex-1 border border-slate-200 rounded-full flex items-center px-4 bg-white focus-within:border-[#A4CF4A]/50 transition shadow-sm cursor-text">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !isSubmittingReply &&
                        replyText.trim()
                      ) {
                        e.preventDefault();
                        handleSubmitReply(e);
                      }
                    }}
                    placeholder={`Replying to ${authorName}...`}
                    className="w-full py-2 bg-transparent outline-none text-xs md:text-sm font-medium text-slate-700 placeholder:text-slate-400"
                    disabled={isSubmittingReply}
                    autoFocus
                  />
                </label>
                <button
                  type="button"
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="text-[#A4CF4A] hover:text-[#8cb83d] transition shrink-0 drop-shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingReply ? (
                    <Loader2
                      size={24}
                      className="animate-spin text-[#A4CF4A]"
                    />
                  ) : (
                    <Send
                      size={24}
                      strokeWidth={2.5}
                      className={replyText.trim() ? "fill-[#A4CF4A]" : ""}
                    />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* nested replies */}
      {isExpanded &&
        comment.replies &&
        comment.replies.filter((r) => r.status !== "deleted").length > 0 && (
          <div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-300">
            {comment.replies
              .filter((reply) => reply.status !== "deleted")
              .map((reply) => (
                <CommentNode
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onReport={onReport}
                  onReply={onReply}
                  currentUser={currentUser}
                />
              ))}
          </div>
        )}
    </>
  );
};

//  DETAIL POST
export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const postId = params?.id || searchParams.get("id");

  const ACCENT = "#A4CF4A";
  const SOFT_BG = "#F4F9DF";

  const { isAuthenticated, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  //  STATE MODAL REPORT
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [reportCategory, setReportCategory] = useState("");

  // PEMBEDA REPORT POST AMA THREAD
  const [reportType, setReportType] = useState("post");

  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const reportOptions = [
    "Harm",
    "Hate/Abuse/Harassment",
    "Suicide/Self Harm",
    "Violent Speech",
  ];

  const handleOpenReportModal = (id, type = "post") => {
    setSelectedContentId(id);
    setReportType(type);
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

      const endpoint =
        reportType === "post"
          ? `/posts/${selectedContentId}/report`
          : `/threads/${selectedContentId}/report`;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
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

  const fetchPostDetail = async () => {
    if (!postId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // const token = localStorage.getItem("token") || "";
      const token = useAuthStore.getState().token;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      setPostData(response.data.data || response.data);
    } catch (error) {
      console.error("Gagal memuat detail post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // HANDLE CREATE COMMENT (KOMEN)
  const handleCreateComment = async () => {
    if (!commentText.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      // const token = localStorage.getItem("token") || "";
      const token = useAuthStore.getState().token;

      const payload = {
        post_id: postId,
        body: commentText,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/threads`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      setCommentText("");
      await fetchPostDetail();
    } catch (error) {
      console.error("Gagal mengirim komentar:", error);
      const serverMessage =
        error.response?.data?.message || "Gagal mengirim komentar";
      alert(`Error: ${serverMessage}`);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // HANDLE NESTED COMMENT
  const handleCreateReply = async (parentThreadId, text) => {
    try {
      // const token = localStorage.getItem("token") || "";
      const token = useAuthStore.getState().token;

      const payload = {
        post_id: postId,
        parent_thread_id: parentThreadId,
        body: text,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/threads`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      await fetchPostDetail();
    } catch (error) {
      console.error("Gagal membalas komentar:", error);
      const serverMessage =
        error.response?.data?.message || "Gagal mengirim balasan";
      alert(`Error: ${serverMessage}`);
      throw error;
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    if (postId) {
      fetchPostDetail();
    } else {
      setIsLoading(false);
    }
  }, [postId]);

  if (!isHydrated) return null;

  const getImageUrl = (path) => {
    if (!path) return null;

    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

    let cleanPath = path;

    if (cleanPath.startsWith("public/"))
      cleanPath = cleanPath.replace("public/", "");
    if (cleanPath.startsWith("/public/"))
      cleanPath = cleanPath.replace("/public/", "");

    cleanPath = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

    if (!cleanPath.startsWith("/storage/")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A4CF4A]"></div>
        <p className="text-slate-500 font-bold animate-pulse tracking-widest">
          Loading Posts...
        </p>
      </div>
    );
  }

  if (!postData) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-700">Posts not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 text-[#A4CF4A] hover:underline"
        >
          Back to General
        </button>
      </div>
    );
  }

  const authorName = postData.user?.name || "Unknown";
  const authorRole = postData.user?.role || "Member";

  let formattedTime = postData.created_at;
  if (postData.created_at) {
    const dateObj = new Date(postData.created_at);
    formattedTime = dateObj.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // const getImageUrl = (path) => {
  //   if (!path) return null;
  //   if (path.startsWith("http")) return path;

  //   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";
  //   const imagePath = path.startsWith("/") ? path : `/${path}`;

  //   return `${baseUrl}${imagePath}`;
  // };

  // const currenUserAvatarUrl = getImageUrl(user?.avatar || user?.profile_picture || user?.image);

  const currentUserAvatarPath =
    user?.profile?.profile_picture_url ||
    user?.profile?.profile_picture ||
    user?.profile_picture_url ||
    user?.avatar;

  const currentUserAvatarUrl = getImageUrl(currentUserAvatarPath);

  const isMyPost =
    postData.user?.id === user?.id || postData.user_id === user?.id;
  const authorAvatarPath =
    postData.user?.profile?.profile_picture_url ||
    postData.user?.profile?.profile_picture ||
    postData.user?.profile_picture_url ||
    postData.user?.profile_picture ||
    postData.user?.avatar ||
    postData.avatar;

  const avatarUrl =
    isMyPost && currentUserAvatarUrl
      ? currentUserAvatarUrl
      : getImageUrl(authorAvatarPath);

  const postImageUrl = getImageUrl(postData.picture || postData.image);

  // BAGIAN ATAS POST (main post)
  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 flex flex-col relative">
      {isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-32 pb-20">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-[#A4CF4A] transition mb-6 font-medium"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <div className="text-center mb-10">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              WELCOME TO
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Mangrove<span style={{ color: ACCENT }}>Community</span>
            </h1>
          </div>

          <div className="bg-white rounded-[30px] shadow-sm border border-slate-100 overflow-hidden mb-10">
            {/* MAIN POST */}
            <div className="p-6 md:p-8">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#A4CF4A] shrink-0 bg-slate-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={authorName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-slate-400 font-bold text-xs uppercase">
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
                    <h3 className="text-base font-extrabold text-slate-900 leading-none mt-0.5">
                      {authorName}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formattedTime}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenReportModal(postData.id, "post")}
                  className="text-slate-400 hover:text-red-500 transition"
                >
                  <Flag size={20} />
                </button>
              </div>

              <p className="text-slate-700 text-sm font-medium md:text-base leading-relaxed mb-4 pl-1">
                {postData.body}
              </p>

              {postData?.images &&
                Array.isArray(postData.images) &&
                postData.images.length > 0 && (
                  <div
                    className={`grid gap-2 mb-4 mt-2 ${
                      postData.images.length === 1
                        ? "grid-cols-1"
                        : postData.images.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-2 md:grid-cols-3"
                    }`}
                  >
                    {postData.images.map((imgPath, idx) => {
                      const fullImgUrl = getImageUrl(imgPath);
                      return (
                        <div
                          key={idx}
                          className={`relative w-full rounded-2xl overflow-hidden shadow-sm border border-slate-100 ${
                            postData.images.length === 1
                              ? "h-[300px] md:h-[450px]"
                              : "h-[140px] sm:h-40 md:h-[200px]"
                          }`}
                        >
                          <Image
                            src={fullImgUrl}
                            alt={`Post Image`}
                            className="object-contain w-full h-full"
                            fill
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

              {/* fallback img */}
              {(!postData?.images || postData.images.length === 0) &&
                (postData?.picture || postData?.image) && (
                  <div className="relative w-full h-[250px] md:h-[450px] rounded-2xl overflow-hidden mb-4 shadow-sm border border-slate-100">
                    <img
                      src={getImageUrl(postData.picture || postData.image)}
                      alt="Post Attachment"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

              {/* LIKE AND COMMENT COUN */}
              <div className="flex justify-end items-center gap-4 text-slate-700 mt-4">
                <div className="flex items-center gap-1 hover:text-[#A4CF4A] cursor-pointer transition group">
                  <ArrowUp
                    size={24}
                    strokeWidth={2.5}
                    className="group-hover:-translate-y-0.5 transition-transform"
                  />
                  <span className="font-bold">
                    {postData.upvotes_count || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1 hover:text-red-500 cursor-pointer transition group">
                  <ArrowDown
                    size={24}
                    strokeWidth={2.5}
                    className="group-hover:translate-y-0.5 transition-transform"
                  />
                  <span className="font-bold">
                    {postData.downvotes_count || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2 ml-2 cursor-default">
                  <MessageCircle
                    size={24}
                    className="fill-slate-700 text-slate-700"
                  />
                  <span className="font-extrabold text-xl leading-none mt-0.5">
                    {postData.threads?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* COMMENT INPUT BOX */}
            {isAuthenticated && (
              <div className="p-6 md:p-8 flex items-center gap-4 bg-slate-50/50">
                <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-[#A4CF4A] bg-white flex items-center justify-center shadow-inner">
                  {currentUserAvatarUrl ? (
                    <Image
                      src={currentUserAvatarUrl}
                      alt="User"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-slate-400 font-bold text-sm uppercase">
                      {user?.name ? user.name.substring(0, 2) : "ME"}
                    </span>
                  )}
                </div>
                <label className="flex-1 border border-slate-200 rounded-full flex items-center px-5 bg-white focus-within:border-[#A4CF4A]/50 transition shadow-sm">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !isSubmittingComment &&
                        commentText.trim()
                      ) {
                        handleCreateComment();
                      }
                    }}
                    placeholder="LEAVE YOUR COMMENT HERE"
                    className="w-full py-3 bg-transparent outline-none text-[13px] md:text-sm font-medium text-slate-700 placeholder:text-slate-400 tracking-wide"
                    disabled={isSubmittingComment}
                  />
                </label>
                <button
                  onClick={handleCreateComment}
                  disabled={!commentText.trim() || isSubmittingComment}
                  className="text-[#A4CF4A] hover:text-[#8cb83d] transition shrink-0 drop-shadow-sm hover:scale-110 transform duration-200 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isSubmittingComment ? (
                    <Loader2
                      size={32}
                      className="animate-spin text-[#A4CF4A]"
                    />
                  ) : (
                    <Send
                      size={28}
                      strokeWidth={2.5}
                      className={commentText.trim() ? "fill-[#A4CF4A]" : ""}
                    />
                  )}
                </button>
              </div>
            )}

            <hr className="border-slate-100" />

            {/* THREAD / REPLY */}
            <div className="flex flex-col">
              {!postData.threads ||
              postData.threads.filter((t) => t.status !== "deleted").length ===
                0 ? (
                <div className="p-10 text-center text-slate-400 font-medium">
                  Be the first comment to discuss
                </div>
              ) : (
                postData.threads
                  .filter((thread) => thread.status !== "deleted")
                  .map((thread) => (
                    <CommentNode
                      key={thread.id}
                      comment={thread}
                      depth={0}
                      onReport={(id) => handleOpenReportModal(id, "thread")}
                      onReply={handleCreateReply}
                      currentUser={user}
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

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
            style={{ backgroundColor: SOFT_BG }}
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
