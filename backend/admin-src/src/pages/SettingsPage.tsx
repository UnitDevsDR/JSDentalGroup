import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [gtmId, setGtmId] = useState("");
  const [gscVerification, setGscVerification] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api<{ key: string; value: string }[]>("/settings").then((rows) => {
      for (const row of rows) {
        if (row.key === "gtmId") setGtmId(row.value);
        if (row.key === "gscVerification") setGscVerification(row.value);
      }
    });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await Promise.all([
      api("/settings/gtmId", { method: "PUT", body: JSON.stringify({ value: gtmId }) }),
      api("/settings/gscVerification", { method: "PUT", body: JSON.stringify({ value: gscVerification }) }),
    ]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6">
      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="font-heading text-navy">SEO y analítica</CardTitle>
          <CardDescription>
            Estos valores los lee el sitio en el navegador de cada visitante — cambian aquí y se aplican de inmediato,
            sin rehacer el build ni redesplegar el sitio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="gtmId">Google Tag Manager ID</Label>
              <Input id="gtmId" placeholder="GTM-XXXXXXX" value={gtmId} onChange={(e) => setGtmId(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="gsc">Verificación de Google Search Console</Label>
              <Input id="gsc" placeholder="token del meta tag" value={gscVerification} onChange={(e) => setGscVerification(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Button type="submit" className="bg-teal-strong hover:bg-teal-strong/90">
                Guardar
              </Button>
              {saved && <span className="text-sm text-teal-text">Guardado.</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
