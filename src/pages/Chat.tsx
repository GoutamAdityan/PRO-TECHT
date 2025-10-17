
import React, { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';

import { Send, Bot, User, MessageSquare, Info, ShieldCheck, Sparkles } from 'lucide-react';

import { supabase } from '@/integrations/supabase/client';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import PageTransition from '@/components/PageTransition';

import { ChatProductCard } from '@/components/custom/ChatProductCard';

import ReactMarkdown from 'react-markdown';

import '@/styles/ChatPage.css'; // Import the new CSS for the background



// Define the structure for a message

interface Message {

  role: 'user' | 'bot';

  content: string | { type: string; [key: string]: any };

}



const ChatPage: React.FC = () => {

  const [messages, setMessages] = useState<Message[]>([]);

  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);



    const scrollToBottom = () => {



      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });



    };



  



    // Scroll to bottom on new messages, but not on initial load



    useEffect(() => {



      if (messages.length > 1) {



        scrollToBottom();



      }



    }, [messages]);



  



    // Load initial message



    useEffect(() => {



      setMessages([



        { role: 'bot', content: "Hello! I'm the Pro-Techt AI Assistant. How can I help you today?" }



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



    // Simulate a bit of delay for a more natural feel

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



          <div className="h-[calc(100vh-10rem)]">



            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">

          {/* Main Chat Column */}

          <div className="lg:col-span-2 flex flex-col h-full">

                        <motion.div 

                          initial={{ opacity: 0, y: -20 }}

                          animate={{ opacity: 1, y: 0 }}

                          transition={{ duration: 0.5 }}

                          className="flex items-center gap-4 mb-6"

                        >

                          <div className="p-3 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">

                            <Sparkles className="w-7 h-7 text-primary" />

                          </div>

                          <div>

                            <h1 className="text-3xl font-bold tracking-tight text-foreground">Intelligent Assistant</h1>

                            <p className="text-md text-muted-foreground">Your personal guide to Pro-Techt.</p>

                          </div>

                                    </motion.div>

                        

                                    <Card className="flex flex-col flex-1 bg-white/60 dark:bg-black/30 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg dark:shadow-2xl rounded-2xl overflow-hidden">

                                      <CardContent className="flex-1 p-6 overflow-y-auto">

                            <div className="space-y-6">

                              {messages.map((msg, index) => (

                                <motion.div 

                                  key={index} 

                                  initial={{ opacity: 0, y: 10 }}

                                  animate={{ opacity: 1, y: 0 }}

                                  transition={{ duration: 0.3, ease: 'easeOut' }}

                                  className={cn('flex items-start gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}

                                >

                                  {msg.role === 'bot' && <Bot className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />}

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

                              {isLoading && (

                                <motion.div 

                                  initial={{ opacity: 0, y: 10 }}

                                  animate={{ opacity: 1, y: 0 }}

                                  className="flex items-start gap-3"

                                >

                                  <Bot className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />

                                  <div className="p-4 rounded-xl bg-muted/50 shadow-lg border border-border/20">

                                    <div className="flex items-center space-x-2">

                                      <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>

                                      <span className="h-2 w-2 bg-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>

                                      <span className="h-2 w-2 bg-primary rounded-full animate-pulse"></span>

                                    </div>

                                  </div>

                                </motion.div>

                              )}

                              <div ref={messagesEndRef} />

                            </div>

                          </CardContent>

                          <CardFooter className="p-4 border-t border-border/20 bg-background/20">

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

                          </CardFooter>

                        </Card>

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

                  </div>

                </PageTransition>

              );

            };

            

            interface SuggestionChipProps {

              suggestion: string;

              onSuggestionClick: (e: React.FormEvent | null, message: string) => void;

            }

            

            const SuggestionChip: React.FC<SuggestionChipProps> = ({ suggestion, onSuggestionClick }) => {

              const handleClick = () => {

                onSuggestionClick(null, suggestion);

              };

            

              return (

                <Button

                  variant="outline"

                  size="sm"

                  className="rounded-full text-sm bg-background/30 text-muted-foreground border-border/30 hover:bg-muted/40 hover:text-foreground transition-colors"

                  onClick={handleClick}

                >

                  {suggestion}

                </Button>

              );

            };



export default ChatPage;


