import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env, allowedOrigins } from "./env.js";
import { leadsRouter } from "./routes/leads.js";
import { authRouter } from "./routes/auth.js";
import { settingsRouter } from "./routes/settings.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Detrás de Traefik/Dokploy: necesario para que express-rate-limit y los
// logs vean la IP real del visitante, no la del proxy interno
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false, // este servicio no sirve HTML de negocio, solo el panel estático propio (ver abajo)
    crossOriginResourcePolicy: { policy: "same-site" },
  }),
);

// gzip para todo lo que sale: el bundle del panel pesa ~450 KB en crudo y
// ~130 KB comprimido. El sitio público lo resuelve Nginx (gzip on), pero
// este servicio sirve /admin él mismo, sin ese Nginx delante.
app.use(compression());

app.use(cookieParser());
app.use(express.json({ limit: "100kb" })); // un mensaje de contacto nunca necesita más

// CORS solo bajo /api: es ahí donde existe un origen ajeno real (el sitio
// público llamando a este backend). El panel /admin se sirve desde este
// mismo servidor — sus propios assets (Vite los marca crossorigin) NO
// deben pasar por esta política o el navegador los bloquea con 500/CORS
// aunque sean same-origin.
app.use(
  "/api",
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Origen no permitido"));
    },
    credentials: true,
  }),
);

// límite general de peticiones por IP, capa adicional además de los
// límites específicos de /api/leads y /api/auth/login
app.use("/api", rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leads", leadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

// Panel de administración: SPA de React (shadcn/ui + bloques de
// shadcnblocks), compilada con Vite en backend/admin-src y servida por
// este mismo proceso — sin otro servicio aparte que mantener. CSP propia,
// estricta, solo para estas páginas.
// style-src necesita 'unsafe-inline': el sidebar de shadcn/ui y los
// popovers de Radix fijan variables CSS (--sidebar-width, posición de
// tooltips) por JS en cada render — igual que GSAP en el sitio público,
// ningún hash lo cubre. Nada de contenido de usuario llega a esa ruta.
const ADMIN_DIR = path.join(__dirname, "../public/admin");
app.use(
  "/admin",
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
    },
  }),
  express.static(ADMIN_DIR, {
    setHeaders: (res, filePath) => {
      if (filePath.includes(`${path.sep}assets${path.sep}`)) {
        // Vite les pone hash en el nombre: un archivo con este nombre nunca
        // cambia de contenido, así que el navegador puede guardárselo sin
        // revalidar nunca
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else if (filePath.endsWith(".html")) {
        // el HTML sí cambia (apunta al bundle nuevo de cada build)
        res.setHeader("Cache-Control", "no-cache");
      } else {
        // logo y favicon: sin hash en el nombre, un día es suficiente
        res.setHeader("Cache-Control", "public, max-age=86400");
      }
    },
  }),
);
// React Router lleva el ruteo del lado del cliente: cualquier /admin/* que
// no sea un archivo real cae al mismo index.html
app.get(/^\/admin(\/.*)?$/, (_req, res) =>
  res.sendFile(path.join(ADMIN_DIR, "index.html"), { headers: { "Cache-Control": "no-cache" } }),
);

app.use((req, res) => res.status(404).json({ error: "No encontrado" }));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

app.listen(env.PORT, () => {
  console.log(`jsdental-backend escuchando en :${env.PORT}`);
});
