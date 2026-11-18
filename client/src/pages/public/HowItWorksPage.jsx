import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, CheckCircle2, ArrowRight, UserCheck, Smartphone, Award, FileText } from 'lucide-react';

const HowItWorksPage = () => {
  const steps = [
    {
      step: 'Step 1',
      title: 'Submit Basic Details',
      desc: 'Navigate to the registration portal and enter your legal name, 10-digit mobile number, state, and city. Participation is open to Indian residents aged 18+.',
      icon: UserCheck
    },
    {
      step: 'Step 2',
      title: 'Instant Direct Registration',
      desc: 'No SMS OTP code required. Submit your registered mobile number and details to register immediately with duplicate entry protection.',
      icon: Smartphone
    },
    {
      step: 'Step 3',
      title: 'Review Participation Rules',
      desc: 'Accept campaign terms and privacy policies. No payment or paid transaction is collected without approved legal authorization.',
      icon: FileText
    },
    {
      step: 'Step 4',
      title: 'Receive Unique Participant ID',
      desc: 'Our backend system generates your unique, concurrency-safe sequential Participant ID (e.g., LD2027-000001) and digital pass with QR code.',
      icon: Crown
    },
    {
      step: 'Step 5',
      title: 'Offline Manual Draw Ceremony',
      desc: 'On 19 May, the organizers conduct the actual physical draw independently in front of independent observers and video recordings. No computer algorithms select winners.',
      icon: ShieldCheck
    },
    {
      step: 'Step 6',
      title: 'Results Published & Prize Claim',
      desc: 'Official dual-approved winners are announced on the website. Winners verify directly using their Participant ID and mobile number, and submit delivery documentation to claim their prizes.',
      icon: Award
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <Crown className="w-4 h-4 text-[#D6A63A]" />
          <span>Participation Guide</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#172033]">
          HOW IT <span className="text-gold-gradient">WORKS</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
          Clear, transparent, and fair. Learn everything you need to know about registering, participating, and claiming your prize in the Grand Lucky Draw.
        </p>
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 space-y-4 border border-[#E8EAF0] shadow-card-light hover:border-[#D6A63A]/50 hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708] uppercase">
                    {s.step}
                  </span>
                  <div className="p-3 rounded-2xl bg-[#FAF7EE] text-[#D6A63A]">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-black text-[#172033] font-heading">{s.title}</h3>
                <p className="text-sm text-[#667085] leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-4 border-t border-[#E8EAF0] text-xs text-[#946708] font-bold">
                Official Draw Protocol
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules & Eligibility Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E8EAF0] shadow-card-light space-y-6">
        <h2 className="text-2xl font-black text-[#172033] font-heading">
          Campaign Rules & Eligibility Criteria
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#172033] font-medium">
          {[
            'Participant must be a citizen of India residing in India.',
            'Minimum age of participation is 18 years as of registration date.',
            'Exactly one entry is allowed per unique mobile number.',
            'Registrations close strictly on 15 May before list freezing.',
            'All winners must provide valid government photo ID upon claiming.',
            'Vehicle prizes exclude local road taxes, insurance, and registration charges unless specified.'
          ].map((rule, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18865B] shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          to="/register"
          className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-base shadow-gold-glow"
        >
          <span>Ready to Join? Register Now</span>
          <ArrowRight className="w-5 h-5 text-[#172033]" />
        </Link>
      </div>
    </div>
  );
};

export default HowItWorksPage;
