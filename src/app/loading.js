export default function Loading() {
  const ACCENT = "#A4CF4A";

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-[#F8F9FA] backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Animasi load */}
        <div className="relative w-16 h-16">
          <div className="absolute w-full h-full rounded-full border-4 border-gray-200"></div>
          <div
            className="absolute w-full h-full rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: `${ACCENT} transparent transparent transparent`,
            }}
          ></div>
        </div>

        {/* Teks Loading */}
        <p className="text-sm font-bold tracking-widest text-slate-600 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}
