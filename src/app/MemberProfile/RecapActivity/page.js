"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

import MemberHeader from "../../../components/SiteHeaderMember";
import SiteFooter from "../../../components/SiteFooter";
import { useAuthStore } from "@/store/useAuthStore";

export default function RecapActivityPage() {
  const router = useRouter();

  const { token, user } = useAuthStore();

  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      if (!token || !user) return;

      setIsLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        };

        const baseURL = process.env.NEXT_PUBLIC_API_URL;

        const [registrationsRes, postsRes] = await Promise.allSettled([
          axios.get(`${baseURL}/me/registrations`, config),
          axios.get(`${baseURL}/posts`, config),
        ]);

        let combinedActivities = [];

        // buat data event
        if (registrationsRes.status === "fulfilled" && registrationsRes.value.data) {
          const rawRegData = registrationsRes.value.data;
          
          let eventsArray = [];
          if (Array.isArray(rawRegData)) eventsArray = rawRegData;
          else if (Array.isArray(rawRegData.data)) eventsArray = rawRegData.data;
          else if (rawRegData.data && Array.isArray(rawRegData.data.data)) eventsArray = rawRegData.data.data;

          const mappedEvents = eventsArray.map((item) => ({
            id: `event-${item.id}`,
            rawDate: item.created_at,
            date: formatDate(item.created_at),
            action: "You've Joined",
            event: item.event?.title || "Mangrove Event", 
            location: item.event?.location || "Lokasi Event",
            link: `/EventPage/${item.event_id || item.event?.id}`,
          }));
          
          combinedActivities = [...combinedActivities, ...mappedEvents];
        }

        // buat data post user
        if (postsRes.status === "fulfilled" && postsRes.value.data) {
          const rawPostData = postsRes.value.data;
          
          let postsArray = [];
          if (Array.isArray(rawPostData)) postsArray = rawPostData;
          else if (Array.isArray(rawPostData.data)) postsArray = rawPostData.data;
          else if (rawPostData.data && Array.isArray(rawPostData.data.data)) postsArray = rawPostData.data.data;

          const myPosts = postsArray.filter((post) => post.user_id === user.id);

          const mappedPosts = myPosts.map((item) => ({
            id: `post-${item.id}`,
            rawDate: item.created_at,
            date: formatDate(item.created_at),
            action: "You Created a Post in Community",
            event: item.title || "Community Discussion",
            location: "Community Forum",
            link: `/CommunityPage/${item.id}`,
          }));
          
          combinedActivities = [...combinedActivities, ...mappedPosts];
        }

        combinedActivities.sort(
          (a, b) => new Date(b.rawDate) - new Date(a.rawDate),
        );

        setActivities(combinedActivities);
      } catch (error) {
        console.error("Failed fetch recap:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [token, user]);

  return (
    <div
      className="min-h-screen flex flex-col font-sans text-slate-800"
      style={{ backgroundColor: "#FDFDFD" }}
    >
      <MemberHeader />

      <main className="grow pt-32 pb-20 relative z-10">
        <div className="mx-auto w-full max-w-[1250px] px-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-400 hover:text-[#A4CF4A] transition mb-6 md:mb-2 text-sm md:text-base font-medium"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Recap<span style={{ color: "#A4CF4A" }}>Activity</span>
            </h1>
          </div>

          <div className="flex flex-col gap-4 md:gap-5 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40 text-[#A4CF4A] gap-3">
                <Loader2 size={40} className="animate-spin" />
                <p className="font-bold tracking-widest uppercase text-sm">
                  Gathering your activities...
                </p>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center bg-white rounded-3xl p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center h-48">
                <h3 className="text-xl font-bold text-slate-400 mb-2">
                  No Activities Yet
                </h3>
                <p className="text-slate-500 text-sm">
                  Join an event or post in the community to start your journey!
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-[20px] md:rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col items-start text-left"
                >
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">
                    {activity.date}
                  </h2>
                  <p className="text-sm md:text-base text-slate-800 mb-3 leading-relaxed">
                    {activity.action}{" "}
                    <span className="font-extrabold">"{activity.event}"</span>
                    {activity.location !== "Community Forum" && (
                      <>
                        {" "}
                        at{" "}
                        <span className="font-extrabold">
                          {activity.location}
                        </span>
                      </>
                    )}
                  </p>
                  <Link
                    href={activity.link}
                    className="text-[#56B6E4] text-xs md:text-sm font-semibold hover:underline hover:opacity-80 transition-all inline-block mt-1"
                  >
                    Check Detail
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
