import * as React from 'react';
import { 
  Mic, 
  X, 
  ChevronRight, 
  Volume2, 
  MessageSquare, 
  Globe,
  Settings,
  Languages
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const languages = [
  'English', 'Pidgin', 'Yoruba', 'Hausa', 'Igbo', 'Tiv', 
  'Fulfulde', 'Kanuri', 'Ibibio', 'Efik', 'Edo (Bini)', 'Nupe'
];

export default function VoiceAssistant() {
  const [isListening, setIsListening] = React.useState(false);
  const [transcript, setTranscript] = React.useState('');
  const [language, setLanguage] = React.useState('English');

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    setTimeout(() => {
      setTranscript('How do I apply NPK fertilizer to my maize farm?');
      setTimeout(() => setIsListening(false), 2000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-4">
        <Badge className="bg-secondary text-secondary-foreground">Multilingual Support</Badge>
        <h2 className="text-4xl font-bold tracking-tight">Voice Assistant</h2>
        <p className="text-muted-foreground max-w-md">
          Speak to AgriSmart in your local language. Ask about planting, weather, or market prices.
        </p>
      </div>

      <div className="relative flex flex-col items-center">
        {/* Pulse Animations */}
        <AnimatePresence>
          {isListening && (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2.5, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-primary/20 rounded-full"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 bg-secondary/30 rounded-full"
              />
            </>
          )}
        </AnimatePresence>

        <button 
          onClick={startListening}
          className={cn(
            "relative w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 z-10",
            isListening ? "bg-primary text-white scale-110" : "bg-white text-primary hover:bg-slate-50"
          )}
        >
          {isListening ? <Volume2 size={48} className="animate-pulse" /> : <Mic size={48} />}
        </button>
        
        <p className={cn(
          "mt-8 font-bold transition-all duration-300",
          isListening ? "text-primary animate-bounce" : "text-muted-foreground"
        )}>
          {isListening ? "I'm listening..." : "Tap to speak"}
        </p>
      </div>

      {transcript && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 max-w-lg w-full text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">You asked:</p>
          <p className="font-bold text-lg italic">"{transcript}"</p>
          <div className="mt-4 pt-4 border-t flex items-center justify-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-primary">
              <MessageSquare size={16} />
            </div>
            <span className="text-xs font-bold text-primary">AI is processing answer...</span>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Card className="border-none shadow-sm bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold flex items-center gap-2">
              <Languages size={18} className="text-primary" />
              Language Select
            </h4>
            <Button variant="ghost" size="icon"><Settings size={16} /></Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <Button 
                key={lang} 
                variant={language === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "rounded-full h-8 text-[10px] font-bold uppercase tracking-wider",
                  language === lang && "bg-primary text-white"
                )}
              >
                {lang}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white p-6">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <Globe size={18} className="text-secondary" />
            Voice Examples
          </h4>
          <div className="space-y-3">
             {[
               "What is the price of Maize in Bodija?",
               "Read my planting calendar for May.",
               "Translate fertilizer advice to Yoruba.",
               "Find nearby seed suppliers."
             ].map((ex, i) => (
               <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group">
                 <span className="text-xs text-slate-400 group-hover:text-white transition-colors italic">"{ex}"</span>
                 <ChevronRight size={14} className="text-slate-600 group-hover:text-secondary" />
               </div>
             ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
