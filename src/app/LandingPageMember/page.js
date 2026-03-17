"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  MessageSquareText,
  MapPinIcon,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import axios from "axios";

import MemberHeader from "../../components/SiteHeaderMember";
import SiteFooter from "../../components/SiteFooter";

import { useAuthStore } from "@/store/useAuthStore";

export default function MemberPage() {
  const ACCENT = "#A4CF4A";
  const SOFT = "#EEF7BE";
  const router = useRouter();

  const { isAuthenticated, user, logout } = useAuthStore();

  // state blog
  const [isHydrated, setIsHydrated] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);

  // state event impacts
  const [impactStats, setImpactStats] = useState({
    totalPlants: 0,
    totalCo2Absorbed: 0,
  });

  const getImageUrl = (path) => {
    if (!path) return "/event_img/AAJI Peduli Bumi 3.jpeg";
    if (path.startsWith("http")) return path;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.startsWith("/storage/")) {
      cleanPath = `/storage${cleanPath}`;
    }
    return `${baseUrl}${cleanPath}`;
  };

  const formatNewsDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push("/SignIn");
    }
  }, [isAuthenticated, router, isHydrated]);

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        setIsLoadingNews(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/blogs`,
        );

        if (!response.ok) throw new Error("Gagal mengambil data berita");

        const result = await response.json();
        const data = result.data || result || [];

        const sortedData = data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
        const top3News = sortedData.slice(0, 3);

        setNewsData(top3News);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setIsLoadingNews(false);
      }
    };

    if (isAuthenticated && isHydrated) {
      fetchLatestNews();
    }

    // impacts
    const fetchImpactData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event-impacts/aggregate`,
        );
        if (!response.ok) throw new Error("Failed fetch impact data");

        const result = await response.json();

        let totalPlants = 0;
        let totalCo2Absorbed = 0;

        if (result.plants_by_year && Array.isArray(result.plants_by_year)) {
          result.plants_by_year.forEach((item) => {
            totalPlants += Number(item.total_plants) || 0;
            totalCo2Absorbed += Number(item.co2_absorbed_kg) || 0;
          });
        }

        setImpactStats({
          totalPlants: totalPlants,
          totalCo2Absorbed: totalCo2Absorbed / 1000,
        });
      } catch (error) {
        console.error("Error fetching impact data:", error);
      }
    };

    if (isAuthenticated && isHydrated) {
      fetchImpactData();
    }
  }, [isAuthenticated, isHydrated]);

  // useEffect(() => {
  //   if (!isHydrated) return;

  //   if (!isAuthenticated) {
  //     router.push("/SignIn");
  //   }
  // }, [isAuthenticated, router, isHydrated]);

  // if (!isHydrated || !isAuthenticated) {
  //   return null;
  // }

  // mangrove map
  const MapComponent = dynamic(() => import("@/components/MapComponent"), {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-blue-50/50">
        <p className="text-[#A4CF4A] font-bold animate-pulse">Memuat Peta...</p>
      </div>
    ),
  });
  const [MangroveAreas, setMangroveAreas] = useState([]);

  useEffect(() => {
    const fetchMangroveAreas = async () => {
      try {
        const token = localStorage.getItem("token") || "";
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/mangrove-areas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          },
        );
        setMangroveAreas(response.data.data || []);
      } catch (error) {
        console.error("Gagal mengambil data mangrove areas:", error);
      }
    };

    fetchMangroveAreas();
  }, []);

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A] mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  // if (!isAuthenticated) {
  //   return null;
  // }

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-black flex flex-col font-sans">
      {/* NAVBAR MEMBER */}
      <MemberHeader />

      <main className="grow pt-28 md:pt-32 lg:pt-36 pb-0">
        <div className="mx-auto w-full max-w-[1350px] px-4 sm:px-6 lg:px-8">
          {/*  TITLE SECTION  */}
          <div className="text-center mb-12">
            <p className="text-[10px] md:text-sm font-semibold tracking-[0.2em] text-slate-400 mb-1">
              WELCOME TO
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-[56px] font-bold text-black">
              Mangrove<span style={{ color: ACCENT }}>Member</span>
            </h1>
          </div>

          {/*  MAIN BUTTONS SECTION  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 items-stretch">
            {/* OUR EVENT */}
            <Link href="/EventPage" className="w-full">
              <button
                className="w-full h-full group relative rounded-2xl px-6 py-6 md:px-8 md:py-8 flex items-center gap-5 text-left shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#99C543" }}
              >
                <div className="shrink-0 relative z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm">
                    <CalendarDays className="w-7 h-7 md:w-9 md:h-9 text-white" />
                  </div>
                </div>
                <div className="relative z-10 text-white flex-1">
                  <h3 className="text-base md:text-xl font-extrabold tracking-wide leading-tight mb-1">
                    OUR EVENT
                  </h3>
                  <p className="text-xs md:text-sm font-light text-justify opacity-90 leading-relaxed max-w-[260px] min-h-10">
                    Check our latest upcoming event here and join now!
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </button>
            </Link>

            {/* MANGROVE RESTORATION */}
            <Link href="/RestorationPage" className="w-full">
              <button
                className="w-full group relative rounded-[20px] px-6 py-6 md:px-8 md:py-8 flex items-center gap-5 text-left shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#99C543" }}
              >
                <div className="shrink-0 relative z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm">
                    <ClipboardList className="w-7 h-7 md:w-9 md:h-9 text-white" />
                  </div>
                </div>
                <div className="relative z-10 text-white flex-1">
                  <h3 className="text-base md:text-xl font-extrabold tracking-wide leading-tight mb-1">
                    MANGROVE RESTORATION
                  </h3>
                  <p className="text-xs md:text-sm font-light text-justify opacity-90 leading-relaxed max-w-[260px] min-h-10">
                    Check our latest upcoming event here and join now!
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </button>
            </Link>

            {/* MANGROVE COMMUNITY */}
            <Link href="/CommunityPage" className="w-full">
              <button
                className="w-full group relative rounded-[20px] px-6 py-6 md:px-8 md:py-8 flex items-center gap-5 text-left shadow-md hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 overflow-hidden"
                style={{ backgroundColor: "#99C543" }}
              >
                <div className="shrink-0 relative z-10">
                  <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-white/20 rounded-2xl flex items-center justify-center shadow-inner backdrop-blur-sm">
                    <MessageSquareText className="w-7 h-7 md:w-9 md:h-9 text-white" />
                  </div>
                </div>
                <div className="relative z-10 text-white flex-1">
                  <h3 className="text-base md:text-xl font-extrabold tracking-wide leading-tight mb-1">
                    MANGROVE COMMUNITY
                  </h3>
                  <p className="text-xs md:text-sm font-light text-justify opacity-90 leading-relaxed max-w-[260px] min-h-10">
                    Check our latest upcoming event here and join now!
                  </p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              </button>
            </Link>
          </div>

          <section className="py-12 xl:py-16 bg-white">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              {" "}
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                <div className="flex flex-col sm:flex-row gap-5 xl:gap-6 order-2 xl:order-1">
                  {/* DONATION */}
                  <Link
                    href="https://kitabisa.com/campaign/mangrovejakartauntukmuaragembong?utm_source=socialsharing_campaigner_ios_e57faa1b220f47ca8e84fa3aeb3fdfe8%26utm_medium=CampaignPage_nativeshare%26utm_campaign=Campaign"
                    className="flex-1 bg-white rounded-2xl md:rounded-[28px] p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 transition-transform duration-300 hover:-translate-y-2 cursor-pointer group"
                  >
                    <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="#A4CF4A"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C9 2 8 4 8 4L7 8H17L16 4C16 4 15 2 12 2ZM6 10C5.44772 10 5 10.4477 5 11V16C5 19.3137 7.68629 22 11 22H13C16.3137 22 19 19.3137 19 16V11C19 10.4477 18.5523 10 18 10H6ZM12 12C13.6569 12 15 13.3431 15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12ZM12 13.5C11.1716 13.5 10.5 14.1716 10.5 15C10.5 15.8284 11.1716 16.5 12 16.5C12.8284 16.5 13.5 15.8284 13.5 15C13.5 14.1716 12.8284 13.5 12 13.5Z" />
                      </svg>
                    </div>
                    <h3
                      className="text-xl lg:text-2xl font-extrabold mb-1.5"
                      style={{ color: ACCENT }}
                    >
                      Donation
                    </h3>
                    <p className="text-[11px] font-bold text-[#A4CF4A] tracking-wide leading-snug px-2">
                      Your Contribution Helps Replant Mangroves
                    </p>
                  </Link>

                  {/* PRODUCT */}
                  <Link
                    href="/"
                    className="flex-1 bg-white rounded-[28px] p-6 lg:p-8 flex flex-col items-center justify-center text-center shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-slate-100 transition-transform duration-300 hover:-translate-y-2 cursor-pointer group"
                  >
                    <div className="mb-3 transform transition-transform duration-300 group-hover:scale-110">
                      <svg
                        width="56"
                        height="56"
                        viewBox="0 0 24 24"
                        fill="#A4CF4A"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M16 6V5C16 2.79086 14.2091 1 12 1C9.79086 1 8 2.79086 8 5V6H4C3.44772 6 3 6.44772 3 7V20C3 21.6569 4.34315 23 6 23H18C19.6569 23 21 21.6569 21 20V7C21 6.44772 20.5523 6 20 6H16ZM10 5C10 3.89543 10.8954 3 12 3C13.1046 3 14 3.89543 14 5V6H10V5ZM19 8V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V8H19Z" />
                      </svg>
                    </div>
                    <h3
                      className="text-xl lg:text-2xl font-bold mb-1.5 tracking-widest"
                      style={{ color: ACCENT }}
                    >
                      Our Product
                    </h3>
                    <p className="text-[10px] font-medium text-[#A4CF4A] tracking-wide leading-snug px-2">
                      Every Purchase Supports Conservation
                    </p>
                  </Link>
                </div>

                <div className="flex flex-col items-center xl:items-end text-center xl:text-right order-1 xl:order-2">
                  <h2 className="text-4xl lg:text-5xl xl:text-[56px] font-bold leading-[1.05] text-black text-center xl:text-right mb-5 tracking-tight">
                    Take Action for <br />
                    <span style={{ color: ACCENT }}>Our Mangroves</span>
                  </h2>
                  <p className="text-slate-800 text-sm lg:text-[16px] text-center xl:text-right font-medium leading-relaxed max-w-md xl:max-w-fit">
                    There are many ways to support mangrove restoration.
                    Contribute through donations or support our mission by
                    purchasing eco-friendly products.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/*  MANGROVE PROGRESS  */}
          <section className="py-6 mb-12">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-slate-400 mb-1">
                PLANTING
              </p>
              <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Mangrove<span style={{ color: ACCENT }}>Progress</span>
              </h2>
              <p className="mt-6 text-sm md:text-base text-slate-500 font-medium">
                Visualize the impact of every action taken.
              </p>
            </div>

            <div className="flex flex-col gap-6 md:gap-11">
              {/* MAP */}
              <div className="relative w-full aspect-4/3 sm:aspect-video md:aspect-16/7 min-h-[250px] md:min-h-0 rounded-3xl md:rounded-[30px] overflow-hidden shadow-lg mb-6 md:mb-8 bg-blue-50">
                <MapComponent locations={MangroveAreas} />
              </div>

              {/* STATS */}
              <div className="grid md:grid-cols-2 gap-5 md:gap-9">
                <div className="bg-white rounded-4xl md:rounded-[40px] p-6 md:p-8 lg:p-10 shadow-lg border border-slate-200 flex flex-col justify-center text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start md:items-center gap-3 md:gap-4 mb-2 md:mb-0">
                    <div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight text-shadow-lg">
                        Trees <br className="hidden sm:block" />{" "}
                        <span className="font-medium">Planted</span>
                      </h3>
                    </div>
                    <div>
                      <p className="text-4xl sm:text-5xl lg:text-6xl font-black text-black mt-1 sm:mt-3 tracking-tight text-shadow-lg">
                        {(impactStats.totalPlants || 0).toLocaleString("id-ID")}{" "}
                        <span className="font-bold text-lg sm:text-xl md:text-2xl lg:text-4xl text-[#A4CF4A]">
                          Trees
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-8 lg:p-10 shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
                  <div className="flex flex-col gap-2 md:gap-4 flex-1">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black leading-tight">
                      CO2 <br className="hidden sm:block" />
                      {""}
                      <span className="font-medium">Absorbed</span>
                    </h3>
                  </div>
                  <div className="text-left xl:text-right text-shadow-lg">
                    <p className="text-4xl md:text-5xl lg:text-6xl font-black text-black tracking-tight">
                      {(impactStats.totalCo2Absorbed || 0).toLocaleString(
                        "id-ID",
                        {
                          maximumFractionDigits: 1,
                        },
                      )}{" "}
                      <span className="text-xl md:text-2xl lg:text-4xl font-bold text-[#A4CF4A]">
                        Tons/year
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/*  MANGROVE BLOG  */}
          <section className="mb-20 md:mb-24 px-4 md:px-0">
            <div className="text-center mb-10">
              <p className="text-[10px] md:text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase mb-2">
                READ OUR
              </p>
              <h2 className="text-3xl md:text-6xl font-bold text-black">
                Mangrove<span style={{ color: ACCENT }}>News</span>
              </h2>
            </div>

            {isLoadingNews ? (
              <div className="flex justify-center items-center h-64 w-full">
                <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A]" />
              </div>
            ) : newsData.length === 0 ? (
              <div className="text-center text-slate-400 py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200 mb-10">
                There is no latest news at this time.
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 gap-10 md:gap-12 lg:gap-16 mb-10 mx-auto ${
                  newsData.length === 1
                    ? "max-w-[400px]"
                    : newsData.length === 2
                      ? "md:grid-cols-2 max-w-[850px]"
                      : "md:grid-cols-3 w-full"
                }`}
              >
                {" "}
                {newsData.map((item) => (
                  <Link
                    href={`/BlogPage/${item.slug}`}
                    key={item.id}
                  >
                    <div className="relative h-80 sm:h-[360px] md:h-[400px] rounded-[30px] overflow-hidden group shadow-md cursor-pointer">
                      <Image
                        src={getImageUrl(item.image_path)}
                        alt={item.title || "Mangrove Blog"}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 w-full p-6">
                        <span className="inline-block px-3 py-1 bg-[#A4CF4A] text-white text-[10px] font-bold rounded-full mb-3 shadow-sm">
                          LATEST NEWS
                        </span>
                        <h3 className="text-xl font-bold text-[#EEF7BE] leading-tight mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-white">
                          {formatNewsDate(item.created_at || item.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex justify-center px-4 md:px-0">
              <Link href="/BlogPage" className="w-full sm:w-auto">
                <button
                  className="w-full sm:w-auto px-8 md:px-24 lg:px-40 py-3.5 md:py-4 rounded-full text-white font-bold text-xs sm:text-sm shadow-lg hover:brightness-105 transition"
                  style={{ backgroundColor: ACCENT }}
                >
                  VIEW MORE
                </button>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter accent={ACCENT} soft={SOFT} />
    </div>
  );
}
