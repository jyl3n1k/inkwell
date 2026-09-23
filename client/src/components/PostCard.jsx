export function PostCard({ post }) {
  return (
    <li className="border-b border-gray-200 pb-4 [overflow-wrap:anywhere]">
      <h2 className="text-xl font-semibold">{post.title}</h2>
      <p className="mt-1 text-gray-600 line-clamp-3">{post.body}</p>
    </li>
  );
}
