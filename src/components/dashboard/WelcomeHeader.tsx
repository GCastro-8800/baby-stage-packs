import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WelcomeHeaderProps {
  fullName: string | null | undefined;
  email: string | undefined;
  avatarUrl: string | null | undefined;
}

export function WelcomeHeader({ fullName, email, avatarUrl }: WelcomeHeaderProps) {
  const getInitials = (name: string | null | undefined, email: string | undefined) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || "U";
  };

  const firstName = fullName?.split(" ")[0] || "bienvenido/a";

  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16 border-2 border-primary/20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-lg">
          {getInitials(fullName, email)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-medium text-foreground">
          Hola, {firstName}
        </h1>
        <p className="text-muted-foreground">
          Todo está bajo control. Aquí tienes tu resumen.
        </p>
      </div>
    </div>
  );
}
