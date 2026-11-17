const express = require('express');
const router = express.Router();
const Announcement = require('../models/Announcement');
const { protectAdmin, authorize } = require('../middleware/auth');
const { ROLES } = require('../config/constants');

/**
 * @route   GET /api/announcements
 * @desc    Public get published announcements
 */
router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find({ isPublished: true })
      .sort({ isPinned: -1, publishedAt: -1 })
      .limit(20);

    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/announcements/admin
 * @desc    Admin list all announcements
 */
router.get('/admin', protectAdmin, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/announcements
 * @desc    Admin create announcement
 */
router.post('/', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { title, content, category, isPinned } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const announcement = await Announcement.create({
      title: title.trim(),
      content: content.trim(),
      category: category || 'GENERAL',
      isPinned: !!isPinned,
      author: req.user.name || 'Draw Directorate'
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   DELETE /api/announcements/:id
 * @desc    Admin delete announcement
 */
router.delete('/:id', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Announcement deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
