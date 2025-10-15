import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import ImageUpload from './ImageUpload';
import TagsInput from './TagsInput';
import { postCategories } from '@/features/community/data';

interface PostComposerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ isOpen, onOpenChange }) => {
  const [category, setCategory] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('community');

  const handleFilesUpdate = (updatedFiles: File[]) => {
    setFiles(updatedFiles);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glassmorphic-dark rounded-2xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Share your experience or ask a question to the community.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="title"
              placeholder="Short title or issue summary"
              className="col-span-4"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Textarea
              id="body"
              placeholder="Describe issue, steps, date of purchase, model..."
              className="col-span-4 h-32"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <TagsInput tags={tags} setTags={setTags} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={setCategory}>
              <SelectTrigger className="col-span-4">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {postCategories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <ImageUpload onFilesUpdate={handleFilesUpdate} />
          <div className="grid grid-cols-4 items-center gap-4">
            <RadioGroup defaultValue="community" onValueChange={setVisibility} className="col-span-4 flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="community" id="r1" className="radio-bright" />
                <Label htmlFor="r1" className="text-radio-bright">Share with community</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="r2" className="radio-bright" />
                <Label htmlFor="r2" className="text-radio-bright">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followers" id="r3" className="radio-bright" />
                <Label htmlFor="r3" className="text-radio-bright">Followers-only</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter className="flex-col gap-2">
            <Button type="submit" variant="primary" className="w-full neon-green-accent">Publish</Button>
            <Button type="button" variant="ghost" className="w-full">Save draft</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PostComposer;
