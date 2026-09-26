import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import ConfirmDialog from '../components/ConfirmDialog.jsx';

const STATUS_STYLES = {
  published: 'bg-green-50 text-green-700',
  draft: 'bg-ink-50 text-ink-600',
};

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/posts', { params: { status: statusFilter, limit: 50 } })
      .then(({ data }) => setPosts(data.posts))
      .finally(() => setLoading(false));
  };

  useEffect(load, [statusFilter]);

  const handleDelete = async () => {
    await api.delete(`/posts/${toDelete._id}`);
    setToDelete(null);
    setNotice('Post deleted.');
    load();
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink-900">Dashboard</h1>
          <p className="mt-1 text-ink-400">All posts, drafts included.</p>
        </div>
        <Link to="/dashboard/new" className="btn-accent">
          + New post
        </Link>
      </div>

      {notice && (
        <div className="mb-4 rounded-sm bg-green-50 px-4 py-2 text-sm text-green-700">
          {notice}
        </div>
      )}

      <div className="mb-4 flex gap-2">
        {['all', 'published', 'draft'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`rounded-sm px-3 py-1.5 text-sm capitalize ${
              statusFilter === s ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 hover:bg-ink-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <p className="p-6 text-ink-400">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="p-6 text-ink-400">No posts yet — create your first one.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-100 bg-ink-50 text-ink-400">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Updated</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-b border-ink-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink-900">{post.title}</td>
                  <td className="px-5 py-3 text-ink-400">{post.category}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_STYLES[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-400">
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <Link to={`/dashboard/edit/${post._id}`} className="text-brass-600 hover:underline">
                        Edit
                      </Link>
                      <button
                        onClick={() => setToDelete(post)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this post?"
        message={toDelete ? `“${toDelete.title}” will be permanently removed.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
