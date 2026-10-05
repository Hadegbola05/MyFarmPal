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
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type SupportedLanguage = 'English' | 'Hausa' | 'Igbo' | 'Yoruba';

interface LanguageConfig {
  id: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  code: string;
  greeting: string;
  placeholder: string;
  quickQuestions: string[];
}

const FOUR_LANGUAGES: LanguageConfig[] = [
  {
    id: 'English',
    name: 'English',
    nativeName: 'Standard & Pidgin',
    flag: '🇳🇬',
    code: 'en-NG',
    greeting: 'Hello Farmer! I am your MyFarmPal Voice Assistant. Tap the microphone to speak, or ask me anything about your farm.',
    placeholder: 'Ask any farm question in English or Pidgin...',
    quickQuestions: [
      "When should I apply NPK to maize?",
      "What is the current cassava price in Mile 12?",
      "Will it rain in my region this week?",
      "How do I control fall armyworm in my crops?"
    ]
  },
  {
    id: 'Hausa',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    flag: '🌽',
    code: 'ha-NG',
    greeting: 'Sannu Manomi! Ni ne Mataimakin Muryar MyFarmPal. Danna makirufo domin yin magana ko tambaya game da gonarka.',
    placeholder: 'Yi tambaya game da gonarka cikin Hausa...',
    quickQuestions: [
      "Yaushe zan zuba takin NPK ga masara?",
      "Nawa ne kudin hatsi a kasuwa yanzu?",
      "Za a yi ruwan sama a wannan makon?",
      "Yaya zan magance kwari a gonata?"
    ]
  },
  {
    id: 'Igbo',
    name: 'Igbo',
    nativeName: 'Asụsụ Igbo',
    flag: '🍠',
    code: 'ig-NG',
    greeting: 'Ndewo Onye Ọrụ Ugbo! Abụ m Onye Enyemaka Olu MyFarmPal gị. Metụ igwe okwu aka ikwu okwu ma ọ bụ jụọ ajụjụ banyere ugbo gị.',
    placeholder: 'Jụọ ajụjụ banyere ọrụ ugbo n\'asụsụ Igbo...',
    quickQuestions: [
      "Kedu mgbe a ga-agba fatịlaịza NPK n'ọka?",
      "Ego ole ka akpu na-ere n'ahịa ugbua?",
      "Mmiri ozuzo ọ ga-ezo n'izu a?",
      "Kedu ka m ga-esi gbochie ụmụ ahụhụ n'ugbo m?"
    ]
  },
  {
    id: 'Yoruba',
    name: 'Yoruba',
    nativeName: 'Èdè Yorùbá',
    flag: '🌾',
    code: 'yo-NG',
    greeting: 'Ẹ n lẹ́ Àgbẹ̀! Èmi ni Olùrànlọ́wọ́ Ohùn MyFarmPal yín. Tẹ maikirofoonu láti sọ̀rọ̀ tàbí bèèrè ohunkóhun nípa oko yín.',
    placeholder: 'Bèèrè ìbéèrè iṣẹ́ àgbẹ̀ ní èdè Yorùbá...',
    quickQuestions: [
      "Ìgbà wo ni kí n bọ ajílẹ̀ NPK s'oko àgbàdo?",
      "Èló ni àpò gbágùúdá tàbí iṣu l'ọ́jà?",
      "Ǹjẹ́ òjò máa rọ̀ ní ọ̀sẹ̀ yìí?",
      "Báwo ni mo ṣe lè dẹ́kun kòkòrò nínú oko mi?"
    ]
  }
];

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
};

