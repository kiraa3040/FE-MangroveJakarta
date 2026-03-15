"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  MapPinIcon,
  Loader2,
} from "lucide-react";
import dynamic from "next/dynamic";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-60 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="w-full max-w-md rounded-[26px] bg-white shadow-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-extrabold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
            aria-label="close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}

//  MAIN PAGE
export default function LandingPage() {
  const ACCENT = "#A4CF4A";
  const SOFT = "#EEF7BE";

  // DATA
  const hero = useMemo(
    () => ({
      photoSrc: "/frontend/public/images/PHOTO PAUNDRA HANUTAMA.jpeg",
      name: "Paundra Hanutama",
      role: "Bapak Mangrove Indonesia",
    }),
    [],
  );

  // stat
  const [impactStats, setImpactStats] = useState({
    totalPlants: 0,
    totalCo2Absorbed: 0,
  });

  // Import map component
  const MapComponent = dynamic(() => import("../../components/MapComponent"), {
    ssr: false,
  });

  const joinSlides = useMemo(
    () => [
      { id: 1, src: "/event_img/AAJI Peduli Bumi 3.jpeg", alt: "Join slide 1" },
      {
        id: 2,
        src: "/event_img/Agrowisata Pulau Tidung Kecil.jpg",
        alt: "Join slide 2",
      },
      {
        id: 3,
        src: "/event_img/Ekosistem Mangrove Angkekapuk 2.jpg",
        alt: "Join slide 3",
      },
    ],
    [],
  );

  // STATE UNTUK EVENT
  const [eventsData, setEventsData] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/event-impacts/aggregate`,
        );

        if (!response.ok) throw new Error("failed fetch impact data");

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

    fetchImpactData();
  }, []);

  // HELPER URL GAMBAR
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

  // HELPER FORMAT TANGGAL
  const formatDate = (dateString) => {
    if (!dateString) return { day: "-", month: "-", time: "-", full: "-" };
    const date = new Date(dateString);
    if (isNaN(date.getTime()))
      return { day: "-", month: "-", time: "-", full: "Date TBD" };

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

  // FETCH API EVENTS
  useEffect(() => {
    const fetchLatestEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/events`,
          { cache: "no-store" },
        );
        if (!response.ok) throw new Error("Gagal mengambil data event");

        const result = await response.json();
        const data = result.data || [];

        const top3Events = data.slice(0, 3);
        setEventsData(top3Events);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchLatestEvents();
  }, []);

  const [joinIndex, setJoinIndex] = useState(0);
  const [sponsorIndex, setSponsorIndex] = useState(0);
  const [showDiscordModal, setShowDiscordModal] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* NAVBAR */}
      <SiteHeader accent={ACCENT} />

      <main className="pt-24">
        {/* HERO SECTION */}
        <section className="md:py-6" id="about">
          <div className="mx-auto w-full max-w-[95%] sm:max-w-[90%] xl:max-w-[1350px]">
            <div
              className="rounded-4xl md:rounded-[48px] px-5 py-8 md:px-10 md:py-12 relative overflow-hidden"
              style={{ background: SOFT }}
            >
              <div className="pointer-events-none absolute -right-24 -bottom-24 w-[300px] md:w-[520px] h-[300px] md:h-[520px] rounded-full bg-emerald-900/10 blur-2xl z-0" />
              <div className="pointer-events-none absolute right-0 bottom-0 w-[300px] md:w-[520px] h-[150px] md:h-[260px] bg-linear-to-tr from-transparent via-emerald-900/10 to-transparent opacity-60 z-0" />
              <div className="absolute bottom-0 left-0 w-full h-[200px] md:h-[500px] pointer-events-none z-0">
                <Image
                  src="/landing_page/Pohon-2.png"
                  alt="Background Tree"
                  fill
                  className="object-contain object-bottom opacity-40"
                />
              </div>

              <div className="relative z-10 grid md:grid-cols-12 gap-8 md:gap-12 items-center md:px-6">
                <div className="md:col-span-4 flex justify-center w-full">
                  <div className="relative w-full max-w-[280px] sm:max-w-[320px] h-[380px] lg:max-w-[380px] aspect-3/4 sm:h-[450px] md:w-[380px] md:h-[500px] rounded-3xl md:rounded-[40px] overflow-hidden drop-shadow-xl shrink-0 mx-auto">
                    <Image
                      src="/images/PHOTO PAUNDRA HANUTAMA.jpeg"
                      alt="FOTO PAK PAUNDRA HANUTAMA"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-transparent z-10" />

                    <div className="absolute left-5 bottom-5 z-20">
                      <p className="text-[#EEF7BE] font-bold text-xl md:text-2xl drop-shadow-md">
                        Paundra Hanutama
                      </p>
                      <p className="text-white text-xs md:text-sm font-medium drop-shadow-md mt-0.5">
                        Bapak Mangrove Indonesia
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 flex flex-col justify-items-start mt-4 md:mt-0 md:pl-4 text-center md:text-left">
                  <div className=" md:text-right">
                    <h1 className="text-3xl sm:text-4xl md:text-6xl  text-black font-extrabold leading-tight uppercase">
                      Yayasan <span style={{ color: ACCENT }}>Mangrove</span>{" "}
                      Indonesia Lestari
                    </h1>
                    <p className="mt-2 md:mt-0.5 text-base sm:text-lg md:text-2xl font-medium text-black">
                      was born from a shared passion
                    </p>
                  </div>
                  <p className="font-normal mt-4 md:mt-6 text-base md:text-xl text-black md:leading-loose max-w-prose mx-auto md:mx-0 tracking-wide text-justify md:text-left">
                    Yayasan Mangrove Indonesia Lestari was created from a shared
                    commitment to safeguard Jakarta vulnerable coastal
                    ecosystem. As environmental challenges continue to worsen,
                    coastal abrasion, habitat loss, and rising carbon emissions,
                    our mission is to bring people together to take collective
                    action.
                  </p>
                  <div className="mt-8 w-full md:max-w-[800px] mx-auto md:ml-auto md:mr-0">
                    <Link href="/BlogPage" className="w-full">
                      <button
                        type="button"
                        className="w-full rounded-full bg-white border-3 border-[#A4CF4A] text-[#6AAE1F] px-4 md:px-6 py-3 text-xs md:text-[14px] font-bold tracking-wider md:tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition"
                      >
                        SAVE MANGROVE, SAVE THE WORLD!
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TAMBAHAN  */}
        <section className="py-12 xl:py-16 bg-white">
          <div className="mx-auto w-full max-w-[90%] xl:max-w-[1350px]">
            {/* FIX: Pakai xl: agar aman di laptop scaling 125% */}
            <div className="grid xl:grid-cols-2 gap-10 xl:gap-20 items-center">
              <div className="flex flex-col sm:flex-row gap-5 xl:gap-6 order-2 xl:order-1">
                {/* DONATION */}
                <Link
                  href="https://kitabisa.com/campaign/mangrovejakartauntukmuaragembong?utm_source=socialsharing_campaigner_ios_e57faa1b220f47ca8e84fa3aeb3fdfe8%26utm_medium=CampaignPage_nativeshare%26utm_campaign=Campaign"
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

        {/* JOIN US */}
        <section id="activity" className="w-full py-12">
          <div className="mx-auto w-full max-w-[92%] xl:max-w-[1350px]">
            {/* FIX: Pakai xl:grid-cols-12 */}
            <div className="grid xl:grid-cols-12 gap-8 xl:gap-16 items-center">
              {/* LEFT TEXT */}
              <div className="xl:col-span-5 flex flex-col gap-4 text-center xl:text-left">
                <div>
                  <p className="text-xs lg:text-sm font-medium tracking-widest text-[#9A9A9A] uppercase mb-2 xl:mb-3">
                    MANGROVE COMMUNITY
                  </p>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-medium leading-[1.1] md:leading-[1.05] text-slate-900">
                    Join Us to <br />
                    <span style={{ color: ACCENT }} className="font-bold">
                      Protecting
                    </span>
                    <br />
                    Our Mangrove
                  </h2>
                </div>
                <p className="text-sm text-black font-normal leading-relaxed">
                  Whether you want to participate in mangrove planting, track
                  restoration progress, or engage with others who share the same
                  passion, everything begins here.
                </p>
                <Link
                  href="/SignUp"
                  className="w-full rounded-full py-4 mt-2 text-xs lg:text-sm text-center font-extrabold text-white shadow-lg hover:brightness-95 transition tracking-[0.15em]"
                  style={{ backgroundColor: ACCENT }}
                >
                  REGISTER
                </Link>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 xl:mt-2">
                  <div
                    className="rounded-2xl p-5 text-left"
                    style={{ backgroundColor: "#EEF7BE" }}
                  >
                    <h4 className="font-semibold text-sm text-black mb-2">
                      Mangrove Restoration
                    </h4>
                    <p className="text-[13px] font-normal text-slate-600 leading-relaxed">
                      Join hands with volunteers and communities to rehabilitate
                      Jakarta's mangrove habitats.
                    </p>
                  </div>
                  <div
                    className="rounded-2xl p-5 text-left"
                    style={{ backgroundColor: "#EEF7BE" }}
                  >
                    <h4 className="font-semibold text-sm text-black mb-2">
                      Mangrove Progress
                    </h4>
                    <p className="text-[13px] font-normal text-slate-600 leading-relaxed">
                      Stay updated on every planting activity, complete with
                      real-time data and growth tracking.
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SLIDER */}
              <div className="xl:col-span-7 w-full h-full mt-8 xl:mt-0">
                <div className="relative w-full rounded-4xl lg:rounded-[40px] overflow-hidden shadow-xl aspect-square sm:aspect-video xl:aspect-auto xl:h-full min-h-[300px] sm:min-h-[400px] xl:min-h-[500px] group">
                  <Image
                    src={joinSlides[joinIndex].src}
                    alt={joinSlides[joinIndex].alt}
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                  />

                  {/* BUTTON KIRI */}
                  <button
                    type="button"
                    onClick={() =>
                      setJoinIndex(
                        (prev) =>
                          (prev - 1 + joinSlides.length) % joinSlides.length,
                      )
                    }
                    className="absolute left-3 lg:left-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
                  </button>

                  {/* BUTTON KANAN */}
                  <button
                    type="button"
                    onClick={() =>
                      setJoinIndex((prev) => (prev + 1) % joinSlides.length)
                    }
                    className="absolute right-3 lg:right-5 top-1/2 -translate-y-1/2 w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-20 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6 text-slate-700" />
                  </button>

                  {/* DOT */}
                  <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {joinSlides.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 lg:h-2.5 rounded-full transition-all duration-300 ${i === joinIndex ? "bg-white w-6 lg:w-8" : "bg-white/60 w-2 lg:w-2.5"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* EVENT */}
        <section className="pb-6 pt-6">
          <div className="mx-auto w-full max-w-[92%] lg:max-w-[1550px]">
            <div className="rounded-4xl md:rounded-[48px] px-4 py-10 md:px-10 md:py-16 bg-linear-to-b from-[#ffffff] to-[#E2F2B5]">
              <div className="text-center mb-8 md:mb-14">
                <p className="text-xs md:text-sm font-medium tracking-[0.2em] text-slate-400 uppercase mb-2 md:mb-3">
                  PROJECTS
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                  Upcoming <span style={{ color: ACCENT }}>Event!</span>
                </h2>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-500 font-medium">
                  Check for another our upcoming and past event.
                </p>
              </div>

              {isLoadingEvents ? (
                <div className="flex justify-center items-center h-64 w-full">
                  <Loader2 className="w-10 h-10 animate-spin text[#A4CF4A]" />
                </div>
              ) : eventsData.length === 0 ? (
                <div className="items-center text-center text-slate-400 py-10 bg-white/50 rounded-3xl border border-dashed border-slate-300 mb-10 mx-4">
                  There are no events currently available.{" "}
                </div>
              ) : (
                <div
                  className={`grid grid-cols-1 gap-10 md:gap-12 lg:gap-16 mb-10 mx-auto ${
                    eventsData.length === 1
                      ? "max-w-[400px]"
                      : eventsData.length === 2
                        ? "md:grid-cols-2 max-w-[850px]"
                        : "md:grid-cols-3 w-full"
                  }`}
                >
                  {eventsData.map((item) => {
                    const dateInfo = formatDate(item.starts_at);
                    const isAvailable =
                      item.status === "published" && !item.is_full;

                    // main tampilan
                    return (
                      <div
                        key={item.id}
                        className={`group relative flex flex-col rounded-3xl md:rounded-4xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                          isAvailable ? "bg-[#A4CF4A]" : "bg-[#B5B5B5]"
                        }`}
                      >
                        <div className="relative h-48 sm:h-52 md:h-60 w-full bg-slate-200 rounded-b-[20px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] z-10 overflow-hidden">
                          <Image
                            src={getImageUrl(
                              item.thumbnail || item.image || item.image_url,
                            )}
                            alt={item.title || "Event Image"}
                            fill
                            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                              !isAvailable ? "grayscale opacity-80" : ""
                            }`}
                          />

                          {/* badge */}
                          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-white rounded-2xl px-3 py-2 flex flex-col items-center min-w-[50px] md:min-w-[60px] shadow-sm z-10">
                            <span className="text-[10px] md:text-[12px] font-normal text-black pb-1 uppercase">
                              {dateInfo.month}
                            </span>
                            <span
                              className={`text-xl md:text-2xl font-bold leading-none mt-0.5 ${
                                isAvailable
                                  ? "text-[#A4CF4A]"
                                  : "text-slate-400"
                              }`}
                            >
                              {dateInfo.day}
                            </span>
                          </div>

                          <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 z-10">
                            <Link
                              href={`/EventPage/DetailEvents?id=${item.id}`}
                            >
                              <button
                                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-[10px] md:text-[11px] font-bold text-white shadow-sm tracking-wider uppercase transition ${
                                  isAvailable
                                    ? "bg-[#A4CF4A] hover:brightness-110"
                                    : "bg-white/40 backdrop-blur-sm hover:bg-white/50"
                                }`}
                              >
                                View More
                              </button>
                            </Link>
                          </div>
                        </div>

                        <div className="flex-1 px-3 pb-3 pt-4 md:px-4 md:pb-4 md:pt-5 flex flex-col">
                          <div className="bg-white rounded-[20px] md:rounded-3xl p-4 md:p-5 w-full h-full flex flex-col justify-between shadow-sm">
                            <div>
                              <h3 className="text-[15px] md:text-[17px] font-semibold text-black leading-tight mb-1 line-clamp-2">
                                {item.title}
                              </h3>
                              <p className="text-[11px] md:text-xs font-light text-slate-500 mb-4 md:mb-6">
                                {dateInfo.full}
                              </p>
                            </div>

                            {/* Location Box */}
                            <div
                              className={`rounded-xl md:rounded-2xl p-2.5 md:p-3 flex items-center gap-2 md:gap-3 ${
                                isAvailable ? "bg-[#F6FBDE]" : "bg-slate-50"
                              }`}
                            >
                              <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm ${
                                  isAvailable ? "bg-[#A5D046]" : "bg-slate-400"
                                }`}
                              >
                                <MapPinIcon className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-[12px] md:text-[14px] font-medium text-black leading-tight truncate">
                                  {item.location || "Location TBD"}
                                </p>
                                <p className="text-[10px] md:text-[12px] font-light text-slate-500 leading-tight mt-0.5 line-clamp-2">
                                  {item.location || "Alamat belum ditentukan"}
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
              <div className="mt-8 md:mt-10 flex justify-center">
                <Link href="/EventPage" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="rounded-full hover:brightness-105 hover:shadow-lg transition-all w-full sm:w-auto px-8 md:px-16 lg:px-24 py-3.5 md:py-4 text-[12px] md:text-[13px] font-extrabold text-white shadow-md tracking-[0.15em]"
                    style={{ backgroundColor: ACCENT }}
                  >
                    VIEW MORE
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MANGROVE PROGRESS */}
        <section className="py-10 md:py-12 mb-4">
          <div className="mx-auto w-full max-w-[92%] lg:max-w-[1350px]">
            <div className="text-center mb-8">
              <p className="text-xs md:text-sm font-semibold tracking-[0.2em] text-slate-400 mb-2 md:mb-3">
                PLANTING
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                Mangrove <span style={{ color: ACCENT }}>Progress</span>
              </h2>
              <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-500 font-medium">
                Visualize the impact of every action taken.
              </p>
            </div>
            <div className="flex flex-col gap-5 md:gap-9">
              <div className="bg-white rounded-4xl md:rounded-[40px] p-6 sm:p-8 md:p-12 shadow-lg border border-slate-100">
                <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-center">
                  <div className="md:col-span-4 flex flex-col gap-4 md:gap-5 md:pr-6 lg:pr-10 text-center md:text-left">
                    <h3 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                      Global <br className="hidden md:block" />{" "}
                      <span className="font-medium">Impact Map </span>
                    </h3>
                    <p className="text-[14px] md:text-[15px] font-sans md:text-justify text-slate-600 leading-relaxed">
                      Track where mangrove trees are planted, how they grow, and
                      the amount of carbon they help absorb. Transparency and
                      environmental accountability, right at your fingertips.
                    </p>
                  </div>

                  {/* PETA */}
                  <div className="md:col-span-8 relative w-full h-[200px] sm:h-[250px] md:h-[351px] rounded-3xl md:rounded-[30px] overflow-hidden group border border-slate-100 shadow-inner isolate mt-4 md:mt-0">
                    <img
                      src="/landing_page/peta2.png"
                      alt="Map Background"
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 bg-white "
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-[#A4CF4A]/80 md:from-[#A4CF4A] to-transparent pointer-events-none" />
                    <Link href="/SignUp">
                      <button
                        type="button"
                        className="absolute bottom-4 right-4 md:bottom-8 md:right-8 bg-white text-[#A4CF4A] px-4 md:px-6 py-2.5 md:py-3 rounded-full text-[10px] md:text-xs font-bold tracking-widest shadow-lg hover:scale-105 transition-transform"
                      >
                        READ DETAILS
                      </button>
                    </Link>
                  </div>
                </div>
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
                <div className="bg-white rounded-4xl md:rounded-[40px] p-6 md:p-8 lg:p-10 shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
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
          </div>
        </section>

        {/* COMMUNITY */}
        <section className="pb-8 pt-4">
          <div className="mx-auto max-w-[92%] lg:max-w-[1500px]">
            <div className="rounded-3x1 md:rounded-[28px] py-16 md:py-24 px-5 md:px-10 relative overflow-hidden">
              <Image
                src="/landing_page/Community.png"
                alt="Community Background"
                fill
                className="object-cover object-center"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-44 bg-linear-to-t from-emerald-700/15 to-transparent z-10" />
              <div className="relative z-20 text-center max-w-2xl mx-auto bg-white/40 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none backdrop-blur-sm md:backdrop-blur-none">
                <p className="text-xs md:text-sm font-medium tracking-widest text-slate-700 md:text-slate-500">
                  COMMUNITY
                </p>
                <h2 className="mt-2 md:mt-4 text-3xl sm:text-4xl md:text-[56px] font-medium leading-tight md:leading-normal">
                  Discuss with <br />{" "}
                  <span className="font-bold">
                    Mangrove<span style={{ color: ACCENT }}>Community</span>
                  </span>
                </h2>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-slate-800 md:text-slate-600 tracking-wider font-medium">
                  Connect, learn, and collaborate with environmental
                  enthusiasts.
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowDiscordModal(true)}
                    className="mt-6 md:mt-10 w-full max-w-xs md:max-w-4xl mx-auto rounded-full bg-white border-3 border-[#A4CF4A] py-3 md:py-7 shadow-sm hover:shadow-xl transition flex items-center justify-center gap-2"
                  >
                    <Users className="w-5 h-6 md:h-6 text-emerald-700" />
                    <span className="text-xs md:text-sm font-bold tracking-widest md:tracking-[0.18em] text-slate-600">
                      UNLOCK DISCUSSION
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SPONSORS */}
        <section className="px-4 py-8 md:py-12">
          <div className="mx-auto w-full max-w-[92%] lg:max-w-[1500px]">
            <div className="flex justify-center">
              <div
                className="rounded-full px-6 sm:px-10 md:px-16 py-2 md:py-3 text-xl sm:text-3xl md:text-5xl font-regular tracking-wide text-white shadow-sm text-center"
                style={{ backgroundColor: ACCENT }}
              >
                In <span className="font-bold">Collaboration</span> With
              </div>
            </div>

            <div className="relative flex flex-col items-center mt-4">
              <div className="relative w-full px-8 py-6 min-h-[200px] md:min-h-[500px] flex items-center justify-center">
                <div className="relative w-full h-[120px] sm:h-[150px] md:h-[400px] lg:h-[600px] transition-opacity duration-500">
                  <Image
                    src={`/sponsor/0${sponsorIndex + 1}.png`}
                    alt={`Sponsor Slide ${sponsorIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSponsorIndex((prev) => (prev - 1 + 4) % 4)}
                  className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:scale-110 transition-transform z-20"
                >
                  <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
                </button>
                <button
                  type="button"
                  onClick={() => setSponsorIndex((prev) => (prev + 1) % 4)}
                  className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-16 md:h-16 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:scale-110 transition-transform z-20"
                >
                  <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <SiteFooter accent={ACCENT} soft={SOFT} />
      </main>

      <Modal
        open={showDiscordModal}
        title="Join Our Community"
        onClose={() => setShowDiscordModal(false)}
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          Connect with fellow environmental enthusiasts, share ideas, and stay
          updated on upcoming events and initiatives.
        </p>
        <Link href="/SignIn">
          <button
            type="button"
            className="mt-5 w-full rounded-full hover:brightness-95 py-3 text-[11px] font-extrabold text-white shadow-sm"
            style={{ backgroundColor: ACCENT }}
          >
            Join
          </button>
        </Link>
      </Modal>
    </div>
  );
}
