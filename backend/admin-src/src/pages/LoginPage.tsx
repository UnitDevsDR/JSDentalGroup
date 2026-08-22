// Adaptado del bloque @shadcnblocks/login1: mismo layout (logo, tarjeta
// centrada, borde+sombra), sin el enlace de registro (aquí no hay alta
// pública de admins) y con submit real contra el backend.
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      navigate("/", { replace: true });
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-dvh bg-muted px-4 py-10">
      <div className="flex min-h-[calc(100dvh-5rem)] items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center gap-6">
          <img src="/admin/logo.webp" alt="JS Dental Group" className="h-10" />
          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-stretch gap-y-4 rounded-md border bg-background px-6 py-8 shadow-md"
          >
            <h1 className="text-center font-heading text-xl font-semibold text-navy">Panel de leads</h1>
            <div className="space-y-1.5">
              <Label htmlFor="email">Correo</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" disabled={loading} className="mt-2 w-full bg-teal-strong hover:bg-teal-strong/90">
              {loading ? "Entrando…" : "Entrar"}
            </Button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
