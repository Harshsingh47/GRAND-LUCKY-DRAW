import React from 'react';
import { ShieldCheck } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-8 text-[#667085]">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/30 text-[#946708] text-xs font-bold tracking-widest uppercase">
          <ShieldCheck className="w-4 h-4 text-[#D6A63A]" />
          <span>Data Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-heading text-[#172033]">
          PRIVACY <span className="text-gold-gradient">POLICY</span>
        </h1>
        <p className="text-sm text-[#667085]">
          How Grand Lucky Draw safeguards and handles participant data.
        </p>
      </div>

      <div className="luxury-card rounded-3xl p-6 sm:p-10 space-y-6 text-sm leading-relaxed text-[#667085]">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#172033] font-heading">1. Data Minimization</h2>
          <p>
            We collect only necessary information: Full Name, Mobile Number, City, and State. We do not solicit financial banking credentials, payment cards, or sensitive personal data during open registration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#172033] font-heading">2. Public Masking on Results</h2>
          <p>
            In published winner announcements, full participant names are privacy-masked (e.g., "Rahul S*****"). Phone numbers, email addresses, and residential streets are never publicly exposed.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#172033] font-heading">3. Document Security for Claims</h2>
          <p>
            Identity proof files submitted during winner claims are stored on access-controlled infrastructure and restricted strictly to authorized compliance officers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-[#172033] font-heading">4. Communication Consent</h2>
          <p>
            By submitting your mobile number, you consent to receive SMS notifications specifically regarding registration confirmation, list closure, and official winner notifications.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;

