# 🏗️ Architecture Documentation

Detailed technical architecture of the YouTube Channel Analyzer.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                    http://localhost:3000                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /api/analyze
                             │ { url: "youtube.com/@channel" }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND SERVICE                            │
│                    React + Tailwind CSS                          │
│                        Port: 3000                                │
├─────────────────────────────────────────────────────────────────┤
│ Components:                                                      │
│  • App.js - Main application component                          │
│  • Input form with validation                                   │
│  • Loading states with animations                               │
│  • Results display (channel + videos + AI)                      │
│  • Error handling UI                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /api/analyze
                             │ { url: "..." }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICE                             │
│                  Node.js + Express + Puppeteer                   │
│                        Port: 5001                                │
├─────────────────────────────────────────────────────────────────┤
│ Functions:                                                       │
│  1. Receive YouTube URL from frontend                           │
│  2. Launch Puppeteer headless browser                           │
│  3. Navigate to YouTube channel                                 │
│  4. Extract channel data:                                       │
│     - Channel name                                              │
│     - Subscriber count                                          │
│     - Up to 15 recent videos (title + views)                   │
│  5. Send scraped data to AI service                            │
│  6. Combine results and return to frontend                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP POST /api/analyze
                             │ { scrapedData: {...} }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AI SERVICE                                 │
│              Python + Flask + Hugging Face                       │
│                        Port: 5002                                │
├─────────────────────────────────────────────────────────────────┤
│ Functions:                                                       │
│  1. Receive scraped channel data                                │
│  2. Format data into structured prompt                          │
│  3. Call Hugging Face API:                                      │
│     - Model: inclusionAI/Ling-1T                               │
│     - Provider: featherless-ai                                  │
│     - Method: chat.completions.create()                        │
│  4. Parse AI response                                           │
│  5. Return 5 content strategy recommendations                   │
└─────────────────────────────────────────────────────────────────┘
                             │
                             │ Response
                             │ { suggestions: "1. ... 2. ..." }
                             ▼
                    [Back to Backend]
                             │
                             │ Combined Response
                             │ { channel, videos, suggestions }
                             ▼
                    [Back to Frontend]
                             │
                             │ Display Results
                             ▼
                    [User sees analysis]
```

---

## Service Details

### 1. Frontend Service

**Technology Stack:**
- React 18.2.0
- Tailwind CSS 3.3.6
- Lucide React (icons)
- Axios (HTTP client)

**Key Files:**
- `src/App.js` - Main component with all UI logic
- `src/index.css` - Tailwind imports
- `tailwind.config.js` - Tailwind configuration
- `package.json` - Dependencies

**State Management:**
```javascript
const [url, setUrl] = useState('');           // User input
const [loading, setLoading] = useState(false); // Loading state
const [result, setResult] = useState(null);   // API response
const [error, setError] = useState(null);     // Error messages
```

**API Communication:**
```javascript
POST http://localhost:5001/api/analyze
Headers: { 'Content-Type': 'application/json' }
Body: { url: "https://youtube.com/@channel" }
Timeout: 90 seconds
```

**UI Components:**
1. Header with branding
2. Input form with validation
3. Loading spinner during analysis
4. Channel info card
5. Videos grid (3 columns)
6. AI suggestions card
7. Error alert messages

---

### 2. Backend Service

**Technology Stack:**
- Express 4.18.2
- Puppeteer 21.6.1 (headless Chrome)
- Axios 1.6.2
- CORS 2.8.5
- dotenv 16.3.1

**Key Files:**
- `server.js` - Main Express server
- `package.json` - Dependencies
- `.env` - Configuration

**Endpoints:**

1. **Health Check**
```javascript
GET /health
Response: { status: 'healthy', service: 'Backend Service', port: 5001 }
```

2. **Analyze Channel**
```javascript
POST /api/analyze
Request: { url: "https://youtube.com/@channel" }
Response: {
  success: true,
  channel: { name: "...", subscribers: "..." },
  videos: [{ title: "...", views: "..." }],
  suggestions: "AI recommendations..."
}
```

**Scraping Process:**

1. **Launch Browser**
```javascript
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

2. **Navigate to Channel**
```javascript
await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
await page.waitForTimeout(3000); // Wait for dynamic content
```

3. **Extract Data**
```javascript
const data = await page.evaluate(() => {
  // DOM manipulation to extract:
  // - Channel name from yt-formatted-string
  // - Subscribers from #subscriber-count
  // - Videos from ytd-rich-item-renderer
});
```

4. **Send to AI Service**
```javascript
const aiResponse = await axios.post(
  'http://localhost:5002/api/analyze',
  { scrapedData: data }
);
```

---

### 3. AI Service

**Technology Stack:**
- Flask 3.0.0
- Hugging Face Hub 0.20.0
- python-dotenv 1.0.0
- flask-cors 4.0.0

