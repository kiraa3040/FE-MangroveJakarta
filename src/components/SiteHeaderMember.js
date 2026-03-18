"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Bell, User } from "lucide-react";
import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";

export default function MemberHeader() {
  const router = useRouter();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // const token = localStorage.getItem("token");
        const token = useAuthStore.getState().token;

        if (!token) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/notifications/unread-count`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );

        setUnreadCount(response.data.count || response.data.unread_count || 0);
      } catch (error) {
        console.error("Failed:", error);
      }
    };
    fetchUnreadCount();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 min-h-16 md:min-h-[72px] flex items-center ">
      <div className="mx-auto w-full max-w-[1350px] px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* LOGO KIRI */}
        <div className="flex items-center">
          <Link href="/LandingPageMember">
            <div className="relative w-28 h-8 sm:w-32 sm:h-9 md:w-40 md:h-11 shrink-0">
              <Image
                src="/landing_page/logo2.png"
                alt="Yayasan Mangrove"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>
        </div>

        {/* About Us + Icons */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          <Link href="/AboutUs">
            <span className="hidden sm:block text-xs font-semibold tracking-widest text-slate-600 hover:text-[#A4CF4A] transition-colors">
              ABOUT US
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            {/* User Icon */}
            <Link
              href="/MemberProfile"
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-[#A4CF4A] flex items-center justify-center hover:brightness-105 transition shadow-sm shrink-0"
            >
              <User className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-white fill-white" />
            </Link>

            {/* Notification Bell */}
            <Link
              href="/Notifications"
              className="relative p-1.5 md:p-2 text-slate-500 hover:text-[#A4CF4A] transition shrink-0"
            >
              <Bell className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" />

              {unreadCount > 0 && (
                /* Ukuran Badge mobile */
                <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 flex h-3.5 w-3.5 md:h-4 md:w-4 items-center justify-center rounded-full bg-red-500 text-[9px] md:text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
