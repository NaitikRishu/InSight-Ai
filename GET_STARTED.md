# 🚀 Get Started in 5 Minutes

The fastest way to get your YouTube Channel Analyzer up and running.

---

## ⚡ Quick Setup

### 1. Get Your Hugging Face API Key (2 minutes)

1. Go to https://huggingface.co/settings/tokens
2. Click **"New token"**
3. Name it "YouTube Analyzer"
4. Click **"Create"**
5. **Copy the token** (starts with `hf_`)

---

### 2. Set Up AI Service (1 minute)

```bash
cd ai_service
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

**Edit `ai_service/.env` and paste your API key:**
```
HUGGINGFACE_API_KEY=hf_paste_your_key_here
AI_SERVICE_PORT=5002
```

---

### 3. Set Up Backend (1 minute)

```bash
cd ../backend
npm install
cp .env.example .env
```

---

### 4. Set Up Frontend (1 minute)

```bash
cd ../frontend
npm install
cp .env.example .env
```

---

## 🎬 Run the Application

Open **3 terminal windows** and run:

### Terminal 1: AI Service
```bash
cd ai_service
source venv/bin/activate  # On Windows: venv\Scripts\activate
python ai_service.py
```

### Terminal 2: Backend
```bash
cd backend
npm start
```

### Terminal 3: Frontend
```bash
cd frontend
npm start
```

---

## ✅ Test It

1. Browser should open automatically at **http://localhost:3000**
2. Enter a YouTube channel URL: `https://youtube.com/@mkbhd`
3. Click **"Analyze"** or press **Enter**
4. Wait 30-60 seconds
5. See results! 🎉

---

## 📚 What's Next?

- **Customize**: Edit `frontend/src/App.js` to change the UI
- **Learn**: Read `ARCHITECTURE.md` to understand how it works
- **Troubleshoot**: Check `TROUBLESHOOTING.md` if you have issues
- **Deploy**: Follow deployment guides to put it online

---

## 🆘 Having Issues?

**Most common problems:**

1. **"HUGGINGFACE_API_KEY not found"**
   - Make sure you created `.env` in `ai_service/`
   - Verify your API key is correct

2. **"Cannot connect to server"**
   - Make sure all 3 services are running
   - Check you have 3 terminal windows open

3. **"Port already in use"**
   - Something else is using ports 3000, 5001, or 5002
   - Close other apps or change ports in `.env` files

See **TROUBLESHOOTING.md** for more help!

---

## 🎯 What You Built

✨ **A complete three-tier microservices application:**

- **Frontend**: Modern React app with Tailwind CSS
- **Backend**: Node.js server with Puppeteer web scraping
- **AI Service**: Python Flask API with Hugging Face Ling-1

**Technologies Used:**
- React 18
- Node.js + Express
- Python + Flask
- Puppeteer (headless Chrome)
- Hugging Face AI (Ling-1 model)
- Tailwind CSS

---

**Ready to analyze YouTube channels! 🚀**

For detailed documentation, see [README.md](README.md)
