import { createClient } from "@supabase/supabase-js";

const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BookingStatus = "pending" | "confirmed" | "delivered";

export interface Booking {
  id:               string;
  customer_name:    string;
  customer_phone:   string;
  customer_email:   string;
  quantity:         number;
  delivery_address: string;
  duration_hours:   number;
  start_time:       string; // ISO timestamptz
  end_time:         string; // ISO timestamptz
  cleanup_end_time: string; // ISO timestamptz (end + 1h30)
  total_price:      number;
  status:           BookingStatus;
  created_at:       string;
}

export function createServerClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) return createClient(supabaseUrl, serviceKey);
  return createClient(supabaseUrl, supabaseAnonKey);
}
