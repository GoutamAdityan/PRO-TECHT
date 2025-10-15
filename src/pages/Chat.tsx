
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import PageTransition from '@/components/PageTransition';

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length === 0) {
        setMessages([
            { role: 'bot', content: "Hello! I'm the Pro-Techt AI Assistant. You can ask me anything about the website." }
        ]);
    }
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const { data, error } = await supabase.functions.invoke('customer-support-bot', {
      body: { query: inputValue },
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
      const botResponse = data.generated_text || "I'm not sure how to answer that. Can you try asking another way?";
      setMessages((prev) => [...prev, { role: 'bot', content: botResponse }]);
    }
  };

  return (
    <PageTransition>
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-emerald-400" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Assistant</h1>
            </div>
            <p className="text-lg text-foreground/70 mb-8">Ask questions about Pro-Techt, its features, or policies.</p>

            <Card className="flex flex-col h-[70vh] bg-background/80 backdrop-blur-lg border-border/50 shadow-2xl rounded-2xl">
                <CardContent className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={cn('flex items-start gap-4', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {msg.role === 'bot' && <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />}
                        <div className={cn('p-4 rounded-2xl max-w-lg shadow-md', msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            <p className="text-base">{msg.content}</p>
                        </div>
                        {msg.role === 'user' && <User className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                        <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div className="p-4 rounded-2xl bg-muted shadow-md">
                            <div className="flex items-center space-x-2">
                            <span className="h-2.5 w-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2.5 w-2.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2.5 w-2.5 bg-primary rounded-full animate-bounce"></span>
                            </div>
                        </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                    </div>
                </CardContent>
                <CardFooter className="p-4 border-t border-border/50">
                    <form onSubmit={handleSendMessage} className="flex items-center w-full gap-4">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Ask anything..."
                        className="flex-1 h-12 text-base bg-background/70 rounded-full px-6 focus-visible:ring-primary"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={isLoading}>
                        <Send className="h-5 w-5" />
                    </Button>
                    </form>
                </CardFooter>
            </Card>
        </div>
    </PageTransition>
  );
};

export default ChatPage;
