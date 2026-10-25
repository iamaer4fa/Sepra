import React from 'react';
import { Song } from '../types/music';
import { LyricsPanel } from './LyricsPanel';

interface LyricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  onSaveCustomLyrics?: (songId: string, text: string) => void;
}

export const LyricsDrawer: React.FC<LyricsDrawerProps> = ({
  isOpen,
  onClose,
  currentSong,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onSaveCustomLyrics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] md:w-[480px] bg-slate-950/98 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col p-4 animate-in slide-in-from-right duration-300">
      <LyricsPanel
        currentSong={currentSong}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onSeek={onSeek}
        onClose={onClose}
        onSaveCustomLyrics={onSaveCustomLyrics}
      />
    </div>
  );
};
