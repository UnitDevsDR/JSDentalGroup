// Crea (o actualiza la contraseña de) un usuario del panel. No hay endpoint
// público de registro — el único acceso al panel se otorga así, desde el
// servidor, nunca desde el navegador.
//
// Uso en producción (vía terminal de Dokploy o docker exec):
//   ADMIN_EMAIL=... ADMIN_PASSWORD=... node dist/scripts/seed.js
// En desarrollo: ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run seed:dev
//
// ADMIN_ROLE=STAFF crea a alguien de recepción: atiende leads como todos,
// pero no exporta la base ni toca los ajustes del sitio. Sin ADMIN_ROLE se
// crea un administrador. Mientras no exista una pantalla para gestionar
// usuarios, este script es la única forma de cambiarle el rol a alguien —
// se le vuelve a correr con el mismo correo.
import { prisma } from "../prisma.js";
import { hashPassword } from "../auth.js";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const role = process.env.ADMIN_ROLE ?? "ADMIN";

if (!email || !password) {
  console.error("Definir ADMIN_EMAIL y ADMIN_PASSWORD como variables de entorno antes de correr el seed.");
  process.exit(1);
}

if (password.length < 12) {
  console.error("ADMIN_PASSWORD debe tener al menos 12 caracteres.");
  process.exit(1);
}

if (role !== "ADMIN" && role !== "STAFF") {
  console.error("ADMIN_ROLE debe ser ADMIN o STAFF.");
  process.exit(1);
}

const passwordHash = await hashPassword(password);

await prisma.adminUser.upsert({
  where: { email },
  create: { email, passwordHash, role },
  update: { passwordHash, role },
});

console.log(`Usuario listo: ${email} (${role})`);
await prisma.$disconnect();
