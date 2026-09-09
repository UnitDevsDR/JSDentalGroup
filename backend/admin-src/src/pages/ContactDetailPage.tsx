import { AlertTriangle, ArrowLeft, Mail, MessageSquare, Phone, Trash2, User, StickyNote } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useApiError, useCurrentUser } from "@/lib/auth";
import {
  CHANNELS,
  CHANNEL_LABEL,
  LOSS_LABEL,
  LOSS_REASONS,
  STAGES,
  STAGE_CLASS,
  STAGE_LABEL,
  aISODesdeInput,
  aValorDeInput,
  formatDateTime,
  type Colega,
  type Contact,
  type ContactStage,
  type Interaction,
  type InteractionChannel,
  type LossReason,
} from "@/lib/contacts";
import { originRows, type Lead } from "@/lib/leads";
import { cn } from "@/lib/utils";

/** Ninguna opción de un `<Select>` puede tener valor vacío, así que «sin
 *  responsable» necesita un valor propio. */
const SIN_RESPONSABLE = "__nadie__";

interface Ficha extends Contact {
  leads: Lead[];
  interactions: Interaction[];
  possibleDuplicates: { id: string; name: string; email: string | null }[];
}

const CHANNEL_ICON: Record<InteractionChannel, typeof Phone> = {
  CALL: Phone,
  WHATSAPP: MessageSquare,
  EMAIL: Mail,
  IN_PERSON: User,
  NOTE: StickyNote,
};

/** Mensajes y anotaciones en una sola cuerda, del más reciente al más viejo.
 *  Separarlos en dos listas obligaba a saltar de una a otra para reconstruir
 *  qué pasó, que es justo lo que la ficha viene a resolver. */
type Entrada =
  | { tipo: "mensaje"; fecha: string; lead: Lead }
  | { tipo: "anotacion"; fecha: string; interaction: Interaction };

function construirHistoria(ficha: Ficha): Entrada[] {
  const entradas: Entrada[] = [
    ...ficha.leads.map((lead) => ({ tipo: "mensaje" as const, fecha: lead.createdAt, lead })),
    ...ficha.interactions.map((i) => ({ tipo: "anotacion" as const, fecha: i.occurredAt, interaction: i })),
  ];
  return entradas.sort((a, b) => +new Date(b.fecha) - +new Date(a.fecha));
}

