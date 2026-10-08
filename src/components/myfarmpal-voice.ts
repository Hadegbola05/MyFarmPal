// Supabase Edge Function: myfarmpal-voice
// Sits between your React app and the Modal backend (N-ATLaS + NCAIR1 ASR).
// Keeps the Modal API key private and logs each interaction for validation evidence.
//
// Secrets to add in Supabase (Edge Functions -> Secrets):
//   MODAL_API_KEY, MODAL_ASR_URL, MODAL_ADVICE_URL
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically.)
//
// Actions (POST JSON body):
//   {action:"transcribe", language, audio_b64}                    -> {text}
//   {action:"advice", language, messages, input_type, session_id, module}
//                                                                 -> {reply, reply_en, log_id}
//   {action:"feedback", log_id, helpful}                          -> {ok:true}
//   {action:"speak", language, text}                              -> {audio_b64, mime}
// Optional extra secret for voice output: MODAL_TTS_URL
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LANGS = ["en", "ha", "yo", "ig"];
const MAX_AUDIO_B64 = 4_000_000; // roughly 3 MB of audio
const MAX_TEXT = 1000;

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const modalKey = Deno.env.get("MODAL_API_KEY");
    const asrUrl = Deno.env.get("MODAL_ASR_URL");
    const adviceUrl = Deno.env.get("MODAL_ADVICE_URL");
    const ttsUrl = Deno.env.get("MODAL_TTS_URL"); // optional
    if (!modalKey || !asrUrl || !adviceUrl) {
      return json({ error: "Service not configured" }, 500);
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    async function callModal(url: string, payload: Record<string, unknown>) {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: modalKey, ...payload }),
        signal: AbortSignal.timeout(140_000),
      });
      if (!res.ok) {
        throw new Error(`Backend returned ${res.status}: ${await res.text()}`);
      }
      return await res.json();
    }

    const body = await req.json();
    const action = body?.action;

    // ---------------------------------------------------------- transcribe
    if (action === "transcribe") {
      const { language, audio_b64 } = body;
      if (!LANGS.includes(language)) {
        return json({ error: "Unsupported language" }, 400);
      }
      if (
        typeof audio_b64 !== "string" ||
        audio_b64.length === 0 ||
        audio_b64.length > MAX_AUDIO_B64
      ) {
        return json({ error: "Invalid audio" }, 400);
      }
      const data = await callModal(asrUrl, { language, audio_b64 });
      return json({ text: data.text ?? "" });
    }

    // -------------------------------------------------------------- advice
    if (action === "advice") {
      const { language, messages, input_type, session_id, module } = body;
      if (!LANGS.includes(language)) {
        return json({ error: "Unsupported language" }, 400);
      }
      if (!Array.isArray(messages) || messages.length === 0) {
        return json({ error: "messages is required" }, 400);
      }

      const clean = messages.slice(-8).map((m: { role?: string; text?: unknown }) => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        text: String(m?.text ?? "").slice(0, MAX_TEXT),
      }));
      const lastUser =
        [...clean].reverse().find((m) => m.role === "user")?.text ?? "";

      const data = await callModal(adviceUrl, {
        language,
        messages: clean,
        mode: "translate",
      });

      let logId: string | null = null;
      const { data: row, error } = await sb
        .from("interactions")
        .insert({
          language,
          module: typeof module === "string" ? module.slice(0, 50) : null,
          input_type: input_type === "voice" ? "voice" : "text",
          session_id: typeof session_id === "string" ? session_id.slice(0, 100) : null,
          question_text: lastUser,
          answer_text: data.reply ?? null,
          answer_en: data.reply_en ?? null,
        })
        .select("id")
        .single();
      if (error) console.error("Log insert failed:", error.message);
      else logId = row.id;

      return json({
        reply: data.reply ?? "",
        reply_en: data.reply_en ?? null,
        log_id: logId,
      });
    }

    // --------------------------------------------------------------- speak
    if (action === "speak") {
      const { language, text } = body;
      if (!LANGS.includes(language)) {
        return json({ error: "Unsupported language" }, 400);
      }
      if (typeof text !== "string" || !text.trim()) {
        return json({ error: "text is required" }, 400);
      }
      if (!ttsUrl) return json({ audio_b64: null });
      try {
        const data = await callModal(ttsUrl, { language, text: text.slice(0, 600) });
        return json({ audio_b64: data.audio_b64 ?? null, mime: data.mime ?? "audio/wav" });
      } catch (e) {
        console.error("speak failed:", e);
        return json({ audio_b64: null }); // the app then shows "voice not available"
      }
    }

    // ------------------------------------------------------------ feedback
    if (action === "feedback") {
      const { log_id, helpful } = body;
      if (typeof log_id !== "string" || typeof helpful !== "boolean") {
        return json({ error: "log_id and helpful are required" }, 400);
      }
      const { error } = await sb
        .from("interactions")
        .update({ helpful })
        .eq("id", log_id);
      if (error) {
        console.error("Feedback update failed:", error.message);
        return json({ error: "Could not save feedback" }, 500);
      }
      return json({ ok: true });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("myfarmpal-voice error:", e);
    return json({ error: "Service temporarily unavailable. Please try again." }, 502);
  }
});
