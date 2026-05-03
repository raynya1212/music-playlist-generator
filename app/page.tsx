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
  { id: "classical", label: "Classical", icon: "🎻" },
  { id: "indie", label: "Indie", icon: "🌿" },
  { id: "country", label: "Country", icon: "🤠" },
  { id: "alternative", label: "Alternative", icon: "⚡" },
  { id: "chill", label: "Chill / Lo-fi", icon: "🌙" },
  { id: "dance", label: "Dance", icon: "💃" },
  { id: "blues", label: "Blues", icon: "🎵" },
  { id: "reggae", label: "Reggae", icon: "🌴" },
  { id: "metal", label: "Metal", icon: "🤘" },
  { id: "k-pop", label: "K-Pop", icon: "🇰🇷" },
  { id: "latin", label: "Latin", icon: "🔥" },
  { id: "folk", label: "Folk", icon: "🪕" },
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
  const [playlist, setPlaylist] = useState<{url: string, name: string, count: number} | null>(null);
  const [genre, setGenre] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [duration, setDuration] = useState<string>("60");

  const canGenerate = genre && mood && !loading;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ genre, mood, duration }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setPlaylist({
        url: data.playlistUrl,
        name: data.name,
        count: data.trackCount
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
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="shape-ring"></div>

      <main className="container">
        {/* Left Panel - Options */}
        <div className="glass-panel options-panel">
          <div className="panel-header">
            <span className="header-title">Create Your Mix</span>
          </div>

          {/* Genre Selection */}
          <div className="section">
            <h3 className="section-title">Genre</h3>
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

          {/* Mood Selection */}
          <div className="section">
            <h3 className="section-title">Mood</h3>
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

          {/* Duration */}
          <div className="section">
            <h3 className="section-title">Duration</h3>
            <div className="duration-toggle">
              {DURATIONS.map((d) => (
                <button
                  key={d.id}
                  className={`duration-btn ${duration === d.id ? 'duration-active' : ''}`}
                  onClick={() => setDuration(d.id)}
                  disabled={loading}
                >
                  <span className="duration-label">{d.label}</span>
                  <span className="duration-desc">{d.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Generate & Result */}
        <div className="glass-panel result-panel">
          <div className="panel-header">
            <span className="header-title">Result</span>
          </div>

          {/* Summary of selections */}
          <div className="selection-summary">
            <div className="summary-item">
              <span className="summary-label">Genre</span>
              <span className="summary-value">{genre ? GENRES.find(g => g.id === genre)?.label : '—'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Mood</span>
              <span className="summary-value">{mood ? MOODS.find(m => m.id === mood)?.label : '—'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Duration</span>
              <span className="summary-value">{DURATIONS.find(d => d.id === duration)?.label}</span>
            </div>
          </div>

          {/* Generate button */}
          <div className="generate-area">
            <button 
              className={`generate-btn ${loading ? 'loading' : ''}`}
              onClick={handleGenerate}
              disabled={!canGenerate}
              title={!genre || !mood ? "Select a genre and mood first" : "Generate Playlist"}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
            <p className="generate-hint">
              {loading ? 'Generating your mix...' : !genre || !mood ? 'Select genre & mood to start' : 'Tap to generate'}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="error-msg">
              {error}
            </div>
          )}

          {/* Result */}
          {playlist ? (
            <>
              <PlaylistCard url={playlist.url} name={playlist.name} trackCount={playlist.count} />
              <button className="reset-btn" onClick={handleReset}>
                Generate Another
              </button>
            </>
          ) : !loading && (
            <div className="placeholder-list">
              <div className="list-item" style={{ opacity: 0.4 }}>
                <div className="list-item-img" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="list-item-info">
                  <div style={{ width: '60%', height: '14px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}></div>
                  <div style={{ width: '40%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
              </div>
              <div className="list-item" style={{ opacity: 0.2 }}>
                <div className="list-item-img" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="list-item-info">
                  <div style={{ width: '70%', height: '14px', background: 'rgba(255,255,255,0.15)', borderRadius: '4px' }}></div>
                  <div style={{ width: '50%', height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
