const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');
const Winner = require('../models/Winner');
const Prize = require('../models/Prize');
const { buildExcelBuffer, buildCsvString } = require('../utils/excelExporter');
const { protectAdmin } = require('../middleware/auth');

/**
 * @route   GET /api/reports/summary
 * @desc    Get summary statistics for reports dashboard
 */
router.get('/summary', protectAdmin, async (req, res) => {
  try {
    const [
      totalRegistrations,
      verifiedCount,
      disqualifiedCount,
      stateDistribution,
      prizeDistribution
    ] = await Promise.all([
      Registration.countDocuments(),
      Participant.countDocuments({ isMobileVerified: true }),
      Participant.countDocuments({ isDisqualified: true }),
      Participant.aggregate([
        { $group: { _id: '$state', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Prize.aggregate([
        {
          $lookup: {
            from: 'winners',
            localField: '_id',
            foreignField: 'prize',
            as: 'winners'
          }
        },
        {
          $project: {
            name: 1,
            category: 1,
            quantity: 1,
            winnersCount: { $size: '$winners' },
            isResultsPublished: 1
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalRegistrations,
        verifiedCount,
        disqualifiedCount,
        stateDistribution,
        prizeDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/reports/winners/export
 * @desc    Export winners report to Excel or CSV
 */
router.get('/winners/export', protectAdmin, async (req, res) => {
  try {
    const format = req.query.format === 'csv' ? 'csv' : 'xlsx';

    const winners = await Winner.find()
      .populate('prize')
      .populate('participant')
      .populate('enteredBy', 'name')
      .populate('publishedBy', 'name')
      .sort({ rank: 1 });

    const rows = winners.map((w, idx) => ({
      'S.No': idx + 1,
      'Participant ID': w.participantId,
      'Winner Name': w.participant?.fullName || '',
      'Mobile': w.participant?.mobile || '',
      'Prize Won': w.prize?.name || '',
      'Prize Category': w.prize?.category || '',
      'Rank': w.rank,
      'Approval Status': w.status,
      'Is Published': w.isPublished ? 'Yes' : 'No',
      'Entered By': w.enteredBy?.name || '',
      'Publication Date': w.publishedAt ? new Date(w.publishedAt).toISOString() : ''
    }));

    if (format === 'csv') {
      const csv = buildCsvString(rows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="Grand_Lucky_Draw_Winners.csv"');
      return res.send(csv);
    } else {
      const buffer = buildExcelBuffer(rows, 'Winners');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="Grand_Lucky_Draw_Winners.xlsx"');
      return res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
