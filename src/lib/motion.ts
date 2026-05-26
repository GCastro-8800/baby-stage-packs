import type { Transition, Variants } from "framer-motion";

// Curated easings — feel "Aesop / Cereal", not bouncy
export const easeOutExpo: Transition["ease"] = [0.16, 1, 0.3, 1];
export const easeOutQuint: Transition["ease"] = [0.22, 1, 0.36, 1];

export const springSoft: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 28,
  mass: 0.9,
};

export const STAGGER = 0.08;

// Reusable variants
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: easeOutExpo } },
};

export const lineReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  visible: (i: number = 0) => ({
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 1.4, ease: easeOutExpo, delay: 0.08 + i * 0.18 },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
