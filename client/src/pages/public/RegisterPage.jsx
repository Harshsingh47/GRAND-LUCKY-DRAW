import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Crown,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import ParticipantTicket from '../../components/ParticipantTicket';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginParticipant } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1); // 1: Form, 2: Official Pass Issued
  const [loading, setLoading] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    dateOfBirth: '',
    state: '',
    city: '',
    address: '',
    acceptedTerms: true,
    consentPrivacy: true
  });

  const [registeredData, setRegisteredData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [existingId, setExistingId] = useState('');

  useEffect(() => {
    api.get('/campaigns/active')
      .then((res) => {
        if (res.data?.success && res.data?.data) {
          if (res.data.data.isRegistrationActive === false) {
            setIsRegOpen(false);
          } else {
            setIsRegOpen(true);
          }
        }
      })
      .catch(() => {});
  }, []);

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi NCR', 'Chandigarh'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setErrorMsg('');
  };

  // Direct Registration - No OTP verification needed
  const handleDirectRegistration = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setExistingId('');

    if (!formData.fullName.trim()) return setErrorMsg('Please enter your full name');
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile.trim())) {
      return setErrorMsg('Please enter a valid 10-digit mobile number');
    }
    if (!formData.state) return setErrorMsg('Please select your state');
    if (!formData.city.trim()) return setErrorMsg('Please enter your city');
    if (!formData.acceptedTerms || !formData.consentPrivacy) {
      return setErrorMsg('You must agree to the Terms & Conditions and Privacy Policy');
    }

    setLoading(true);
    try {
      const res = await api.post('/participants/register', formData);

      if (res.data.success) {
        const { data, token } = res.data;
        loginParticipant(token, data);
        setRegisteredData(data);
        setStep(2);

        // Confetti celebration
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFF0B8', '#B8860B', '#FFFFFF']
        });

        showToast('Registration Successful! Unique Participant ID generated.', 'success');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.';
      setErrorMsg(msg);
      if (err.response?.data?.existingParticipantId) {
        setExistingId(err.response.data.existingParticipantId);
      }
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
            <Crown className="w-4 h-4 text-[#D6A63A]" />
            <span>Official Campaign</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18865B]/10 border border-[#18865B]/20 text-[#18865B] text-xs font-bold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4 text-[#18865B]" />
            <span>Strictly 1 Entry Per Person</span>
          </div>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#172033]">
          PARTICIPANT <span className="text-gold-gradient">REGISTRATION</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085]">
          Enter your details below to register for the Grand Lucky Draw 2027. Strictly one entry per person is permitted.
        </p>
      </div>

      {/* Progress Steps Indicators */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-10">
        {[
          { num: 1, label: 'Fill Participant Details' },
          { num: 2, label: 'Official Pass Issued' }
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step >= s.num
                  ? 'bg-gradient-to-r from-[#DFBA5E] to-[#D6A63A] text-[#172033] shadow-gold-glow'
                  : 'bg-white text-[#667085] border border-[#E8EAF0]'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-5 h-5 text-[#172033]" /> : s.num}
            </div>
            <span className={`text-xs font-bold hidden sm:inline ${step >= s.num ? 'text-[#B8860B]' : 'text-[#667085]'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Error message alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 space-y-3 text-red-700 text-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          {existingId && (
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-red-200">
              <span className="text-xs text-[#172033] font-mono">
                Your Registered ID: <strong className="text-[#B8860B] font-bold">{existingId}</strong>
              </span>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-xl btn-gold text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <span>View My Official Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Registration Closed Notice */}
      {!isRegOpen && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-800 text-sm">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>Lucky draw registrations are currently closed. The official draw ceremony is in progress.</span>
        </div>
      )}

      {/* STEP 1: REGISTRATION FORM */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAF0] shadow-card-light">
          <form onSubmit={handleDirectRegistration} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D6A63A]" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Vikramaditya Sharma"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D6A63A]" />
                  <span>Mobile Number (10 Digits) *</span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g. 9810123456"
                  maxLength={10}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm font-mono transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D6A63A]" />
                  <span>Email Address (Optional)</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. vikram@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D6A63A]" />
                  <span>Date of Birth (18+ Only)</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
                />
              </div>

              {/* State */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D6A63A]" />
                  <span>State / UT *</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
                >
                  <option value="">Select State</option>
                  {indianStates.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033] flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D6A63A]" />
                  <span>City / Town *</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. New Delhi"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">
                Residential Address (Optional)
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House / Street / Colony details"
                className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 text-sm transition-all"
              />
            </div>

            {/* Compliance Checkboxes */}
            <div className="space-y-3 pt-3 border-t border-[#E8EAF0] text-sm text-[#667085]">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptedTerms"
                  checked={formData.acceptedTerms}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#D6A63A] rounded"
                />
                <span className="text-xs text-[#667085]">
                  I confirm I am an Indian resident aged 18 or above, and accept the{' '}
                  <Link to="/terms-and-conditions" target="_blank" className="text-[#B8860B] font-bold underline">
                    Terms & Conditions
                  </Link>{' '}
                  and the offline manual draw rules.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consentPrivacy"
                  checked={formData.consentPrivacy}
                  onChange={handleChange}
                  required
                  className="mt-1 w-4 h-4 accent-[#D6A63A] rounded"
                />
                <span className="text-xs text-[#667085]">
                  I consent to the{' '}
                  <Link to="/privacy-policy" target="_blank" className="text-[#B8860B] font-bold underline">
                    Privacy Policy
                  </Link>{' '}
                  and authorize SMS notifications regarding draw announcements and winner updates.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || !isRegOpen}
                className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                  !isRegOpen
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                    : 'btn-gold shadow-gold-glow'
                }`}
              >
                {loading ? (
                  <span>Generating Official Participant ID...</span>
                ) : !isRegOpen ? (
                  <span>Registrations Currently Closed</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-[#172033]" />
                    <span>Complete Registration & Issue Official Pass</span>
                    <ArrowRight className="w-5 h-5 text-[#172033]" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* STEP 2: OFFICIAL PASS ISSUED */}
      {step === 2 && registeredData && (
        <div className="space-y-8 animate-scale-up">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18865B]/10 border border-[#18865B]/25 text-[#18865B] text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>REGISTRATION CONFIRMED</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#172033] font-heading">
              CONGRATULATIONS, {registeredData.fullName}!
            </h2>
            <p className="text-sm text-[#667085] max-w-xl mx-auto">
              You are officially registered for the Grand Lucky Draw. Your official digital participation pass has been generated below.
            </p>
          </div>

          {/* Participant Pass Card */}
          <ParticipantTicket
            data={{
              participantId: registeredData.participantId,
              fullName: registeredData.fullName,
              mobile: registeredData.mobile,
              city: registeredData.city,
              state: registeredData.state,
              registrationDate: registeredData.registrationDate,
              ticketNumber: registeredData.ticketNumber,
              campaignTitle: registeredData.campaign?.title || 'Grand Lucky Draw 2027',
              drawDate: registeredData.campaign?.drawDate || '19 May 2027',
              organizer: registeredData.campaign?.organizer || 'Grand Lucky Draw'
            }}
          />

          {/* Next Action Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/participant/dashboard"
              className="btn-gold px-8 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-gold-glow"
            >
              <span>Go to My Participant Portal</span>
              <ArrowRight className="w-4 h-4 text-[#172033]" />
            </Link>
            <Link
              to="/prizes"
              className="btn-outline-gold px-8 py-3.5 rounded-xl font-bold text-sm"
            >
              View The 70 Grand Prizes
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
