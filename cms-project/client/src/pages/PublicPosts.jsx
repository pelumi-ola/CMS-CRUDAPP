import { useEffect, useState } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard.jsx';

export default function PublicPosts() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    api
      .get('/posts', { params: { page, search: search || undefined, limit: 9 } })
      .then(({ data }) => {
        setPosts(data.posts);
        setPages(data.pages);
      })
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-col gap-4 border-b border-ink-100 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink-900">Latest posts</h1>
          <p className="mt-1 text-ink-400">Published content from the desk.</p>
        </div>
        <input
          className="input sm:w-64"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <p className="text-ink-400">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-ink-400">Nothing published yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {pages > 1 && (
        <div className="mt-10 flex justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-sm text-sm ${
                p === page ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-ink-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
