// Detalle de un lead. Existe sobre todo por la tabla: ahí el mensaje se
// recorta a una línea y no había forma de leerlo completo desde la
// computadora — que es justo para lo que existe el panel. En el teléfono
// las tarjetas despliegan el mensaje en su sitio y no hace falta abrir esto.
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { STATUS_LABEL, STATUS_VARIANT, formatDate, originRows, type Lead } from "@/lib/leads";

/** De dónde vino el lead. Va al final y en letra chica: es contexto para
 *  quien contesta y para saber qué pauta funciona, no lo primero que hay que
 *  leer. Se oculta entero cuando no hay dato — los leads viejos no lo tienen. */
function OriginBlock({ lead }: { lead: Lead }) {
  const rows = originRows(lead);
  if (rows.length === 0) return null;

  return (
    <div className="space-y-1 border-t pt-3 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Origen</p>
      {rows.map((row) => (
        <p key={row.label} className="break-all">
          <span className="text-foreground/70">{row.label}:</span> {row.value}
        </p>
      ))}
    </div>
  );
}

export function LeadDetailDialog({
  lead,
  onClose,
  onSetStatus,
}: {
  /** null = cerrado */
  lead: Lead | null;
  onClose: () => void;
  onSetStatus: (id: string, next: Lead["status"]) => void;
}) {
  return (
    <Dialog open={lead !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        {lead && (
          <>
            <DialogHeader>
              <DialogTitle className="font-heading text-navy">{lead.name}</DialogTitle>
              <DialogDescription>{formatDate(lead.createdAt)}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={STATUS_VARIANT[lead.status]}>{STATUS_LABEL[lead.status]}</Badge>
              </div>

              <div className="space-y-1">
                <a href={`mailto:${lead.email}`} className="block break-all text-teal-text underline-offset-4 hover:underline">
                  {lead.email}
                </a>
                {lead.phone && (
                  <a href={`tel:${lead.phone}`} className="block text-teal-text underline-offset-4 hover:underline">
                    {lead.phone}
                  </a>
                )}
              </div>

              <div className="space-y-1">
                <p className="font-medium">{lead.subject}</p>
                {/* whitespace-pre-line: el mensaje viene tal cual lo escribió
                    el visitante, con sus saltos de línea */}
                <p className="whitespace-pre-line text-muted-foreground">{lead.message}</p>
              </div>

              <OriginBlock lead={lead} />
            </div>

            <DialogFooter className="gap-2 sm:justify-start">
              {lead.status !== "CONTACTED" && (
                <Button size="sm" variant="outline" onClick={() => onSetStatus(lead.id, "CONTACTED")}>
                  Marcar contactado
                </Button>
              )}
              {lead.status !== "ARCHIVED" && (
                <Button size="sm" variant="outline" onClick={() => onSetStatus(lead.id, "ARCHIVED")}>
                  Archivar
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
