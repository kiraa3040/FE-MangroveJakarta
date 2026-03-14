"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

function VerifyEmailContent() {
  const { id, hash } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!id || !hash) return;

    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    // verif be
    const verifyEmail = async () => {
      try {
        await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/email/verify/${id}/${hash}`,
          {
            params: { expires, signature },
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
            },
          },
        );

        setStatus("success");

        // Redirect ke halaman login
        setTimeout(() => {
          router.push("/SignIn");
        }, 3000);
      } catch (error) {
        console.error("Verifikasi Gagal:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [id, hash, searchParams, router]);

  //  UI 
  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-md w-full text-center flex flex-col items-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 text-[#A4CF4A] animate-spin mb-4" />
          <h2 className="text-xl font-bold text-slate-800">
            Verifying Email...
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Mohon tunggu sebentar, kami sedang memvalidasi tautan Anda.
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-16 h-16 text-[#A4CF4A] mb-4" />
          <h2 className="text-xl font-bold text-slate-800">Email Verified!</h2>
          <p className="text-slate-500 text-sm mt-2">
            Akun Anda berhasil diverifikasi. Anda akan diarahkan ke halaman
            Login dalam beberapa detik...
          </p>
          <button
            onClick={() => router.push("/SignIn")}
            className="mt-6 px-6 py-2 bg-[#A4CF4A] hover:bg-[#8eb63d] text-white font-bold rounded-full transition-colors text-sm"
          >
            Login Sekarang
          </button>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-slate-800">
            Verification Failed
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Tautan tidak valid atau telah kedaluwarsa. Silakan lakukan
            pendaftaran ulang atau kirim ulang tautan verifikasi.
          </p>
          <button
            onClick={() => router.push("/SignUp")}
            className="mt-6 px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full transition-colors text-sm"
          >
            Kembali
          </button>
        </>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-[#F4F9DF] flex items-center justify-center font-sans p-4">
      <Suspense
        fallback={
          <div className="text-[#A4CF4A] font-bold text-lg flex items-center gap-2">
            <Loader2 className="animate-spin w-6 h-6" /> Menyiapkan
            Verifikasi...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
