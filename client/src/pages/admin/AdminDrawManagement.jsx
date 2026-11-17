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
    return <div className="p-8 text-gold-400 font-mono">Loading draw management module...</div>;
  }

  const isClosed = !campaign?.isRegistrationActive;
  const isFrozen = !!snapshot;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
          MANUAL DRAW <span className="text-gold-gradient">MANAGEMENT MODULE</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Cryptographic list freezing, immutable SHA-256 checksum generation, and export controls.
        </p>
      </div>

      {/* Strict Manual Draw Advisory */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border-2 border-gold-500/40 space-y-2 shadow-gold-glow">
        <div className="flex items-center gap-2 text-gold-400 font-bold uppercase tracking-wider text-xs">
          <ShieldCheck className="w-5 h-5 text-gold-400" />
          <span>Core Integrity Rule: 100% Manual Offline Draw</span>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed">
          The website does NOT automatically select random winners. The organizers conduct the draw manually outside the platform in front of independent committees and public observers. Follow Step 1 and Step 2 below to prepare the official list for the offline event.
        </p>
      </div>

      {/* 2-Step Sequential Workflow Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* STEP 1: CLOSE REGISTRATION */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 uppercase">
                Step 1
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isClosed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                {isClosed ? 'Registration Closed' : 'Registration Open'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-heading">Close Registration</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Formally closes public registration. Stops new entries, locks participant profile modifications affecting eligibility, and calculates final statistics.
            </p>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-gray-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Current Participants:</span>
                <span className="text-white font-bold">{campaign?.currentParticipants?.toLocaleString() || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Eligible Entries:</span>
                <span className="text-gold-300 font-bold">{campaign?.eligibleParticipants?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCloseRegistration}
            disabled={closingReg || isClosed}
            className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              isClosed
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'btn-gold shadow-gold-glow'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isClosed ? 'Registration Is Formally Closed' : 'Click to Close Registration'}</span>
          </button>
        </div>

        {/* STEP 2: FREEZE PARTICIPANT LIST */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 uppercase">
                Step 2
              </span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isFrozen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'}`}>
                {isFrozen ? 'Snapshot Locked' : 'Pending Freeze'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white font-heading">Freeze Participant List</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Creates a permanent immutable snapshot of all verified eligible participant IDs, computes a SHA-256 cryptographic checksum, and prevents any further changes.
            </p>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-gray-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Snapshot Status:</span>
                <span className="text-white font-bold">{isFrozen ? `Version ${snapshot.snapshotVersion}` : 'Not Created'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Frozen Participants:</span>
                <span className="text-gold-300 font-bold">{snapshot?.totalEligible || 0} verified</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFreezeParticipants}
            disabled={freezingList}
            className="btn-gold w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-gold-glow"
          >
            <ShieldCheck className="w-4 h-4 text-dark-950" />
            <span>{isFrozen ? 'Re-Generate / Update Frozen Snapshot' : 'Freeze Participant List & Generate Hash'}</span>
          </button>
        </div>
      </div>

      {/* FROZEN SNAPSHOT & CRYPTOGRAPHIC SHA-256 INTEGRITY BOX */}
      {snapshot && (
        <div className="luxury-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark border-gold-500/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gold-500/10 text-gold-400">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">Official Cryptographic Lock</span>
                <h3 className="text-lg font-bold text-white font-heading">
                  Snapshot v{snapshot.snapshotVersion} ({snapshot.totalEligible} Eligible Participants)
                </h3>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadSnapshot('xlsx')}
                className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-gold-400" />
                <span>Download Official Excel</span>
              </button>
              <button
                onClick={() => handleDownloadSnapshot('csv')}
                className="btn-outline-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4 text-gold-400" />
                <span>Download CSV</span>
              </button>
            </div>
          </div>

          {/* SHA-256 Hash Display Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="font-semibold uppercase tracking-wider text-gold-400">
                Cryptographic SHA-256 Hash Checksum:
              </span>
              <button onClick={copyHash} className="hover:text-gold-300 flex items-center gap-1">
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Hash</span>
              </button>
            </div>
            <div className="p-4 rounded-xl bg-dark-950 border border-gold-500/40 font-mono text-xs sm:text-sm text-gold-gradient break-all tracking-wider font-bold">
              {snapshot.hashSHA256}
            </div>
            <span className="text-[11px] text-gray-500 block">
              This checksum is computed over the canonically sorted list of participant IDs. Use this hash during the physical draw to guarantee zero list modification.
            </span>
          </div>

          {/* Audit Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-gray-400 pt-2 border-t border-gray-800">
            <div>
              <span className="text-gray-500 block">Frozen At:</span>
              <span className="text-white">{new Date(snapshot.frozenAt).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Authorized Officer:</span>
              <span className="text-gold-300">{snapshot.frozenBy?.name || 'Administrator'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">Campaign Draw Status:</span>
              <span className="text-emerald-400 font-bold">{campaign?.status}</span>
            </div>
          </div>

          {/* Live Integrity Verifier */}
          <div className="pt-2 border-t border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Verify Cryptographic Integrity</h4>
              <p className="text-[11px] text-gray-500">
                Recomputes the SHA-256 hash across database records in real time to prove zero tampering.
              </p>
            </div>
            <button
              onClick={handleVerifyIntegrity}
              disabled={verifyingHash}
              className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${verifyingHash ? 'animate-spin' : ''}`} />
              <span>{verifyingHash ? 'Verifying...' : 'Verify Cryptographic Tamper-Free Status'}</span>
            </button>
          </div>

          {verificationResult && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>INTEGRITY VERIFIED:</strong> Real-time SHA-256 hash precisely matches stored checksum ({verificationResult.computedHash.substring(0, 16)}...). 0 tampering detected across {verificationResult.totalEntries} entries.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDrawManagement;
