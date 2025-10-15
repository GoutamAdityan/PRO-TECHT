
import React from 'react';
import Comment, { CommentProps } from './Comment';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CommentThreadProps {
  comments: CommentProps[];
  onReply: (commentId: string) => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({ comments, onReply }) => {
  return (
    <div className="space-y-4">
      {/* Comment Input Form Placeholder */}
      <div className="flex gap-2">
        <Input placeholder="Write a comment..." className="flex-grow bg-gray-800 border-gray-700 text-white" />
        <Button>Post</Button>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="border-l-2 border-gray-700 pl-4">
          <Comment {...comment} onReply={onReply} />
          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 mt-4 space-y-4">
              {comment.replies.map((reply) => (
                <Comment key={reply.id} {...reply} onReply={onReply} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentThread;
