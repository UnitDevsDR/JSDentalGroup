import { Navigate, Route, Routes } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { SessionContext, useIsAdmin, useSession } from "@/lib/auth";
import LoginPage from "@/pages/LoginPage";
import ContactsPage from "@/pages/ContactsPage";
import ContactDetailPage from "@/pages/ContactDetailPage";
import SettingsPage from "@/pages/SettingsPage";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <SessionContext.Provider value={user}>
    <SidebarProvider>
      <AppSidebar user={user} />
      {/* min-w-0: SidebarInset es un hijo flex y, sin esto, su ancho mínimo
          automático es el de su contenido — se quedaba en el ancho completo
          de la ventana y empujaba la página 256px (lo que mide la barra
          lateral), así que al angostar el navegador la tabla no se encogía:
          scrolleaba la página entera en horizontal. */}
      <SidebarInset className="min-w-0">
        <header className="flex h-12 items-center border-b px-4">
          <SidebarTrigger />
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
    </SessionContext.Provider>
  );
}

/** Pantallas de administración. El backend igual las protege; esto evita
 *  que alguien de recepción llegue a un formulario que solo le va a dar 403. */
function SoloAdmin({ children }: { children: React.ReactNode }) {
  if (!useIsAdmin()) {
    return (
      <div className="p-6">
        <p className="text-sm text-muted-foreground">
          Esta sección es para administradores. Si necesitas entrar, pídeselo a quien administra el panel.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <ContactsPage />
          </Protected>
        }
      />
      <Route
        path="/contactos/:id"
        element={
          <Protected>
            <ContactDetailPage />
          </Protected>
        }
      />
      <Route
        path="/ajustes"
        element={
          <Protected>
            <SoloAdmin>
              <SettingsPage />
            </SoloAdmin>
          </Protected>
        }
      />
    </Routes>
  );
}
