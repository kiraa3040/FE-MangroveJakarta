"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

import SiteHeaderMember from "../../components/SiteHeaderMember";
import SiteFooter from "../../components/SiteFooter";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token") || "";
  const emailURL = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const ACCENT_GREEN = "#A4CF4A";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      return setError("Password minimal 8 karakter.");
    }
    if (password !== passwordConfirmation) {
      return setError("Konfirmasi password tidak cocok.");
    }

    try {
      setIsLoading(true);
      // Endpoint standar Laravel untuk reset password
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
        {
          token: token,
          email: emailURL,
          password: password,
          password_confirmation: passwordConfirmation,
        },
      );

      alert("Password berhasil diubah! Silakan login dengan password baru.");
      router.push("/SignIn");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal mereset password. Token tidak valid atau kedaluwarsa.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[30px] p-8 md:p-12 shadow-sm border border-slate-100 max-w-3xl w-full">
      {/* Section Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div
            className="w-1.5 h-6 md:h-8"
            style={{ backgroundColor: ACCENT_GREEN }}
          ></div>
          <h2
            className="text-2xl md:text-3xl font-extrabold"
            style={{ color: ACCENT_GREEN }}
          >
            New Password
          </h2>
        </div>
        <p
          className="text-sm mt-1 ml-4 md:ml-5 font-medium opacity-80"
          style={{ color: ACCENT_GREEN }}
        >
          Fill with your new password
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="p-4 bg-red-50 text-red-500 rounded-xl text-sm font-medium border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label
            className="block text-xs font-bold mb-2"
            style={{ color: ACCENT_GREEN }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-xl px-4 py-3.5 outline-none focus:ring-2 bg-white transition-all text-slate-700 font-medium text-sm"
            style={{ borderColor: ACCENT_GREEN }}
          />
        </div>

        <div>
          <label
            className="block text-xs font-bold mb-2"
            style={{ color: ACCENT_GREEN }}
          >
            Confirmation Password
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full border rounded-xl px-4 py-3.5 outline-none focus:ring-2 bg-white transition-all text-slate-700 font-medium text-sm"
            style={{ borderColor: ACCENT_GREEN }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full text-white font-bold text-sm py-4 rounded-full shadow-md hover:shadow-lg transition-all uppercase tracking-widest disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 mt-6"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "CONFIRM"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  const ACCENT_GREEN = "#A4CF4A";
  const SOFT_BG = "#F4F9DF";

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: SOFT_BG }}
    >
      <SiteHeaderMember />

      <main className="grow flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
        <Suspense
          fallback={
            <div className="text-[#A4CF4A] font-bold">
              Memuat halaman form...
            </div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>

      <SiteFooter accent={ACCENT_GREEN} soft={SOFT_BG} />
    </div>
  );
}
