const badges = [
  { label: "Limpieza con estándares hospitalarios" },
  { label: "Marcas oficiales · Bugaboo · Stokke · Cybex" },
  { label: "Envío y recogida en Madrid" },
  { label: "Pago seguro · Stripe" },
];

const TrustBadgesBand = () => {
  return (
    <section
      aria-label="Garantías del servicio"
      className="px-4 py-10 md:px-6 md:py-14 border-y border-foreground/10"
    >
      <div className="container max-w-6xl">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0 md:divide-x md:divide-foreground/10">
          {badges.map((b) => (
            <li
              key={b.label}
              className="px-2 md:px-6 text-center text-[11px] md:text-xs tracking-[0.14em] uppercase text-muted-foreground leading-relaxed"
            >
              {b.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default TrustBadgesBand;
