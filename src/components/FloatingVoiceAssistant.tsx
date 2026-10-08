import * as React from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  RotateCcw,
  User,
  Bot,
  X,
  ChevronRight,
  ArrowLeft,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AppLogo from './AppLogo';

// ---------------------------------------------------------------------------
// Real backend: Supabase Edge Function "myfarmpal-voice" -> Modal -> N-ATLaS
//   transcribe: NCAIR1 N-ATLaS ASR (speech -> text)
//   advice:     N-ATLaS LLM (text -> text)
//   speak:      optional text-to-speech (not part of N-ATLaS)
// ---------------------------------------------------------------------------
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/myfarmpal-voice`;
const MAX_RECORD_SECONDS = 30; // the speech models take at most 30 seconds

async function callFunction(payload: Record<string, unknown>) {
  const res = await fetch(FUNCTION_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ANON_KEY}`,
      apikey: ANON_KEY,
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Something went wrong. Please try again.');
  return data;
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(new Error('Could not read the recording.'));
    r.readAsDataURL(blob);
  });
}

function getSessionId() {
  try {
    let id = localStorage.getItem('mfp_session');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('mfp_session', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

type SupportedLanguage = 'English' | 'Hausa' | 'Igbo' | 'Yoruba';

interface LanguageConfig {
  id: SupportedLanguage;
  api: 'en' | 'ha' | 'ig' | 'yo'; // code sent to the backend
  name: string;
  nativeName: string;
  flag: string;
  greeting: string;
  placeholder: string;
  quickQuestions: string[];
}

// Quick questions only cover topics that have verified answers in the backend.
// Add more once native speakers have written/approved them.
const FOUR_LANGUAGES: LanguageConfig[] = [
  {
    id: 'English',
    api: 'en',
    name: 'English',
    nativeName: 'Standard & Pidgin',
    flag: '🇳🇬',
    greeting:
      'Hello Farmer! I am your MyFarmPal Voice Assistant. Tap the microphone to speak, or type your farming question.',
    placeholder: 'Ask in English...',
    quickQuestions: [
      'How do I control fall armyworm in my maize?',
      'How do I store maize grain safely?',
    ],
  },
  {
    id: 'Hausa',
    api: 'ha',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    flag: '🌽',
    greeting:
      'Sannu Manomi! Ni ne Mataimakin Muryar MyFarmPal. Danna makirufo domin yin magana ko tambaya game da gonarka.',
    placeholder: 'Yi tambaya cikin Hausa...',
    quickQuestions: ['Yaya zan magance kwari a gonata?'],
  },
  {
    id: 'Igbo',
    api: 'ig',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    flag: '🍠',
    greeting:
      'Ndewo Onye Ọrụ Ugbo! Abụ m Onye Enyemaka Olu MyFarmPal gị. Metụ igwe okwu aka ikwu okwu ma ọ bụ jụọ ajụjụ banyere ugbo gị.',
    placeholder: "Jụọ ajụjụ n'asụsụ Igbo...",
    quickQuestions: ["Kedu ka m ga-esi gbochie ụmụ ahụhụ n'ugbo m?"],
  },
  {
    id: 'Yoruba',
    api: 'yo',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    flag: '🌾',
    greeting:
      'Ẹ n lẹ́ Àgbẹ̀! Èmi ni Olùrànlọ́wọ́ Ohùn MyFarmPal yín. Tẹ maikirofoonu láti sọ̀rọ̀ tàbí bèèrè ohunkóhun nípa oko yín.',
    placeholder: 'Bèèrè ní èdè Yorùbá...',
    quickQuestions: ['Báwo ni mo ṣe lè dẹ́kun kòkòrò nínú oko mi?'],
  },
];

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  contentEn?: string;
  showEn?: boolean;
  logId?: string;
  feedback?: boolean;
  greeting?: boolean;
  timestamp: string;
};

interface FloatingVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingVoiceAssistant({ isOpen, onClose }: FloatingVoiceAssistantProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageConfig | null>(null);
  const [isListening, setIsListening] = React.useState(false); // recording
  const [isTranscribing, setIsTranscribing] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [loadingAudioId, setLoadingAudioId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false); // waiting for the answer
  const [error, setError] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([]);

  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const recorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const streamRef = React.useRef<MediaStream | null>(null);
  const timerRef = React.useRef<number | null>(null);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const discardRef = React.useRef(false);

  const busy = isTranscribing || isTyping;

  // When the assistant closes, stop everything.
  React.useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      discardRef.current = true;
      stopRecording();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    if (selectedLanguage && isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, selectedLanguage, isOpen]);

  function handleSelectLanguage(lang: LanguageConfig) {
    setSelectedLanguage(lang);
    setError('');
    setMessages([
      {
        id: 'welcome-' + lang.id,
        role: 'assistant',
        content: lang.greeting,
        greeting: true,
        timestamp: 'Just now',
      },
    ]);
  }

  function handleBackToLanguages() {
    stopSpeaking();
    discardRef.current = true;
    stopRecording();
    setSelectedLanguage(null);
    setMessages([]);
    setInput('');
    setError('');
  }

  function handleReset() {
    stopSpeaking();
    setError('');
    if (selectedLanguage) {
      setMessages([
        {
          id: 'reset-' + Date.now(),
          role: 'assistant',
          content: selectedLanguage.greeting,
          greeting: true,
          timestamp: 'Just now',
        },
      ]);
    }
  }

  // ------------------------------------------------------------ audio out
  function stopSpeaking() {
    audioRef.current?.pause();
    audioRef.current = null;
    setIsSpeaking(false);
  }

  async function speakMessage(m: Message) {
    if (!selectedLanguage) return;
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    setError('');
    setLoadingAudioId(m.id);
    try {
      const data = await callFunction({
        action: 'speak',
        language: selectedLanguage.api,
        text: m.content,
      });
      if (!data.audio_b64) {
        setError(`Spoken answers are not available for ${selectedLanguage.name} yet.`);
        return;
      }
      const audio = new Audio(`data:${data.mime || 'audio/wav'};base64,${data.audio_b64}`);
      audioRef.current = audio;
      audio.onended = () => setIsSpeaking(false);
      await audio.play();
      setIsSpeaking(true);
    } catch (e) {
      setError('Could not play the voice. ' + (e as Error).message);
    } finally {
      setLoadingAudioId(null);
    }
  }

  // ------------------------------------------------------------- audio in
  function stopRecording() {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    const rec = recorderRef.current;
    if (rec && rec.state === 'recording') rec.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsListening(false);
  }

  async function toggleListening() {
    if (isListening) {
      stopRecording();
      return;
    }
    if (busy || !selectedLanguage) return;
    setError('');
    stopSpeaking();
    discardRef.current = false;
    const lang = selectedLanguage;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find((t) =>
        MediaRecorder.isTypeSupported(t),
      );
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      rec.onstop = async () => {
        if (discardRef.current) return;
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (blob.size < 2000) {
          setError('That was too short. Tap the microphone and speak again.');
          return;
        }
        setIsTranscribing(true);
        try {
          const audio_b64 = await blobToBase64(blob);
          const data = await callFunction({ action: 'transcribe', language: lang.api, audio_b64 });
          const text = String(data.text || '').trim();
          setIsTranscribing(false);
          if (!text) {
            setError('I could not hear you clearly. Please try again.');
            return;
          }
          await handleUserQuery(text, 'voice', lang);
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setIsTranscribing(false);
        }
      };
      rec.start();
      recorderRef.current = rec;
      setIsListening(true);
      timerRef.current = window.setTimeout(stopRecording, MAX_RECORD_SECONDS * 1000);
    } catch {
      setError('Please allow microphone access in your browser to speak.');
    }
  }

  // ------------------------------------------------------- ask N-ATLaS
  async function handleUserQuery(
    queryText: string,
    inputType: 'voice' | 'text' = 'text',
    langOverride?: LanguageConfig,
  ) {
    const lang = langOverride || selectedLanguage;
    const text = queryText.trim();
    if (!text || !lang) return;
    setError('');
    stopSpeaking();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const data = await callFunction({
        action: 'advice',
        language: lang.api,
        messages: [{ role: 'user', text }],
        input_type: inputType,
        session_id: getSessionId(),
        module: 'general',
      });
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Sorry, I could not generate an answer. Please try again.',
        contentEn: data.reply_en || undefined,
        logId: data.log_id || undefined,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsTyping(false);
    }
  }

  async function sendFeedback(m: Message, helpful: boolean) {
    setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, feedback: helpful } : x)));
    if (!m.logId) return;
    try {
      await callFunction({ action: 'feedback', log_id: m.logId, helpful });
    } catch {
      /* feedback is optional */
    }
  }

  function toggleEnglish(id: string) {
    setMessages((prev) => prev.map((x) => (x.id === id ? { ...x, showEn: !x.showEn } : x)));
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-hidden">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Floating Assistant Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-[480px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border/80 z-10"
          >
            {/* Header Bar */}
            <div className="bg-gradient-to-r from-emerald-600 via-[#4EA923] to-[#3D8F19] px-4 py-3.5 text-white flex items-center justify-between shadow-md shrink-0">
              <div className="flex items-center gap-2.5">
                {selectedLanguage ? (
                  <button
                    type="button"
                    onClick={handleBackToLanguages}
                    className="p-1 -ml-1 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
                    title="Change Language"
                  >
                    <ArrowLeft size={18} />
                  </button>
                ) : (
                  <AppLogo size="xs" showText={false} />
                )}
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5 leading-tight">
                    <span>Voice Assistant</span>
                    <span className="bg-[#FAB814] text-[#3E2400] text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                      {selectedLanguage ? selectedLanguage.name.toUpperCase() : 'LIVE'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-emerald-100 font-medium">
                    {selectedLanguage ? selectedLanguage.nativeName : 'Choose your language to begin'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {isSpeaking && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={stopSpeaking}
                    className="h-8 w-8 text-amber-200 hover:text-white hover:bg-white/15"
                    title="Stop speaking"
                  >
                    <VolumeX size={16} />
                  </Button>
                )}

                {selectedLanguage && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/15"
                    title="Reset Chat"
                  >
                    <RotateCcw size={15} />
                  </Button>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/15 rounded-full"
                  title="Close Assistant"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* SCREEN 1: LANGUAGE SELECTION */}
            {!selectedLanguage ? (
              <div className="flex-1 flex flex-col justify-between p-5 bg-gradient-to-b from-[#FCFBF7] to-white overflow-y-auto">
                <div className="text-center pt-2 pb-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100/80 text-[#4EA923] flex items-center justify-center shadow-xs mb-3">
                    <Mic size={28} />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 tracking-tight">
                    Select Your Language
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-1 max-w-[320px] mx-auto">
                    Pick your preferred language to talk directly with MyFarmPal.
                  </p>
                </div>

                <div className="space-y-2.5 my-auto">
                  {FOUR_LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.id}
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.985 }}
                      onClick={() => handleSelectLanguage(lang)}
                      className="w-full p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#4EA923] hover:shadow-md transition-all flex items-center justify-between group cursor-pointer text-left shadow-2xs"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                          {lang.flag}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#4EA923] transition-colors leading-tight">
                            {lang.name}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{lang.nativeName}</p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-[#4EA923] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                        <ChevronRight size={16} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="text-center pt-3 pb-1">
                  <p className="text-[11px] text-slate-400 font-medium">
                    🌾 Powered by N-ATLaS (Awarri Technologies · Federal Ministry of Communications,
                    Innovation and Digital Economy)
                  </p>
                </div>
              </div>
            ) : (
              /* SCREEN 2: VOICE SESSION */
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                <div className="bg-white px-4 py-2 border-b border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{selectedLanguage.flag}</span>
                    <span className="text-xs font-extrabold text-slate-900">
                      Speaking in {selectedLanguage.name}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToLanguages}
                    className="text-xs font-bold text-[#4EA923] hover:text-[#387c19] hover:underline cursor-pointer"
                  >
                    Change Language
                  </button>
                </div>

                {/* Microphone area */}
                <div className="p-4 bg-gradient-to-b from-emerald-50/50 via-white to-white flex flex-col items-center justify-center shrink-0 border-b border-slate-100">
                  <div className="relative flex items-center justify-center my-1">
                    <AnimatePresence>
                      {isListening && (
                        <>
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 2.1, opacity: 0 }}
                            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                            className="absolute inset-0 bg-[#4EA923]/30 rounded-full pointer-events-none"
                          />
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.8 }}
                            animate={{ scale: 1.7, opacity: 0 }}
                            transition={{ duration: 1.4, repeat: Infinity, delay: 0.35, ease: 'easeOut' }}
                            className="absolute inset-0 bg-[#FAB814]/40 rounded-full pointer-events-none"
                          />
                        </>
                      )}
                    </AnimatePresence>

                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={busy}
                      className={cn(
                        'relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 z-10 cursor-pointer border-3 disabled:opacity-60',
                        isListening
                          ? 'bg-gradient-to-tr from-[#3D8F19] to-[#54B82A] text-white border-amber-300 scale-105'
                          : 'bg-gradient-to-tr from-[#4EA923] to-[#3D8F19] text-white border-[#FAB814]/70 hover:border-[#FAB814] hover:scale-105',
                      )}
                      aria-label={isListening ? 'Stop recording' : 'Start speaking'}
                    >
                      {busy ? (
                        <Loader2 size={32} className="text-amber-200 animate-spin" />
                      ) : isListening ? (
                        <Volume2 size={32} className="text-amber-200 animate-pulse" />
                      ) : (
                        <Mic size={32} className="text-[#FAB814] drop-shadow-xs" />
                      )}
                      <span className="text-[9px] font-black uppercase text-white/95 mt-0.5">
                        {busy ? 'Wait' : isListening ? 'Stop' : 'Speak'}
                      </span>
                    </button>
                  </div>

                  <p
                    className={cn(
                      'text-xs font-bold mt-2 transition-colors text-center',
                      isListening
                        ? 'text-[#4EA923] animate-pulse'
                        : isSpeaking
                          ? 'text-[#FAB814]'
                          : 'text-slate-500',
                    )}
                  >
                    {isListening
                      ? `Listening in ${selectedLanguage.name}... tap to stop`
                      : isTranscribing
                        ? 'Understanding what you said...'
                        : isTyping
                          ? 'Preparing your answer... the first one can take a while'
                          : isSpeaking
                            ? '🔊 Speaking response...'
                            : 'Tap the microphone to speak, or pick a question'}
                  </p>

                  <div className="flex items-center gap-1.5 overflow-x-auto w-full pt-2.5 pb-0.5 scrollbar-none">
                    {selectedLanguage.quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={busy || isListening}
                        onClick={() => handleUserQuery(q, 'text')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/60 text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-50"
                      >
                        <Sparkles size={10} className="text-[#FAB814]" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-2 max-w-[92%]',
                        m.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto',
                      )}
                    >
                      <div
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-0.5',
                          m.role === 'user' ? 'bg-slate-800 text-white' : 'bg-[#4EA923] text-white',
                        )}
                      >
                        {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      </div>

                      <div
                        className={cn(
                          'rounded-2xl p-2.5 text-xs shadow-xs',
                          m.role === 'user'
                            ? 'bg-gradient-to-r from-emerald-600 to-[#4EA923] text-white rounded-tr-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs',
                        )}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                        {m.showEn && m.contentEn && (
                          <p className="mt-1.5 pt-1.5 border-t border-slate-100 text-slate-500 leading-relaxed whitespace-pre-wrap">
                            {m.contentEn}
                          </p>
                        )}

                        <div
                          className={cn(
                            'flex items-center justify-between gap-3 mt-1.5 pt-1 border-t text-[9px]',
                            m.role === 'user'
                              ? 'border-white/20 text-emerald-100'
                              : 'border-slate-100 text-slate-400',
                          )}
                        >
                          <span>{m.timestamp}</span>

                          {m.role === 'assistant' && !m.greeting && (
                            <div className="flex items-center gap-2.5">
                              {m.contentEn && (
                                <button
                                  type="button"
                                  onClick={() => toggleEnglish(m.id)}
                                  className="hover:text-emerald-700 font-semibold cursor-pointer"
                                >
                                  {m.showEn ? 'Hide English' : 'English'}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => speakMessage(m)}
                                disabled={loadingAudioId === m.id}
                                className="hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                                title="Listen"
                              >
                                {loadingAudioId === m.id ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  <Volume2 size={11} />
                                )}
                                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => sendFeedback(m, true)}
                                disabled={m.feedback !== undefined}
                                aria-label="Helpful"
                                className={cn(
                                  'cursor-pointer',
                                  m.feedback === true && 'text-emerald-600',
                                )}
                              >
                                <ThumbsUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => sendFeedback(m, false)}
                                disabled={m.feedback !== undefined}
                                aria-label="Not helpful"
                                className={cn('cursor-pointer', m.feedback === false && 'text-rose-600')}
                              >
                                <ThumbsDown size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {isTyping && (
                    <div className="flex gap-2 max-w-[80%] items-center mr-auto">
                      <div className="w-6 h-6 rounded-full bg-[#4EA923] text-white flex items-center justify-center shrink-0">
                        <Bot size={12} />
                      </div>
                      <div className="bg-white rounded-2xl p-2 border border-slate-200 flex items-center gap-1 shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4EA923] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4EA923] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4EA923] animate-bounce [animation-delay:0.4s]" />
                        <span className="text-[10px] font-semibold text-slate-500 ml-1">Thinking...</span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {error && (
                  <p className="px-3 pb-1 text-[11px] font-medium text-rose-600">{error}</p>
                )}

                {/* Input bar */}
                <div className="p-2.5 border-t border-slate-200 bg-white shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUserQuery(input, 'text');
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={toggleListening}
                      disabled={busy}
                      className={cn(
                        'p-2 rounded-xl border transition-all cursor-pointer shrink-0 disabled:opacity-50',
                        isListening
                          ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                          : 'bg-emerald-50 border-emerald-200 text-[#4EA923] hover:bg-emerald-100',
                      )}
                      title="Speak"
                    >
                      <Mic size={16} />
                    </button>

                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={selectedLanguage.placeholder}
                      className="flex-1 bg-slate-50 border-slate-200 rounded-xl text-xs h-9 focus-visible:ring-emerald-500 font-medium"
                    />

                    <Button
                      type="submit"
                      disabled={!input.trim() || busy || isListening}
                      size="sm"
                      className="bg-[#4EA923] hover:bg-[#3D8F19] text-white rounded-xl h-9 px-3 font-bold shadow-xs shrink-0"
                    >
                      <Send size={13} />
                      <span className="ml-1 text-xs">Send</span>
                    </Button>
                  </form>
                  <p className="text-[9px] text-slate-400 text-center mt-1.5 leading-snug">
                    AI answers can be wrong. Confirm pesticide advice with your local extension
                    officer. Questions are saved to improve the app.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
