"use client";
import { useState, useEffect } from "react";
import PostCard from "@/components/PostCard";
import { getTrendingPosts } from "@/lib/api";

export default function Trending() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const data = await getTrendingPosts();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return <div className="max-w-2xl mx-auto">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text text-black tracking-tighter">
        Trending Posts
      </h1>
      <div className="space-y-4">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={`trending-${post.userid}-${post.id}`} post={post} />
          ))
        ) : (
          <p className="text-gray-400">No trending posts available</p>
        )}
      </div>
    </div>
  );
}
