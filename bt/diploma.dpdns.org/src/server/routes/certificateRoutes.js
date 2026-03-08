const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const auth = require('../middleware/auth');

// Public routes
router.post('/verify', certificateController.verifyCertificate);
router.get('/verify/:certificateId', certificateController.verifyCertificate);

// Protected routes
router.get('/user', auth, certificateController.getAllCertificates);
router.get('/:id/download', auth, certificateController.downloadCertificate);
router.get('/:id/download-base64', auth, certificateController.downloadCertificateBase64);
router.get('/:id/view', auth, certificateController.streamCertificate);
router.get('/', auth, certificateController.getAllCertificates);
router.post('/', auth, certificateController.createCertificateRequest);
router.post('/siu/generate', auth, certificateController.generateSIUCertificate);
router.get('/:id', auth, certificateController.getCertificate);

module.exports = router;
