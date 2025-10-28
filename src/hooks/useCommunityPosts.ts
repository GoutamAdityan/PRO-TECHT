import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Post {
  id: string;
  created_at: string;
  author_id: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  image_urls: string[];
  profiles: { full_name: string; avatar_url: string; }; // From joined profiles table
}

export const useCommunityPosts = (searchTerm: string, category: string, sortBy: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('posts')
          .select(`
            id, created_at, author_id, title, body, tags, category, image_urls,
            profiles (full_name, avatar_url)
          `);

        const { data, error } = await query;

        if (error) throw error;
        setPosts(data || []);
      } catch (error: any) {
        console.error("Error fetching posts:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const filteredAndSortedPosts = useMemo(() => {
    let processedPosts = posts.map(p => ({ ...p, relevance: 0 /* TODO: Implement relevance calculation */ }));

    if (searchTerm) {
      processedPosts = processedPosts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.body.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (category !== 'all') {
      processedPosts = processedPosts.filter(p => p.category === category);
    }

    switch (sortBy) {
      case 'likes':
        // TODO: Implement sorting by likes (requires fetching reaction counts)
        break;
      case 'relevance':
        // TODO: Implement sorting by relevance
        break;
      case 'recent':
      default:
        processedPosts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return processedPosts;
  }, [posts, searchTerm, category, sortBy]);

  return { posts: filteredAndSortedPosts, loading };
};
