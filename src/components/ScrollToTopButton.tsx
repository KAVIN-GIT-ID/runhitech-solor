import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { scrollToTop } from "../hooks/useLenis";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastState = false;
    const handleScroll = () => {
      const isPast = window.scrollY > 300;
      if (isPast !== lastState) {
        lastState = isPast;
        setVisible(isPast);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => scrollToTop(true)}
      aria-label="Back to top"
      title="Back to Top"
      className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-40 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl flex items-center justify-center transition-transform active:scale-95 cursor-pointer border border-blue-400/40"
    >
      <ArrowUp className="w-5 h-5 stroke-[2.5]" />
    </button>
  );
}
