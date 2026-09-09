import { useState, useEffect, useRef, ReactNode } from "react";

interface LazyCanvasInViewProps {
  children: ReactNode;
  height?: string;
  minHeight?: string;
  className?: string;
  rootMargin?: string;
}

/**
 * Defers rendering and code-splitting execution of heavy Three.js WebGL canvases
 * until the user scrolls within proximity (default 300px) of the canvas container.
 * Eliminates initial bundle parsing, WebGL context allocation, and shader compilation.
 */
export default function LazyCanvasInView({
  children,
  height = "340px",
  minHeight,
  className = "",
  rootMargin = "300px",
}: LazyCanvasInViewProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [shouldLoad, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={`w-full ${className}`}
      style={{ minHeight: minHeight || height }}
    >
      {shouldLoad ? (
        children
      ) : (
        <div
          className="w-full flex items-center justify-center rounded-3xl bg-slate-900/5 border border-slate-200/40"
          style={{ height }}
        >
          <div className="w-7 h-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  );
}
