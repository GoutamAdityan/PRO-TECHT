
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card as _Card } from '@/components/ui/card'; // Renamed to avoid conflict
import { ThumbsUp, MessageCircle, Share2, Flag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { DURATION_SMALL, SMOOTH_EASE, motionProps, STAGGER_CHILDREN } from '@/lib/animations/motion';
import ReportModal from './ReportModal'; // Import the ReportModal component
import PostDetailModal from './PostDetailModal'; // Import PostDetailModal
import ShareModal from './ShareModal'; // Import ShareModal

const MotionCard = motion(_Card); // Create a motion-compatible Card component

interface PostCardProps {
  id: string; // Added id to identify the post
  author: {
    name: string;
    avatarUrl: string;
  };
  title: string;
  tags: string[];
  excerpt: string;
  category: string;
  timestamp: string;
  media?: { type: 'image' | 'video'; url: string }[];
  initialReactions: {
    likes: number;
    helpfuls: number;
  };
}

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_CHILDREN,
    },
  },
};

const gridItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION_SMALL, ease: SMOOTH_EASE } },
};

const ReactionButton = ({ icon, count, label, onReact, isReacted }) => {
  const IconComponent = icon;
  return (
    <Button variant="ghost" size="sm" className={`flex items-center gap-x-2 text-sm ${isReacted ? 'text-green-500' : 'text-gray-400'} hover:text-green-500 transition-colors duration-200`} onClick={onReact}>
      <motion.div whileTap={{ scale: 1.2, transition: { duration: DURATION_SMALL, ease: SMOOTH_EASE } }}>
        <IconComponent className={`w-4 h-4 ${isReacted ? 'fill-current' : ''}`} />
      </motion.div>
      <span>{label}</span>
      {count !== undefined && <span className="text-xs">{count}</span>}
    </Button>
  );
};

const PostCard: React.FC<PostCardProps> = ({
  id,
  author,
  title,
  tags,
  excerpt,
  category,
  timestamp,
  initialReactions,
  media,
  ...postProps // Capture all post props to pass to PostDetailModal
}) => {
  const [reactions, setReactions] = useState(initialReactions);
  const [reacted, setReacted] = useState({ like: false, helpful: false });
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isPostDetailModalOpen, setPostDetailModalOpen] = useState(false);
  const [isShareModalOpen, setShareModalOpen] = useState(false);

  const handleReaction = (type: 'like' | 'helpful') => {
    const wasReacted = reacted[type];
    setReacted(prev => ({ ...prev, [type]: !wasReacted }));
    setReactions(prev => ({
      ...prev,
      [type === 'like' ? 'likes' : 'helpfuls']: wasReacted ? prev[type === 'like' ? 'likes' : 'helpfuls'] - 1 : prev[type === 'like' ? 'likes' : 'helpfuls'] + 1,
    }));
  };

  const handleImageClick = (index: number) => {
    // To be implemented: open lightbox at this index
    console.log(`Open lightbox for image ${index}`);
  };

  const handleReportSubmit = (reason: string, comment: string) => {
    console.log(`Reporting post ${id} for ${reason}: ${comment}`);
    // Here you would typically send the report to your backend
  };

  const handleShare = () => {
    setShareModalOpen(true);
  };

  return (
    <MotionCard className="bg-black/30 backdrop-blur-xl border border-green-500/20 rounded-lg p-3 shadow-lg hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden" {...motionProps}>
      <div className="flex items-start gap-x-3">
        <Avatar className="w-8 h-8 border-2 border-green-400">
          <AvatarImage src={author.avatarUrl} alt={`@${author.name}`} />
          <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-green-400">{author.name}</p>
            <div className="flex items-center gap-x-2"> {/* New div to group category and timestamp */}
              <span className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded-md">{category}</span> {/* Moved category here */}
              <span className="text-xs text-gray-400">{timestamp}</span>
            </div>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">{title}</h2>
          <div className="flex flex-wrap gap-x-1 my-1">
            {tags.map((tag) => (
              <span key={tag} className="text-xs bg-green-900/50 text-green-300 px-1.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-300 text-sm line-clamp-2">{excerpt}</p>
        </div>
      </div>

      {media && media.length > 0 && (
        <motion.div
          className="mt-3 space-y-2"
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="rounded-lg overflow-hidden cursor-pointer"
            whileHover={{ y: -6, transition: { duration: DURATION_SMALL, ease: SMOOTH_EASE } }}
            variants={gridItemVariants}
            onClick={() => handleImageClick(0)}
          >
            <img src={media[0].url} alt={title} className="w-full h-auto object-cover" />
          </motion.div>
          {media.length > 1 && (
            <div className="grid grid-cols-3 gap-2">
              {media.slice(1, 4).map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-lg overflow-hidden cursor-pointer"
                  whileHover={{ y: -6, transition: { duration: DURATION_SMALL, ease: SMOOTH_EASE } }}
                  variants={gridItemVariants}
                  onClick={() => handleImageClick(index + 1)}
                >
                  <img src={item.url} alt={`${title} thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-square" />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      <div className="mt-3 flex items-center text-gray-400"> {/* Removed justify-between */}
        <div className="flex items-center gap-x-2"> {/* Left group */}
          <ReactionButton
            icon={ThumbsUp}
            count={reactions.likes}
            label="Like"
            onReact={() => handleReaction('like')}
            isReacted={reacted.like}
          />
          <ReactionButton
            icon={Heart}
            count={reactions.helpfuls}
            label="Helpful"
            onReact={() => handleReaction('helpful')}
            isReacted={reacted.helpful}
          />
          <Button variant="ghost" size="sm" className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-green-500 transition-colors duration-200" onClick={() => setPostDetailModalOpen(true)}>
            <MessageCircle className="w-4 h-4" /> {/* Increased icon size */}
            <span>Comment</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-green-500 transition-colors duration-200" onClick={handleShare}>
            <Share2 className="w-4 h-4" /> {/* Increased icon size */}
            <span>Share</span>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-x-2 text-sm text-gray-400 hover:text-red-500 transition-colors duration-200 ml-auto" onClick={() => setReportModalOpen(true)}> {/* Added ml-auto */}
            <Flag className="w-4 h-4" />
            <span>Report</span>
        </Button>
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        onReportSubmit={handleReportSubmit}
      />
      <PostDetailModal
        isOpen={isPostDetailModalOpen}
        onClose={() => setPostDetailModalOpen(false)}
        post={{ id, author, title, tags, excerpt, category, timestamp, initialReactions, media, ...postProps }}
      />
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setShareModalOpen(false)}
        postLink={`/community/post/${id}`}
      />
    </MotionCard>
  );
};

export { PostCard };
