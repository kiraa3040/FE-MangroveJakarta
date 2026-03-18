"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2, BellOff, BellRing } from "lucide-react";

import MemberHeader from "@/components/SiteHeaderMember";
import SiteFooter from "@/components/SiteFooter";

import { useAuthStore } from "@/store/useAuthStore";

export default function NotificationsPage() {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // STATE NOTIF
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = useAuthStore.getState().token;

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      const dataNotif = response.data.data || response.data || [];
      setNotifications(dataNotif);
    } catch (error) {
      console.error("Failed fetch data:", error);
      setError("Gagal memuat notifikasi. Silakan coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  const markAllAsRead = async (token) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      // console.log("All notificaton mark as read (read-all).");
    } catch (error) {
      console.error(error);
    }
  };

  const markSingleAsRead = async (id) => {
    // const token = localStorage.getItem("token") || "";
    const token = useAuthStore.getState().token;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );
      fetchNotifications();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isHydrated) return null;

  const formattedTime = (dateString) => {
    if (!dateString) return "Baru saja";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-EN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-medium text-slate-800 flex flex-col">
      <MemberHeader />

      <main className="grow pt-24 md:pt-28 lg:pt-32 pb:16 md:pb-20">
        <div className="mx-auto w-full max-w-[1250px] px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10 border-slate-200 pb-2">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 text-slate-400 hover:text-[#A4CF4A] hover:bg-[#F4F9EB] rounded-full transition-all"
            >
              <ChevronLeft size={24} className="md:w-7 md:h-7" />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-medium text-slate-600 tracking-tight flex items-center gap-2 md:gap-3">
              Back
            </h1>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A] mb-4" />
                <p className="text-slate-500 font-medium animate-pulse">
                  Memuat notifikasi...
                </p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-100 rounded-[20px] p-8 text-center">
                <p className="text-red-500 font-bold mb-4">{error}</p>
                <button
                  onClick={fetchNotifications}
                  className="px-6 py-2 bg-red-100 text-red-600 rounded-full text-sm font-bold hover:bg-red-200 transition"
                >
                  Coba Lagi
                </button>
              </div>
            ) : notifications.length === 0 ? (
              // notif kosong
              <div className="flex flex-col items-center justify-center py-16 md:py-20 text-center bg-white rounded-2xl md:rounded-[30px] border border-slate-100 shadow-sm">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <BellOff size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                  Belum ada notifikasi
                </h3>
                <p className="text-slate-500 max-w-[300px]">
                  Semua pembaruan terkait aktivitas dan tiket event Anda akan
                  muncul di sini.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {notifications.map((notif) => {
                  const isUnread = notif.read_at === null;

                  return (
                    <div
                      key={notif.id}
                      onClick={() => markSingleAsRead(notif.id)}
                      className={`relative rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border transition-all duration-300 hover:shadow-md overflow-hidden cursor-pointer ${
                        isUnread
                          ? "bg-white border-[#A4CF4A]/30"
                          : "bg-slate-50/50 border-slate-100"
                      }`}
                    >
                      {isUnread && (
                        <div className="absolute top-5 right-4 md:top-7 md:right-6 w-3 h-3 bg-[#A4CF4A] rounded-full shadow-[0_0_10px_rgba(164,207,74,0.5)]"></div>
                      )}

                      <h3
                        className={`text-sm sm:text-base md:text-lg font-extrabold mb-2 pr-6 ${isUnread ? "text-slate-900" : "text-slate-700"}`}
                      >
                        {notif.data.title}
                      </h3>

                      <p
                        className={`text-sm md:text-[15px] leading-relaxed mb-4 tracking-wide font-medium ${isUnread ? "text-slate-700" : "text-slate-500"}`}
                      >
                        {notif.data.message}
                      </p>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] md:text-xs font-extrabold uppercase tracking-widest text-[#56B6E4]">
                          {formattedTime(notif.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
