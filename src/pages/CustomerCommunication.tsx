import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare } from 'lucide-react';
import ConversationList, { Conversation } from '@/components/communication/ConversationList';
import ConversationPane, { Message } from '@/components/communication/ConversationPane';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedCard from '@/components/ui/AnimatedCard';

// Placeholder Data
const DUMMY_CONVERSATIONS: Conversation[] = [
  { id: 'conv1', customerName: 'Alice Smith', lastMessage: `Sure, I'll send it over.`, timestamp: '2 min ago', unreadCount: 2, avatarUrl: 'https://i.pravatar.cc/150?img=1' },
  { id: 'conv2', customerName: 'Bob Johnson', lastMessage: 'Thanks for the update!', timestamp: '1 hour ago', unreadCount: 0, avatarUrl: 'https://i.pravatar.cc/150?img=2' },
  { id: 'conv3', customerName: 'Charlie Brown', lastMessage: `When can I expect delivery?`, timestamp: 'Yesterday', unreadCount: 1, avatarUrl: 'https://i.pravatar.cc/150?img=3' },
  { id: 'conv4', customerName: 'Diana Prince', lastMessage: 'Product received, all good.', timestamp: '2 days ago', unreadCount: 0, avatarUrl: 'https://i.pravatar.cc/150?img=4' },
  { id: 'conv5', customerName: 'Eve Adams', lastMessage: 'Need help with setup.', timestamp: '3 days ago', unreadCount: 0, avatarUrl: 'https://i.pravatar.cc/150?img=5' },
];

const DUMMY_MESSAGES: { [key: string]: Message[] } = {
  conv1: [
    { id: 'msg1', sender: 'customer', content: `Hi, is my order ready?`, timestamp: '2 min ago' },
    { id: 'msg2', sender: 'user', content: `Sure, I'll send it over.`, timestamp: '1 min ago' },
  ],
  conv2: [
    { id: 'msg3', sender: 'user', content: 'Your service request is complete.', timestamp: '1 hour ago' },
    { id: 'msg4', sender: 'customer', content: 'Thanks for the update!', timestamp: '50 min ago' },
  ],
  conv3: [
    { id: 'msg5', sender: 'customer', content: 'When can I expect delivery?', timestamp: 'Yesterday' },
  ],
};

const CustomerCommunication: React.FC = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (selectedConversationId) {
      setMessages(DUMMY_MESSAGES[selectedConversationId] || []);
      // Mark as read
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversationId ? { ...conv, unreadCount: 0 } : conv
      ));
    } else {
      setMessages([]);
    }
  }, [selectedConversationId]);

  const handleSendMessage = (content: string) => {
    if (selectedConversationId) {
      const newMessage: Message = {
        id: `msg${Date.now()}`,
        sender: 'user',
        content,
        timestamp: 'Just now',
      };
      setMessages(prev => [...prev, newMessage]);
      // Update last message in conversation list
      setConversations(prev => prev.map(conv =>
        conv.id === selectedConversationId ? { ...conv, lastMessage: content, timestamp: 'Just now' } : conv
      ));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-4rem)] flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <div className="flex items-center gap-3 mb-6 flex-shrink-0">
        <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customer Communication</h1>
          <p className="text-sm text-muted-foreground">Connect with your customers in real-time.</p>
        </div>
      </div>

      {/* Main Communication Layout */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Conversation List Column */}
        <AnimatedCard className="w-1/3 flex flex-col p-0 border-border bg-card backdrop-blur-md overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/20">
            <h2 className="text-lg font-semibold text-foreground mb-2">Inbox</h2>
            {/* Search bar is inside ConversationList, but we could move it here for better control if needed */}
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          </div>
        </AnimatedCard>

        {/* Chat Pane Column */}
        <AnimatedCard delay={0.1} className="flex-1 flex flex-col p-0 border-border bg-card backdrop-blur-md overflow-hidden relative">
          {selectedConversationId ? (
            <ConversationPane
              selectedConversation={conversations.find(conv => conv.id === selectedConversationId) || null}
              messages={messages}
              onSendMessage={handleSendMessage}
              onToggleDetails={() => setIsDetailsPanelOpen(prev => !prev)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-4 animate-pulse-glow">
                <MessageSquare className="w-10 h-10 text-emerald-500/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Select a Conversation</h3>
              <p className="text-muted-foreground max-w-sm">
                Choose a customer from the list to start chatting or view their message history.
              </p>
            </div>
          )}
        </AnimatedCard>
      </div>
    </motion.div>
  );
};

export default CustomerCommunication;
