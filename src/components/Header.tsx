import { useState, useEffect } from "react";
import { Menu, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAnalytics } from "@/hooks/useAnalytics";
import logo from "@/assets/logo-bebloo.png";

const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Precios", href: "#precios" },
  { label: "FAQ", href: "#faq" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { track } = useAnalytics();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      track("cta_click", { source: "header", action: `nav_${id}` });
    }
    setIsOpen(false);
  };

  const handleCtaClick = () => {
    scrollToSection("#precios");
    track("cta_click", { source: "header", action: "empezar" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container max-w-6xl px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex-shrink-0"
          >
            <img
              src={logo}
              alt="bebloo"
              className="h-10 md:h-12"
            />
          </a>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {/* Desktop CTA */}
          {!isMobile && (
            <Button onClick={handleCtaClick} size="sm" className="gap-2">
              Empezar
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <img src={logo} alt="bebloo" className="h-10" />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <button
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className="text-lg font-medium text-foreground text-left hover:text-primary transition-colors"
                    >
                      {link.label}
                    </button>
                  ))}
                  <Button
                    onClick={handleCtaClick}
                    className="w-full mt-4 gap-2"
                    size="lg"
                  >
                    Empezar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
