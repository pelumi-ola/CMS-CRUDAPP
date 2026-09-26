import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';

const emptyPost = {
  title: '',
  category: 'General',
  excerpt: '',
  body: '',
  image: '',
  status: 'draft',
};

export default function PostForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyPost);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/posts/${id}`).then(({ data }) => {
      const { title, category, excerpt, body, image, status } = data.post;
      setForm({ title, category, excerpt: excerpt || '', body, image: image || '', status });
    });
  }, [id, isEdit]);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('image', file);
      const { data } = await api.post('/posts/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
      setForm((f) => ({ ...f, image: `${apiOrigin}${data.url}` }));
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e, publish) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, status: publish ? 'published' : form.status };
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl font-semibold text-ink-900">
        {isEdit ? 'Edit post' : 'New post'}
      </h1>

      <form className="mt-6 flex flex-col gap-5">
        <div>
          <label className="label">Title</label>
          <input className="input" required value={form.title} onChange={update('title')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={update('category')} />
          </div>
          <div>
            <label className="label">Status</label>
            <select className="input" value={form.status} onChange={update('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">Excerpt</label>
          <input
            className="input"
            maxLength={300}
            placeholder="One or two sentences shown in the post list"
            value={form.excerpt}
            onChange={update('excerpt')}
          />
        </div>

        <div>
          <label className="label">Cover image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="mt-1 text-xs text-ink-400">Uploading…</p>}
          {form.image && (
            <img src={form.image} alt="" className="mt-3 h-32 rounded-sm border border-ink-100 object-cover" />
          )}
        </div>

        <div>
          <label className="label">Body</label>
          <textarea
            className="input min-h-[220px]"
            required
            value={form.body}
            onChange={update('body')}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
          <button className="btn-ghost" onClick={() => navigate('/dashboard')} type="button">
            Cancel
          </button>
          <button className="btn-primary" disabled={saving} onClick={(e) => handleSubmit(e, false)}>
            Save draft
          </button>
          <button className="btn-accent" disabled={saving} onClick={(e) => handleSubmit(e, true)}>
            Publish
          </button>
        </div>
      </form>
    </div>
  );
}
