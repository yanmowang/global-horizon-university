const express = require('express');
const router = express.Router();
const Certificate = require('../models/Certificate');

// GET /api/verify/:certificateId - Verify a certificate by ID
router.get('/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    
    // Find certificate by certificateNumber (不是certificateId)
    const certificate = await Certificate.findOne({ certificateNumber: certificateId })
      .populate('userId', 'name -_id')
      .select('certificateNumber recipientName program issueDate status blockchainHash');
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        verified: false,
      });
    }
    
    // Return certificate details
    res.json({
      success: true,
      message: 'Certificate verified successfully',
      verified: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      verified: false,
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

// POST /api/verify - Verify a certificate by ID (from form submission)
router.post('/', async (req, res) => {
  try {
    const { certificateId } = req.body;
    
    if (!certificateId) {
      return res.status(400).json({
        success: false,
        message: 'Certificate ID is required',
        verified: false,
      });
    }
    
    // Find certificate by certificateNumber (不是certificateId)
    const certificate = await Certificate.findOne({ certificateNumber: certificateId })
      .populate('userId', 'name -_id')
      .select('certificateNumber recipientName program issueDate status blockchainHash');
    
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        verified: false,
      });
    }
    
    // Return certificate details
    res.json({
      success: true,
      message: 'Certificate verified successfully',
      verified: true,
      data: certificate,
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
      verified: false,
      error: process.env.NODE_ENV === 'production' ? null : error.message,
    });
  }
});

module.exports = router; 