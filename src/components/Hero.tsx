import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  onSeePricing: () => void;
}

const Hero = ({ onSeePricing }: HeroProps) => {
  return (
    <section className="hero-section min-h-[85vh] flex flex-col items-center justify-center px-6 py-20">
      <div className="container max-w-3xl text-center">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Premium baby equipment subscription
        </div>

        {/* Direct headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 text-balance leading-tight">
          The first months with a baby are chaotic enough.
        </h1>

        {/* Problem-aware subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-balance">
          We take care of the equipment — clean, safe, and swapped as your baby grows. No buying. No storing. No reselling.
        </p>

        {/* Primary CTA */}
        <Button
          size="lg"
          onClick={onSeePricing}
          className="cta-tension text-lg px-8 py-6 h-auto"
        >
          See plans & pricing
          <ArrowDown className="ml-2 h-5 w-5" />
        </Button>

        {/* Micro-validation */}
        <p className="mt-6 text-sm text-muted-foreground">
          Starting from €89/month • 0–3 months stage
        </p>
      </div>
    </section>
  );
};

export default Hero;
