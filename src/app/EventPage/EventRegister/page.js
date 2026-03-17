"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Upload, Loader2 } from "lucide-react";
import axios from "axios";

import MemberHeader from "../../../components/SiteHeaderMember";
import SiteFooter from "../../../components/SiteFooter";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";

export default function RegisterEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { isAuthenticated, user } = useAuthStore();
  const { setTempRegData } = useEventStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const [eventId, setEventId] = useState(null);

  // State form
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    participant_name: "",
    whatsapp: "",
    city: "",
    province: "",
    file: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsHydrated(true);

    // const params = new URLSearchParams(window.location.search);
    const idFromUrl = searchParams.get("id");
    if (idFromUrl) {
      setEventId(idFromUrl);
    }

    // autofill
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || "",
        name: user.name || "",
      }));
    }
  }, [user, searchParams]);

  // Handler input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file: file }));
    }
  };

  // Handler Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      alert.error("Error: Event ID not found");
      return;
    }

    if (!formData.file) {
      alert.error("Please upload the document first");
      return;
    }

    setTempRegData(formData);
    router.push(`/EventPage/EventPayment?id=${eventId}`);

    // try {
    //   setIsSubmitting(true);
    //   const token = localStorage.getItem("token") || "";

    //   // FORM
    //   const payload = new FormData();
    //   payload.append("event_id", eventId);
    //   payload.append("email", formData.email);
    //   payload.append("account_name", formData.name);
    //   payload.append("participant_name", formData.certificate_name);
    //   payload.append("whatsapp_number", formData.whatsapp);
    //   payload.append("city", formData.city);
    //   payload.append("province", formData.province);
    //   payload.append("file", formData.file);

    //   const response = await axios.post(
    //     `${process.env.NEXT_PUBLIC_API_URL}/events/${eventId}/register`,
    //     payload,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //         "Content-Type": "multipart/form-data",
    //         Accept: "application/json",
    //       },
    //     },
    //   );
    //   setTempRegData(formData);
    //   console.log("Registration:", response.data);
    //   alert(
    //     "You've successfully registered for the event! Redirected to the payment page...",
    //   );

    //   router.push(`/EventPage/EventPayment?id=${eventId}`);
    // } catch (error) {
    //   console.error("Failed entry event:", error);
    //   const serverMessage = error.response?.data?.message || "Something Wrong";
    //   alert(`${serverMessage}`);
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push("/SignUp");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return null;
  }

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#A4CF4A] mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Loading...</p>
      </div>
    );
  }

  const labelStyle = "block text-[#A4CF4A] text-xs font-bold mb-1.5";
  const inputStyle =
    "w-full border border-[#A4CF4A] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 bg-white transition-all text-slate-700 font-medium";

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: "#EEF7BE" }}
    >
      {/* NAVBAR */}
      <MemberHeader />

      <main className="grow pt-32 pb-20 relative z-10">
        <div className="mx-auto w-full max-w-[1200px] px-6">
          {/* button back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-[#A4CF4A] opacity-70 hover:opacity-100 transition mb-6 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/* FORM */}
          <div className="bg-white rounded-[25px] p-8 md:p-10 shadow-sm border border-slate-100">
            <h1
              className="text-3xl font-extrabold mb-4"
              style={{ color: "#A4CF4A" }}
            >
              Registration Event
            </h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className={labelStyle}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              {/* NAMA DI SERTIF */}
              <div>
                <label className={labelStyle}>
                  Participant Name (Certificate)
                </label>
                <input
                  type="text"
                  name="certificate_name"
                  value={formData.participant_name}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>No. WhatsApp</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Province</label>
                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>Upload File (.pdf)</label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  <div
                    className="mt-2 w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-4 rounded-full shadow-md transition-all duration-300 uppercase tracking-widest relative z-0"
                    style={{
                      backgroundColor: formData.file ? "#A4CF4A" : "#56B6E4",
                    }}
                  >
                    <Upload size={18} strokeWidth={2.5} />
                    {formData.file ? formData.file.name : "UPLOAD HERE"}
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100">
                <button
                  type="submit"
                  // disabled={isSubmitting}
                  className="w-full text-white font-bold text-sm py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest"
                  style={{ backgroundColor: "#A4CF4A" }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2
                        size={20}
                        className="animate-spin items-center"
                      />
                      PROCESSING
                    </div>
                  ) : (
                    "PROCEES TO PAYMENT"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter style={{ backgroundColor: "#EEF7BE" }} />
    </div>
  );
}
