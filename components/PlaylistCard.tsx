import React from 'react';

interface PlaylistCardProps {
  url: string;
  name: string;
  trackCount: number;
  tracks: { title: string; artist: string }[];
  usedFallback: boolean;
}

export function PlaylistCard({ url, name, trackCount, tracks, usedFallback }: PlaylistCardProps) {
  return (
    <div>
      {/* Playlist header */}
      <div className="list-item">
        <div className="list-item-img" style={{ 
          background: 'var(--accent-light)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.2rem'
        }}>
          🎵
        </div>
        <div className="list-item-info">
          <h4 className="list-item-title">{name}</h4>
          <p className="list-item-subtitle">{trackCount} tracks</p>
        </div>
      </div>

      {/* Track list */}
      {tracks.length > 0 && (
        <div style={{ marginTop: '0.5rem', maxHeight: '240px', overflowY: 'auto' }}>
          {tracks.map((track, i) => (
            <div key={i} className="list-item" style={{ paddingLeft: '0.25rem' }}>
              <span style={{ 
                fontSize: '0.65rem', 
                color: 'var(--text-secondary)', 
                width: '22px', 
                textAlign: 'right', 
                marginRight: '0.75rem',
                flexShrink: 0,
                fontWeight: 600
              }}>
                {i + 1}
              </span>
              <div className="list-item-info">
                <p className="list-item-title" style={{ fontSize: '0.82rem' }}>{track.title}</p>
                <p className="list-item-subtitle">{track.artist}</p>
              </div>
              <a 
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.title} ${track.artist}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="list-item-action"
                title="Search on YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Open playlist button */}
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="play-btn"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            width: 'auto',
            padding: '0 1.5rem',
            height: '42px',
            borderRadius: '21px',
            fontSize: '0.82rem',
            fontWeight: 600,
            margin: '0 auto',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '6px', marginLeft: 0 }}>
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          {usedFallback ? 'Search on YouTube' : 'Play on YouTube'}
        </a>
      </div>
    </div>
  );
}
