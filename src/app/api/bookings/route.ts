import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

const CLEANUP_MS   = 90 * 60 * 1000; // 1h30 en millisecondes

// Valid duration_hours → price (server-side source of truth)
const PRICE_MAP: Record<number, number> = {
  1: 2000, 2: 4000, 3: 6000,  // À l'heure
  5: 8000,                     // Demi-journée
  10: 10000,                   // Journée
};

function addMinutes(isoStr: string, mins: number): string {
  return new Date(new Date(isoStr).getTime() + mins * 60_000).toISOString();
}

function formatTime(isoStr: string): string {
  // Returns "HHhMM" e.g. "09h30"
  const t = isoStr.substring(11, 16);
  return t.replace(":", "h");
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });
}

async function sendEmails(params: {
  bookingRef:       string;
  customerName:     string;
  customerPhone:    string;
  customerEmail:    string;
  deliveryAddress:  string;
  startTime:        string;
  endTime:          string;
  cleanupEndTime:   string;
  durationHours:    number;
  totalPrice:       number;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const {
    bookingRef, customerName, customerPhone, customerEmail,
    deliveryAddress, startTime, endTime, cleanupEndTime,
    durationHours, totalPrice,
  } = params;

  const ownerEmail  = "kevindecian01@gmail.com";
  const from        = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const priceStr    = totalPrice.toLocaleString("fr-FR");
  const dateLabel   = formatDate(startTime);
  const startLabel  = formatTime(startTime);
  const endLabel    = formatTime(endTime);
  const cleanupLabel = formatTime(cleanupEndTime);
  const durationLabel = `${durationHours}h`;

  const customerHtml = `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
  body{margin:0;padding:0;background:#0f172a;font-family:system-ui,sans-serif;color:#fff}
  .wrap{max-width:560px;margin:0 auto;padding:40px 24px}
  .badge{display:inline-block;background:#192ee2;color:#fff;font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;padding:6px 14px;margin-bottom:32px}
  h1{font-size:36px;font-weight:900;letter-spacing:-.03em;line-height:1.1;margin:0 0 16px}
  .sub{color:#94a3b8;font-size:15px;font-weight:600;margin:0 0 40px}
  .card{border:1px solid #334155;background:#1e293b;margin-bottom:8px}
  .card-head{padding:12px 20px;border-bottom:1px solid #334155;font-size:9px;font-weight:900;letter-spacing:.25em;text-transform:uppercase;color:#64748b}
  .row{display:flex;justify-content:space-between;align-items:flex-start;padding:14px 20px;border-bottom:1px solid #1e293b}
  .row:last-child{border-bottom:none}
  .label{color:#64748b;font-size:13px;font-weight:600}
  .val{color:#fff;font-size:13px;font-weight:700;text-align:right}
  .val.blue{color:#192ee2}
  .total-row{display:flex;justify-content:space-between;align-items:baseline;padding:18px 20px}
  .total-label{color:#64748b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em}
  .total-val{color:#fff;font-size:28px;font-weight:900;letter-spacing:-.04em}
  .footer{color:#475569;font-size:12px;font-weight:500;text-align:center;margin-top:40px}
</style></head><body><div class="wrap">
  <div class="badge">Kayak Tahiti Delivery</div>
  <h1>Votre kayak<br>est réservé.</h1>
  <p class="sub">Bonjour ${customerName}, votre réservation est confirmée.</p>
  <div class="card">
    <div class="card-head">Réservation · #${bookingRef}</div>
    <div class="row"><span class="label">Durée</span><span class="val">${durationLabel}</span></div>
    <div class="row"><span class="label">Date</span><span class="val">${dateLabel}</span></div>
    <div class="row"><span class="label">🛶 Livraison</span><span class="val">${startLabel}</span></div>
    <div class="row"><span class="label">⏳ Retour kayak</span><span class="val">${endLabel}</span></div>
    <div class="row"><span class="label">Lieu</span><span class="val">${deliveryAddress}</span></div>
    <div class="row"><span class="label">Paiement</span><span class="val">Espèces sur place</span></div>
    <div class="row"><span class="label">Statut</span><span class="val blue">Confirmé</span></div>
    <div class="total-row"><span class="total-label">Total</span><span class="total-val">${priceStr} XPF</span></div>
  </div>
  <div class="footer">Kayak Tahiti Delivery · Papeete · +689 87 72 15 27<br>Annulation gratuite jusqu'à 2h avant.</div>
</div></body></html>`;

  const ownerHtml = `
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><style>
  body{margin:0;padding:0;background:#0f172a;font-family:system-ui,sans-serif;color:#fff}
  .wrap{max-width:560px;margin:0 auto;padding:40px 24px}
  .badge{display:inline-block;background:#f59e0b;color:#000;font-size:10px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;padding:6px 14px;margin-bottom:24px}
  h1{font-size:30px;font-weight:900;letter-spacing:-.03em;margin:0 0 32px}
  .card{border:1px solid #334155;background:#1e293b;margin-bottom:8px}
  .card-head{padding:12px 20px;border-bottom:1px solid #334155;font-size:9px;font-weight:900;letter-spacing:.25em;text-transform:uppercase;color:#64748b}
  .row{display:flex;justify-content:space-between;align-items:flex-start;padding:14px 20px;border-bottom:1px solid #0f172a}
  .row:last-child{border-bottom:none}
  .label{color:#64748b;font-size:13px;font-weight:600}
  .val{color:#fff;font-size:13px;font-weight:700;text-align:right}
  .val a{color:#60a5fa;text-decoration:none}
  .alert{background:#1e3a5f;border-left:3px solid #f59e0b;padding:14px 18px;color:#fbbf24;font-size:13px;font-weight:700;margin-bottom:8px}
  .total-row{display:flex;justify-content:space-between;align-items:baseline;padding:18px 20px}
  .total-label{color:#64748b;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.1em}
  .total-val{color:#fff;font-size:28px;font-weight:900;letter-spacing:-.04em}
</style></head><body><div class="wrap">
  <div class="badge">🚨 Nouvelle réservation</div>
  <h1>Commande #${bookingRef}</h1>
  <div class="alert">
    🛶 LIVRAISON : ${dateLabel} à ${startLabel}<br>
    ⏳ RETOUR : À récupérer à ${endLabel}<br>
    🧼 NETTOYAGE : Bloqué jusqu'à ${cleanupLabel}
  </div>
  <div class="card">
    <div class="card-head">Client</div>
    <div class="row"><span class="label">Nom</span><span class="val">${customerName}</span></div>
    <div class="row"><span class="label">Téléphone</span><span class="val"><a href="tel:${customerPhone}">${customerPhone}</a></span></div>
    <div class="row"><span class="label">Email</span><span class="val"><a href="mailto:${customerEmail}">${customerEmail}</a></span></div>
  </div>
  <div class="card">
    <div class="card-head">Commande</div>
    <div class="row"><span class="label">Durée</span><span class="val">${durationLabel}</span></div>
    <div class="row"><span class="label">Lieu</span><span class="val">${deliveryAddress}</span></div>
    <div class="row"><span class="label">Paiement</span><span class="val">Espèces sur place</span></div>
    <div class="total-row"><span class="total-label">Total</span><span class="total-val">${priceStr} XPF</span></div>
  </div>
</div></body></html>`;

  const send = (to: string, subject: string, html: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, subject, html }),
    }).catch((e) => console.error("Resend error:", e));

  await Promise.all([
    send(customerEmail, `✅ Réservation confirmée #${bookingRef} — Kayak Tahiti Delivery`, customerHtml),
    send(ownerEmail,   `🚨 Nouvelle réservation #${bookingRef} — ${customerName}`, ownerHtml),
  ]);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { duration_hours, start_datetime, delivery_address, customer_name, customer_phone, customer_email, cgv_accepted } = body;

    // Validation CGV
    if (cgv_accepted !== true) {
      return NextResponse.json(
        { error: "Vous devez accepter les Conditions Générales de Vente pour réserver." },
        { status: 400 }
      );
    }

    // Validation des champs obligatoires
    if (!duration_hours || !start_datetime || !delivery_address || !customer_name || !customer_phone || !customer_email) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires." },
        { status: 400 }
      );
    }

    const durationH = parseInt(String(duration_hours));
    if (!Number.isInteger(durationH) || !(durationH in PRICE_MAP)) {
      return NextResponse.json({ error: "Durée invalide." }, { status: 400 });
    }

    // Validation format date/heure
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(start_datetime)) {
      return NextResponse.json({ error: "Date/heure invalide." }, { status: 400 });
    }

    if (typeof delivery_address !== "string" || delivery_address.trim().length < 4) {
      return NextResponse.json({ error: "Adresse trop courte." }, { status: 400 });
    }
    if (typeof customer_name !== "string" || customer_name.trim().length < 2) {
      return NextResponse.json({ error: "Nom invalide." }, { status: 400 });
    }
    if (typeof customer_phone !== "string" || customer_phone.trim().length < 6) {
      return NextResponse.json({ error: "Téléphone invalide." }, { status: 400 });
    }
    if (typeof customer_email !== "string" || !customer_email.includes("@")) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    // Forcer UTC pour éviter la conversion fuseau-horaire local du serveur
    const startISO      = new Date(start_datetime + "Z").toISOString();
    const endISO        = addMinutes(startISO, durationH * 60);
    const cleanupEndISO = addMinutes(endISO, 90);
    const total_price   = PRICE_MAP[durationH];

    const supabase = createServerClient();

    // Vérification de conflit : [newStart, newCleanupEnd] vs [exStart, exCleanupEnd]
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .not("start_time", "is", null)
      .lt("start_time", cleanupEndISO)  // existing starts before new cleanup ends
      .gt("cleanup_end_time", startISO) // existing cleanup ends after new start
      .limit(1);

    if (conflicts && conflicts.length > 0) {
      return NextResponse.json(
        { error: "Ce créneau horaire est indisponible (période de livraison ou de nettoyage en cours)." },
        { status: 409 }
      );
    }

    // Dériver duration_type depuis duration_hours (compatibilité colonne existante)
    const duration_type = durationH <= 3 ? "hourly" : durationH === 5 ? "half_day" : "daily";

    // Insertion
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        customer_name:    customer_name.trim(),
        customer_phone:   customer_phone.trim(),
        customer_email:   customer_email.trim().toLowerCase(),
        delivery_address: delivery_address.trim(),
        duration_type,
        duration_hours:   durationH,
        start_time:       startISO,
        end_time:         endISO,
        cleanup_end_time: cleanupEndISO,
        total_price,
        quantity: 1,
        status: "confirmed",
      })
      .select("id, customer_name, delivery_address, duration_hours, start_time, end_time, cleanup_end_time, total_price, status, created_at")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Erreur lors de la création de la réservation." }, { status: 500 });
    }

    const bookingRef = data.id.slice(0, 8).toUpperCase();

    await sendEmails({
      bookingRef,
      customerName:    customer_name.trim(),
      customerPhone:   customer_phone.trim(),
      customerEmail:   customer_email.trim().toLowerCase(),
      deliveryAddress: delivery_address.trim(),
      startTime:       startISO,
      endTime:         endISO,
      cleanupEndTime:  cleanupEndISO,
      durationHours:   durationH,
      totalPrice:      total_price,
    }).catch((e) => console.error("sendEmails error:", e));

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("Booking route error:", err);
    return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET bookings error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
