import React, { useState } from 'react';
import { Crown, HelpCircle, ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'Is there any fee or payment required to participate?',
      a: 'No. The Grand Lucky Draw campaign is conducted with strict adherence to applicable legal frameworks. No entry fee, purchase, or transaction is charged unless explicitly authorized and compliant with approved promotional regulations.'
    },
    {
      q: 'How are winners selected?',
      a: 'All winners are drawn manually and physically by the organizers in an official ceremony outside the website. The website platform does not generate random winners algorithmically. The participant list is cryptographically frozen with a SHA-256 hash before the physical draw to guarantee fairness.'
    },
    {
      q: 'What is a Participant ID and how is it generated?',
      a: 'A Participant ID (e.g. LD2027-000001) is your unique identifier issued upon completing mobile verification. It is generated through concurrency-safe atomic sequence operations on our secure server, guaranteeing no duplicate numbers can exist.'
    },
    {
      q: 'Can one person register multiple times?',
      a: 'No. Campaign rules restrict each participant to exactly one entry per verified mobile number. Duplicate attempts with identical phone numbers are automatically blocked by the database.'
    },
    {
      q: 'What are the 70 grand prizes being awarded?',
      a: 'The campaign features 4 Toyota Fortuner 4x4 SUVs, 5 Mahindra Thar 4x4s, 20 Maruti Suzuki Swift cars, 40 High-Speed Electric Scooters, and 1 Luxury Farmhouse.'
    },
    {
      q: 'When will the winners be published on the website?',
      a: 'The draw ceremony takes place on 19 May 2027. Following manual completion and two-tier administrator verification, official results are published on the website.'
    },
    {
      q: 'How do I claim my prize if I win?',
      a: 'Winners can log in to the "Verify & Claim" portal with their Participant ID and registered mobile OTP, verify their details, and upload their government photo ID and address proof for dispatch.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF7EE] border border-[#D6A63A]/40 text-[#946708] text-xs font-bold tracking-wider uppercase shadow-xs">
          <HelpCircle className="w-4 h-4 text-[#D6A63A]" />
          <span>Frequently Asked Questions</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black font-heading text-[#172033]">
          HELP & <span className="text-gold-gradient">FAQS</span>
        </h1>
        <p className="text-sm sm:text-base text-[#667085]">
          Find answers to common questions about registration, participation, and the manual draw.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white border border-[#E8EAF0] shadow-xs overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 text-[#172033] font-bold hover:text-[#B8860B] transition-colors"
            >
              <span className="font-heading text-base sm:text-lg">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-[#D6A63A] shrink-0 transition-transform ${
                  openIdx === idx ? 'rotate-180' : ''
                }`}
              />
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-sm text-[#667085] leading-relaxed border-t border-[#E8EAF0] pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-center pt-6">
        <Link to="/how-it-works" className="btn-outline-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold shadow-xs">
          <span>Learn How Participation Works</span>
          <ArrowRight className="w-4 h-4 text-[#D6A63A]" />
        </Link>
      </div>
    </div>
  );
};

export default FaqPage;
