import * as React from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Maximize2, 
  Minus,
  Sparkles,
  User,
  Bot
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AgriSmart AI assistant. How can I help with your farm today?' }
  ]);
  const [isTyping, setIsTyping] = React.useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      let response = "That's an interesting question! Based on your location in Lagos, I recommend checking the current rain probability before applying any fertilizer.";
      if (input.toLowerCase().includes('maize')) {
        response = "Maize in this region is currently in the growth stage. Ensure you have applied your first round of NPK 15:15:15.";
      }
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 group border-4 border-secondary/20"
        >
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 pointer-events-none" />
          <MessageSquare size={28} />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-primary">
            1
          </span>
        </motion.button>
      )}

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 100, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl z-50 overflow-hidden flex flex-col border border-border/50"
          >
            {/* Header */}
            <div className="bg-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">AgriSmart AI</h4>
                  <p className="text-[10px] opacity-70">Omnipresent Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10">
                  <Minus size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10">
                  <X size={16} />
                </Button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={cn(
                  "flex items-end gap-2 max-w-[85%]",
                  m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                )}>
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px]",
                    m.role === 'user' ? "bg-primary text-white" : "bg-secondary text-primary"
                  )}>
                    {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    m.role === 'user' ? "bg-primary text-white rounded-br-none" : "bg-white border border-border/50 shadow-sm rounded-bl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2 mr-auto">
                  <div className="w-6 h-6 rounded-full bg-secondary text-primary flex items-center justify-center">
                    <Bot size={12} />
                  </div>
                  <div className="bg-white border border-border/50 shadow-sm p-3 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce delay-75" />
                      <div className="w-1.5 h-1.5 bg-primary/30 rounded-full animate-bounce delay-150" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-border/50">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask me anything..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  className="rounded-xl border-slate-200 focus-visible:ring-primary h-11"
                />
                <Button 
                  onClick={sendMessage}
                  className="h-11 w-11 rounded-xl bg-primary text-white shadow-lg hover:bg-primary/90"
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-[10px] text-center text-muted-foreground mt-3">
                Powered by AgriSmart AI • Nigeria's First Farm Intelligence
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