export default function ContactDetailPage() {
  const { id = "" } = useParams();
  const [ficha, setFicha] = useState<Ficha | null>(null);
  const [colegas, setColegas] = useState<Colega[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const onApiError = useApiError();
  const usuario = useCurrentUser();

  const cargar = () =>
    api<Ficha>(`/contacts/${id}`)
      .then((d) => {
        setFicha(d);
        setError(null);
      })
      .catch((e) => setError(onApiError(e, "No se pudo cargar la ficha.")))
      .finally(() => setLoading(false));

  useEffect(() => {
    cargar();
    api<{ items: Colega[] }>("/auth/users")
      .then((d) => setColegas(d.items))
      .catch(() => setColegas([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /** Guarda un cambio suelto de la ficha y refresca con lo que devuelve el
   *  servidor: es él quien decide, por ejemplo, si limpia el motivo de
   *  pérdida al sacarla de «Perdido». */
  const guardar = async (cambio: Record<string, unknown>) => {
    setGuardando(true);
    try {
      const actualizada = await api<Contact>(`/contacts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(cambio),
      });
      setFicha((f) => (f ? { ...f, ...actualizada } : f));
      setError(null);
    } catch (e) {
      setError(onApiError(e, "No se pudo guardar el cambio."));
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 p-4 md:p-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-40 w-full max-w-2xl" />
        <Skeleton className="h-64 w-full max-w-2xl" />
      </div>
    );
  }

  if (!ficha) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">{error ?? "Esta ficha no existe."}</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/">
            <ArrowLeft className="size-4" /> Volver a contactos
          </Link>
        </Button>
      </div>
    );
  }

  const historia = construirHistoria(ficha);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/">
          <ArrowLeft className="size-4" /> Contactos
        </Link>
      </Button>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-semibold text-navy">{ficha.name}</h1>
        <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", STAGE_CLASS[ficha.stage])}>
          {STAGE_LABEL[ficha.stage]}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {ficha.email && (
          <a href={`mailto:${ficha.email}`} className="break-all text-teal-text underline-offset-4 hover:underline">
            {ficha.email}
          </a>
        )}
        {ficha.phone && (
          <a href={`tel:${ficha.phone}`} className="text-teal-text underline-offset-4 hover:underline">
            {ficha.phone}
          </a>
        )}
        <span className="text-muted-foreground">
          Primer mensaje: {formatDateTime(ficha.firstSeenAt)}
        </span>
      </div>

      {/* Las fichas no se unen solas por teléfono (en una casa se comparte el
          número): se avisa y decide quien conoce a los pacientes. */}
      {ficha.possibleDuplicates.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <AlertTriangle className="size-4 shrink-0" />
          <span>Mismo teléfono que:</span>
          {ficha.possibleDuplicates.map((d) => (
            <Link key={d.id} to={`/contactos/${d.id}`} className="font-medium underline underline-offset-4">
              {d.name}
            </Link>
          ))}
          <span className="text-amber-900/70">— puede ser la misma persona o alguien de la misma casa.</span>
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="order-2 space-y-4 lg:order-1">
          <ComposerAnotacion contactId={ficha.id} onGuardada={cargar} />
          <Historia historia={historia} contactId={ficha.id} usuarioId={usuario?.id ?? null} onBorrada={cargar} />
        </div>

        <Card className="order-1 h-fit lg:order-2">
          <CardHeader>
            <CardTitle className="font-heading text-base text-navy">Seguimiento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="etapa">Etapa</Label>
              <Select
                value={ficha.stage}
                onValueChange={(v) => guardar({ stage: v as ContactStage })}
                disabled={guardando}
              >
                <SelectTrigger id="etapa" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAGES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STAGE_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* el motivo solo aparece cuando hay algo que explicar; el
                backend lo limpia solo al salir de «Perdido» */}
            {ficha.stage === "LOST" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="motivo">Motivo</Label>
                  <Select
                    value={ficha.lossReason ?? ""}
                    onValueChange={(v) => guardar({ lossReason: v as LossReason })}
                    disabled={guardando}
                  >
                    <SelectTrigger id="motivo" className="w-full">
                      <SelectValue placeholder="¿Por qué se cayó?" />
                    </SelectTrigger>
                    <SelectContent>
                      {LOSS_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {LOSS_LABEL[r]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <NotaDePerdida valor={ficha.lossNote ?? ""} onGuardar={(lossNote) => guardar({ lossNote })} />
              </>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="responsable">Responsable</Label>
              <Select
                value={ficha.ownerId ?? SIN_RESPONSABLE}
                onValueChange={(v) => guardar({ ownerId: v === SIN_RESPONSABLE ? null : v })}
                disabled={guardando}
              >
                <SelectTrigger id="responsable" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_RESPONSABLE}>Sin asignar</SelectItem>
                  {colegas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="seguimiento">Próximo seguimiento</Label>
              <Input
                id="seguimiento"
                type="date"
                value={aValorDeInput(ficha.nextFollowUpAt)}
                onChange={(e) => guardar({ nextFollowUpAt: aISODesdeInput(e.target.value) })}
                disabled={guardando}
              />
              <p className="text-xs text-muted-foreground">Sin fecha, el seguimiento no ocurre.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/** La nota de pérdida se guarda al salir del campo y no en cada tecla: es
 *  texto libre y no hace falta una petición por letra. */
function NotaDePerdida({ valor, onGuardar }: { valor: string; onGuardar: (v: string) => void }) {
  const [texto, setTexto] = useState(valor);
  useEffect(() => setTexto(valor), [valor]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor="lossNote">Detalle</Label>
      <Textarea
        id="lossNote"
        rows={2}
        placeholder="Qué pasó exactamente"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onBlur={() => texto !== valor && onGuardar(texto)}
      />
    </div>
  );
}

/** Anotar qué se habló. Va arriba de la historia y siempre abierto: es lo
 *  que el equipo hace todos los días, no algo que haya que ir a buscar. */
function ComposerAnotacion({ contactId, onGuardada }: { contactId: string; onGuardada: () => void }) {
  const [channel, setChannel] = useState<InteractionChannel>("CALL");
  const [body, setBody] = useState("");
  const [fecha, setFecha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onApiError = useApiError();

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    setEnviando(true);
    try {
      await api(`/contacts/${contactId}/interactions`, {
        method: "POST",
        body: JSON.stringify({
          channel,
          body,
          // sin fecha se entiende «ahora»; ponerla sirve para anotar algo de
          // ayer sin que la ficha salte al tope de la lista
          ...(fecha ? { occurredAt: aISODesdeInput(fecha) } : {}),
        }),
      });
      setBody("");
      setFecha("");
      setError(null);
      onGuardada();
    } catch (err) {
      setError(onApiError(err, "No se pudo guardar la anotación."));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base text-navy">Anotar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={enviar} className="space-y-3">
          <Textarea
            rows={3}
            placeholder="La llamé, viene el martes a las 3."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-label="Qué se habló"
          />
          <div className="flex flex-wrap items-center gap-2">
            <Select value={channel} onValueChange={(v) => setChannel(v as InteractionChannel)}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {CHANNEL_LABEL[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              className="w-40"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              aria-label="Cuándo ocurrió (si no fue hoy)"
            />
            <Button
              type="submit"
              size="sm"
              disabled={enviando || !body.trim()}
              className="bg-teal-strong hover:bg-teal-strong/90"
            >
              Guardar
            </Button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

/** Todo lo que ha pasado con esta persona, del último para atrás. */
function Historia({
  historia,
  contactId,
  usuarioId,
  onBorrada,
}: {
  historia: Entrada[];
  contactId: string;
  usuarioId: string | null;
  onBorrada: () => void;
}) {
  const onApiError = useApiError();
  const [error, setError] = useState<string | null>(null);

  const borrar = async (interactionId: string) => {
    try {
      await api(`/contacts/${contactId}/interactions/${interactionId}`, { method: "DELETE" });
      setError(null);
      onBorrada();
    } catch (e) {
      setError(onApiError(e, "No se pudo borrar la anotación."));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-base text-navy">Historia</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <p role="alert" className="mb-3 text-sm text-destructive">
            {error}
          </p>
        )}
        <ol className="space-y-5">
          {historia.map((entrada) =>
            entrada.tipo === "mensaje" ? (
              <MensajeEnHistoria key={`l-${entrada.lead.id}`} lead={entrada.lead} />
            ) : (
              <AnotacionEnHistoria
                key={`i-${entrada.interaction.id}`}
                interaction={entrada.interaction}
                puedeBorrar={entrada.interaction.authorId === usuarioId}
                onBorrar={() => borrar(entrada.interaction.id)}
              />
            ),
          )}
          {historia.length === 0 && <li className="text-sm text-muted-foreground">Todavía no hay nada anotado.</li>}
        </ol>
      </CardContent>
    </Card>
  );
}

function MensajeEnHistoria({ lead }: { lead: Lead }) {
  const origen = originRows(lead);
  return (
    <li className="border-l-2 border-teal pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="font-medium text-navy">{lead.subject}</p>
        <span className="text-xs text-muted-foreground">{formatDateTime(lead.createdAt)}</span>
      </div>
      <p className="mt-1 text-xs font-medium text-teal-text">Mensaje del formulario</p>
      {/* whitespace-pre-line: el mensaje va tal como lo escribió la persona */}
      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{lead.message}</p>
      {origen.length > 0 && (
        <p className="mt-2 text-xs text-muted-foreground/80">
          {origen.map((r) => `${r.label}: ${r.value}`).join(" · ")}
        </p>
      )}
    </li>
  );
}

function AnotacionEnHistoria({
  interaction,
  puedeBorrar,
  onBorrar,
}: {
  interaction: Interaction;
  puedeBorrar: boolean;
  onBorrar: () => void;
}) {
  const Icono = CHANNEL_ICON[interaction.channel];
  return (
    <li className="group border-l-2 border-border pl-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <p className="flex items-center gap-1.5 text-sm font-medium text-navy">
          <Icono className="size-3.5 text-muted-foreground" />
          {CHANNEL_LABEL[interaction.channel]}
        </p>
        <span className="text-xs text-muted-foreground">{formatDateTime(interaction.occurredAt)}</span>
      </div>
      <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{interaction.body}</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-xs text-muted-foreground/80">{interaction.author?.email ?? "usuario eliminado"}</span>
        {/* solo su autor, y el backend además exige que sea reciente */}
        {puedeBorrar && (
          <button
            type="button"
            onClick={onBorrar}
            className="flex items-center gap-1 text-xs text-muted-foreground/80 hover:text-destructive"
          >
            <Trash2 className="size-3" /> Borrar
          </button>
        )}
      </div>
    </li>
  );
}
