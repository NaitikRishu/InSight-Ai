# 📁 Project Structure

Complete file and directory structure of the YouTube Channel Analyzer.

```
insights-ai/
│
├── 📄 README.md                    # Main project documentation
├── 📄 GET_STARTED.md               # Quick start guide (5 minutes)
├── 📄 SETUP_GUIDE.md               # Detailed setup instructions
├── 📄 ARCHITECTURE.md              # Technical architecture details
├── 📄 API_DOCUMENTATION.md         # Complete API reference
├── 📄 TROUBLESHOOTING.md           # Common issues and solutions
├── 📄 PROJECT_CHECKLIST.md         # Step-by-step checklist
├── 📄 PROJECT_STRUCTURE.md         # This file
├── 🔧 QUICK_START.sh               # Automated setup script
├── 📄 .gitignore                   # Git ignore rules
│
├── 🤖 ai_service/                  # Python/Flask AI Service (Port 5002)
│   ├── 📄 ai_service.py            # Main Flask application
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .env                     # Environment variables (create this)
│   ├── 📄 .gitignore               # Git ignore for Python
│   ├── 📄 README.md                # AI service documentation
│   └── 📁 venv/                    # Virtual environment (created on setup)
│
├── 🔧 backend/                     # Node.js/Express Backend (Port 5001)
│   ├── 📄 server.js                # Main Express server
│   ├── 📄 package.json             # Node dependencies
│   ├── 📄 package-lock.json        # Dependency lock file (auto-generated)
│   ├── 📄 .env.example             # Environment template
│   ├── 📄 .env                     # Environment variables (create this)
│   ├── 📄 .gitignore               # Git ignore for Node
│   ├── 📄 README.md                # Backend documentation
│   └── 📁 node_modules/            # Dependencies (created on npm install)
│
└── 🎨 frontend/                    # React Frontend (Port 3000)
    ├── 📁 public/                  # Static files
    │   └── 📄 index.html           # HTML template
    │
    ├── 📁 src/                     # Source code
    │   ├── 📄 App.js               # Main React component
    │   ├── 📄 index.js             # React entry point
    │   └── 📄 index.css            # Tailwind CSS imports
    │
    ├── 📄 package.json             # React dependencies
    ├── 📄 package-lock.json        # Dependency lock file (auto-generated)
    ├── 📄 tailwind.config.js       # Tailwind configuration
    ├── 📄 postcss.config.js        # PostCSS configuration
    ├── 📄 .env.example             # Environment template
    ├── 📄 .env                     # Environment variables (create this)
    ├── 📄 .gitignore               # Git ignore for React
    ├── 📄 README.md                # Frontend documentation
    ├── 📁 node_modules/            # Dependencies (created on npm install)
    └── 📁 build/                   # Production build (created on npm run build)
```

---

## 📊 File Count Summary

| Category | Count |
|----------|-------|
| **Documentation** | 8 files |
| **AI Service** | 4 source files |
| **Backend** | 3 source files |
| **Frontend** | 6 source files |
| **Configuration** | 9 files (.env, .gitignore, configs) |
| **Total** | ~30 files (excluding node_modules, venv) |

---

## 🔑 Key Files Explained

### Root Level

- **README.md** - Start here! Complete project overview
- **GET_STARTED.md** - Fastest way to get running (5 min)
- **SETUP_GUIDE.md** - Step-by-step setup instructions
- **ARCHITECTURE.md** - Deep dive into system design
- **API_DOCUMENTATION.md** - API endpoints and examples
- **TROUBLESHOOTING.md** - Solutions to common problems
- **PROJECT_CHECKLIST.md** - Verify everything works
- **QUICK_START.sh** - Automated setup script (run with `./QUICK_START.sh`)

### AI Service (`ai_service/`)

- **ai_service.py** - Flask server with Hugging Face integration
  - Receives scraped data from backend
  - Calls Ling-1 model via Hugging Face API
  - Returns content strategy recommendations
  
- **requirements.txt** - Python packages needed:
  - `flask` - Web framework
  - `flask-cors` - CORS support
  - `python-dotenv` - Environment variables
  - `huggingface-hub` - Hugging Face API client

- **.env** - Configuration (YOU CREATE THIS):
  ```
  HUGGINGFACE_API_KEY=hf_your_key_here
  AI_SERVICE_PORT=5002
  ```

### Backend (`backend/`)

- **server.js** - Express server with Puppeteer scraping
  - Receives YouTube URLs from frontend
  - Launches headless Chrome to scrape channel data
  - Sends data to AI service
  - Returns combined results to frontend
  
- **package.json** - Node packages needed:
  - `express` - Web framework
  - `puppeteer` - Headless browser automation
  - `axios` - HTTP client
  - `cors` - CORS support
  - `dotenv` - Environment variables

- **.env** - Configuration (YOU CREATE THIS):
  ```
  BACKEND_PORT=5001
  AI_SERVICE_URL=http://localhost:5002
  ```

### Frontend (`frontend/`)

- **src/App.js** - Main React component
  - Input form for YouTube URLs
  - Loading states and animations
  - Results display (channel, videos, AI suggestions)
  - Error handling UI
  
