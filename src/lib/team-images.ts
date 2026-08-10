// Mapa clave → imagen de src/assets/img/team (clave = nombre de archivo sin extensión)
const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/img/team/*', {
  eager: true,
});

export const TEAM_IMAGES: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(modules).map(([path, mod]) => [
    (path.split('/').pop() ?? '').replace(/\.\w+$/, ''),
    mod.default,
  ]),
);
