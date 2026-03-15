"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Filter, CalendarDays, ChevronDown, Check } from "lucide-react";

import MemberHeader from "../../components/SiteHeaderMember";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import Loading from "@/app/loading";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";

export default function EventsPage() {
  const ACCENT = "#A4CF4A";
  const SOFT = "#EEF7BE";

  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    events,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchEvents,
    setPage,
    activeFilter,
    setFilter,
    getFilteredEvents,
  } = useEventStore();

  useEffect(() => {
    setIsHydrated(true);
    fetchEvents(1);
  }, [fetchEvents]);

  const getImageUrl = (path) => {
    if (!path) return "/event_img/AAJI Peduli Bumi 3.jpeg";

    if (path.startsWith("http")) return path;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.startsWith("/storage")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return { day: "-", month: "-", time: "-", full: "-" };
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return { day: "-", month: "-", time: "-", full: "Date TBD" };
    }

    return {
      day: date.getDate(),
      month: date.toLocaleDateString("id-ID", { month: "short" }).toUpperCase(),
      full: date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const displayEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 flex flex-col font-sans">
      {/* NAVBAR */}
      {isHydrated && isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-36 pb-20">
        <div className="mx-auto w-full max-w-[90%] lg:max-w-[1250px]">
          <div className="mb-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
                Our<span style={{ color: ACCENT }}>Events!</span>
              </h1>
            </div>

            {/*  FILTER DROPDOWN  */}
            <div className="flex justify-end mt-6 md:mt-8 pb-4 relative group z-30">
              <button className="flex items-center gap-2 font-bold text-lg text-slate-800 hover:text-[#A4CF4A] transition-colors outline-none py-2">
                <Filter className="w-5 h-5" />
                <span className="uppercase text-sm">
                  Filter: {activeFilter}
                </span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Menu Dropdown */}
              <div className="absolute top-full right-0 pt-1 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform origin-top-right">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-48 flex flex-col">
                  {["all", "available", "closed"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-4 py-3 text-xs font-bold uppercase text-left transition-colors flex justify-between items-center
                        ${
                          activeFilter === type
                            ? "bg-[#F7FDE8] text-[#A4CF4A]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#A4CF4A]"
                        }`}
                    >
                      {type}
                      {activeFilter === type && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loading />
            </div>
          )}

          {!isLoading && error && (
            <div className="text-center py-20 text-red-500 bg-red-50 rounded-xl border border-red-100">
              <p className="font-bold">Terjadi Kesalahan</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-xs font-bold transition"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !error && displayEvents.length === 0 && (
            <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="font-medium">
                {events.length === 0
                  ? "There are no events available at this time."
                  : `There are no events with the status: "${activeFilter}".`}
              </p>
            </div>
          )}

          {/* EVENTS GRID */}
          {!isLoading && !error && displayEvents.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayEvents.map((item) => {
                const dateInfo = formatDate(item.starts_at);

                const isAvailable =
                  item.status === "published" && !item.is_full;

                return (
                  <div
                    key={item.id}
                    className={`group flex flex-col bg-[#A4CF4A] rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 ${
                      isAvailable ? "bg-[#A4CF4A]" : "bg-[#B5B5B5]"
                    }`}
                  >
                    {/* Image */}
                    <div className="relative h-56 w-full bg-slate-200 rounded-b-[20px] overflow-hidden shadow-sm z-10">
                      <Image
                        src={getImageUrl(item.thumbnail || item.image)}
                        alt={item.title}
                        fill
                        className={`object-cover ${!isAvailable ? "grayscale opacity-80" : ""}`}
                      />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 flex flex-col items-center min-w-[55px] shadow-sm z-10">
                        <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                          {dateInfo.month}
                        </span>
                        <span
                          className="text-xl font-extrabold leading-none"
                          style={{ color: ACCENT }}
                        >
                          {dateInfo.day}
                        </span>
                      </div>

                      {/* View More Button */}
                      <div className="absolute bottom-4 right-4 z-10">
                        <Link href={`/EventPage/DetailEvents?id=${item.id}`}>
                          <button
                            className="px-5 py-1.5 rounded-full text-[10px] font-extrabold text-white shadow-md tracking-wider uppercase hover:brightness-110 transition"
                            style={{ backgroundColor: "#95C23D" }}
                          >
                            View More
                          </button>
                        </Link>
                      </div>

                      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 px-4 pb-4 pt-2 flex flex-col">
                      <div className="bg-white rounded-[20px] p-5 w-full h-full flex flex-col justify-between shadow-sm">
                        {/* Title */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 mb-1 font-medium">
                            {dateInfo.full}
                          </p>
                        </div>

                        {/* Location Info Box */}
                        <div
                          className={`mt-auto bg-[#F6F8E8] rounded-2xl p-3 flex items-start gap-3 ${isAvailable ? "bg-[F6F8E8]" : "bg-slate-50"}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm mt-0.5 ${
                              isAvailable ? "bg-[#A4CF4A]" : "bg-slate-400"
                            }`}
                          >
                            <MapPin className="w-4 h-4 fill-current" />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">
                              {item.location || "Location TBD"}
                            </p>
                            <p className="text-[9px] text-slate-500 leading-tight mt-0.5 line-clamp-2">
                              {dateInfo.time} WIB / {dateInfo.full}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/*  PAGINATION  */}
          {!isLoading && !error && totalPages > 1 && activeFilter === "all" && (
            <div className="flex justify-start w-full">
              <div className="flex items-center gap-6 text-xl font-bold text-slate-300 select-none">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition"
                >
                  &lt; Prev
                </button>

                <div className="flex gap-4 text-lg">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    const isActive = currentPage === pageNum;

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`pb-1 transition-colors duration-200 ${
                          isActive
                            ? "text-slate-900 border-b-2 border-slate-900"
                            : "hover:text-slate-500 cursor-pointer"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300 transition"
                >
                  Next &gt;
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter accent={ACCENT} soft={SOFT} />
    </div>
  );
}
