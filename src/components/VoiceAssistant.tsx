import { useRef, useState } from "react";
import { Mic, Square, Loader2, ThumbsUp, ThumbsDown, Send, Volume2 } from "lucide-react";

// Reads the same variables your app already uses for Supabase.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/myfarmpal-voice`;

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "ha", label: "Hausa" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
];
const MAX_SECONDS = 30; // the speech models take at most 30 seconds

async function callFunction(payload: Record<string, unknown>) {
  const res = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] ?? "");
    r.onerror = () => reject(new Error("Could not read the recording."));
    r.readAsDataURL(blob);
  });
}

function getSessionId() {
  try {
    let id = localStorage.getItem("mfp_session");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("mfp_session", id);
    }
    return id;
  } catch {
    return "anon";
  }
}

export default function VoiceAssistant() {
  const [lang, setLang] = useState("en");
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState<"" | "listening" | "thinking">("");
  const [typed, setTyped] = useState("");
  const [question, setQuestion] = useState("");
  const [reply, setReply] = useState("");
  const [replyEn, setReplyEn] = useState("");
  const [showEn, setShowEn] = useState(false);
  const [logId, setLogId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [replyLang, setReplyLang] = useState("en");
  const [audioSrc, setAudioSrc] = useState("");
  const [audioState, setAudioState] = useState<"" | "loading" | "playing" | "unavailable">("");

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function ask(text: string, inputType: "voice" | "text") {
    setBusy("thinking");
    setReply("");
    setReplyEn("");
    setShowEn(false);
    setLogId(null);
    setFeedback(null);
    setError("");
    stopAudio();
    setAudioSrc("");
    setAudioState("");
    try {
      const data = await callFunction({
        action: "advice",
        language: lang,
        messages: [{ role: "user", text }],
        input_type: inputType,
        session_id: getSessionId(),
        module: "general",
      });
      setReply(data.reply || "");
      setReplyEn(data.reply_en || "");
      setLogId(data.log_id || null);
      setReplyLang(lang);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  async function startRecording() {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((t) =>
        MediaRecorder.isTypeSupported(t),
      );
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size < 2000) {
          setError("That was too short. Please tap the mic and speak again.");
          return;
        }
        setBusy("listening");
        try {
          const audio_b64 = await blobToBase64(blob);
          const data = await callFunction({ action: "transcribe", language: lang, audio_b64 });
          const text = (data.text || "").trim();
          if (!text) {
            setError("I could not hear you clearly. Please try again.");
            setBusy("");
            return;
          }
          setQuestion(text);
          await ask(text, "voice");
        } catch (e) {
          setError((e as Error).message);
          setBusy("");
        }
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      timerRef.current = window.setTimeout(stopRecording, MAX_SECONDS * 1000);
    } catch {
      setError("Please allow microphone access in your browser to speak.");
    }
  }

  function stopRecording() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false);
  }

  async function sendFeedback(helpful: boolean) {
    setFeedback(helpful);
    if (!logId) return;
    try {
      await callFunction({ action: "feedback", log_id: logId, helpful });
    } catch {
      /* feedback is optional; ignore failures */
    }
  }

  function submitTyped() {
    const text = typed.trim();
    if (!text || busy) return;
    setQuestion(text);
    setTyped("");
    ask(text, "text");
  }

  function stopAudio() {
    audioRef.current?.pause();
    audioRef.current = null;
  }

  async function listen() {
    if (audioState === "playing") {
      stopAudio();
      setAudioState("");
      return;
    }
    setError("");
    try {
      let src = audioSrc;
      if (!src) {
        setAudioState("loading");
        const data = await callFunction({ action: "speak", language: replyLang, text: reply });
        if (!data.audio_b64) {
          setAudioState("unavailable");
          return;
        }
        src = `data:${data.mime || "audio/wav"};base64,${data.audio_b64}`;
        setAudioSrc(src);
      }
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => setAudioState("");
      await audio.play();
      setAudioState("playing");
    } catch (e) {
      setAudioState("");
      setError("Could not play the voice. " + (e as Error).message);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-5 p-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          My<span className="text-green-600">Farm</span>
          <span className="text-amber-500">Pal</span>
        </h2>
        <p className="text-sm text-gray-600">Your Farm Pal. Your Language.</p>
      </div>

      {/* Language picker */}
      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Choose language">
        {LANGUAGES.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            disabled={recording || !!busy}
            className={`rounded-xl border px-2 py-3 text-sm font-semibold ${
              lang === l.code
                ? "border-green-600 bg-green-600 text-white"
                : "border-gray-300 bg-white text-gray-800"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={!!busy}
          aria-label={recording ? "Stop recording" : "Start speaking"}
          className={`flex h-24 w-24 items-center justify-center rounded-full text-white shadow-lg ${
            recording ? "animate-pulse bg-red-600" : "bg-green-600"
          } disabled:opacity-50`}
        >
          {busy ? (
            <Loader2 className="h-10 w-10 animate-spin" />
          ) : recording ? (
            <Square className="h-9 w-9" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </button>
        <p className="text-sm text-gray-700">
          {recording
            ? "Listening... tap to stop"
            : busy === "listening"
              ? "Understanding what you said..."
              : busy === "thinking"
                ? "Preparing your answer... this can take a while the first time"
                : "Tap the mic and ask your farming question"}
        </p>
      </div>

      {/* Typed fallback */}
      <div className="flex gap-2">
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submitTyped()}
          placeholder="Or type your question"
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          onClick={submitTyped}
          disabled={!typed.trim() || !!busy || recording}
          aria-label="Send question"
          className="rounded-xl bg-green-600 px-3 text-white disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>

      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {question && (
        <p className="text-sm text-gray-600">
          <span className="font-semibold">You asked:</span> {question}
        </p>
      )}

      {/* Answer card */}
      {reply && (
        <div className="space-y-3 rounded-2xl border border-green-200 bg-green-50 p-4">
          <p className="whitespace-pre-line text-base leading-relaxed">{reply}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={listen}
              disabled={audioState === "loading"}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {audioState === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
              {audioState === "playing" ? "Stop" : "Listen"}
            </button>
            {audioState === "unavailable" && (
              <span className="text-xs text-gray-600">
                Voice is not available for this language yet.
              </span>
            )}
          </div>

          {replyEn && (
            <div>
              <button
                onClick={() => setShowEn(!showEn)}
                className="text-sm font-semibold text-green-700 underline"
              >
                {showEn ? "Hide English" : "Show English"}
              </button>
              {showEn && <p className="mt-2 text-sm text-gray-700">{replyEn}</p>}
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-green-200 pt-3">
            <span className="text-sm">Was this helpful?</span>
            <button
              onClick={() => sendFeedback(true)}
              disabled={feedback !== null}
              aria-label="Helpful"
              className={`rounded-full p-2 ${feedback === true ? "bg-green-600 text-white" : "bg-white"}`}
            >
              <ThumbsUp className="h-5 w-5" />
            </button>
            <button
              onClick={() => sendFeedback(false)}
              disabled={feedback !== null}
              aria-label="Not helpful"
              className={`rounded-full p-2 ${feedback === false ? "bg-red-600 text-white" : "bg-white"}`}
            >
              <ThumbsDown className="h-5 w-5" />
            </button>
            {feedback !== null && <span className="text-sm text-gray-600">Thank you!</span>}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-500">
        Answers are AI-generated and may contain mistakes. Confirm important decisions,
        especially about pesticides, with your local agricultural extension officer. Your
        questions are saved to help improve the app.
      </p>
    </div>
  );
}
