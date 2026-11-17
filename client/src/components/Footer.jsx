import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#050507] border-t border-gold-500/20 text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0B0B0E] rounded-[6px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-gold-400 font-semibold block">Developed By</span>
                <span className="text-lg font-bold text-white font-heading tracking-wide">Independent Medias</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Organizers of the official <span className="text-gold-300 font-semibold">Grand Lucky Draw 2027</span>. Offering 70 life-changing grand prizes with complete procedural transparency and manual draw integrity.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>100% Transparent Manual Draw</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 font-heading">
              Campaign Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/prizes" className="hover:text-gold-300 transition-colors">Grand Prizes (70 Units)</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-gold-300 transition-colors">How Participation Works</Link>
              </li>
              <li>
                <Link to="/draw-information" className="hover:text-gold-300 transition-colors">Draw Procedure & Transparency</Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-gold-300 transition-colors">Official Published Winners</Link>
              </li>
              <li>
                <Link to="/verify-winner" className="hover:text-gold-300 transition-colors">Winner Verification & Claim</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gold-300 transition-colors text-gold-400 font-medium">Join Now / Register</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 font-heading">
              Governance & Policies
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/terms-and-conditions" className="hover:text-gold-300 transition-colors">Terms and Conditions</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/draw-information" className="hover:text-gold-300 transition-colors">Manual Draw Protocols</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-gold-300 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-gray-500 hover:text-gold-400 text-xs transition-colors flex items-center gap-1 mt-3">
                  <span>Authorized Admin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-4 font-heading">
              Organizer Support
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <a href="mailto:support@independentmedias.com" className="hover:text-gold-300 transition-colors break-all">
                  support@independentmedias.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>+91 98765 43210 (Toll Free / Helpdesk)</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
                <span>Independent Medias Corporate Tower, Media City, New Delhi - 110001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-dark-900 border border-gold-500/15 mb-8 text-xs text-gray-400 leading-relaxed">
          <p className="font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-400 inline" />
            Mandatory Legal & Process Disclaimer:
          </p>
          <p>
            The Grand Lucky Draw is an official campaign conducted by <strong>Independent Medias</strong>. In accordance with strict integrity guidelines, all actual draws are conducted manually and physically outside the website in front of independent verification committees. The platform does not use random computer algorithms to select winners. Eligible participant lists are cryptographically frozen with a SHA-256 hash prior to the draw, and winners are verified through a multi-tier dual-administrator approval process. No payment or purchase is required unless explicitly confirmed and legally approved.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {new Date().getFullYear()} <span className="text-gold-400 font-medium">Independent Medias</span>. All Rights Reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms-and-conditions" className="hover:text-gold-400">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-gold-400">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-gold-400">Contact Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
