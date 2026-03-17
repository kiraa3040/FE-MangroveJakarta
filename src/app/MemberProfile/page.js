"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, X, Loader2, Info, Save, Check } from "lucide-react";

import SiteFooter from "../../components/SiteFooter";
import MemberHeader from "../../components/SiteHeaderMember";
import Loading from "../loading";

import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const ACCENT = "#A4CF4A";
  const RED = "#FF5A5A";

  const router = useRouter();
  const { user, isAuthenticated, fetchUser, logout, updateProfile, isLoading } =
    useAuthStore();

  // State Hydration
  const [isHydrated, setIsHydrated] = useState(false);

  // buat nahan redirect
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // state logout popup
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTriggerSave = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleExecuteSave = async (e) => {
    e?.preventDefault();
    setShowConfirmModal(false);

    const result = await updateProfile(formData);

    if (result.success) {
      setIsEditing(false);
      setPreviewImage(null);
      setShowSuccessModal(true);
    } else {
      alert("Gagal update: " + result.message);
    }
  };

  // untuk mengontrol mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    birthdate: "",
    city: "",
    province: "",
    profile_picture: null,
  });

  // profpic
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size too large! max. 2MB.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profile_picture: file,
    }));

    setPreviewImage(URL.createObjectURL(file));

    // setPreviewImage(URL.createObjectURL(file));

    // setIsUploading(true);

    // try {
    //   const token = useAuthStore.getState().token;

    //   if (!token) {
    //     throw new Error("Sesi telah habis, silakan login kembali.");
    //   }

    //   // uplaod
    //   const uploadData = new FormData();
    //   uploadData.append("avatar", file);

    //   // Tembak API
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/me/profile-picture`,
    //     {
    //       method: "POST",
    //       headers: {
    //         Accept: "application/json",
    //         Authorization: `Bearer ${token}`,
    //       },
    //       body: uploadData,
    //     },
    //   );

    //   const result = await response.json();

    //   if (!response.ok) {
    //     throw new Error(result.message || "Gagal mengunggah foto profil.");
    //   }

    //   await fetchUser();
    //   alert("Foto profil berhasil diperbarui!");
    // } catch (error) {
    //   console.error("Upload Error:", error);
    //   alert(error.message);
    // } finally {
    //   setIsUploading(false);
    //   if (fileInputRef.current) {
    //     fileInputRef.current.value = "";
    //   }
    // }
  };

  const getAvatarUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL;
    let cleanPath = path.startsWith("/") ? path : `/${path}`;

    if (!cleanPath.startsWith("/storage/")) {
      cleanPath = `/storage${cleanPath}`;
    }

    return `${baseUrl}${cleanPath}`;
  };

  const avatarPath =
    user?.profile?.profile_picture_url;
    

  const displayAvatar = previewImage || getAvatarUrl(avatarPath);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isLoggingOut) return;

    if (isHydrated) {
      if (!isAuthenticated) {
        router.push("/SignIn");
      } else if (!user) {
        fetchUser();
      }
    }
  }, [isHydrated, isAuthenticated, router, user, fetchUser, isLoggingOut]);

  useEffect(() => {
    if (user) {
      // console.log("DATA FROM BE:", user);

      const userProfile = user.profile || {};

      setFormData({
        name: user.name || "",
        phone: userProfile.phone || user.phone || "",
        birthdate: userProfile.birthdate || user.birthdate || "",
        city: userProfile.city || user.city || "",
        province: userProfile.province || user.province || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Batal edit
  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || user.whatsapp || "",
        birthdate: user.birthdate || user.birth_date || "",
        city: user.city || "",
        province: user.province || "",
      });
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    window.location.href = "/LandingPage";
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile(formData);

    if (result.success) {
      alert("Profil berhasil diupdate!");
      setIsEditing(false);
      setPreviewImage(null);
    } else {
      alert("Gagal update: " + result.message);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      alert("Nama tidak boleh kosong.");
      return;
    }

    const result = await updateProfile(formData);

    if (result.success) {
      setIsEditing(false);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  if (!isHydrated || isLoading || !user) {
    return <Loading />;
  }

  const formattedDate = user.birthdate || user.birth_date || "-";

  // Class input saat disabled dan active
  const inputClassName = `w-full rounded-xl border px-4 py-3 outline-none text-sm transition-all duration-300 
    ${
      isEditing
        ? "border-[#A4CF4A] focus:ring-2 focus:ring-[#A4CF4A]/50 bg-white text-slate-700"
        : "border-gray-200 bg-gray-50 text-slate-400 cursor-not-allowed"
    }`;

  // buat badge profile
  const userPoints = user?.profile?.point || 0;
  let currentBadge = "";
  let nextBadge = "";
  let minPoints = 0;
  let maxPoints = 0;

  if (userPoints < 100) {
    currentBadge = "First Root";
    nextBadge = "Green Initiator";
    minPoints = 0;
    maxPoints = 100;
  } else if (userPoints < 300) {
    currentBadge = "Green Initiator";
    nextBadge = "Mangrove Guardian";
    minPoints = 100;
    maxPoints = 300;
  } else {
    currentBadge = "Mangrove Guardian";
    nextBadge = "Max Level";
    minPoints = 300;
    maxPoints = 500;
  }

  let progressPoints = userPoints - minPoints;
  let targetPoints = maxPoints - minPoints;
  let badgePercentage = Math.min((progressPoints / targetPoints) * 100, 100);
  let pointsNeeded = maxPoints - userPoints;

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 flex flex-col">
      <MemberHeader />

      <main className="grow pt-28 pb-26 px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

            {/*  PROFILE KIRI  */}
            <div className="relative z-10 bg-white rounded-3xl md:rounded-[30px] shadow-xl p-8 flex flex-col items-center h-fit border border-gray-100">
            
              {/* profpic */}
              <div className="relative mb-4">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#A4CF4A]/20 shadow-sm relative flex items-center justify-center bg-slate-100 group">
                  {displayAvatar ? (
                    <Image
                      src={displayAvatar}
                      alt="Profile Picture"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-slate-400 uppercase">
                      {user?.name ? user.name.substring(0, 2) : "ME"}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!isEditing}
                  className={`absolute bottom-0 right-0 md:-right-2 bg-white p-2.5 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100 cursor-pointer z-20
                    ${
                      isEditing
                        ? "bg-white border-slate-200 hover:bg-slate-50 hover:scale-110 cursor-pointer opacity-100"
                        : "bg-gray-100 border-gray-100 text-gray-400 cursor-not-allowed opacity-0 invisible"
                    }
                  `}
                >
                  <Camera
                    size={14}
                    className={isEditing ? "text-[#A4CF4A]" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Badge Avatar */}
              <div className="flex items-center justify-center gap-2 px-4 md:px-5 py-2 rounded-full border border-[#A4CF4A] bg-[#F7FDE8] mb-6 w-fit max-w-full">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#A4CF4A] shrink-0"></div>
                <span className="text-[10px] md:text-xs font-bold text-[#A4CF4A] tracking-wider whitespace-nowrap">
                  {currentBadge}
                </span>
              </div>

              {/* Detail Info Kiri */}
              <div className="w-full border border-[#A4CF4A] rounded-2xl p-8 space-y-7 mb-8 text-left">
                {/* Name */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    Name
                  </p>
                  <p className="text-sm font-bold text-slate-800 wrap-break-word">
                    {user.name || "-"}
                  </p>
                </div>
                {/* Email */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-slate-800 break-all">
                    {user.email || "-"}
                  </p>
                </div>
                {/* Whatsapp */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    No. Whatsapp
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user.profile?.phone || user.phone || "-"}
                  </p>
                </div>
                {/* Birth Date */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    Birth Date
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user.profile?.birthdate || user.birthdate || formattedDate}
                  </p>
                </div>
                {/* City */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    City
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user.profile?.city || user.city || "-"}
                  </p>
                </div>
                {/* Province */}
                <div>
                  <p className="text-[10px] font-bold text-[#A4CF4A] uppercase mb-0.5">
                    Province
                  </p>
                  <p className="text-sm font-bold text-slate-800">
                    {user.profile?.province || user.province || "-"}
                  </p>
                </div>

                {/*  BUTTON EDIT  */}
                <div className="w-full space-y-3 pt-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                    className={`w-full py-3 rounded-full text-white text-xs font-bold shadow-md transition
                        ${
                          isEditing
                            ? "bg-gray-300 cursor-not-allowed"
                            : "hover:brightness-105"
                        }`}
                    style={{ backgroundColor: isEditing ? "#cbd5e1" : ACCENT }}
                  >
                    {isEditing ? "EDITING..." : "EDIT PROFILE"}
                  </button>
                  {/* BUTTON LOGOUT. */}
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="w-full py-3 rounded-full text-white text-xs font-bold shadow-md hover:brightness-105 transition"
                    style={{ backgroundColor: RED }}
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            </div>

            {/*  EDIT FORM  */}
            <div
              className={`relative z-0 lg:col-span-2 bg-white rounded-3xl md:rounded-[30px] shadow-xl p-6 md:p-10 border border-gray-100 h-full transition-opacity duration-300 ${
                isEditing ? "opacity-100" : "opacity-80"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: isEditing ? ACCENT : "#94a3b8" }}
                >
                  {isEditing ? "Edit Profile" : "Profile Details"}
                </h2>
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-600 transition bg-red-50 px-3 py-1.5 rounded-full"
                  >
                    <X size={14} /> CANCEL
                  </button>
                )}
              </div>

              <form className="space-y-6 md:space-y-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold ml-1 ${
                      isEditing ? "text-[#A4CF4A]" : "text-slate-400"
                    }`}
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className={inputClassName}
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Email (Read Only) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 ml-1">
                    Email Address (Read Only)
                  </label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3 md:py-4 outline-none text-slate-400 text-sm cursor-not-allowed"
                    value={user.email || ""}
                    disabled
                  />
                </div>

                {/* Whatsapp Field */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold ml-1 ${
                      isEditing ? "text-[#A4CF4A]" : "text-slate-400"
                    }`}
                  >
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    name="phone"
                    className={inputClassName}
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Birth Date Field */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold ml-1 ${
                      isEditing ? "text-[#A4CF4A]" : "text-slate-400"
                    }`}
                  >
                    Birth Date
                  </label>
                  <input
                    type="date"
                    name="birthdate"
                    className={inputClassName}
                    value={formData.birthdate}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* City Field */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold ml-1 ${
                      isEditing ? "text-[#A4CF4A]" : "text-slate-400"
                    }`}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    className={inputClassName}
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Province Field */}
                <div className="space-y-2">
                  <label
                    className={`text-xs font-bold ml-1 ${
                      isEditing ? "text-[#A4CF4A]" : "text-slate-400"
                    }`}
                  >
                    Province
                  </label>
                  <input
                    type="text"
                    name="province"
                    className={inputClassName}
                    value={formData.province}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <button
                      type="button"
                      onClick={handleTriggerSave}
                      disabled={isLoading}
                      className="w-full py-4 rounded-full text-white text-sm font-bold shadow-md hover:brightness-105 transition tracking-wider disabled:opacity-70"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {isLoading ? "SAVING..." : "SAVE CHANGES"}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* BADGE */}
          <div className="mt-8">
            {/* Box Badge */}
            <div className="bg-white rounded-3xl md:rounded-[30px] shadow-xl p-6 md:p-10 border border-gray-100 relative flex flex-col items-center">
              {/* <div className="absolute top-0 right-0 bottom-0 w-1/2 opacity-20 pointer-events-none" style={{ backgroundImage: "url('/images/leaf-pattern.png')", backgroundSize: 'cover', backgroundPosition: 'right' }}></div> */}

              <div className="relative w-full flex justify-center items-center mb-8">
                <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 rounded-full border-2 border-[#A4CF4A] bg-white z-10 shadow-sm text-center max-w-full">
                  <div className="w-5 h-5 rounded-full border-2 border-[#A4CF4A]"></div>
                  <span className="text-sm md:text-lg lg:text-xl font-medium text-slate-800 tracking-wide">
                    YOU'VE REACHED{" "}
                    <span className="font-extrabold text-[#A4CF4A]">
                      {currentBadge}
                    </span>
                  </span>
                </div>

                {/* Info */}
                <div className="absolute right-0 group cursor-help z-50">
                  <Info
                    className="w-6 h-6 md:w-8 md:h-8 text-slate-800 hover:text-[#A4CF4A] transition-colors duration-300"
                    strokeWidth={2.5}
                  />

                {/* tooltip */}
                  <div className="absolute bottom-full right-0 md:right-0 left-1/2 md:left-auto mb-3 w-[260px] md:w-[300px] bg-white rounded-[20px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-4 md:p-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 origin-bottom-right">
                    <p className="text-[11px] md:text-xs text-slate-600 text-center leading-relaxed mb-3 font-medium">
                      Badge levels reflect your contribution through
                      conservation events and community participation
                    </p>

                    <div className="flex flex-col gap-2.5">
                      <div className="bg-[#EAF3C8] py-2.5 md:py-3 px-2 rounded-xl text-center">
                        <span className="font-bold text-slate-800 text-[13px] md:text-sm">
                          25 points for each event
                        </span>
                      </div>
                      <div className="bg-[#EAF3C8] py-2.5 md:py-3 px-2 rounded-xl text-center">
                        <span className="font-bold text-slate-800 text-[13px] md:text-sm">
                          1 point for every 5 upvotes
                        </span>
                      </div>
                    </div>
                    <div className="absolute  right-10px md:right-14px w-4 h-4 bg-white border-b border-r border-slate-100 transform rotate-45 z-[-1]"></div>
                  </div>
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full max-w-3xl mb-4">
                <div
                  className="w-full h-4 md:h-5 rounded-full overflow-hidden"
                  style={{ backgroundColor: "#EAF3C8" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${badgePercentage}%`,
                      backgroundColor: "#A4CF4A",
                    }}
                  ></div>
                </div>
              </div>

              {userPoints < 500 ? (
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-800 tracking-wide text-center">
                  {pointsNeeded} points to{" "}
                  <span style={{ color: ACCENT }}>{nextBadge}</span>
                </h3>
              ) : (
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold text[#A4CF4A] tracking-wide text-center">
                  Maximum Level Reached, Congrats!!
                </h3>
              )}
            </div>

            {/*  Recap Activity */}
            <div className="mt-8">
              <Link href="/MemberProfile/RecapActivity">
                <button
                  className="w-full py-4 md:py-5 rounded-full text-white text-sm md:text-base font-extrabold shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-[0.2em] hover:-translate-y-1"
                  style={{ backgroundColor: ACCENT }}
                >
                  RECAP ACTIVITY
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      {/* update confirm */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#EEF6D2] w-full max-w-[420px] rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative mb-6 mt-4">
              <div className="absolute inset-0 bg-white rounded-full scale-[1.6] opacity-40 blur-[2px]"></div>
              <div className="absolute inset-0 bg-white rounded-full scale-[1.3] opacity-60"></div>
              <div className="relative bg-white rounded-full p-4 shadow-sm z-10">
                <Save className="w-8 h-8 text-[#98C93C]" fill="currentColor" />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Profile Update!
            </h3>
            <p className="text-sm text-slate-700 font-medium mb-4 px-2 leading-relaxed">
              You've made some updates to your profile. Do you want to save
              these changes?
            </p>

            <div className="flex flex-col items-center mb-6">
              <div className="w-0.5 h-10 bg-white rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full -mt-1 shadow-sm"></div>
            </div>

            <div className="flex w-full gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-[#FF4D4D] text-white text-sm font-extrabold py-3.5 rounded-full hover:bg-red-500 hover:-translate-y-0.5 transition-all shadow-md uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteSave}
                className="flex-1 bg-[#98C93C] text-white text-sm font-extrabold py-3.5 rounded-full hover:bg-[#86b532] hover:-translate-y-0.5 transition-all shadow-md uppercase tracking-wider"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* success update */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-300">
          <div className="bg-[#EEF6D2] w-full max-w-[420px] rounded-[30px] p-8 flex flex-col items-center text-center shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative mb-6 mt-4">
              <div className="absolute inset-0 bg-white rounded-full scale-[1.6] opacity-40 blur-[2px]"></div>
              <div className="absolute inset-0 bg-white rounded-full scale-[1.3] opacity-60"></div>
              <div className="relative bg-white rounded-full p-4 shadow-sm z-10">
                <Check className="w-8 h-8 text-[#98C93C]" strokeWidth={4} />
              </div>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
              Update Profile Successful!
            </h3>
            <p className="text-sm text-slate-700 font-medium mb-4 px-2 leading-relaxed">
              Your information has been successfully updated. Thank you for
              staying connected with our mangrove community.
            </p>

            <div className="flex flex-col items-center mb-6">
              <div className="w-0.5 h-10 bg-white rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full -mt-1 shadow-sm"></div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
              }}
              className="w-full bg-[#98C93C] text-white text-sm font-extrabold py-3.5 rounded-full hover:bg-[#86b532] hover:-translate-y-0.5 transition-all shadow-md uppercase tracking-wider"
            >
              Save Change
            </button>
          </div>
        </div>
      )}

      {/* POPUP LOGOUT */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Background Overlay Hitam Transparan */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsLogoutModalOpen(false)}
          ></div>

          {/* Kotak Modal Pink */}
          <div
            className="rounded-[30px] p-8 md:p-10 w-full max-w-[450px] shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center text-center"
            style={{ backgroundColor: "#FFC1C1" }}
          >
            {/* Ikon X dengan Efek Halo/Rings */}
            <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
              <div className="absolute inset-0 bg-white/40 rounded-full scale-125"></div>
              <div className="absolute inset-2 bg-white/70 rounded-full scale-110"></div>
              <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm z-10">
                <X size={36} strokeWidth={5} className="text-[#F24848]" />
              </div>
            </div>

            {/* Judul & Deskripsi */}
            <h2 className="text-2xl font-extrabold text-black mb-2 tracking-tight">
              Ready to Leave?
            </h2>
            <p className="text-[13px] md:text-sm text-slate-800 mb-6 px-2 leading-relaxed font-medium">
              You're about to log out of your account. You can log back in
              anytime to continue exploring mangrove conservation activities.
            </p>

            {/* Garis Vertikal Putih & Titik */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-0.5 h-10 bg-white"></div>
              <div className="w-2.5 h-2.5 bg-white rounded-full -mt-0.5 shadow-sm"></div>
            </div>

            {/* Tombol Aksi */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-4 rounded-full text-white text-[13px] md:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest"
                style={{ backgroundColor: "#4AB8DA" }}
              >
                STAY LOGGED IN
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 py-4 rounded-full text-white text-[13px] md:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all uppercase tracking-widest"
                style={{ backgroundColor: "#F24848" }}
              >
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
