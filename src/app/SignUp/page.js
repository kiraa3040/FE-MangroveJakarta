"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Eye, EyeOff, Calendar, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import { useAuthStore } from "@/store/useAuthStore";

export default function SignUpPage() {
  const ACCENT = "#A4CF4A";
  const router = useRouter();
  const dateInputRef = useRef(null);

  const { register, isLoading, error } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    birth_date: "",
    city: "",
    province: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (formData.password !== formData.confirmPassword) {
      setLocalError("Password dan Confirm Password tidak sama.");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      phone: formData.whatsapp,
      birthdate: formData.birth_date,
      city: formData.city,
      province: formData.province,
    };

    // AUTH STORE
    const result = await register(payload);

    if (result.success) {
      setShowSuccessPopup(true);
      // router.push("/SignIn");
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF7BE] text-slate-900 flex flex-col font-sans">
      <SiteHeader accent={ACCENT} />

      <main className="grow pt-30 pb-10 px-4 flex items-center justify-center">
        <div className="bg-white w-full max-w-[1100px] rounded-[50px] shadow-xl p-8 md:p-14 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* --- LEFT SIDE: FORM --- */}
          <div className="flex flex-col gap-0">
            <div>
              <h1
                className="text-3xl md:text-5xl font-bold"
                style={{ color: ACCENT }}
              >
                Register
              </h1>
              <p
                className="text-base font-normal mt-1"
                style={{ color: ACCENT }}
              >
                With your valid email address.
              </p>
            </div>

            <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
              {/* Error Alert */}
              {(localError || error) && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                  {localError || error}
                </div>
              )}
              {/* Name */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Name
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  type="text"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  No. Whatsapp
                </label>
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  required
                  type="tel"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              {/* Birth Date  */}
              <div className="space-y-2 relative">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Birth Date
                </label>
                <div className="relative">
                  <input
                    ref={dateInputRef}
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    required
                    type="date"
                    className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-[#A4CF4A] text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => dateInputRef.current?.showPicker()}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4CF4A] hover:text-[#8cb33e]"
                  >
                    <Calendar size={18} />
                  </button>
                </div>
              </div>
              {/* City */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  type="text"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              {/* Province */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Province
                </label>
                <input
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  required
                  type="text"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              {/* Email */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Email Address
                </label>
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  type="email"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              {/* Password */}
              <div className="space-y-2 relative">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    type={showPassword ? "text" : "password"}
                    className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A4CF4A] hover:text-[#8cb33e]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {/* Confirm Password */}
              <div className="space-y-2">
                <label
                  className="text-xs font-bold tracking-wide"
                  style={{ color: ACCENT }}
                >
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  type="password"
                  className="w-full rounded-xl border border-[#A4CF4A] px-4 py-3 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
                />
              </div>
              {/* Button Sign Up */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-3xl py-4 text-sm font-bold text-white shadow-md hover:brightness-105 transition tracking-[0.15em] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: ACCENT }}
              >
                {isLoading ? "PROCESSING..." : "REGISTER"}
              </button>
              <p
                className="text-xs font-semibold text-left mt-2"
                style={{ color: ACCENT }}
              >
                Already have an account?{" "}
                <Link
                  href="/SignIn"
                  className="underline hover:text-emerald-700"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>

          {/* --- RIGHT SIDE--- */}
          <div
            className="hidden md:flex flex-col items-center justify-center text-center rounded-[30px] p-12 h-full min-h-[450px]"
            style={{ backgroundColor: "#A6CF4F" }}
          >
            <div className="relative w-32 h-32 md:w-80 md:h-80 mb-4">
              <Image
                src="/landing_page/logo2.png"
                alt="Logo Mangrove"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </main>

      <SiteFooter accent={ACCENT} />

      {/* popup */}
     {showSuccessPopup && (
        <div className="fixed inset-0 scale-z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          {/* Kotak Modal */}
          <div className="bg-[#EEF7C8] w-full max-w-lg rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
            
            {/* Ikon Checkmark */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_0_12px_rgba(255,255,255,0.4)] mb-8">
              <Check size={50} className="text-[#A4CF4A]" strokeWidth={4} />
            </div>

            {/* Teks */}
            <h2 className="text-[28px] font-extrabold text-slate-900 mb-2 leading-tight">
              Register Account Success!
            </h2>
            <p className="text-slate-700 text-sm md:text-base font-medium mb-6">
              Please login again with your registered account
            </p>

            {/* Garis Vertikal Hijau */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-0.5 h-10 bg-[#A4CF4A]"></div>
              <div className="w-3 h-3 bg-[#A4CF4A] rounded-full mt-0.5"></div>
            </div>

            {/* Tombol Login */}
            <button
              onClick={() => router.push("/SignIn")}
              className="w-full md:w-[90%] bg-[#A4CF4A] text-white text-sm font-bold tracking-widest uppercase rounded-full py-4 shadow-md hover:bg-[#8eb63d] transition-all hover:scale-[1.02]"
            >
              LOGIN
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}
