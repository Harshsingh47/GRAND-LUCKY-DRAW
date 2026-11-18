import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Crown,
  ShieldCheck,
  Award,
  Sparkles,
  KeyRound,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import posterImg from '../../assets/grand-lucky-draw-poster.jpg';
import { resolveImageUrl, handleImageError } from '../../utils/imageHelper';

const VerifyWinnerPage = () => {
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Input ID+Mobile, 2: Claim Portal & Status
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [participantId, setParticipantId] = useState('');
  const [mobile, setMobile] = useState('');

  // Winner & Claim Data
  const [verifiedData, setVerifiedData] = useState(null);

  // Claim Submission Inputs
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [idProofType, setIdProofType] = useState('AADHAAR');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [idFile, setIdFile] = useState(null);
  const [submittingClaim, setSubmittingClaim] = useState(false);

  // Direct Winner Verification without OTP
  const handleDirectVerify = async (e) => {
    e.preventDefault();
    if (!participantId.trim() || !mobile.trim()) {
      return setErrorMsg('Please enter both your Participant ID and registered Mobile Number');
    }

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/claims/verify-direct', {
        participantId: participantId.trim().toUpperCase(),
        mobile: mobile.trim()
      });

      if (res.data.success) {
        setVerifiedData(res.data.data);
        setDeliveryAddress(res.data.data.claimDetails?.deliveryAddress || res.data.data.participant?.address || '');
        setCity(res.data.data.participant?.city || '');
        setState(res.data.data.participant?.state || '');
        setIdProofNumber(res.data.data.claimDetails?.idProofNumber || '');
        setStep(2);

        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFF0B8', '#B8860B']
        });

        showToast('Official Winner Identity Verified!', 'success');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Verification could not be completed. Ensure you are an officially published winner and the mobile matches registration records.');
      showToast(err.response?.data?.message || 'Verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit Claim Information & Upload Document
  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!deliveryAddress.trim() || !idProofNumber.trim()) {
      return setErrorMsg('Please enter your complete delivery address and identity proof number');
    }

    setSubmittingClaim(true);
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('claimId', verifiedData.claimId);
      formData.append('participantId', verifiedData.participantId);
      formData.append('deliveryAddress', deliveryAddress.trim());
      formData.append('city', city.trim());
      formData.append('state', state.trim());
      formData.append('pinCode', pinCode.trim());
      formData.append('idProofType', idProofType);
      formData.append('idProofNumber', idProofNumber.trim());
      if (idFile) {
        formData.append('idDocument', idFile);
      }

      const res = await api.post('/claims/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        showToast('Prize Claim and Documents submitted successfully!', 'success');
        setVerifiedData((prev) => ({
          ...prev,
          claimStatus: res.data.data.claimStatus,
          claimDetails: {
            ...prev.claimDetails,
            deliveryAddress: res.data.data.deliveryAddress,
            idProofNumber: res.data.data.idProofNumber,
            hasUploadedId: !!res.data.data.idProofDocumentUrl
          }
        }));
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit claim documents');
      showToast(err.response?.data?.message || 'Claim submission failed', 'error');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const statusSteps = [
    'Pending Verification',
    'Verified',
    'Contacted',
    'Documents Pending',
    'Approved',
    'Prize Awarded'
  ];

  const currentStatusIndex = statusSteps.indexOf(verifiedData?.claimStatus || 'Verified');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <Crown className="w-4 h-4 text-[#D6A63A]" />
          <span>Official Distribution System</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#172033]">
          WINNER VERIFICATION <span className="text-gold-gradient">& CLAIM</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085]">
          Enter your unique participant ID and registered mobile number to verify your winning status and submit your claim documentation securely.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-700 text-sm font-medium">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: ENTER ID + MOBILE */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 max-w-xl mx-auto border border-[#E8EAF0] shadow-card-light">
          <form onSubmit={handleDirectVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Unique Participant ID
              </label>
              <input
                type="text"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                placeholder="e.g. LD2027-000001"
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] font-mono text-base uppercase focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Registered Mobile Number (10 Digits)
              </label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. 9810123456"
                maxLength={10}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] font-mono text-base focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl font-bold text-sm shadow-gold-glow flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying Official Records...' : 'Verify Winning Status & Access Claim'}
            </button>
          </form>
        </div>
      )}

      {/* STEP 2: CLAIM SUBMISSION & LIVE TRACKING */}
      {step === 2 && verifiedData && (
        <div className="space-y-10 animate-scale-up">
          {/* Winner Announcement Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#D6A63A]/50 flex flex-col sm:flex-row items-center gap-6 shadow-card-hover">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#F4F6FA] shrink-0 border border-[#E8EAF0]">
              <img
                src={resolveImageUrl(verifiedData.prize?.imageUrl)}
                alt={verifiedData.prize?.name}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18865B]/10 border border-[#18865B]/25 text-xs font-bold text-[#18865B] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#18865B]" />
                <span>OFFICIAL VERIFIED WINNER</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#172033] font-heading">
                {verifiedData.participant?.fullName}
              </h2>
              <p className="text-sm text-[#667085]">
                Participant ID: <strong className="text-[#B8860B] font-mono">{verifiedData.participantId}</strong>
                {' • '}
                Prize Won: <strong className="text-[#172033] font-heading text-base">{verifiedData.prize?.name}</strong>
              </p>
            </div>
          </div>

          {/* Live Status Tracker */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EAF0] shadow-card-light space-y-6">
            <h3 className="text-lg font-black text-[#172033] font-heading flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#D6A63A]" />
              <span>Prize Distribution & Claim Lifecycle</span>
            </h3>

            {/* Status Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {statusSteps.map((statusName, idx) => {
                const isPassed = idx <= currentStatusIndex;
                const isCurrent = idx === currentStatusIndex;

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-2xl text-center border text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-[#DFBA5E] to-[#D6A63A] text-[#172033] border-[#D6A63A] shadow-gold-glow font-bold'
                        : isPassed
                        ? 'bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708]'
                        : 'bg-[#F8F9FC] border-[#E8EAF0] text-[#667085]'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-mono opacity-80 mb-1">Step {idx + 1}</div>
                    <div>{statusName}</div>
                  </div>
                );
              })}
            </div>

            {verifiedData.claimStatus === 'Rejected' && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                <strong>Claim Rejected:</strong> {verifiedData.claimDetails?.rejectionReason || 'Contact support for details.'}
              </div>
            )}
          </div>

          {/* Claim Submission Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAF0] shadow-card-light space-y-6">
            <div>
              <h3 className="text-xl font-black text-[#172033] font-heading">
                Submit Claim Details & Verification Proof
              </h3>
              <p className="text-xs text-[#667085] mt-1">
                Provide your physical delivery address and government identity documentation to complete prize disbursement.
              </p>
            </div>

            <form onSubmit={handleSubmitClaim} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D6A63A]" />
                  <span>Physical Delivery / Contact Address *</span>
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  rows={3}
                  required
                  placeholder="Complete door/street address with landmarks for official vehicle registration or delivery"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Pin Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    placeholder="110001"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm font-mono focus:bg-white focus:outline-none focus:border-[#D6A63A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                    Government ID Proof Type *
                  </label>
                  <select
                    value={idProofType}
                    onChange={(e) => setIdProofType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A]"
                  >
                    <option value="AADHAAR">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving License</option>
                    <option value="VOTER_ID">Voter ID</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                    ID Document Number *
                  </label>
                  <input
                    type="text"
                    value={idProofNumber}
                    onChange={(e) => setIdProofNumber(e.target.value)}
                    placeholder="e.g. XXXX-XXXX-1234"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm font-mono uppercase focus:bg-white focus:outline-none focus:border-[#D6A63A]"
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <Upload className="w-4 h-4 text-[#D6A63A]" />
                  <span>Upload Identity Document (Image or PDF)</span>
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setIdFile(e.target.files[0])}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-dashed border-[#D6A63A]/50 text-[#667085] text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#FAF7EE] file:text-[#946708]"
                />
                <span className="text-[11px] text-[#667085] block">
                  {verifiedData.claimDetails?.hasUploadedId
                    ? 'A document is already on file. Uploading a new one will replace the existing record.'
                    : 'Accepted formats: JPG, PNG, PDF up to 10MB.'}
                </span>
              </div>

              <button
                type="submit"
                disabled={submittingClaim}
                className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-gold-glow"
              >
                <ShieldCheck className="w-4 h-4 text-[#172033]" />
                <span>{submittingClaim ? 'Submitting & Encrypting Details...' : 'Submit Claim & Verify Documents'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyWinnerPage;
