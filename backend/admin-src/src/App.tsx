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
      <SidebarInset>
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
