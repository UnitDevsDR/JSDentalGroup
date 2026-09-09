import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, AuthError } from "./api";

export interface AdminUser {
  id: string;
  email: string;
  /** ADMIN exporta la base y toca los ajustes; STAFF atiende leads */
  role: "ADMIN" | "STAFF";
}

/** El usuario de la sesión, para las pantallas de dentro. Lo pone App tras
 *  resolver /auth/me, así que ninguna pantalla vuelve a pedirlo. */
export const SessionContext = createContext<AdminUser | null>(null);

export function useCurrentUser(): AdminUser | null {
  return useContext(SessionContext);
}

/** Solo para decidir qué mostrar. Quien manda es el backend: las rutas de
 *  exportación y ajustes comprueban el rol en la base en cada request, así
 *  que esconder un botón aquí es comodidad, nunca la barrera. */
export function useIsAdmin(): boolean {
  return useCurrentUser()?.role === "ADMIN";
}

/** Sesión actual: null mientras carga, false si no hay sesión, el usuario si sí. */
export function useSession() {
  const [user, setUser] = useState<AdminUser | null | false>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api<AdminUser>("/auth/me")
      .then(setUser)
      .catch((e) => setUser(e instanceof AuthError ? false : false))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}

/**
 * Qué hacer con un error del API dentro de una pantalla protegida.
 *
 * La sesión vence sola, y el caso típico es el panel abierto en el teléfono
 * desde ayer: sin esto la promesa quedaba rechazada sin atrapar, la lista se
 * congelaba con datos viejos y nadie se enteraba de que había que entrar de
 * nuevo. Ahora un 401 manda al login; cualquier otro fallo devuelve el
 * mensaje para mostrarlo en pantalla.
 */
export function useApiError() {
  const navigate = useNavigate();

  return (e: unknown, fallback: string): string | null => {
    if (e instanceof AuthError) {
      navigate("/login", { replace: true });
      return null;
    }
    console.error(e);
    return e instanceof ApiError ? e.message : fallback;
  };
}
