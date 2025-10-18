# Backend Service - YouTube Channel Analyzer

Node.js Express service that orchestrates YouTube scraping and AI analysis.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env if you need to change ports
```

3. Run the service:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The service will start on port 5001 (configurable via BACKEND_PORT).

## API Endpoints

### Health Check
```
GET /health
```

### Analyze YouTube Channel
```
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
  "suggestions": "AI-generated recommendations..."
}
```

## Features

- **YouTube Scraping**: Uses Puppeteer to extract channel data
- **Data Extraction**: Channel name, subscriber count, up to 15 recent videos
- **AI Integration**: Sends scraped data to AI service for analysis
- **Error Handling**: Graceful fallbacks if AI service is unavailable
- **Timeout Protection**: 60-second timeout for scraping operations

## Dependencies

- **express**: Web framework
- **puppeteer**: Headless browser for scraping
- **axios**: HTTP client for AI service communication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variable management
