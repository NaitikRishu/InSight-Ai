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

  const parsedSections = {};

  // Split by category headers (format: "CATEGORY:")
  categories.forEach(category => {
    const regex = new RegExp(`${category.key}:([\\s\\S]*?)(?=${categories.find(c => c.key !== category.key)?.key}:|$)`, 'i');
    const match = suggestions.match(regex);

    if (match) {
      const content = match[1].trim();
      // Extract bullet points (lines that start with •)
      const bulletPoints = content.split('\n')
        .filter(line => line.trim().match(/^•\s/))
        .map(line => line.replace(/^•\s*/, '').trim())
        .filter(line => line.length > 0);

      if (bulletPoints.length > 0) {
        parsedSections[category.key] = {
          ...category,
          content: bulletPoints
        };
      }
    }
  });

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 animate-fade-in">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center mb-4">
            <Youtube className="w-12 h-12 text-red-500 mr-3 animate-bounce" />
            <h1 className="text-5xl font-bold text-white bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent animate-gradient">
              YouTube Channel Analyzer
            </h1>
          </div>
          <p className="text-gray-300 text-lg animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            AI-powered content strategy recommendations using Llama-3.1
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 relative overflow-hidden group hover:shadow-3xl transition-all duration-500">
            {/* Input Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <form onSubmit={handleAnalyze} className="relative z-10">
              <label className="block text-white text-sm font-semibold mb-3 group-hover:text-purple-200 transition-colors duration-300">
                Enter YouTube Channel URL
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://youtube.com/@channelname"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 hover:bg-white/25"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
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
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3 animate-shake">
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-purple-400 animate-pulse" />
                <h3 className="text-2xl font-bold text-white">Recent Videos</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {result.videos.map((video, index) => (
                  <div
                    key={index}
                    className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl group animate-fade-in-up"
                    style={{animationDelay: `${0.8 + index * 0.1}s`}}
                  >
                    <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-white/10 relative">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/320x180?text=No+Thumbnail';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <h4 className="font-semibold text-white mb-2 line-clamp-2 leading-tight group-hover:text-purple-200 transition-colors duration-300">
                      {video.title}
                    </h4>
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{video.views} views</span>
                      </div>
                      <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full group-hover:bg-purple-500/30 transition-colors duration-300">
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

              {parseSuggestions(result.suggestions).length > 0 ? (
                parseSuggestions(result.suggestions).map((category, index) => {
                  const IconComponent = category.icon;
                  return (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${category.color} backdrop-blur-lg rounded-2xl p-8 shadow-2xl border ${category.borderColor} relative overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl`}
                      style={{
                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                      }}
                    >
                      {/* Animated Background Elements */}
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20 animate-pulse"></div>
                        <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white/10 animate-pulse" style={{animationDelay: '1s'}}></div>
                        <div className="absolute top-1/2 left-8 w-16 h-16 rounded-full bg-white/5 animate-bounce" style={{animationDelay: '0.5s'}}></div>
                      </div>

                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer opacity-0 hover:opacity-100 transition-opacity duration-1000"></div>

                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                          <div className={`p-4 bg-white/20 rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-110 hover:rotate-3`}>
                            <IconComponent className={`w-10 h-10 ${category.iconColor} drop-shadow-lg`} />
                          </div>
                          <div>
                            <h4 className="text-3xl font-bold text-white mb-1 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                              {category.title}
                            </h4>
                            <p className="text-gray-200 text-sm font-medium">
                              Strategic insights for optimization
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-4">
                          {category.content.map((point, pointIndex) => (
                            <div
                              key={pointIndex}
                              className="bg-white/10 rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group"
                              style={{
                                animation: `slideInLeft 0.4s ease-out ${index * 0.1 + pointIndex * 0.1}s both`
                              }}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`w-3 h-3 rounded-full ${category.iconColor.replace('text-', 'bg-')} mt-2 flex-shrink-0 shadow-sm group-hover:scale-125 transition-transform duration-300`} />
                                <div className="flex-1">
                                  <p className="text-gray-100 leading-relaxed text-base group-hover:text-white transition-colors duration-300">
                                    <span className="font-semibold text-white">{point.split(':')[0]}</span>
                                    {point.includes(':') ? ':' : ''}
                                    <span className="text-gray-200 group-hover:text-gray-100 transition-colors duration-300">{point.split(':').slice(1).join(':')}</span>
                                  </p>
                                </div>
                                <div className={`opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${category.iconColor}`}>
                                  →
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Fallback: Display raw suggestions if parsing fails
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-purple-500/30">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-2xl font-bold text-white">
                      AI-Powered Content Strategy
                    </h3>
                  </div>
                  <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                    <div className="text-gray-100 whitespace-pre-wrap leading-relaxed">
                      {result.suggestions}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-16 shadow-2xl border border-white/20 text-center relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 animate-pulse"></div>

              {/* Floating Elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute bottom-8 left-12 w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>

              <div className="relative z-10">
                {/* Main Loading Animation */}
                <div className="relative mb-8">
                  <div className="w-24 h-24 mx-auto relative">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-500 animate-spin"></div>

                    {/* Inner Ring */}
                    <div className="absolute inset-2 rounded-full border-3 border-pink-500/20"></div>
                    <div className="absolute inset-2 rounded-full border-3 border-transparent border-t-pink-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                  </div>
                </div>

                <h3 className="text-3xl font-bold text-white mb-3 animate-pulse">
                  Analyzing Channel...
                </h3>
                <p className="text-gray-300 text-lg mb-6">
                  AI is generating personalized content strategy recommendations
                </p>

                {/* Progress Steps */}
                <div className="flex justify-center space-x-8 text-sm">
                  <div className="flex items-center space-x-2 text-purple-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Scraping Data</span>
                  </div>
                  <div className="flex items-center space-x-2 text-pink-300">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>AI Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>Generating Report</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 mt-12">
        <div className="text-center text-gray-400 text-sm">
          <p>Powered by Llama-3.1 • Built with React, Node.js & Python</p>
        </div>
      </div>
    </div>
  );
}

export default App;
