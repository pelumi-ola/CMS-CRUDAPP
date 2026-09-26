import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <Link
      to={`/posts/${post.slug}`}
      className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-md"
    >
      {post.image ? (
        <img
          src={post.image}
          alt=""
          className="h-44 w-full border-b border-ink-100 object-cover"
        />
      ) : (
        <div className="flex h-44 w-full items-center justify-center border-b border-ink-100 bg-ink-50 font-serif text-3xl text-ink-100">
          {post.title.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="text-xs font-medium uppercase tracking-wide text-brass-600">
          {post.category}
        </span>
        <h3 className="font-serif text-lg font-semibold leading-snug text-ink-900 group-hover:text-ink-600">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="line-clamp-2 text-sm text-ink-400">{post.excerpt}</p>
        )}
        <span className="mt-auto pt-2 text-xs text-ink-400">
          {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
        </span>
      </div>
    </Link>
  );
}
