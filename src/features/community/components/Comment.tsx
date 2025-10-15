
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MoreVertical, CornerDownRight, ThumbsUp, ShieldCheck } from 'lucide-react';

export interface CommentProps {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  timestamp: string;
  isSolution?: boolean;
  isOwner?: boolean;
  replies?: CommentProps[];
}

const Comment: React.FC<CommentProps & { onReply: (id: string) => void }> = ({ id, author, content, timestamp, isSolution, isOwner, onReply }) => {
  return (
    <div className={`flex items-start space-x-3 p-3 rounded-lg ${isSolution ? 'bg-green-900/50 border border-green-500/30' : ''}`}>
      <Avatar className="w-9 h-9 border-2 border-gray-600">
        <AvatarImage src={author.avatarUrl} alt={`@${author.name}`} />
        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-200">{author.name}</span>
            <span className="text-xs text-gray-500 ml-2">{timestamp}</span>
          </div>
          {isSolution && (
            <div className="flex items-center gap-1 text-xs text-green-400 bg-green-800/50 px-2 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Accepted Solution</span>
            </div>
          )}
        </div>
        <p className="text-gray-300 mt-1 text-sm">{content}</p>
        <div className="mt-2 flex items-center gap-4 text-gray-400">
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:text-green-400" onClick={() => onReply(id)}>
            <CornerDownRight className="w-3.5 h-3.5" />
            <span>Reply</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-xs hover:text-blue-400">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Helpful</span>
          </Button>
          <Button variant="ghost" size="icon" className="ml-auto w-8 h-8 hover:bg-gray-700">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
