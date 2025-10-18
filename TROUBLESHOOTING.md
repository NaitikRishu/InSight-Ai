# 🔧 Troubleshooting Guide

Common issues and their solutions for the YouTube Channel Analyzer.

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [AI Service Issues](#ai-service-issues)
3. [Backend Issues](#backend-issues)
4. [Frontend Issues](#frontend-issues)
5. [Scraping Issues](#scraping-issues)
6. [Network Issues](#network-issues)
7. [Performance Issues](#performance-issues)

---

## Installation Issues

### Python virtual environment won't create

**Symptoms:**
```
Error: No module named venv
```

**Solution:**
```bash
# On Ubuntu/Debian
sudo apt-get install python3-venv

# On macOS (using Homebrew)
brew install python3

# Then try again
python3 -m venv venv
```

---

### npm install fails with permission errors

**Symptoms:**
```
Error: EACCES: permission denied
```

**Solution:**
```bash
# Don't use sudo! Instead, fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then try again
npm install
```

---

### Puppeteer installation fails

**Symptoms:**
```
Error: Failed to download Chromium
```

**Solution:**
```bash
cd backend

# Try with specific flags
npm install puppeteer --unsafe-perm=true --allow-root

# Or skip Chromium download and use system Chrome
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true npm install puppeteer
```

---

## AI Service Issues

### "HUGGINGFACE_API_KEY not found"

**Symptoms:**
```
WARNING: HUGGINGFACE_API_KEY not found in environment variables
```

**Solution:**
1. Check if `.env` file exists in `ai_service/` directory
2. Verify the file contains:
   ```
   HUGGINGFACE_API_KEY=hf_your_actual_key_here
   ```
3. Make sure there are no spaces around the `=`
4. Restart the AI service

**Get an API key:**
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Give it a name and select "read" permissions
4. Copy the token (starts with `hf_`)

---

### "AI model error: 401 Unauthorized"

**Symptoms:**
```
AI model error: 401 Unauthorized
```

**Solution:**
- Your API key is invalid or expired
- Generate a new key from https://huggingface.co/settings/tokens
- Update `ai_service/.env` with the new key
- Restart the AI service

---

### "AI model error: Rate limit exceeded"

**Symptoms:**
```
AI model error: 429 Too Many Requests
```

**Solution:**
- You've hit Hugging Face's rate limit
- Wait a few minutes before trying again
- Consider upgrading to Hugging Face Pro for higher limits
- Implement caching to reduce API calls

---

### Flask won't start - "Address already in use"

**Symptoms:**
```
OSError: [Errno 48] Address already in use
```

**Solution:**
```bash
# Find what's using port 5002
lsof -i :5002

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change the port in ai_service/.env
AI_SERVICE_PORT=5003
```

---

## Backend Issues

### "Cannot connect to AI service"

**Symptoms:**
```
❌ AI Service error: connect ECONNREFUSED 127.0.0.1:5002
```

**Solution:**
1. Make sure AI service is running:
   ```bash
   cd ai_service
   source venv/bin/activate
   python ai_service.py
   ```
2. Check if it's on the correct port (5002)
3. Verify `backend/.env` has correct `AI_SERVICE_URL`

---

### Express won't start - "Port already in use"

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solution:**
```bash
# Find what's using port 5001
lsof -i :5001

# Kill the process
kill -9 PID

# Or change the port in backend/.env
BACKEND_PORT=5003

# And update frontend/.env
REACT_APP_BACKEND_URL=http://localhost:5003
```

---

### Puppeteer crashes with "Navigation timeout"

**Symptoms:**
```
Error: Navigation timeout of 60000 ms exceeded
```

**Solution:**
1. Increase timeout in `backend/server.js`:
   ```javascript
   await page.goto(url, {
     waitUntil: 'networkidle2',
     timeout: 120000  // Increase to 120 seconds
   });
   ```
2. Check your internet connection
3. Try a different YouTube channel URL
4. YouTube might be blocking automated access - try adding more realistic headers

---

### "Failed to launch browser"

**Symptoms:**
```
Error: Failed to launch the browser process
```

**Solution:**
```bash
# On Linux, install dependencies
sudo apt-get install -y \
  gconf-service libasound2 libatk1.0-0 libc6 libcairo2 \
  libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 \
  libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 \
  libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 \
  libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 \
  libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
  libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation \
  libappindicator1 libnss3 lsb-release xdg-utils wget

# On macOS, reinstall Puppeteer
cd backend
rm -rf node_modules/puppeteer
npm install puppeteer
```

---

## Frontend Issues

### "Cannot connect to backend"

**Symptoms:**
```
Cannot connect to server. Please ensure the backend is running on port 5001.
```

**Solution:**
1. Verify backend is running:
   ```bash
   cd backend
   npm start
   ```
2. Check browser console (F12) for actual error
3. Verify `frontend/.env` has correct backend URL
4. Check CORS is enabled in backend (it should be by default)

---

### React app won't start - "Port 3000 already in use"

**Symptoms:**
```
Something is already running on port 3000
```

**Solution:**
```bash
# Option 1: Kill what's using port 3000
lsof -i :3000
kill -9 PID

# Option 2: Use a different port
# When prompted, press 'Y' to use a different port
# Or set PORT in frontend/.env
PORT=3001
```

---

### Tailwind styles not loading

**Symptoms:**
- App looks unstyled
- No colors or spacing

**Solution:**
```bash
cd frontend

# Reinstall Tailwind
npm install -D tailwindcss postcss autoprefixer

# Regenerate config
npx tailwindcss init -p

# Restart dev server
npm start
```

---

### "Module not found: Can't resolve 'lucide-react'"

**Symptoms:**
```
Module not found: Error: Can't resolve 'lucide-react'
```

**Solution:**
```bash
cd frontend
npm install lucide-react
npm start
```

---

## Scraping Issues

### "Could not extract channel data"

**Symptoms:**
```
Could not extract channel data. Please check the URL and try again.
```

**Solution:**
1. Verify the URL format:
   - ✅ `https://youtube.com/@channelname`
   - ✅ `https://www.youtube.com/@channelname`
   - ❌ `https://youtube.com/c/channelname` (old format)
   
2. Make sure the channel exists and is public

3. Try increasing wait time in `backend/server.js`:
   ```javascript
   await page.waitForTimeout(5000); // Increase from 3000 to 5000
   ```

4. Check if YouTube changed their HTML structure:
   - Open the channel in a browser
   - Inspect element (F12)
   - Verify selectors in `server.js` still match

---

### Getting empty video arrays

**Symptoms:**
- Channel name and subscribers work
- But videos array is empty

**Solution:**
1. The channel might not have any videos
2. YouTube might have changed their video grid structure
3. Update selectors in `backend/server.js`:
   ```javascript
   // Try different selectors
   const videoElements = document.querySelectorAll(
     'ytd-rich-item-renderer, ytd-grid-video-renderer, ytd-video-renderer'
   );
   ```

---

### "YouTube is blocking automated access"

**Symptoms:**
- Captcha appears
- "Unusual traffic" message

**Solution:**
1. Add more realistic headers in `backend/server.js`:
   ```javascript
   await page.setExtraHTTPHeaders({
     'Accept-Language': 'en-US,en;q=0.9',
     'Accept': 'text/html,application/xhtml+xml'
   });
   ```

2. Add random delays:
   ```javascript
   await page.waitForTimeout(Math.random() * 2000 + 3000);
   ```

3. Rotate user agents
4. Use residential proxies (advanced)

---

## Network Issues

### CORS errors in browser console

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify CORS is enabled in `backend/server.js`:
   ```javascript
   const cors = require('cors');
   app.use(cors());
   ```

2. For production, specify allowed origins:
   ```javascript
   app.use(cors({
     origin: 'https://your-frontend-domain.com'
   }));
   ```

---

### Request timeout errors

**Symptoms:**
```
Request timeout. The channel might be too large or the server is busy.
```

**Solution:**
1. Increase frontend timeout in `frontend/src/App.js`:
   ```javascript
   timeout: 120000 // Increase from 90000 to 120000
   ```

2. Increase backend scraping timeout in `backend/server.js`:
   ```javascript
   timeout: 90000 // In axios call to AI service
   ```

3. Check your internet connection speed

---

## Performance Issues

### Scraping is very slow

**Symptoms:**
- Takes more than 60 seconds to scrape

**Solution:**
1. Reduce wait time if possible:
   ```javascript
   await page.waitForTimeout(2000); // Reduce from 3000
   ```

2. Use `waitUntil: 'domcontentloaded'` instead of `'networkidle2'`:
   ```javascript
   await page.goto(url, {
     waitUntil: 'domcontentloaded',
     timeout: 60000
   });
   ```

3. Limit number of videos to scrape:
   ```javascript
   for (let i = 0; i < Math.min(videoElements.length, 10); i++) {
     // Reduce from 15 to 10
   }
   ```

---

### AI responses are slow

**Symptoms:**
- AI service takes 20+ seconds to respond

**Solution:**
1. Reduce `max_tokens` in `ai_service/ai_service.py`:
   ```python
   max_tokens=500  # Reduce from 1000
   ```

2. Increase `temperature` for faster but less precise responses:
   ```python
   temperature=0.9  # Increase from 0.7
   ```

3. Consider using a faster model (though Ling-1 is already optimized)

---

### High memory usage

**Symptoms:**
- System slows down
- Browser crashes

**Solution:**
1. Ensure Puppeteer browsers are being closed:
   ```javascript
   finally {
     if (browser) {
       await browser.close();
     }
   }
   ```

2. Limit concurrent requests (add queue system)

3. Restart services periodically

---

## Still Having Issues?

### Debug Checklist

- [ ] All three services are running (check 3 terminals)
- [ ] `.env` files exist in all three directories
- [ ] Hugging Face API key is valid and has quota
- [ ] Ports 3000, 5001, 5002 are not in use by other apps
- [ ] Internet connection is stable
- [ ] Node.js version is 14+ (`node --version`)
- [ ] Python version is 3.8+ (`python3 --version`)
- [ ] All dependencies are installed (`npm install`, `pip install`)

### Get Help

1. Check browser console (F12) for frontend errors
2. Check terminal logs for backend/AI errors
3. Try with a simple, popular channel first (e.g., @mkbhd)
4. Test each service's health endpoint:
   - http://localhost:5001/health
   - http://localhost:5002/health
5. Create an issue on GitHub with:
   - Error message
   - Steps to reproduce
   - Your OS and versions
   - Terminal logs

---

## Useful Commands

```bash
# Check what's using a port
lsof -i :PORT_NUMBER

# Kill a process
kill -9 PID

# Check Node.js version
node --version

# Check Python version
python3 --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Python cache
find . -type d -name __pycache__ -exec rm -r {} +
```

---

Remember: Most issues are due to missing dependencies, wrong ports, or missing API keys. Double-check the basics first! 🔍
