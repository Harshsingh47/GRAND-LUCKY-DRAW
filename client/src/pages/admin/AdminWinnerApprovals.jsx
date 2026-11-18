import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  User,
  Clock,
  Eye,
  Award,
  X
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AdminWinnerApprovals = () => {
  const { adminUser } = useAuth();
  const { showToast } = useToast();

  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchApprovals = async () => {
    try {
      const res = await api.get('/winners/approvals');
      if (res.data.success) {
        setApprovals(res.data.data);
      }
    } catch (err) {
      showToast('Failed to load winner approvals', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleApprove = async (approval) => {
    // Check self-approval upfront on client side as well
    if (approval.enteredBy?._id === adminUser?.id) {
      showToast('Security Violation: You cannot approve your own submissions! Another admin must review this.', 'error');
      return;
    }

    if (!window.confirm(`APPROVE WINNERS: Confirm approval for ${approval.submittedParticipantIds.length} winner(s) for "${approval.prize?.name}"?`)) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/winners/approvals/${approval._id}/review`, {
        action: 'APPROVE',
        comments: 'Verified against physical draw records'
      });

      if (res.data.success) {
        showToast('Winner submission approved successfully! Ready for publication.', 'success');
        fetchApprovals();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Approval failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      showToast('A mandatory rejection reason is required', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/winners/approvals/${selectedApproval._id}/review`, {
        action: 'REJECT',
        rejectionReason: rejectionReason.trim()
      });

      if (res.data.success) {
        showToast('Winner submission rejected and logged in audit trail.', 'success');
        setRejectModalOpen(false);
        setSelectedApproval(null);
        setRejectionReason('');
        fetchApprovals();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Rejection failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          TWO-STEP DUAL-ADMIN <span className="text-gold-gradient">APPROVAL WORKFLOW</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Review, approve, or reject manual winner submissions. A single administrator is strictly prevented from approving their own entries.
        </p>
      </div>

      {/* Security Rule Alert */}
      <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#D4AF37]/40 flex items-start gap-4 shadow-sm">
        <ShieldCheck className="w-6 h-6 text-[#8C610A] shrink-0 mt-0.5" />
        <div className="text-xs text-[#334155] space-y-1">
          <span className="font-bold text-[#0F172A] text-sm block">Four-Eyes Integrity Principle</span>
          <p>
            You are logged in as <strong>{adminUser?.name}</strong> ({adminUser?.role}). Submissions entered by your account require review and approval by a secondary administrator.
          </p>
        </div>
      </div>

      {/* Approvals List */}
      {loading ? (
        <div className="p-8 text-[#8C610A] font-mono font-bold">Loading approval submissions...</div>
      ) : approvals.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#E2E8F0] text-center space-y-3 shadow-sm">
          <CheckSquare className="w-12 h-12 text-[#94A3B8] mx-auto" />
          <h3 className="text-lg font-bold text-[#0F172A]">No Pending Submissions</h3>
          <p className="text-xs text-[#64748B]">
            All submitted winner entries have been processed or no entries submitted yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {approvals.map((appr) => {
            const isSelfSubmission = appr.enteredBy?._id === adminUser?.id;
            const isPending = appr.status === 'PENDING_REVIEW';
            const isApproved = appr.status === 'APPROVED';
            const isRejected = appr.status === 'REJECTED';

            return (
              <div
                key={appr._id}
                className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-[#8C610A] font-bold block mb-1">
                      Prize Category
                    </span>
                    <h3 className="text-xl font-bold text-[#0F172A] font-heading">
                      {appr.prize?.name}
                    </h3>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold font-mono self-start sm:self-auto ${
                      isPending
                        ? 'bg-amber-100 text-[#B45309] border border-amber-300'
                        : isApproved
                        ? 'bg-emerald-100 text-[#047857] border border-emerald-300'
                        : 'bg-rose-100 text-[#B91C1C] border border-rose-300'
                    }`}
                  >
                    {appr.status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[11px] font-sans font-medium">Entered By:</span>
                    <span className="text-[#0F172A] font-bold text-sm block mt-0.5">{appr.enteredBy?.name || 'Administrator'}</span>
                    {isSelfSubmission && (
                      <span className="text-[10px] text-[#B45309] font-bold block mt-1">(Your Submission)</span>
                    )}
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[11px] font-sans font-medium">Submission Date:</span>
                    <span className="text-[#0F172A] font-medium block mt-0.5">{new Date(appr.enteredAt).toLocaleString()}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0]">
                    <span className="text-[#64748B] block text-[11px] font-sans font-medium">Winners In Batch:</span>
                    <span className="text-[#8C610A] font-bold text-sm block mt-0.5">{appr.submittedParticipantIds?.length || 0} entries</span>
                  </div>
                </div>

                {/* Submitted Participant IDs Pill Tags */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#334155] block">
                    Participant IDs Submitted:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {appr.submittedParticipantIds?.map((pId, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#8C610A] font-mono text-xs font-black shadow-sm"
                      >
                        {pId}
                      </span>
                    ))}
                  </div>
                </div>

                {appr.rejectionReason && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                    <strong className="font-bold">Rejection Reason:</strong> {appr.rejectionReason}
                  </div>
                )}

                {/* Action Buttons for Pending Items */}
                {isPending && (
                  <div className="pt-4 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {isSelfSubmission ? (
                      <span className="text-xs text-[#B45309] italic font-semibold">
                        * You entered this submission. Two-person integrity requires a different admin to approve this.
                      </span>
                    ) : (
                      <span className="text-xs text-[#475569] font-medium">
                        Review the IDs against physical ballots and select action:
                      </span>
                    )}

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedApproval(appr);
                          setRejectModalOpen(true);
                        }}
                        disabled={submitting}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>

                      <button
                        onClick={() => handleApprove(appr)}
                        disabled={submitting || isSelfSubmission}
                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
                          isSelfSubmission
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                            : 'btn-gold'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve Winners</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {rejectModalOpen && selectedApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#CBD5E1] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h3 className="text-lg font-bold text-rose-700 font-heading">Reject Winner Submission</h3>
              <button onClick={() => setRejectModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#475569]">
              You are rejecting the submission for <strong className="text-[#0F172A]">{selectedApproval.prize?.name}</strong> entered by {selectedApproval.enteredBy?.name}.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-[#334155]">
                Mandatory Rejection Reason *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Mismatch detected with physical ballot #4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-rose-300 text-[#0F172A] text-xs focus:outline-none focus:border-rose-500 placeholder-[#94A3B8]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-[#CBD5E1] text-xs text-[#475569] hover:bg-gray-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
              >
                {submitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWinnerApprovals;
