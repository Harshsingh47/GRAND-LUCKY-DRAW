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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase shadow-gold-glow">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Integrity & Governance</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black font-heading text-white">
          DRAW PROCEDURE <span className="text-gold-gradient">& TRANSPARENCY</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
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
          <div key={idx} className="p-6 rounded-2xl bg-dark-900 border border-gold-500/30 space-y-2">
            <span className="text-xs font-mono font-bold text-gold-400 block">{item.date}</span>
            <h3 className="text-lg font-bold text-white font-heading">{item.title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* The 4 Pillars of Integrity */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black font-heading text-white">
            FOUR PILLARS OF <span className="text-gold-gradient">DRAW INTEGRITY</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="luxury-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">1. 100% Manual Offline Draw</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Unlike online gambling or automated sweepstakes platforms that rely on invisible server scripts, the Grand Lucky Draw is conducted completely manually by physical ballots or tokens outside the platform. The platform NEVER selects random winners automatically.
            </p>
          </div>

          <div className="luxury-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Hash className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">2. SHA-256 Frozen Snapshot</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Before the draw takes place, the administrator freezes the eligible participant list. The system exports an immutable record and computes a cryptographic SHA-256 checksum. Any post-draw tampering would invalidate the hash instantly.
            </p>
          </div>

          <div className="luxury-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">3. Dual-Admin Approval Protocol</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              The four-eyes principle is enforced at the software architecture level. Admin 1 inputs the physical draw results. Admin 2 independently audits the entries against the physical records before approval. A single administrator cannot approve their own entries.
            </p>
          </div>

          <div className="luxury-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-400">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white font-heading">4. Public Masked Announcements</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
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
          <ArrowRight className="w-4 h-4 text-dark-950" />
        </Link>
      </div>
    </div>
  );
};

export default DrawInfoPage;
