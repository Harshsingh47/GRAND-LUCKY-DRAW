import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ParticipantTicket from '../../components/ParticipantTicket';

const ParticipantPass = () => {
  const { participant } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black font-heading text-white">
          DIGITAL <span className="text-gold-gradient">PARTICIPATION PASS</span>
        </h1>
        <p className="text-sm text-gray-400">
          Official lucky draw pass issued by Independent Medias. Present or scan this pass for draw verification.
        </p>
      </div>

      <ParticipantTicket
        data={{
          participantId: participant?.participantId || 'LD2027-000001',
          fullName: participant?.fullName || 'Participant',
          mobile: participant?.mobile || '9810123456',
          city: participant?.city || 'New Delhi',
          state: participant?.state || 'Delhi',
          registrationDate: participant?.registrationDate || new Date(),
          ticketNumber: participant?.ticketNumber || 1,
          campaignTitle: 'Grand Lucky Draw 2027',
          drawDate: '19 May 2027',
          organizer: 'Independent Medias'
        }}
      />
    </div>
  );
};

export default ParticipantPass;
