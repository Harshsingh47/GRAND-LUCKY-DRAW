const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const Campaign = require('../models/Campaign');
const { uploadPrizeImage } = require('../middleware/upload');
const { protectAdmin, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

/**
 * @route   GET /api/prizes
 * @desc    Public get all active prizes ordered by displayOrder
 */
router.get('/', async (req, res) => {
  try {
    const prizes = await Prize.find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: 1 });

    const totalListedPrizes = prizes.reduce((acc, p) => acc + (p.quantity || 0), 0);

    res.json({
      success: true,
      totalPrizes: totalListedPrizes,
      data: prizes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/prizes/admin
 * @desc    Admin get all prizes (including inactive)
 */
router.get('/admin', protectAdmin, async (req, res) => {
  try {
    const prizes = await Prize.find()
      .populate('campaign', 'title')
      .sort({ displayOrder: 1, createdAt: 1 });
    res.json({ success: true, data: prizes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/prizes/upload-image
 * @desc    Admin upload prize image
 */
router.post('/upload-image', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), uploadPrizeImage.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image file' });
    }
    const imageUrl = `/uploads/prizes/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/prizes
 * @desc    Admin create new prize
 */
router.post('/', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { name, category, quantity, description, imageUrl, displayOrder, features } = req.body;

    if (!name || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Prize name and quantity are required'
      });
    }

    const campaign = await Campaign.findOne().sort({ createdAt: -1 });
    if (!campaign) {
      return res.status(400).json({ success: false, message: 'No active campaign found' });
    }

    const prize = await Prize.create({
      campaign: campaign._id,
      name: name.trim(),
      category: category || 'OTHER',
      quantity: Number(quantity),
      description: description ? description.trim() : '',
      imageUrl: imageUrl || '/uploads/prizes/default-prize.png',
      displayOrder: displayOrder !== undefined ? Number(displayOrder) : 10,
      features: Array.isArray(features) ? features : (features ? [features] : [])
    });

    res.status(201).json({
      success: true,
      message: 'Prize created successfully',
      data: prize
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/prizes/:id
 * @desc    Admin update prize details
 */
router.put('/:id', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id);
    if (!prize) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }

    const { name, category, quantity, description, imageUrl, displayOrder, isActive, features } = req.body;

    if (name) prize.name = name.trim();
    if (category) prize.category = category;
    if (quantity !== undefined) prize.quantity = Number(quantity);
    if (description !== undefined) prize.description = description.trim();
    if (imageUrl) prize.imageUrl = imageUrl;
    if (displayOrder !== undefined) prize.displayOrder = Number(displayOrder);
    if (isActive !== undefined) prize.isActive = isActive;
    if (features !== undefined) prize.features = Array.isArray(features) ? features : [features];

    await prize.save();

    res.json({
      success: true,
      message: 'Prize updated successfully',
      data: prize
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PATCH /api/prizes/:id/toggle
 * @desc    Toggle prize active status
 */
router.patch('/:id/toggle', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id);
    if (!prize) {
      return res.status(404).json({ success: false, message: 'Prize not found' });
    }

    prize.isActive = !prize.isActive;
    await prize.save();

    res.json({
      success: true,
      message: `Prize ${prize.isActive ? 'activated' : 'deactivated'} successfully`,
      data: prize
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
