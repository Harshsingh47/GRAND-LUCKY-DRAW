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
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
            PARTICIPANT <span className="text-gold-gradient">MANAGEMENT</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse, filter, audit, disqualify, and export registered participants.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('xlsx')}
            className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-gold-400" />
            <span>Export Excel</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-gold-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <form onSubmit={handleSearchSubmit} className="relative sm:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name, Mobile, or ID..."
            className="w-full px-4 py-2.5 pl-10 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs focus:outline-none focus:border-gold-400"
          />
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        <select
          value={verifiedFilter}
          onChange={(e) => setVerifiedFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-dark-950 border border-gray-800 text-xs text-gray-300 focus:outline-none focus:border-gold-400"
        >
          <option value="">All Verification Statuses</option>
          <option value="true">Mobile Verified Only</option>
          <option value="false">Unverified Only</option>
        </select>

        <select
          value={disqualifiedFilter}
          onChange={(e) => setDisqualifiedFilter(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-dark-950 border border-gray-800 text-xs text-gray-300 focus:outline-none focus:border-gold-400"
        >
          <option value="">All Eligibility States</option>
          <option value="false">Eligible Participants</option>
          <option value="true">Disqualified Only</option>
        </select>
      </div>

      {/* Participants Table */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-dark-950/80">
                <th className="py-3 px-4">Participant ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Verified</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Reg. Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gold-400 font-mono">
                    Loading records...
                  </td>
                </tr>
              ) : participants.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No participants found matching the query.
                  </td>
                </tr>
              ) : (
                participants.map((item) => (
                  <tr key={item._id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold-300">
                      {item.registration?.participantId || 'PENDING'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-300">
                      {item.mobile}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {item.city}, {item.state}
                    </td>
                    <td className="py-3 px-4">
                      {item.isMobileVerified ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-[10px]">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-400 font-semibold text-[10px]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.isDisqualified ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 font-semibold text-[10px]" title={item.disqualificationReason}>
                          Disqualified
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-semibold text-[10px]">
                          Eligible
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedParticipant(item)}
                          title="View Participant Details"
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.isDisqualified ? (
                          <button
                            onClick={() => handleReinstate(item._id)}
                            title="Reinstate Participant"
                            className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <UserCheck className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setDisqualifyTarget(item);
                              setDisqualifyModalOpen(true);
                            }}
                            title="Disqualify Participant"
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
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
        <div className="p-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400">
          <div>
            Showing {(pagination.page - 1) * pagination.limit + (participants.length > 0 ? 1 : 0)} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchParticipants(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-300 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-gold-400">
              Page {pagination.page} of {pagination.pages || 1}
            </span>
            <button
              onClick={() => fetchParticipants(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-1.5 rounded-lg border border-gray-800 text-gray-300 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedParticipant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">Participant Profile</h3>
              <button onClick={() => setSelectedParticipant(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-dark-950 border border-gray-800 space-y-1">
                <span className="text-gray-500 uppercase font-mono">Participant ID</span>
                <div className="text-lg font-bold font-mono text-gold-gradient">
                  {selectedParticipant.registration?.participantId || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
                  <span className="text-gray-500 block">Full Name</span>
                  <span className="font-bold text-white text-sm">{selectedParticipant.fullName}</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
                  <span className="text-gray-500 block">Mobile</span>
                  <span className="font-mono text-white text-sm">{selectedParticipant.mobile}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
                  <span className="text-gray-500 block">Email</span>
                  <span className="text-gray-300">{selectedParticipant.email || 'None provided'}</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
                  <span className="text-gray-500 block">Location</span>
                  <span className="text-gray-300">{selectedParticipant.city}, {selectedParticipant.state}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-dark-950 border border-gray-800">
                <span className="text-gray-500 block">Address</span>
                <span className="text-gray-300">{selectedParticipant.address || 'Standard registration'}</span>
              </div>

              {selectedParticipant.isDisqualified && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 space-y-1">
                  <span className="font-bold">Disqualification Reason:</span>
                  <p>{selectedParticipant.disqualificationReason}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedParticipant(null)}
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disqualify Modal */}
      {disqualifyModalOpen && disqualifyTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-red-500/40 rounded-3xl max-w-md w-full p-6 space-y-5 animate-scale-up">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-bold font-heading">Disqualify Participant</h3>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Disqualifying <strong className="text-white">{disqualifyTarget.fullName}</strong> ({disqualifyTarget.registration?.participantId}) will revoke their entry and permanently record the action in the audit log.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Mandatory Disqualification Reason *
              </label>
              <textarea
                rows={3}
                required
                value={disqualifyReason}
                onChange={(e) => setDisqualifyReason(e.target.value)}
                placeholder="e.g. Duplicate account detected / Failed compliance rule #3"
                className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-red-500/40 text-white text-xs focus:outline-none focus:border-red-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setDisqualifyModalOpen(false);
                  setDisqualifyReason('');
                  setDisqualifyTarget(null);
                }}
                className="px-4 py-2 rounded-xl border border-gray-800 text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDisqualify}
                disabled={submittingAction}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg"
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
