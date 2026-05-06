import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function CatalogSearchBar({ value, onChange }: Props) {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        inputMode="search"
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, 120))}
        placeholder="Busca un producto: cuna, mochila, hamaca…"
        aria-label="Buscar producto en el catálogo"
        className="pl-10 pr-10 h-11 rounded-xl bg-card"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Borrar búsqueda"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
