import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { Users, MessageSquare } from 'lucide-react';
import { containerVariants, headerIconVariants, cardVariants } from '@/lib/animations';
import ConversationList, { Conversation } from '@/components/communication/ConversationList';
import ConversationPane, { Message } from '@/components/communication/ConversationPane';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const shouldReduceMotion = useReducedMotion();

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
      // TODO: Send message via API
    }
  };

  const containerAnimation = shouldReduceMotion ? { opacity: 1 } : containerVariants;
  const headerIconAnimation = shouldReduceMotion ? { opacity: 1, scale: 1 } : headerIconVariants;

  return (
    <PageTransition>
      <motion.div
        className="max-w-6xl mx-auto px-6 py-6 text-white"
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* Header Section */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            variants={headerIconAnimation}
            initial="hidden"
            animate="show"
            className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
          >
            <Users className="w-5 h-5 text-emerald-400" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Customer Communication</h1>
        </div>

        {/* Subtitle matching consumer dashboard style */}
        <motion.p
          variants={shouldReduceMotion ? { opacity: 1 } : cardVariants} // Using cardVariants for subtitle entry
          initial="hidden"
          animate="show"
          className="text-lg text-foreground/70 mb-8"
        >
          Manage customer conversations and service inquiries.
        </motion.p>

        {/* Main Communication Layout */}
        <div className="flex h-[calc(100vh-250px)] gap-8">
          <div className="w-1/3">
            <ConversationList
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={setSelectedConversationId}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
            />
          </div>
          <div className="flex-1">
            <ConversationPane
              selectedConversation={conversations.find(conv => conv.id === selectedConversationId) || null}
              messages={messages}
              onSendMessage={handleSendMessage}
              onToggleDetails={() => setIsDetailsPanelOpen(prev => !prev)}
            />
          </div>
        </div>

        {/* TODO: Integrate DetailsPanel if needed, similar to ActiveJobs */}
        {/* <DetailsPanel
          open={isDetailsPanelOpen}
          onClose={() => setIsDetailsPanelOpen(false)}
          conversationId={selectedConversationId}
          isMobile={isMobile}
        /> */}
      </motion.div>
    </PageTransition>
  );
};

export default CustomerCommunication;
