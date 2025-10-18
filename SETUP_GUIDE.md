# 📖 Complete Setup Guide

Step-by-step instructions to get your YouTube Channel Analyzer running.

## 🎯 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js** installed (v14 or higher)
  - Check: `node --version`
  - Download: https://nodejs.org/

- [ ] **Python** installed (v3.8 or higher)
  - Check: `python --version` or `python3 --version`
  - Download: https://www.python.org/downloads/

- [ ] **Hugging Face Account** with API key
  - Sign up: https://huggingface.co/join
  - Get API key: https://huggingface.co/settings/tokens

## 🚀 Installation Steps

### Step 1: AI Service Setup (Python/Flask)

```bash
# Navigate to AI service directory
cd ai_service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env file and add your Hugging Face API key
# Use your favorite text editor (nano, vim, VSCode, etc.)
nano .env
```

**In the .env file, add:**
```
HUGGINGFACE_API_KEY=hf_your_actual_token_here
AI_SERVICE_PORT=5002
```

**Test the AI service:**
```bash
python ai_service.py
```

You should see:
```
🤖 AI Service starting on port 5002
📊 Using model: inclusionAI/Ling-1T
🔑 API Key configured: Yes
```

Keep this terminal open!

---

### Step 2: Backend Service Setup (Node.js/Express)

**Open a NEW terminal window/tab**

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# (Optional) Edit .env if you need different ports
nano .env
```

**Default .env values (usually no changes needed):**
```
BACKEND_PORT=5001
AI_SERVICE_URL=http://localhost:5002
```

**Test the backend:**
```bash
npm start
```

You should see:
```
🚀 Backend server running on port 5001
🔗 AI Service URL: http://localhost:5002
📡 Ready to accept requests at http://localhost:5001/api/analyze
```

Keep this terminal open!

---

### Step 3: Frontend Setup (React)

**Open a NEW terminal window/tab (you should now have 3 terminals)**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# (Optional) Edit .env if backend is not on localhost:5001
nano .env
```

**Default .env value (usually no changes needed):**
```
REACT_APP_BACKEND_URL=http://localhost:5001
```

**Start the frontend:**
```bash
npm start
```

The app should automatically open in your browser at http://localhost:3000

---

## ✅ Verification

You should now have 3 terminals running:

1. **Terminal 1**: AI Service (Python) on port 5002
2. **Terminal 2**: Backend (Node.js) on port 5001
3. **Terminal 3**: Frontend (React) on port 3000

### Quick Test

1. Open http://localhost:3000 in your browser
2. Enter a YouTube channel URL (e.g., `https://youtube.com/@mkbhd`)
3. Click "Analyze" or press Enter
4. Wait 30-60 seconds for results

You should see:
- Channel name and subscriber count
- Grid of recent videos with view counts
- AI-generated content strategy recommendations

---

## 🔧 Common Issues & Solutions

### Issue: "HUGGINGFACE_API_KEY not found"

**Solution:**
- Make sure you created the `.env` file in `ai_service/`
- Verify the API key is correct (starts with `hf_`)
- Restart the AI service after adding the key

### Issue: "Cannot connect to server"

**Solution:**
- Verify all three services are running
- Check that ports 3000, 5001, and 5002 are not in use by other apps
- Ensure `.env` files have correct URLs

### Issue: "Puppeteer installation failed"

**Solution:**
```bash
cd backend
npm install puppeteer --unsafe-perm=true --allow-root
```

### Issue: "Port already in use"

**Solution:**
Change the port in the respective `.env` file:
- Frontend: Edit `frontend/.env` → `REACT_APP_BACKEND_URL`
- Backend: Edit `backend/.env` → `BACKEND_PORT`
- AI Service: Edit `ai_service/.env` → `AI_SERVICE_PORT`

### Issue: Python virtual environment issues

**Solution:**
```bash
# Remove old venv
rm -rf venv

# Create fresh venv
python -m venv venv

# Activate and reinstall
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install --upgrade pip
pip install -r requirements.txt
```

---

## 🎓 Understanding the Flow

1. **User enters URL** in React frontend
2. **Frontend sends POST** to `http://localhost:5001/api/analyze`
3. **Backend scrapes YouTube** using Puppeteer
4. **Backend sends data** to `http://localhost:5002/api/analyze`
5. **AI Service calls Hugging Face** Ling-1 model
6. **AI Service returns** recommendations
7. **Backend combines** scraped data + AI suggestions
8. **Frontend displays** beautiful results

---

## 📝 Next Steps

Once everything is working:

1. **Try different channels** to see various recommendations
2. **Customize the UI** in `frontend/src/App.js`
3. **Modify AI prompts** in `ai_service/ai_service.py`
4. **Add features** like video thumbnails or export functionality
5. **Deploy to production** (see deployment guides for each service)

---

## 🆘 Still Having Issues?

1. Check all three services are running (3 terminal windows)
2. Verify `.env` files exist in all three directories
3. Ensure Hugging Face API key is valid
4. Check browser console for frontend errors (F12)
5. Check terminal logs for backend/AI service errors
6. Try a simple YouTube channel URL first

---

## 🎉 Success!

If you can analyze a YouTube channel and see AI recommendations, congratulations! You've successfully set up a three-tier microservices application with:

- ✅ React frontend
- ✅ Node.js backend with web scraping
- ✅ Python AI service with Hugging Face
- ✅ Full data flow between all services

Happy analyzing! 🚀
