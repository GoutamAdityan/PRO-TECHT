
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Facebook, Twitter, Linkedin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  postLink: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin + postLink);
    setCopied(true);
    toast({ title: 'Link copied!', description: 'The post link has been copied to your clipboard.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphic-dark rounded-2xl p-8 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-green-400">Share Post</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <Label htmlFor="post-link" className="text-gray-300">Shareable Link</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input id="post-link" value={window.location.origin + postLink} readOnly className="flex-grow bg-gray-800 border-gray-700 text-white" />
              <Button onClick={handleCopyLink} className="bg-green-600 hover:bg-green-700">
                <Copy className="w-4 h-4 mr-2" /> {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Share to Social Media</Label>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-grow bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Facebook className="w-4 h-4 mr-2" /> Facebook
              </Button>
              <Button variant="outline" className="flex-grow bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Twitter className="w-4 h-4 mr-2" /> Twitter
              </Button>
              <Button variant="outline" className="flex-grow bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                <Linkedin className="w-4 h-4 mr-2" /> LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;
