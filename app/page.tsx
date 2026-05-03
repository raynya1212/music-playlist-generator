"use client";

import { useState } from "react";
import { PlaylistCard } from "../components/PlaylistCard";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playlist, setPlaylist] = useState<{url: string, name: string, count: number} | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
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

  return (
    <main className="container" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1.2 }}>
          AI Playlist Generator
        </h1>
        <p style={{ color: '#475569', fontSize: '1.125rem', marginBottom: '2.5rem' }}>
          Discover a curated 1-hour mix of Billboard Hot 100 chart-toppers, Spotify global streaming hits, and inspiring lesser-known tracks.
        </p>

        <div>
          <button 
            onClick={handleGenerate} 
            disabled={loading}
            className={`btn-primary ${loading ? 'animate-pulse-slow' : ''}`}
            style={{ width: '100%', maxWidth: '300px' }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Generating Magic...
              </>
            ) : (
              "Generate Playlist"
            )}
          </button>

          {error && (
            <div style={{ marginTop: '1.5rem', color: '#f87171', background: 'rgba(248, 113, 113, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(248, 113, 113, 0.2)' }}>
              {error}
            </div>
          )}

          {playlist && (
            <PlaylistCard 
              url={playlist.url} 
              name={playlist.name} 
              trackCount={playlist.count} 
            />
          )}
        </div>
      </div>
    </main>
  );
}
