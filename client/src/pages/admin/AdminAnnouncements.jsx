import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Pin, Calendar, X } from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminAnnouncements = () => {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [isPinned, setIsPinned] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements/admin');
      if (res.data.success) {
        setAnnouncements(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load announcements', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.post('/announcements', {
        title: title.trim(),
        content: content.trim(),
        category,
        isPinned
      });

      if (res.data.success) {
        showToast('Announcement published successfully', 'success');
        setModalOpen(false);
        setTitle('');
        setContent('');
        fetchAnnouncements();
      }
    } catch (err) {
      showToast('Failed to create announcement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      showToast('Announcement removed', 'success');
      fetchAnnouncements();
    } catch (err) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            COMMUNICATION & <span className="text-gold-gradient">ANNOUNCEMENTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Publish bulletins visible to both public visitors and participant dashboard users.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-dark-950" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className="luxury-card rounded-2xl p-6 space-y-3 relative flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="px-2.5 py-0.5 rounded bg-gold-500/10 text-gold-400 font-bold uppercase tracking-wider text-[10px]">
                  {ann.category}
                </span>
                <span className="font-mono text-[11px]">
                  {new Date(ann.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white font-heading">{ann.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{ann.content}</p>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <span>Author: {ann.author || 'Draw Committee'}</span>
              <button
                onClick={() => handleDelete(ann._id)}
                className="text-red-400 hover:text-red-300 p-1 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">New Public Announcement</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-gray-300">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Draw Date Final Confirmation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-gray-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="DRAW_UPDATE">DRAW_UPDATE</option>
                  <option value="WINNERS">WINNERS</option>
                  <option value="IMPORTANT">IMPORTANT</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-gray-300">Announcement Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter bulletin text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs focus:outline-none focus:border-gold-400 leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <span className="text-gray-300 font-semibold">Pin to top of homepage and participant portal</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-800 text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-6 py-2 rounded-xl font-bold shadow-gold-glow"
                >
                  {submitting ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
