import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { cardVariants, cardHoverVariants, rowVariants } from '@/lib/animations';
import { Paperclip, Send, User, Info, MessageSquare } from 'lucide-react';
import { Conversation } from './ConversationList'; // Import Conversation interface

// Placeholder Data Types
export interface Message {
  id: string;
  sender: 'user' | 'customer';
  content: string;
  timestamp: string;
}

interface ConversationPaneProps {
  selectedConversation: Conversation | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
  onToggleDetails: () => void;
}

const ConversationPane: React.FC<ConversationPaneProps> = ({
  selectedConversation,
  messages,
  onSendMessage,
  onToggleDetails,
}) => {
  const [messageInput, setMessageInput] = React.useState('');
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  const handleSend = () => {
    if (messageInput.trim()) {
      onSendMessage(messageInput);
      setMessageInput('');
    }
  };

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      className="rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] flex-1 h-full"
      role="main"
      aria-label="Conversation Pane"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-4 flex flex-col h-full">
        {selectedConversation ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-foreground/10 mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedConversation.avatarUrl} alt={selectedConversation.customerName} />
                  <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground/90">{selectedConversation.customerName}</h3>
                  <p className="text-sm text-muted-foreground">Last active: {selectedConversation.timestamp}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onToggleDetails} aria-label="Toggle customer details">
                <Info className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto space-y-4 p-2">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    variants={shouldReduceMotion ? { opacity: 1 } : rowVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className={cn(
                      "flex",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] p-3 rounded-lg shadow-md",
                        message.sender === 'user'
                          ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-br-none"
                          : "bg-card-foreground text-foreground rounded-bl-none"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs text-right mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Message Input */}
            <div className="flex items-center pt-4 border-t border-foreground/10 mt-4">
              <Button variant="ghost" size="icon" aria-label="Attach file">
                <Paperclip className="h-5 w-5 text-muted-foreground" />
              </Button>
              <Input
                placeholder="Type your message..."
                className="flex-grow mx-2 h-10 rounded-full bg-background/50 border-border/50 focus-visible:ring-primary focus-visible:ring-offset-0"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                aria-label="Message input"
              />
              <Button
                onClick={handleSend}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg
                           hover:translate-y-[-2px] transition-all duration-200 ease-out
                           shadow-[0_0_15px_rgba(34,197,94,0.25)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)]"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <MessageSquare className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">Select a customer to start chatting</p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ConversationPane;
