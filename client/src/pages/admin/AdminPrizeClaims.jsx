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
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          PRIZE CLAIMS & <span className="text-gold-gradient">KYC VERIFICATION</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review winner claim submissions, inspect identity documents, and track distribution milestones.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#CBD5E1] shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-[#D4AF37] text-[#0F172A] font-bold shadow-sm'
                  : 'bg-[#FAF8F5] border border-[#CBD5E1] text-[#475569] hover:text-[#0F172A] hover:border-[#94A3B8]'
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
            className="w-full px-3.5 py-1.5 pl-8 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#8C610A]"
          />
          <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Claims Table */}
      <div className="luxury-card rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-black uppercase tracking-wider text-[#475569] bg-[#FAF8F5]">
                <th className="py-3.5 px-4">Participant ID</th>
                <th className="py-3.5 px-4">Winner Name</th>
                <th className="py-3.5 px-4">Prize</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">ID Document</th>
                <th className="py-3.5 px-4">Claim Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-[#0F172A]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C610A] font-mono font-bold">
                    Loading claims...
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#64748B]">
                    No prize claim records found matching criteria.
                  </td>
                </tr>
              ) : (
                claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-black text-[#8C610A]">
                      {claim.participantId}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                      {claim.claimantName || claim.participant?.fullName}
                    </td>
                    <td className="py-3.5 px-4 text-[#1E293B] font-semibold">
                      {claim.prize?.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#334155] font-medium">
                      {claim.contactMobile || claim.participant?.mobile}
                    </td>
                    <td className="py-3.5 px-4 text-[#475569] font-medium">
                      {claim.city || claim.participant?.city}, {claim.state || claim.participant?.state}
                    </td>
                    <td className="py-3.5 px-4">
                      {claim.idProofDocumentUrl ? (
                        <a
                          href={claim.idProofDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#8C610A] underline font-bold flex items-center gap-1 hover:text-[#5E4204]"
                        >
                          <span>{claim.idProofType || 'Proof'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[#94A3B8] font-mono">Not Uploaded</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          claim.claimStatus === 'Prize Awarded'
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : claim.claimStatus === 'Approved'
                            ? 'bg-emerald-100 text-[#047857] border border-emerald-300'
                            : claim.claimStatus === 'Rejected'
                            ? 'bg-rose-100 text-[#B91C1C] border border-rose-300'
                            : 'bg-amber-100 text-[#B45309] border border-amber-300'
                        }`}
                      >
                        {claim.claimStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => openStatusModal(claim)}
                        className="px-3 py-1.5 rounded-lg btn-outline-gold text-[11px] font-bold shadow-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#8C610A] font-bold block">
                  Winner Claim Management
                </span>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  {selectedClaim.claimantName} ({selectedClaim.participantId})
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">Prize Won:</span>
                  <span className="text-[#8C610A] font-bold">{selectedClaim.prize?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">Delivery Address:</span>
                  <span className="text-[#0F172A] font-semibold text-right max-w-xs truncate">{selectedClaim.deliveryAddress || 'Pending submission'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B] font-medium">ID Document:</span>
                  <span className="text-[#0F172A] font-semibold">
                    {selectedClaim.idProofType} ({selectedClaim.idProofNumber || 'N/A'})
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#334155]">Set New Claim Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold focus:outline-none focus:border-[#8C610A]"
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
                  <label className="text-xs font-bold uppercase text-rose-700">Mandatory Rejection Reason *</label>
                  <textarea
                    rows={2}
                    required
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Provide specific reason for rejecting claim"
                    className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-rose-300 text-[#0F172A] text-xs focus:outline-none focus:border-rose-500 placeholder-[#94A3B8]"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-[#334155]">Internal Admin Notes / Dispatch Tracking</label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Courier tracking # or dealership dispatch date"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#0F172A] text-xs placeholder-[#94A3B8] focus:outline-none focus:border-[#8C610A]"
                />
              </div>

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
