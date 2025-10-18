# AI Service - YouTube Channel Analyzer

Python Flask service that generates content strategy recommendations using Hugging Face's Ling-1 model.

## Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env and add your Hugging Face API key from https://huggingface.co/settings/tokens
```

4. Run the service:
```bash
python ai_service.py
```

The service will start on port 5002 (configurable via AI_SERVICE_PORT).

## API Endpoints

### Health Check
```
GET /health
```

### Analyze Channel
```
POST /api/analyze
Content-Type: application/json

{
  "scrapedData": {
    "channel": {
      "name": "Channel Name",
      "subscribers": "1.2M subscribers"
    },
    "videos": [
      {
        "title": "Video Title",
        "views": "45K"
      }
    ]
  }
}
```

## Model Information

- **Model**: inclusionAI/Ling-1T
- **Provider**: featherless-ai
- **Purpose**: Generate intelligent content strategy recommendations
- **Output**: 5 numbered recommendations covering content themes, titles, frequency, engagement, and growth
