#!/bin/bash

# Start Certificate System for Stratford International University
echo "Starting Stratford International University Certificate System..."

# Check for required directories
echo "Checking directories..."
if [ ! -d "public/images/certificates" ]; then
  echo "Creating certificates directory..."
  mkdir -p public/images/certificates
fi

if [ ! -d "public/images/logo" ]; then
  echo "Creating logo directory..."
  mkdir -p public/images/logo
fi

if [ ! -d "public/certificates" ]; then
  echo "Creating certificates output directory..."
  mkdir -p public/certificates
fi

# Check for required dependencies
echo "Checking dependencies..."
npm list jspdf || npm install jspdf --save
npm list pdfkit || npm install pdfkit --save

# Note about placeholder files
echo ""
echo "NOTE: Make sure to replace placeholder files with actual images:"
echo "- public/images/logo/logo.png (SIU logo)"
echo "- public/images/certificates/certificate-template.png (Certificate template)"
echo ""

# Start the application
echo "Starting the application..."
npm run dev 