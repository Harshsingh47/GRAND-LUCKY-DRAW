import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Crown, ShieldCheck, Download, Printer, CheckCircle2 } from 'lucide-react';

const ParticipantTicket = ({ data }) => {
  const ticketRef = useRef(null);

  const {
    participantId = 'LD2027-000001',
    fullName = 'Participant Name',
    mobile = '9876543210',
    state = 'Delhi',
    city = 'New Delhi',
    registrationDate = new Date(),
    ticketNumber = 1,
    campaignTitle = 'Grand Lucky Draw 2027',
    drawDate = '19 May 2027',
    organizer = 'Grand Lucky Draw'
  } = data || {};

  const handlePrint = () => {
    window.print();
  };

  const qrData = JSON.stringify({
    id: participantId,
    name: fullName,
    ticket: ticketNumber,
    campaign: campaignTitle
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="btn-outline-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <Printer className="w-4 h-4 text-[#D6A63A]" />
          <span>Print Official Pass</span>
        </button>
      </div>

      {/* Luxury Light Digital Pass */}
      <div
        ref={ticketRef}
        className="relative rounded-3xl bg-white border-2 border-[#D6A63A]/50 p-6 sm:p-8 shadow-card-hover overflow-hidden print:border-black print:text-black"
      >
        {/* Subtle decorative background tints */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#D6A63A]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#D6A63A]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8EAF0] pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DFBA5E] via-[#D6A63A] to-[#B8860B] p-0.5 flex items-center justify-center shadow-gold-glow">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-[#D6A63A]" />
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#B8860B] font-bold">
                Dream Big... Win Big...
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#172033] font-heading tracking-tight">
                {campaignTitle}
              </h2>
            </div>
          </div>

          <div className="px-3.5 py-1.5 rounded-full bg-[#18865B]/10 border border-[#18865B]/25 flex items-center gap-1.5 text-xs font-bold text-[#18865B]">
            <CheckCircle2 className="w-4 h-4 text-[#18865B]" />
            <span>Official Verified Entry</span>
          </div>
        </div>

        {/* Participant ID Big Hero Badge */}
        <div className="bg-[#FAF7EE] border border-[#D6A63A]/40 rounded-2xl p-4 sm:p-6 text-center mb-6 shadow-xs">
          <div className="text-xs uppercase tracking-wider text-[#946708] font-bold mb-1">
            Official Participant Pass ID
          </div>
          <div className="text-3xl sm:text-4xl md:text-5xl font-black font-mono tracking-wider text-[#172033]">
            {participantId}
          </div>
          <div className="text-xs text-[#667085] mt-1.5 font-medium">
            Ticket Entry #{ticketNumber} • Keep this ID safe for live manual draw result verification
          </div>
        </div>

        {/* Middle Details Grid + QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-[#E8EAF0] pb-6 mb-6">
          <div className="sm:col-span-2 space-y-3.5">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#667085] block font-bold">
                Participant Name
              </span>
              <span className="text-lg sm:text-xl font-black text-[#172033] font-heading">{fullName}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#667085] block font-bold">
                  Registered Mobile
                </span>
                <span className="text-sm font-mono font-semibold text-[#172033]">
                  {mobile ? `${mobile.substring(0, 4)}XXXX${mobile.substring(8)}` : 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#667085] block font-bold">
                  Location
                </span>
                <span className="text-sm font-semibold text-[#172033]">{city}, {state}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#667085] block font-bold">
                  Registration Date
                </span>
                <span className="text-xs font-semibold text-[#172033]">
                  {new Date(registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#667085] block font-bold">
                  Official Draw Date
                </span>
                <span className="text-xs font-bold text-[#B8860B]">
                  {typeof drawDate === 'string' && drawDate.includes('T') ? new Date(drawDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : drawDate}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#E8EAF0] shadow-sm w-fit mx-auto">
            <QRCodeSVG value={qrData} size={110} level="H" />
            <span className="text-[10px] text-[#667085] font-bold mt-2 uppercase tracking-wider">
              Scan to Verify
            </span>
          </div>
        </div>

        {/* Footer Security Stamp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#667085]">
          <div className="flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-4 h-4 text-[#18865B]" />
            <span>Cryptographically sealed record. 100% manual draw transparency.</span>
          </div>
          <div className="text-[#B8860B] font-bold tracking-wide">
            Grand Lucky Draw © 2027
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantTicket;
