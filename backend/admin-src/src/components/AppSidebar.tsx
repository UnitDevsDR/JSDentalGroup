import { LogOut, Settings, Users } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import type { AdminUser } from "@/lib/auth";

const items = [
  { title: "Contactos", url: "/", icon: Users, soloAdmin: false },
  { title: "Ajustes", url: "/ajustes", icon: Settings, soloAdmin: true },
];

export function AppSidebar({ user }: { user: AdminUser }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const visibles = items.filter((item) => !item.soloAdmin || user.role === "ADMIN");

  // La ficha de una persona vive en /contactos/:id, así que «Contactos»
  // tiene que seguir encendido ahí dentro. No se puede resolver con el
  // `end` de NavLink: sin él, "/" haría match con todas las rutas.
  const activo = (url: string) =>
    url === "/" ? pathname === "/" || pathname.startsWith("/contactos") : pathname === url;

  const logout = async () => {
    await api("/auth/logout", { method: "POST" });
    navigate("/login", { replace: true });
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <div className="flex items-center gap-2">
          <img src="/admin/logo-blanco.webp" alt="" className="h-6" />
          <span className="font-heading text-sm font-semibold text-sidebar-foreground">JS Dental Group</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibles.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className={activo(item.url) ? "bg-sidebar-accent" : ""}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 px-4 py-3">
        <p className="truncate text-xs text-sidebar-foreground/70">{user.email}</p>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-sm text-sidebar-foreground/90 hover:text-sidebar-foreground"
        >
          <LogOut className="size-4" /> Salir
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
