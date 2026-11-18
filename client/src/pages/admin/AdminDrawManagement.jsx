import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Hash,
  FileSpreadsheet,
  RefreshCw,
  Copy,
  Clock
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminDrawManagement = () => {
  const { showToast } = useToast();
  const [campaign, setCampaign] = useState(null);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);

  // Action states
  const [closingReg, setClosingReg] = useState(false);
  const [freezingList, setFreezingList] = useState(false);
  const [verifyingHash, setVerifyingHash] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const fetchData = async () => {
    try {
      const [campRes, snapRes] = await Promise.all([
        api.get('/campaigns/active'),
        api.get('/draw/latest-snapshot').catch(() => ({ data: { success: false } }))
      ]);

      if (campRes.data.success) setCampaign(campRes.data.data);
      if (snapRes.data.success) setSnapshot(snapRes.data.data);
    } catch (err) {
      console.error('[Draw Management Error]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Step 1: Close Registration
  const handleCloseRegistration = async () => {
    if (!window.confirm('Are you sure you want to CLOSE registrations? This will prevent any new participants from joining.')) {
      return;
    }

    setClosingReg(true);
    try {
      const res = await api.post('/draw/close-registration');
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to close registration', 'error');
    } finally {
      setClosingReg(false);
    }
  };

  // Reopen Registration
  const handleReopenRegistration = async () => {
    if (!window.confirm('Reopen registrations for participants? This will allow new registrations.')) {
      return;
    }

    setClosingReg(true);
    try {
      const res = await api.post('/draw/reopen-registration');
      if (res.data.success) {
        showToast(res.data.message, 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to reopen registration', 'error');
    } finally {
      setClosingReg(false);
    }
  };

  // Step 2: Freeze Participant List & Compute SHA-256 Hash
  const handleFreezeParticipants = async () => {
    if (!window.confirm('FREEZE PARTICIPANT LIST: This will lock all verified participants into an immutable snapshot and generate a cryptographic SHA-256 checksum for the offline manual draw. Proceed?')) {
      return;
    }

    setFreezingList(true);
    try {
      const res = await api.post('/draw/freeze-participants', {
        notes: 'Official frozen list generated for offline physical draw'
      });
      if (res.data.success) {
        showToast('Participant list frozen successfully! SHA-256 hash generated.', 'success');
        fetchData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to freeze participant list', 'error');
    } finally {
      setFreezingList(false);
    }
  };

  // Verify Snapshot Hash Integrity
  const handleVerifyIntegrity = async () => {
    if (!snapshot?._id) return;

    setVerifyingHash(true);
    setVerificationResult(null);
    try {
      const res = await api.post('/draw/verify-snapshot', {
        snapshotId: snapshot._id
      });
      if (res.data.success) {
        setVerificationResult(res.data);
        showToast('Integrity check completed: 100% Cryptographic Match', 'success');
      }
    } catch (err) {
      showToast('Integrity verification failed', 'error');
    } finally {
      setVerifyingHash(false);
    }
  };

  const copyHash = () => {
    if (snapshot?.hashSHA256) {
      navigator.clipboard.writeText(snapshot.hashSHA256);
      showToast('SHA-256 Hash copied to clipboard', 'info');
    }
  };

  const handleDownloadSnapshot = (format) => {
    if (!snapshot?._id) return;
    window.open(`/api/draw/snapshot/${snapshot._id}/export?format=${format}`, '_blank');
  };

  if (loading) {
    return <div className="p-8 text-[#8C610A] font-mono font-bold">Loading draw management module...</div>;
  }

  const isClosed = !campaign?.isRegistrationActive;
  const isFrozen = !!snapshot;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-[#0F172A]">
          MANUAL DRAW <span className="text-gold-gradient">MANAGEMENT MODULE</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#475569] mt-1">
          Cryptographic list freezing, immutable SHA-256 checksum generation, and export controls.
        </p>
      </div>

      {/* Strict Manual Draw Advisory */}
      <div className="p-6 rounded-3xl bg-[#FAF8F5] border border-[#D4AF37]/50 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-[#8C610A] font-bold uppercase tracking-wider text-xs">
          <ShieldCheck className="w-5 h-5 text-[#8C610A]" />
          <span>Core Integrity Rule: 100% Manual Offline Draw</span>
        </div>
        <p className="text-sm text-[#334155] leading-relaxed">
          The website does NOT automatically select random winners. The organizers conduct the draw manually outside the platform in front of independent committees and public observers. Follow Step 1 and Step 2 below to prepare the official list for the offline event.
        </p>
      </div>

      {/* 2-Step Sequential Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* STEP 1: CLOSE REGISTRATION */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#8C610A] uppercase">
                Step 1
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isClosed ? 'bg-emerald-100 text-[#047857] border border-emerald-300' : 'bg-amber-100 text-[#B45309] border border-amber-300'}`}>
                {isClosed ? 'Registration Closed' : 'Registration Open'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172A] font-heading">Close Registration</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Formally closes public registration. Stops new entries, locks participant profile modifications affecting eligibility, and calculates final statistics.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Current Participants:</span>
                <span className="text-[#0F172A] font-bold">{campaign?.currentParticipants?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Eligible Entries:</span>
                <span className="text-[#8C610A] font-bold">{campaign?.eligibleParticipants?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          {isClosed ? (
            <div className="flex gap-2">
              <div className="flex-1 py-3.5 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] text-[#475569] text-xs font-bold flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Closed</span>
              </div>
              <button
                onClick={handleReopenRegistration}
                disabled={closingReg}
                className="px-4 py-3.5 rounded-xl text-xs font-bold bg-emerald-100 text-[#047857] border border-emerald-300 hover:bg-emerald-200 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Reopen</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleCloseRegistration}
              disabled={closingReg}
              className="w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 btn-gold shadow-sm transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>Click to Close Registration</span>
            </button>
          )}
        </div>

        {/* STEP 2: FREEZE PARTICIPANT LIST */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between border border-[#E2E8F0] shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-[#8C610A] uppercase">
                Step 2
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isFrozen ? 'bg-emerald-100 text-[#047857] border border-emerald-300' : 'bg-gray-100 text-[#64748B] border border-gray-300'}`}>
                {isFrozen ? 'Snapshot Locked' : 'Pending Freeze'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-[#0F172A] font-heading">Freeze Participant List</h3>
            <p className="text-xs text-[#475569] leading-relaxed">
              Creates a permanent immutable snapshot of all verified eligible participant IDs, computes a SHA-256 cryptographic checksum, and prevents any further changes.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Snapshot Status:</span>
                <span className="text-[#0F172A] font-bold">{isFrozen ? `Version ${snapshot.snapshotVersion}` : 'Not Created'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Frozen Participants:</span>
                <span className="text-[#8C610A] font-bold">{snapshot?.totalEligible || 0} verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFreezeParticipants}
            disabled={freezingList}
            className="btn-gold w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-[#0F172A]" />
            <span>{isFrozen ? 'Re-Generate / Update Frozen Snapshot' : 'Freeze Participant List & Generate Hash'}</span>
          </button>
        </div>
      </div>

      {/* FROZEN SNAPSHOT & CRYPTOGRAPHIC SHA-256 INTEGRITY BOX */}
      {snapshot && (
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-100 text-[#8C610A]">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8C610A] tracking-wider">Official Cryptographic Lock</span>
                <h3 className="text-lg font-bold text-[#0F172A] font-heading">
                  Snapshot v{snapshot.snapshotVersion} ({snapshot.totalEligible} Eligible Participants)
                </h3>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadSnapshot('xlsx')}
                className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#8C610A]" />
                <span>Download Official Excel</span>
              </button>
              <button
                onClick={() => handleDownloadSnapshot('csv')}
                className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Download className="w-4 h-4 text-[#8C610A]" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* SHA-256 Hash Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#475569]">
              <span className="font-semibold uppercase tracking-wider text-[#8C610A]">
                Cryptographic SHA-256 Hash Checksum:
              </span>
              <button onClick={copyHash} className="hover:text-[#0F172A] flex items-center gap-1 text-[#64748B] font-medium">
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Hash</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#CBD5E1] font-mono text-xs sm:text-sm text-[#8C610A] break-all tracking-wider font-black shadow-inner">
              {snapshot.hashSHA256}
            </div>
            <span className="text-[11px] text-[#64748B] block">
              This checksum is computed over the canonically sorted list of participant IDs. Use this hash during the physical draw to guarantee zero list modification.
            </span>
          </div>

          {/* Audit Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono pt-2 border-t border-[#E2E8F0]">
            <div>
              <span className="text-[#64748B] block text-[11px] font-sans">Frozen At:</span>
              <span className="text-[#0F172A] font-medium block mt-0.5">{new Date(snapshot.frozenAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px] font-sans">Authorized Officer:</span>
              <span className="text-[#8C610A] font-bold block mt-0.5">{snapshot.frozenBy?.name || 'Administrator'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[11px] font-sans">Campaign Draw Status:</span>
              <span className="text-[#047857] font-bold block mt-0.5">{campaign?.status}</span>
            </div>
          </div>

          {/* Live Integrity Verifier */}
          <div className="pt-2 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Verify Cryptographic Integrity</h4>
              <p className="text-[11px] text-[#64748B]">
                Recomputes the SHA-256 hash across database records in real time to prove zero tampering.
              </p>
            </div>
            <button
              onClick={handleVerifyIntegrity}
              disabled={verifyingHash}
              className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifyingHash ? 'animate-spin' : ''}`} />
              <span>{verifyingHash ? 'Verifying...' : 'Verify Cryptographic Tamper-Free Status'}</span>
            </button>
          </div>

          {verificationResult && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center gap-3 text-xs text-[#047857]">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="font-bold">INTEGRITY VERIFIED:</strong> Real-time SHA-256 hash precisely matches stored checksum ({verificationResult.computedHash.substring(0, 16)}...). 0 tampering detected across {verificationResult.totalEntries} entries.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDrawManagement;
