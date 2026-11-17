import React from 'react';
import { Crown, ShieldCheck } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-gray-300">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-gold-300 text-xs font-bold tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <span>Data Privacy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-white">
          PRIVACY <span className="text-gold-gradient">POLICY</span>
        </h1>
        <p className="text-sm text-gray-400">
          How we safeguard and handle participant data.
        </p>
      </div>

      <div className="luxury-card rounded-3xl p-6 sm:p-10 space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">1. Data Minimization</h2>
          <p>
            We collect only necessary information: Full Name, Mobile Number, City, and State. We do not solicit financial banking credentials, payment cards, or sensitive personal data during open registration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">2. Public Masking on Results</h2>
          <p>
            In published winner announcements, full participant names are privacy-masked (e.g., "Rahul S*****"). Phone numbers, email addresses, and residential streets are never publicly exposed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">3. Document Security for Claims</h2>
          <p>
            Identity proof files submitted during winner claims are stored on access-controlled infrastructure and restricted strictly to authorized compliance officers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-heading text-gold-300">4. Communication Consent</h2>
          <p>
            By verifying your mobile number via OTP, you consent to receive SMS notifications specifically regarding OTP verification, registration confirmation, list closure, and official winner notifications.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
