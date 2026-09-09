import { Download, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/lib/api";
import { useApiError, useIsAdmin } from "@/lib/auth";
import {
  STAGES,
  STAGE_CLASS,
  STAGE_LABEL,
  estaVencido,
  formatDay,
  hace,
  type ContactRow,
} from "@/lib/contacts";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 25;

/** La etiqueta de etapa, que es lo que se lee primero en cada fila. */
function EtapaBadge({ contact }: { contact: ContactRow }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        STAGE_CLASS[contact.stage],
      )}
    >
      {STAGE_LABEL[contact.stage]}
    </span>
  );
}

/** La fecha de seguimiento, en rojo si ya pasó: es la señal de «esto es de
 *  hoy» que hace que la cola de vencidos sirva de algo. */
function Seguimiento({ contact }: { contact: ContactRow }) {
  if (!contact.nextFollowUpAt) return <span className="text-muted-foreground">—</span>;
  const vencido = estaVencido(contact);
  return (
    <span className={cn("whitespace-nowrap", vencido ? "font-medium text-destructive" : "text-muted-foreground")}>
      {formatDay(contact.nextFollowUpAt)}
    </span>
  );
}

/** Las tres vistas con las que se trabaja el día. */
const VISTAS = [
  { id: "todos", label: "Todos" },
  { id: "mios", label: "Míos" },
  { id: "vencidos", label: "Por atender" },
] as const;
type Vista = (typeof VISTAS)[number]["id"];

export default function ContactsPage() {
  const [items, setItems] = useState<ContactRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [vista, setVista] = useState<Vista>("todos");
  const [stage, setStage] = useState("all");
  const [busqueda, setBusqueda] = useState("");
  // lo que de verdad se manda al backend: se actualiza un poco después de
  // teclear, para no pedir una búsqueda por cada letra
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onApiError = useApiError();
  const esAdmin = useIsAdmin();

  useEffect(() => {
    const t = setTimeout(() => {
      setQ(busqueda.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  useEffect(() => {
    const params = new URLSearchParams({ page: String(page) });
    if (stage !== "all") params.set("stage", stage);
    if (vista === "mios") params.set("ownerId", "mios");
    if (vista === "vencidos") params.set("vencidos", "1");
    if (q) params.set("q", q);

    setLoading(true);
    api<{ items: ContactRow[]; total: number }>(`/contacts?${params}`)
      .then((d) => {
        setItems(d.items);
        setTotal(d.total);
        setError(null);
      })
      .catch((e) => setError(onApiError(e, "No se pudieron cargar los contactos.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, vista, stage, q]);

  const vacio = items.length === 0;

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-heading text-2xl font-semibold text-navy">Contactos</h1>
        {esAdmin && (
          <Button asChild variant="outline" size="sm">
            {/* sigue exportando los mensajes, que es lo que la clínica ya
                tenía; queda registrado (ver Ajustes) */}
            <a href="/api/leads/export" download>
              <Download className="size-4" /> Exportar mensajes
            </a>
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nombre, correo o teléfono"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar contactos"
          />
        </div>
        <div className="flex items-center gap-2">
          {/* botones y no pestañas: en el teléfono caben los tres en una fila */}
          {VISTAS.map((v) => (
            <Button
              key={v.id}
              size="sm"
              variant={vista === v.id ? "default" : "outline"}
              className={cn("flex-1 lg:flex-none", vista === v.id && "bg-navy hover:bg-navy/90")}
              onClick={() => {
                setVista(v.id);
                setPage(1);
              }}
            >
              {v.label}
            </Button>
          ))}
          <Select
            value={stage}
            onValueChange={(v) => {
              setStage(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las etapas</SelectItem>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {STAGE_LABEL[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Tarjetas en móvil, tabla desde lg — mismo corte por CSS que tenía la
          bandeja de mensajes, para que en el teléfono no aparezca un instante
          la tabla antes de saltar a tarjetas. */}
      {loading ? (
        <ul className="space-y-3 lg:hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <li key={i} className="space-y-3 rounded-lg border bg-card p-4">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-3 w-4/5" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="space-y-3 lg:hidden">
          {items.map((c) => (
            <li key={c.id} className="rounded-lg border bg-card shadow-sm">
              <Link to={`/contactos/${c.id}`} className="block p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.email ?? c.phone ?? "—"}</p>
                  </div>
                  <EtapaBadge contact={c} />
                </div>
                <p className="mt-2 truncate text-sm text-muted-foreground">
                  {c.leads[0]?.subject ?? "Sin mensajes"}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{hace(c.lastActivityAt)}</span>
                  <span>
                    {c._count.leads} {c._count.leads === 1 ? "mensaje" : "mensajes"}
                  </span>
                  {c.owner && <span className="truncate">{c.owner.email}</span>}
                  {c.nextFollowUpAt && (
                    <span className={cn(estaVencido(c) && "font-medium text-destructive")}>
                      seguimiento {formatDay(c.nextFollowUpAt)}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
          {vacio && (
            <li className="rounded-lg border bg-card py-10 text-center text-muted-foreground">
              No hay contactos que mostrar.
            </li>
          )}
        </ul>
      )}

      <div className="hidden rounded-md border bg-card lg:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Último mensaje</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Etapa</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead>Seguimiento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              items.map((c) => (
                <TableRow key={c.id} className="cursor-pointer">
                  <TableCell className="min-w-32 font-medium whitespace-normal">
                    <Link to={`/contactos/${c.id}`} className="underline-offset-4 hover:underline">
                      {c.name}
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-40 text-sm break-all whitespace-normal text-muted-foreground">
                    {c.email}
                    {c.phone && <div className="whitespace-nowrap">{c.phone}</div>}
                  </TableCell>
                  <TableCell className="w-full max-w-0 text-sm">
                    <div className="truncate">{c.leads[0]?.subject ?? "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {c._count.leads} {c._count.leads === 1 ? "mensaje" : "mensajes"}
                      {c._count.interactions > 0 &&
                        ` · ${c._count.interactions} ${c._count.interactions === 1 ? "anotación" : "anotaciones"}`}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                    {hace(c.lastActivityAt)}
                  </TableCell>
                  <TableCell>
                    <EtapaBadge contact={c} />
                  </TableCell>
                  <TableCell className="text-sm break-all text-muted-foreground">{c.owner?.email ?? "—"}</TableCell>
                  <TableCell className="text-sm">
                    <Seguimiento contact={c} />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && vacio && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No hay contactos que mostrar.
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
          Página {page} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}
        </span>
        <Button size="sm" variant="outline" disabled={page * PAGE_SIZE >= total} onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
