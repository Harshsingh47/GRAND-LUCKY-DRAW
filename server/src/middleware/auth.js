const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const { ROLES } = require('../config/constants');

/**
 * Protect Admin Routes
 */
const protectAdmin = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin account is invalid or deactivated'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired'
    });
  }
};

/**
 * Role-Based Access Control
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user?.role}' is not authorized to perform this action`
      });
    }
    next();
  };
};

/**
 * Protect Participant Routes
 */
const protectParticipant = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Participant authentication required. Token missing.'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const participant = await Participant.findById(decoded.id);

    if (!participant) {
      return res.status(401).json({
        success: false,
        message: 'Participant account not found'
      });
    }

    const registration = await Registration.findOne({ participant: participant._id })
      .populate('campaign');

    req.participant = participant;
    req.registration = registration;
    req.isParticipant = true;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Participant session expired or invalid'
    });
  }
};

module.exports = {
  protectAdmin,
  authorize,
  protectParticipant
};
