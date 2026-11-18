import React from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  ShieldCheck,
  Lock,
  FileCheck,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  Hash
} from 'lucide-react';

const DrawInfoPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#18865B]" />
          <span>Integrity & Governance</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-[#172033]">
          DRAW PROCEDURE <span className="text-gold-gradient">& TRANSPARENCY</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
          The Grand Lucky Draw is built on complete procedural integrity. Learn how our manual draw and cryptographic verification protocols work.
        </p>
      </div>

      {/* Campaign Timeline Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { date: '1 December 2026', title: 'Registrations Open', desc: 'Participants register and receive their unique sequential IDs (LD2027-XXXXXX).' },
          { date: '15 May 2027', title: 'Registration Closes', desc: 'System locks all new entries and calculates final eligible participants.' },
          { date: '16 May 2027', title: 'Participant List Frozen', desc: 'Permanent snapshot created with public SHA-256 hash to lock records.' },
          { date: '19 May 2027', title: 'Physical Manual Draw', desc: 'Organizers conduct physical draw in public ceremony. Results published.' }
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E8EAF0] shadow-card-light space-y-2 hover:border-[#D6A63A]/40 transition-all">
            <span className="text-xs font-mono font-bold text-[#B8860B] block">{item.date}</span>
            <h3 className="text-lg font-black text-[#172033] font-heading">{item.title}</h3>
            <p className="text-xs text-[#667085] leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* The 4 Pillars of Integrity */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-black font-heading text-[#172033]">
            FOUR PILLARS OF <span className="text-gold-gradient">DRAW INTEGRITY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 space-y-4 border border-[#E8EAF0] shadow-card-light hover:border-[#D6A63A]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] flex items-center justify-center text-[#D6A63A]">
              <ShieldCheck className="w-6 h-6 text-[#18865B]" />
            </div>
            <h3 className="text-xl font-black text-[#172033] font-heading">1. 100% Manual Offline Draw</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Unlike online gambling or automated sweepstakes platforms that rely on invisible server scripts, the Grand Lucky Draw is conducted completely manually by physical ballots or tokens outside the platform. The platform NEVER selects random winners automatically.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 space-y-4 border border-[#E8EAF0] shadow-card-light hover:border-[#D6A63A]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] flex items-center justify-center text-[#D6A63A]">
              <Hash className="w-6 h-6 text-[#B8860B]" />
            </div>
            <h3 className="text-xl font-black text-[#172033] font-heading">2. SHA-256 Frozen Snapshot</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Before the draw takes place, the administrator freezes the eligible participant list. The system exports an immutable record and computes a cryptographic SHA-256 checksum. Any post-draw tampering would invalidate the hash instantly.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 space-y-4 border border-[#E8EAF0] shadow-card-light hover:border-[#D6A63A]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] flex items-center justify-center text-[#D6A63A]">
              <Lock className="w-6 h-6 text-[#B8860B]" />
            </div>
            <h3 className="text-xl font-black text-[#172033] font-heading">3. Dual-Admin Approval Protocol</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              The four-eyes principle is enforced at the software architecture level. Admin 1 inputs the physical draw results. Admin 2 independently audits the entries against the physical records before approval. A single administrator cannot approve their own entries.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 space-y-4 border border-[#E8EAF0] shadow-card-light hover:border-[#D6A63A]/50 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7EE] flex items-center justify-center text-[#D6A63A]">
              <Eye className="w-6 h-6 text-[#B8860B]" />
            </div>
            <h3 className="text-xl font-black text-[#172033] font-heading">4. Public Masked Announcements</h3>
            <p className="text-sm text-[#667085] leading-relaxed">
              Results are announced publicly by prize category with masked names (e.g. "Rahul S*****") and Participant IDs to safeguard personal privacy while allowing every participant to verify their winning certificate.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <Link
          to="/register"
          className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-gold-glow"
        >
          <span>Register Now & Be Counted</span>
          <ArrowRight className="w-4 h-4 text-[#172033]" />
        </Link>
      </div>
    </div>
  );
};

export default DrawInfoPage;
