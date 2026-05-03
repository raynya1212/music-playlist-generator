import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    // 1. Generate Playlist with Gemini
    const prompt = `
      You are an expert music curator. Create a 1-hour long playlist (approximately 16-18 tracks) of Western music (English).
      The playlist MUST include a diverse and balanced mix of:
      - Current Billboard Hot 100 chart-topping hits.
      - Top hits from Spotify's global streaming rankings.
      - Millennial classics (iconic hits from the 2000s and early 2010s).
      - Inspiring but slightly minor/lesser-known niche tracks.
      
      Output ONLY a valid JSON object with the following structure. Do not wrap in markdown blocks, just raw JSON:
      {
        "playlistName": "A catchy English name for this playlist",
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

    // 2. Initialize YouTube API with Simple API Key
    const youtube = google.youtube({ 
      version: "v3", 
      auth: process.env.YOUTUBE_API_KEY 
    });

    // 3. Search for video IDs
    const videoIds: string[] = [];
    for (const track of playlistData.tracks) {
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
      } catch (err) {
        console.error(`Error searching for ${searchQuery}:`, err);
      }
    }

    if (videoIds.length === 0) {
      return NextResponse.json({ error: "Could not find any of the generated songs on YouTube." }, { status: 500 });
    }

    // 4. Construct Anonymous YouTube Playlist URL
    // maximum 50 videos supported by this URL trick
    const safeVideoIds = videoIds.slice(0, 50);
    const playlistUrl = `https://www.youtube.com/watch_videos?video_ids=${safeVideoIds.join(",")}`;

    return NextResponse.json({ 
      success: true, 
      playlistUrl: playlistUrl,
      name: playlistData.playlistName,
      trackCount: safeVideoIds.length
    });

  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
  }
}
