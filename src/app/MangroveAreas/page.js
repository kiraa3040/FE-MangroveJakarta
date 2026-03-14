"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import useMangroveAreaStore from "@/store/useMangroveAreaStore";
import { X, MapPin, Calendar, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { useAuthStore } from "@/store/useAuthStore";

import MemberHeader from "../../components/SiteHeaderMember";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// Import Map secara Dynamic
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 font-bold">Memuat Peta...</span>
    </div>
  ),
});

export default function MangroveMapPage() {
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Ambil state dan fungsi dari Store
  const {
    activeAreaDetail,
    activeAreaEvents,
    closeDetail,
    isLoading,
    fetchAreas,
  } = useMangroveAreaStore();

  useEffect(() => {
    setIsHydrated(true);
    fetchAreas();
  }, [fetchAreas]);

  //  HELPER UNTUK GAMBAR EVENT 
  const getImageUrl = (path) => {
    if (!path) return "/landing_page/bg_hero.png";
    if (path.startsWith("http")) return path;
    return `https://api.satriodev.online${path}`;
  };

  //  HELPER FORMAT TANGGAL 
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (!isHydrated) return null;

  return (
    // 1. ROOT CONTAINER: Set background putih/terang agar tidak ada warna hitam nyasar
    <div className="w-full h-screen bg-[#FDFDFD] overflow-hidden relative font-sans">
      {/* 2. NAVBAR: Tetap di atas dengan z-index tertinggi */}
      <div className="relative z-50">
        {isAuthenticated ? <MemberHeader /> : <SiteHeader />}
      </div>

      {/* 3. CONTAINER PETA: Dibuat absolute, dimulai dari bawah navbar (top-80px/90px) sampai mentok bawah (bottom-0) */}
      <div className="absolute top-20 md:top-[90px] bottom-0 left-0 right-0 z-0">
        {/* Peta akan mengisi 100% dari container absolute ini */}
        <MapComponent />

        {/*  SIDEBAR DETAIL (Hanya Muncul jika activeAreaDetail ada isinya)  */}
        {activeAreaDetail && (
          <div className="absolute top-4 right-4 bottom-4 w-full md:w-[400px] bg-white shadow-2xl rounded-2xl z-1000 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300 border border-slate-200">
            {/* Header Sidebar */}
            <div className="p-5 border-b flex justify-between items-start bg-slate-50">
              <div className="pr-4">
                <h2 className="font-extrabold text-2xl text-slate-800 leading-tight">
                  {activeAreaDetail?.name || "Nama Lokasi Tidak Tersedia"}
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#A4CF4A]" />
                  {activeAreaDetail?.latitude}, {activeAreaDetail?.longitude}
                </p>
              </div>
              <button
                onClick={closeDetail}
                className="p-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-full transition-all shadow-sm shrink-0"
                title="Tutup Detail"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Sidebar (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-slate-50/50">
              {/* Deskripsi */}
              <div className="mb-8">
                <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-3">
                  Description
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed text-justify">
                  Kawasan konservasi {activeAreaDetail?.name || "ini"} adalah
                  area pelestarian alam yang penting untuk menahan abrasi dan
                  menyerap emisi karbon. Mari jaga kelestariannya bersama-sama.
                </p>
              </div>

              {/* List Events */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Upcoming Events
                  </h3>
                  <span className="bg-[#EEF7BE] text-[#A4CF4A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeAreaEvents.length}
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin text-[#A4CF4A] mb-2" />
                    <p className="text-xs font-medium">Memuat data event...</p>
                  </div>
                ) : activeAreaEvents.length === 0 ? (
                  <div className="text-center p-6 bg-white rounded-xl text-sm text-slate-500 border border-dashed border-slate-200 shadow-sm">
                    Belum ada event yang dijadwalkan di lokasi ini.
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {activeAreaEvents.map((event) => (
                      <div
                        key={event.id}
                        className="group bg-white border border-slate-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-[#A4CF4A]/30 transition-all"
                      >
                        {/* Gambar Event */}
                        <div className="h-32 bg-slate-100 rounded-xl mb-3 relative overflow-hidden">
                          <Image
                            src={getImageUrl(event.image_path || event.image)}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div
                            className={`absolute top-2 right-2 px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-wider shadow-sm
                            ${event.status === "published" ? "bg-[#A4CF4A]" : "bg-slate-400"}`}
                          >
                            {event.status || "Tersedia"}
                          </div>
                        </div>

                        {/* Info Event */}
                        <div className="px-1">
                          <h4 className="font-extrabold text-slate-800 text-sm mb-2 leading-tight line-clamp-2 group-hover:text-[#A4CF4A] transition-colors">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500 mb-4">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(event.starts_at || event.date)}
                          </div>

                          <Link href={`/EventPage/DetailEvents?id=${event.id}`}>
                            <button className="w-full py-2.5 bg-[#F6FBE6] text-[#8CB838] border border-[#E2F0B6] text-[11px] font-extrabold tracking-widest uppercase rounded-lg hover:bg-[#A4CF4A] hover:text-white hover:border-[#A4CF4A] transition-colors">
                              VIEW EVENT DETAILS
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
