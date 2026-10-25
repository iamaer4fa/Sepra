import React, { useState } from 'react';
import { X, Check, Youtube, Disc3, Radio, HelpCircle } from 'lucide-react';
import { Song } from '../types/music';
import { extractYouTubeId, buildProviderLinks } from '../utils/musicLinks';

interface EditSongModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onSave: (updatedSong: Song) => void;
  sets: { id: string; name: string }[];
}

export const EditSongModal: React.FC<EditSongModalProps> = ({
  isOpen,
  onClose,
  song,
  onSave,
  sets,
}) => {
  const [title, setTitle] = useState(song?.title || '');
  const [artist, setArtist] = useState(song?.artist || '');
  const [setId, setSetId] = useState(song?.setId || 'set-1');
  const [youtubeInput, setYoutubeInput] = useState(song?.youtubeVideoId || '');
  const [vibe, setVibe] = useState(song?.vibe || '');
  const [notes, setNotes] = useState(song?.notes || '');
  const [year, setYear] = useState(song?.year || '');

  React.useEffect(() => {
    if (song) {
      setTitle(song.title);
      setArtist(song.artist);
      setSetId(song.setId);
      setYoutubeInput(song.youtubeVideoId);
      setVibe(song.vibe);
      setNotes(song.notes || '');
      setYear(song.year || '');
    }
  }, [song]);

  if (!isOpen || !song) return null;

  const handleSave = () => {
    const cleanYtId = extractYouTubeId(youtubeInput);
    const links = buildProviderLinks(title, artist, cleanYtId);

    const updated: Song = {
      ...song,
      title: title.trim(),
      artist: artist.trim(),
      setId,
      youtubeVideoId: cleanYtId,
      youtubeUrl: links.youtubeUrl,
      youtubeMusicUrl: links.youtubeMusicUrl,
      spotifyUrl: links.spotifyUrl,
      appleMusicUrl: links.appleMusicUrl,
      deezerUrl: links.deezerUrl,
      vibe: vibe.trim() || 'Custom Pick',
      notes: notes.trim(),
      year: year.trim(),
    };

    onSave(updated);
    onClose();
  };

  const previewYtId = extractYouTubeId(youtubeInput);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-white">Edit Song & Provider Links</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Title & Artist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Song Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Artist</label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Set Playlist Selection */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Assigned Set</label>
            <select
              value={setId}
              onChange={(e) => setSetId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              {sets.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
              <option value="custom">Custom Set</option>
            </select>
          </div>

          {/* YouTube Video ID or URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-medium flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>YouTube Video ID or Full Link</span>
              </label>
              <span className="text-[11px] text-slate-500">
                e.g. {previewYtId || 'qso3MZk1eG4'}
              </span>
            </div>
            <input
              type="text"
              value={youtubeInput}
              onChange={(e) => setYoutubeInput(e.target.value)}
              placeholder="Paste YouTube URL or 11-char Video ID"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
            />
            {previewYtId && (
              <div className="mt-2 flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <img
                  src={`https://img.youtube.com/vi/${previewYtId}/hqdefault.jpg`}
                  alt="thumbnail"
                  className="w-10 h-7 object-cover rounded"
                />
                <span className="truncate">Preview detected ID: <span className="text-cyan-400 font-mono">{previewYtId}</span></span>
              </div>
            )}
          </div>

          {/* Vibe and Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Vibe / Genre</label>
              <input
                type="text"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                placeholder="e.g. Disco, Acoustic, OPM"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Year</label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="e.g. 1983"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-slate-400 font-medium mb-1">Notes / DJ Cue</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Horn section buildup, karaoke crowd favorite"
              className="w-full p-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || !artist.trim()}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
          >
            <Check className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
