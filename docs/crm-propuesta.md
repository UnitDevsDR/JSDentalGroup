# De bandeja de mensajes a CRM

**Estado:** propuesta para discutir — nada de esto está construido.
**Fecha:** 22 de agosto de 2026
**Decisión que hay que tomar:** si se construye, y hasta dónde.

---

## 1. Resumen

El panel de leads hoy guarda mensajes del formulario de contacto y permite
marcarlos como contactados o archivados. Funciona para lo que es, pero no es un
CRM: no sabe quién es cada persona, no guarda qué se habló con ella, y no dice
si el esfuerzo de marketing está dando resultado.

Este documento reúne lo que la investigación señala como el núcleo de un CRM
—en general y específicamente para clínicas dentales—, lo compara con lo que ya
existe en el código, y propone un camino por fases.

**Recomendación:** construir la Fase 1 completa más el rastreo de origen de la
Fase 3. Dejar la Fase 4 (recordatorios y reactivación automática) para cuando el
equipo esté usando el panel a diario.

---

## 2. Qué hay hoy

En `backend/prisma/schema.prisma`:

| Modelo | Qué guarda |
| --- | --- |
| `Lead` | nombre, teléfono, correo, asunto, mensaje, origen, idioma, user-agent, estado |
| `AdminUser` | usuarios del panel (correo + contraseña) |
| `SiteSetting` | GTM ID y verificación de Search Console |

Los estados posibles de un lead son tres: `NEW`, `CONTACTED`, `ARCHIVED`.

**Lo que esto no permite hacer:**

- Saber que la persona que escribió hoy es la misma que escribió en marzo: cada
  envío del formulario crea una fila suelta, sin relación con las demás.
- Anotar qué pasó. No hay dónde escribir «la llamé, viene el martes».
- Saber quién de la clínica está dando seguimiento a cuál lead.
- Saber por qué se perdió un paciente que no volvió a responder.
- Saber cuánto se tarda la clínica en responder.
- Saber de qué página o campaña vino cada lead: el campo `source` existe pero
  siempre se guarda con el valor `"contactus"`.

---

## 3. Qué dice la investigación

### 3.1 Las tres funciones que de verdad se usan

Según datos de G2 citados por OnePageCRM, entre negocios pequeños las funciones
más usadas de un CRM son:

| Función | Uso |
| --- | --- |
| Gestión de contactos (la persona, no el mensaje) | 91% |
| Registro de interacciones (qué se habló y cuándo) | 82% |
| Gestión de embudo (en qué etapa va cada quien) | 79% |

El panel actual no tiene ninguna de las tres.

### 3.2 La velocidad de respuesta es lo que más pesa

- **78%** de los clientes compran a la primera empresa que les responde.
- Responder en **5 minutos** da alrededor de **21 veces** más probabilidad de
  calificar al prospecto que responder a los 30 minutos.
- Solo cerca del **0.1%** de los negocios responde dentro de esa ventana.

Ese último dato es el importante: es una ventaja que casi nadie está tomando, y
depende más de organización que de tecnología cara.

### 3.3 En clínicas dentales, el dinero medido está en el seguimiento

Casos publicados por proveedores del sector reportan:

- Ausencias a cita bajando de **18% a 11.9%** con recordatorios multicanal.
- **25%** menos ausencias con recordatorios automáticos.
- **35%** más citas repetidas enviando indicaciones post-tratamiento y
  recordatorios de próxima visita por WhatsApp.
- La reactivación de pacientes que no vienen hace ~18 meses es una práctica
  estándar en CRM dentales.

> Estas cifras vienen de material comercial de los propios proveedores, así que
> conviene leerlas como el techo de lo posible y no como lo que va a pasar.

### 3.4 El canal es WhatsApp

En América Latina WhatsApp reemplazó a la llamada telefónica como canal
principal de comunicación con pacientes. El sitio ya lo usa —el formulario abre
un mensaje de WhatsApp y hay un botón flotante—, pero el backend no registra
nada de eso.

---

## 4. El hueco de fondo

> Hoy `Lead` es **un mensaje**. En un CRM la pieza central es **una persona**.

Todo lo demás sale de ahí. Mientras la unidad sea el mensaje, no hay dónde
colgar el historial, ni el seguimiento, ni el motivo por el que alguien no
volvió. Por eso la Fase 1 es un cambio de modelo y no una pantalla nueva.

---

## 5. Propuesta por fases

Los tamaños son aproximados y sirven para comparar entre sí, no como
compromiso de fecha.

### Fase 1 — Convertirlo en un CRM de verdad · tamaño: grande

