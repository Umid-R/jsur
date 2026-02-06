import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AdaPrayerLog {
  prayer: string;
  status: "completed" | "missed";
  reason?: string;
}

interface RequestPayload {
  user_id: string;
  prayers: AdaPrayerLog[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload: RequestPayload = await req.json();
    const { user_id, prayers } = payload;

    if (!user_id || !prayers || !Array.isArray(prayers)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid request: user_id and prayers array required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const dataToInsert = prayers.map((prayer: AdaPrayerLog) => ({
      user_id,
      prayer_date: today,
      prayer_name: prayer.prayer.toLowerCase(),
      completed: prayer.status === "completed",
      missed: prayer.status === "missed",
      missed_reason: prayer.status === "missed" ? prayer.reason || null : null,
    }));

    const { error } = await supabase.from("daily_prayers").upsert(dataToInsert, {
      onConflict: "user_id,prayer_date,prayer_name",
    });

    if (error) {
      console.error("Database error:", error);
      throw new Error(`Failed to log ada prayers: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Ada prayers logged successfully",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
