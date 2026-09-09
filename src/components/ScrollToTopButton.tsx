import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "../hooks/useLenis";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Show when user scrolls down beyond 250px or reaches towards the bottom
      if (scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }

      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / scrollHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    scrollToTop(true);
  };

  return (
    <div
      className={`fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-40 transition-all duration-300 ease-out transform ${
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
          : "opacity-0 translate-y-4 pointer-events-none scale-90"
      }`}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label="Scroll back to top of page"
        title="Back to Top"
        className="relative group w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-slate-950/90 hover:bg-blue-600 text-white shadow-2xl border border-white/20 hover:border-blue-400/50 backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        style={{
          boxShadow:
            "0 12px 30px -6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.15) inset",
        }}
      >
        {/* Circular Progress Track SVG Ring (Matching the user's reference image ring) */}
        <svg
          className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none p-1"
          viewBox="0 0 44 44"
        >
          {/* Subtle background circle matching user image */}
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-white/20 group-hover:stroke-white/35 transition-colors"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Dynamic scroll progress fill */}
          <circle
            cx="22"
            cy="22"
            r="18"
            className="stroke-amber-400 group-hover:stroke-white transition-colors"
            strokeWidth="2"
            strokeDasharray={113}
            strokeDashoffset={113 - (113 * scrollProgress) / 100}
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Minimalist Arrow Icon (Matching user screenshot style) */}
        <ArrowUp className="w-5 h-5 stroke-[2] transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10 text-white" />
      </button>
    </div>
  );
}
