"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

import MemberHeader from "../../../components/SiteHeaderMember";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

import { useEventStore } from "@/store/useEventStore";
import { useAuthStore } from "@/store/useAuthStore";
import Loading from "@/app/loading";

export default function EventDetail() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const handleToRegister = () => {
    if (!isAuthenticated) {
      alert("Please login first to take this action");
      router.push("/SignUp");
    } else {
      router.push(`/EventPage/EventRegister?id=${activeEvent.id}`);
    }
  };

  const { activeEvent, fetchEventDetail, isLoadingDetail, resetActiveEvent } =
    useEventStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  //  FETCH DATA
  useEffect(() => {
    if (id) {
      fetchEventDetail(id);
    }
    return () => resetActiveEvent();
  }, [id, fetchEventDetail, resetActiveEvent]);

  // HELPER FORMATTER
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "Free";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getImageUrl = (path) => {
    if (!path) return "/images/placeholder-event.jpg";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_BASE_URL}/${path}`;
  };

  if (isLoadingDetail) return <Loading />;

  if (!activeEvent && !isLoadingDetail) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-slate-400 font-bold">Event tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="text-[#A4CF4A] hover:underline font-bold"
        >
          Back
        </button>
      </div>
    );
  }

  // cek available
  const isAvailable = activeEvent?.status === "published" && !activeEvent?.is_full;

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      {isHydrated && isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-32 pb-20 w-full relative z-10">
        <div className="mx-auto w-full max-w-[1250px] px-6 md:px-0">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-500 hover:text-[#A4CF4A] transition mb-6 text-sm font-medium"
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <div className="text-center mb-8">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              EVENT
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Registration{" "}
              <span style={{ color: "#A4CF4A" }}>
                {isAvailable ? "Open!" : "Closed!"}
              </span>
            </h1>
          </div>

          {/*  BANNER EVENT  */}
          {/* BANNER EVENT  */}
          <div className="relative w-full h-48 md:h-64 rounded-[30px] overflow-hidden shadow-sm mb-6 flex flex-col items-center justify-center">
            {/* Latar Belakang (Gambar & Overlay) */}
            <div className="absolute inset-0 z-0 w-full h-full">
              {isAvailable ? (
                // BG HIJAU SAAT AVAILABLE
                <div className="absolute inset-0 bg-[#A4CF4A]">
                  <Image
                    src="/images/header event.png"
                    alt="Event Banner"
                    fill
                    priority
                    className="object-cover opacity-40 mix-blend-multiply"
                  />
                  <div className="absolute inset-0 bg-linear-to-r from-[#8CB83E] to-[#A4CF4A] opacity-10 mix-blend-overlay" />
                </div>
              ) : (
                // BG ABU-ABU SAAT UNAVAILABLE
                <div className="absolute inset-0 bg-[#D1D5DB]">
                  <Image
                    src="/images/header event.png"
                    alt="Event Banner"
                    fill
                    priority
                    className="object-cover grayscale opacity-40 mix-blend-multiply"
                  />
                  {/* Overlay putih tipis agar gambar abu-abunya terang seperti referensi */}
                  <div className="absolute inset-0 bg-white/30 backdrop-grayscale" />
                </div>
              )}
            </div>

            {/* Content Banner */}
            <div className="relative z-10 flex w-full px-6 items-center justify-center mt-4 md:mt-6">
              {isAvailable ? (
                //  LAYOUT AVAILABLE
                <div className="relative w-full max-w-[650px] border-[3px] border-white/90 rounded-2xl md:rounded-3xl px-6 py-8 md:py-10 flex justify-center items-center shadow-lg bg-white/10 backdrop-blur-[2px]">
                  <div className="absolute -top-4 md:-top-4.5 left-1/2 -translate-x-1/2 border-[3px] border-white text-white px-8 md:px-10 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest shadow-md whitespace-nowrap bg-[#56B6E4]">
                    AVAILABLE
                  </div>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white text-center drop-shadow-md">
                    {activeEvent?.title}
                  </h2>
                </div>
              ) : (
                //  LAYOUT UNAVAVAIL
                <div className="w-full max-w-[650px] flex flex-col items-center justify-center gap-1.5 md:gap-2">
                  <div className="w-full border-[3px] border-white rounded-full px-6 py-5 md:py-6 flex justify-center items-center shadow-md bg-[#A5A5A5]/80 backdrop-blur-[2px]">
                    <h2 className="text-2xl md:text-4xl font-extrabold text-white text-center drop-shadow-md px-4 truncate">
                      {activeEvent?.title}
                    </h2>
                  </div>
                  <div className="w-full border-[3px] border-white rounded-full px-6 py-2 md:py-2.5 flex justify-center items-center shadow-md bg-[#F44336]">
                    <span className="text-white text-[10px] md:text-xs font-bold uppercase tracking-widest drop-shadow-md">
                      UNAVAILABLE
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/*  CONTENT CARD  */}
          <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
            <div className="mb-10 space-y-6">
              {/* Detail Event Section */}
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Detail Event
                </h3>
                <p className="text-sm md:text-base text-slate-700 mb-1">
                  Register until{" "}
                  <span className="font-bold text-slate-900">
                    {formatDate(activeEvent?.ends_at || activeEvent?.date)}
                  </span>
                </p>
                <p className="text-sm md:text-base text-slate-700">
                  Registration Fee :{" "}
                  <span className="font-bold text-slate-900">
                    {formatCurrency(activeEvent?.price)}
                  </span>
                </p>
              </div>

              {/* Location Section */}
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                  Location
                </h3>
                <p className="text-sm md:text-base font-bold text-slate-900">
                  {activeEvent?.location || "Lokasi belum ditentukan"}
                </p>
                {activeEvent?.starts_at && (
                  <p className="text-sm md:text-base text-slate-700 mb-3">
                    {formatDate(activeEvent?.starts_at)} (
                    {formatTime(activeEvent?.starts_at)} WIB)
                  </p>
                )}

                {isAvailable && activeEvent?.map_link ? (
                  <a
                    href={activeEvent?.map_link}
                    target="blank"
                    rel="noopener noreferrer"
                    className="text-[#56B6E4] text-xs md:text-sm font-bold underline hover:opacity-80 transition"
                  >
                    View Location
                  </a>
                ) : (
                  <div className="inline-block bg-slate-300 text-white px-6 py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest cursor-not-allowed">
                    VIEW LOCATION
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 mb-12 text-sm md:text-base">
              {activeEvent?.description ? (
                <div
                  dangerouslySetInnerHTML={{ __html: activeEvent.description }}
                />
              ) : (
                <p className="text-slate-400 italic">
                  No detailed description.
                </p>
              )}
            </div>

            {/* BUTTON REGISTER */}
            <div className="mt-8">
              {isAvailable ? (
                <Link href={`/EventPage/EventRegister?id=${activeEvent?.id}`}>
                  <button
                    className="w-full text-white font-bold text-sm md:text-base py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest"
                    style={{ backgroundColor: "#A4CF4A" }}
                  >
                    REGISTER NOW!
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full bg-slate-300 text-white font-bold text-sm md:text-base py-4 rounded-full cursor-not-allowed uppercase tracking-widest shadow-inner"
                >
                  REGISTER NOW!
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
