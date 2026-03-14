"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function SiteFooter() {
  const ACCENT = "#A4CF4A";
  const BG_COLOR = "#F2F9D6";

  // email
  const emailTo = "najoanrizki5@gmail.com";
  const emailCC = "kuuhaku123425@gmail.com";
  const mailtoLink = `mailto:${emailTo}?cc=${emailCC}`;

  // wa
  const waNumber = "62895382155800";
  const waMessage = encodeURIComponent("");
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <footer className="w-full flex flex-col font-sans">
      <section
        className="w-full relative py-12 md:pt-20 md:pb-20 overflow-hidden"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div className="mx-auto w-full max-w-[92%] lg:max-w-[1350px] relative z-10 grid md:grid-cols-2 items-center text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4 md:mb-6">
              Get in Touch!
            </h2>
            <h3 className="text-xl sm:text-2xl font-medium text-slate-900 mb-2">
              The Kensington Office Tower
            </h3>
            <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 md:mb-8 max-w-md">
              Lt.2 Ruang 02, Jl. Boulevard Raya No.1, RT.4/RW.17 Kel. Kelapa
              Gading Timur, Kec. Kelapa Gading, Jakarta Utara, DKI Jakarta,
              14240
            </p>
            {/* BUTTONS CONTAINER */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
              {/* BUTTON: CONTACT US */}
              <Link
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 md:py-3 rounded-full text-white font-bold text-xs shadow-md hover:brightness-105 transition text-center"
                style={{ backgroundColor: ACCENT }}
              >
                CONTACT US
              </Link>
              {/* BUTTON: EMAIL NOW */}
              <a
                href={mailtoLink}
                className="w-full sm:w-auto px-8 py-3.5 md:py-3 rounded-full text-white font-bold text-xs shadow-md hover:brightness-105 transition text-center"
                style={{ backgroundColor: ACCENT }}
              >
                EMAIL NOW
              </a>
            </div>
          </div>
        </div>

        {/* Background Tree Image */}
        <div className="absolute bottom-0 right-0 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] pointer-events-none opacity-30 sm:opacity-60 md:opacity-100 z-0">
          <Image
            src="/landing_page/Pohon-2.png"
            alt="Footer Tree"
            fill
            className="object-contain object-bottom right-0"
          />
        </div>
      </section>

      {/* --- SECTION 2: COPYRIGHT BAR --- */}
      <div
        className="w-full border-t border-slate-300/50 py-6"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div className="mx-auto w-full max-w-[92%] lg:max-w-[1350px] flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4 text-center md:text-left">
          <p>
            &copy; 2025{" "}
            <span className="font-bold text-slate-700">Greensy</span>. All
            rights reserved.
          </p>

          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            {/* <Link href="#" className="hover:text-slate-800 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-slate-800 transition">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-slate-800 transition">
              Cookies Settings
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}