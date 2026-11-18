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
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
            COMMUNICATION & <span className="text-gold-gradient">ANNOUNCEMENTS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] mt-1">
            Publish bulletins visible to both public visitors and participant dashboard users.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#0F172A]" />
          <span>New Announcement</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((ann) => (
          <div
            key={ann._id}
            className="luxury-card rounded-2xl p-6 space-y-3 relative flex flex-col justify-between border border-[#E2E8F0] shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#64748B]">
                <span className="px-2.5 py-0.5 rounded bg-amber-100 text-[#8C610A] border border-amber-300 font-bold uppercase tracking-wider text-[10px]">
                  {ann.category}
                </span>
                <span className="font-mono text-[11px]">
                  {new Date(ann.publishedAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] font-heading">{ann.title}</h3>
              <p className="text-xs text-[#334155] leading-relaxed">{ann.content}</p>
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
              <span>Author: <strong className="text-[#0F172A] font-semibold">{ann.author || 'Draw Committee'}</strong></span>
              <button
                onClick={() => handleDelete(ann._id)}
                className="text-rose-600 hover:text-rose-800 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-bold text-[#0F172A] font-heading">New Public Announcement</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold uppercase text-[#334155]">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Draw Date Final Confirmation"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A] placeholder-[#94A3B8]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[#334155]">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold focus:outline-none focus:border-[#8C610A]"
                >
                  <option value="GENERAL">GENERAL</option>
                  <option value="DRAW_UPDATE">DRAW_UPDATE</option>
                  <option value="WINNERS">WINNERS</option>
                  <option value="IMPORTANT">IMPORTANT</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold uppercase text-[#334155]">Announcement Content *</label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter bulletin text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs focus:outline-none focus:border-[#8C610A] placeholder-[#94A3B8] leading-relaxed"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 accent-[#8C610A] rounded"
                />
                <span className="text-[#334155] font-semibold">Pin to top of homepage and participant portal</span>
              </label>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-[#475569] hover:bg-gray-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-6 py-2 rounded-xl font-bold shadow-sm"
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
