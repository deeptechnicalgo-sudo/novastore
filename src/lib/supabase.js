import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://hxdgejfcctehqxahnocx.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_dCa0H12rWggzh-Ev3VF4Kg_M5iv4hjB";

export const supabase = createClient(supabaseUrl, supabaseKey);