| Qué | Por qué |
| --- | --- |
| Modelo `Contact` (persona), con `Lead` colgando de él | Que dos mensajes de la misma persona queden juntos |
| Detección de duplicados por teléfono y correo al guardar | Evitar tres fichas de la misma señora |
| Modelo `Interaction`: llamada, WhatsApp, correo o nota, con autor y fecha | Es la función que el equipo va a usar todos los días (82% de uso) |
| Etapas reales en vez de tres estados | `nuevo → contactado → cita agendada → asistió → tratamiento aceptado → perdido` |
| Motivo de pérdida | Aprender por qué se cae la gente: precio, horario, ubicación, no contesta |
| Responsable asignado + fecha de próximo seguimiento | Sin fecha, el seguimiento no ocurre |

Toca: esquema de Prisma y migración, endpoints de leads, y una pantalla de ficha
de contacto en el panel.

### Fase 2 — Velocidad de respuesta · tamaño: mediano

| Qué | Por qué |
| --- | --- |
| Aviso inmediato a quien esté de turno, por WhatsApp | El correo no se lee en 5 minutos; WhatsApp sí. Hoy `nodemailer` ya avisa por correo |
| Guardar `firstResponseAt` en cada lead y mostrar la mediana en el panel | Lo que no se mide no mejora |
| Cola de vencidos: leads sin responder tras N minutos, arriba y en rojo | Convierte la meta en algo visible durante el día |

### Fase 3 — Origen y reportes · tamaño: chico (origen) / mediano (reportes)

| Qué | Por qué |
| --- | --- |
| Guardar de verdad el origen: página de servicio, parámetros UTM, referente | Saber si paga la pena la pauta de ortodoncia o la de implantología |
| Reportes: leads por semana, por servicio, conversión por etapa, tiempo de respuesta | `chart.tsx` ya está instalado en el panel y sin usar |

**El rastreo de origen es lo más barato de esta lista y no se puede recuperar
después:** cada semana sin ello es una semana de pauta que no se puede atribuir.

### Fase 4 — Recordatorios y reactivación · tamaño: grande

Tareas programadas para recordatorio de cita, higiene y reactivación a los 18
meses. De aquí salen las cifras de ausencias y citas repetidas de la sección
3.3, pero requiere además un modelo de citas y tratamientos que hoy no existe.

**No empezar por aquí.** Automatizar recordatorios sobre un CRM que nadie usa es
trabajo perdido.

---

## 6. Dos decisiones previas

### 6.1 WhatsApp: enlace o API

| | Enlace `wa.me` (lo de hoy) | WhatsApp Business API |
| --- | --- | --- |
| Costo | Gratis | Por conversación, vía proveedor aprobado por Meta |
| Mensajes automáticos | No | Sí |
| Registrar la respuesta del paciente | No | Sí |
| Puesta en marcha | Ninguna | Alta de proveedor y plantillas aprobadas |

**Sugerencia:** seguir con el enlace y registrar la interacción a mano en la
Fase 1. Pasar a la API solo cuando la Fase 4 lo justifique.

### 6.2 Esto pasa a ser información de salud

El campo `message` ya trae lo que el paciente escribió sobre su caso. Al agregar
etapas de tratamiento e historial, el panel se convierte en un registro clínico
ligero. Antes de construir conviene definir:

- Cuánto tiempo se conservan los datos y qué se borra.
- Consentimiento para mensajes de mercadeo, aparte del de la consulta.
- Roles en el panel: hoy **todo `AdminUser` ve y exporta todo**, y la
  exportación a CSV no deja rastro de quién la hizo.

---

## 7. Recomendación

1. **Fase 1 completa** — es el cimiento; sin ella lo demás no se sostiene.
2. **Rastreo de origen de la Fase 3** — barato ahora, imposible de reconstruir
   después.
3. **Fase 2 después**, cuando el equipo ya viva en el panel.
4. **Fase 4 al final**, y solo si las tres anteriores se están usando.

## 8. Qué no haría todavía

- Automatización de recordatorios antes de tener el CRM en uso.
- Integración con software de gestión de citas: primero hay que saber si el
  equipo adopta la herramienta.
- Puntaje automático de leads: con el volumen actual, leerlos uno por uno
  funciona mejor que cualquier fórmula.

---

## 9. Fuentes

- [OnePageCRM — 33 CRM features](https://www.onepagecrm.com/blog/crm-features/)
- [Practice by Numbers — Dental CRM features](https://practicenumbers.com/blog/essential-dental-crm-features/)
- [DoctorConnect — Patient recall, caso de estudio](https://doctorconnect.net/dental-practice-recall-case-study/)
- [Chili Piper — Speed-to-lead statistics](https://www.chilipiper.com/article/speed-to-lead-statistics)
- [LeadResponse — Speed-to-lead 2026](https://leadresponse.co/blog/speed-to-lead-statistics)
- [DentinCloud — WhatsApp Business para clínicas dentales](https://www.dentincloud.com/en/blog/whatsapp-business-dental-clinics-guide)
- [Mintec — WhatsApp + CRM en LATAM](https://mintec.co/blog/whatsapp-crm-latam-comparativa/)
