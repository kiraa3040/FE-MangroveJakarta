"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

import { useAuthStore } from "@/store/useAuthStore";

export default function SignInPage() {
  const ACCENT = "#A4CF4A";
  const router = useRouter();

  const { login, isLoading, error } = useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const result = await login(formData.email, formData.password);

    // if admin
    if (result.success) {
      if (result.role === "admin") {
        alert("Success..");
        const currentToken = localStorage.getItem("token");
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

        window.location.href = `${baseUrl}/admin/auth/session-login?token=${currentToken}`;
      } else {
        router.push("/LandingPageMember");
      }
    } else {
      setLocalError(
        result.message || "Login Failed, please check your email and password",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#EEF7BE] text-slate-900 flex flex-col font-sans">
      {/* NAVBAR */}
      <SiteHeader accent={ACCENT} />

      {/* MAIN CONTENT */}
      <main className="grow pt-30 pb-10 px-4 flex items-center justify-center">
        <div className="bg-white w-full max-w-[1100px] rounded-[50px] shadow-xl p-8 md:p-14 grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="flex flex-col gap-0">
            <div>
              <h1
                className="text-3xl md:text-5xl font-bold"
                style={{ color: ACCENT }}
              >
                Login
              </h1>
              <p
                className="text-base font-normal mt-2"
                style={{ color: ACCENT }}
              >
                With your valid email address.
              </p>
            </div>

            <form className="space-y-5 mt-6" onSubmit={handleSubmit}>
              {(localError || error) && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
                  {localError || error}
                </div>
              )}

              {/* Email Address */}
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
                  className="mt-4 w-full rounded-xl border border-[#A4CF4A] px-4 py-4 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm"
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
                    className="mt-4 w-full rounded-xl border border-[#A4CF4A] px-4 py-4 outline-none focus:ring-2 focus:ring-[#A4CF4A]/50 transition text-slate-700 text-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 mt-2 -translate-y-1/2 text-[#A4CF4A] hover:text-[#8cb33e]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <p
                className="text-xs font-semibold text-left mt-2"
                style={{ color: ACCENT }}
              >
                <a
                  href="/ForgotPassword"
                  className="underline hover:text-emerald-600"
                >
                  Forgot your password?
                </a>
              </p>

              <p
                className="text-xs font-semibold text-left mt-2"
                style={{ color: ACCENT }}
              >
                Didn't have an account?{" "}
                <span>
                  <a
                    href="/SignUp"
                    className="underline hover:text-emerald-600"
                  >
                    Register here.
                  </a>
                </span>
              </p>

              {/* Button LOGIN */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-full py-4 text-xs md:text-lg font-extrabold text-white shadow-md hover:brightness-105 transition tracking-[0.15em] mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ backgroundColor: ACCENT }}
              >
                {isLoading ? "LOGGING IN..." : "LOGIN"}
              </button>
            </form>
          </div>

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

      {/* FOOTER */}
      <SiteFooter accent={ACCENT} />
    </div>
  );
}
