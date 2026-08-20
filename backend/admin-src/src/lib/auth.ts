import { useEffect, useState } from "react";
import { api, AuthError } from "./api";

export interface AdminUser {
  id: string;
  email: string;
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
