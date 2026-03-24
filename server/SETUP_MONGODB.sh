#!/bin/bash

# MongoDB Backend Setup Script
# Run this to set up the backend with MongoDB

echo "🚀 Smart School Hub - Backend MongoDB Setup"
echo "=============================================="

# Navigate to server directory
cd server || exit

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📝 Environment setup..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your MongoDB connection string."
    echo ""
    echo "Next steps:"
    echo "1. Edit server/.env and add your MongoDB URI"
    echo "2. Run: npm run dev (for development) or npm start (for production)"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎯 Setup complete!"
echo ""
echo "To start the backend:"
echo "  npm run dev       # Development mode (auto-reload)"
echo "  npm start         # Production mode"
echo ""
echo "For more details, see: server/MONGODB_SETUP.md"
