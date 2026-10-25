import React from 'react';
import { Maximize2, Minimize2, X, Eye, EyeOff } from 'lucide-react';
import { Song } from '../types/music';

interface VideoDockProps {
  currentSong: Song | null;
  videoVisible: boolean;
  onToggleVisible: () => void;
  onOpenTheater: () => void;
  containerId: string;
}

export const VideoDock: React.FC<VideoDockProps> = ({
  currentSong,
  videoVisible,
  onToggleVisible,
  onOpenTheater,
  containerId,
}) => {
  return (
    <div
      className={`fixed bottom-24 right-4 z-40 transition-all duration-300 ease-in-out ${
        videoVisible
          ? 'w-72 sm:w-88 h-48 sm:h-56 opacity-100 translate-y-0 pointer-events-auto'
          : 'w-0 h-0 opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl shadow-cyan-950/40 flex flex-col">
        {/* Window Bar */}
        <div className="h-8 bg-slate-900/95 px-3 flex items-center justify-between border-b border-slate-800 text-xs text-slate-300 shrink-0 select-none">
          <div className="flex items-center gap-1.5 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-semibold truncate text-[11px]">
              {currentSong ? `${currentSong.title} · ${currentSong.artist}` : 'HarmoniQ Video Stream'}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={onOpenTheater}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Full Theater Mode"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggleVisible}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Minimize to Audio Only"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* The YouTube Iframe Container */}
        <div className="relative flex-1 w-full bg-black">
          <div id={containerId} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
