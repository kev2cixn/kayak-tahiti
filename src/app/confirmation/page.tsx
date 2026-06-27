"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function minsToLabel(m: number): string {
  const h   = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, "0")}h${String(min).padStart(2, "0")}`;
}

function ConfirmationContent() {
  const params  = useSearchParams();
  const id      = params.get("id");
  const hours   = parseInt(params.get("hours") || "1");
  const price   = params.get("price");
  const address = params.get("address");
  const name    = params.get("name");
  const startRaw = params.get("start") ? decodeURIComponent(params.get("start")!) : "";

  // Parse local datetime string "YYYY-MM-DDTHH:MM:SS"
  const startMins      = startRaw ? (parseInt(startRaw.substring(11, 13)) * 60 + parseInt(startRaw.substring(14, 16))) : 0;
  const endMins        = startMins + hours * 60;
  const cleanupEndMins = endMins + 90;

  const startLabel   = startRaw ? minsToLabel(startMins)      : "—";
  const endLabel     = startRaw ? minsToLabel(endMins)        : "—";
  const cleanupLabel = startRaw ? minsToLabel(cleanupEndMins) : "—";

  const dateLabel = startRaw
    ? new Date(startRaw).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })
    : null;

  const durationLabel  = hours === 5 ? "Demi-Journée · 5H"
    : hours === 10 ? "Journée Complète · 10H"
    : `${hours} Heure${hours > 1 ? "s" : ""}`;
  const formattedPrice = price ? parseInt(price).toLocaleString("fr-FR") : "—";
  const bookingRef     = id ? id.slice(0, 8).toUpperCase() : "KT000000";
  const customerName   = name ? decodeURIComponent(name) : null;

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Nav */}
      <div className="px-6 md:px-12 py-5 border-b border-slate-800">
        <Link href="/" className="text-white font-black text-xl tracking-tight hover:text-slate-300 transition-colors">
          KAYAK TAHITI DELIVERY
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 pb-28">
        <div className="w-full max-w-2xl">

          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 bg-[#192ee2] flex items-center justify-center shrink-0">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 11L9 17L19 5" stroke="white" strokeWidth="2.5" strokeLinecap="square" />
              </svg>
            </div>
            <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase">Réservation Confirmée</p>
          </div>

          <h1 className="text-white font-black tracking-tighter leading-none mb-4" style={{ fontSize: "clamp(3rem,8vw,6rem)" }}>
            {customerName ? (
              <>{customerName.split(" ")[0]},<br />C&apos;EST RÉSERVÉ.</>
            ) : (
              <>VOTRE KAYAK<br />EST RÉSERVÉ.</>
            )}
          </h1>

          <p className="text-slate-400 font-semibold text-base mb-4 max-w-lg">
            Notre équipe prépare votre équipement. Vous serez contacté pour confirmer les détails de livraison.
          </p>
          <div className="flex items-center gap-2 mb-12">
            <span className="text-emerald-400 text-sm">✓</span>
            <p className="text-emerald-400 text-sm font-bold">Un email de confirmation vous a été envoyé.</p>
          </div>

          {/* Recap card */}
          <div className="border border-slate-700 bg-slate-900/50">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-500">Récapitulatif</p>
              <p className="text-[#192ee2] font-black text-sm tracking-wider">#{bookingRef}</p>
            </div>

            <div className="divide-y divide-slate-800">
              {customerName && <BookingRow label="Client"       value={customerName} />}
              <BookingRow label="Équipement"    value="Kayak Solo" />
              <BookingRow label="Durée"         value={durationLabel} />
              {dateLabel && <BookingRow label="Date" value={dateLabel} />}
              <BookingRow label="🛶 Livraison"   value={startLabel} />
              <BookingRow label="⏳ Retour"       value={endLabel} />
              <BookingRow
                label="Lieu de livraison"
                value={address ? decodeURIComponent(address) : "—"}
              />
              <BookingRow label="Paiement" value="Espèces sur place" />
              <BookingRow label="Statut"   value="Confirmé" highlight />
              <div className="px-6 py-5 flex justify-between items-baseline">
                <span className="text-slate-400 font-semibold">Total</span>
                <span className="text-white font-black text-3xl tracking-tighter">{formattedPrice} XPF</span>
              </div>
            </div>
          </div>

          <div className="mt-6 border-l-2 border-[#192ee2] pl-4">
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              🛡️ Sécurité incluse : Gilet CE Iso adapté, pagaie ergonomique, bout de remorquage flottant réglementaire (polypropylène).
            </p>
          </div>

          <div className="mt-8 bg-slate-900 border border-slate-700 px-5 py-4 flex items-start gap-3">
            <span className="text-slate-400 text-lg mt-0.5">ℹ</span>
            <p className="text-slate-400 text-sm font-semibold">
              Paiement en espèces à la livraison. Annulation gratuite jusqu&apos;à 2h avant.
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1 bg-[#192ee2] text-white font-black text-base uppercase tracking-tight py-4 text-center hover:bg-blue-700 transition-colors">
              Nouvelle Réservation
            </Link>
            <a href="tel:+68987721527" className="flex-1 bg-slate-800 text-white font-black text-base uppercase tracking-tight py-4 text-center hover:bg-slate-700 transition-colors">
              Nous Appeler
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-500 font-semibold">Chargement…</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}

function BookingRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="px-6 py-4 flex justify-between items-start gap-4">
      <span className="text-slate-500 font-semibold text-sm shrink-0">{label}</span>
      <span className={`font-black text-sm text-right ${highlight ? "text-[#192ee2]" : "text-white"}`}>
        {value}
      </span>
    </div>
  );
}
