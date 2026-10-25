import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  Download, 
  Upload, 
  Check, 
  FolderPlus, 
  ListMusic, 
  Music,
  Palette,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Playlist, Song } from '../types/music';

interface PlaylistManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  allSongs: Song[];
  onCreatePlaylist: (name: string, description: string, color: string) => void;
  onRenamePlaylist: (id: string, name: string, description: string, color: string) => void;
  onDeletePlaylist: (id: string) => void;
  onImportPlaylistData: (playlist: Playlist, songs?: Song[]) => void;
  onSelectPlaylist: (id: string) => void;
}

const PALETTE_COLORS = [
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#6366f1', // indigo
];

export const PlaylistManagerModal: React.FC<PlaylistManagerModalProps> = ({
  isOpen,
  onClose,
  playlists,
  allSongs,
  onCreatePlaylist,
  onRenamePlaylist,
  onDeletePlaylist,
  onImportPlaylistData,
  onSelectPlaylist,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formColor, setFormColor] = useState('#06b6d4');

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setFormName('');
    setFormDesc('');
    setFormColor(PALETTE_COLORS[Math.floor(Math.random() * PALETTE_COLORS.length)]);
    setIsCreating(true);
    setEditingId(null);
  };

  const handleStartEdit = (pl: Playlist) => {
    setEditingId(pl.id);
    setFormName(pl.name);
    setFormDesc(pl.description || '');
    setFormColor(pl.accentColor || '#06b6d4');
    setIsCreating(false);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (isCreating) {
      onCreatePlaylist(formName.trim(), formDesc.trim(), formColor);
      setIsCreating(false);
    } else if (editingId) {
      onRenamePlaylist(editingId, formName.trim(), formDesc.trim(), formColor);
      setEditingId(null);
    }
  };

  // Export a specific playlist with its songs as JSON
  const handleExportPlaylist = (pl: Playlist) => {
    const includedSongs = allSongs.filter((s) => pl.songIds.includes(s.id));
    const exportData = {
      playlist: pl,
      songs: includedSongs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harmoniq-playlist-${pl.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.playlist && json.playlist.name) {
          onImportPlaylistData(json.playlist, json.songs);
        } else if (json.name && Array.isArray(json.songIds)) {
          onImportPlaylistData(json as Playlist);
        } else {
          alert('Invalid playlist JSON format.');
        }
      } catch (err) {
        alert('Could not parse playlist JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <ListMusic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Manage Playlists</h3>
              <p className="text-xs text-slate-400">
                Create, rename, reorder, export and import your custom song playlists
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="px-5 py-3 bg-slate-800/40 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCreate}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Playlist</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Load playlist from a JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>Load Playlist JSON</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          <span className="text-xs text-slate-400 font-mono">
            {playlists.length} Playlists Total
          </span>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Create or Edit Form */}
          {(isCreating || editingId) && (
            <form
              onSubmit={handleSaveForm}
              className="p-4 rounded-xl bg-slate-800/70 border border-cyan-500/40 space-y-3"
            >
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
                {isCreating ? 'New Playlist' : 'Rename / Edit Playlist'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">
                    Playlist Name *
                  </label>
                  <input
                    type="text"
                    autoFocus
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Acoustic Evening"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 font-medium mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    placeholder="e.g. Warm acoustic tracks"
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Color picker */}
              <div>
                <label className="block text-xs text-slate-400 font-medium mb-1.5">
                  Theme Accent Color:
                </label>
                <div className="flex items-center gap-2">
                  {PALETTE_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormColor(color)}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        formColor === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingId(null);
                  }}
                  className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formName.trim()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isCreating ? 'Create Playlist' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Playlists */}
          <div className="space-y-2">
            {playlists.map((pl) => {
              const songCount = pl.songIds.length;

              return (
                <div
                  key={pl.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  {/* Left: Info */}
                  <div
                    onClick={() => {
                      onSelectPlaylist(pl.id);
                      onClose();
                    }}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md text-white font-bold"
                      style={{ backgroundColor: pl.accentColor || '#06b6d4' }}
                    >
                      <Music className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-200 group-hover:text-cyan-400 truncate">
                          {pl.name}
                        </h4>
                        {pl.isSystem && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            Core Set
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        {pl.description || 'No description'}
                      </p>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {songCount} songs
                      </span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleExportPlaylist(pl)}
                      className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                      title="Save / Export this playlist as JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleStartEdit(pl)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                      title="Rename or edit playlist"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {!pl.isSystem ? (
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${pl.name}"?`)) {
                            onDeletePlaylist(pl.id);
                          }
                        }}
                        className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete playlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs text-slate-400">
          <span>Playlists are automatically saved in browser storage</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
