
// src/features/chat/ConversationView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Message } from './realtime';
import { ChatState } from './useChat';
import { Smile, Paperclip, InfoIcon } from 'lucide-react';
import './ChatBubble.css';
import { motion } from 'framer-motion';

// Helper to format date for chat separators
const formatDateSeparator = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString();
  }
};

const MessageBubble: React.FC<{ message: Message; isAgent: boolean }> = ({ message, isAgent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "flex w-full mb-2",
        isAgent ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[65%] px-4 py-2 rounded-xl shadow-md",
          isAgent
            ? "bg-primary text-primary-foreground message-bubble-agent rounded-br-none"
            : "bg-muted text-muted-foreground message-bubble-customer rounded-bl-none"
        )}
      >
        <div className="flex flex-col">
          <p className="text-sm">{message.content}</p>
          <span
            className={cn(
              "self-end text-xs text-muted-foreground mt-1",
              isAgent && "text-primary-foreground/70" // Adjust timestamp color for agent messages
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isAgent && message.read && <span className="ml-1">✓✓</span>} {/* Read status for agent messages */}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

interface ConversationViewProps extends ChatState {
  isDetailsPanelOpen: boolean;
  setIsDetailsPanelOpen: (open: boolean) => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({ selectedCustomer, messages, isLoadingMessages, isSendingMessage, sendMessage, isTyping, isCustomerOnline, isDetailsPanelOpen, setIsDetailsPanelOpen }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [messages, selectedCustomer]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [newMessage]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedCustomer) {
      await sendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!selectedCustomer) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a customer to start chatting
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 p-3 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-border/50">
            <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
            <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-lg">{selectedCustomer.name}</p>
            <p className="text-sm text-muted-foreground">
              {isCustomerOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDetailsPanelOpen((prev) => !prev)}
            aria-label="Toggle customer and product details"
            className="hover:bg-accent/10"
          >
            <InfoIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 custom-scrollbar" role="log" aria-live="polite">
        {isLoadingMessages ? (
          <div className="text-center text-muted-foreground">Loading messages...</div>
        ) : (
          messages.map((message, index) => {
            const previousMessage = messages[index - 1];
            const showDateSeparator =
              !previousMessage ||
              formatDateSeparator(previousMessage.timestamp) !==
                formatDateSeparator(message.timestamp);

            return (
              <React.Fragment key={message.id}>
                {showDateSeparator && (
                  <div className="relative my-6 text-center">
                    <span className="relative z-10 inline-block bg-background px-2 text-sm text-muted-foreground rounded-full shadow-sm">
                      {formatDateSeparator(message.timestamp)}
                    </span>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-border/50" />
                    </div>
                  </div>
                )}
                <MessageBubble message={message} isAgent={message.sender === 'agent'} />
              </React.Fragment>
            );
          })
        )}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted-foreground italic p-2 rounded-lg bg-muted/50 self-start max-w-fit"
          >
            {selectedCustomer.name} is typing...
          </motion.div>
        )}
        <div ref={messagesEndRef} />
        {isSendingMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-right text-sm text-muted-foreground italic p-2 rounded-lg bg-muted/50 self-end max-w-fit ml-auto"
          >
            Sending...
          </motion.div>
        )}
      </div>

      {/* Message Composer */}
      <div className="flex items-end gap-2 border-t border-border/50 bg-card/50 backdrop-blur-sm p-3 sticky bottom-0">
        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-accent/10">
          <Smile className="h-5 w-5" />
          <span className="sr-only">Add emoji</span>
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0 hover:bg-accent/10">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="max-h-[100px] min-h-[40px] flex-1 resize-none bg-background/50 border-border/50 focus-visible:ring-primary rounded-lg shadow-inner"
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSendingMessage} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Send
        </Button>
      </div>
    </div>
  );
};
