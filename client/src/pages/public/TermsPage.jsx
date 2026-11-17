import React from 'react';
import { Crown, ShieldCheck } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-gray-300">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-white">
          TERMS & <span className="text-gold-gradient">CONDITIONS</span>
        </h1>
        <p className="text-sm text-gray-400">
          Official campaign participation terms.
        </p>
      </div>

      <div className="luxury-card rounded-3xl p-6 sm:p-10 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">1. Eligibility</h2>
          <p>
            Participation in the Grand Lucky Draw 2027 is open solely to legal residents of India who are at least 18 years of age at the time of registration. Employees, direct affiliates, and immediate relatives of the technical deployment team are ineligible to claim grand prizes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">2. Single Entry Constraint</h2>
          <p>
            Each participant is restricted to one (1) unique registration per verified mobile telephone number. Registrations are concurrency-locked. Any attempt to generate multiple participant IDs using identical credentials will result in automatic disqualification of all linked entries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">3. Independent Manual Draw Ceremony</h2>
          <p>
            The participant explicitly acknowledges that all drawings are performed manually, physically, and independently outside the online website. The website platform acts solely as a registry and official publication ledger.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">4. Prize Distribution & KYC Verification</h2>
          <p>
            Winners are required to substantiate their identity with valid government-issued photographic identification (Aadhaar, PAN, Passport, Driving License) and verifiable address proof within 30 days of official result publication.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">5. Taxes & Incidental Costs</h2>
          <p>
            Prizes are distributed strictly in as-is condition. Statutory road taxes, transit insurance, and registration surcharges applicable under Indian law remain the responsibility of the winner unless explicitly waived by the campaign sponsor.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
