import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#E8EAF0] text-[#667085] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DFBA5E] via-[#D6A63A] to-[#B8860B] p-0.5 flex items-center justify-center shadow-gold-glow">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-[#D6A63A]" />
                </div>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#B8860B] font-bold block">Official Campaign</span>
                <span className="text-lg font-black text-[#172033] font-heading tracking-tight">Grand Lucky Draw</span>
              </div>
            </div>
            <p className="text-sm text-[#667085] leading-relaxed">
              Organizers of the official <span className="text-[#172033] font-semibold">Grand Lucky Draw 2027</span>. Offering 70 life-changing grand prizes with complete procedural transparency and manual draw integrity.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/30 text-xs font-semibold text-[#946708]">
              <ShieldCheck className="w-4 h-4 text-[#D6A63A]" />
              <span>100% Transparent Manual Draw</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172033] mb-4 font-heading">
              Campaign Links
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/prizes" className="hover:text-[#D6A63A] transition-colors">Grand Prizes (70 Units)</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-[#D6A63A] transition-colors">How Participation Works</Link>
              </li>
              <li>
                <Link to="/draw-information" className="hover:text-[#D6A63A] transition-colors">Draw Procedure & Transparency</Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-[#D6A63A] transition-colors">Official Published Winners</Link>
              </li>
              <li>
                <Link to="/verify-winner" className="hover:text-[#D6A63A] transition-colors">Winner Verification & Claim</Link>
              </li>
              <li>
                <Link to="/register" className="text-[#B8860B] hover:text-[#946708] font-bold transition-colors">Join Now / Register</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172033] mb-4 font-heading">
              Governance & Policies
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#D6A63A] transition-colors">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#D6A63A] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/draw-information" className="hover:text-[#D6A63A] transition-colors">Manual Draw Protocols</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D6A63A] transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-[#667085] hover:text-[#D6A63A] text-xs transition-colors flex items-center gap-1 mt-3 font-semibold">
                  <span>Authorized Admin Portal</span>
                  <ExternalLink className="w-3 h-3 text-[#D6A63A]" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#172033] mb-4 font-heading">
              Campaign Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D6A63A] shrink-0 mt-1" />
                <a href="mailto:support@grandluckydraw.com" className="hover:text-[#D6A63A] transition-colors break-all font-medium">
                  support@grandluckydraw.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#D6A63A] shrink-0 mt-1" />
                <span className="font-medium text-[#172033]">+91 98765 43210 (Toll Free / Helpdesk)</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D6A63A] shrink-0 mt-1" />
                <span className="text-[#667085]">Central Draw Committee Office, Media District, New Delhi - 110001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-5 rounded-2xl bg-[#F8F9FC] border border-[#E8EAF0] mb-8 text-xs text-[#667085] leading-relaxed shadow-xs">
          <p className="font-bold text-[#172033] mb-1.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#18865B] inline" />
            Mandatory Legal & Process Disclaimer:
          </p>
          <p>
            The Grand Lucky Draw is an official promotional campaign conducted under strict integrity guidelines. All actual draws are conducted manually and physically outside the website in front of independent verification committees. The platform does not use random computer algorithms to select winners. Eligible participant lists are cryptographically frozen with a SHA-256 hash prior to the draw, and winners are verified through a multi-tier dual-administrator approval process. No payment or purchase is required unless explicitly confirmed and legally approved.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E8EAF0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#667085]">
          <div>
            © {new Date().getFullYear()} <span className="text-[#172033] font-bold">Grand Lucky Draw</span>. All Rights Reserved.
          </div>
          <div>
            Developed by{' '}
            <a
              href="https://independentmedias.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#B8860B] hover:text-[#946708] font-bold underline underline-offset-4 transition-colors"
            >
              Independent Media
            </a>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/terms-and-conditions" className="hover:text-[#172033] transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-[#172033] transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-[#172033] transition-colors">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
