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
        {/* Left Panel - Player / Generator */}
        <div className="glass-panel player-panel">
          <div className="panel-header">
            <button className="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <span className="header-title">Generate mix</span>
            <button className="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>
            </button>
          </div>

          <div className="album-art-container">
            <div className="album-art"></div>
          </div>

          <div className="track-info">
            <h2 className="track-title">AI Playlist Generator</h2>
            <p className="track-artist">Curated just for you</p>
          </div>

          <div className="progress-bar-container">
            <span>0:00</span>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: loading ? '100%' : '30%', transition: loading ? 'width 10s ease-out' : 'width 0.3s ease' }}></div>
            </div>
            <span>60:00</span>
          </div>

          <div className="controls">
            <button className="ctrl-btn" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/></svg>
            </button>
            
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

            <button className="ctrl-btn" disabled={loading}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/></svg>
            </button>
          </div>
          
          {error && (
            <div style={{ marginTop: '1.5rem', color: '#ffb8b8', fontSize: '0.85rem', textAlign: 'center' }}>
              {error}
            </div>
          )}
        </div>

        {/* Right Panel - Result / Recommended */}
        <div className="glass-panel list-panel">
          <div className="panel-header">
            <button className="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <button className="icon-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 0h8v8h-8z"/></svg>
            </button>
          </div>

          <h3 className="section-title">Result</h3>
          
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
