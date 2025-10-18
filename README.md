# 🎥 YouTube Channel Analyzer

A full-stack YouTube content analysis tool that scrapes YouTube channel data and provides AI-powered content strategy recommendations using Hugging Face's Ling-1 model.

## 🏗️ Architecture

Three independent microservices:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Frontend  │─────▶│   Backend   │─────▶│ AI Service  │
│  (React)    │      │  (Node.js)  │      │  (Python)   │
│  Port 3000  │      │  Port 5001  │      │  Port 5002  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Services

1. **Frontend** (React + Tailwind CSS)
   - Modern gradient-based UI with dark theme
   - Real-time loading states
   - Display channel info and videos
   - Show AI-generated recommendations

2. **Backend** (Node.js + Express + Puppeteer)
   - YouTube scraping with headless browser
   - Extract channel name, subscribers, videos
   - Orchestrate AI service calls
   - Error handling and timeouts

3. **AI Service** (Python + Flask + Hugging Face)
   - Generate content strategy using Ling-1 model
   - Analyze video performance patterns
   - Return 5 actionable recommendations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- Hugging Face API key ([Get one here](https://huggingface.co/settings/tokens))

### Installation

**1. Clone and navigate to project:**
```bash
cd insights-ai
```

**2. Set up AI Service:**
```bash
cd ai_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env and add your HUGGINGFACE_API_KEY
```

**3. Set up Backend:**
```bash
cd ../backend
npm install
cp .env.example .env
# Optionally edit .env to change ports
```

**4. Set up Frontend:**
```bash
cd ../frontend
npm install
cp .env.example .env
# Optionally edit .env if backend is not on localhost:5001
```

### Running the Application

**Terminal 1 - AI Service:**
```bash
cd ai_service
source venv/bin/activate  # On Windows: venv\Scripts\activate
python ai_service.py
```

**Terminal 2 - Backend:**
```bash
cd backend
npm start
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

Open http://localhost:3000 in your browser!

## 📊 Data Flow

```
User enters YouTube URL
         ↓
Frontend sends to Backend
         ↓
Backend scrapes YouTube with Puppeteer
  • Channel name
  • Subscriber count
  • 15 recent videos (titles + views)
         ↓
Backend sends scraped data to AI Service
         ↓
AI Service calls Hugging Face Ling-1
  • Model: inclusionAI/Ling-1T
  • Provider: featherless-ai
  • Generates 5 content strategies
         ↓
Backend combines everything
         ↓
Frontend displays results
```

## 🔧 Technology Stack

| Service | Technologies |
|---------|-------------|
| **Frontend** | React 18, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | Express, Puppeteer, Axios, CORS, dotenv |
| **AI Service** | Flask, Hugging Face Hub, python-dotenv |

## 🌐 API Endpoints

### Backend (Port 5001)

**Analyze Channel:**
```http
POST /api/analyze
Content-Type: application/json

{
  "url": "https://youtube.com/@channelname"
}
```

**Response:**
```json
{
  "success": true,
  "channel": {
    "name": "Channel Name",
    "subscribers": "1.2M subscribers"
  },
  "videos": [
    {
      "title": "Video Title",
      "views": "45K"
    }
  ],
  "suggestions": "1. Focus on...\n2. Test A/B..."
}
```

### AI Service (Port 5002)

**Analyze Data:**
```http
POST /api/analyze
Content-Type: application/json

{
  "scrapedData": {
    "channel": { ... },
    "videos": [ ... ]
  }
}
```

## 🎯 Features

✅ **Real YouTube Scraping** - Uses Puppeteer for authentic data  
✅ **AI-Powered Insights** - Hugging Face Ling-1 model analysis  
✅ **Modern UI** - Gradient design with glassmorphism  
✅ **Error Handling** - Graceful fallbacks and user-friendly messages  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Independent Services** - Easy to modify and scale  
✅ **Timeout Protection** - Prevents hanging requests  
✅ **CORS Enabled** - Secure cross-origin communication  

## 🔐 Environment Variables

### AI Service (.env)
```env
HUGGINGFACE_API_KEY=hf_your_token_here
AI_SERVICE_PORT=5002
```

### Backend (.env)
```env
BACKEND_PORT=5001
AI_SERVICE_URL=http://localhost:5002
```

### Frontend (.env)
```env
REACT_APP_BACKEND_URL=http://localhost:5001
```

## 📝 Use Cases

- **Content Creators**: Analyze your channel for optimization opportunities
- **Marketing Agencies**: Audit client channels for strategy insights
- **YouTube Researchers**: Study channel performance patterns
- **Business Intelligence**: Benchmark competitor channels

## 🛠️ Development

### Backend Development Mode
```bash
cd backend
npm install -g nodemon
npm run dev
```

### Frontend Development
```bash
cd frontend
npm start
```

### AI Service Development
```bash
cd ai_service
source venv/bin/activate
python ai_service.py
```

## 📦 Project Structure

```
insights-ai/
├── ai_service/
│   ├── ai_service.py          # Flask app with HF Ling-1
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # AI service docs
├── backend/
│   ├── server.js             # Express server with Puppeteer
│   ├── package.json          # Node dependencies
│   ├── .env.example          # Environment template
│   └── README.md             # Backend docs
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React component
│   │   ├── index.js          # React entry point
│   │   └── index.css         # Tailwind imports
│   ├── public/
│   │   └── index.html        # HTML template
│   ├── package.json          # React dependencies
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── .env.example          # Environment template
│   └── README.md             # Frontend docs
└── README.md                 # This file
```

## 🔍 Troubleshooting

### Backend can't scrape YouTube
- Ensure Puppeteer is installed correctly
- Check if YouTube URL format is valid
- Try increasing timeout in server.js

### AI Service errors
- Verify HUGGINGFACE_API_KEY is set correctly
- Check if you have API quota remaining
- Ensure Flask is running on port 5002

### Frontend can't connect
- Verify backend is running on port 5001
- Check REACT_APP_BACKEND_URL in .env
- Ensure CORS is enabled in backend

### Port conflicts
- Change ports in respective .env files
- Update cross-service URLs accordingly

## 🚀 Future Enhancements

- [ ] Add video thumbnail display
- [ ] Support for competitor comparison
- [ ] Historical trend analysis
- [ ] Export reports to PDF
- [ ] Authentication and user accounts
- [ ] Database for storing analysis history
- [ ] Batch analysis for multiple channels
- [ ] Advanced filtering and sorting

## 📄 License

MIT License - Feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on the repository.

---

**Built with ❤️ using React, Node.js, Python, and Hugging Face Ling-1**
