require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const PORT = process.env.BACKEND_PORT || 5001;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5002';

// Mock scraping function for demo purposes

const app = express();

// Helper function to parse view counts like "1.2M", "300K"
const parseViews = (viewStr) => {
  if (!viewStr || typeof viewStr !== 'string') return 0;
  const num = parseFloat(viewStr.replace(/,/g, ''));
  if (viewStr.endsWith('K')) return num * 1000;
  if (viewStr.endsWith('M')) return num * 1000000;
  if (viewStr.endsWith('B')) return num * 1000000000;
  return num;
};
const getAISuggestions = async (scrapedData) => {
  try {
    console.log('🤖 Calling AI service...');
    const response = await axios.post(
      `${AI_SERVICE_URL}/api/analyze`,
      { scrapedData },
      { timeout: 120000 } // Increase timeout to 2 minutes for AI generation
    );
    console.log('✅ AI service responded successfully');
    return response.data.suggestions;
  } catch (error) {
    console.error('❌ AI Service Error:', error.message);
    console.error('❌ Error details:', error.code, error.response?.status);
    // Return mock AI suggestions if AI service is not ready
    const channelType = scrapedData.channel.name.toLowerCase();
    const topVideo = scrapedData.videos[0];
    
    if (channelType.includes('comedy') || channelType.includes('funny') || channelType.includes('bassi')) {
      return `CONTENT THEMES:
• Build on "${topVideo?.title || 'comedy'}" success with similar themes
• Their audience responds to comedy content
• Suggest comedy formats like their best performer

TITLE OPTIMIZATION:
• Best title: "${topVideo?.title || 'comedy'}" (${topVideo?.views || 'views'})
• Use comedy words: funny, hilarious, standup
• Pattern: [Action Word] + [Comedy Topic] + [Hook]

UPLOAD STRATEGY:
• ${scrapedData.videos.length} comedy videos averaging good views
• Post 2-3 comedy videos per week
• Mix solo comedy with collaboration content

ENGAGEMENT TACTICS:
• Ask "What was your favorite funny moment?" in descriptions
• Reply to comments on comedy timing
• Create comedy-themed polls

GROWTH OPPORTUNITIES:
• Collaborate with other comedians
• Create comedy Shorts for algorithm boost
• Expand to TikTok for comedy clips`;
    } else if (channelType.includes('tech') || channelType.includes('review')) {
      return `CONTENT THEMES:
• Build on "${topVideo?.title || 'tech'}" success with similar themes
• Their audience responds to tech reviews
• Suggest tech formats like their best performer

TITLE OPTIMIZATION:
• Best title: "${topVideo?.title || 'tech'}" (${topVideo?.views || 'views'})
• Use tech words: review, unboxing, comparison
• Pattern: [Product] + [Action] + [Benefit]

UPLOAD STRATEGY:
• ${scrapedData.videos.length} tech videos averaging good views
• Post 2-3 tech videos per week
• Mix reviews with tutorials and news

ENGAGEMENT TACTICS:
• Ask "What tech do you want reviewed?" in descriptions
• Reply to comments on tech specs
• Create tech polls and surveys

GROWTH OPPORTUNITIES:
• Collaborate with other tech creators
• Create tech Shorts for algorithm boost
• Expand to other tech platforms`;
    } else if (channelType.includes('music') || channelType.includes('song')) {
      return `CONTENT THEMES:
• Build on "${topVideo?.title || 'music'}" success with similar themes
• Their audience responds to music content
• Suggest music formats like their best performer

TITLE OPTIMIZATION:
• Best title: "${topVideo?.title || 'music'}" (${topVideo?.views || 'views'})
• Use music words: new song, acoustic, live
• Pattern: [Song Title] + [Version/Type] + [Year]

UPLOAD STRATEGY:
• ${scrapedData.videos.length} music videos averaging good views
• Post 1-2 music videos per week
• Mix original songs with covers

ENGAGEMENT TACTICS:
• Ask "What song should I cover next?" in descriptions
• Reply to comments on music preferences
• Create music polls and requests

GROWTH OPPORTUNITIES:
• Collaborate with other musicians
• Create music Shorts for algorithm boost
• Expand to music streaming platforms`;
    } else {
      return `CONTENT THEMES:
• Build on "${topVideo?.title || 'content'}" success with similar themes
• Their audience responds to your content style
• Suggest formats like their best performer

TITLE OPTIMIZATION:
• Best title: "${topVideo?.title || 'content'}" (${topVideo?.views || 'views'})
• Use engaging words: amazing, incredible, must-see
• Pattern: [Emotion] + [Topic] + [Call to Action]

UPLOAD STRATEGY:
• ${scrapedData.videos.length} videos averaging good views
• Post consistently 2-3 times per week
• Mix different content formats

ENGAGEMENT TACTICS:
• Ask questions in descriptions
• Reply to comments regularly
• Create community polls

GROWTH OPPORTUNITIES:
• Collaborate with other creators
• Create Shorts for algorithm boost
• Expand to other platforms`;
    }
  }
};

