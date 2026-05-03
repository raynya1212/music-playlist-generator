"use client";

import { useState } from "react";
import { PlaylistCard } from "../components/PlaylistCard";

const GENRES = [
  { id: "pop", label: "Pop", icon: "🎤" },
  { id: "rock", label: "Rock", icon: "🎸" },
  { id: "hip-hop", label: "Hip Hop", icon: "🎧" },
  { id: "r-and-b", label: "R&B / Soul", icon: "🎷" },
  { id: "electronic", label: "Electronic", icon: "🎹" },
  { id: "jazz", label: "Jazz", icon: "🎺" },
  { id: "edm", label: "EDM", icon: "🎛️" },
  { id: "indie", label: "Indie", icon: "🌿" },
  { id: "country", label: "Country", icon: "🤠" },
  { id: "alternative", label: "Alternative", icon: "⚡" },
  { id: "chill", label: "Chill / Lo-fi", icon: "🌙" },
  { id: "blues", label: "Blues", icon: "🎵" },
  { id: "metal", label: "Metal", icon: "🤘" },
  { id: "k-pop", label: "K-Pop", icon: "🇰🇷" },
  { id: "latin", label: "Latin", icon: "🔥" },
  { id: "folk", label: "Folk", icon: "🪕" },
];

const ERAS = [
  { id: "any", label: "Any Era" },
  { id: "2020s", label: "2020s" },
  { id: "2010s", label: "2010s" },
  { id: "2000s", label: "2000s" },
  { id: "90s", label: "'90s" },
  { id: "80s", label: "'80s" },
  { id: "70s", label: "'70s" },
  { id: "60s", label: "'60s" },
];

const MOODS = [
  { id: "energetic", label: "Energetic", icon: "⚡" },
  { id: "chill", label: "Chill", icon: "😌" },
  { id: "happy", label: "Happy", icon: "😊" },
  { id: "melancholy", label: "Melancholy", icon: "🌧️" },
  { id: "romantic", label: "Romantic", icon: "💕" },
  { id: "focus", label: "Focus", icon: "🎯" },
  { id: "party", label: "Party", icon: "🎉" },
  { id: "workout", label: "Workout", icon: "💪" },
  { id: "dreamy", label: "Dreamy", icon: "✨" },
  { id: "dark", label: "Dark", icon: "🖤" },
  { id: "uplifting", label: "Uplifting", icon: "🌅" },
  { id: "nostalgic", label: "Nostalgic", icon: "📼" },
];

const DURATIONS = [
  { id: "30", label: "30 min", desc: "~8-10 tracks" },
  { id: "60", label: "60 min", desc: "~16-18 tracks" },
];

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<{
    url: string;
    name: string;
    count: number;
    tracks: { title: string; artist: string }[];
    usedFallback: boolean;
  } | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("60");
  const [era, setEra] = useState<string>("any");

  const canGenerate = genre && mood && !loading;
  const selectedGenre = GENRES.find(g => g.id === genre);
  const selectedMood = MOODS.find(m => m.id === mood);
  const selectedEra = ERAS.find(e => e.id === era);

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, mood, duration, era }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setPlaylist({
        url: data.playlistUrl,
        name: data.name,
        count: data.trackCount,
        tracks: data.tracks || [],
        usedFallback: data.usedFallback || false,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlaylist(null);
    setError(null);
  };

  return (
    <>
      {/* Background */}
      <div className="bg-mesh"></div>
      <div className="bg-blob-accent"></div>

      <main className="container">
        {/* Left Panel - Player Style */}
        <div className="glass-panel player-panel">
          <div className="panel-header">
            <span className="header-title">Now Creating</span>
          </div>

          <div className="album-art-container">
            <div className="album-art">
              {selectedGenre && (
                <div className="album-overlay">
                  <span className="album-genre-icon">{selectedGenre.icon}</span>
                </div>
              )}
            </div>
          </div>

          <div className="track-info">
            <h2 className="track-title">
              {selectedGenre ? selectedGenre.label : "Select a Genre"}
            </h2>
            <p className="track-artist">
              {selectedMood
                ? `${selectedMood.icon} ${selectedMood.label} · ${selectedEra?.label} · ${DURATIONS.find(d => d.id === duration)?.label}`
                : "Choose your mood to begin"}
            </p>
          </div>

          {/* Duration */}
          <div className="duration-bar">
            {DURATIONS.map((d) => (
              <button
                key={d.id}
                className={`duration-pill ${duration === d.id ? 'duration-pill-active' : ''}`}
                onClick={() => setDuration(d.id)}
                disabled={loading}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* Generate button */}
          <div className="controls">
            <button
              className={`play-btn ${loading ? 'loading' : ''}`}
              onClick={handleGenerate}
              disabled={!canGenerate}
              title={!genre || !mood ? "Select a genre and mood first" : "Generate Playlist"}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>

          <p className="generate-hint">
            {loading ? 'Generating your mix...' : !genre || !mood ? 'Select genre & mood' : 'Tap to generate'}
          </p>

          {error && (
            <div className="error-msg">{error}</div>
          )}
        </div>

        {/* Right Panel - Settings */}
        <div className="glass-panel list-panel">
          <div className="panel-header">
            <span className="header-title">Customize</span>
          </div>

          {/* Step 1: Genre */}
          <div className="section">
            <div className="section-label">
              <span className="section-number">1</span>
              <h3 className="section-title">Genre</h3>
            </div>
            <div className="chip-grid">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  className={`chip ${genre === g.id ? 'chip-active' : ''}`}
                  onClick={() => setGenre(g.id)}
                  disabled={loading}
                >
                  <span className="chip-icon">{g.icon}</span>
                  <span>{g.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Era */}
          <div className="section">
            <div className="section-label">
              <span className="section-number">2</span>
              <h3 className="section-title">Era</h3>
            </div>
            <div className="chip-grid">
              {ERAS.map((e) => (
                <button
                  key={e.id}
                  className={`chip ${era === e.id ? 'chip-active' : ''}`}
                  onClick={() => setEra(e.id)}
                  disabled={loading}
                >
                  <span>{e.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Mood */}
          <div className="section">
            <div className="section-label">
              <span className="section-number">3</span>
              <h3 className="section-title">Mood</h3>
            </div>
            <div className="chip-grid">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  className={`chip ${mood === m.id ? 'chip-active' : ''}`}
                  onClick={() => setMood(m.id)}
                  disabled={loading}
                >
                  <span className="chip-icon">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {playlist && (
            <div className="section">
              <div className="section-label">
                <span className="section-number">✓</span>
                <h3 className="section-title">Your Playlist</h3>
              </div>
              <PlaylistCard url={playlist.url} name={playlist.name} trackCount={playlist.count} tracks={playlist.tracks} usedFallback={playlist.usedFallback} />
              <button className="reset-btn" onClick={handleReset}>
                Generate Another
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
