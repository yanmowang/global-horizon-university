#!/bin/bash
echo "Installing dependencies with legacy-peer-deps flag..."
npm install --legacy-peer-deps
echo "Building the project..."
npm run build 