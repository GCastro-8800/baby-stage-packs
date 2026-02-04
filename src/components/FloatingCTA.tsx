import { useEffect, useState, useRef } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";

const FloatingCTA = () => {
  const isMobile = useIsMobile();
  const { track } = useAnalytics();
  const [isVisible, setIsVisible] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const pricingSection = document.getElementById("precios");
    if (!pricingSection) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Hide CTA when pricing section is visible
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(pricingSection);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = () => {
    track("cta_click", { location: "floating_mobile", action: "scroll_to_pricing" });
    const pricingSection = document.getElementById("precios");
    pricingSection?.scrollIntoView({ behavior: "smooth" });
  };

  // Don't render on desktop or when pricing section is visible
  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <Button
        onClick={handleClick}
        className="w-full cta-tension rounded-full py-6 text-base font-semibold"
      >
        Ver planes desde €89/mes
        <ArrowDown className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default FloatingCTA;
