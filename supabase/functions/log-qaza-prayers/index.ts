import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface QazaPayload {
  user_id: string;
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
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

    const payload: QazaPayload = await req.json();
    const { user_id, fajr, dhuhr, asr, maghrib, isha } = payload;

    if (!user_id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid request: user_id required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    const { error: logError } = await supabase.from("qaza_logs").insert({
      user_id,
      log_date: today,
      fajr_count: fajr || 0,
      dhuhr_count: dhuhr || 0,
      asr_count: asr || 0,
      maghrib_count: maghrib || 0,
      isha_count: isha || 0,
      log_type: "added",
    });

    if (logError) {
      console.error("Error inserting qaza log:", logError);
      throw new Error(`Failed to log qaza: ${logError.message}`);
    }

    const { data: existingTotals, error: fetchError } = await supabase
      .from("qaza_totals")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw new Error(`Failed to fetch qaza totals: ${fetchError.message}`);
    }

    if (existingTotals) {
      const { error: updateError } = await supabase
        .from("qaza_totals")
        .update({
          fajr_total: (existingTotals.fajr_total || 0) + (fajr || 0),
          dhuhr_total: (existingTotals.dhuhr_total || 0) + (dhuhr || 0),
          asr_total: (existingTotals.asr_total || 0) + (asr || 0),
          maghrib_total: (existingTotals.maghrib_total || 0) + (maghrib || 0),
          isha_total: (existingTotals.isha_total || 0) + (isha || 0),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user_id);

      if (updateError) {
        throw new Error(`Failed to update qaza totals: ${updateError.message}`);
      }
    } else {
      const { error: insertError } = await supabase
        .from("qaza_totals")
        .insert({
          user_id,
          fajr_total: fajr || 0,
          dhuhr_total: dhuhr || 0,
          asr_total: asr || 0,
          maghrib_total: maghrib || 0,
          isha_total: isha || 0,
          updated_at: new Date().toISOString(),
        });

      if (insertError) {
        throw new Error(`Failed to create qaza totals: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Qaza prayers logged successfully",
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
