"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import axios from "axios";
import { ChevronLeft, Upload, Loader2, Check } from "lucide-react";

import MemberHeader from "../../components/SiteHeaderMember";
import SiteFooter from "../../components/SiteFooter";

const MapPicker = dynamic(
  () => import("../../components/MapComponentRestoration"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] md:h-[400px] rounded-xl border border-[#A4CF4A] bg-slate-50 flex items-center justify-center text-[#A4CF4A] font-bold animate-pulse">
        Memuat Peta...
      </div>
    ),
  },
);

export default function MangroveRestorationPage() {
  const router = useRouter();

  // State Form
  const [position, setPosition] = useState({ lat: -6.2, lng: 106.816666 });
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const labelStyle =
    "block text-[#A4CF4A] text-[10px] md:text-xs font-bold mb-1.5";
  const readOnlyStyle =
    "w-full border border-[#A4CF4A] rounded-xl px-4 py-3 outline-none text-slate-500 font-medium bg-white cursor-not-allowed text-sm";
  const inputStyle =
    "w-full border border-[#A4CF4A] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 bg-white transition-all text-slate-700 font-medium text-sm";

  const SectionTitle = ({ title }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1.5 h-6 md:h-8 bg-[#A4CF4A]"></div>
      <h2 className="text-[#A4CF4A] text-xl md:text-2xl font-extrabold">
        {title}
      </h2>
    </div>
  );

  const handleSubmit = async () => {
    if (!description.trim()) {
      return alert("Write description here");
    }
    if (!file) {
      return alert("Input the documentation");
    }
    if (!position) {
      return alert("Decide the location");
    }

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("description", description);
      formData.append("latitude", position.lat);
      formData.append("longitude", position.lng);
      formData.append("picture", file);

      // const token = localStorage.getItem("token");
      const token = useAuthStore.getState().token;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/restoration-reports`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        },
      );

      if (response.data.success) {
        setIsSuccessModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting report:", error);

      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        let errorMessage = "Validasi Gagal (422):\n";

        for (const field in validationErrors) {
          errorMessage += `- ${field}: ${validationErrors[field][0]}\n`;
        }

        alert(errorMessage);
      } else {
        alert(
          error.response?.data?.message ||
            "Terjadi kesalahan saat mengirim laporan. Coba lagi nanti.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: "#F4F9DF" }}
    >
      <MemberHeader />

      <main className="grow pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-20 relative z-10">
        <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-400 hover:text-[#A4CF4A] transition mb-6 font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/* BANNER */}
          <div className="w-full rounded-2xl md:rounded-[30px] overflow-hidden relative h-44 sm:h-48 md:h-64 flex flex-col items-center justify-center text-white shadow-sm mb-8 bg-linear-to-r from-[#de6853] to-[#b33a3a]">
            <Image
              src="/images/header mangrest.png"
              alt="Community Background"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="relative z-10 text-center px-4">
              <p className="text-[10px] md:text-xs tracking-widest uppercase mb-1 md:mb-2 font-bold opacity-90">
                Welcome To
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
                MangroveRestoration
              </h1>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest opacity-90">
                Report Any Mangrove Damage Here!
              </p>
            </div>
          </div>

          {/* EXAMPLE REPORT PHOTO */}
          <div className="bg-white rounded-[30px] p-6 md:p-10 shadow-sm border border-slate-100 mb-8">
            <SectionTitle title="Example Report Photo" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="relative h-40 sm:h-44 md:h-48 rounded-2xl md:rounded-[30px] overflow-hidden shadow-sm">
                <Image
                  src="/images/example 1.png"
                  alt="Example 1"
                  fill
                  className="object-cover bg-slate-200"
                />
              </div>
              <div className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/images/example 2.png"
                  alt="Example 2"
                  fill
                  className="object-cover bg-slate-200"
                />
              </div>
              <div className="relative h-40 md:h-48 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src="/images/example 3.png"
                  alt="Example 3"
                  fill
                  className="object-cover bg-slate-200"
                />
              </div>
            </div>
          </div>

          {/* RESTORATION FORM */}
          <div className="bg-white rounded-2xl md:rounded-[30px] p-6 md:p-10 shadow-sm border border-slate-100">
            <SectionTitle title="Restoration Form" />

            <div className="flex flex-col gap-5 mt-2">
              {/* Map Picker */}
              <div>
                <label className={labelStyle}>Pick Mangrove Location</label>
                <div className="rounded-xl overflow-hidden border border-[#A4CF4A] min-h-[280px] md:min-h-80 ">
                  <MapPicker position={position} setPosition={setPosition} />
                </div>
              </div>

              {/* Longitude (Read Only) */}
              <div>
                <label className={labelStyle}>Longitude</label>
                <input
                  type="text"
                  readOnly
                  value={position ? position.lng.toFixed(6) : ""}
                  className={readOnlyStyle}
                />
              </div>

              {/* Latitude (Read Only) */}
              <div>
                <label className={labelStyle}>Latitude</label>
                <input
                  type="text"
                  readOnly
                  value={position ? position.lat.toFixed(6) : ""}
                  className={readOnlyStyle}
                />
              </div>

              {/* Description */}
              <div>
                <label className={labelStyle}>Description</label>
                <textarea
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${inputStyle} resize-none min-h-[120px]`}
                  placeholder="Write your report description in here..."
                ></textarea>
              </div>

              {/* Upload File */}
              <div>
                <label className={labelStyle}>Upload File (.jpg)</label>
                <div className="relative w-full">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div
                    className="w-full flex items-center justify-center gap-2 text-white font-bold text-sm py-3.5 md:py-4 rounded-full shadow-md transition-all uppercase tracking-widest relative z-0"
                    style={{ backgroundColor: "#56B6E4" }}
                  >
                    <Upload size={18} strokeWidth={2.5} />
                    {file ? file.name : "UPLOAD HERE"}
                  </div>
                </div>
              </div>

              {/* Report Button */}
              <div className="mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full text-white font-bold text-sm py-3.5 md:py-4 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest"
                  style={{ backgroundColor: "#A4CF4A" }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={20} />
                      SENDING REPORT...
                    </div>
                  ) : (
                    "REPORT"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter accent={"#A4CF4A"} soft={"#F4F9DF"} />

      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => {
              setIsSuccessModalOpen(false);
              router.push("/LandingPageMember");
            }}
          ></div>

          <div
            className="rounded-[30px] p-6 sm:p-8 md:p-10 w-full max-w-[420px] md:max-w-[450px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center"
            style={{ backgroundColor: "#F4F9DF" }}
          >
            <div className="relative w-20 h-20 md:w-24 md:h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 rounded-full scale-125"></div>
              <div className="absolute inset-2 bg-white/70 rounded-full scale-110"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <Check size={36} strokeWidth={4} className="text-[#A4CF4A]" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-black mb-2 tracking-tight">
              Report have been sent!
            </h2>
            <p className="text-[13px] md:text-sm text-slate-700 mb-6 px-4">
              Thank you for your contribution, we will processing your report :)
            </p>

            <div className="flex flex-col items-center mb-8">
              <div className="w-0.5 h-10 bg-[#A4CF4A]"></div>
              <div className="w-2.5 h-2.5 bg-[#A4CF4A] rounded-full -mt-0.5"></div>
            </div>

            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                router.push("/LandingPageMember");
              }}
              className="w-full py-3.5 md:py-4 rounded-full text-white text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest"
              style={{ backgroundColor: "#A4CF4A" }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
