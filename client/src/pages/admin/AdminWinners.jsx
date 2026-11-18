import React, { useState, useEffect } from 'react';
import {
  Award,
  Globe,
  EyeOff,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminWinners = () => {
  const { showToast } = useToast();
  const [winners, setWinners] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [selectedPrizeFilter, setSelectedPrizeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // Unpublish modal
  const [unpublishModalOpen, setUnpublishModalOpen] = useState(false);
  const [unpublishReason, setUnpublishReason] = useState('');
  const [unpublishTargetPrize, setUnpublishTargetPrize] = useState('');

  const fetchData = async () => {
    try {
      const [wRes, pRes] = await Promise.all([
        api.get(`/winners/admin${selectedPrizeFilter ? `?prizeId=${selectedPrizeFilter}` : ''}`),
        api.get('/prizes')
      ]);

      if (wRes.data.success) setWinners(wRes.data.data);
      if (pRes.data.success) setPrizes(pRes.data.data);
    } catch (err) {
      showToast('Failed to load winners data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPrizeFilter]);

  const handlePublish = async (prizeId = null, publishAll = false) => {
    const confirmText = publishAll
      ? 'PUBLISH ALL APPROVED WINNERS: This will publish all approved winners across all prize categories to the live website. Continue?'
      : 'PUBLISH PRIZE WINNERS: This will publish approved winners for this prize category to the live website. Continue?';

    if (!window.confirm(confirmText)) return;

    setPublishing(true);
    try {
      const res = await api.post('/winners/publish', {
        prizeId,
        publishAll
      });

      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Publishing failed', 'error');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublishSubmit = async () => {
    if (!unpublishReason.trim()) {
      showToast('A mandatory correction reason is required to unpublish results', 'error');
      return;
    }

    try {
      const res = await api.post('/winners/unpublish', {
        prizeId: unpublishTargetPrize || undefined,
        reason: unpublishReason.trim()
      });

      if (res.data.success) {
        showToast(`Unpublished ${res.data.count} winners. Action recorded in audit log.`, 'success');
        setUnpublishModalOpen(false);
        setUnpublishReason('');
        setUnpublishTargetPrize('');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Unpublish failed', 'error');
    }
  };

  const approvedUnpublishedCount = winners.filter((w) => w.status === 'APPROVED' && !w.isPublished).length;
  const publishedCount = winners.filter((w) => w.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
            PUBLISHED <span className="text-gold-gradient">WINNERS & CONTROLS</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
            Step 7: Control public release of verified winners (prize-wise or universal).
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePublish(null, true)}
            disabled={publishing || approvedUnpublishedCount === 0}
            className="btn-gold px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-gold-glow disabled:opacity-40"
          >
            <Globe className="w-4 h-4 text-[#0F172A]" />
            <span>Publish All Approved ({approvedUnpublishedCount})</span>
          </button>

          {publishedCount > 0 && (
            <button
              onClick={() => {
                setUnpublishTargetPrize('');
                setUnpublishModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <EyeOff className="w-4 h-4" />
              <span>Unpublish All</span>
            </button>
          )}
        </div>
      </div>

      {/* Prize Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#475569] uppercase tracking-wider font-display">Filter by Prize:</span>
          <select
            value={selectedPrizeFilter}
            onChange={(e) => setSelectedPrizeFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
          >
            <option value="">All Prize Categories</option>
            {prizes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.quantity} units)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-[#64748B]">Total Records: <strong className="text-[#0F172A]">{winners.length}</strong></span>
          <span className="text-[#047857]">Published: <strong className="text-[#047857]">{publishedCount}</strong></span>
          <span className="text-[#B45309]">Ready to Publish: <strong className="text-[#B45309]">{approvedUnpublishedCount}</strong></span>
        </div>
      </div>

      {/* Winners List Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8EAF0] shadow-card-light">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-[#475569] font-black font-display bg-[#FAF8F5]">
                <th className="py-3.5 px-4">Rank</th>
                <th className="py-3.5 px-4">Participant ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Prize Category</th>
                <th className="py-3.5 px-4">Approval Status</th>
                <th className="py-3.5 px-4">Website Published</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#0F172A]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#8C610A] font-bold font-mono">
                    Loading winners...
                  </td>
                </tr>
              ) : winners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B]">
                    No winners entered yet. Go to "Enter Winners" to input entries from the physical draw.
                  </td>
                </tr>
              ) : (
                winners.map((win) => (
                  <tr key={win._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-[#8C610A]">#{win.rank}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-[#0F172A]">{win.participantId}</td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">{win.participant?.fullName || 'N/A'}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#8C610A]">{win.prize?.name}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          win.status === 'APPROVED'
                            ? 'bg-[#ECFDF5] border border-[#10B981]/30 text-[#047857]'
                            : win.status === 'PENDING_APPROVAL'
                            ? 'bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#B45309]'
                            : 'bg-[#FEF2F2] border border-[#EF4444]/30 text-[#B91C1C]'
                        }`}
                      >
                        {win.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {win.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[#047857] font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Live on Website</span>
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">Unpublished</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {win.status === 'APPROVED' && !win.isPublished && (
                        <button
                          onClick={() => handlePublish(win.prize?._id, false)}
                          className="px-3 py-1 rounded-lg bg-[#FAF7EE] border border-[#D4AF37]/50 text-[#8C610A] font-bold text-[11px] hover:bg-[#F3E5C1] transition-colors"
                        >
                          Publish Category
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unpublish Modal */}
      {unpublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-red-300 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-bold text-red-600 font-heading">Documented Correction (Unpublish)</h3>
              <button
                onClick={() => setUnpublishModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Per strict transparency guidelines, unpublishing results removes them from the public website and requires a documented audit explanation.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">
                Mandatory Correction Reason *
              </label>
              <textarea
                rows={3}
                required
                value={unpublishReason}
                onChange={(e) => setUnpublishReason(e.target.value)}
                placeholder="e.g. Correction required per audit committee verification of ballot #12"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-red-300 text-[#0F172A] text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUnpublishModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUnpublishSubmit}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                Confirm Unpublish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWinners;
