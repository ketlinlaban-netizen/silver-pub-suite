import { Outlet } from "@tanstack/react-router";
import { Toaster } from "sonner";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { AuthProvider } from "@/hooks/useAuth";

export function RootLayout() {
  return (
    <>
      <InstallBanner />
      <AuthProvider>
        <Outlet />
      </AuthProvider>
      <Toaster position="top-center" />
    </>
  );
}
