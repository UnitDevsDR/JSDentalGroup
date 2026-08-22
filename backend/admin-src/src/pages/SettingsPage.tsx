import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useApiError } from "@/lib/auth";

const SITE_URL = "https://jsdentalgroup.com";

export default function SettingsPage() {
  const [gtmId, setGtmId] = useState("");
  const [gscVerification, setGscVerification] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onApiError = useApiError();

  useEffect(() => {
    api<{ key: string; value: string }[]>("/settings")
      .then((rows) => {
        for (const row of rows) {
          if (row.key === "gtmId") setGtmId(row.value);
          if (row.key === "gscVerification") setGscVerification(row.value);
        }
      })
      .catch((e) => setError(onApiError(e, "No se pudieron cargar los ajustes.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await Promise.all([
        api("/settings/gtmId", { method: "PUT", body: JSON.stringify({ value: gtmId }) }),
        api("/settings/gscVerification", { method: "PUT", body: JSON.stringify({ value: gscVerification }) }),
      ]);
    } catch (err) {
      // sin esto un guardado fallido se veía igual que uno exitoso, solo que
      // sin el "Guardado."
      return setError(onApiError(err, "No se pudieron guardar los ajustes."));
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-4 md:p-6">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="font-heading text-navy">SEO y analítica</CardTitle>
          <CardDescription>
            Guardar aquí deja el valor registrado en el servidor, pero el sitio todavía lo lee de la configuración de su
            despliegue: no cambia hasta el próximo despliegue del sitio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="gtmId">Google Tag Manager ID</Label>
              {loading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input id="gtmId" placeholder="GTM-XXXXXXX" value={gtmId} onChange={(e) => setGtmId(e.target.value)} />
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gsc">Verificación de Google Search Console</Label>
              {loading ? (
                <Skeleton className="h-9 w-full" />
              ) : (
                <Input id="gsc" placeholder="token del meta tag" value={gscVerification} onChange={(e) => setGscVerification(e.target.value)} />
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" disabled={loading} className="bg-teal-strong hover:bg-teal-strong/90">
                Guardar
              </Button>
              {saved && <span className="text-sm text-teal-text">Guardado.</span>}
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6 max-w-lg">
        <CardHeader>
          <CardTitle className="font-heading text-navy">Sitio</CardTitle>
          <CardDescription>
            El sitio es estático: el sitemap se genera solo en cada build (nunca hace falta regenerarlo a mano, como en
            Odoo) — aquí están los enlaces para revisarlo o darlo de alta en Search Console.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <a
            href={`${SITE_URL}/sitemap-index.xml`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-teal-text hover:underline"
          >
            Ver sitemap-index.xml <ExternalLink className="size-3.5" />
          </a>
          <a
            href={`${SITE_URL}/robots.txt`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-teal-text hover:underline"
          >
            Ver robots.txt <ExternalLink className="size-3.5" />
          </a>
          <a
            href="https://search.google.com/search-console"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-teal-text hover:underline"
          >
            Abrir Google Search Console <ExternalLink className="size-3.5" />
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
