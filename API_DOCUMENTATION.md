# 📡 API Documentation

Complete API reference for all services in the YouTube Channel Analyzer.

---

## Overview

The system consists of three services with REST APIs:

1. **Frontend** (Port 3000) - User interface, no API
2. **Backend** (Port 5001) - Orchestration and scraping
3. **AI Service** (Port 5002) - Content strategy generation

---

## Backend API (Port 5001)

Base URL: `http://localhost:5001`

### Health Check

Check if the backend service is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "Backend Service",
  "port": 5001
}
```

**Status Codes:**
- `200 OK` - Service is healthy

**Example:**
```bash
curl http://localhost:5001/health
```

---

### Analyze YouTube Channel

Scrape a YouTube channel and get AI-powered content recommendations.

**Endpoint:** `POST /api/analyze`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "url": "https://youtube.com/@channelname"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| url | string | Yes | Full YouTube channel URL |

**Valid URL Formats:**
- `https://youtube.com/@channelname`
- `https://www.youtube.com/@channelname`
- `http://youtube.com/@channelname`

**Success Response (200 OK):**
```json
{
  "success": true,
  "channel": {
    "name": "Marques Brownlee",
    "subscribers": "18.1M subscribers"
  },
  "videos": [
    {
      "title": "iPhone 15 Pro Review: The Titanium Difference!",
      "views": "4.2M"
    },
    {
      "title": "Tesla Cybertruck: A Closer Look!",
      "views": "3.8M"
    }
    // ... up to 15 videos
  ],
  "suggestions": "1. Focus on tech reviews and unboxing content...\n2. Maintain consistent upload schedule...\n3. Leverage trending tech topics...\n4. Optimize thumbnails with product close-ups...\n5. Engage with comments within first 24 hours..."
}
```

**Success Response with Warning (200 OK):**
```json
{
  "success": true,
  "channel": { ... },
  "videos": [ ... ],
  "suggestions": "AI analysis temporarily unavailable. Please try again later.",
  "warning": "AI service error"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "YouTube URL is required"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Invalid YouTube URL format"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Could not extract channel data. Please check the URL and try again."
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "Failed to scrape YouTube channel: Navigation timeout"
}
```

**Status Codes:**
- `200 OK` - Analysis successful
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - Server error

**Timing:**
- Average response time: 30-60 seconds
- Timeout: 60 seconds for scraping + 30 seconds for AI

**Example:**
```bash
curl -X POST http://localhost:5001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/@mkbhd"}'
```

**JavaScript Example:**
```javascript
const response = await fetch('http://localhost:5001/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://youtube.com/@mkbhd'
  })
});

const data = await response.json();
console.log(data);
```

**Python Example:**
```python
import requests

response = requests.post(
    'http://localhost:5001/api/analyze',
    json={'url': 'https://youtube.com/@mkbhd'}
)

data = response.json()
print(data)
```

---

## AI Service API (Port 5002)

Base URL: `http://localhost:5002`

### Health Check

Check if the AI service is running and configured.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "AI Service",
  "model": "inclusionAI/Ling-1T"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

**Example:**
```bash
curl http://localhost:5002/health
```

---

### Analyze Channel Data

Generate content strategy recommendations from scraped YouTube data.

**Endpoint:** `POST /api/analyze`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "scrapedData": {
    "channel": {
      "name": "Marques Brownlee",
      "subscribers": "18.1M subscribers"
    },
    "videos": [
      {
        "title": "iPhone 15 Pro Review: The Titanium Difference!",
        "views": "4.2M"
      },
      {
        "title": "Tesla Cybertruck: A Closer Look!",
        "views": "3.8M"
      }
      // ... more videos
    ]
  }
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| scrapedData | object | Yes | Scraped channel data |
| scrapedData.channel | object | Yes | Channel information |
| scrapedData.channel.name | string | Yes | Channel name |
| scrapedData.channel.subscribers | string | Yes | Subscriber count |
| scrapedData.videos | array | Yes | Array of video objects |
| scrapedData.videos[].title | string | Yes | Video title |
| scrapedData.videos[].views | string | Yes | View count |

**Success Response (200 OK):**
```json
{
  "success": true,
  "suggestions": "1. Focus on in-depth tech reviews and first impressions of flagship devices, as these consistently generate high view counts (3-4M views).\n\n2. Optimize video titles to include specific product names and key features (e.g., 'iPhone 15 Pro', 'Titanium') to improve searchability and click-through rates.\n\n3. Maintain a consistent upload schedule of 2-3 videos per week to keep audience engaged while ensuring high production quality.\n\n4. Leverage trending tech topics and product launches within 24-48 hours to capitalize on search traffic and audience interest.\n\n5. Create thumbnail designs featuring close-up product shots with bold text overlays to stand out in YouTube's recommendation algorithm."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Missing scrapedData in request"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "success": false,
  "error": "AI model error: 401 Unauthorized"
}
```

**Status Codes:**
- `200 OK` - Analysis successful
- `400 Bad Request` - Invalid input
- `500 Internal Server Error` - AI model error

**Timing:**
- Average response time: 5-15 seconds
- Timeout: 30 seconds

