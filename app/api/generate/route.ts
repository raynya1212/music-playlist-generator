import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { genre, mood, duration, era } = body;

    if (!genre || !mood || !duration) {
      return NextResponse.json({ error: "Genre, mood, and duration are required." }, { status: 400 });
    }

    const trackCount = duration === "30" ? "8-10" : "16-18";
    const durationLabel = duration === "30" ? "30-minute" : "1-hour";

    const eraInstruction = era && era !== "any"
      ? `- All tracks should be from the ${era} era/decade.`
      : `- Include tracks from any era, but lean towards newer releases.`;

    // 1. Generate Playlist with Gemini
    const prompt = `
      You are an expert music curator. Create a ${durationLabel} playlist (approximately ${trackCount} tracks).
      
      Genre: ${genre}
      Mood: ${mood}
      
      Requirements:
      - All tracks must fit the specified genre and mood.
      ${eraInstruction}
      - Include a diverse mix of well-known hits and hidden gems within that genre.
      - Avoid repeating the same artists. Maximize variety.
      - Make the playlist flow naturally — consider energy levels and transitions between tracks.
      
      Output ONLY a valid JSON object with the following structure. Do not wrap in markdown blocks, just raw JSON:
      {
        "playlistName": "A catchy English name for this playlist that reflects the genre and mood",
        "tracks": [
          {
            "title": "Song Title",
            "artist": "Artist Name"
          }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const responseText = response.text || "";
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    let playlistData;
    try {
      playlistData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", jsonStr);
      return NextResponse.json({ error: "Failed to generate playlist. Please try again." }, { status: 500 });
    }

    // 2. Try YouTube Data API first, fall back to search URLs if quota exhausted
    let videoIds: string[] = [];
    let apiAvailable = true;

    if (process.env.YOUTUBE_API_KEY) {
      const youtube = google.youtube({ 
        version: "v3", 
        auth: process.env.YOUTUBE_API_KEY 
      });

      for (const track of playlistData.tracks) {
        if (!apiAvailable) break;
        const searchQuery = `${track.title} ${track.artist} official audio`;
        try {
          const searchRes = await youtube.search.list({
            part: ["id"],
            q: searchQuery,
            type: ["video"],
            maxResults: 1,
          });

          if (searchRes.data.items && searchRes.data.items.length > 0) {
            videoIds.push(searchRes.data.items[0].id?.videoId as string);
          }
        } catch (err: any) {
          console.error(`YouTube API error for ${searchQuery}:`, err?.message || err);
          // If quota exceeded or forbidden, stop trying the API
          if (err?.code === 403 || err?.status === 403 || err?.message?.includes("quota")) {
            console.warn("YouTube API quota likely exceeded, switching to fallback.");
            apiAvailable = false;
          }
        }
      }
    } else {
      apiAvailable = false;
    }

    // 3. Build playlist URL
    let playlistUrl: string;

    if (videoIds.length > 0) {
      // Use watch_videos URL with found video IDs
      const safeVideoIds = videoIds.slice(0, 50);
      playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${safeVideoIds.join(",")}`;
    } else {
      // Fallback: build a YouTube search URL for the first track as entry point
      // and return full track list so the user can find them
      const firstTrack = playlistData.tracks[0];
      const query = encodeURIComponent(`${firstTrack.title} ${firstTrack.artist}`);
      playlistUrl = `https://www.youtube.com/results?search_query=${query}`;
    }

    // Build track list for display
    const trackList = playlistData.tracks.map((t: { title: string; artist: string }) => ({
      title: t.title,
      artist: t.artist,
    }));

    return NextResponse.json({ 
      success: true, 
      playlistUrl: playlistUrl,
      name: playlistData.playlistName,
      trackCount: playlistData.tracks.length,
      tracks: trackList,
      usedFallback: videoIds.length === 0,
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
