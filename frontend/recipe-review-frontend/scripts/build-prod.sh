#!/bin/bash

echo "🚀 Starting production build process..."

# Ensure we're in the project directory
cd "$(dirname "$0")/.."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf build

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm test -- --watchAll=false

# Build with production configuration
echo "🏗️ Building production bundle..."
REACT_APP_ENV=production npm run build

# Validate the build
echo "✅ Validating build..."
if [ -d "build" ]; then
    echo "Build successful! Production files are ready in the build directory."
    echo "📊 Build size details:"
    du -sh build/*
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi 