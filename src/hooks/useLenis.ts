import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Initialises Lenis smooth-scroll for desktop while allowing
 * native 120Hz momentum scrolling on mobile devices for peak performance.
 */
export function useLenis() {
  useEffect(() => {
    // Check if device is touch / mobile
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      window.innerWidth < 768;

    let lenis: Lenis | null = null;
    let rafId: number | null = null;

    // Only initialise virtual smooth scroll on non-touch desktop screens
    if (!isTouch) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.0,
      });

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    }

    // Make anchor links work smoothly on both desktop & mobile
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();

      if (lenis) {
        lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.2 });
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis?.destroy();
    };
  }, []);
}
