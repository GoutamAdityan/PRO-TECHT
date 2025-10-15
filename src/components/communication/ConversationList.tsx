import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import SearchBar from '@/components/ui/SearchBar';
import StatusBadge from '@/components/ui/StatusBadge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { cardVariants, cardHoverVariants, rowVariants } from '@/lib/animations';
import { MessageSquare, User } from 'lucide-react';

// Placeholder Data Types
export interface Conversation {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  avatarUrl?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  searchTerm,
  onSearchTermChange,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const cardAnimation = shouldReduceMotion ? { opacity: 1, y: 0, scale: 1 } : cardVariants;

  const filteredConversations = conversations.filter(conv =>
    conv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      variants={cardAnimation}
      initial="hidden"
      animate="show"
      exit="exit"
      whileHover={shouldReduceMotion ? {} : cardHoverVariants.hover}
      className="rounded-2xl transition-all duration-300 ease-out
                 shadow-[0_0_15px_rgba(34,197,94,0.05)] hover:shadow-[0_0_25px_rgba(34,197,94,0.15)] h-full"
      role="complementary"
      aria-label="Conversation List"
    >
      <Card className="bg-muted/40 backdrop-blur-xl border border-foreground/10 rounded-2xl p-4 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <MessageSquare className="w-6 h-6 text-emerald-400 mr-3" />
          <h3 className="text-lg font-medium text-foreground/90">Conversations</h3>
        </div>
        <div className="mb-4">
          <SearchBar
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            aria-label="Search conversations"
          />
        </div>
        <div className="flex-grow overflow-y-auto pr-2">
          <ul className="space-y-2" role="list">
            <AnimatePresence>
              {filteredConversations.map((conv) => (
                <motion.li
                  key={conv.id}
                  variants={shouldReduceMotion ? { opacity: 1 } : rowVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.01, transition: { duration: 0.12 } }}
                  onClick={() => onSelectConversation(conv.id)}
                  className={cn(
                    "flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200",
                    "hover:bg-accent/10",
                    conv.id === selectedConversationId ? "bg-accent/20" : ""
                  )}
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Conversation with ${conv.customerName}. Last message: ${conv.lastMessage}. ${conv.unreadCount > 0 ? `${conv.unreadCount} unread messages.` : ''}`}
                >
                  <Avatar className="h-9 w-9 mr-3">
                    <AvatarImage src={conv.avatarUrl} alt={conv.customerName} />
                    <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                  </Avatar>
                  <div className="flex-grow">
                    <p className="font-medium text-foreground/90">{conv.customerName}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  <div className="flex flex-col items-end ml-2">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{conv.timestamp}</p>
                    <AnimatePresence>
                      {conv.unreadCount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-bold"
                          aria-label={`${conv.unreadCount} unread messages`}
                        >
                          {conv.unreadCount}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {filteredConversations.length === 0 && (
              <li className="text-center text-muted-foreground py-4">
                No conversations found.
              </li>
            )}
          </ul>
        </div>
      </Card>
    </motion.div>
  );
};

export default ConversationList;
