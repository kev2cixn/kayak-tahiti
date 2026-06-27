import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Kayak Tahiti Delivery — Location & Livraison à Domicile",
  description:
    "Réservez votre kayak en ligne. Livraison à pied de l'eau partout à Tahiti. Équipement certifié CE, pagaie ergonomique, gilet inclus.",
  keywords: ["kayak tahiti", "location kayak", "livraison kayak papeete", "kayak polynésie"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${jakarta.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif" }}
      >
        {children}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-sm border-t border-slate-800 px-6 pt-2 flex items-center justify-between gap-4" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
          <span className="text-slate-500 text-[10px] font-semibold shrink-0">© Kayak-Tahiti-Delivery</span>
          <div className="flex gap-4">
            <Link href="/contact" className="text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors">Contact</Link>
            <Link href="/mentions-legales" className="text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors">Mentions légales</Link>
            <Link href="/conditions-generales" className="text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors">CGV</Link>
            <Link href="/confidentialite" className="text-slate-500 hover:text-slate-300 text-[10px] font-semibold transition-colors">Confidentialité</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
