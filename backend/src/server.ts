import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
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

// CORS: solo el sitio público y el propio panel pueden llamar la API.
// credentials:true porque el panel admin usa cookie de sesión.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error("Origen no permitido"));
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: "100kb" })); // un mensaje de contacto nunca necesita más

// límite general de peticiones por IP, capa adicional además de los
// límites específicos de /api/leads y /api/auth/login
app.use("/api", rateLimit({ windowMs: 60 * 1000, limit: 60, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/leads", leadsRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

// Panel de administración: HTML/CSS/JS plano, servido por este mismo
// proceso (sin build aparte, sin otro servicio que mantener). CSP propia,
// estricta, solo para estas páginas.
app.use(
  "/admin",
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameAncestors: ["'self'"],
      baseUri: ["'self'"],
    },
  }),
  express.static(path.join(__dirname, "../public/admin")),
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
