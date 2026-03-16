"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
import Link from "next/link";
import { Calendar, ChevronLeft, Eye, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import MemberHeader from "../../../components/SiteHeaderMember";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";

import { useBlogsStore } from "@/store/useBlogsStore";
import { useAuthStore } from "@/store/useAuthStore";

import Loading from "@/app/loading";

export default function NewsDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const {
    activeBlog,
    fetchBlogDetail,
    isLoadingDetail,
    resetActiveBlog,
    error,
  } = useBlogsStore();

  useEffect(() => {
    if (id) {
      fetchBlogDetail(id);
    }

    return () => {
      resetActiveBlog();
    };
  }, [id, fetchBlogDetail, resetActiveBlog]);

  // TANGGAL
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // IMG
  const getImageUrl = (path) => {
    if (!path) return "/event_img/Agrowisata Pulau Tidung Kecil.jpg";
    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.startsWith("/storage")) {
      cleanPath = `/storage${cleanPath}`;
    };

    return `${baseUrl}${cleanPath}`;
  };

  //
  if (isLoadingDetail || (id && !activeBlog && !error)) {
    return <Loading />;
  }

  if (error || !activeBlog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-slate-400 font-bold">Artikel tidak ditemukan.</p>
        <button
          onClick={() => router.back()}
          className="text-[#A4CF4A] hover:underline"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 flex flex-col">
      {isHydrated && isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-28 md:pt-32 lg:pt-36 pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Tombol Back */}
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-1 text-slate-400 hover:text-[#A4CF4A] transition mb-6 md:mb-8 text-lg font-medium italic"
          >
            <ChevronLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>

          {/* Judul */}
          <h1 className="text-3xl md:text-4xl lg:text-4xl wrap-break-word font-bold text-slate-900 leading-tight text-center mb-6">
            {activeBlog?.title}
          </h1>

          {/* Data dibawah judul */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-xs md:text-sm font-medium text-slate-500 uppercase tracking-widest mb-10">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>by {activeBlog?.author?.name || "Admin"} </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{formatDate(activeBlog?.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} />
              <span>{activeBlog?.view_count}</span>
            </div>
          </div>

          {/* Gambar */}
          <figure className="mb-10">
            <div className="relative w-full h-[220px] sm:h-80 md:h-[420px] lg:h-[500px] rounded-2xl overflow-hidden shadow-sm">
              <img
                src={getImageUrl(activeBlog?.image_path)}
                alt={activeBlog?.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* <figcaption className="text-center text-[10px] md:text-xs text-slate-400 italic mt-3">
              {/* {activeBlog.caption} */}
            {/* </figcaption> */} */
          </figure>

          <div className="prose prose-lg prose-slate max-w-3xl lg:max-w-4xl text-justify text-slate-700 leading-loose space-y-6">
            {/* <p>{activeBlog?.content}</p> */}

            <div
              dangerouslySetInnerHTML={{ __html: activeBlog?.content }}
            ></div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
