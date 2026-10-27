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

  return (
    <section aria-labelledby="feed-heading">
      <h1 id="feed-heading" className="mb-6 text-2xl font-bold">Feed</h1>
      {errorMessage && <p role="alert" className="text-red-600">{errorMessage}</p>}
      {!errorMessage && posts === null && (
        <p role="status" className="text-gray-600">Loading posts...</p>
      )}
      {!errorMessage && posts?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No posts yet.</p>
          <Link to="/write" className="text-indigo-600 underline">
            Write the first one
          </Link>
        </div>
      )}
      {!errorMessage && posts !== null && posts.length > 0 && (
        <ul className="space-y-6">
          {posts.map((post) => <PostCard key={post.id} post={post} />)}
        </ul>
      )}
    </section>
  );
}
