#!/bin/bash

# YouTube Channel Analyzer - Quick Start Script
# This script helps you set up all three services quickly

echo "🎥 YouTube Channel Analyzer - Quick Start"
echo "=========================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install from https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install from https://python.org/"
    exit 1
fi
echo "✅ Python $(python3 --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi
echo "✅ npm $(npm --version)"

echo ""
echo "🚀 Setting up services..."
echo ""

# Setup AI Service
echo "1️⃣  Setting up AI Service (Python/Flask)..."
cd ai_service

if [ ! -d "venv" ]; then
    echo "   Creating virtual environment..."
    python3 -m venv venv
fi

echo "   Activating virtual environment..."
source venv/bin/activate

echo "   Installing Python dependencies..."
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
    cp .env.example .env
    echo ""
    echo "⚠️  IMPORTANT: Please add your Hugging Face API key to ai_service/.env"
    echo "   Get your key from: https://huggingface.co/settings/tokens"
    echo ""
    read -p "Press Enter after you've added your API key to continue..."
fi

deactivate
cd ..

echo "✅ AI Service setup complete!"
echo ""

# Setup Backend
echo "2️⃣  Setting up Backend (Node.js/Express)..."
cd backend

echo "   Installing Node.js dependencies..."
npm install --silent

if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
    cp .env.example .env
fi

cd ..

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "3️⃣  Setting up Frontend (React)..."
cd frontend

echo "   Installing React dependencies (this may take a minute)..."
npm install --silent

if [ ! -f ".env" ]; then
    echo "   Creating .env file..."
    cp .env.example .env
fi

cd ..

echo "✅ Frontend setup complete!"
echo ""

# Summary
echo "=========================================="
echo "✨ Setup Complete!"
echo "=========================================="
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Make sure you added your Hugging Face API key to:"
echo "   ai_service/.env"
echo ""
echo "2. Open 3 terminal windows and run:"
echo ""
echo "   Terminal 1 (AI Service):"
echo "   cd ai_service"
echo "   source venv/bin/activate"
echo "   python ai_service.py"
echo ""
echo "   Terminal 2 (Backend):"
echo "   cd backend"
echo "   npm start"
echo ""
echo "   Terminal 3 (Frontend):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see SETUP_GUIDE.md"
echo ""
echo "Happy analyzing! 🚀"
