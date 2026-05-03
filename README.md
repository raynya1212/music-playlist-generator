# Music Playlist Generator

A modern Next.js web application that automatically generates a curated one-hour English music playlist and creates it directly on your YouTube account.

## Features

- 🎵 **Smart Curation**: Uses the Gemini API to select a perfect mix of current Billboard hits, inspiring niche tracks, and millennial classics.
- 🔐 **Seamless Authentication**: Integrates Google OAuth for secure login to your YouTube account.
- 📺 **YouTube Integration**: Automatically creates playlists and adds tracks via the YouTube Data API.
- ✨ **Beautiful UI**: Features a clean, modern white glassmorphism design with smooth animations.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **AI**: Google Gemini API
- **APIs**: YouTube Data API v3, Google OAuth 2.0
- **Styling**: Custom CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_oauth_client_secret
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is ready to be deployed on [Vercel](https://vercel.com/new).
