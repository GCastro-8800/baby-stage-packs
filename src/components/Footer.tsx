const Footer = () => {
  return (
    <footer className="py-8 px-6 border-t border-border">
      <div className="container max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-serif font-semibold text-foreground text-lg">bebloo</span>
          </div>
          <p>© 2026 bebloo. Suscripción premium de equipamiento para bebés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