app.use(cors());
app.use(express.json());

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'Backend Service', port: PORT });
});

// --- Mock Scraping Function (Demo Version) ---
async function scrapeYouTubeChannel(url) {
  console.log(`Mock scraping for: ${url}`);
  
  // Extract channel name from different URL formats
  let channelName = 'Demo Channel';
  
  if (url.includes('@')) {
    // Handle @username format: https://youtube.com/@username
    channelName = url.split('@')[1].split('/')[0].replace(/([A-Z])/g, ' $1').trim();
  } else if (url.includes('/channel/')) {
    // Handle channel ID format: https://youtube.com/channel/UCxxxxx
    channelName = 'Channel ' + url.split('/channel/')[1].split('/')[0].substring(0, 8) + '...';
  } else if (url.includes('/c/')) {
    // Handle custom URL format: https://youtube.com/c/username
    channelName = url.split('/c/')[1].split('/')[0].replace(/([A-Z])/g, ' $1').trim();
  } else if (url.includes('/user/')) {
    // Handle user format: https://youtube.com/user/username
    channelName = url.split('/user/')[1].split('/')[0].replace(/([A-Z])/g, ' $1').trim();
  } else {
    // Extract from any YouTube URL
    const urlParts = url.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    if (lastPart && lastPart !== 'videos' && lastPart !== 'about') {
      channelName = lastPart.replace(/([A-Z])/g, ' $1').trim();
    }
  }
  
  // Generate different mock data based on channel name
  const channelType = channelName.toLowerCase();
  let videos, subscribers;
  
  if (channelType.includes('comedy') || channelType.includes('funny') || channelType.includes('bassi')) {
    videos = [
      { title: 'My Best Comedy Performance Ever', views: '2.5M' },
      { title: 'Funny Moments That Went Viral', views: '1.8M' },
      { title: 'Stand-up Comedy Special', views: '3.2M' },
      { title: 'Comedy Roast Session', views: '1.5M' },
      { title: 'Behind the Scenes Comedy', views: '950K' },
      { title: 'Comedy Challenge with Friends', views: '1.1M' },
      { title: 'Funny Story Time', views: '800K' },
      { title: 'Comedy Skit Collection', views: '1.3M' },
      { title: 'Live Comedy Show Highlights', views: '2.1M' },
      { title: 'Comedy Tips and Tricks', views: '750K' }
    ];
    subscribers = '1.2M subscribers';
  } else if (channelType.includes('tech') || channelType.includes('review')) {
    videos = [
      { title: 'iPhone 15 Pro Max Review', views: '3.1M' },
      { title: 'Best Smartphones 2024', views: '2.8M' },
      { title: 'MacBook Pro vs Surface Laptop', views: '1.9M' },
      { title: 'Budget Tech Under $500', views: '1.4M' },
      { title: 'Gaming Setup Tour', views: '2.2M' },
      { title: 'Tech News This Week', views: '850K' },
      { title: 'Unboxing Latest Gadgets', views: '1.6M' },
      { title: 'Tech Tips and Tricks', views: '1.1M' },
      { title: 'Future of Technology', views: '1.8M' },
      { title: 'Tech Fail Compilation', views: '2.5M' }
    ];
    subscribers = '2.8M subscribers';
  } else if (channelType.includes('music') || channelType.includes('song')) {
    videos = [
      { title: 'New Song Release 2024', views: '5.2M' },
      { title: 'Acoustic Version', views: '2.1M' },
      { title: 'Music Video Behind Scenes', views: '1.8M' },
      { title: 'Live Performance', views: '3.4M' },
      { title: 'Song Cover Collection', views: '2.9M' },
      { title: 'Studio Recording Process', views: '1.2M' },
      { title: 'Music Collaboration', views: '2.6M' },
      { title: 'Instrumental Version', views: '1.5M' },
      { title: 'Music Theory Explained', views: '950K' },
      { title: 'Fan Favorite Songs', views: '4.1M' }
    ];
    subscribers = '4.5M subscribers';
  } else {
    // Default content
    videos = [
      { title: 'Most Popular Video Ever', views: '2.1M' },
      { title: 'Trending Content This Week', views: '1.8M' },
      { title: 'Behind the Scenes', views: '950K' },
      { title: 'Fan Favorite Moments', views: '1.3M' },
      { title: 'Special Collaboration', views: '1.6M' },
      { title: 'Community Highlights', views: '800K' },
      { title: 'Best of 2024', views: '2.4M' },
      { title: 'Exclusive Content', views: '1.1M' },
      { title: 'Live Stream Recap', views: '1.7M' },
      { title: 'Top Performing Video', views: '1.9M' }
    ];
    subscribers = '1.5M subscribers';
  }
  
    return {
      channel: {
        name: channelName,
        subscribers: subscribers,
      },
    videos: videos,
  };
}

