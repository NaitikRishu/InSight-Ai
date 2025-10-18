# Frontend - YouTube Channel Analyzer

React application with Tailwind CSS for analyzing YouTube channels.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment (optional):
```bash
cp .env.example .env
# Edit .env if backend is not on localhost:5001
```

3. Run the application:
```bash
npm start
```

The app will open at http://localhost:3000

## Features

- **Modern UI**: Gradient-based dark theme with glassmorphism effects
- **Real-time Feedback**: Loading states with spinner animations
- **Channel Display**: Shows channel name and subscriber count
- **Video Grid**: Displays up to 15 recent videos with view counts
- **AI Insights**: Shows content strategy recommendations from Ling-1
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Works on mobile and desktop
- **Keyboard Support**: Press Enter to analyze

## Technologies

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

- `REACT_APP_BACKEND_URL`: Backend API URL (default: http://localhost:5001)
