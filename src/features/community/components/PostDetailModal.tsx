
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PostCard } from './PostCard'; // Changed to named import
import CommentThread from './CommentThread'; // The comment thread component

interface PostDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any; // This should be a more specific type later
}

const PostDetailModal: React.FC<PostDetailModalProps> = ({ isOpen, onClose, post }) => {
  // Mock comments for the thread
  const mockComments = [
    {
      id: 'c1',
      author: { name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
      content: 'Great post! Very helpful tips.',
      timestamp: '1 hour ago',
      isSolution: false,
    },
    {
      id: 'c2',
      author: { name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
      content: 'I agree, especially the part about cleaning the screen.',
      timestamp: '30 minutes ago',
      isSolution: true,
      replies: [
        {
          id: 'c3',
          author: { name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
          content: 'Thanks for the feedback, Bob!',
          timestamp: '10 minutes ago',
          isSolution: false,
        },
      ],
    },
  ];

  const handleReply = (commentId: string) => {
    console.log(`Replying to comment: ${commentId}`);
    // Logic to open a reply form for the given commentId
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-dark rounded-2xl p-8 max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-400">Post Details</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Render the PostCard without its own motion.div wrapper to avoid nested animations */}
          {post && <PostCard {...post} />}

          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <CommentThread comments={mockComments} onReply={handleReply} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostDetailModal;
