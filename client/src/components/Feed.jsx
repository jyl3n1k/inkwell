import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "./PostCard";

export function Feed() {
  const [posts, setPosts] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let active = true;

    fetch("/api/posts?page=1")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load posts.");
        return response.json();
      })
      .then((data) => {
        if (active) setPosts(data.posts);
      })
      .catch(() => {
        if (active) setErrorMessage("Unable to load posts. Please try again.");
      });

    return () => { active = false; };
  }, []);

  if (errorMessage) {
    return <p role="alert" className="text-red-600">{errorMessage}</p>;
  }

  if (posts === null) {
    return <p role="status" className="text-gray-500">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No posts yet.</p>
        <Link to="/write" className="text-indigo-600 underline">
          Write the first one
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-6">
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
    </ul>
  );
}
