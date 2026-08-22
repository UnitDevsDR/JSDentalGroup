import { Navigate, Route, Routes } from "react-router-dom";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useSession } from "@/lib/auth";
import LoginPage from "@/pages/LoginPage";
import LeadsPage from "@/pages/LeadsPage";
import SettingsPage from "@/pages/SettingsPage";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useSession();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return (
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
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <Protected>
            <LeadsPage />
          </Protected>
        }
      />
      <Route
        path="/ajustes"
        element={
          <Protected>
            <SettingsPage />
          </Protected>
        }
      />
    </Routes>
  );
}
