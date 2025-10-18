import React, { useState } from 'react';
import { Youtube, Sparkles, TrendingUp, Users, Eye, Loader2, AlertCircle, Palette, Edit3, Calendar, MessageCircle, Target } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5003';

function parseSuggestions(suggestions) {
  const categories = [
    {
      key: 'CONTENT THEMES',
      title: 'Content Themes',
      icon: Palette,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
      iconColor: 'text-green-400'
    },
    {
      key: 'TITLE OPTIMIZATION',
      title: 'Title Optimization',
      icon: Edit3,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-400'
    },
    {
      key: 'UPLOAD STRATEGY',
      title: 'Upload Strategy',
      icon: Calendar,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-400'
    },
    {
      key: 'ENGAGEMENT TACTICS',
      title: 'Engagement Tactics',
      icon: MessageCircle,
      color: 'from-orange-500/20 to-red-500/20',
      borderColor: 'border-orange-500/30',
      iconColor: 'text-orange-400'
    },
    {
      key: 'GROWTH OPPORTUNITIES',
      title: 'Growth Opportunities',
      icon: Target,
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30',
      iconColor: 'text-indigo-400'
    }
  ];

  const sections = suggestions.split(/\*\*(.*?)\*\*/).filter(section => section.trim());
  const parsedSections = {};

  for (let i = 0; i < sections.length; i += 2) {
    const title = sections[i].trim();
    const content = sections[i + 1]?.trim() || '';

    // Find matching category
    const category = categories.find(cat =>
      title.toUpperCase().includes(cat.key.replace(' ', ''))
    );

    if (category) {
      parsedSections[category.key] = {
        ...category,
        content: content.split('\n').filter(line => line.trim() && !line.startsWith('*'))
      };
    }
  }

  return categories.map(category => parsedSections[category.key]).filter(Boolean);
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a YouTube channel URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/analyze`, {
        url: url.trim()
      }, {
        timeout: 90000
      });

      if (response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data.error || 'Analysis failed');
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. The channel might be too large or the server is busy.');
      } else if (err.response) {
        setError(err.response.data.error || 'Server error occurred');
      } else if (err.request) {
        setError('Cannot connect to server. Please ensure the backend is running on port 5001.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Youtube className="w-12 h-12 text-red-500 mr-3" />
            <h1 className="text-5xl font-bold text-white">
              YouTube Channel Analyzer
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            AI-powered content strategy recommendations using DeepSeek-V3
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleAnalyze}>
              <label className="block text-white text-sm font-semibold mb-3">
                Enter YouTube Channel URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://youtube.com/@channelname"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Channel Info */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
                  <Youtube className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {result.channel.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-300">{result.channel.subscribers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-2xl font-bold text-white">Recent Videos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.videos.map((video, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-200 hover:scale-105"
                  >
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-white/10">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                        }}
                      />
                    </div>
                    <h4 className="text-white font-semibold mb-2 line-clamp-2 leading-tight">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views} views</span>
                      </div>
                      <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Suggestions */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-white mb-2">
                  AI-Powered Content Strategy
                </h3>
                <p className="text-gray-300">
                  Personalized recommendations for optimal growth
                </p>
              </div>

              {parseSuggestions(result.suggestions).map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <div
                    key={index}
                    className={`bg-gradient-to-br ${category.color} backdrop-blur-lg rounded-2xl p-8 shadow-2xl border ${category.borderColor}`}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`p-3 bg-white/10 rounded-xl`}>
                        <IconComponent className={`w-8 h-8 ${category.iconColor}`} />
                      </div>
                      <div>
                        <h4 className="text-2xl font-bold text-white">
                          {category.title}
                        </h4>
                        <p className="text-gray-300 mt-1">
                          Strategic insights for this category
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {category.content.map((point, pointIndex) => (
                        <div
                          key={pointIndex}
                          className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full ${category.iconColor.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                            <p className="text-gray-100 leading-relaxed">
                              {point.trim()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 shadow-2xl border border-white/20 text-center">
              <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                Analyzing Channel...
              </h3>
              <p className="text-gray-300">
                Scraping YouTube data and generating AI insights. This may take up to 60 seconds.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="text-center text-gray-400 text-sm">
          <p>Powered by DeepSeek-V3 • Built with React, Node.js & Python</p>
        </div>
      </div>
    </div>
  );
}

export default App;
