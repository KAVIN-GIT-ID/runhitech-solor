import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";

export default function SocialAdPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already closed the ad in this session
    const isClosed = sessionStorage.getItem("social-ad-dismissed");
    if (isClosed) {
      setDismissed(true);
      return;
    }

    // Slide in after 10 seconds of site visit
    const timer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setVisible(false);
    setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem("social-ad-dismissed", "true");
    }, 300);
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 w-[calc(100vw-32px)] sm:w-[320px] max-w-[340px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden transition-all duration-400 ease-out transform ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95 pointer-events-none"
      }`}
    >
      {/* Top Gradient Line */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 h-1 w-full" />

      <div className="p-3 sm:p-3.5 flex items-center gap-3">
        {/* Reel Thumbnail with Play Button */}
        <a
          href="https://www.instagram.com/reel/Db5mRm4JHZj/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-sm group bg-slate-900"
        >
          <img
            src="https://runhitechsolar.com/wp-content/uploads/2025/08/Residential-Solar.jpg"
            alt="Run Hi Tech Solar Reel"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 opacity-90"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-md">
              <Play className="w-3 h-3 fill-current ml-0.5" />
            </div>
          </div>
        </a>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-bold text-slate-900 truncate">Run Hi Tech Solar</span>
            <svg className="w-3 h-3 text-blue-500 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </div>
          <p className="text-[11px] font-semibold text-slate-700 leading-snug mt-0.5 line-clamp-2">
            Watch latest 550+ rooftop solar installations & subsidy reel!
          </p>
          <a
            href="https://www.instagram.com/reel/Db5mRm4JHZj/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-rose-600 hover:text-rose-700 mt-1"
          >
            <svg className="w-3 h-3 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Watch Reel (Instagram) →</span>
          </a>
        </div>

        {/* Close Button */}
        <button
          onClick={closePopup}
          className="self-start text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Close"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
