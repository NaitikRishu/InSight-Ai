// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.BACKEND_PORT || 5003;
// FIX: Point to the correct AI service port
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5002';

app.use(cors());
app.use(express.json());

// Scrape YouTube channel data
const scrapeChannelData = async (channelUrl) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto(`${channelUrl.replace(/\/+$/, '')}/videos`, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const data = await page.evaluate(() => {
      const channelName = document.querySelector('yt-formatted-string.ytd-channel-name')?.innerText || 'Unknown';
      const subscriberCountText = document.querySelector('yt-formatted-string#subscriber-count')?.innerText || 'N/A';

      const videos = [];
      const nodes = document.querySelectorAll('ytd-rich-item-renderer');
      
      for (let i = 0; i < Math.min(nodes.length, 15); i++) {
        const el = nodes[i];
        const title = el.querySelector('#video-title')?.innerText || 'N/A';
        const meta = el.querySelector('#metadata-line span')?.innerText || '';
        const viewsMatch = meta.match(/([\d.,]+[KMB]?)\s*views/);
        const views = viewsMatch ? viewsMatch[1] : '0';
        
        videos.push({ title, views });
      }

      return {
        channel: { name: channelName, subscribers: subscriberCountText },
        videos,
      };
    });

    return data;
  } finally {
    if (browser) await browser.close();
  }
};

// FIX: Helper function to parse view counts like "1.2M", "300K"
const parseViews = (viewStr) => {
  if (!viewStr || typeof viewStr !== 'string') return 0;
  const num = parseFloat(viewStr.replace(/,/g, ''));
  if (viewStr.endsWith('K')) return num * 1000;
  if (viewStr.endsWith('M')) return num * 1000000;
  if (viewStr.endsWith('B')) return num * 1000000000;
  return num;
};

// Get AI suggestions from AI service
const getAISuggestions = async (scrapedData) => {
  try {
    const response = await axios.post(
      // FIX: Point to the correct AI service route
      `${AI_SERVICE_URL}/api/analyze`,
      { scrapedData },
      { timeout: 60000 } // Keep a long timeout, local models can be slow
    );
    return response.data.suggestions;
  } catch (error) {
    console.error('AI Service Error:', error.message);
    throw new Error('Failed to get AI suggestions');
  }
};

// API endpoint
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body || {};
  
  if (!url) {
    return res.status(400).json({ error: 'YouTube channel URL is required' });
  }

  try {
    console.log(`🔍 Scraping: ${url}`);
    const scraped = await scrapeChannelData(url);
    
    // FIX: Calculate metrics to prevent frontend crash
    const totalViews = scraped.videos.reduce((acc, video) => {
      return acc + parseViews(video.views);
    }, 0);
    const avgViews = scraped.videos.length > 0 ? totalViews / scraped.videos.length : 0;
    
    console.log(`🤖 Getting AI suggestions...`);
    const suggestions = await getAISuggestions(scraped);
    
    res.json({
      success: true,
      channel: scraped.channel,
      videos: scraped.videos,
      suggestions,
      metrics: { avgViews } // FIX: Send metrics to frontend
    });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to analyze channel',
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Backend running' });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
  console.log(`📡 AI Service URL: ${AI_SERVICE_URL}`);
});