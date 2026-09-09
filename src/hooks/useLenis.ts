import { useEffect } from "react";

/**
 * Lightweight native scroll helper.
 * Lenis virtual smooth-scroll has been completely removed to ensure
 * buttery 60-120fps performance on low-end devices, mobile, and older browsers.
 */

/**
 * Smoothly scrolls the window to the top using native browser APIs.
 */
export function scrollToTop(smooth: boolean = true) {
  if (typeof window === "undefined") return;
  try {
    window.scrollTo({
      top: 0,
      behavior: smooth ? "smooth" : "auto",
    });
  } catch {
    window.scrollTo(0, 0);
  }
}

/**
 * Smoothly scrolls to a specific element selector using native browser APIs.
 */
export function scrollToTarget(target: string | HTMLElement, smooth: boolean = true) {
  if (typeof document === "undefined") return;
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  try {
    const navHeight = 80;
    const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({
      top,
      behavior: smooth ? "smooth" : "auto",
    });
  } catch {
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  }
}

/**
 * Lightweight anchor navigation listener with zero requestAnimationFrame loops.
 */
export function useLenis() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (!el) return;

      e.preventDefault();
      scrollToTarget(el as HTMLElement, true);
    };

    document.addEventListener("click", handleAnchorClick, { passive: false });
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);
}
