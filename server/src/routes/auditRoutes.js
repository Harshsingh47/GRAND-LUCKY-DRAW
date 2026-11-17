const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protectAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/audit-logs
 * @desc    Admin get system audit trail with filtering and pagination
 */
router.get('/', protectAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 30;
    const skip = (page - 1) * limit;

    const { action, entityType, search } = req.query;
    let query = {};

    if (action && action !== 'ALL') query.action = action;
    if (entityType && entityType !== 'ALL') query.entityType = entityType;
    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { description: { $regex: term, $options: 'i' } },
        { actorName: { $regex: term, $options: 'i' } },
        { entityId: { $regex: term, $options: 'i' } }
      ];
    }

    const total = await AuditLog.countDocuments(query);
    const logs = await AuditLog.find(query)
      .populate('performedBy', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
