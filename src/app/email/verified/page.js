"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Info } from "lucide-react";

function VerifiedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Menangkap parameter dari Laravel (biasanya ?already=1)
  const isAlreadyVerified = searchParams.get("already") === "1";

  return (
    <div className="bg-white p-8 md:p-12 rounded-[30px] shadow-sm border border-slate-100 max-w-md w-full text-center flex flex-col items-center z-10">
      {/* Icon menyesuaikan status */}
      {isAlreadyVerified ? (
        <Info className="w-20 h-20 text-[#56B6E4] mb-6" />
      ) : (
        <CheckCircle2 className="w-20 h-20 text-[#A4CF4A] mb-6" />
      )}

      <h2 className="text-2xl font-extrabold text-slate-800 mb-2">
        {isAlreadyVerified ? "Sudah Terverifikasi!" : "Verifikasi Berhasil!"}
      </h2>

      <p className="text-slate-500 text-sm mb-8">
        {isAlreadyVerified
          ? "Akun email Anda sudah pernah diverifikasi sebelumnya. Anda bisa langsung masuk ke dalam aplikasi."
          : "Selamat! Akun email Anda berhasil diverifikasi. Silakan masuk untuk memulai perjalanan Anda."}
      </p>

      <button
        onClick={() => router.push("/SignIn")}
        className="w-full py-4 bg-[#A4CF4A] hover:bg-[#8eb63d] text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 uppercase tracking-widest text-sm"
      >
        Lanjut ke Login
      </button>
    </div>
  );
}

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen bg-[#F4F9DF] flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#A4CF4A]/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#56B6E4]/20 rounded-full blur-3xl"></div>

      <Suspense
        fallback={
          <div className="text-[#A4CF4A] font-bold z-10">Memuat halaman...</div>
        }
      >
        <VerifiedContent />
      </Suspense>
    </div>
  );
}
