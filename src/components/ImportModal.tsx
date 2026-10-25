import React, { useState } from 'react';
import { X, Upload, Check, Music2, AlertCircle, Sparkles } from 'lucide-react';
import { Song } from '../types/music';
import { parseRawSongText } from '../utils/musicLinks';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSongs: (songs: Song[], targetSetId: string, customSetName?: string) => void;
  currentSetId: string;
}

const SAMPLE_RAW_TEXT = `1\tLeader of the Band\tDan Fogelberg
2\tHopelessly Devoted to You\tOlivia Newton-John
3\tCan't Take My Eyes Off You\tFrankie Valli
4\tTotal Eclipse of the Heart\tBonnie Tyler
5\tMaking Love Out of Nothing at All\tAir Supply
6\tSway\tMichael Bublé
7\tDi Bale Na Lang\tRegine Velasquez
8\tDon Romantico\tVhong Navarro
9\tBuild Me Up Buttercup\tThe Foundations
10\tLike a Virgin\tMadonna`;

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onImportSongs,
  currentSetId,
}) => {
  const [rawText, setRawText] = useState(SAMPLE_RAW_TEXT);
  const [targetSet, setTargetSet] = useState<string>(currentSetId === 'all' ? 'custom' : currentSetId);
  const [customSetName, setCustomSetName] = useState('My Custom Set');
  const [parsedPreview, setParsedPreview] = useState<Partial<Song>[]>([]);

  // Parse as user types or pastes
  React.useEffect(() => {
    if (!rawText.trim()) {
      setParsedPreview([]);
      return;
    }
    const results = parseRawSongText(rawText, targetSet);
    setParsedPreview(results);
  }, [rawText, targetSet]);

  if (!isOpen) return null;

  const handleImport = () => {
    if (parsedPreview.length === 0) return;

    const songsToImport: Song[] = parsedPreview.map((item, idx) => ({
      id: item.id || `custom-${Date.now()}-${idx}`,
      no: item.no || idx + 1,
      title: item.title || 'Untitled Track',
      artist: item.artist || 'Unknown Artist',
      setId: targetSet,
      youtubeVideoId: item.youtubeVideoId || '',
      youtubeUrl: item.youtubeUrl || '',
      youtubeMusicUrl: item.youtubeMusicUrl || '',
      spotifyUrl: item.spotifyUrl || '',
      appleMusicUrl: item.appleMusicUrl || '',
      deezerUrl: item.deezerUrl || '',
      durationSec: item.durationSec || 210,
      vibe: item.vibe || 'Custom Pick',
      notes: item.notes || 'Imported track',
    }));

    onImportSongs(songsToImport, targetSet, targetSet === 'custom' ? customSetName : undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Import & Link Song Setlist</h3>
              <p className="text-xs text-slate-400">
                Paste any song list (table, numbered list, or text). YouTube & Spotify links are generated automatically.
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Target set destination */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">
                Destination Playlist / Set:
              </label>
              <select
                value={targetSet}
                onChange={(e) => setTargetSet(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="set-1">Set 1: Mellow Songs & Romantic Favorites</option>
                <option value="set-2">Set 2: Upbeat Classics & OPM Sing-Alongs</option>
                <option value="set-3">Set 3: Disco Party Hits & High-Energy OPM</option>
                <option value="custom">Create as New Custom Set</option>
              </select>
            </div>

            {targetSet === 'custom' && (
              <div>
                <label className="block text-slate-400 font-medium mb-1">
                  Custom Set Name:
                </label>
                <input
                  type="text"
                  value={customSetName}
                  onChange={(e) => setCustomSetName(e.target.value)}
                  placeholder="e.g. Acoustic Cafe, 90s Rock Set"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}
          </div>

          {/* Text Area */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <label className="font-medium">Paste Song List Text:</label>
              <span className="text-[11px] text-cyan-400">
                Formats: &quot;1. Song - Artist&quot;, &quot;No. Title Artist&quot; or tab-separated
              </span>
            </div>
            <textarea
              rows={7}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste song titles and artists here..."
              className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Quick Preload buttons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Quick Examples:</span>
            <button
              onClick={() => setRawText(SAMPLE_RAW_TEXT)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Set 1 Sample
            </button>
            <button
              onClick={() =>
                setRawText(
                  `1\tSeptember\tEarth, Wind & Fire\n2\tFootloose\tKenny Loggins\n3\tLigaya\tEraserheads\n4\tAwitin Mo at Isasayaw Ko\tVST & Company\n5\tHot Stuff\tDonna Summer`
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Set 2 Sample
            </button>
            <button
              onClick={() =>
                setRawText(
                  `1\tDancing Queen\tABBA\n2\tStayin' Alive\tBee Gees\n3\tMambo No. 5\tLou Bega\n4\tTotoy Bibo\tVhong Navarro\n5\tSumayaw, Sumunod\tThe Boyfriends`
                )
              }
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Set 3 Sample
            </button>
          </div>

          {/* Real-time Parser Preview */}
          <div className="border border-slate-800 rounded-xl bg-slate-950/60 p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Parsed Track Preview ({parsedPreview.length} tracks detected)
              </span>
            </div>

            {parsedPreview.length === 0 ? (
              <p className="text-xs text-slate-500 py-3 text-center">
                Paste songs above to see detected tracks and provider links.
              </p>
            ) : (
              <div className="max-h-44 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
                {parsedPreview.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-1 px-2 rounded bg-slate-900 border border-slate-800/80 text-slate-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-slate-500 w-5">{item.no || idx + 1}.</span>
                      <span className="font-semibold text-white truncate">{item.title}</span>
                      <span className="text-slate-400 truncate">by {item.artist}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 shrink-0">
                      Auto-Linked
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {parsedPreview.length} songs ready to add
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={parsedPreview.length === 0}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
            >
              <Check className="w-4 h-4" />
              <span>Import to Playlist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
