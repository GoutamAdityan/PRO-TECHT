import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Uploader } from '@/components/ui/Uploader';
import TagsInput from './TagsInput';
import { postCategories } from '@/features/community/data';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  body: z.string().min(20, { message: "Body must be at least 20 characters." }),
  tags: z.array(z.string()).optional(),
  category: z.string().min(1, { message: "Please select a category." }),
  visibility: z.string(),
  files: z.array(z.instanceof(File)).optional(),
});

interface PostComposerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ isOpen, onOpenChange }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: [],
      category: '',
      visibility: 'community',
      files: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({ title: "Error", description: "You must be logged in to create a post.", variant: "destructive" });
      return;
    }

    try {
      let imageUrls: string[] = [];
      if (values.files && values.files.length > 0) {
        for (const file of values.files) {
          const filePath = `${user.id}/posts/${Date.now()}-${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('post_images')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: urlData } = supabase.storage
            .from('post_images')
            .getPublicUrl(filePath);
          imageUrls.push(urlData.publicUrl);
        }
      }

      const { error: insertError } = await supabase.from('posts').insert({
        author_id: user.id,
        title: values.title,
        body: values.body,
        tags: values.tags,
        category: values.category,
        visibility: values.visibility,
        image_urls: imageUrls,
      });

      if (insertError) throw insertError;

      toast({ title: "Success", description: "Post published successfully." });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating post:", error);
      toast({ title: "Error", description: error.message || "An unexpected error occurred. Please check the console for details.", variant: "destructive" });
    }
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <Input placeholder="Short title or issue summary" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <Textarea placeholder="Describe issue, steps, date of purchase, model..." className="h-32" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <TagsInput tags={field.value || []} setTags={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {postCategories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <Uploader onFilesChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex-col gap-2">
              <Button type="submit" variant="primary" className="w-full neon-green-accent">Publish</Button>
              <Button type="button" variant="ghost" className="w-full">Save draft</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PostComposer;
