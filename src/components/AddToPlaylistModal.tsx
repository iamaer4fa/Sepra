import React, { useState } from 'react';
import { X, Plus, Check, ListMusic, Music, Sparkles } from 'lucide-react';
import { Playlist, Song } from '../types/music';

interface AddToPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  playlists: Playlist[];
  onAddToPlaylist: (playlistId: string, songId: string) => void;
  onCreateAndAdd: (name: string, description: string, songId: string) => void;
}

export const AddToPlaylistModal: React.FC<AddToPlaylistModalProps> = ({
  isOpen,
  onClose,
  song,
  playlists,
  onAddToPlaylist,
  onCreateAndAdd,
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

  if (!isOpen || !song) return null;

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    onCreateAndAdd(newPlaylistName.trim(), newPlaylistDesc.trim(), song.id);
    setNewPlaylistName('');
    setNewPlaylistDesc('');
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ListMusic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Add to Playlist</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-[240px]">
                {song.title} · {song.artist}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {isCreatingNew ? (
            <form onSubmit={handleCreateNew} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Playlist Name *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="e.g. My Favorite Love Songs"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newPlaylistDesc}
                  onChange={(e) => setNewPlaylistDesc(e.target.value)}
                  placeholder="e.g. Mellow evening acoustic playlist"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingNew(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newPlaylistName.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create & Add</span>
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Button to start creating new */}
              <button
                onClick={() => setIsCreatingNew(true)}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/60 bg-slate-800/40 hover:bg-slate-800/80 text-xs font-semibold text-cyan-400 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Playlist</span>
              </button>

              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Select Existing Playlist
                </span>

                {playlists.map((pl) => {
                  const alreadyInPlaylist = pl.songIds.includes(song.id);

                  return (
                    <div
                      key={pl.id}
                      onClick={() => {
                        onAddToPlaylist(pl.id, song.id);
                        onClose();
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        alreadyInPlaylist
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-slate-900 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white"
                          style={{ backgroundColor: pl.accentColor || '#06b6d4' }}
                        >
                          <Music className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold truncate">{pl.name}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {pl.songIds.length} tracks
                          </p>
                        </div>
                      </div>

                      {alreadyInPlaylist ? (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </span>
                      ) : (
                        <button className="text-xs text-cyan-400 font-semibold hover:underline">
                          + Add
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
