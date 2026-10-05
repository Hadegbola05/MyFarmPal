import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, RotateCcw, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingAnimationProps {
  onComplete?: () => void;
  autoPlay?: boolean;
}

export default function OnboardingAnimation({
  onComplete,
  autoPlay = true,
}: OnboardingAnimationProps) {
  // Animation phases: 0: walking in, 1: approaching, 2: handshake, 3: leaf pop & full logo
  const [phase, setPhase] = React.useState<number>(0);
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = React.useState<boolean>(false);
  const [voiceText, setVoiceText] = React.useState<string>("My Farm Pal");

  // Web Audio jingle synthesizer
  const playJingle = (stage: number) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Play African marimba / kalimba pentatonic tones
      const notesByStage: { [key: number]: number[] } = {
        0: [261.63, 329.63], // C4, E4
        1: [392.00, 440.00], // G4, A4
        2: [523.25, 587.33, 659.25], // C5, D5, E5
        3: [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6 (Celebration chord)
      };

      const notes = notesByStage[stage] || [440];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle'; // Warm marimba/kalimba feel
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
      });
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Text to speech voiceover
  const speakVoice = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.05;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  const restartAnimation = () => {
    setPhase(0);
    setVoiceText("My Farm Pal");
    playJingle(0);
    speakVoice("My Farm Pal");
  };

  React.useEffect(() => {
    if (!autoPlay) return;

    // Timeline matching the video
    // Phase 0: 0s - 1.8s -> "My Farm Pal"
    playJingle(0);
    if (hasInteracted) speakVoice("My Farm Pal");

    const t1 = setTimeout(() => {
      setPhase(1);
      setVoiceText("Your Farm Pal");
      playJingle(1);
      if (hasInteracted) speakVoice("Your Farm Pal");
    }, 1800);

    // Phase 2: 3.6s -> Handshake forming 'm' -> "Your Language."
    const t2 = setTimeout(() => {
      setPhase(2);
      setVoiceText("Your Language.");
      playJingle(2);
      if (hasInteracted) speakVoice("Your Language");
    }, 3600);

    // Phase 3: 5.4s -> Leaf pop & Full Logo Lockup
    const t3 = setTimeout(() => {
      setPhase(3);
      setVoiceText("MyFarmPal - Your Farm Pal. Your Language.");
      playJingle(3);
      if (hasInteracted) speakVoice("My Farm Pal. Your Farm Pal. Your Language.");
    }, 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [autoPlay, hasInteracted]);

  return (
    <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-b from-white/95 to-[#FAF8F2]/90 rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/15 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FAB814]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#54B82A]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Controls: Sound Toggle & Replay */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FAB814]/20 text-[#855300] border border-[#FAB814]/30 shadow-2xs">
            <Sparkles size={12} className="text-[#FAB814]" />
            <span>Interactive Onboarding Story</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setHasInteracted(true);
              setSoundEnabled(!soundEnabled);
            }}
            className="h-8 px-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
            title={soundEnabled ? "Mute audio" : "Enable sound"}
          >
            {soundEnabled ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Volume2 size={15} />
                <span className="text-[11px] hidden sm:inline">Audio On</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-slate-400">
                <VolumeX size={15} />
                <span className="text-[11px] hidden sm:inline">Audio Muted</span>
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={restartAnimation}
            className="h-8 px-2.5 text-xs border-slate-200 hover:bg-emerald-50 text-slate-700 rounded-full gap-1"
            title="Replay animation sequence"
          >
            <RotateCcw size={13} />
            <span className="text-[11px]">Replay</span>
          </Button>
        </div>
      </div>

      {/* Animation Stage Canvas */}
      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-stone-50/70 to-white/90 border border-stone-200/60 shadow-inner">
        {/* Ground Line with soil roots texture */}
        <div className="absolute bottom-8 inset-x-4 h-1 bg-stone-200/70 rounded-full">
          <div className="absolute -top-1 left-1/4 w-8 h-2 bg-[#54B82A]/20 rounded-full" />
          <div className="absolute -top-1 right-1/4 w-8 h-2 bg-[#FAB814]/20 rounded-full" />
        </div>

        {/* Phase 0 to 2: Characters Walking & Handshake */}
        {phase < 3 && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Green 'f' Sprout Mascot (Left) */}
            <motion.div
              animate={{
                x: phase === 0 ? [-140, -60] : phase === 1 ? -40 : -22,
                y: [0, -6, 0, -6, 0],
              }}
              transition={{
                x: { duration: phase === 0 ? 1.6 : 0.8, ease: "easeOut" },
                y: { repeat: Infinity, duration: 0.6, ease: "easeInOut" }
              }}
              className="absolute flex flex-col items-center select-none"
            >
              {/* Green 'f' Body */}
              <div className="relative w-24 h-28 sm:w-28 sm:h-32">
                <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-md">
                  {/* Stem and head of 'f' */}
                  <path
                    d="M36 26C36 17 45 13 54 13C60 13 63 17 63 24C63 36 60 45 60 46H48V58H58V70H48V90C48 97 44 102 39 104C34 102 33 97 33 90V36C33 30 34 27 36 26Z"
                    fill="#54B82A"
                    stroke="#2B1608"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  {/* Friendly smiling face */}
                  <circle cx="43" cy="32" r="3" fill="#2B1608" />
                  <circle cx="53" cy="32" r="3" fill="#2B1608" />
                  <path d="M44 38C46 41 50 41 52 38" stroke="#2B1608" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Left hand/branch */}
                  <path d="M33 62L22 56C19 54 15 59 18 62L19 68" stroke="#6F4223" strokeWidth="4" strokeLinecap="round" />
                  
                  {/* Right hand extending forward in phase 2 */}
                  {phase >= 2 ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      d="M58 64C68 64 74 58 78 60"
                      stroke="#6F4223"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path d="M58 64L66 60" stroke="#6F4223" strokeWidth="3.5" strokeLinecap="round" />
                  )}

                  {/* Stepping Roots */}
                  <path d="M39 102L32 114M39 102L39 116M39 102L46 113" stroke="#2B1608" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>

            {/* Handshake 'm' Bridge in Phase 2 */}
            <AnimatePresence>
              {phase === 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className="absolute z-20 flex flex-col items-center"
                >
                  <div className="relative -mt-2">
                    <svg width="48" height="32" viewBox="0 0 48 32">
                      {/* Arched 'm' handshake branch */}
                      <path
                        d="M6 24C10 12 18 10 24 16C30 10 38 12 42 24"
                        fill="none"
                        stroke="#6F4223"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-bold text-amber-500"
                    >
                      ✨
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Golden Yellow 'P' Character Mascot (Right) */}
            <motion.div
              animate={{
                x: phase === 0 ? [140, 60] : phase === 1 ? 40 : 22,
                y: [0, -6, 0, -6, 0],
              }}
              transition={{
                x: { duration: phase === 0 ? 1.6 : 0.8, ease: "easeOut" },
                y: { repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }
              }}
              className="absolute flex flex-col items-center select-none"
            >
              {/* Yellow 'P' Body */}
              <div className="relative w-24 h-28 sm:w-28 sm:h-32">
                <svg viewBox="0 0 100 120" className="w-full h-full filter drop-shadow-md">
                  {/* P Body */}
                  <path
                    d="M65 30C65 21 73 17 84 17C96 17 102 25 102 36C102 46 94 54 83 54H74V90C74 97 70 102 65 104C60 102 60 97 60 90V36C60 32 62 30 65 30Z"
                    fill="#FFBD0A"
                    stroke="#2B1608"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  {/* P Head counter opening */}
                  <path d="M74 30H83C88 30 92 33 92 38C92 43 88 46 83 46H74V30Z" fill="#FFF2B2" stroke="#2B1608" strokeWidth="3" />
                  
                  {/* Friendly smiling face */}
                  <circle cx="77" cy="36" r="3" fill="#2B1608" />
                  <circle cx="88" cy="37" r="3" fill="#2B1608" />
                  <path d="M79 41C82 44 85 44 87 41" stroke="#2B1608" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M80 47C83 49 86 48 88 47" stroke="#2B1608" strokeWidth="2" strokeLinecap="round" />

                  {/* Left hand extending to shake */}
                  {phase >= 2 ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      d="M60 62C52 62 46 58 42 60"
                      stroke="#6F4223"
                      strokeWidth="4.5"
                      strokeLinecap="round"
                    />
                  ) : (
                    <path d="M60 62L54 68" stroke="#6F4223" strokeWidth="3.5" strokeLinecap="round" />
                  )}

                  {/* Right hand */}
                  <path d="M96 60L102 66" stroke="#6F4223" strokeWidth="3.5" strokeLinecap="round" />

                  {/* Stepping Roots */}
                  <path d="M65 102L58 114M65 102L65 116M65 102L72 113" stroke="#2B1608" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
            </motion.div>
          </div>
        )}

        {/* Phase 3: Connected Official Logo with Leaf Pop-up */}
        {phase === 3 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center justify-center p-4"
          >
            {/* Mascot Lockup */}
            <div className="relative w-44 h-40 flex items-center justify-center">
              <motion.img
                src="/onboarding-hero.webp"
                alt="MyFarmPal Mascot Onboarding"
                className="w-full h-full object-contain filter drop-shadow-lg"
                initial={{ y: 15 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                onError={(e: any) => {
                  e.currentTarget.src = "/logo.png";
                }}
              />

              {/* Floating celebration particles */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: -45, scale: [1, 1.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse" }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#54B82A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white"
              >
                <span>🌱 Farm Pal Joined!</span>
              </motion.div>
            </div>

            {/* Typography */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mt-1"
            >
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                <span>My</span>
                <span className="text-[#4EA923]">Farm</span>
                <span className="text-[#FAB814]">Pal</span>
              </h3>
              <p className="text-xs font-bold text-slate-700 tracking-wide mt-0.5">
                Your Farm Pal. Your Language.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Dynamic Animated Subtitle Banner */}
      <div className="mt-4 p-3 rounded-2xl bg-white/90 border border-emerald-500/20 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#54B82A] to-[#FAB814] flex items-center justify-center text-white font-bold text-xs shadow-xs">
            {phase === 0 ? "1" : phase === 1 ? "2" : phase === 2 ? "3" : "✓"}
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>{voiceText}</span>
              {phase === 3 && <Check size={14} className="text-[#54B82A]" />}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {phase === 0 && "Green sprout 'f' enters the farm field..."}
              {phase === 1 && "Harvest gold 'P' greets the partner..."}
              {phase === 2 && "Connecting together into 'mFP' in your local tongue!"}
              {phase === 3 && "Nigeria's Intelligent Multilingual Farm Companion"}
            </p>
          </div>
        </div>

        {onComplete && (
          <Button
            onClick={onComplete}
            className="h-9 px-4 bg-[#4EA923] hover:bg-[#43951E] text-white font-bold text-xs rounded-xl shadow-xs gap-1.5"
          >
            <span>Continue</span>
            <ArrowRight size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
