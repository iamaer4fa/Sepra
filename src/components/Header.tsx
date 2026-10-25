import React from 'react';
import { 
  Radio, 
  Sparkles, 
  Plus, 
  Upload, 
  Download, 
  Disc, 
  ExternalLink,
  Flame,
  Volume2,
  Mic2,
  ListMusic
} from 'lucide-react';
import { MusicProviderId } from '../types/music';

interface HeaderProps {
  preferredProvider: MusicProviderId;
  onProviderChange: (provider: MusicProviderId) => void;
  partyModeActive: boolean;
  onTogglePartyMode: () => void;
  onOpenImport: () => void;
  onOpenAddSong: () => void;
  onOpenManagePlaylists: () => void;
  onToggleLyrics: () => void;
  lyricsOpen: boolean;
  onExport: () => void;
  totalSongs: number;
  currentSongTitle?: string;
  isPlaying?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  preferredProvider,
  onProviderChange,
  partyModeActive,
  onTogglePartyMode,
  onOpenImport,
  onOpenAddSong,
  onOpenManagePlaylists,
  onToggleLyrics,
  lyricsOpen,
  onExport,
  totalSongs,
  currentSongTitle,
  isPlaying,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/10">
            <Radio className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                HarmoniQ
              </span>
              <span className="text-[11px] font-mono tracking-wider px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
                Streamer
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Unified YouTube · Spotify · Setlist Player
            </p>
          </div>
        </div>

        {/* Center Live Ticker (if playing) */}
        {currentSongTitle && (
          <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 max-w-sm truncate shadow-inner">
            <div className="flex items-end gap-0.5 h-3.5 w-3.5">
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-1' : 'h-1'}`} />
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-2' : 'h-2'}`} />
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-3' : 'h-3'}`} />
            </div>
            <span className="text-slate-400 font-medium">Now:</span>
            <span className="text-slate-200 font-semibold truncate">{currentSongTitle}</span>
          </div>
        )}

        {/* Right Actions & Provider Selector */}
        <div className="flex items-center gap-2.5">
          {/* Preferred Provider Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            <span className="px-2 text-slate-400 font-medium text-[11px]">Provider:</span>
            <button
              onClick={() => onProviderChange('youtube')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                preferredProvider === 'youtube'
                  ? 'bg-red-600/90 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="YouTube IFrame Player (In-App Audio & Video)"
            >
              <span className="w-2 h-2 rounded-full bg-red-400" />
              YouTube
            </button>
            <button
              onClick={() => onProviderChange('spotify')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                preferredProvider === 'spotify'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Spotify Direct Integration"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Spotify
            </button>
            <button
              onClick={() => onProviderChange('youtubemusic')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                preferredProvider === 'youtubemusic'
                  ? 'bg-red-500/80 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="YouTube Music"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              YT Music
            </button>
          </div>

          {/* Playlists Manager */}
          <button
            onClick={onOpenManagePlaylists}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 flex items-center gap-1.5 transition-colors"
            title="Manage Playlists"
          >
            <ListMusic className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Playlists</span>
          </button>

          {/* Lyrics Drawer Toggle */}
          <button
            onClick={onToggleLyrics}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              lyricsOpen
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}
            title="Toggle Song Lyrics Panel"
          >
            <Mic2 className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Lyrics</span>
          </button>

          {/* Party Mode Toggle */}
          <button
            onClick={onTogglePartyMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              partyModeActive
                ? 'bg-gradient-to-r from-amber-500/20 to-rose-500/20 border-rose-500/60 text-rose-300 shadow-md shadow-rose-950/40 animate-pulse'
                : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}
            title="Auto-transition continuously through Set 1 -> Set 2 -> Set 3"
          >
            <Flame className={`w-3.5 h-3.5 ${partyModeActive ? 'text-rose-400' : 'text-amber-400'}`} />
            <span className="hidden sm:inline">Party Flow</span>
          </button>

          {/* Import / Paste List */}
          <button
            onClick={onOpenImport}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 flex items-center gap-1.5 transition-colors"
            title="Import or paste your song text list"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Import List</span>
          </button>

          {/* Add Single Song */}
          <button
            onClick={onOpenAddSong}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-900/30 flex items-center gap-1.5 transition-all"
            title="Add a song manually"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Track</span>
          </button>

          {/* Export */}
          <button
            onClick={onExport}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title="Export setlist as JSON"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
