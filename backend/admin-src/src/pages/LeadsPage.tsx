import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { LeadDetailDialog } from "@/components/LeadDetailDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { useApiError } from "@/lib/auth";
import { STATUS_LABEL, STATUS_VARIANT, formatDate, formatDateParts, type Lead } from "@/lib/leads";
import { cn } from "@/lib/utils";

/** A partir de aquí el mensaje se recorta en la tarjeta y se ofrece desplegarlo. */
const MESSAGE_PREVIEW_CHARS = 140;

/** Las dos acciones posibles sobre un lead, compartidas por la tabla y las
 *  tarjetas — siempre queda al menos una visible (un lead nunca está a la vez
 *  contactado y archivado). */
function StatusActions({
  status,
  onSet,
  variant = "ghost",
  className,
}: {
  status: Lead["status"];
  onSet: (next: Lead["status"]) => void;
  variant?: "ghost" | "outline";
  className?: string;
}) {
  return (
    <>
      {status !== "CONTACTED" && (
        <Button size="sm" variant={variant} className={className} onClick={() => onSet("CONTACTED")}>
          Contactado
        </Button>
      )}
      {status !== "ARCHIVED" && (
        <Button size="sm" variant={variant} className={className} onClick={() => onSet("ARCHIVED")}>
          Archivar
        </Button>
      )}
    </>
  );
}

/** Mientras carga: el mismo esqueleto en las dos vistas, para que la pantalla
 *  no quede en blanco (en el teléfono, con datos móviles, se notaba bastante). */
function LoadingCards() {
  return (
    <ul className="space-y-3 lg:hidden">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="space-y-3 rounded-lg border bg-card p-4">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-9 w-full" />
        </li>
      ))}
    </ul>
  );
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          {Array.from({ length: 6 }).map((__, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  // ids con el mensaje desplegado en la vista de tarjetas
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // lead abierto en el diálogo de detalle (null = cerrado)
  const [selected, setSelected] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const onApiError = useApiError();
  const pageSize = 25;

  /** `silent`: recarga sin esqueleto, para después de cambiar un estado — la
   *  lista ya está en pantalla y hacerla parpadear se ve peor que esperar. */
  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    const q = status === "all" ? `?page=${page}` : `?page=${page}&status=${status}`;
    try {
      const data = await api<{ items: Lead[]; total: number }>(`/leads${q}`);
      setItems(data.items);
      setTotal(data.total);
      setError(null);
    } catch (e) {
      setError(onApiError(e, "No se pudieron cargar los leads."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  const setLeadStatus = async (id: string, next: Lead["status"]) => {
    try {
      await api(`/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    } catch (e) {
      return setError(onApiError(e, "No se pudo cambiar el estado."));
    }
    // el detalle se cierra: el lead que muestra ya quedó viejo, y cambiarle
    // el estado es justo la señal de que se terminó con él
    setSelected(null);
    load(true);
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const empty = items.length === 0;

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* en móvil el título va arriba y los controles debajo a lo ancho:
          en una sola fila el Select quedaba estrujado contra el botón */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <SelectTrigger className="flex-1 sm:w-40 sm:flex-none">
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

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {/* Tarjetas en móvil y tablet, tabla desde lg. El corte va por CSS y no por
          useIsMobile a propósito: el hook devuelve false en el primer render
          (mide después de montar), así que la tabla aparecería un instante
          en el teléfono antes de saltar a tarjetas. */}
      {loading ? (
        <LoadingCards />
      ) : (
        <ul className="space-y-3 lg:hidden">
          {items.map((l) => {
            const isOpen = expanded.has(l.id);
            return (
              <li key={l.id} className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(l.createdAt)}</p>
                  </div>
                  <Badge variant={STATUS_VARIANT[l.status]} className="shrink-0">
                    {STATUS_LABEL[l.status]}
                  </Badge>
                </div>

                {/* enlaces, no texto plano: en el teléfono responder es la acción
                    principal y así se abre el correo o el marcador de una vez */}
                <div className="mt-3 space-y-1 text-sm">
                  <a href={`mailto:${l.email}`} className="block truncate text-teal-text underline-offset-4 hover:underline">
                    {l.email}
                  </a>
                  {l.phone && (
                    <a href={`tel:${l.phone}`} className="block text-teal-text underline-offset-4 hover:underline">
                      {l.phone}
                    </a>
                  )}
                </div>

                <div className="mt-3 text-sm">
                  <p className="font-medium">{l.subject}</p>
                  <p className={cn("whitespace-pre-line text-muted-foreground", !isOpen && "line-clamp-3")}>
                    {l.message}
                  </p>
                  {l.message.length > MESSAGE_PREVIEW_CHARS && (
                    <button
                      type="button"
                      onClick={() => toggleExpanded(l.id)}
                      className="mt-1 text-xs font-medium text-teal-text underline-offset-4 hover:underline"
                    >
                      {isOpen ? "Ver menos" : "Ver mensaje completo"}
                    </button>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <StatusActions
                    status={l.status}
                    onSet={(next) => setLeadStatus(l.id, next)}
                    variant="outline"
                    className="flex-1"
                  />
                </div>
              </li>
            );
          })}
          {empty && (
            <li className="rounded-lg border bg-card py-10 text-center text-muted-foreground">Sin mensajes todavía.</li>
          )}
        </ul>
      )}

      <div className="hidden rounded-md border bg-card lg:block">
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
            {loading && <LoadingRows />}
            {!loading &&
              items.map((l) => (
                // la fila entera abre el detalle; el nombre es un botón real
                // para que también se llegue con el teclado
                <TableRow key={l.id} onClick={() => setSelected(l)} className="cursor-pointer">
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{formatDateParts(l.createdAt).date}</div>
                    <div className="text-xs">{formatDateParts(l.createdAt).time}</div>
                  </TableCell>
                  <TableCell className="min-w-32 font-medium whitespace-normal">
                    <button
                      type="button"
                      className="text-left underline-offset-4 hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(l);
                      }}
                    >
                      {l.name}
                    </button>
                  </TableCell>
                  <TableCell className="min-w-40 text-sm break-all whitespace-normal">
                    {l.email}
                    {l.phone && <div className="whitespace-nowrap text-muted-foreground">{l.phone}</div>}
                  </TableCell>
                  <TableCell className="w-full max-w-0 text-sm">
                    <div className="truncate font-medium">{l.subject}</div>
                    <div className="truncate text-muted-foreground">{l.message}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[l.status]}>{STATUS_LABEL[l.status]}</Badge>
                  </TableCell>
                  {/* las acciones no deben abrir el detalle al pasar el clic a la fila */}
                  <TableCell
                    className="flex flex-wrap justify-end gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <StatusActions status={l.status} onSet={(next) => setLeadStatus(l.id, next)} />
                  </TableCell>
                </TableRow>
              ))}
            {!loading && empty && (
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

      <LeadDetailDialog lead={selected} onClose={() => setSelected(null)} onSetStatus={setLeadStatus} />
    </div>
  );
}
