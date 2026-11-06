import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Inmobiliaria El Pasaje | Pisos y casas en venta y alquiler en Linares",
    template: "%s | Inmobiliaria El Pasaje",
  },
  description:
    "Inmobiliaria El Pasaje, en Calle Canalejas 15 (Linares, Jaén). Pisos, casas, locales, cocheras y solares en venta y alquiler. Valoramos tu casa gratis.",
  // Demo privada: que Google no la muestre.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = { themeColor: "#DCEBFA" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
