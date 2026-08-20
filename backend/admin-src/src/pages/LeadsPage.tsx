import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";

interface Lead {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  subject: string;
  message: string;
  status: "NEW" | "CONTACTED" | "ARCHIVED";
  createdAt: string;
}

const STATUS_LABEL: Record<Lead["status"], string> = { NEW: "Nuevo", CONTACTED: "Contactado", ARCHIVED: "Archivado" };
const STATUS_VARIANT: Record<Lead["status"], "default" | "secondary" | "outline"> = {
  NEW: "default",
  CONTACTED: "secondary",
  ARCHIVED: "outline",
};

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const pageSize = 25;

  const load = async () => {
    const q = status === "all" ? `?page=${page}` : `?page=${page}&status=${status}`;
    const data = await api<{ items: Lead[]; total: number }>(`/leads${q}`);
    setItems(data.items);
    setTotal(data.total);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const setLeadStatus = async (id: string, next: Lead["status"]) => {
    await api(`/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    load();
  };

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold text-navy">Leads</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            {/* GET con cookie de sesión, sin necesidad de fetch/blob — el
                navegador descarga el archivo directo. Respeta el filtro
                de estado activo. */}
            <a href={`/api/leads/export${status === "all" ? "" : `?status=${status}`}`} download>
              <Download className="size-4" /> Exportar CSV
            </a>
          </Button>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="NEW">Nuevos</SelectItem>
              <SelectItem value="CONTACTED">Contactados</SelectItem>
              <SelectItem value="ARCHIVED">Archivados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(l.createdAt).toLocaleString("es-DO", { dateStyle: "medium", timeStyle: "short" })}
                </TableCell>
                <TableCell className="font-medium">{l.name}</TableCell>
                <TableCell className="text-sm">
                  {l.email}
                  {l.phone && <div className="text-muted-foreground">{l.phone}</div>}
                </TableCell>
                <TableCell className="max-w-sm text-sm">
                  <div className="font-medium">{l.subject}</div>
                  <div className="truncate text-muted-foreground">{l.message}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right whitespace-nowrap">
                  {l.status !== "CONTACTED" && (
                    <Button size="sm" variant="ghost" onClick={() => setLeadStatus(l.id, "CONTACTED")}>
                      Contactado
                    </Button>
                  )}
                  {l.status !== "ARCHIVED" && (
                    <Button size="sm" variant="ghost" onClick={() => setLeadStatus(l.id, "ARCHIVED")}>
                      Archivar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                  Sin mensajes todavía.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {Math.max(1, Math.ceil(total / pageSize))}
        </span>
        <Button size="sm" variant="outline" disabled={page * pageSize >= total} onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
