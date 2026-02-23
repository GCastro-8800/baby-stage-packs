import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";

const FloatingCTA = () => {
  const isMobile = useIsMobile();
  const { track } = useAnalytics();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // Show CTA when hero is NOT visible (user scrolled past it)
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(heroSection);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleClick = () => {
    track("cta_click", { location: "floating_mobile", action: "configurador" });
    navigate("/configurador");
  };

  if (!isMobile || !isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-background/95 backdrop-blur-sm border-t border-border md:hidden">
      <Button
        onClick={handleClick}
        className="w-full cta-tension rounded-full py-6 text-base font-semibold"
      >
        Descubre qué necesitas
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );
};

export default FloatingCTA;
