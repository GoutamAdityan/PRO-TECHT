import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Info, ShieldCheck, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageTransition from '@/components/PageTransition';
import { ChatProductCard } from '@/components/custom/ChatProductCard';
import ReactMarkdown from 'react-markdown';
import '@/styles/ChatPage.css';

interface Product {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
}

interface Message {
  role: 'user' | 'bot';
  content: string | { type: string; products?: Product[] };
}

const BotAvatar = () => (
  <div className="relative flex-shrink-0">
    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
      <Bot className="w-6 h-6 text-emerald-400" />
    </div>
    <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-pulse-glow"></div>
  </div>
);

const loadingMessages = [
  "Connecting to the neural network... ✨",
  "Analyzing your request... 🔍",
  "Consulting the digital oracle... 🔮",
  "Processing data streams... ⚡",
  "Formulating the perfect response... 🤖",
];

const TypingIndicator = () => {
  const [message, setMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
    >
      <BotAvatar />
      <div className="p-4 rounded-2xl rounded-tl-none bg-card border border-border backdrop-blur-md shadow-lg max-w-md flex items-center gap-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <p className="text-sm text-emerald-200/70 italic ml-2">{message}</p>
      </div>
    </motion.div>
  );
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      { role: 'bot', content: "Hello! I'm your Pro-Techt AI Assistant. How can I help you with your products or services today?" },
    ]);
  }, []);

  const handleSendMessage = async (e: React.FormEvent | null, messageOverride?: string) => {
    if (e) e.preventDefault();
    const messageToSend = messageOverride || inputValue;
    if (!messageToSend.trim()) return;

    const userMessage = { role: 'user' as const, content: messageToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate network delay for better UX
    await new Promise(res => setTimeout(res, 800));

    try {
      const { data, error } = await supabase.functions.invoke('customer-support-bot', {
        body: { query: messageToSend },
      });

      setIsLoading(false);

      if (error || (data && data.error)) {
        const errorMessage = error?.message || (data && data.error);
        const fallbackMessage = errorMessage?.includes('loading')
          ? "The AI is warming up. Please try again in a moment."
          : "I'm having trouble connecting right now. Please try again later.";

        setMessages((prev) => [...prev, { role: 'bot', content: fallbackMessage }]);
        console.error('Error invoking edge function:', errorMessage);
      } else {
        try {
          const botResponse = JSON.parse(data.generated_text);
          setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
        } catch (e) {
          const botResponse = data.generated_text || "I'm not sure how to answer that. Can you try asking another way?";
          setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
        }
      }
    } catch (err) {
      setIsLoading(false);
      setMessages((prev) => [...prev, { role: 'bot', content: "Network error. Please check your connection." }]);
    }
  };

  return (
    <PageTransition>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)] max-w-7xl mx-auto px-4 py-6">
        {/* Main Chat Column */}
        <div className="lg:col-span-2 flex flex-col h-full glass-panel rounded-3xl overflow-hidden border border-border shadow-2xl relative">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header */}
          <div className="flex items-center gap-4 p-6 border-b border-border bg-card backdrop-blur-md z-10">
            <div className="p-3 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-emerald-200/80 uppercase tracking-wider">AI Assistant</h2>
              <h1 className="text-2xl font-bold text-foreground">Pro-Techt Support</h1>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6 z-10">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'bot' && <BotAvatar />}
                  <div className={cn(
                    'p-5 rounded-2xl max-w-[85%] shadow-lg backdrop-blur-sm border transition-all duration-300',
                    msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-tr-none border-emerald-500/30 shadow-[0_5px_15px_rgba(16,185,129,0.3)]'
                      : 'bg-card text-foreground rounded-tl-none border-border hover:bg-accent hover:border-border'
                  )}>
                    {typeof msg.content === 'string' ? (
                      <div className="prose prose-invert max-w-none text-sm md:text-base leading-relaxed">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content.type === 'product_list' && (
                        <div>
                          <p className="mb-4 text-base text-foreground/90">Here are the products I found for you:</p>
                          <div className="grid grid-cols-1 gap-3">
                            {msg.content.products?.map((product: Product) => (
                              <ChatProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg border border-white/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t border-border bg-card backdrop-blur-md z-10">
            <form onSubmit={handleSendMessage} className="flex items-center w-full gap-4 relative">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about warranties, repairs, or products..."
                className="flex-1 h-14 text-base bg-background/50 rounded-full pl-6 pr-14 text-foreground border-border focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                className={cn(
                  "absolute right-2 h-10 w-10 rounded-full transition-all duration-300 shadow-lg",
                  inputValue.trim() ? "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/30" : "bg-white/10 text-white/30 hover:bg-white/20"
                )}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>

        {/* Context Hub Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:flex flex-col gap-6"
        >
          <div className="glass-panel rounded-3xl p-6 border border-border relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Context Hub</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
              As you chat, relevant information about your products, warranties, or knowledge base articles will appear here to help you faster.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-border relative overflow-hidden group hover:border-blue-500/30 transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Privacy First</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
              Your personal data and conversations are secure. The AI will only access your product information when you explicitly ask it to.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-border relative overflow-hidden group hover:border-purple-500/30 transition-colors flex-1">
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-purple-900/20 to-transparent opacity-50"></div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
              <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Suggested Topics</h3>
            </div>
            <div className="space-y-3 relative z-10">
              {["Check warranty status", "Report a broken device", "Find nearest service center", "Track my repair"].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(topic)}
                  className="w-full text-left p-3 rounded-xl bg-card hover:bg-accent border border-border hover:border-border transition-all text-sm text-muted-foreground hover:text-foreground flex items-center justify-between group/btn"
                >
                  {topic}
                  <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity text-emerald-400">→</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ChatPage;
