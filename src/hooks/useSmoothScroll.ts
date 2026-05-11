import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Global smooth-scroll wired with Lenis.
 * - Respects prefers-reduced-motion
 * - Auto-pauses while a Radix Dialog/Sheet is open (body has data-scroll-locked)
 * - Exposes lenis on window for ad-hoc anchor scrolling
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Pause Lenis when Radix locks the body (modals/sheets)
    const observer = new MutationObserver(() => {
      const locked = document.body.hasAttribute("data-scroll-locked");
      if (locked) lenis.stop();
      else lenis.start();
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-scroll-locked", "style"] });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);
}
