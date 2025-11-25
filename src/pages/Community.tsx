import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCard } from '@/features/community/components/PostCard';
import PostComposer from '@/components/custom/PostComposer';
import { Button } from '@/components/ui/button';
import { postCategories } from '@/features/community/data';
import { Users, Search, Filter, Plus, MessageCircle, Heart, Share2 } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';
import AnimatedCard from '@/components/ui/AnimatedCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const Community: React.FC = () => {
  const [isPostComposerOpen, setIsPostComposerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { posts, loading } = useCommunityPosts(searchTerm, category, sortBy);

  const categories = ['all', ...postCategories];

  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/40 to-emerald-800/20 border border-border p-8 md:p-12 mb-10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                <Users className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">Community Wall</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Connect with other users, share tips, and get help from the Pro-Techt community.
            </p>
          </div>
          <Button onClick={() => setIsPostComposerOpen(true)} className="btn-neon rounded-full px-8 py-6 text-lg shadow-lg shadow-emerald-500/20">
            <Plus className="w-5 h-5 mr-2" /> Create Post
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 sticky top-4 z-20 bg-background/80 backdrop-blur-xl p-4 rounded-2xl border border-border shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search discussions..."
            className="pl-10 bg-background/50 border-border focus:border-emerald-500/50 transition-all h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[160px] bg-background/50 border-border h-11">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c === 'all' ? 'All Categories' : c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-background/50 border-border h-11">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="likes">Most Liked</SelectItem>
              <SelectItem value="relevance">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center min-h-[40vh] text-center"
          >
            <div className="p-6 rounded-full bg-muted/20 mb-6">
              <MessageCircle className="w-16 h-16 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No Posts Found</h2>
            <p className="text-muted-foreground mb-6">
              Be the first to start a conversation in this category!
            </p>
            <Button onClick={() => setIsPostComposerOpen(true)} variant="outline" className="btn-subtle rounded-full">
              Start a Discussion
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => (
              <AnimatedCard
                key={post.id}
                delay={index * 0.05}
                className="h-full border-border hover:border-emerald-500/30 transition-colors p-0 overflow-hidden flex flex-col"
              >
                <PostCard
                  id={post.id}
                  author={{
                    name: post.profiles.full_name,
                    avatarUrl: post.profiles.avatar_url,
                  }}
                  title={post.title}
                  tags={post.tags}
                  excerpt={post.body}
                  category={post.category}
                  timestamp={new Date(post.created_at).toLocaleDateString()}
                  initialReactions={{ likes: 0, helpfuls: 0 }}
                  media={post.image_urls.map(url => ({ type: 'image', url }))}
                />
              </AnimatedCard>
            ))}
          </div>
        )}
      </AnimatePresence>

      <PostComposer isOpen={isPostComposerOpen} onOpenChange={setIsPostComposerOpen} />
    </motion.div>
  );
};

export default Community;
