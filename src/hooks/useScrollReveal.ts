import { useEffect } from "react";

/**
 * Global scroll-reveal hook.
 * Watches every element with [data-animate] and toggles
 * the matching CSS class when it enters the viewport.
 *
 * Supported values for data-animate:
 *   "fade-up"    → .reveal
 *   "fade-left"  → .reveal-left
 *   "fade-right" → .reveal-right
 *   "zoom"       → .reveal-scale
 *
 * Optional:
 *   data-delay="150"   → adds inline transition-delay in ms
 */
export function useScrollReveal() {
  useEffect(() => {
    const CLASS_MAP: Record<string, string> = {
      "fade-up":    "reveal",
      "fade-left":  "reveal-left",
      "fade-right": "reveal-right",
      "zoom":       "reveal-scale",
    };

    // Attach initial classes
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]")
    );

    elements.forEach((el) => {
      const anim = el.dataset.animate ?? "fade-up";
      const delay = el.dataset.delay ?? "0";
      el.classList.add(CLASS_MAP[anim] ?? "reveal");
      el.style.transitionDelay = `${delay}ms`;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            // Once revealed, unobserve for performance
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}
