# Stratford International University Certificate Generation System

This document outlines the implementation of the electronic certificate generation system for Stratford International University (SIU).

## Overview

The certificate generation system allows:

- Generation of professional-looking certificates with SIU branding
- Automatic certificate numbering and blockchain verification
- PDF download of generated certificates
- Public verification of certificates by certificate number

## Features

1. **Certificate Generation**

   - Available in the user dashboard under "Generate SIU Certificate" tab
   - Includes recipient name, program, and issue date
   - Creates a unique certificate number in format: SIU-XX-YYYY-NNNNNN
   - Automatically generates a blockchain hash for verification

2. **Certificate Design**

   - Professional layout with SIU branding (deep blue #003087 and gold #D4A017)
   - Bilingual title (English and Chinese)
   - Includes school seal, signatures, and decorative elements
   - A4 landscape format optimized for printing

3. **Certificate Verification**
   - Public verification page accessible at `/verify-certificate`
   - Direct verification links in format `/verify/:certificateNumber`
   - Verification displays all certificate details including blockchain hash

## Implementation Details

### Certificate Model

The certificate data is stored in MongoDB with the following key fields:

- `userId`: Reference to the user who owns the certificate
- `recipientName`: Full name of the certificate recipient
- `program`: Academic program or course completed
- `certificateNumber`: Unique identifier (auto-generated)
- `certificateType`: Type of certificate (bachelor, master, phd, professional)
- `issueDate`: Date of issuance
- `status`: Current status (pending, issued, revoked)
- `blockchainHash`: Unique hash for blockchain verification

### Certificate Generation Process

1. User fills out the certificate generation form with recipient details
2. System creates a certificate record in the database with "issued" status
3. A unique certificate number and blockchain hash are automatically generated
4. The PDF certificate is generated using jsPDF with SIU branding
5. User can download the PDF directly from the dashboard

### Certificate Verification Process

1. Anyone can verify a certificate by entering the certificate number
2. System checks the database for matching certificate
3. If found, displays certificate details and verification status
4. Verification confirms both the certificate's existence and its blockchain hash

## Files and Components

- `src/components/CertificateGenerator.jsx`: Frontend component for generating certificates
- `src/components/VerifyCertificate.jsx`: Frontend component for verifying certificates
- `src/server/models/Certificate.js`: Certificate data model
- `src/server/controllers/certificateController.js`: API endpoint implementations
- `src/server/routes/certificateRoutes.js`: API routes for certificate operations
- `public/images/certificates/`: Storage location for certificate templates
- `public/images/logo/logo.png`: SIU logo used in certificates

## Usage

### Generating Certificates

1. Log in to your account and navigate to the Dashboard
2. Click on the "Generate SIU Certificate" tab
3. Fill in the recipient's name, select a program, and set the issue date
4. Click "Generate Certificate"
5. Once generated, click "Download Certificate" to get the PDF

### Verifying Certificates

1. Navigate to `/verify-certificate`
2. Enter the certificate number in the format SIU-XX-YYYY-NNNNNN
3. Click "Verify"
4. View the verification results showing certificate details and status

## Note on Certificate Templates

The actual certificate template and logo image need to be placed in:

- `public/images/logo/logo.png`: SIU logo with deep blue background (#003087) and gold text (#D4A017)
- `public/images/certificates/certificate-template.png`: Certificate template matching specifications

Currently, placeholder files are in place. To fully implement the system, replace these placeholders with actual image files.
