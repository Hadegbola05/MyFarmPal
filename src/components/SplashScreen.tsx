import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onFinish: () => void;
  customVideoUrl?: string;
}

export default function SplashScreen({ onFinish, customVideoUrl }: SplashScreenProps) {
  const [phase, setPhase] = React.useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = React.useState<boolean>(false);
  const [videoError, setVideoError] = React.useState<boolean>(false);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  const videoSource = customVideoUrl || '/splash-animation.mp4';

  // Attempt video playback
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Attributes required for iOS Safari & Android mobile autoplay
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    const handlePlaying = () => {
      setIsVideoPlaying(true);
    };

    const handleEnded = () => {
      onFinish();
    };

    const handleError = () => {
      setVideoError(true);
      setIsVideoPlaying(false);
    };

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    // Trigger programmatic play
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsVideoPlaying(true);
        })
        .catch(() => {
          // Browser prevented autoplay (e.g. Low Power Mode, strict permissions)
          setIsVideoPlaying(false);
        });
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [onFinish, videoSource]);

  // Synchronized backup timer for vector animation
  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => setPhase(2), 3400);
    const t3 = setTimeout(() => setPhase(3), 4400);
    const t4 = setTimeout(() => setPhase(4), 5200);
    const tEnd = setTimeout(() => {
      onFinish();
    }, 6200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center p-4 select-none overflow-hidden">
      {/* Skip button in top-right corner */}
      <button
        type="button"
        onClick={onFinish}
        className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 px-3.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-all cursor-pointer shadow-xs active:scale-95"
        aria-label="Skip animation"
      >
        Skip
      </button>

      {/* Main Container */}
      <div className="relative w-full max-w-[640px] max-h-[85vh] aspect-[4/3] flex items-center justify-center">
        {/* HTML5 Video Layer */}
        {!videoError && (
          <video
            ref={videoRef}
            src={videoSource}
            autoPlay
            muted
            playsInline
            loop={false}
            preload="auto"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 z-20 ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <source src={videoSource} type="video/mp4" />
            <source src="/splash-animation.webm" type="video/webm" />
          </video>
        )}

        {/* Fallback Vector Animation (Always ready, zero latency, guaranteed to show) */}
        <div
          className={`relative w-full max-w-[500px] h-[360px] sm:h-[400px] flex flex-col items-center justify-center transition-opacity duration-500 ${
            isVideoPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle ground baseline */}
          <div className="absolute bottom-28 inset-x-8 h-[2px] bg-slate-100 rounded-full" />

          {/* Mascot Characters Stage */}
          <div className="relative w-full h-[220px] flex items-center justify-center">
            {/* Green 'F' Mascot */}
            <motion.div
              initial={{ x: -160, opacity: 1 }}
              animate={{
                x: phase === 0 ? [-160, -38] : phase === 1 ? -28 : -20,
                y: phase < 2 ? [0, -7, 0, -7, 0] : 0,
              }}
              transition={{
                x: { duration: phase === 0 ? 2.2 : 0.8, ease: "easeOut" },
                y: { duration: 0.55, repeat: phase < 2 ? Infinity : 0, ease: "easeInOut" }
              }}
              className="absolute z-10 flex flex-col items-center"
            >
              <div className="relative w-28 h-36 select-none">
                <svg viewBox="0 0 100 130" className="w-full h-full filter drop-shadow-md">
                  {/* Leaf on top */}
                  <AnimatePresence>
                    {phase >= 3 && (
                      <motion.g
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        transform="translate(54, 18)"
                      >
                        <path
                          d="M0 4C7 -10 18 -8 17 2C7 6 3 4 0 4Z"
                          fill="#52B824"
                          stroke="#2B1608"
                          strokeWidth="3.5"
                          strokeLinejoin="round"
                        />
                      </motion.g>
                    )}
                  </AnimatePresence>

                  {/* 'F' Body */}
                  <path
                    d="M36 26C36 17 45 13 54 13C60 13 63 17 63 24C63 36 60 45 60 46H48V58H58V70H48V90C48 97 44 102 39 104C34 102 33 97 33 90V36C33 30 34 27 36 26Z"
                    fill="#54B82A"
                    stroke="#2B1608"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <circle cx="43" cy="32" r="2.8" fill="#2B1608" />
                  <circle cx="53" cy="32" r="2.8" fill="#2B1608" />
                  <path
                    d="M44 38C46 41 50 41 52 38"
                    stroke="#2B1608"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M33 62L22 56C19 54 15 59 18 62L19 68"
                    stroke="#6F4223"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {phase >= 1 ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                      d="M58 64C68 64 76 58 82 60"
                      stroke="#6F4223"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  ) : (
                    <path
                      d="M58 64L64 62"
                      stroke="#6F4223"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                  <motion.g
                    animate={phase < 2 ? { rotate: [-4, 4, -4] } : { rotate: 0 }}
                    transition={{ duration: 0.55, repeat: Infinity }}
                    transform-origin="39 102"
                  >
                    <path
                      d="M39 102L32 116M39 102L39 119M39 102L46 115"
                      stroke="#2B1608"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.g>
                </svg>
              </div>
            </motion.div>

            {/* Handshake 'm' Bridge */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, type: "spring", bounce: 0.5 }}
                  className="absolute z-20 flex flex-col items-center"
                >
                  <svg width="44" height="30" viewBox="0 0 44 30">
                    <path
                      d="M6 22C10 10 17 8 22 14C27 8 34 10 38 22"
                      fill="none"
                      stroke="#6F4223"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {phase === 2 && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.8] }}
                      transition={{ duration: 0.4 }}
                      className="absolute -top-3 text-xs"
                    >
                      ✨
                    </motion.span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Golden Yellow 'P' Mascot */}
            <motion.div
              initial={{ x: 160, opacity: 1 }}
              animate={{
                x: phase === 0 ? [160, 38] : phase === 1 ? 28 : 20,
                y: phase < 2 ? [0, -7, 0, -7, 0] : 0,
              }}
              transition={{
                x: { duration: phase === 0 ? 2.2 : 0.8, ease: "easeOut" },
                y: { duration: 0.55, repeat: phase < 2 ? Infinity : 0, ease: "easeInOut", delay: 0.1 }
              }}
              className="absolute z-10 flex flex-col items-center"
            >
              <div className="relative w-28 h-36 select-none">
                <svg viewBox="0 0 100 130" className="w-full h-full filter drop-shadow-md">
                  <path
                    d="M65 30C65 21 73 17 84 17C96 17 102 25 102 36C102 46 94 54 83 54H74V90C74 97 70 102 65 104C60 102 60 97 60 90V36C60 32 62 30 65 30Z"
                    fill="#FFBD0A"
                    stroke="#2B1608"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M74 30H83C88 30 92 33 92 38C92 43 88 46 83 46H74V30Z"
                    fill="#FFF2B2"
                    stroke="#2B1608"
                    strokeWidth="2.5"
                  />
                  <circle cx="77" cy="36" r="2.8" fill="#2B1608" />
                  <circle cx="88" cy="37" r="2.8" fill="#2B1608" />
                  <path
                    d="M79 41C82 44 85 44 87 41"
                    stroke="#2B1608"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M80 47C83 49 86 48 88 47"
                    stroke="#2B1608"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {phase >= 1 ? (
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.4 }}
                      d="M60 62C50 62 42 58 36 60"
                      stroke="#6F4223"
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  ) : (
                    <path
                      d="M60 62L54 66"
                      stroke="#6F4223"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  )}
                  <path
                    d="M96 60L102 66"
                    stroke="#6F4223"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <motion.g
                    animate={phase < 2 ? { rotate: [4, -4, 4] } : { rotate: 0 }}
                    transition={{ duration: 0.55, repeat: Infinity, delay: 0.1 }}
                    transform-origin="65 102"
                  >
                    <path
                      d="M65 102L58 116M65 102L65 119M65 102L72 115"
                      stroke="#2B1608"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </motion.g>
                </svg>
              </div>
            </motion.div>
          </div>

          {/* Typography */}
          <AnimatePresence>
            {phase >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center mt-2"
              >
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  <span>My</span>
                  <span className="text-[#4EA923]">Farm</span>
                  <span className="text-[#FAB814]">Pal</span>
                </h1>
                <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 tracking-wide">
                  Your Farm Pal. Your Language.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
