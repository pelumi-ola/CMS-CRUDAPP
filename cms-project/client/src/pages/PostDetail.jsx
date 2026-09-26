import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/posts/${slug}`)
      .then(({ data }) => setPost(data.post))
      .catch(() => setError('This post could not be found.'));
  }, [slug]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-ink-400">{error}</p>
        <Link to="/" className="mt-4 inline-block text-brass-600 hover:underline">
          Back to all posts
        </Link>
      </div>
    );
  }

  if (!post) return <p className="mx-auto max-w-2xl px-6 py-16 text-ink-400">Loading…</p>;

  return (
    <article className="mx-auto max-w-2xl px-6 py-12">
      <span className="text-xs font-medium uppercase tracking-wide text-brass-600">
        {post.category}
      </span>
      <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-ink-900">
        {post.title}
      </h1>
      <p className="mt-3 text-sm text-ink-400">
        {post.author?.name && `By ${post.author.name} · `}
        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
      </p>

      {post.image && (
        <img src={post.image} alt="" className="mt-6 w-full rounded-sm border border-ink-100" />
      )}

      <div className="prose prose-ink mt-8 whitespace-pre-wrap font-serif text-lg leading-relaxed text-ink-800">
        {post.body}
      </div>

      <Link to="/" className="mt-10 inline-block text-sm text-brass-600 hover:underline">
        ← Back to all posts
      </Link>
    </article>
  );
}
