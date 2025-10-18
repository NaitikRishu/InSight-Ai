import React, { useState } from 'react';
import { Youtube, Sparkles, TrendingUp, Users, Eye, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5003';

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
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">
                  AI-Powered Content Strategy
                </h3>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <div className="text-gray-100 leading-relaxed space-y-4">
                  {result.suggestions.split('\n\n').map((section, index) => (
                    <div key={index} className="space-y-2">
                      {section.split('\n').map((line, lineIndex) => {
                        // Check if line starts with a number (recommendation)
                        if (/^\d+\./.test(line.trim())) {
                          return (
                            <div key={lineIndex} className="flex gap-3 p-3 bg-purple-500/10 rounded-lg border-l-4 border-purple-400">
                              <span className="text-purple-400 font-bold text-lg flex-shrink-0">
                                {line.match(/^\d+/)[0]}
                              </span>
                              <span className="text-gray-100">
                                {line.replace(/^\d+\.\s*/, '')}
                              </span>
                            </div>
                          );
                        }
                        // Check if line starts with ** (bold text)
                        else if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <h4 key={lineIndex} className="text-lg font-semibold text-white mt-4 mb-2">
                              {line.replace(/\*\*/g, '')}
                            </h4>
                          );
                        }
                        // Regular text
                        else if (line.trim()) {
                          return (
                            <p key={lineIndex} className="text-gray-200 pl-4">
                              {line}
                            </p>
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))}
                </div>
              </div>
              {result.warning && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
                  <p className="text-yellow-200 text-sm">
                    ⚠️ {result.warning}
                  </p>
                </div>
              )}
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
