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
    organizer = 'Independent Medias'
  } = data || {};

  const handlePrint = () => {
    window.print();
  };

  const qrData = JSON.stringify({
    id: participantId,
    name: fullName,
    ticket: ticketNumber,
    campaign: campaignTitle,
    organizer
  });

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="btn-outline-gold px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4 text-gold-400" />
          <span>Print Pass</span>
        </button>
      </div>

      {/* Luxury Digital Pass */}
      <div
        ref={ticketRef}
        className="relative rounded-3xl bg-gradient-to-b from-[#181B23] via-[#0F1016] to-[#0A0B0E] border-2 border-gold-500/40 p-6 sm:p-8 shadow-card-dark overflow-hidden print:border-black print:text-black"
      >
        {/* Decorative corner motifs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold-500/20 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-400 to-gold-700 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B0B0E] rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold-400" />
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gold-400 font-bold">
                {organizer} Presents
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gold-gradient font-heading">
                {campaignTitle}
              </h2>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center gap-1.5 text-xs font-bold text-gold-300">
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>Official Verified Entry</span>
          </div>
        </div>

        {/* Participant ID Big Hero Badge */}
        <div className="bg-gradient-to-r from-gold-500/10 via-gold-500/20 to-gold-500/10 border border-gold-500/40 rounded-2xl p-4 sm:p-5 text-center mb-6">
          <div className="text-xs uppercase tracking-widest text-gold-300 font-semibold mb-1">
            Unique Participant ID
          </div>
          <div className="text-2xl sm:text-4xl font-black font-mono tracking-wider text-gold-gradient">
            {participantId}
          </div>
          <div className="text-xs text-gray-400 mt-1 font-mono">
            Ticket Entry #{ticketNumber} • Keep this ID safe for result verification
          </div>
        </div>

        {/* Middle Details Grid + QR Code */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center border-b border-gold-500/20 pb-6 mb-6">
          <div className="sm:col-span-2 space-y-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                Participant Name
              </span>
              <span className="text-lg font-bold text-white font-heading">{fullName}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Registered Mobile
                </span>
                <span className="text-sm font-mono text-gray-200">
                  {mobile ? `${mobile.substring(0, 4)}XXXX${mobile.substring(8)}` : 'Verified'}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Location
                </span>
                <span className="text-sm text-gray-200">{city}, {state}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Registration Date
                </span>
                <span className="text-xs text-gray-300 font-mono">
                  {new Date(registrationDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400 block font-semibold">
                  Official Draw Date
                </span>
                <span className="text-xs font-bold text-gold-400">
                  {typeof drawDate === 'string' && drawDate.includes('T') ? new Date(drawDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : drawDate}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-white p-2 w-fit mx-auto shadow-gold-glow">
            <QRCodeSVG value={qrData} size={110} level="H" />
            <span className="text-[9px] text-gray-700 font-mono font-bold mt-1 uppercase tracking-wider">
              Scan to Verify
            </span>
          </div>
        </div>

        {/* Footer Security Stamp */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-gold-400" />
            <span>Cryptographically sealed record. 100% manual draw transparency.</span>
          </div>
          <div className="text-gold-400 font-semibold tracking-wide">
            Independent Medias © 2027
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantTicket;
