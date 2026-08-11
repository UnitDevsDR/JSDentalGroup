// Mapa slug → icono 3D de la especialidad (assets reales del sitio de la clínica)
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/img/services/iconos-3d/*',
  { eager: true },
);

export const SERVICE_ICONS: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    (path.split('/').pop() ?? '').replace(/\.\w+$/, ''),
    mod.default,
  ]),
);
