import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

// Returns blocked intervals (in minutes from midnight) for a given date,
// including the 1h30 cleanup buffer after each booking.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Date invalide." }, { status: 400 });
  }

  const supabase = createServerClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("start_time, cleanup_end_time")
    .gte("start_time", `${date}T00:00:00`)
    .lt("start_time",  `${date}T23:59:59`)
    .not("start_time", "is", null)
    .not("cleanup_end_time", "is", null);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Convert timestamps to minutes-from-midnight for easy client comparison
  const blockedIntervals = (data || []).map((b) => {
    const toMins = (iso: string) => {
      // Parse "YYYY-MM-DDTHH:MM:SS..." and extract H:M
      const timePart = iso.substring(11, 16); // "HH:MM"
      const [h, m] = timePart.split(":").map(Number);
      return h * 60 + m;
    };
    return {
      startMins:       toMins(b.start_time as string),
      cleanupEndMins:  toMins(b.cleanup_end_time as string),
    };
  });

  return NextResponse.json({ blockedIntervals });
}
