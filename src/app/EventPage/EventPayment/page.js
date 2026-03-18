"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

import SiteHeaderMember from "@/components/SiteHeaderMember";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

import { useEventStore } from "@/store/useEventStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function EventPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const encryptedId = searchParams.get("id");
  // const id = searchParams.get("id");

  const eventSlug = searchParams.get("event");

  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    activeEvent,
    fetchEventDetail,
    isLoadingDetail,
    tempRegData,
    clearTempRegData,
  } = useEventStore();

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (eventSlug) {
      fetchEventDetail(eventSlug);
    } else {
      router.push("/EventPage");
    }
  }, [eventSlug, fetchEventDetail, router]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getImageUrl = (path) => {
    if (!path) return "/event_img/AAJI Peduli Bumi 3.jpeg";
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    let cleanPath = path.startsWith("/") ? path : `/${path}`;
    if (!cleanPath.startsWith("/storage/")) cleanPath = `/storage${cleanPath}`;
    return `${baseUrl}${cleanPath}`;
  };

  const ticketFee = activeEvent?.price || 0;
  const serviceFee = 1000;
  const totalFee = ticketFee + serviceFee;

  const handleConfirmPayment = async () => {
    if (!tempRegData) {
      alert("Registration data not found. Please fill out the form again.");
      router.push(`/EventPage/EventRegister?event=${eventSlug}`);
      return;
    }

    if (!activeEvent?.id) {
      alert("Event details not loaded. Please try again.");
      return;
    }

    try {
      setIsProcessing(true);
      const token = useAuthStore.getState().token;

      if (!token) {
        alert("Session expired. Please login again.");
        router.push("/SignIn");
        return;
      }

      const payload = new FormData();
      payload.append("event_id", activeEvent?.id);
      payload.append("email", tempRegData.email);
      // payload.append("name", tempRegData.name);
      payload.append("participant_name", tempRegData.participant_name);
      payload.append("whatsapp_number", tempRegData.whatsapp);
      payload.append("city", tempRegData.city);
      payload.append("province", tempRegData.province);

      if (tempRegData.file) {
        payload.append("file", tempRegData.file);
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/payment-session`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        },
      );

      // console.log("Response dari Backend:", response.data);

      const paymentUrl =
        response.data.payment_link_url ||
        response.data.invoice_url ||
        response.data.checkout_url;

      if (paymentUrl) {
        clearTempRegData();
        window.location.href = paymentUrl;
      } else {
        alert(
          "Link pembayaran tidak ditemukan dari server. Cek console untuk detail.",
        );
      }
    } catch (error) {
      console.error("Payment Session Error:", error);

      if (error.response?.status === 401) {
        alert("Your session has ended. Please login again.");
        useAuthStore.getState().logout();
        router.push("/SignIn");
        return;
      }

      const serverMessage =
        error.response?.data?.message ||
        "Something went wrong while creating payment session.";
      alert(`Error: ${serverMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-slate-800 flex flex-col">
      {isAuthenticated ? <SiteHeaderMember /> : <SiteHeader />}

      <main className="grow pt-32 pb-20">
        <div className="mx-auto w-full max-w-[1000px] px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-400 hover:text-[#A4CF4A] transition mb-8 text-sm font-medium"
          >
            <ChevronLeft size={18} /> Back
          </button>

          <h1 className="text-4xl md:text-[42px] font-extrabold text-center mb-12 tracking-tight">
            <span className="text-slate-900">Order</span>{" "}
            <span style={{ color: "#A4CF4A" }}>Payment</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-8">
            <div className="relative w-full aspect-square rounded-[30px] overflow-hidden shadow-lg border border-slate-100 bg-slate-100">
              <Image
                src={getImageUrl(activeEvent?.image)}
                alt={activeEvent?.title || "Event Image"}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="bg-white rounded-[30px] p-8 md:p-10 shadow-lg border border-slate-100 flex flex-col h-full">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
                {activeEvent?.title || "Nama Event"}
              </h2>

              <div className="flex flex-col gap-3 mb-8">
                <div className="grid grid-cols-[70px_10px_1fr] text-[13px] md:text-sm">
                  <span className="font-extrabold text-slate-900">Lokasi</span>
                  <span>:</span>
                  <span className="text-slate-700 font-medium">
                    {activeEvent?.location || "-"}
                  </span>
                </div>
                <div className="grid grid-cols-[70px_10px_1fr] text-[13px] md:text-sm">
                  <span className="font-extrabold text-slate-900">Tanggal</span>
                  <span>:</span>
                  <span className="text-slate-700 font-medium">
                    {formatDate(activeEvent?.starts_at)}
                  </span>
                </div>
              </div>

              <div className="mt-auto border-t border-slate-200 pt-6">
                <div className="flex justify-between items-center text-sm font-medium text-slate-500 pb-4 border-b border-slate-200 border-dashed">
                  <span>Ticket Fee</span>
                  <span>{formatCurrency(ticketFee)}</span>
                </div>
                <div className="flex justify-between items-center text-base md:text-lg font-bold text-slate-900 pt-2">
                  <span>Total</span>
                  <span>{formatCurrency(totalFee)}</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={handleConfirmPayment}
                  disabled={isProcessing}
                  className="w-full flex justify-center items-center gap-2 py-4 rounded-full text-white text-sm font-extrabold uppercase tracking-[0.15em] shadow-lg hover:-translate-y-1 transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#A4CF4A" }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" /> CONNECTING
                      TO XENDIT...
                    </>
                  ) : (
                    "CONFIRM AND PAY"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
