import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Header */}
      <header className="bg-slate-950 px-6 md:px-16 py-5 flex items-center gap-5 shrink-0">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="text-slate-500 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
          </svg>
        </Link>
        <Link href="/" className="text-white font-black text-xl tracking-tight hover:text-slate-300 transition-colors">
          KAYAK TAHITI
        </Link>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <span className="text-slate-400 text-xs font-semibold tracking-wide">
            KAYAK TAHITI · Papeete, Polynésie française
          </span>
          <nav className="flex items-center gap-5">
            {[
              { href: "/mentions-legales",   label: "Mentions légales" },
              { href: "/conditions-generales", label: "CGV"             },
              { href: "/confidentialite",     label: "Confidentialité"  },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-slate-400 hover:text-slate-800 text-xs font-semibold transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
