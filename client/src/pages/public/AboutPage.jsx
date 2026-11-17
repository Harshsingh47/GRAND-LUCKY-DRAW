import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase shadow-gold-glow">
          <Crown className="w-4 h-4 text-gold-400" />
          <span>About Independent Medias</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
          ABOUT THE <span className="text-gold-gradient">CAMPAIGN</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
          Pioneering trusted promotional campaigns with unprecedented transparency and life-changing rewards.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 text-gray-300 text-sm sm:text-base leading-relaxed">
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading text-gold-gradient">
            "Dream Big... Win Big..."
          </h2>
          <p>
            The <strong>Grand Lucky Draw 2027</strong> is organized and developed by <strong>Independent Medias</strong>, a leading media and campaign management organization. Our objective is to organize India's most credible and transparent promotional giveaway, featuring 70 high-value grand prizes.
          </p>
          <p>
            Recognizing public concerns surrounding automated online sweepstakes and hidden algorithms, Independent Medias established a foundational rule: <strong>The entire draw is conducted physically and manually outside computer systems</strong>.
          </p>
          <div className="p-5 rounded-2xl bg-dark-900 border border-gold-500/30 text-gold-200">
            <h4 className="font-bold text-white font-heading text-base mb-1">Our Core Commitment</h4>
            Every participant with a verified sequential ID holds an equal, mathematically fair opportunity in the physical draw barrel on 19 May 2027.
          </div>
        </div>

        <div className="luxury-card rounded-3xl p-8 space-y-6 shadow-card-dark">
          <h3 className="text-xl font-bold text-white font-heading">Campaign Milestones</h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Campaign Host</span>
              <span className="font-bold text-white">Independent Medias</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Total Listed Prizes</span>
              <span className="font-bold text-gold-400 font-mono">70 Grand Units</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Joining Date</span>
              <span className="font-bold text-white">1 December 2026</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="text-gray-400">Draw Date</span>
              <span className="font-bold text-gold-400 font-mono">19 May 2027</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Target Community</span>
              <span className="font-bold text-white">10,000 Verified Participants</span>
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
