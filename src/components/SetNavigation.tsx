import React from 'react';
import { Search, Filter, Layers, HeartHandshake, Flame, Sparkles, Music, Plus, Settings2, ListMusic } from 'lucide-react';
import { Playlist } from '../types/music';

interface SetNavigationProps {
  playlists: Playlist[];
  activePlaylistId: string; // 'all' | playlistId
  onSelectPlaylist: (playlistId: string) => void;
  onOpenNewPlaylist: () => void;
  onOpenManagePlaylists: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedVibe: string;
  onSelectVibe: (vibe: string) => void;
  availableVibes: string[];
  countsByPlaylist: Record<string, number>;
}

export const SetNavigation: React.FC<SetNavigationProps> = ({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onOpenNewPlaylist,
  onOpenManagePlaylists,
  searchQuery,
  onSearchChange,
  selectedVibe,
  onSelectVibe,
  availableVibes,
  countsByPlaylist,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Set & Playlist Switcher Tabs */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-900/80 border border-slate-800 rounded-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-x-auto no-scrollbar">
          {/* All Tracks */}
          <button
            onClick={() => onSelectPlaylist('all')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activePlaylistId === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>All Tracks</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                activePlaylistId === 'all'
                  ? 'bg-cyan-600/30 text-slate-900'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {countsByPlaylist['all'] || 0}
            </span>
          </button>

          {/* Each Playlist / Set */}
          {playlists.map((pl) => {
            const isActive = activePlaylistId === pl.id;
            const count = countsByPlaylist[pl.id] || pl.songIds.length || 0;

            return (
              <button
                key={pl.id}
                onClick={() => onSelectPlaylist(pl.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {pl.id === 'set-1' && <HeartHandshake className="w-3.5 h-3.5 text-sky-400" />}
                {pl.id === 'set-2' && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                {pl.id === 'set-3' && <Sparkles className="w-3.5 h-3.5 text-pink-400" />}
                {pl.id !== 'set-1' && pl.id !== 'set-2' && pl.id !== 'set-3' && (
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: pl.accentColor || '#06b6d4' }}
                  />
                )}
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{pl.name}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-800/80 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Playlist Management Buttons */}
        <div className="flex items-center gap-1 shrink-0 pl-2 border-l border-slate-800">
          <button
            onClick={onOpenNewPlaylist}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-medium"
            title="Create New Playlist"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">New Playlist</span>
          </button>

          <button
            onClick={onOpenManagePlaylists}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Manage All Playlists (Rename, Delete, Reorder, Export)"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search song title, artist, or lyric snippet..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/70 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Vibe Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => onSelectVibe('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedVibe === 'all'
                ? 'bg-slate-700 text-cyan-300'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Vibes
          </button>
          {availableVibes.map((vibe) => (
            <button
              key={vibe}
              onClick={() => onSelectVibe(vibe)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedVibe === vibe
                  ? 'bg-slate-700 text-cyan-300'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {vibe}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
