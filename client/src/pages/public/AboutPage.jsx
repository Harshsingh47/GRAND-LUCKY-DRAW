import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <Crown className="w-4 h-4 text-[#D6A63A]" />
          <span>About The Platform</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#172033]">
          ABOUT THE <span className="text-gold-gradient">CAMPAIGN</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
          Pioneering trusted promotional campaigns with unprecedented transparency and life-changing rewards.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-[#667085] text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-black text-[#172033] font-heading">
            "Dream Big... Win Big..."
          </h2>
          <p>
            The <strong className="text-[#172033]">Grand Lucky Draw 2027</strong> is an official promotional campaign organized to host India's most credible and transparent giveaway, featuring 70 high-value grand prizes.
          </p>
          <p>
            Recognizing public concerns surrounding automated online sweepstakes and hidden algorithms, the campaign operates under a strict foundational rule: <strong className="text-[#172033]">The entire draw is conducted physically and manually outside computer systems</strong>.
          </p>
          <div className="p-6 rounded-2xl bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#172033] shadow-xs">
            <h4 className="font-bold text-[#B8860B] font-heading text-base mb-1">Our Core Commitment</h4>
            Every participant with a verified sequential ID holds an equal, mathematically fair opportunity in the physical draw barrel on 19 May 2027.
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 space-y-6 border border-[#E8EAF0] shadow-card-light">
          <h3 className="text-xl font-black text-[#172033] font-heading">Campaign Milestones</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <span className="text-[#667085] font-medium">Campaign Host</span>
              <span className="font-bold text-[#172033]">Grand Lucky Draw Committee</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <span className="text-[#667085] font-medium">Total Listed Prizes</span>
              <span className="font-black text-[#B8860B] font-mono">70 Grand Units</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <span className="text-[#667085] font-medium">Joining Date</span>
              <span className="font-bold text-[#172033]">1 December 2026</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#E8EAF0] pb-3">
              <span className="text-[#667085] font-medium">Draw Date</span>
              <span className="font-black text-[#B8860B] font-mono">19 May 2027</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#667085] font-medium">Target Community</span>
              <span className="font-bold text-[#172033]">10,000 Verified Participants</span>
            </div>
          </div>

          <div className="pt-2">
            <Link to="/register" className="btn-gold w-full py-3.5 rounded-xl font-bold text-sm text-center block shadow-gold-glow">
              Register for Free Entry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
