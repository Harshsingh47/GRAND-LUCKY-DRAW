import React, { useState } from 'react';
import { Crown, Mail, Send, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ContactPage = () => {
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been received. Our support team will respond shortly.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <Mail className="w-4 h-4 text-[#D6A63A]" />
          <span>Support & Helpdesk</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[#172033]">
          CONTACT <span className="text-gold-gradient">SUPPORT</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085]">
          Have an inquiry regarding registration or the campaign? Submit your message below and our support team will assist you.
        </p>
      </div>

      {/* Support Inquiry Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAF0] shadow-card-light">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <CheckCircle2 className="w-16 h-16 text-[#18865B] mx-auto" />
              <h3 className="text-2xl font-black text-[#172033] font-heading">Message Dispatched!</h3>
              <p className="text-sm text-[#667085] max-w-md mx-auto leading-relaxed">
                Thank you for reaching out to the Grand Lucky Draw support team. A representative will review your query and respond shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-outline-gold px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Vikram Sharma"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit number"
                    maxLength={10}
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm font-mono focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Participant ID Query"
                    className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172033]">Message / Inquiry *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-4 py-3 rounded-xl bg-[#F8F9FC] border border-[#E8EAF0] text-[#172033] text-sm focus:bg-white focus:outline-none focus:border-[#D6A63A] focus:ring-2 focus:ring-[#D6A63A]/20 transition-all"
                />
              </div>

              <button
                type="submit"
                className="btn-gold w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4 text-[#172033]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
