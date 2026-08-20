// Crea (o actualiza la contraseña de) el primer usuario admin. No hay
// endpoint público de registro — el único acceso al panel se otorga así,
// desde el servidor, nunca desde el navegador.
//
// Uso en producción (una sola vez, vía terminal de Dokploy o docker exec):
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... node dist/scripts/seed.js
// En desarrollo: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run prisma:seed
import { prisma } from "../prisma.js";
import { hashPassword } from "../auth.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error("Definir ADMIN_EMAIL y ADMIN_PASSWORD como variables de entorno antes de correr el seed.");
  process.exit(1);
}

if (password.length < 12) {
  console.error("ADMIN_PASSWORD debe tener al menos 12 caracteres.");
  process.exit(1);
}

const passwordHash = await hashPassword(password);

await prisma.adminUser.upsert({
  where: { email },
  create: { email, passwordHash },
  update: { passwordHash },
});

console.log(`Admin listo: ${email}`);
await prisma.$disconnect();
