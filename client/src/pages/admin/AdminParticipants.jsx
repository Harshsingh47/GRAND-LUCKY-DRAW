import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  X,
  FileSpreadsheet
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminParticipants = () => {
  const { showToast } = useToast();
  const [participants, setParticipants] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [verifiedFilter, setVerifiedFilter] = useState('');
  const [disqualifiedFilter, setDisqualifiedFilter] = useState('');

  // Modals
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [disqualifyModalOpen, setDisqualifyModalOpen] = useState(false);
  const [disqualifyTarget, setDisqualifyTarget] = useState(null);
  const [disqualifyReason, setDisqualifyReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchParticipants = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '15'
      });
      if (search.trim()) params.append('search', search.trim());
      if (stateFilter) params.append('state', stateFilter);
      if (verifiedFilter !== '') params.append('verified', verifiedFilter);
      if (disqualifiedFilter !== '') params.append('disqualified', disqualifiedFilter);

      const res = await api.get(`/participants?${params.toString()}`);
      if (res.data.success) {
        setParticipants(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to load participants', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(1);
  }, [stateFilter, verifiedFilter, disqualifiedFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchParticipants(1);
  };

  const handleDisqualify = async () => {
    if (!disqualifyReason.trim()) {
      showToast('A mandatory disqualification reason must be entered', 'error');
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await api.post(`/participants/${disqualifyTarget._id}/disqualify`, {
        reason: disqualifyReason.trim()
      });

      if (res.data.success) {
        showToast(`Participant disqualified. Reason recorded in audit log.`, 'success');
        setDisqualifyModalOpen(false);
        setDisqualifyReason('');
        setDisqualifyTarget(null);
        fetchParticipants(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Disqualification failed', 'error');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleReinstate = async (pId) => {
    if (!window.confirm('Are you sure you want to reinstate this participant?')) return;
    try {
      const res = await api.post(`/participants/${pId}/reinstate`);
      if (res.data.success) {
        showToast('Participant reinstated to eligible status.', 'success');
        fetchParticipants(pagination.page);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reinstate', 'error');
    }
  };

  const handleExport = (format) => {
    window.open(`/api/participants/export/download?format=${format}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
            PARTICIPANT <span className="text-gold-gradient">MANAGEMENT</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#5A657D] mt-1">
            Browse, filter, audit, disqualify, and export registered participants.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('xlsx')}
            className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#8C610A]" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-4 h-4 text-[#8C610A]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Mobile, or ID..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] text-xs font-medium focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
        >
          <option value="">All Verification Statuses</option>
          <option value="true">Mobile Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>

        <select
          value={disqualifiedFilter}
          onChange={(e) => setDisqualifiedFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#D4AF37] focus:bg-white transition-all"
        >
          <option value="">All Eligibility States</option>
          <option value="false">Eligible Participants</option>
          <option value="true">Disqualified Only</option>
        </select>
      </div>

      {/* Participants Table */}
      <div className="rounded-2xl overflow-hidden bg-white border border-[#E8EAF0] shadow-card-light">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] uppercase tracking-wider text-[#475569] font-black font-display bg-[#FAF8F5]">
                <th className="py-3.5 px-4">Participant ID</th>
                <th className="py-3.5 px-4">Full Name</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Verified</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Reg. Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-[#0F172A]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C610A] font-bold font-mono">
                    Loading records...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    No participants found matching the query.
                  </td>
                </tr>
              ) : (
                participants.map((item) => (
                  <tr key={item._id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-[#8C610A] text-xs">
                      {item.registration?.participantId || 'PENDING'}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A] text-xs">
                      {item.fullName}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#334155] text-xs">
                      {item.mobile}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] text-xs font-medium">
                      {item.city}, {item.state}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isMobileVerified ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] border border-[#10B981]/30 text-[#047857] font-bold text-[10px]">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#B45309] font-bold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.isDisqualified ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FEF2F2] border border-[#EF4444]/30 text-[#B91C1C] font-bold text-[10px]" title={item.disqualificationReason}>
                          Disqualified
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EFF6FF] border border-[#3B82F6]/30 text-[#1D4ED8] font-bold text-[10px]">
                          Eligible
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#64748B] font-mono text-xs">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedParticipant(item)}
                          className="p-1.5 rounded-lg text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-[#E2E8F0] transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {item.isDisqualified ? (
                          <button
                            onClick={() => handleReinstate(item._id)}
                            className="p-1.5 rounded-lg text-[#047857] hover:bg-emerald-50 border border-emerald-200 transition-colors"
                            title="Reinstate Participant"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setDisqualifyTarget(item);
                              setDisqualifyModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-[#DC2626] hover:bg-red-50 border border-red-200 transition-colors"
                            title="Disqualify Participant"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B] bg-[#FAF8F5]">
          <div className="font-medium">
            Showing {(pagination.page - 1) * pagination.limit + (participants.length > 0 ? 1 : 0)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchParticipants(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#D4AF37] disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono font-bold text-[#8C610A] px-2">
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => fetchParticipants(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#D4AF37] disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#D4AF37]/50 rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-black text-[#0F172A] font-heading">Participant Profile</h3>
              <button
                onClick={() => setSelectedParticipant(null)}
                className="text-[#64748B] hover:text-[#0F172A] p-1 rounded-lg hover:bg-[#F1F5F9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0] space-y-1">
                <span className="text-[#8C610A] uppercase font-bold text-[10px] tracking-wider font-display">Participant ID</span>
                <div className="text-xl font-black font-mono text-[#0F172A]">
                  {selectedParticipant.registration?.participantId || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Full Name</span>
                  <span className="font-bold text-[#0F172A] text-sm">{selectedParticipant.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Mobile</span>
                  <span className="font-mono font-bold text-[#0F172A] text-sm">{selectedParticipant.mobile}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Email</span>
                  <span className="text-[#0F172A] font-medium">{selectedParticipant.email || 'None provided'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0]">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">Location</span>
                  <span className="text-[#0F172A] font-medium">{selectedParticipant.city}, {selectedParticipant.state}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8EAF0]">
                <span className="text-[#64748B] block text-[10px] uppercase font-bold">Address</span>
                <span className="text-[#0F172A] font-medium">{selectedParticipant.address || 'Standard registration'}</span>
              </div>

              {selectedParticipant.isDisqualified && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-1">
                  <span className="font-bold text-xs">Disqualification Reason:</span>
                  <p className="text-xs">{selectedParticipant.disqualificationReason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disqualify Modal */}
      {disqualifyModalOpen && disqualifyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-red-300 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold font-heading">Disqualify Participant</h3>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Disqualifying <strong className="text-[#0F172A]">{disqualifyTarget.fullName}</strong> ({disqualifyTarget.registration?.participantId}) will revoke their entry and permanently record the action in the audit log.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#334155]">
                Mandatory Disqualification Reason *
              </label>
              <textarea
                rows={3}
                required
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="e.g. Duplicate account detected / Failed compliance rule #3"
                className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-red-300 text-[#0F172A] text-xs focus:outline-none focus:border-red-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setDisqualifyModalOpen(false);
                  setDisqualifyReason('');
                  setDisqualifyTarget(null);
                }}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs font-bold text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDisqualify}
                disabled={submittingAction}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md transition-colors"
              >
                {submittingAction ? 'Processing...' : 'Confirm Disqualification'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminParticipants;
