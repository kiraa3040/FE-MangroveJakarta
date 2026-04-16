"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import MemberHeader from "../../components/SiteHeaderMember";

import { useAuthStore } from "@/store/useAuthStore";

export default function AboutUsPage() {
  const ACCENT = "#A4CF4A";
  const SOFT = "#EEF7BE";

  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const teamMembers = [
    {
      name: "Dr. (C) Paundra Hanutama S.I.Kom, M.I.Kom. M.Sc",
      role: "Founder",
      img: "/about_us/1.png",
      affiliations: [
        "LSPR Communication & Business Institute, Jakarta",
        "Christelijke Hoges School, Ede Netherlands",
        "Schiller International University, Paris",
        "Universitas Ciputra Surabaya",
      ],
    },
    {
      name: "Bayu Pamungkas S.I.K., M.SI",
      role: "Head of Program",
      img: "/about_us/2.png",
      affiliations: ["IPB University"],
    },
    {
      name: "Galih Hakim Antarnusa M. Si.",
      role: "Head of Community Engagement & Communications",
      img: "/about_us/3.png",
      affiliations: [
        "Universitas Islam Negeri Syarif Hidayatullah Jakarta",
        "Universitas Nasional",
      ],
    },
  ];

  const greensyMembers = [
    {
      id: 1,
      img: "/about_us/ark.png",
      name: "Zahrah Hayat Arka Putri",
      role: "Project Manager",
    },
    {
      id: 2,
      img: "/about_us/iyok.png",
      name: "Satrio Agna Gemintang",
      role: "Backend Dev",
    },
    {
      id: 3,
      img: "/about_us/nayy.png",
      name: "Nayli Amirah Firdaus",
      role: "UI/UX Designer",
    },
    {
      id: 4,
      img: "/about_us/jooo.png",
      name: "Najoan Rizki Pradana",
      role: "Frontend Dev",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 flex flex-col font-sans">
      {/* NAVBAR */}
      {isHydrated && isAuthenticated ? <MemberHeader /> : <SiteHeader />}

      <main className="grow pt-28 md:pt-32 lg:pt-36 pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* TOMBOL BACK */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 md:gap-2 text-[#A4CF4A] hover:brightness-90 transition mb-6 font-medium text-sm md:text-base"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {/*  HEADER SECTION  */}
          <div className="text-center mb-10 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
              About<span style={{ color: ACCENT }}>Us</span>
            </h1>
            <div className="flex flex-col gap-4 text-sm md:text-[19px] text-slate-800 leading-relaxed max-w-5xl mx-auto tracking-wide font-normal">
              <p>
                Yayasan Mangrove Indonesia Lestari is a North Jakarta–based
                organization committed to restoring mangrove ecosystems and
                strengthening coastal resilience in Indonesia. Established to
                respond to escalating environmental challenges—such as coastal
                erosion, habitat degradation, and climate change—we work at the
                intersection of ecological restoration, community empowerment,
                and climate action.
              </p>
              <p>
                Our approach integrates science-based interventions with
                participatory community engagement to ensure sustainable and
                long-term environmental impact.
              </p>
            </div>
          </div>

          {/*  VISION & MISSION  */}
          <div className="flex flex-col gap-6 max-w-5xl mx-auto mb-20 md:mb-28">
            {/* Vision Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 text-center transition-all">
              <h3 className="text-lg md:text-xl font-extrabold mb-3 text-black">
                Vision
              </h3>
              <p className="text-slate-800 text-sm md:text-base font-medium">
                To realize resilient coastal ecosystems through sustainable
                mangrove management, environmental education, and
                community-based conservation in Jakarta and beyond.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 text-center transition-all">
              <h3 className="text-lg md:text-xl font-extrabold mb-4 text-black">
                Mission
              </h3>
              <ul className="text-slate-800 text-sm md:text-base font-medium space-y-2 flex flex-col items-center">
                <li>
                  • To promote education and awareness on the ecological and
                  economic importance of mangrove ecosystems
                </li>
                <li>
                  • To implement mangrove restoration and conservation
                  initiatives using sustainable, evidence-based approaches
                </li>
                <li>
                  • To empower communities to actively participate in
                  environmental stewardship
                </li>
                <li>
                  • To provide an inclusive platform (MJ.ID) that connects
                  individuals, institutions, and stakeholders in collective
                  climate action
                </li>
              </ul>
            </div>

            {/* Core Programs Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 transition-all text-left">
              <h3 className="text-lg md:text-xl font-extrabold mb-6 text-black text-center">
                Core Programs
              </h3>
              <ol className="text-slate-800 text-sm md:text-base font-medium space-y-4 list-decimal list-outside pl-5 md:pl-8">
                <li>
                  <span className="font-bold">Mangrove Restoration</span>
                  <br />
                  <span className="text-slate-600 font-normal">
                    Reforestation and rehabilitation of degraded coastal areas
                    through community-based planting and monitoring systems.
                  </span>
                </li>
                <li>
                  <span className="font-bold">
                    Environmental Education & Awareness
                  </span>
                  <br />
                  <span className="text-slate-600 font-normal">
                    Public campaigns, workshops, and educational programs to
                    enhance understanding of climate change, biodiversity, and
                    coastal protection.
                  </span>
                </li>
                <li>
                  <span className="font-bold">Community Empowerment</span>
                  <br />
                  <span className="text-slate-600 font-normal">
                    Capacity-building initiatives that support sustainable
                    livelihoods linked to mangrove ecosystems.
                  </span>
                </li>
                <li>
                  <span className="font-bold">Partnership & Advocacy</span>
                  <br />
                  <span className="text-slate-600 font-normal">
                    Collaboration with government, academia, NGOs, and private
                    sector partners to scale impact and influence environmental
                    policy.
                  </span>
                </li>
              </ol>
            </div>

            {/* SDGs Alignment Card */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 transition-all">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center md:items-start">
                {/* Bagian Kiri: Judul */}
                <div className="md:w-1/3 text-center md:text-left shrink-0 pt-2">
                  <h3 className="text-xl md:text-2xl font-extrabold text-black mb-1">
                    SDGs Alignment
                  </h3>
                  <p className="text-slate-600 font-medium text-sm md:text-base">
                    Our work directly contributes to:
                  </p>
                </div>
                {/* Bagian Kanan: List */}
                <div className="md:w-2/3">
                  <ul className="text-slate-800 text-sm md:text-base font-medium space-y-2 text-left list-disc list-outside pl-5">
                    <li>
                      SDG 13 – Climate Action: Mitigating climate change through
                      carbon sequestration and ecosystem restoration
                    </li>
                    <li>
                      SDG 14 – Life Below Water: Protecting marine biodiversity
                      and coastal habitats
                    </li>
                    <li>
                      SDG 15 – Life on Land: Promoting sustainable ecosystem
                      management
                    </li>
                    <li>
                      SDG 17 – Partnerships for the Goals: Strengthening
                      multi-stakeholder collaboration
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* BEHIND US */}
          <div className="mb-16 md:mb-20">
            <div className="text-center mb-10 md:mb-14">
              <h2 className="text-4xl md:text-5xl font-extrabold text-black">
                Behind<span style={{ color: ACCENT }}>Us</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
              {teamMembers.map((member, index) => (
                <div key={index} className="group h-full">
                  <div className="bg-white rounded-3xl md:rounded-[30px] shadow-sm border border-slate-200 p-6 md:p-8 text-center h-full flex flex-col transition-all duration-300 hover:shadow-md">
                    <div className="relative mx-auto w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-40 md:h-40 mb-6 md:mb-8 rounded-full border border-slate-100 flex shrink-0 items-center justify-center overflow-hidden shadow-sm">
                      {member.img ? (
                        <Image
                          src={member.img}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-slate-300 text-xs font-bold tracking-widest">
                          FOTO
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col h-full">
                      <div className="min-h-12 flex items-center justify-center mb-3 md:mb-5">
                        <h4 className="text-[14px] md:text-[15px] font-bold text-black leading-tight">
                          {member.name}
                        </h4>
                      </div>

                      <div className="min-h-10 flex items-start justify-center mb-2">
                        <p className="text-[12px] md:text-[13px] font-medium text-slate-700">
                          {member.role}
                        </p>
                      </div>

                      <div className="flex-1 flex flex-col justify-start border-t border-slate-100 pt-4 md:pt-5">
                        <ul className="text-left text-[11px] wrap-break-word text-slate-500 items-start space-y-2 list-disc pl-4">
                          {member.affiliations.map((aff, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {aff}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*  GREENSY TEAM  */}
          <div className="mb-16 md:mb-24">
            <div className="bg-white rounded-4xl md:rounded-[40px] shadow-sm border border-slate-200 p-5 sm:p-6 md:p-8 text-center max-w-7xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-10">
                {greensyMembers.map((item) => (
                  <div
                    key={item.id}
                    className="group relative aspect-4/5 sm:aspect-square md:aspect-4/5 rounded-2xl md:rounded-[20px] w-full bg-slate-100 overflow-hidden border border-slate-200 shadow-inner shrink-0 cursor-pointer"
                  >
                    {item.img ? (
                      <Image
                        src={item.img}
                        alt={`Greensy Team ${item.name || item.id}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-slate-300 text-[10px] font-bold tracking-widest">
                          FOTO
                        </span>
                      </div>
                    )}

                    {/* mobile */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent md:bg-none md:bg-black/20 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end md:justify-center p-3 md:p-4 text-center z-10 pb-4 md:pb-4">
                      <div className="translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white text-sm sm:text-base md:text-lg font-bold mb-0.5 md:mb-1 drop-shadow-md">
                          {item.name}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] md:text-xs font-medium tracking-wider uppercase text-[#A4CF4A] drop-shadow-md">
                          {item.role}
                        </p>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-[#A4CF4A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-10">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white text-base md:text-lg font-bold mb-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] md:text-xs font-medium tracking-wider uppercase text-white">
                          {item.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl md:text-3xl font-extrabold">
                Greensy<span style={{ color: ACCENT }}>Team.</span>
              </h2>
              <p className="text-slate-600 mt-1 md:mt-2 text-xs md:text-sm font-medium">
                Website Builder
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <SiteFooter accent={ACCENT} soft={SOFT} />
    </div>
  );
}
