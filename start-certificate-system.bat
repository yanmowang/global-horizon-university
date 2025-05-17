@echo off
REM Start Certificate System for Stratford International University
echo Starting Stratford International University Certificate System...

REM Check for required directories
echo Checking directories...
if not exist "public\images\certificates" (
  echo Creating certificates directory...
  mkdir "public\images\certificates"
)

if not exist "public\images\logo" (
  echo Creating logo directory...
  mkdir "public\images\logo"
)

if not exist "public\certificates" (
  echo Creating certificates output directory...
  mkdir "public\certificates"
)

REM Check for required dependencies
echo Checking dependencies...
call npm list jspdf || call npm install jspdf --save
call npm list pdfkit || call npm install pdfkit --save

REM Note about placeholder files
echo.
echo NOTE: Make sure to replace placeholder files with actual images:
echo - public\images\logo\logo.png (SIU logo)
echo - public\images\certificates\certificate-template.png (Certificate template)
echo.

REM Start the application
echo Starting the application...
call npm run dev 