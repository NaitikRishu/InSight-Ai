import React, { useState } from 'react';
import axios from 'axios';
import { Youtube, Search, BrainCircuit, Loader2, ServerCrash, Star } from 'lucide-react';

// Get backend URL from environment variable
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

// --- Reusable Components ---

const Header = () => (
  <header className="text-center p-6">
    <div className="flex items-center justify-center space-x-3">
      <BrainCircuit size={40} className="text-pink-400" />
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500">
        InSight AI
      </h1>
    </div>
    <p className="text-gray-400 mt-2">Your AI-Powered YouTube Content Strategist</p>
  </header>
);

const SearchForm = ({ url, setUrl, handleSubmit, loading }) => (
  <div className="relative w-full max-w-2xl mx-auto">
    <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      onKeyPress={(e) => e.key === 'Enter' && !loading && handleSubmit()}
      placeholder="Enter YouTube channel URL (e.g., https://youtube.com/@channelname)"
      className="w-full pl-12 pr-28 py-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
      disabled={loading}
    />
    <button
      onClick={handleSubmit}
      disabled={loading}
      className="absolute right-3 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center justify-center hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Search size={20} />
      )}
    </button>
  </div>
);

const ErrorDisplay = ({ error }) => (
  <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg flex items-center space-x-3 max-w-2xl mx-auto">
    <ServerCrash />
    <div>
      <h3 className="font-bold">Analysis Failed</h3>
      <p>{error}</p>
    </div>
  </div>
);

const LoadingSpinner = ({ text }) => (
  <div className="flex flex-col items-center justify-center p-8 text-gray-400">
    <Loader2 size={40} className="animate-spin text-purple-400" />
    <p className="mt-4 text-lg">{text}</p>
  </div>
);

const ResultsDisplay = ({ result, aiLoading }) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-8">
    
    {/* --- Channel & Videos (Col 1 & 2) --- */}
    <div className="lg:col-span-2 space-y-6">
      <ChannelCard channel={result.channel} />
      <VideoList videos={result.videos} />
    </div>

    {/* --- AI Suggestions (Col 3) --- */}
    <div className="lg:col-span-1">
      <AiSuggestions suggestions={result.suggestions} loading={aiLoading} />
    </div>
  </div>
);

const ChannelCard = ({ channel }) => (
  <div className="card-base">
    <h2 className="card-title">Channel Overview</h2>
    <div className="mt-4">
      <p className="text-2xl font-bold text-white">{channel.name || 'Channel Name Not Found'}</p>
      <p className="text-lg text-purple-300">{channel.subscribers || 'Subscriber count not found'}</p>
    </div>
  </div>
);

const VideoList = ({ videos }) => (
  <div className="card-base">
    <h2 className="card-title">Recent Videos (Up to 15)</h2>
    <div className="mt-4 max-h-96 overflow-y-auto pr-2">
      {videos.length > 0 ? (
        <ul className="space-y-3">
          {videos.map((video, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-800/60 p-3 rounded-md">
              <span className="text-gray-300 flex-1 truncate pr-4">{video.title}</span>
              <span className="text-white font-medium bg-purple-500/20 px-3 py-1 rounded-full text-sm">
                {video.views}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No recent videos found.</p>
      )}
    </div>
  </div>
);

const AiSuggestions = ({ suggestions }) => (
  <div className="card-base sticky top-6">
    <h2 className="card-title flex items-center space-x-2">
      <Star className="text-yellow-400" />
      <span>AI Recommendations</span>
    </h2>
    <div className="mt-4 min-h-[200px]">
      {suggestions ? (
        <div 
          className="prose prose-invert prose-sm text-gray-300 prose-p:my-2 prose-ol:my-2 prose-ol:pl-4"
          dangerouslySetInnerHTML={{ __html: formatSuggestions(suggestions) }}
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          <p>AI suggestions will appear here.</p>
        </div>
      )}
    </div>
  </div>
);

// Helper to format suggestions
const formatSuggestions = (text) => {
  // Simple formatter to turn "1. ..." into an ordered list
  return "<ol>" + text.split(/\n\d+\./)
    .map(item => item.replace(/^\d+\./, '').trim()) // Clean up numbers
    .filter(item => item) // Remove empty items
    .map(item => `<li>${item}</li>`)
    .join('') + "</ol>";
};

// --- Main App Component ---

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    // Reset state
    setLoading(true);
    setError(null);
    setResult(null);

    // --- Single request to /api/analyze (handles both scraping and AI) ---
    try {
      const response = await axios.post(`${BACKEND_URL}/api/analyze`, { url });

      if (!response.data.success) {
        throw new Error(response.data.error || 'Analysis failed.');
      }

      // Show results immediately (includes channel, videos, and AI suggestions)
      setResult(response.data);
      setLoading(false);

    } catch (error) {
      console.error('Analysis error:', error);
      const errorMsg = error.response?.data?.error || error.message || 'An unknown error occurred.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 selection:bg-purple-500/30">
      <style>
        {`
          .card-base {
            background: linear-gradient(145deg, rgba(31, 28, 44, 0.7), rgba(26, 23, 37, 0.7));
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
          }
          .card-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: white;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          /* Custom scrollbar for video list */
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: #a855f7; /* purple-500 */
            border-radius: 10px;
          }
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: #9333ea; /* purple-600 */
          }
        `}
      </style>
      
      <Header />
      
      <main className="mt-8">
        <SearchForm
          url={url}
          setUrl={setUrl}
          handleSubmit={handleSubmit}
          loading={loading}
        />

        <div className="mt-8">
          {error && <ErrorDisplay error={error} />}
          
          {loading && <LoadingSpinner text="Analyzing channel with AI..." />}
          
          {result && (
            <ResultsDisplay 
              result={result} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;