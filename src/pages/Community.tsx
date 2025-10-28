
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PostCard } from '@/features/community/components/PostCard';
import PostComposer from '@/components/custom/PostComposer';
import { Button } from '@/components/ui/button';
import { postCategories } from '@/features/community/data';
import { Users } from 'lucide-react';
import { useCommunityPosts } from '@/hooks/useCommunityPosts';

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

const itemVariants = {
  hidden: { y: 12, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
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
      className="max-w-6xl mx-auto px-6 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="p-2 rounded-full bg-emerald-800/30 flex items-center justify-center"
        >
          <Users className="w-5 h-5 text-emerald-400" />
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Community Wall</h1>
      </div>
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold leading-tight mb-2 text-white">Community Wall</h1>
          <p className="text-lg text-muted-foreground leading-relaxed text-gray-300">
            Connect with other users, share tips, and get help.
          </p>
        </div>
        <Button onClick={() => setIsPostComposerOpen(true)}>Create Post</Button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="bg-card/80 dark:bg-[#0f1713]/85 border border-border/50 backdrop-blur-sm p-4 rounded-lg mb-6 flex items-center gap-4">
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
      </motion.div>

      {/* Posts List */}
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {posts.map(post => (
            <motion.div key={post.id} variants={itemVariants}>
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
                initialReactions={{ likes: 0, helpfuls: 0 }} // TODO: Fetch reactions
                media={post.image_urls.map(url => ({ type: 'image', url }))}
              />
            </motion.div>
          ))}
        </div>
      )}

      <PostComposer isOpen={isPostComposerOpen} onOpenChange={setIsPostComposerOpen} />
    </motion.div>
  );
};

export default Community;