export default function VoiceAssistant() {
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageConfig | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = React.useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (selectedLanguage) {
      scrollToBottom();
    }
  }, [messages, isTyping, selectedLanguage]);

  const handleSelectLanguage = (lang: LanguageConfig) => {
    setSelectedLanguage(lang);
    const welcomeMsg: Message = {
      id: 'welcome-' + lang.id,
      role: 'assistant',
      content: lang.greeting,
      timestamp: 'Just now'
    };
    setMessages([welcomeMsg]);
    speakText(lang.greeting, lang.code);
  };

  const handleBackToLanguages = () => {
    stopSpeaking();
    setIsListening(false);
    setSelectedLanguage(null);
    setMessages([]);
    setInput('');
  };

  const speakText = (text: string, customCode?: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.lang = customCode || selectedLanguage?.code || 'en-NG';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = selectedLanguage?.code || 'en-NG';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setIsListening(false);
          if (transcript) {
            handleUserQuery(transcript);
          }
        };

        recognition.onerror = () => {
          setIsListening(false);
          simulateVoiceInput();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback simulation below
      }
    }

    simulateVoiceInput();
  };

  const simulateVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const questions = selectedLanguage?.quickQuestions || FOUR_LANGUAGES[0].quickQuestions;
      const randomQuery = questions[Math.floor(Math.random() * questions.length)];
      handleUserQuery(randomQuery);
    }, 2000);
  };

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let response = "Based on current agronomic advisory, ensure adequate soil moisture before top-dressing fertilizer.";
      const lower = queryText.toLowerCase();

      if (selectedLanguage?.id === 'Hausa') {
        if (lower.includes('taki') || lower.includes('npk') || lower.includes('masara')) {
          response = "Ga masara, a zuba takin NPK 15:15:15 bayan mako 2 zuwa 3 da shuka. Bayan haka a kara takin Urea a mako na 5 kafin fitar fure domin samun yabanya mai kyau.";
        } else if (lower.includes('kudi') || lower.includes('kasuwa') || lower.includes('hatsi')) {
          response = "Kudin buhun masara a kasuwannin Arewa yanzu yana tsakanin ₦45,000 zuwa ₦52,000 dangane da inganci.";
        } else if (lower.includes('ruwa') || lower.includes('sama')) {
          response = "Hasashen yanayi ya nuna za a iya samun ruwan sama a tsakiyar mako tare da yanayi mai dumi mai kyau ga shuka.";
        } else {
          response = "Don magance kwari, a fesa maganin kwari da sassafe ko da yamma, sannan a tabbatar da tsaftar gona.";
        }
      } else if (selectedLanguage?.id === 'Igbo') {
        if (lower.includes('fatịlaịza') || lower.includes('npk') || lower.includes('ọka')) {
          response = "Maka ọka, tinye fatịlaịza NPK 15:15:15 izu abụọ ma ọ bụ atọ mgbe a kụsịrị ya. Mgbe izu ise gasịrị, tinye Urea tupu ọ gbawaa ifuru maka ezigbo owuwe ihe ubi.";
        } else if (lower.includes('ego') || lower.includes('ahịa') || lower.includes('akpu')) {
          response = "Akpa akpu na-ere ugbu a ihe dịka ₦48,000 n'ahịa ndị dị na South-East na Mile 12, ọnụahịa na-arị elu n'ihi nnukwu mkpa.";
        } else if (lower.includes('mmiri') || lower.includes('ozuzo')) {
          response = "Mmiri ozuzo nwere ike izo n'ehihie a, ezigbo oge iji kụọ mkpụrụ osisi ma ọ bụ fesa ọgwụ ahịhịa.";
        } else {
          response = "Iji gbochie ụmụ ahụhụ, fesa ọgwụ kwesịrị ekwesị n'ụtụtụ ma ọ bụ n'anyasị ozugbo n'ime akwụkwọ ọka.";
        }
      } else if (selectedLanguage?.id === 'Yoruba') {
        if (lower.includes('ajílẹ̀') || lower.includes('npk') || lower.includes('àgbàdo')) {
          response = "Fún àgbàdo, bu ajílẹ̀ NPK 15:15:15 sí i ní ọ̀sẹ̀ méjì sí mẹ́ta lẹ́yìn gbígbin. Lẹ́yìn náà, fi Urea kún un ní ọ̀sẹ̀ karùn-ún kí ó tó bẹ̀rẹ̀ sí í yọ ìtànná fún ìkórè gidi.";
        } else if (lower.includes('owó') || lower.includes('èló') || lower.includes('ọjà') || lower.includes('gbágùúdá')) {
          response = "Àpò gbágùúdá 100kg wà ní nǹkan bí ₦48,000 ní ọjà Mile 12 àti Bodija ní ọ̀sẹ̀ yìí, owó rẹ̀ sì ń fi ìdá mẹ́rin hàn sí i.";
        } else if (lower.includes('òjò')) {
          response = "Àyẹ̀wò ojú ọjọ́ fi hàn pé òjò fẹ́rẹ̀ẹ́ rọ̀ ní ọ̀sán pẹ̀lú ooru tó dọ́gba, èyí dára púpọ̀ fún gbígbin irúgbìn tuntun.";
        } else {
          response = "Láti dẹ́kun kòkòrò legbele nínú oko, fún oògùn kòkòrò Emamectin ní àárọ̀ kùtùkùtù tàbí ìrọ̀lẹ́ tààrà sínú ewé àgbàdo.";
        }
      } else {
        // English
        if (lower.includes('npk') || lower.includes('fertilizer') || lower.includes('maize')) {
          response = "For maize, apply NPK 15:15:15 at 2 to 3 weeks after planting (approx. 50kg/plot). Follow with Urea top-dressing at 5 to 6 weeks before tasseling.";
        } else if (lower.includes('cassava') || lower.includes('price')) {
          response = "Cassava tubers currently average ₦48,000 per 100kg bag in major South-West markets including Mile 12 and Bodija, showing a 4% increase this week.";
        } else if (lower.includes('rain') || lower.includes('weather')) {
          response = "Weather forecast predicts a 65% chance of afternoon showers with average temperatures around 31°C. Great conditions for planting!";
        } else if (lower.includes('armyworm') || lower.includes('pest')) {
          response = "Fall armyworm should be handled early. Spray Emamectin Benzoate 5% SG directly into the leaf whorls in the early morning or evening.";
        }
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
      speakText(response);
    }, 1100);
  };

  const handleReset = () => {
    stopSpeaking();
    if (selectedLanguage) {
      setMessages([
        {
          id: 'reset-' + Date.now(),
          role: 'assistant',
          content: selectedLanguage.greeting,
          timestamp: 'Just now'
        }
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-[#4EA923] to-[#3D8F19] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge className="bg-[#FAB814] text-[#3E2400] font-bold border-none px-3 py-1 shadow-sm">
                🎙️ Multilingual Voice Assistant
              </Badge>
              {selectedLanguage && (
                <Badge className="bg-white/20 text-white font-semibold backdrop-blur-md border-white/30">
                  {selectedLanguage.name.toUpperCase()}
                </Badge>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Farm Voice Companion
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl font-medium">
              Speak naturally in your preferred Nigerian language. Ask anything about crops, pests, prices, and weather.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {isSpeaking && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopSpeaking}
                className="bg-white/20 hover:bg-white/30 text-white border-white/40 gap-1.5 font-bold shadow-sm"
              >
                <VolumeX size={16} />
                <span>Stop</span>
              </Button>
            )}

            {selectedLanguage && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToLanguages}
                className="bg-white/10 hover:bg-white/20 text-white border-white/30 gap-1.5 font-semibold"
              >
                <ArrowLeft size={15} />
                <span>Change Language</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* SCREEN 1: 4-LANGUAGE SELECTION */}
      {!selectedLanguage ? (
        <Card className="border border-border/80 shadow-md bg-white p-6 sm:p-10 text-center">
          <div className="max-w-md mx-auto space-y-3 mb-8">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 text-[#4EA923] flex items-center justify-center shadow-xs">
              <Mic size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Select Your Language
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Choose one of the 4 supported languages to begin your voice session with MyFarmPal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {FOUR_LANGUAGES.map((lang) => (
              <motion.button
                key={lang.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectLanguage(lang)}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#4EA923] hover:shadow-lg transition-all flex items-center justify-between group cursor-pointer text-left shadow-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                    {lang.flag}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#4EA923] transition-colors">
                      {lang.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      {lang.nativeName}
                    </p>
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-[#4EA923] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shrink-0">
                  <ChevronRight size={20} />
                </div>
              </motion.button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400 font-medium">
              🌿 Pure Nigerian localized voice intelligence • Available in English, Hausa, Igbo, and Yoruba
            </p>
          </div>
        </Card>
      ) : (
        /* SCREEN 2: UNCONGESTED VOICE SESSION */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Mic */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-border/80 shadow-md bg-white overflow-hidden text-center">
              <CardHeader className="pb-3 border-b border-slate-100 bg-[#FCFBF7] flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>{selectedLanguage.flag}</span>
                    <span>{selectedLanguage.name} Voice Session</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-left">
                    {selectedLanguage.nativeName}
                  </CardDescription>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToLanguages}
                  className="text-xs text-[#4EA923] font-bold hover:bg-emerald-50"
                >
                  Change
                </Button>
              </CardHeader>

              <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center my-4">
                  <AnimatePresence>
                    {isListening && (
                      <>
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 2.2, opacity: 0 }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                          className="absolute inset-0 bg-[#4EA923]/30 rounded-full"
                        />
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0.8 }}
                          animate={{ scale: 1.8, opacity: 0 }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4, ease: 'easeOut' }}
                          className="absolute inset-0 bg-[#FAB814]/40 rounded-full"
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      "relative w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-300 z-10 cursor-pointer border-4",
                      isListening
                        ? "bg-gradient-to-tr from-[#3D8F19] to-[#54B82A] text-white border-amber-300 scale-105"
                        : "bg-gradient-to-tr from-[#4EA923] to-[#3D8F19] text-white border-[#FAB814]/60 hover:border-[#FAB814] hover:scale-105"
                    )}
                    aria-label="Toggle Voice Listening"
                  >
                    {isListening ? (
                      <Volume2 size={54} className="text-amber-200 animate-pulse" />
                    ) : (
                      <Mic size={54} className="text-[#FAB814] drop-shadow-sm" />
                    )}

                    <span className="text-[11px] font-black tracking-wider uppercase mt-1 text-white/95">
                      {isListening ? "Listening..." : "Tap to Speak"}
                    </span>
                  </button>
                </div>

                <div className="mt-4">
                  <p className={cn(
                    "text-sm font-bold transition-colors",
                    isListening ? "text-[#4EA923] animate-pulse" : isSpeaking ? "text-[#FAB814]" : "text-slate-500"
                  )}>
                    {isListening 
                      ? `Listening in ${selectedLanguage.name}... Speak now!` 
                      : isSpeaking 
                      ? "🔊 Speaking response..." 
                      : "Tap microphone to speak or type below"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Audio plays automatically in natural {selectedLanguage.name} accent
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Prompts for that Language */}
            <Card className="border border-border/80 shadow-xs bg-white">
              <CardHeader className="pb-2.5">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-[#FAB814]" />
                  <span>Popular Farm Inquiries ({selectedLanguage.name})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {selectedLanguage.quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleUserQuery(q)}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-100 hover:border-emerald-200 text-xs font-medium transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <span className="line-clamp-1 italic">"{q}"</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-[#4EA923] shrink-0 ml-2" />
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Live Conversation */}
          <div className="lg:col-span-7 flex flex-col h-[600px] bg-white rounded-3xl border border-border/80 shadow-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-[#FCFBF7] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#4EA923]">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {selectedLanguage.name} Dialogue Feed
                  </h3>
                  <p className="text-[11px] text-slate-400">Real-time agronomic translation & response</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="h-8 text-xs text-slate-500 hover:text-slate-800"
                >
                  <RotateCcw size={13} className="mr-1" />
                  Clear
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[88%]",
                    m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs",
                    m.role === 'user' 
                      ? "bg-slate-800 text-white" 
                      : "bg-[#4EA923] text-white"
                  )}>
                    {m.role === 'user' ? <User size={15} /> : <Bot size={15} />}
                  </div>

                  <div className={cn(
                    "rounded-2xl p-3.5 text-sm shadow-xs relative group",
                    m.role === 'user'
                      ? "bg-gradient-to-r from-emerald-600 to-[#4EA923] text-white rounded-tr-xs"
                      : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                  )}>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                    <div className={cn(
                      "flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px]",
                      m.role === 'user' ? "border-white/20 text-emerald-100" : "border-slate-100 text-slate-400"
                    )}>
                      <span>{m.timestamp}</span>

                      {m.role === 'assistant' && (
                        <button
                          type="button"
                          onClick={() => speakText(m.content)}
                          className="hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                          title="Replay audio"
                        >
                          <Volume2 size={13} />
                          <span>Listen</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%] items-center mr-auto">
                  <div className="w-8 h-8 rounded-full bg-[#4EA923] text-white flex items-center justify-center shrink-0">
                    <Bot size={15} />
                  </div>
                  <div className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-[#4EA923] animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-[#4EA923] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-[#4EA923] animate-bounce [animation-delay:0.4s]" />
                    <span className="text-xs font-semibold text-slate-500 ml-1">Analyzing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUserQuery(input);
                }}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={toggleListening}
                  className={cn(
                    "p-2.5 rounded-xl border transition-all cursor-pointer",
                    isListening 
                      ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse" 
                      : "bg-emerald-50 border-emerald-200 text-[#4EA923] hover:bg-emerald-100"
                  )}
                  title="Tap to speak"
                >
                  <Mic size={18} />
                </button>

                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={selectedLanguage.placeholder}
                  className="flex-1 bg-slate-50 border-slate-200 rounded-xl text-sm focus-visible:ring-emerald-500 font-medium"
                />

                <Button
                  type="submit"
                  disabled={!input.trim()}
                  className="bg-[#4EA923] hover:bg-[#3D8F19] text-white rounded-xl px-4 font-bold shadow-sm"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline ml-1.5">Ask</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
