import type { Metadata, Viewport } from "next";
import RegistrarApp from "@/components/admin/RegistrarApp";

export const metadata: Metadata = {
  title: { default: "Panel", template: "%s · Panel El Pasaje" },
  manifest: "/admin/manifest.webmanifest",
  appleWebApp: { capable: true, title: "El Pasaje", statusBarStyle: "default" },
  icons: { icon: "/admin/icono-192.png", apple: "/admin/apple-touch-icon.png" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#1F3A5F", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function LayoutAdmin({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#F4F8FD]">
      <RegistrarApp />
      {children}
    </div>
  );
}
