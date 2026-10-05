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
  Maximize2,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AppLogo from './AppLogo';
import { useNavigate } from 'react-router-dom';

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
    placeholder: 'Ask in English or Pidgin...',
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
    placeholder: 'Yi tambaya cikin Hausa...',
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
    placeholder: 'Jụọ ajụjụ n\'asụsụ Igbo...',
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
    placeholder: 'Bèèrè ní èdè Yorùbá...',
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

interface FloatingVoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FloatingVoiceAssistant({ isOpen, onClose }: FloatingVoiceAssistantProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<LanguageConfig | null>(null);
  const [isListening, setIsListening] = React.useState(false);
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [messages, setMessages] = React.useState<Message[]>([]);

  // When assistant opens or closes
  React.useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
      setIsListening(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (selectedLanguage && isOpen) {
      scrollToBottom();
    }
  }, [messages, isTyping, selectedLanguage, isOpen]);

  // Handle selecting one of the 4 languages
  const handleSelectLanguage = (lang: LanguageConfig) => {
    setSelectedLanguage(lang);
    const welcomeMsg: Message = {
      id: 'welcome-' + lang.id,
      role: 'assistant',
      content: lang.greeting,
      timestamp: 'Just now'
    };
    setMessages([welcomeMsg]);
    // Speak greeting in natural voice
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
                  onClick={() => {
                    onClose();
                    navigate('/voice');
                  }}
                  className="h-8 w-8 text-white/80 hover:text-white hover:bg-white/15"
                  title="Full View"
                >
                  <Maximize2 size={15} />
                </Button>

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

            {/* SCREEN 1: UNCONGESTED 4-LANGUAGE SELECTION */}
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

                {/* 4 Clean Language Option Cards */}
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
                          <p className="text-xs text-slate-500 font-medium">
                            {lang.nativeName}
                          </p>
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
                    🌾 Powered by MyFarmPal Multilingual Voice Engine
                  </p>
                </div>
              </div>
            ) : (
              /* SCREEN 2: CLEAN, UNCONGESTED VOICE SESSION */
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
                {/* Active Language Bar with Change Button */}
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

                {/* Central Microphone Area */}
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
                      className={cn(
                        "relative w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg transition-all duration-300 z-10 cursor-pointer border-3",
                        isListening
                          ? "bg-gradient-to-tr from-[#3D8F19] to-[#54B82A] text-white border-amber-300 scale-105"
                          : "bg-gradient-to-tr from-[#4EA923] to-[#3D8F19] text-white border-[#FAB814]/70 hover:border-[#FAB814] hover:scale-105"
                      )}
                      aria-label="Toggle Voice Input"
                    >
                      {isListening ? (
                        <Volume2 size={32} className="text-amber-200 animate-pulse" />
                      ) : (
                        <Mic size={32} className="text-[#FAB814] drop-shadow-xs" />
                      )}
                      <span className="text-[9px] font-black uppercase text-white/95 mt-0.5">
                        {isListening ? "Listening" : "Speak"}
                      </span>
                    </button>
                  </div>

                  <p className={cn(
                    "text-xs font-bold mt-2 transition-colors",
                    isListening ? "text-[#4EA923] animate-pulse" : isSpeaking ? "text-[#FAB814]" : "text-slate-500"
                  )}>
                    {isListening 
                      ? `Listening in ${selectedLanguage.name}... Speak now!` 
                      : isSpeaking 
                      ? "🔊 Speaking response..." 
                      : "Tap microphone to speak or pick a prompt"}
                  </p>

                  {/* Clean Quick Prompts */}
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full pt-2.5 pb-0.5 scrollbar-none">
                    {selectedLanguage.quickQuestions.map((q, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleUserQuery(q)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/60 text-[10px] font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0"
                      >
                        <Sparkles size={10} className="text-[#FAB814]" />
                        <span>{q}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {messages.map((m) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-2 max-w-[92%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs mt-0.5",
                        m.role === 'user' 
                          ? "bg-slate-800 text-white" 
                          : "bg-[#4EA923] text-white"
                      )}>
                        {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      </div>

                      <div className={cn(
                        "rounded-2xl p-2.5 text-xs shadow-xs",
                        m.role === 'user'
                          ? "bg-gradient-to-r from-emerald-600 to-[#4EA923] text-white rounded-tr-xs"
                          : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                      )}>
                        <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                        <div className={cn(
                          "flex items-center justify-between gap-3 mt-1.5 pt-1 border-t text-[9px]",
                          m.role === 'user' ? "border-white/20 text-emerald-100" : "border-slate-100 text-slate-400"
                        )}>
                          <span>{m.timestamp}</span>
                          {m.role === 'assistant' && (
                            <button
                              type="button"
                              onClick={() => speakText(m.content)}
                              className="hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
                              title="Replay Audio"
                            >
                              <Volume2 size={11} />
                              <span>Listen</span>
                            </button>
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

                {/* Input Bar */}
                <div className="p-2.5 border-t border-slate-200 bg-white shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleUserQuery(input);
                    }}
                    className="flex items-center gap-1.5"
                  >
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={cn(
                        "p-2 rounded-xl border transition-all cursor-pointer shrink-0",
                        isListening
                          ? "bg-rose-50 border-rose-300 text-rose-600 animate-pulse"
                          : "bg-emerald-50 border-emerald-200 text-[#4EA923] hover:bg-emerald-100"
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
                      disabled={!input.trim()}
                      size="sm"
                      className="bg-[#4EA923] hover:bg-[#3D8F19] text-white rounded-xl h-9 px-3 font-bold shadow-xs shrink-0"
                    >
                      <Send size={13} />
                      <span className="ml-1 text-xs">Send</span>
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