- **src/index.js** - React entry point
  - Renders App component into DOM
  
- **src/index.css** - Tailwind CSS imports
  - `@tailwind base;`
  - `@tailwind components;`
  - `@tailwind utilities;`
  
- **public/index.html** - HTML template
  - Single `<div id="root">` for React
  
- **tailwind.config.js** - Tailwind customization
  - Custom color palette
  - Content paths for purging
  
- **package.json** - React packages needed:
  - `react` - React library
  - `react-dom` - React DOM rendering
  - `react-scripts` - Create React App scripts
  - `tailwindcss` - CSS framework
  - `lucide-react` - Icon library
  - `axios` - HTTP client

- **.env** - Configuration (YOU CREATE THIS):
  ```
  REACT_APP_BACKEND_URL=http://localhost:5001
  ```

---

## 📦 Generated Directories

These are created automatically during setup:

### `ai_service/venv/`
- Python virtual environment
- Created with: `python3 -m venv venv`
- Contains isolated Python packages
- **Size**: ~50-100 MB

### `backend/node_modules/`
- Node.js dependencies
- Created with: `npm install`
- Contains all npm packages
- **Size**: ~200-300 MB (Puppeteer includes Chromium)

### `frontend/node_modules/`
- React dependencies
- Created with: `npm install`
- Contains all npm packages
- **Size**: ~300-400 MB

### `frontend/build/`
- Production build output
- Created with: `npm run build`
- Optimized static files for deployment
- **Size**: ~2-5 MB

---

## 🚫 Files NOT in Git

These files are ignored by `.gitignore`:

- `.env` files (contain secrets)
- `node_modules/` (too large, reinstall with `npm install`)
- `venv/` (too large, recreate with `python -m venv venv`)
- `build/` (generated, rebuild with `npm run build`)
- `*.log` files (temporary)
- `.DS_Store` (macOS system files)
- `__pycache__/` (Python cache)

---

## 📝 Files You Need to Create

After cloning/downloading, create these:

1. **ai_service/.env**
   ```bash
   cd ai_service
   cp .env.example .env
   # Edit and add your Hugging Face API key
   ```

2. **backend/.env**
   ```bash
   cd backend
   cp .env.example .env
   # Usually no changes needed
   ```

3. **frontend/.env**
   ```bash
   cd frontend
   cp .env.example .env
   # Usually no changes needed
   ```

---

## 🔄 Workflow: How Files Interact

```
User enters URL in browser
         ↓
    frontend/src/App.js
         ↓
    POST to backend/server.js
         ↓
    Puppeteer scrapes YouTube
         ↓
    POST to ai_service/ai_service.py
         ↓
    Calls Hugging Face API
         ↓
    Returns to backend/server.js
         ↓
    Returns to frontend/src/App.js
         ↓
    Displays in browser
```

---

## 📏 Code Statistics

Approximate lines of code:

| File | Lines | Purpose |
|------|-------|---------|
| `ai_service/ai_service.py` | ~120 | AI service logic |
| `backend/server.js` | ~180 | Backend + scraping |
| `frontend/src/App.js` | ~280 | React UI component |
| **Total Code** | ~580 | Core application |
| **Total Docs** | ~3000+ | Documentation |

---

## 🎯 Essential Files to Understand

To understand how the system works, read these in order:

1. **README.md** - Overview
2. **frontend/src/App.js** - User interface
3. **backend/server.js** - Scraping logic
4. **ai_service/ai_service.py** - AI integration
5. **ARCHITECTURE.md** - How it all fits together

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Tailwind CSS customization |
| `postcss.config.js` | PostCSS plugins (Tailwind) |
| `package.json` | Node dependencies and scripts |
| `requirements.txt` | Python dependencies |
| `.env` | Environment variables (secrets) |
| `.gitignore` | Files to exclude from Git |

---

## 📚 Documentation Files

| File | When to Read |
|------|--------------|
| **GET_STARTED.md** | First time setup (5 min) |
| **README.md** | Project overview |
| **SETUP_GUIDE.md** | Detailed installation |
| **ARCHITECTURE.md** | Understanding design |
| **API_DOCUMENTATION.md** | API integration |
| **TROUBLESHOOTING.md** | When things break |
| **PROJECT_CHECKLIST.md** | Verify everything works |
| **PROJECT_STRUCTURE.md** | This file! |

---

## 🎨 Customization Guide

Want to modify the project? Start here:

### Change UI Colors
- Edit: `frontend/tailwind.config.js`
- Modify the `colors` section

### Change AI Prompt
- Edit: `ai_service/ai_service.py`
- Find the `prompt` variable

### Change Scraping Logic
- Edit: `backend/server.js`
- Find the `scrapeYouTubeChannel` function

### Change Ports
- Edit: `.env` files in each service
- Update URLs to match

### Add New Features
- Frontend: Add to `frontend/src/App.js`
- Backend: Add routes in `backend/server.js`
- AI: Modify `ai_service/ai_service.py`

---

This structure provides a clean, maintainable codebase with clear separation of concerns! 🚀
