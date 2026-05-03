import React from 'react';

interface PlaylistCardProps {
  url: string;
  name: string;
  trackCount: number;
}

export function PlaylistCard({ url, name, trackCount }: PlaylistCardProps) {
  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      <div className="list-item">
        <div className="list-item-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1614149162883-504ce4d13909?q=80&w=200&auto=format&fit=crop)' }}></div>
        <div className="list-item-info">
          <h4 className="list-item-title" style={{ color: 'var(--text-primary)' }}>{name}</h4>
          <p className="list-item-subtitle">{trackCount} songs (1 Hour Mix)</p>
        </div>
        <div className="list-item-action">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Your playlist is ready to stream!
        </p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="play-btn"
          style={{ 
            textDecoration: 'none', 
            display: 'inline-flex',
            width: 'auto',
            padding: '0 2rem',
            height: '48px',
            borderRadius: '24px',
            fontSize: '0.95rem',
            fontWeight: 600,
            margin: '0 auto'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px', marginLeft: 0 }}>
            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
          </svg>
          Open in YouTube
        </a>
      </div>
    </div>
  );
}
