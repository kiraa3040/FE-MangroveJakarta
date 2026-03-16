"use client";

import React, { useEffect, useState } from "react";
// import Image from "next/image";
import { Filter, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";

import SiteHeader from "../../components/SiteHeader";
import MemberHeader from "../../components/SiteHeaderMember";
import SiteFooter from "../../components/SiteFooter";

import { useBlogsStore } from "@/store/useBlogsStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function NewsPage() {
  const ACCENT = "#A4CF4A";
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    blogs,
    currentPage,
    totalPages,
    activeFilter,
    isLoading,
    fetchBlog,
    setPage,
    nextPage,
    setFilter,
  } = useBlogsStore();

  useEffect(() => {
    setIsHydrated(true);
    fetchBlog(1, "all");
  }, [fetchBlog]);

  // HANDLE
  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    nextPage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getImageUrl = (path) => {
    if (!path) return "/event_img/AAJI Peduli Bumi 3.jpeg";
    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let cleanPath = path.startsWith("/") ? path : `/${path}`

    if (!cleanPath.startsWith("/storage")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  const stripHtml = (htmlString) => {
    if (!htmlString) return "";

    return htmlString.replace(/<[^>]*>?/gm, " ").trim();
  }

  // filter
  const filteredBlogs =
    activeFilter === "all"
      ? blogs
      : blogs.filter((item) => item.type === activeFilter);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A] mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Memuat halaman...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-slate-800 flex flex-col">
      {isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-28 md:pt-32 lg:pt-36 pb-20">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          {/* TITLE & FILTER DROPDOWN */}
          <div className="flex flex-col md:flex-row items-center md:justify-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 text-center">
              {/* Judul sesuai Filter */}
              {activeFilter === "all" && (
                <>
                  Blog<span style={{ color: ACCENT }}>Update!</span>
                </>
              )}
              {activeFilter === "news" && (
                <>
                  Latest <span style={{ color: ACCENT }}>News</span>
                </>
              )}
              {activeFilter === "education" && (
                <>
                  Our <span style={{ color: ACCENT }}>Education</span>
                </>
              )}
            </h1>

            {/*  DROPDOWN FILTER START  */}
            <div className="mt-4 md:mt-0 md:absolute md:right-0 relative group z-30">
              {/* Trigger Button */}
              <button className="flex items-center gap-2 text-slate-700 hover:text-[#A4CF4A] transition py-2 outline-none">
                <Filter size={20} />
                <span className="text-sm font-medium uppercase">
                  Filter: {activeFilter}
                </span>
                <ChevronDown
                  size={14}
                  className="group-hover:rotate-180 transition-transform duration-300"
                />
              </button>

              {/* Dropdown Content */}
              <div className="absolute top-full right-0 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform origin-top-right">
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-40 flex flex-col">
                  {["all", "news", "education"].map((filterType) => (
                    <button
                      key={filterType}
                      onClick={() => setFilter(filterType)}
                      className={`px-4 py-3 text-xs font-bold uppercase text-left transition-colors
                        ${
                          activeFilter === filterType
                            ? "bg-[#F7FDE8] text-[#A4CF4A]"
                            : "text-slate-600 hover:bg-slate-50 hover:text-[#A4CF4A]"
                        }`}
                    >
                      {filterType}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/*  DROPDOWN FILTER END  */}
          </div>

          {/* NEWS LIST */}
          <div className="flex flex-col gap-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-20 w-full">
                <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A]" />
              </div>
            ) : filteredBlogs.length === 0 ? (
              // DATA KOSONG
              <div className="text-center py-20 text-slate-400">
                No articles found in this category.
              </div>
            ) : (
              filteredBlogs.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl md:rounded-[30px] p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col md:flex-row gap-6 items-center md:items-start border border-gray-100 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-5 right-5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                    ${item.type === "education" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}
                  >
                    {item.type || "General"}
                  </div>

                  <div className="relative w-full md:w-[42%] h-52 sm:h-56 md:h-64 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center h-full w-full py-2">
                    <h3 className="text-2xl md:text-3xl wrap-break-word font-bold text-slate-900 mb-4 leading-tight pr-12">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {stripHtml(item.content)}
                    </p>
                    <div>
                      <Link href={`/BlogPage/DetailBlogs?id=${item.id}`}>
                        <button className="px-6 py-2.5 rounded-full bg-[#A4CF4A] text-white text-xs md:text-sm font-bold tracking-widest hover:bg-[#8eb63d] transition shadow-sm">
                          VIEW MORE
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAGINATION CONTROLS */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center md:justify-start items-center gap-4 md:gap-6 mt-16 text-slate-400 font-medium select-none">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (number) => (
                  <span
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`cursor-pointer transition hover:text-slate-900 ${
                      currentPage === number
                        ? "text-slate-900 border-b-2 border-slate-900 pb-0.5 font-bold"
                        : ""
                    }`}
                  >
                    {number}
                  </span>
                ),
              )}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`transition text-lg ${
                  currentPage === totalPages
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:text-slate-900 cursor-pointer"
                }`}
              >
                {">"}
              </button>
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
