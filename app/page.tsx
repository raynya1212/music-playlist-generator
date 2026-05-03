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
    <>
      <div className="bg-shape shape-1"></div>
      <div className="bg-shape shape-2"></div>
      <div className="shape-ring"></div>

      <main className="container">
        {/* Left Panel - Generator */}
        <div className="glass-panel player-panel">
          <div className="panel-header">
            <span className="header-title">Generate mix</span>
          </div>

          <div className="album-art-container">
            <div className="album-art"></div>
          </div>

          <div className="track-info">
            <h2 className="track-title">AI Playlist Generator</h2>
            <p className="track-artist">Curated just for you</p>
          </div>

          <div className="controls">
            <button 
              className={`play-btn ${loading ? 'loading' : ''}`}
              onClick={handleGenerate}
              disabled={loading}
              title="Generate Playlist"
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              )}
            </button>
          </div>

          <p className="generate-hint">
            {loading ? 'Generating your mix...' : 'Tap to generate'}
          </p>
          
          {error && (
            <div style={{ marginTop: '1rem', color: '#ffb8b8', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Result */}
        <div className="glass-panel list-panel">
          <div className="panel-header">
            <span className="header-title">Result</span>
          </div>
          
          {playlist ? (
            <PlaylistCard url={playlist.url} name={playlist.name} trackCount={playlist.count} />
          ) : (
            <div>
              <div className="list-item" style={{ opacity: 0.5 }}>
                <div className="list-item-img" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="list-item-info">
                  <div className="list-item-title" style={{ width: '60%', height: '14px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                  <div className="list-item-subtitle" style={{ width: '40%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
              </div>
              <div className="list-item" style={{ opacity: 0.3 }}>
                <div className="list-item-img" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="list-item-info">
                  <div className="list-item-title" style={{ width: '70%', height: '14px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                  <div className="list-item-subtitle" style={{ width: '50%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
              </div>
              <div className="list-item" style={{ opacity: 0.1 }}>
                <div className="list-item-img" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
                <div className="list-item-info">
                  <div className="list-item-title" style={{ width: '50%', height: '14px', background: 'rgba(255,255,255,0.2)', borderRadius: '4px' }}></div>
                  <div className="list-item-subtitle" style={{ width: '30%', height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '8px' }}></div>
                </div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Click the generate button<br/>to create your mix
              </p>
            </div>
          )}

        </div>
      </main>
    </>
  );
}