// --- NEW ENDPOINT 1: Scrape ---
app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;

  if (!url || !url.includes('youtube.com/@')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid YouTube channel URL. Please use the format: https://youtube.com/@channelname',
    });
  }

  try {
    const scrapedData = await scrapeYouTubeChannel(url);
    if (!scrapedData.channel.name) {
       return res.status(404).json({
         success: false,
         error: 'Could not find channel data. The URL might be incorrect or the channel does not exist.',
       });
    }
    res.json({ success: true, ...scrapedData });

  } catch (error) {
    console.error('Scraping endpoint error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'An internal server error occurred during scraping.',
    });
  }
});

// --- MAIN ANALYZE ENDPOINT (handles both scraping and AI) ---
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'YouTube channel URL is required'
    });
  }

  try {
    console.log(`🔍 Starting analysis for: ${url}`);

    // Step 1: Scrape the channel data
    const scraped = await scrapeYouTubeChannel(url);

    if (!scraped.channel.name) {
      return res.status(404).json({
        success: false,
        error: 'Could not find channel data. The URL might be incorrect or the channel does not exist.'
      });
    }

    // Step 2: Calculate metrics
    const totalViews = scraped.videos.reduce((acc, video) => {
      return acc + parseViews(video.views);
    }, 0);
    const avgViews = scraped.videos.length > 0 ? totalViews / scraped.videos.length : 0;

    // Step 3: Get AI suggestions
    console.log(`🤖 Getting AI suggestions...`);
    const suggestions = await getAISuggestions(scraped);

    // Step 4: Return complete analysis
    res.json({
      success: true,
      channel: scraped.channel,
      videos: scraped.videos,
      suggestions,
      metrics: { avgViews, totalViews }
    });

  } catch (error) {
    console.error('Error in analyze endpoint:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze channel'
    });
  }
});

app.listen(PORT, '0.0.0.0', () => { // Listen on 0.0.0.0 for Docker
  console.log(`Backend server running on http://0.0.0.0:${PORT}`);
  console.log(`Connecting to AI service at ${AI_SERVICE_URL}`);
});