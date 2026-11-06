import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFlotante from "@/components/WhatsAppFlotante";

export default function LayoutWeb({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido">{children}</main>
      <Footer />
      <WhatsAppFlotante />
    </>
  );
}
