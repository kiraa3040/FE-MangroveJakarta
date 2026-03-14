"use client";

import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Menu, X } from "lucide-react";

export default function SiteHeader({ accent = "#A4CF4A" }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-100 shadow-sm">
      <div className="mx-auto px-4 py-4 flex items-center justify-between max-w-full lg:px-10">
        <div className="flex items-center gap-3">
          <div className="relative w-32 h-10 md:w-40 md:h-12">
            <Link href="/LandingPage">
              <Image
                src="/landing_page/logo2.png"
                alt="Yayasan Mangrove"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>
        </div>

        {/* button menu buat mobile */}
        <button
          type="button"
          className="md:hidden p-2 text-slate-600 hover:text-emerald-700 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center gap-10">
          <div className="relative group h-full flex items-center">
            <button className="flex items-center gap-1 text-[12px] font-semibold tracking-wider hover:text-emerald-700 transition-colors py-4 outline-none">
              OUR ACTIVITY
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300"
              />
            </button>

            {/* Dropdown */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 ease-in-out transform origin-top z-50">
              <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden w-48 p-2 flex flex-col gap-1">
                {/* Events */}
                <Link
                  href="/EventPage"
                  className="block px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700 rounded-lg transition-colors text-center"
                >
                  EVENTS
                </Link>

                {/* Blogs */}
                <Link
                  href="/BlogPage"
                  className="block px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-emerald-700 rounded-lg transition-colors text-center"
                >
                  BLOGS
                </Link>
              </div>
            </div>
          </div>
          {/* END DROPDOWN */}

          <Link
            href="/AboutUs"
            className="text-[12px] font-semibold tracking-wider hover:text-emerald-700 transition-colors"
          >
            ABOUT US
          </Link>

          <Link
            href="/SignUp"
            className="text-[12px] font-bold tracking-wider px-6 py-2 rounded-full drop-shadow-md text-white hover:brightness-110 transition-all inline-block"
            style={{ backgroundColor: accent }}
          >
            LOGIN/REGISTER
          </Link>
        </nav>
      </div>

    {/* menu mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg flex flex-col px-6 py-4 gap-4 z-40">
          <div className="flex flex-col border-b border-slate-100 pb-2">
            <button
              className="flex items-center justify-between text-[12px] font-semibold tracking-wider py-2 text-slate-800"
              onClick={() => setIsActivityOpen(!isActivityOpen)}
            >
              OUR ACTIVITY
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  isActivityOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`flex flex-col gap-2 overflow-hidden transition-all duration-300 ${
                isActivityOpen ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <Link
                href="/EventPage"
                className="pl-4 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                EVENTS
              </Link>
              <Link
                href="/BlogPage"
                className="pl-4 py-2 text-xs font-semibold text-slate-600 hover:text-emerald-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                BLOGS
              </Link>
            </div>
          </div>

          <Link
            href="/AboutUs"
            className="text-[12px] font-semibold tracking-wider py-2 text-slate-800 border-b border-slate-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            ABOUT US
          </Link>

          <Link
            href="/SignUp"
            className="mt-2 text-[12px] font-bold tracking-wider px-6 py-3 rounded-full drop-shadow-md text-white hover:brightness-110 transition-all text-center"
            style={{ backgroundColor: accent }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            LOGIN/REGISTER
          </Link>
        </div>
      )}
    </header>
  );
}
