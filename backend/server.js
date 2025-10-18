const express = require('express');
const cors = require('cors');
const axios = require('axios');
const YTDlpWrap = require('yt-dlp-wrap').default;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 5001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5002';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Backend Service',
    port: PORT
  });
});

// Normalize channel URL
function normalizeChannelUrl(url) {
  url = url.trim();
  if (!url.includes('youtube.com')) {
    url = `https://www.youtube.com/${url.replace(/^\//, '')}`;
  }
  if (!url.includes('/videos')) {
    url = url.replace(/\/$/, '') + '/videos';
  }
  return url;
}

// Fetch channel data using yt-dlp
async function fetchChannelData(url, limit = 15) {
  try {
    console.log(`🔍 Fetching channel data for: ${url}`);
    
    const ytDlp = new YTDlpWrap();
    
    // Download yt-dlp binary if not present
    try {
      await YTDlpWrap.downloadFromGithub();
    } catch (e) {
      console.log('yt-dlp already installed or download failed:', e.message);
    }
    
    const info = await ytDlp.execPromise([
      url,
      '--dump-single-json',
      '--flat-playlist',
      '--skip-download',
      `--playlist-end=${limit}`
    ]);
    
    const data = JSON.parse(info);
    
    const entries = data.entries || [];
    const videos = entries.slice(0, limit).map(e => ({
      title: e.title || 'N/A',
      views: formatViews(e.view_count || 0),
      id: e.id,
      upload_date: e.upload_date,
      thumbnail: e.thumbnail || e.thumbnails?.[0]?.url || 'https://via.placeholder.com/320x180?text=No+Thumbnail'
    }));
    
    const channelData = {
      channel: {
        name: data.channel || data.uploader || data.title || 'Unknown Channel',
        subscribers: formatSubscribers(data.channel_follower_count)
      },
      videos: videos
    };
    
    console.log(`✅ Fetched channel: ${channelData.channel.name}`);
    console.log(`📊 Found ${videos.length} videos`);
    
    return channelData;
    
  } catch (error) {
    console.error('❌ yt-dlp error:', error.message);
    throw new Error(`Failed to fetch channel data: ${error.message}`);
  }
}

function formatViews(count) {
  if (!count) return '0';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function formatSubscribers(count) {
  if (!count) return 'N/A';
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M subscribers`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K subscribers`;
  return `${count} subscribers`;
}

// Main analyze endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { url } = req.body;
    
    // Validate input
    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'YouTube URL is required'
      });
    }
    
    console.log(`📥 Received analyze request for: ${url}`);
    
    // Normalize and fetch channel data
    const normalizedUrl = normalizeChannelUrl(url);
    const scrapedData = await fetchChannelData(normalizedUrl, 15);
    
    // Step 2: Send to AI service for analysis
    console.log(`🤖 Sending data to AI service...`);
    
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/analyze`, {
        scrapedData: scrapedData
      }, {
        timeout: 60000  // Increased to 60 seconds for AI processing
      });
      
      // Step 3: Combine and return results
      const result = {
        success: true,
        channel: scrapedData.channel,
        videos: scrapedData.videos,
        suggestions: aiResponse.data.suggestions
      };
      
      console.log(`✅ Analysis complete for ${scrapedData.channel.name}`);
      
      res.json(result);
      
    } catch (aiError) {
      console.error('❌ AI Service error:', aiError.message);
      
      // Return scraped data even if AI fails
      res.json({
        success: true,
        channel: scrapedData.channel,
        videos: scrapedData.videos,
        suggestions: 'AI analysis temporarily unavailable. Please try again later.',
        warning: 'AI service error'
      });
    }
    
  } catch (error) {
    console.error('❌ Server error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred while analyzing the channel'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🔗 AI Service URL: ${AI_SERVICE_URL}`);
  console.log(`📡 Ready to accept requests at http://localhost:${PORT}/api/analyze`);
});
