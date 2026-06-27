import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact — Kayak Tahiti Delivery",
  description: "Contactez Kayak Tahiti Delivery pour toute question ou demande de formule sur-mesure.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-slate-950 px-6 md:px-12 py-5">
        <Link href="/" className="text-white font-black text-xl tracking-tight hover:text-slate-300 transition-colors">
          KAYAK TAHITI DELIVERY
        </Link>
      </div>

      <div className="max-w-2xl mx-auto px-6 pt-12">
        <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Nous contacter</p>
        <h1 className="font-black tracking-tighter leading-none text-slate-950 mb-4" style={{ fontSize: "clamp(2.8rem,8vw,5rem)" }}>
          UNE<br />QUESTION ?
        </h1>
        <p className="text-slate-500 font-semibold text-base mb-12">
          Pour toute demande, formule sur-mesure ou renseignement — on vous répond rapidement.
        </p>

        {/* Carte téléphone */}
        <a href="tel:+68987721527" className="flex items-center justify-between w-full border-2 border-slate-200 hover:border-[#192ee2] bg-white px-7 py-6 mb-px group transition-colors">
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 group-hover:text-[#192ee2] mb-1.5 transition-colors">Appel & WhatsApp</p>
            <p className="text-2xl font-black tracking-tight text-slate-950">+689 87 72 15 27</p>
            <p className="text-slate-500 text-sm font-semibold mt-1">Lun – Sam · 07h00 – 18h00</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#192ee2] flex items-center justify-center transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-slate-500 group-hover:text-white transition-colors">
              <path d="M3 1h4l2 5-2.5 1.5a11 11 0 005 5L13 10l5 2v4a1 1 0 01-1 1C6.164 17 1 11.836 1 2a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </a>

        {/* Carte email */}
        <a href="mailto:kevindecian01@gmail.com" className="flex items-center justify-between w-full border-2 border-slate-200 hover:border-[#192ee2] bg-white px-7 py-6 group transition-colors">
          <div>
            <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 group-hover:text-[#192ee2] mb-1.5 transition-colors">Email</p>
            <p className="text-xl font-black tracking-tight text-slate-950 break-all">kevindecian01@gmail.com</p>
            <p className="text-slate-500 text-sm font-semibold mt-1">Réponse sous 24h</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 group-hover:bg-[#192ee2] flex items-center justify-center transition-colors shrink-0 ml-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-slate-500 group-hover:text-white transition-colors">
              <rect x="1" y="3" width="16" height="12" rx="0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
              <path d="M1 3l8 7 8-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square"/>
            </svg>
          </div>
        </a>

        {/* Bloc formule sur-mesure */}
        <div className="mt-8 border-l-2 border-[#192ee2] pl-5 py-1">
          <p className="text-slate-950 font-black text-sm tracking-tight mb-1">Formule sur-mesure</p>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Groupe, événement, team building, anniversaire ? On étudie toutes les demandes — durée, nombre de kayaks, point de départ.
          </p>
        </div>

        <div className="mt-10">
          <Link href="/" className="inline-block bg-slate-950 text-white font-black text-sm uppercase tracking-tight px-8 py-4 hover:bg-[#192ee2] transition-colors">
            ← Retour à la réservation
          </Link>
        </div>
      </div>
    </main>
  );
}
