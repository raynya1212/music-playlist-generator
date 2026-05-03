import React from 'react';

interface PlaylistCardProps {
  url: string;
  name: string;
  trackCount: number;
}

export function PlaylistCard({ url, name, trackCount }: PlaylistCardProps) {
  return (
    <div className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center', animation: 'pulse 0.5s ease-out' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }} className="text-gradient">
        Playlist Created Successfully!
      </h2>
      <p style={{ color: '#475569', marginBottom: '0.5rem' }}>
        <strong>Name:</strong> {name}
      </p>
      <p style={{ color: '#475569', marginBottom: '2rem' }}>
        <strong>Tracks:</strong> ~{trackCount} songs (1 Hour Mix)
      </p>
      
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn-primary"
        style={{ textDecoration: 'none', display: 'inline-block' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
        </svg>
        Listen on YouTube
      </a>
    </div>
  );
}
