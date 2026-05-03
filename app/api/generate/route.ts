import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { google } from "googleapis";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { genre, mood, duration } = body;

    if (!genre || !mood || !duration) {
      return NextResponse.json({ error: "Genre, mood, and duration are required." }, { status: 400 });
    }

    const trackCount = duration === "30" ? "8-10" : "16-18";
    const durationLabel = duration === "30" ? "30-minute" : "1-hour";

    // 1. Generate Playlist with Gemini
    const prompt = `
      You are an expert music curator. Create a ${durationLabel} playlist (approximately ${trackCount} tracks).
      
      Genre: ${genre}
      Mood: ${mood}
      
      Requirements:
      - All tracks must fit the specified genre and mood.
      - Include a diverse mix of well-known hits and hidden gems within that genre.
      - Focus primarily on new releases and recent tracks, but include a few timeless favorites if they match the mood.
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
