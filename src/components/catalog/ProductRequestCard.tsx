import { useState } from "react";
import { z } from "zod";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Props {
  query: string;
}

const formSchema = z.object({
  email: z
    .string()
    .trim()
    .max(255)
    .email({ message: "Email no válido" })
    .optional()
    .or(z.literal("")),
  notes: z.string().trim().max(500, { message: "Máximo 500 caracteres" }).optional(),
});

export default function ProductRequestCard({ query }: Props) {
  const { toast } = useToast();
  const { track } = useAnalytics();
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const parsed = formSchema.safeParse({ email, notes });
    if (!parsed.success) {
      const first = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      toast({ title: first ?? "Revisa los datos", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("product_requests").insert({
        query: query.trim().slice(0, 120),
        email: email.trim() || null,
        notes: notes.trim() || null,
        user_id: userData.user?.id ?? null,
        user_agent: navigator.userAgent.slice(0, 500),
        referrer: document.referrer.slice(0, 500) || null,
      });
      if (error) throw error;

      track("product_request_submitted", { query, has_email: !!email.trim() });
      setSubmitted(true);
      toast({ title: "¡Gracias! Tomamos nota." });
    } catch (err) {
      console.error("product_request insert failed", err);
      toast({
        title: "No pudimos guardar tu petición",
        description: "Inténtalo de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sm:p-8 text-center max-w-xl mx-auto">
        <CheckCircle2 className="h-8 w-8 text-primary mx-auto mb-3" />
        <h3 className="font-serif text-xl text-foreground mb-2">Anotado</h3>
        <p className="text-sm text-muted-foreground">
          Si incorporamos «{query}» a la selección, te avisamos.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 max-w-xl mx-auto">
      <div className="flex items-start gap-3 mb-4">
        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div>
          <h3 className="font-serif text-xl text-foreground leading-tight">
            No encontramos «{query}» todavía.
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Curamos la selección con cuidado, así que aún no tenemos todo. Cuéntanos
            qué te haría falta y lo valoramos para próximas incorporaciones.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.slice(0, 255))}
          placeholder="Tu email (opcional, para avisarte)"
          autoComplete="email"
          className="h-11 rounded-xl"
        />
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          placeholder="Marca, modelo o detalles que te ayudarían…"
          rows={3}
          className="rounded-xl resize-none"
        />
        <Button type="submit" disabled={submitting} className="w-full h-11 rounded-xl">
          {submitting ? "Enviando…" : "Avísame si lo añadimos"}
        </Button>
      </form>
    </div>
  );
}