**Example:**
```bash
curl -X POST http://localhost:5002/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "scrapedData": {
      "channel": {
        "name": "Test Channel",
        "subscribers": "100K subscribers"
      },
      "videos": [
        {
          "title": "My First Video",
          "views": "1K"
        }
      ]
    }
  }'
```

**Python Example:**
```python
import requests

response = requests.post(
    'http://localhost:5002/api/analyze',
    json={
        'scrapedData': {
            'channel': {
                'name': 'Test Channel',
                'subscribers': '100K subscribers'
            },
            'videos': [
                {
                    'title': 'My First Video',
                    'views': '1K'
                }
            ]
        }
    }
)

data = response.json()
print(data['suggestions'])
```

---

## Error Codes Reference

### Backend Errors

| Code | Error | Description | Solution |
|------|-------|-------------|----------|
| 400 | YouTube URL is required | Missing URL in request | Include `url` field |
| 400 | Invalid YouTube URL format | URL doesn't match YouTube pattern | Use format: `https://youtube.com/@channel` |
| 400 | Could not extract channel data | Scraping failed | Check URL, channel might be private |
| 500 | Failed to scrape YouTube channel | Puppeteer error | Check logs, might be timeout |
| 500 | AI service error | AI service unreachable | Ensure AI service is running |

### AI Service Errors

| Code | Error | Description | Solution |
|------|-------|-------------|----------|
| 400 | Missing scrapedData in request | Request body missing data | Include `scrapedData` object |
| 500 | AI model error: 401 Unauthorized | Invalid API key | Check HUGGINGFACE_API_KEY |
| 500 | AI model error: 429 Too Many Requests | Rate limit exceeded | Wait before retrying |
| 500 | AI model error: 500 Internal Server Error | Hugging Face API down | Try again later |

---

## Rate Limiting

**Current Implementation:**
- No rate limiting implemented
- Limited by Hugging Face API quotas

**Recommended for Production:**
```javascript
// Example rate limiting with express-rate-limit
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});

app.use('/api/analyze', limiter);
```

---

## CORS Configuration

**Current Configuration:**
```javascript
// Backend allows all origins (development only)
app.use(cors());
```

**Production Configuration:**
```javascript
// Restrict to specific origins
app.use(cors({
  origin: [
    'https://your-frontend-domain.com',
    'https://www.your-frontend-domain.com'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));
```

---

## Authentication

**Current Implementation:**
- No authentication required
- Open API for development

**Recommended for Production:**
```javascript
// Example API key authentication
const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }
  
  next();
};

app.post('/api/analyze', authenticateApiKey, async (req, res) => {
  // ... handler
});
```

---

## Webhooks (Future Feature)

**Proposed Endpoint:** `POST /api/webhook`

**Use Case:**
- Notify when analysis is complete
- Useful for long-running analyses

**Example Request:**
```json
{
  "url": "https://youtube.com/@channel",
  "callbackUrl": "https://your-app.com/webhook/analysis-complete"
}
```

**Example Callback:**
```json
{
  "success": true,
  "channel": { ... },
  "videos": [ ... ],
  "suggestions": "..."
}
```

---

## SDK Examples

### JavaScript/TypeScript SDK

```typescript
class YouTubeAnalyzerClient {
  constructor(private baseUrl: string = 'http://localhost:5001') {}

  async analyzeChannel(url: string) {
    const response = await fetch(`${this.baseUrl}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }

    return response.json();
  }

  async healthCheck() {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }
}

// Usage
const client = new YouTubeAnalyzerClient();
const result = await client.analyzeChannel('https://youtube.com/@mkbhd');
console.log(result.suggestions);
```

### Python SDK

```python
import requests
from typing import Dict, Any

class YouTubeAnalyzerClient:
    def __init__(self, base_url: str = 'http://localhost:5001'):
        self.base_url = base_url
    
    def analyze_channel(self, url: str) -> Dict[str, Any]:
        response = requests.post(
            f'{self.base_url}/api/analyze',
            json={'url': url}
        )
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> Dict[str, Any]:
        response = requests.get(f'{self.base_url}/health')
        return response.json()

# Usage
client = YouTubeAnalyzerClient()
result = client.analyze_channel('https://youtube.com/@mkbhd')
print(result['suggestions'])
```

---

## Testing

### Health Check Tests

```bash
# Test backend health
curl http://localhost:5001/health

# Test AI service health
curl http://localhost:5002/health
```

### Integration Tests

```bash
# Full flow test
curl -X POST http://localhost:5001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://youtube.com/@mkbhd"}' \
  | jq .
```

### Load Testing (with Apache Bench)

```bash
# Test 10 requests, 2 concurrent
ab -n 10 -c 2 -p request.json -T application/json \
  http://localhost:5001/api/analyze
```

---

## Monitoring

**Recommended Metrics:**
- Request count per endpoint
- Average response time
- Error rate
- Scraping success rate
- AI service availability

**Example with Prometheus:**
```javascript
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to track metrics
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  next();
});
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Basic scraping and AI analysis
- No authentication
- No rate limiting

### Future Versions
- v1.1.0: Add authentication
- v1.2.0: Add rate limiting
- v1.3.0: Add webhook support
- v2.0.0: Add batch analysis endpoint

---

For more information, see the main [README.md](README.md) or [ARCHITECTURE.md](ARCHITECTURE.md).
