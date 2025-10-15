
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCard } from '@/features/community/components/PostCard'; // Changed to named import
import PostComposer from '@/components/custom/PostComposer';
import { Button } from '@/components/ui/button';
import { postCategories } from '@/features/community/data';

// Mock data for community posts
const mockPosts = [
  {
    id: '1',
    author: { name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    title: 'How to properly clean your new gadget?',
    tags: ['cleaning', 'maintenance'],
    excerpt: 'Just got the new Pro-Gadget X and I want to make sure I keep it in top condition. What are the best practices for cleaning the screen and body without causing damage?',
    category: 'General Discussion',
    timestamp: '2 hours ago',
    initialReactions: { likes: 15, helpfuls: 7 },
    media: [{ type: 'image', url: 'https://picsum.photos/seed/post1/800/400' }],
  },
  {
    id: '2',
    author: { name: 'John Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    title: 'Show off your setup!',
    tags: ['setup', 'customization'],
    excerpt: 'Here is my current desk setup with all my favorite tech. I would love to see what you all have created!',
    category: 'Showcase',
    timestamp: '5 hours ago',
    initialReactions: { likes: 42, helpfuls: 12 },
    media: [
      { type: 'image', url: 'https://picsum.photos/seed/post2/800/400' },
      { type: 'image', url: 'https://picsum.photos/seed/post2a/400/400' },
      { type: 'image', url: 'https://picsum.photos/seed/post2b/400/400' },
    ],
  },
  // Add more posts to make the list longer and filtering more apparent
];

const Community: React.FC = () => {
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredPosts = useMemo(() => {
    let posts = mockPosts.map(p => ({ ...p, relevance: p.initialReactions.likes + p.initialReactions.helpfuls }));

    if (searchTerm) {
      posts = posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.excerpt.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category !== 'all') {
      posts = posts.filter(p => p.category === category);
    }

    switch (sortBy) {
      case 'likes':
        posts.sort((a, b) => b.initialReactions.likes - a.initialReactions.likes);
        break;
      case 'relevance':
        posts.sort((a, b) => b.relevance - a.relevance);
        break;
      case 'recent':
      default:
        // Assuming the mock data is already sorted by recent
        break;
    }

    return posts;
  }, [searchTerm, category, sortBy]);

  const categories = ['all', ...postCategories];

  return (
    <motion.div
      className="max-w-6xl mx-auto px-6 py-6 text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold leading-tight mb-2">Community Wall</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Connect with other users, share tips, and get help.
          </p>
        </div>
        <Button onClick={() => setIsPostComposerOpen(true)}>Create Post</Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-card/80 dark:bg-[#0f1713]/85 border border-border/50 backdrop-blur-sm p-4 rounded-lg mb-6 flex items-center gap-4">
        <Input
          placeholder="Search posts..."
          className="max-w-xs bg-gray-800 border-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(c => <SelectItem key={c} value={c}>{c === 'all' ? 'All Categories' : c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="relevance">Most Relevant</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredPosts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </div>

      <PostComposer isOpen={isPostComposerOpen} onOpenChange={setIsPostComposerOpen} />
    </motion.div>
  );
};

export default Community;
