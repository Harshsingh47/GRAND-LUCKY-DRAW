const crypto = require('crypto');

/**
 * Generates cryptographic SHA-256 checksum for frozen participant list
 * @param {Array<string>} participantIds - Array of participant IDs (e.g. ['LD2027-000001', ...])
 * @returns {Object} { hash: string, sortedList: Array<string>, count: number }
 */
const generateSnapshotHash = (participantIds) => {
  if (!Array.isArray(participantIds)) {
    throw new Error('participantIds must be an array');
  }

  // Canonical alphabetical sorting guarantees deterministic cryptographic hash
  const sortedList = [...participantIds].sort();
  const canonicalString = sortedList.join('\n');

  const hash = crypto
    .createHash('sha256')
    .update(canonicalString, 'utf8')
    .digest('hex');

  return {
    hash,
    count: sortedList.length,
    canonicalString
  };
};

/**
 * Verifies if an existing hash matches the given participant list
 */
const verifySnapshotHash = (participantIds, existingHash) => {
  const { hash } = generateSnapshotHash(participantIds);
  return hash.toLowerCase() === existingHash.toLowerCase();
};

module.exports = {
  generateSnapshotHash,
  verifySnapshotHash
};
