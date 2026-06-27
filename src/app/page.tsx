"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4;
type DurationType = "hourly" | "half_day" | "daily";

const HOURLY_RATE  = 2000;
const CLEANUP_MINS = 90;
const DAY_START    = 7 * 60;
const DAY_END      = 19 * 60;
const TOTAL_STEPS  = 4;

const PRICES = { half_day: 8000, daily: 10000 };

const WEEKDAYS_FR = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const MONTHS_FR   = ["jan", "fév", "mar", "avr", "mai", "juin", "juil", "aoû", "sep", "oct", "nov", "déc"];

function localDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function minsToLabel(m: number): string {
  return `${String(Math.floor(m / 60)).padStart(2, "0")}h${String(m % 60).padStart(2, "0")}`;
}

export default function Home() {
  const router = useRouter();

  const [step, setStep]                               = useState<Step>(1);
  const [kayakSelected, setKayakSelected]             = useState(false);
  const [selectedDuration, setSelectedDuration]       = useState<DurationType | null>(null);
  const [selectedHours, setSelectedHours]             = useState(1); // 1-3 pour hourly
  const [deliveryDate, setDeliveryDate]               = useState("");
  const [deliveryStartTime, setDeliveryStartTime]     = useState("");
  const [bookedRanges, setBookedRanges]               = useState<{ startMins: number; cleanupEndMins: number }[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [deliveryAddress, setDeliveryAddress]         = useState("");
  const [deliveryNotes, setDeliveryNotes]             = useState("");
  const [customerName, setCustomerName]               = useState("");
  const [customerPhone, setCustomerPhone]             = useState("");
  const [customerEmail, setCustomerEmail]             = useState("");
  const [isSubmitting, setIsSubmitting]               = useState(false);
  const [error, setError]                             = useState<string | null>(null);
  const [acceptCGV, setAcceptCGV]                     = useState(false);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS) as Step);
  const goBack = () => setStep((s) => Math.max(s - 1, 1) as Step);

  // Durée en heures selon la formule choisie
  const durationHours = !selectedDuration ? 1
    : selectedDuration === "hourly"   ? selectedHours
    : selectedDuration === "half_day" ? 5
    : 10;

  const selectedPrice = !selectedDuration ? 0
    : selectedDuration === "hourly"   ? selectedHours * HOURLY_RATE
    : selectedDuration === "half_day" ? PRICES.half_day
    : PRICES.daily;

  const durationLabel = !selectedDuration ? ""
    : selectedDuration === "hourly"
      ? `${selectedHours} HEURE${selectedHours > 1 ? "S" : ""}`
      : selectedDuration === "half_day" ? "DEMI-JOURNÉE · 5H"
      : "JOURNÉE · 10H";

  // Time math
  const startMins      = deliveryStartTime
    ? parseInt(deliveryStartTime.split(":")[0]) * 60 + parseInt(deliveryStartTime.split(":")[1])
    : 0;
  const endMins        = startMins + durationHours * 60;
  const cleanupEndMins = endMins + CLEANUP_MINS;
  const startLabel     = deliveryStartTime ? minsToLabel(startMins)      : "";
  const endLabel       = deliveryStartTime ? minsToLabel(endMins)        : "";
  const cleanupLabel   = deliveryStartTime ? minsToLabel(cleanupEndMins) : "";

  // Date options
  const dateOptions = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i);
      return { iso: localDateStr(d), weekday: WEEKDAYS_FR[d.getDay()], day: d.getDate(), month: MONTHS_FR[d.getMonth()] };
    }), []);

  // Créneaux horaires filtrés par durée et disponibilité
  const timeSlots = useMemo(() => {
    const durationMins   = durationHours * 60;
    const lastValidStart = DAY_END - durationMins;
    const slots: { value: string; label: string; isBlocked: boolean }[] = [];
    for (let m = DAY_START; m <= lastValidStart; m += 30) {
      const value   = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
      const newEnd  = m + durationMins + CLEANUP_MINS;
      const isBlocked = bookedRanges.some((r) => m < r.cleanupEndMins && newEnd > r.startMins);
      slots.push({ value, label: minsToLabel(m), isBlocked });
    }
    return slots;
  }, [durationHours, bookedRanges]);

  // Fetch disponibilités à chaque changement de date
  useEffect(() => {
    if (!deliveryDate) return;
    setLoadingAvailability(true);
    setDeliveryStartTime("");
    fetch(`/api/availability?date=${deliveryDate}`)
      .then((r) => r.json())
      .then((d) => setBookedRanges(d.blockedIntervals || []))
      .catch(() => setBookedRanges([]))
      .finally(() => setLoadingAvailability(false));
  }, [deliveryDate]);

  // Reset heure si la durée change
  useEffect(() => { setDeliveryStartTime(""); }, [durationHours]);

  const selectedDateOption = dateOptions.find((d) => d.iso === deliveryDate);
  const selectedDateLabel  = selectedDateOption
    ? `${selectedDateOption.weekday} ${selectedDateOption.day} ${selectedDateOption.month}` : "";

  const step2Ready    = selectedDuration !== null && deliveryDate !== "" && deliveryStartTime !== "";
  const addressReady  = deliveryAddress.trim().length > 3;
  const customerReady = customerName.trim().length >= 2 && customerPhone.trim().length >= 6 && customerEmail.includes("@");
  const canBook       = step2Ready && addressReady && customerReady && acceptCGV;

  const handleSelectKayak = () => { setKayakSelected(true); setTimeout(goNext, 420); };

  const handleBook = async () => {
    if (!canBook) return;
    setIsSubmitting(true);
    setError(null);
    const fullAddress   = deliveryNotes.trim() ? `${deliveryAddress.trim()} — Note: ${deliveryNotes.trim()}` : deliveryAddress.trim();
    const startDatetime = `${deliveryDate}T${deliveryStartTime}:00`;
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          duration_hours:   durationHours,
          start_datetime:   startDatetime,
          delivery_address: fullAddress,
          customer_name:    customerName.trim(),
          customer_phone:   customerPhone.trim(),
          customer_email:   customerEmail.trim(),
          cgv_accepted:     true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la réservation");
      router.push(
        `/confirmation?id=${data.id}&hours=${durationHours}&price=${selectedPrice}` +
        `&address=${encodeURIComponent(deliveryAddress.trim())}` +
        `&name=${encodeURIComponent(customerName.trim())}` +
        `&start=${encodeURIComponent(startDatetime)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsSubmitting(false);
    }
  };

  /* ─────────────────────────────────────────────────── */

  return (
    <div className="h-[100dvh] flex flex-col bg-white overflow-hidden">

      {/* ═══ HEADER ═══ */}
      <header className="bg-slate-950 shrink-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={goBack} aria-label="Retour" className="text-slate-400 hover:text-white transition-colors shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M13 4L7 10L13 16" stroke="currentColor" strokeWidth="2" strokeLinecap="square"/></svg>
              </button>
            )}
            <span className="text-white font-black text-lg tracking-tight">KAYAK TAHITI DELIVERY</span>
          </div>
          {step > 1 && <span className="text-white font-black text-sm shrink-0">{step}<span className="text-slate-600 font-bold">/{TOTAL_STEPS}</span></span>}
        </div>
        <div className="h-[3px] bg-slate-800">
          <div className="h-full bg-[#192ee2]" style={{ width: `${(step / TOTAL_STEPS) * 100}%`, transition: "width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }} />
        </div>
      </header>

      {/* ═══ SLIDER ═══ */}
      <div className="flex-1 overflow-hidden">
        <div className="flex h-full" style={{ width: `${TOTAL_STEPS * 100}%`, transform: `translateX(-${((step - 1) / TOTAL_STEPS) * 100}%)`, transition: "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>

          {/* ══ ÉTAPE 1 — KAYAK ══ */}
          <div className="overflow-y-auto" style={{ width: `${100 / TOTAL_STEPS}%` }}>
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">
              <div className="mb-10">
                <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Étape 1 · Votre équipement</p>
                <h1 className="font-black tracking-tighter leading-none text-slate-950" style={{ fontSize: "clamp(3rem,9vw,6rem)" }}>VOTRE<br />KAYAK.</h1>
                <p className="text-slate-500 font-semibold text-base mt-3">Sélectionnez votre embarcation.</p>
              </div>

              <button onClick={handleSelectKayak} className={`w-full text-left p-7 border-2 transition-all duration-300 ${kayakSelected ? "border-[#192ee2] bg-blue-50/40" : "border-slate-200 bg-white hover:border-slate-400 active:scale-[0.99]"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className={`text-[9px] font-black tracking-[0.32em] uppercase mb-3 ${kayakSelected ? "text-[#192ee2]" : "text-slate-400"}`}>Disponible maintenant</p>
                    <h3 className="text-2xl font-black tracking-tight text-slate-950">Kayak Solo</h3>
                    <p className="text-slate-500 text-sm font-semibold mt-1.5">Coque polyéthylène · Stable · Idéal lagon & mer calme</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {["1 pagayeur", "Gilet CE inclus", "Pagaie ergonomique"].map((tag) => (
                        <span key={tag} className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 tracking-wide">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 transition-all duration-300 ${kayakSelected ? "bg-[#192ee2] border-[#192ee2]" : "border-slate-300"}`}>
                    {kayakSelected && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2.5" strokeLinecap="square"/></svg>}
                  </div>
                </div>
              </button>

              <div className="mt-5 border-l-2 border-[#192ee2] pl-4">
                <p className="text-slate-500 text-xs font-semibold leading-relaxed">🛡️ Sécurité incluse : Gilet CE Iso adapté, pagaie ergonomique et bout de remorquage flottant réglementaire (polypropylène).</p>
              </div>

              <div className="mt-8" style={{ opacity: kayakSelected ? 1 : 0, transform: kayakSelected ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: kayakSelected ? "auto" : "none" }}>
                <button onClick={goNext} className="w-full bg-slate-950 text-white font-black text-lg uppercase tracking-tight py-5 hover:bg-[#192ee2] transition-colors">Continuer →</button>
              </div>
              {!kayakSelected && <p className="mt-8 text-center text-slate-400 text-sm font-medium">Appuyez sur la carte pour sélectionner</p>}
            </div>
          </div>

          {/* ══ ÉTAPE 2 — FORMULE · DATE · HORAIRE ══ */}
          <div className="overflow-y-auto" style={{ width: `${100 / TOTAL_STEPS}%` }}>
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-20">

              <div className="mb-8">
                <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Étape 2 · Formule & Horaire</p>
                <div className="flex items-baseline gap-4">
                  <span className="font-black text-slate-100 leading-none select-none" style={{ fontSize: "clamp(4rem,10vw,6rem)" }}>02</span>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Réservation</h2>
                    <p className="text-slate-500 text-sm font-semibold mt-0.5">Choisissez votre formule et l&apos;horaire</p>
                  </div>
                </div>
              </div>

              {/* ── Cartes de durée ── */}
              <div className="space-y-px bg-slate-200 border border-slate-200 mb-6">

                {/* À l'heure (1–3h) */}
                {(() => {
                  const active = selectedDuration === "hourly";
                  const price  = selectedHours * HOURLY_RATE;
                  return (
                    <div onClick={() => setSelectedDuration("hourly")} className={`w-full p-7 text-left transition-colors cursor-pointer ${active ? "bg-[#192ee2]" : "bg-white hover:bg-slate-50"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className={`block text-[9px] font-black tracking-[0.3em] uppercase mb-1.5 ${active ? "text-blue-200" : "text-slate-400"}`}>Découverte du lagon</span>
                          <span className={`block text-xl font-black tracking-tight ${active ? "text-white" : "text-slate-950"}`}>{selectedHours} HEURE{selectedHours > 1 ? "S" : ""}</span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`block font-black tracking-tighter leading-none ${active ? "text-white" : "text-[#192ee2]"}`} style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>{price.toLocaleString("fr-FR")}</span>
                          <span className={`block text-sm font-bold mt-0.5 ${active ? "text-blue-200" : "text-slate-400"}`}>XPF</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-5" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => { setSelectedDuration("hourly"); setSelectedHours((h) => Math.max(1, h - 1)); }}
                          className={`w-9 h-9 flex items-center justify-center font-black text-lg border-2 transition-colors ${active ? "border-blue-300 text-white hover:bg-blue-700" : "border-slate-300 text-slate-700 hover:border-slate-950"} ${selectedHours <= 1 ? "opacity-30 pointer-events-none" : ""}`}>−</button>
                        <span className={`font-black text-sm tracking-widest ${active ? "text-white" : "text-slate-950"}`}>{selectedHours}h · {price.toLocaleString("fr-FR")} XPF</span>
                        <button onClick={() => { setSelectedDuration("hourly"); setSelectedHours((h) => Math.min(3, h + 1)); }}
                          className={`w-9 h-9 flex items-center justify-center font-black text-lg border-2 transition-colors ${active ? "border-blue-300 text-white hover:bg-blue-700" : "border-slate-300 text-slate-700 hover:border-slate-950"} ${selectedHours >= 3 ? "opacity-30 pointer-events-none" : ""}`}>+</button>
                        {selectedHours >= 3 && <span className={`text-[10px] font-bold ${active ? "text-blue-200" : "text-slate-400"}`}>max · voir Demi-journée ↓</span>}
                      </div>
                    </div>
                  );
                })()}

                {/* Demi-journée · 5h */}
                {(() => {
                  const active      = selectedDuration === "half_day";
                  const strikePrice = 5 * HOURLY_RATE;
                  const realPrice   = PRICES.half_day;
                  return (
                    <button onClick={() => setSelectedDuration("half_day")} className={`w-full p-7 flex items-center justify-between text-left transition-colors cursor-pointer ${active ? "bg-[#192ee2]" : "bg-white hover:bg-slate-50"}`}>
                      <div>
                        <span className={`block text-[9px] font-black tracking-[0.3em] uppercase mb-1.5 ${active ? "text-blue-200" : "text-slate-400"}`}>Côte ouest & récif · 5 heures</span>
                        <span className={`block text-xl font-black tracking-tight ${active ? "text-white" : "text-slate-950"}`}>DEMI-JOURNÉE</span>
                        <span className={`block text-[10px] font-black mt-1.5 ${active ? "text-emerald-300" : "text-emerald-600"}`}>Économie de {(strikePrice - realPrice).toLocaleString("fr-FR")} XPF</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`block text-xs font-bold line-through mb-0.5 ${active ? "text-blue-300" : "text-slate-300"}`}>{strikePrice.toLocaleString("fr-FR")} XPF</span>
                        <span className={`block font-black tracking-tighter leading-none ${active ? "text-white" : "text-[#192ee2]"}`} style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>{realPrice.toLocaleString("fr-FR")}</span>
                        <span className={`block text-sm font-bold mt-0.5 ${active ? "text-blue-200" : "text-slate-400"}`}>XPF</span>
                      </div>
                    </button>
                  );
                })()}

                {/* Journée · 10h */}
                {(() => {
                  const active      = selectedDuration === "daily";
                  const strikePrice = 10 * HOURLY_RATE;
                  const realPrice   = PRICES.daily;
                  return (
                    <button onClick={() => setSelectedDuration("daily")} className={`w-full p-7 flex items-center justify-between text-left transition-colors cursor-pointer ${active ? "bg-[#192ee2]" : "bg-white hover:bg-slate-50"}`}>
                      <div>
                        <span className={`block text-[9px] font-black tracking-[0.3em] uppercase mb-1.5 ${active ? "text-blue-200" : "text-slate-400"}`}>Tour complet de la côte · 10 heures</span>
                        <span className={`block text-xl font-black tracking-tight ${active ? "text-white" : "text-slate-950"}`}>JOURNÉE</span>
                        <span className={`block text-[10px] font-black mt-1.5 ${active ? "text-emerald-300" : "text-emerald-600"}`}>Économie de {(strikePrice - realPrice).toLocaleString("fr-FR")} XPF</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`block text-xs font-bold line-through mb-0.5 ${active ? "text-blue-300" : "text-slate-300"}`}>{strikePrice.toLocaleString("fr-FR")} XPF</span>
                        <span className={`block font-black tracking-tighter leading-none ${active ? "text-white" : "text-[#192ee2]"}`} style={{ fontSize: "clamp(1.8rem,4vw,2.5rem)" }}>{realPrice.toLocaleString("fr-FR")}</span>
                        <span className={`block text-sm font-bold mt-0.5 ${active ? "text-blue-200" : "text-slate-400"}`}>XPF</span>
                      </div>
                    </button>
                  );
                })()}
              </div>

              {/* ── Carousel de dates (visible dès qu'une formule est choisie) ── */}
              {selectedDuration && (
                <>
                  <div className="mb-5">
                    <label className="block text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 mb-2">Date de livraison</label>
                    <div className="flex gap-px bg-slate-200 border border-slate-200 overflow-x-auto">
                      {dateOptions.map((d) => (
                        <button key={d.iso} type="button" onClick={() => setDeliveryDate(d.iso)}
                          className={`flex-shrink-0 flex flex-col items-center py-3 px-4 min-w-[4.5rem] font-black transition-colors ${deliveryDate === d.iso ? "bg-[#192ee2] text-white" : "bg-white text-slate-700 hover:bg-slate-50"}`}>
                          <span className={`text-[9px] tracking-widest uppercase mb-1 ${deliveryDate === d.iso ? "text-blue-200" : "text-slate-400"}`}>{d.weekday}</span>
                          <span className="text-2xl leading-none">{d.day}</span>
                          <span className={`text-[9px] uppercase tracking-wide mt-1 ${deliveryDate === d.iso ? "text-blue-200" : "text-slate-400"}`}>{d.month}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ── Grille horaire ── */}
                  {deliveryDate && (
                    <div className="mb-6">
                      <div className="flex items-baseline justify-between mb-2">
                        <label className="block text-[9px] font-black tracking-[0.3em] uppercase text-slate-500">Heure de départ</label>
                        {deliveryStartTime && (
                          <span className="text-[#192ee2] text-xs font-black tracking-tight">
                            {startLabel} → {endLabel}
                            <span className="text-slate-400 font-semibold"> (nett. {cleanupLabel})</span>
                          </span>
                        )}
                      </div>

                      {loadingAvailability ? (
                        <div className="border border-slate-200 bg-slate-50 py-8 text-center text-slate-400 text-sm font-semibold">Vérification des disponibilités…</div>
                      ) : timeSlots.length === 0 ? (
                        <div className="border border-slate-200 bg-slate-50 py-8 text-center text-slate-400 text-sm font-semibold">Aucun créneau disponible pour cette durée</div>
                      ) : (
                        <div className="grid grid-cols-4 gap-px bg-slate-200 border border-slate-200">
                          {timeSlots.map((slot) => (
                            <button key={slot.value} type="button" disabled={slot.isBlocked} onClick={() => !slot.isBlocked && setDeliveryStartTime(slot.value)}
                              className={`py-3.5 text-center font-black text-sm tracking-tight transition-colors ${
                                slot.isBlocked ? "bg-slate-100 text-slate-300 cursor-not-allowed line-through"
                                : deliveryStartTime === slot.value ? "bg-[#192ee2] text-white"
                                : "bg-white text-slate-700 hover:bg-slate-50"}`}>
                              {slot.label}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-slate-400 text-xs font-semibold mt-2">
                        {deliveryStartTime
                          ? `🧼 Créneau nettoyage réservé jusqu'à ${cleanupLabel}`
                          : `Choisissez une heure · kayak rendu avant ${minsToLabel(DAY_END)}`}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Bouton continuer */}
              <div style={{ opacity: step2Ready ? 1 : 0, transform: step2Ready ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: step2Ready ? "auto" : "none" }}>
                <button onClick={goNext} className="w-full bg-slate-950 text-white font-black text-lg uppercase tracking-tight py-5 hover:bg-[#192ee2] transition-colors">Continuer →</button>
                <p className="text-center text-slate-400 text-xs font-semibold mt-3">
                  {durationLabel} · {selectedDateLabel} · {startLabel} → {endLabel} · {selectedPrice.toLocaleString("fr-FR")} XPF
                </p>
              </div>

              {!step2Ready && (
                <p className="text-slate-400 text-sm font-medium text-center mt-4">
                  {!selectedDuration ? "Choisissez votre formule"
                    : !deliveryDate ? "Choisissez une date"
                    : "Choisissez une heure de départ"}
                </p>
              )}
            </div>
          </div>

          {/* ══ ÉTAPE 3 — LIVRAISON ══ */}
          <div className="overflow-y-auto" style={{ width: `${100 / TOTAL_STEPS}%` }}>
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-8">
              <div className="mb-8">
                <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Étape 3 · Lieu de livraison</p>
                <div className="flex items-baseline gap-4">
                  <span className="font-black text-slate-100 leading-none select-none" style={{ fontSize: "clamp(4rem,10vw,6rem)" }}>03</span>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Livraison</h2>
                    <p className="text-slate-500 text-sm font-semibold mt-0.5">Où vous livrer ?</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 mb-2">Lieu de livraison</label>
                <textarea value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} rows={2}
                  placeholder={"Ex : PK18 côte ouest, plage de Punaauia\nEx : Bord de mer à Papeete, face au marché"}
                  className="w-full border-2 border-slate-200 focus:border-[#192ee2] bg-slate-50 px-4 py-3.5 text-slate-950 font-semibold text-base placeholder:text-slate-300 outline-none transition-colors resize-none leading-snug" />
              </div>

              <div className="mb-6">
                <label className="block text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 mb-2">
                  Note pour le livreur{" "}<span className="text-slate-300 font-semibold normal-case tracking-normal text-[10px]">— optionnel</span>
                </label>
                <textarea value={deliveryNotes} onChange={(e) => setDeliveryNotes(e.target.value)} rows={2}
                  placeholder={"Ex : Servitude après le conteneur vert, côté mer\nEx : Appeler à l'arrivée, portail blanc"}
                  className="w-full border-2 border-slate-200 focus:border-[#192ee2] bg-slate-50 px-4 py-3.5 text-slate-950 font-medium text-sm placeholder:text-slate-300 outline-none transition-colors resize-none leading-snug" />
              </div>

              <div style={{ opacity: addressReady ? 1 : 0, transform: addressReady ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease, transform 0.3s ease", pointerEvents: addressReady ? "auto" : "none" }}>
                <button onClick={goNext} className="w-full bg-slate-950 text-white font-black text-lg uppercase tracking-tight py-5 hover:bg-[#192ee2] transition-colors">Continuer →</button>
              </div>
              {!addressReady && <p className="text-slate-400 text-sm font-medium text-center mt-4">Indiquez votre lieu de livraison</p>}

            </div>
          </div>

          {/* ══ ÉTAPE 4 — COORDONNÉES ══ */}
          <div className="overflow-y-auto" style={{ width: `${100 / TOTAL_STEPS}%` }}>
            <div className="max-w-2xl mx-auto px-6 pt-12 pb-10">
              <div className="mb-8">
                <p className="text-[#192ee2] text-[9px] font-black tracking-[0.35em] uppercase mb-4">Étape 4 · Vos coordonnées</p>
                <div className="flex items-baseline gap-4">
                  <span className="font-black text-slate-100 leading-none select-none" style={{ fontSize: "clamp(4rem,10vw,6rem)" }}>04</span>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">Contact</h2>
                    <p className="text-slate-500 text-sm font-semibold mt-0.5">Réservation invité — aucun compte requis</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { label: "Nom complet", type: "text", value: customerName, onChange: (v: string) => setCustomerName(v), placeholder: "Prénom Nom", autoComplete: "name" },
                  { label: "Téléphone",   type: "tel",  value: customerPhone, onChange: (v: string) => setCustomerPhone(v), placeholder: "+689 87 XX XX XX", autoComplete: "tel" },
                  { label: "Email",       type: "email", value: customerEmail, onChange: (v: string) => setCustomerEmail(v), placeholder: "votre@email.com", autoComplete: "email" },
                ].map(({ label, type, value, onChange, placeholder, autoComplete }) => (
                  <div key={label}>
                    <label className="block text-[9px] font-black tracking-[0.3em] uppercase text-slate-500 mb-2">{label}</label>
                    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoComplete={autoComplete}
                      className="w-full border-2 border-slate-200 focus:border-[#192ee2] bg-slate-50 px-4 py-3.5 text-slate-950 font-semibold text-base placeholder:text-slate-300 outline-none transition-colors" />
                  </div>
                ))}
              </div>

              {/* Récap */}
              <div className="bg-slate-950 mb-5">
                <div className="px-5 py-3 border-b border-slate-800">
                  <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-500">Récapitulatif de commande</p>
                </div>
                <div className="divide-y divide-slate-800">
                  <RecapRow label="Équipement" value="Kayak Solo" />
                  <RecapRow label="Formule"    value={durationLabel} />
                  {selectedDateLabel && <RecapRow label="Date"    value={selectedDateLabel} />}
                  {startLabel && <RecapRow label="Horaire" value={`${startLabel} → ${endLabel}`} />}
                  <RecapRow label="Livraison" value={deliveryAddress.trim() || "—"} />
                  {customerName.trim() && <RecapRow label="Client" value={customerName.trim()} />}
                  <div className="px-5 py-4 flex justify-between items-baseline">
                    <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Total</span>
                    <span className="text-white font-black text-2xl tracking-tighter">{selectedPrice.toLocaleString("fr-FR")} XPF</span>
                  </div>
                </div>
              </div>

              {/* Checkbox CGV */}
              <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                <div className="relative shrink-0 mt-0.5">
                  <input type="checkbox" checked={acceptCGV} onChange={(e) => setAcceptCGV(e.target.checked)} className="sr-only" />
                  <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${acceptCGV ? "bg-[#192ee2] border-[#192ee2]" : "border-slate-300 group-hover:border-slate-500"}`}>
                    {acceptCGV && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5L4.5 8.5L9.5 2.5" stroke="white" strokeWidth="2" strokeLinecap="square"/></svg>}
                  </div>
                </div>
                <span className="text-slate-500 text-xs font-medium leading-relaxed">
                  J&apos;ai lu et j&apos;accepte sans réserve les{" "}
                  <a href="/conditions-generales" target="_blank" className="text-[#192ee2] font-bold underline underline-offset-2 hover:text-blue-700">
                    Conditions Générales de Vente (CGV)
                  </a>
                  , je certifie savoir nager et m&apos;engage à porter le gilet de sauvetage obligatoire fourni.
                </span>
              </label>

              {error && <div className="bg-red-50 border-l-4 border-red-500 px-4 py-3 text-red-700 text-sm font-semibold mb-4">{error}</div>}

              <button onClick={handleBook} disabled={!canBook || isSubmitting}
                className="w-full bg-slate-950 text-white font-black text-lg uppercase tracking-tight py-6 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-[#192ee2] transition-colors mb-2">
                {isSubmitting ? "Confirmation en cours…" : "Confirmer la Réservation →"}
              </button>

              {!customerReady && <p className="text-slate-400 text-sm font-medium text-center">Renseignez vos coordonnées pour confirmer</p>}
              <p className="text-slate-400 text-xs text-center font-medium mt-3">Annulation gratuite jusqu&apos;à 2h avant</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-5 py-3 flex justify-between items-start gap-4">
      <span className="text-slate-500 text-xs font-black uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-white font-semibold text-sm text-right truncate max-w-[200px]">{value}</span>
    </div>
  );
}
