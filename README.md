# 🎵 AI Playlist Generator

A music player-inspired web app that generates curated YouTube playlists using AI. Choose your genre, era, and mood — then hit play.

## Features

- 🎤 **16 Genres** — Pop, Rock, Hip Hop, R&B, Electronic, Jazz, EDM, Indie, Country, Alternative, Chill/Lo-fi, Blues, Metal, K-Pop, Latin, Folk
- 📅 **Era Selection** — Any Era, 2020s, 2010s, 2000s, '90s, '80s, '70s, '60s
- 😌 **12 Moods** — Energetic, Chill, Happy, Melancholy, Romantic, Focus, Party, Workout, Dreamy, Dark, Uplifting, Nostalgic
- ⏱️ **Duration** — 30 min (~8-10 tracks) or 60 min (~16-18 tracks)
- 📺 **YouTube Integration** — Automatically finds tracks and creates a playable playlist URL
- 🔒 **Basic Auth** — Optional password protection via environment variables
- ✨ **Light Glassmorphism UI** — Music player-style interface with frosted glass panels

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **AI**: Google Gemini API (`gemini-2.5-flash`)
- **APIs**: YouTube Data API v3
- **Styling**: Custom CSS (Glassmorphism)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   YOUTUBE_API_KEY=your_youtube_api_key

   # Optional: Basic Authentication
   BASIC_AUTH_USER=your_username
   BASIC_AUTH_PASSWORD=your_password
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

Deploy to [Vercel](https://vercel.com/new) and set the environment variables in the project settings.
