import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import AlertMessage from './shared/AlertMessage';
import LoadingSpinner from './shared/LoadingSpinner';
import { saveAs } from 'file-saver';

const CertificateGenerator = () => {
  const [formData, setFormData] = useState({
    recipientName: '',
    program: '',
    issueDate: new Date().toISOString().split('T')[0],
    certificateNumber: `SIU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.recipientName || formData.recipientName.trim().length < 3) {
      newErrors.recipientName = 'Name must be at least 3 characters';
    }

    if (!formData.program) {
      newErrors.program = 'Program is required';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Issue date is required';
    }

    if (!formData.certificateNumber) {
      newErrors.certificateNumber = 'Certificate number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await axios.post('/api/certificates/siu/generate', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('Certificate generated successfully!');
      setCertificate(response.data.data.certificate);
    } catch (err) {
      console.error('Error generating certificate:', err);
      setError(err.response?.data?.message || err.message || 'Failed to generate certificate');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!certificate) return;

    try {
      setLoading(true);

      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Set background (simulating the template)
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, 297, 210, 'F');

      // Add gold border
      doc.setDrawColor(212, 160, 23); // #D4A017
      doc.setLineWidth(1);
      doc.rect(10, 10, 277, 190);

      // Set text colors
      doc.setTextColor(0, 48, 135); // #003087 deep blue

      // Add SIU header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('STRATFORD INTERNATIONAL UNIVERSITY', 148.5, 30, { align: 'center' });

      // Certificate title
      doc.setFontSize(36);
      doc.text('Certificate of Completion', 148.5, 50, { align: 'center' });

      doc.setFontSize(20);
      doc.text('毕业证书', 148.5, 60, { align: 'center' });

      // Recipient details
      doc.setTextColor(0, 0, 0); // Black
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.text('This is to certify that', 148.5, 80, { align: 'center' });

      doc.setFontSize(30);
      doc.setFont('helvetica', 'bolditalic');
      doc.text(certificate.recipientName, 148.5, 100, { align: 'center' });

      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.text('has successfully completed the requirements for', 148.5, 120, { align: 'center' });

      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(certificate.program, 148.5, 140, { align: 'center' });

      // Certificate details
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Certificate Number: ${certificate.certificateNumber}`, 148.5, 160, {
        align: 'center',
      });
      doc.text(`Issue Date: ${new Date(certificate.issueDate).toLocaleDateString()}`, 148.5, 166, {
        align: 'center',
      });
      doc.text(`Blockchain Hash: ${certificate.blockchainHash}`, 148.5, 172, { align: 'center' });

      // Signatures
      doc.setFontSize(10);
      doc.line(80, 180, 120, 180);
      doc.text('Dr. Elizabeth Stratford', 100, 186, { align: 'center' });
      doc.text('University President', 100, 192, { align: 'center' });

      doc.line(180, 180, 220, 180);
      doc.text('Prof. Michael Abide', 200, 186, { align: 'center' });
      doc.text('Program Director', 200, 192, { align: 'center' });

      // Download the PDF
      doc.save(`SIU-Certificate-${certificate.certificateNumber}.pdf`);
    } catch (err) {
      console.error('Error downloading certificate:', err);
      setError('Failed to download certificate: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Generate Certificate</h2>

      {success && <AlertMessage type="success" message={success} />}
      {error && <AlertMessage type="error" message={error} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
            Recipient Name
          </label>
          <input
            type="text"
            id="recipientName"
            name="recipientName"
            value={formData.recipientName}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.recipientName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.recipientName && (
            <p className="mt-1 text-sm text-red-500">{errors.recipientName}</p>
          )}
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
            Program / Degree
          </label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.program ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a program</option>
            <option value="Master of Business Administration">
              Master of Business Administration
            </option>
            <option value="Master of Science in Artificial Intelligence">
              Master of Science in Artificial Intelligence
            </option>
            <option value="Master of Science in Global Health">
              Master of Science in Global Health
            </option>
            <option value="Bachelor of Science in Computer Science">
              Bachelor of Science in Computer Science
            </option>
            <option value="Bachelor of Business Administration">
              Bachelor of Business Administration
            </option>
          </select>
          {errors.program && <p className="mt-1 text-sm text-red-500">{errors.program}</p>}
        </div>

        <div>
          <label htmlFor="issueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <input
            type="date"
            id="issueDate"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.issueDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.issueDate && <p className="mt-1 text-sm text-red-500">{errors.issueDate}</p>}
        </div>

        <div>
          <label
            htmlFor="certificateNumber"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Certificate Number
          </label>
          <input
            type="text"
            id="certificateNumber"
            name="certificateNumber"
            value={formData.certificateNumber}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.certificateNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.certificateNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.certificateNumber}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Auto-generated unique identifier. You can modify if needed.
          </p>
        </div>

        <div className="flex justify-between items-center space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Generate Certificate'}
          </button>

          {certificate && (
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Download Certificate'}
            </button>
          )}
        </div>
      </form>

      {certificate && (
        <div className="mt-6 p-4 border border-gray-200 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Certificate Preview</h3>
          <div className="bg-gray-100 p-4 rounded-md">
            <p>
              <strong>Recipient:</strong> {certificate.recipientName}
            </p>
            <p>
              <strong>Program:</strong> {certificate.program}
            </p>
            <p>
              <strong>Certificate Number:</strong> {certificate.certificateNumber}
            </p>
            <p>
              <strong>Issue Date:</strong> {new Date(certificate.issueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Blockchain Hash:</strong> {certificate.blockchainHash}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGenerator;