**Key Files:**
- `ai_service.py` - Main Flask application
- `requirements.txt` - Python dependencies
- `.env` - API key configuration

**Endpoints:**

1. **Health Check**
```python
GET /health
Response: {
  'status': 'healthy',
  'service': 'AI Service',
  'model': 'inclusionAI/Ling-1T'
}
```

2. **Analyze Data**
```python
POST /api/analyze
Request: {
  'scrapedData': {
    'channel': {...},
    'videos': [...]
  }
}
Response: {
  'success': True,
  'suggestions': "1. ...\n2. ...\n3. ..."
}
```

**AI Processing:**

1. **Initialize Client**
```python
from huggingface_hub import InferenceClient
client = InferenceClient(api_key=HUGGINGFACE_API_KEY)
```

2. **Format Prompt**
```python
prompt = f"""You are a YouTube content strategy expert...
Channel: {channel['name']}
Subscribers: {channel['subscribers']}
Recent Videos:
1. {video['title']} - {video['views']}
...
Provide 5 recommendations..."""
```

3. **Call Hugging Face**
```python
completion = client.chat.completions.create(
    model="inclusionAI/Ling-1T",
    messages=[{"role": "user", "content": prompt}],
    max_tokens=1000,
    temperature=0.7,
    provider={"order": ["featherless-ai"]}
)
```

4. **Extract Response**
```python
suggestions = completion.choices[0].message.content
```

---

## Data Models

### Frontend → Backend
```typescript
{
  url: string  // YouTube channel URL
}
```

### Backend → AI Service
```typescript
{
  scrapedData: {
    channel: {
      name: string,
      subscribers: string
    },
    videos: Array<{
      title: string,
      views: string
    }>
  }
}
```

### AI Service → Backend
```typescript
{
  success: boolean,
  suggestions: string  // Formatted recommendations
}
```

### Backend → Frontend
```typescript
{
  success: boolean,
  channel: {
    name: string,
    subscribers: string
  },
  videos: Array<{
    title: string,
    views: string
  }>,
  suggestions: string,
  warning?: string  // If AI service failed
}
```

---

## Security Considerations

1. **API Key Protection**
   - Hugging Face key stored in `.env` (never committed)
   - Backend never exposes AI service key to frontend

2. **Input Validation**
   - URL format validation before scraping
   - Request body validation in all services

3. **CORS Configuration**
   - Enabled for localhost development
   - Should be restricted in production

4. **Timeout Protection**
   - Frontend: 90s timeout
   - Backend scraping: 60s timeout
   - AI service: 30s timeout

5. **Error Handling**
   - Never expose internal errors to users
   - Graceful degradation if AI service fails
   - Browser cleanup after Puppeteer operations

---

## Performance Considerations

1. **Puppeteer Optimization**
   - Headless mode for faster execution
   - Minimal browser arguments
   - Proper cleanup to prevent memory leaks

2. **AI Service**
   - Uses featherless-ai provider for optimal routing
   - Temperature 0.7 for balanced creativity/consistency
   - Max tokens 1000 to limit response time

3. **Frontend**
   - Lazy loading for better initial load
   - Optimized Tailwind CSS (purge unused)
   - Axios timeout to prevent hanging requests

---

## Scalability

### Current Limitations:
- Single-threaded Puppeteer (one scrape at a time)
- No caching of results
- No rate limiting
- No database for historical data

### Future Improvements:
- Add Redis for caching channel data
- Implement request queuing for concurrent scrapes
- Add PostgreSQL for storing analysis history
- Implement rate limiting per IP
- Add authentication for API access
- Deploy services independently (Docker/Kubernetes)

---

## Deployment Architecture

```
Production Setup:

Frontend → Vercel/Netlify
Backend → Heroku/Railway/DigitalOcean
AI Service → Railway/Render/AWS Lambda

With:
- Environment variables in platform configs
- HTTPS for all services
- CORS restricted to production domains
- Database for caching (Redis/PostgreSQL)
- CDN for frontend assets
- Load balancer for backend
```

---

## Monitoring & Logging

**Current Logging:**
- Console logs in all services
- Request/response logging
- Error stack traces

**Recommended Production Logging:**
- Winston (Node.js) / Python logging
- Centralized logging (Datadog/LogRocket)
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Uptime monitoring (Pingdom)

---

## Testing Strategy

**Unit Tests:**
- Frontend: React Testing Library
- Backend: Jest + Supertest
- AI Service: pytest

**Integration Tests:**
- Test full flow: Frontend → Backend → AI
- Mock Puppeteer for faster tests
- Mock Hugging Face API

**E2E Tests:**
- Playwright/Cypress for full user flows
- Test with real YouTube URLs
- Verify AI response format

---

This architecture provides a solid foundation for a production-ready YouTube analysis tool with clear separation of concerns and room for future enhancements.
