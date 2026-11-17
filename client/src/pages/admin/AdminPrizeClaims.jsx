import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ShieldCheck,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminPrizeClaims = () => {
  const { showToast } = useToast();
  const [claims, setClaims] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Status Update Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const statuses = [
    'ALL',
    'Pending Verification',
    'Verified',
    'Contacted',
    'Documents Pending',
    'Approved',
    'Prize Awarded',
    'Rejected'
  ];

  const fetchClaims = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await api.get(`/claims/admin?${params.toString()}`);
      if (res.data.success) {
        setClaims(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load prize claims', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const openStatusModal = (claim) => {
    setSelectedClaim(claim);
    setNewStatus(claim.claimStatus);
    setAdminNotes(claim.adminNotes || '');
    setRejectionReason(claim.rejectionReason || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (newStatus === 'Rejected' && !rejectionReason.trim()) {
      showToast('A mandatory rejection reason is required when rejecting a claim', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put(`/claims/admin/${selectedClaim._id}/status`, {
        claimStatus: newStatus,
        adminNotes: adminNotes.trim(),
        rejectionReason: newStatus === 'Rejected' ? rejectionReason.trim() : undefined
      });

      if (res.data.success) {
        showToast(`Claim status updated to "${newStatus}"`, 'success');
        setModalOpen(false);
        fetchClaims();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          PRIZE CLAIMS & <span className="text-gold-gradient">KYC VERIFICATION</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Review winner claim submissions, inspect identity documents, and track distribution milestones.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-gold-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-gold-500 text-dark-950 font-bold shadow-gold-glow'
                  : 'bg-dark-950 border border-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); fetchClaims(); }} className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID or Name..."
            className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Claims Table */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-card-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-[11px] uppercase tracking-wider text-gray-400 bg-dark-950/80">
                <th className="py-3 px-4">Participant ID</th>
                <th className="py-3 px-4">Winner Name</th>
                <th className="py-3 px-4">Prize</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">ID Document</th>
                <th className="py-3 px-4">Claim Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gold-400 font-mono">
                    Loading claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    No prize claim records found matching criteria.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-gold-500/5 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-gold-300">
                      {claim.participantId}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {claim.claimantName || claim.participant?.fullName}
                    </td>
                    <td className="py-3 px-4 text-gray-200 font-medium">
                      {claim.prize?.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-gray-400">
                      {claim.contactMobile || claim.participant?.mobile}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {claim.city || claim.participant?.city}, {claim.state || claim.participant?.state}
                    </td>
                    <td className="py-3 px-4">
                      {claim.idProofDocumentUrl ? (
                        <a
                          href={claim.idProofDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gold-400 underline font-semibold flex items-center gap-1"
                        >
                          <span>{claim.idProofType || 'Proof'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-500 font-mono">Not Uploaded</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          claim.claimStatus === 'Prize Awarded'
                            ? 'bg-purple-500/20 text-purple-300'
                            : claim.claimStatus === 'Approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : claim.claimStatus === 'Rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-gold-500/15 text-gold-300'
                        }`}
                      >
                        {claim.claimStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openStatusModal(claim)}
                        className="px-3 py-1 rounded-lg btn-outline-gold text-[11px] font-bold"
                      >
                        Manage Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {modalOpen && selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0F1015] border border-gold-500/40 rounded-3xl max-w-lg w-full p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-gold-400 font-bold block">
                  Winner Claim Management
                </span>
                <h3 className="text-lg font-bold text-white font-heading">
                  {selectedClaim.claimantName} ({selectedClaim.participantId})
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-dark-950 border border-gray-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-gray-500">Prize Won:</span>
                  <span className="text-gold-300 font-bold">{selectedClaim.prize?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Address:</span>
                  <span className="text-white text-right max-w-xs truncate">{selectedClaim.deliveryAddress || 'Pending submission'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ID Document:</span>
                  <span className="text-white">
                    {selectedClaim.idProofType} ({selectedClaim.idProofNumber || 'N/A'})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-300">Set New Claim Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-gold-500/30 text-white text-xs font-bold"
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Verified">Verified</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Documents Pending">Documents Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Prize Awarded">Prize Awarded</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {newStatus === 'Rejected' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-red-400">Mandatory Rejection Reason *</label>
                  <textarea
                    rows={2}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide specific reason for rejecting claim"
                    className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-red-500/40 text-white text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-300">Internal Admin Notes / Dispatch Tracking</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Courier tracking # or dealership dispatch date"
                  className="w-full px-3.5 py-2 rounded-xl bg-dark-950 border border-gray-800 text-white text-xs"
                />
              </div>

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
                  {submitting ? 'Updating...' : 'Save Claim Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPrizeClaims;
