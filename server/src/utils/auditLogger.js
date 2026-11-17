const AuditLog = require('../models/AuditLog');

/**
 * Creates an immutable audit log record for security, compliance, and two-step verification tracking
 */
const logAudit = async (req, { action, entityType, entityId, description, details }) => {
  try {
    const user = req?.user;
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'Unknown';

    await AuditLog.create({
      action,
      performedBy: user?._id || null,
      actorName: user?.name || (req?.isParticipant ? req?.participant?.fullName : 'SYSTEM'),
      actorRole: user?.role || (req?.isParticipant ? 'PARTICIPANT' : 'SYSTEM'),
      entityType,
      entityId: String(entityId || ''),
      description,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    console.error('[AuditLog Error]', error.message);
  }
};

module.exports = { logAudit };
