import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles, Info, ShieldCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';
import { ChatProductCard } from '@/components/custom/ChatProductCard';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/ChatPage.css';

interface Message {
  role: 'user' | 'bot';
  content: string | { type: string; [key: string]: any };
}

const BotAvatar = () => (
  <div className="relative flex-shrink-0">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
      <Bot className="w-5 h-5 text-primary" />
    </div>
    <div className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-primary/50 animate-pulse-glow"></div>
  </div>
);

const loadingMessages = [
  "I've seen things you people wouldn't believe... like a user who reads loading messages. ✨",
  "Reticulating splines... or was it articulating spines? 🤔",
  "Consulting the digital oracle... 🔮",
  "Waking up the hamsters... 🐹",
  "Searching the archives of ancient memes... 📜",
  "Polishing the response to a mirror shine... 닦다",
  "Don't worry, I'm not judging your query. Much. 😏",
  "Compiling the finest artisanal data... 👨‍🍳",
  "One moment, just finishing my digital coffee. ☕",
  "Hang on, I've almost untangled the quantum spaghetti code. 🍝"
];

const WormLoader = () => (
  <div className="flex items-center justify-center w-10 h-5">
    <div className="worm-segment"></div>
    <div className="worm-segment"></div>
    <div className="worm-segment"></div>
    <div className="worm-segment"></div>
    <div className="worm-segment"></div>
  </div>
);

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
      <div className="p-4 rounded-xl bg-muted/50 shadow-lg border border-border/20 max-w-md flex items-center gap-3">
        <WormLoader />
        <p className="text-sm text-muted-foreground italic">{message}</p>
      </div>
    </motion.div>
  );
};

const ChatPage: React.FC = () => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  useEffect(() => {
    setMessages([
      { role: 'bot', content: "Hello! I'm the Pro-Techt AI Assistant. How can I help you today?" },
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

    await new Promise(res => setTimeout(res, 500));

    const { data, error } = await supabase.functions.invoke('customer-support-bot', {
      body: { query: messageToSend },
    });

    setIsLoading(false);

    if (error || (data && data.error)) {
      const errorMessage = error?.message || (data && data.error);
      if (typeof errorMessage === 'string' && errorMessage.includes('is currently loading')) {
        setMessages((prev) => [...prev, { role: 'bot', content: "The AI is warming up. Please try sending your message again in a moment." }]);
      } else {
        setMessages((prev) => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting. Please try again later." }]);
      }
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
  };

  return (
    <PageTransition>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-4rem)]">
        {/* Main Chat Column */}
        <div className="lg:col-span-2 flex flex-col h-full bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-2xl rounded-2xl overflow-hidden">
          <div className="flex items-center gap-4 p-6 border-b border-border/20">
            <div className="p-3 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-muted-foreground">👋 Welcome back, {profile?.full_name || 'User'}!</h2>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Intelligent Assistant</h1>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="space-y-6">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'bot' && <BotAvatar />}
                  <div className={cn(
                    'p-4 rounded-xl max-w-2xl shadow-lg border',
                    msg.role === 'user' ? 'bg-primary/90 text-primary-foreground' : 'bg-white/50 dark:bg-muted/50 border-white/20 dark:border-border/20'
                  )}>
                    {typeof msg.content === 'string' ? (
                      <div className="prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content.type === 'product_list' && (
                        <div>
                          <p className="mb-4 text-base text-foreground/90">Here are the products I found for you:</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {msg.content.products.map((product: any) => (
                              <ChatProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />}
                </motion.div>
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-border/20 bg-background/20">
            <form onSubmit={handleSendMessage} className="flex items-center w-full gap-4">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about your products, warranties, or service requests..."
                className="flex-1 h-12 text-base bg-background/70 rounded-full px-6 text-foreground border-border/30 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:ring-offset-background/30 transition-shadow duration-300 shadow-inner-lg focus:shadow-outline-glow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/50 transition-all duration-300" disabled={isLoading}>
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
          className="hidden lg:flex flex-col gap-8"
        >
          <Card className="bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <Info className="w-5 h-5 text-primary" />
              <CardTitle className="text-md font-semibold text-foreground">Context Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                As you chat, relevant information about your products, warranties, or knowledge base articles will appear here.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-2xl rounded-2xl">
            <CardHeader className="flex flex-row items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <CardTitle className="text-md font-semibold text-foreground">Privacy Assurance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your personal data and conversations are secure. The AI will only access your product information when you explicitly ask it to.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default ChatPage;