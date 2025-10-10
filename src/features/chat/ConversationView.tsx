
// src/features/chat/ConversationView.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Message } from './realtime';
import { ChatState } from './useChat'; // Import ChatState interface
import { Smile, Paperclip } from 'lucide-react';
import './ChatBubble.css'; // Import the new CSS file

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
    <div
      className={cn(
        "flex w-full mb-2",
        isAgent ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "relative max-w-[65%] px-4 py-2 rounded-xl",
          isAgent
            ? "bg-primary text-primary-foreground message-bubble-agent"
            : "bg-muted message-bubble-customer"
        )}
      >
        <div className="flex flex-col">
          <p className="text-sm">{message.content}</p>
          <span
            className={cn(
              "self-end text-xs text-muted-foreground mt-1",
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isAgent && message.read && <span className="ml-1">✓✓</span>} {/* Read status for agent messages */}
          </span>
        </div>
      </div>
    </div>
  );
};

interface ConversationViewProps extends ChatState {}

export const ConversationView: React.FC<ConversationViewProps> = ({ selectedCustomer, messages, isLoadingMessages, isSendingMessage, sendMessage, isTyping, isCustomerOnline }) => {
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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={selectedCustomer.avatar} alt={selectedCustomer.name} />
            <AvatarFallback>{selectedCustomer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{selectedCustomer.name}</p>
            <p className="text-sm text-muted-foreground">
              {isCustomerOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
        {/* Action buttons placeholder */}
        <div>
          <Button variant="ghost" size="icon">
            {/* Icon for call/video call etc. */}
            <span className="sr-only">Call</span>
          </Button>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" role="log" aria-live="polite">
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
                    <span className="relative z-10 inline-block bg-background px-2 text-sm text-muted-foreground">
                      {formatDateSeparator(message.timestamp)}
                    </span>
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-border" />
                    </div>
                  </div>
                )}
                <MessageBubble message={message} isAgent={message.sender === 'agent'} />
              </React.Fragment>
            );
          })
        )}
        {isTyping && (
          <div className="text-sm text-muted-foreground italic">{selectedCustomer.name} is typing...</div>
        )}
        <div ref={messagesEndRef} />
        {isSendingMessage && (
          <div className="text-right text-sm text-muted-foreground italic">Sending...</div>
        )}
      </div>

      {/* Message Composer */}
      <div className="flex items-end gap-2 border-t bg-background p-3">
        <Button variant="ghost" size="icon" className="shrink-0">
          <Smile className="h-5 w-5" />
          <span className="sr-only">Add emoji</span>
        </Button>
        <Button variant="ghost" size="icon" className="shrink-0">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="max-h-[100px] min-h-[40px] flex-1 resize-none"
        />
        <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isSendingMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};
