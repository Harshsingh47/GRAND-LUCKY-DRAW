const Counter = require('../models/Counter');
const { DEFAULT_PREFIX } = require('../config/constants');

/**
 * Concurrency-safe Atomic Participant ID Generator
 * Generates sequential IDs such as LD2027-000001
 * Uses MongoDB atomic findOneAndUpdate with upsert
 */
const generateParticipantId = async (prefix = DEFAULT_PREFIX) => {
  const counter = await Counter.findOneAndUpdate(
    { _id: prefix },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqNumber = counter.seq;
  const paddedSeq = String(seqNumber).padStart(6, '0');
  const participantId = `${prefix}-${paddedSeq}`;

  return {
    participantId,
    ticketNumber: seqNumber
  };
};

module.exports = { generateParticipantId };
