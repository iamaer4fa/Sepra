import React, { useState, useEffect } from 'react';
import { X, Check, RefreshCw, Youtube, Search, AlertCircle, Play, Sparkles } from 'lucide-react';
import { Song, MusicSource } from '../types/music';
import { CURATED_ALTERNATE_SOURCES, searchOnlineAlternativeSources } from '../utils/sourceResolver';
import { extractYouTubeId, buildProviderLinks } from '../utils/musicLinks';

interface SourcePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
  onSelectSource: (songId: string, newVideoId: string) => void;
}

export const SourcePickerModal: React.FC<SourcePickerModalProps> = ({
  isOpen,
  onClose,
  song,
  onSelectSource,
}) => {
  const [sources, setSources] = useState<MusicSource[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [testedId, setTestedId] = useState<string | null>(null);

  useEffect(() => {
    if (!song) return;
    const initialSources: MusicSource[] = [];

    // Current primary source
    if (song.youtubeVideoId) {
      initialSources.push({
        id: song.youtubeVideoId,
        label: 'Current Active Source',
        isWorking: !(song.failedSourceIds || []).includes(song.youtubeVideoId),
      });
    }

    // Curated alternates
    for (const [key, alternates] of Object.entries(CURATED_ALTERNATE_SOURCES)) {
      if (
        song.title.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(song.title.toLowerCase())
      ) {
        alternates.forEach((alt) => {
          if (!initialSources.some((s) => s.id === alt.id)) {
            initialSources.push({
              id: alt.id,
              label: alt.label,
              isWorking: !(song.failedSourceIds || []).includes(alt.id),
            });
          }
        });
      }
    }

    // Additional song fallbacks
    if (song.fallbackVideoIds) {
      song.fallbackVideoIds.forEach((id, idx) => {
        const cleanId = extractYouTubeId(id);
        if (cleanId && !initialSources.some((s) => s.id === cleanId)) {
          initialSources.push({
            id: cleanId,
            label: `Backup Source #${idx + 1}`,
            isWorking: !(song.failedSourceIds || []).includes(cleanId),
          });
        }
      });
    }

    setSources(initialSources);
    setManualInput('');
    setTestedId(null);
  }, [song]);

  if (!isOpen || !song) return null;

  const handleSearchMore = async () => {
    setIsSearchingOnline(true);
    try {
      const results = await searchOnlineAlternativeSources(song.title, song.artist);
      setSources((prev) => {
        const existingIds = new Set(prev.map((s) => s.id));
        const newOnes = results.filter((r) => !existingIds.has(r.id));
        return [...prev, ...newOnes];
      });
    } catch {
      // ignore
    } finally {
      setIsSearchingOnline(false);
    }
  };

  const handleApplyManual = () => {
    const cleanId = extractYouTubeId(manualInput);
    if (!cleanId) return;

    onSelectSource(song.id, cleanId);
    onClose();
  };

  const handleChoose = (videoId: string) => {
    onSelectSource(song.id, videoId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <Youtube className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Playback Sources & Fallbacks</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">
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
        <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
            <span className="font-semibold text-cyan-300">Auto-Recovery Active: </span>
            <span>
              If a video is deleted or has playback disabled by copyright owners, HarmoniQ automatically detects the error and switches to the next working audio stream.
            </span>
          </div>

          {/* List of Detected & Alternate Sources */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Available Sources ({sources.length})
            </span>

            {sources.map((src, idx) => {
              const isCurrent = song.youtubeVideoId === src.id;
              const isFailed = (song.failedSourceIds || []).includes(src.id);

              return (
                <div
                  key={`${src.id}-${idx}`}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/40 border-cyan-500/50'
                      : isFailed
                      ? 'bg-rose-950/20 border-rose-800/40 opacity-70'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    <img
                      src={`https://img.youtube.com/vi/${src.id}/hqdefault.jpg`}
                      alt="thumbnail"
                      className="w-12 h-8 rounded object-cover shrink-0 bg-slate-800"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-200 truncate">{src.label}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-mono px-1.5 rounded bg-cyan-900 text-cyan-300">
                            Current
                          </span>
                        )}
                        {isFailed && (
                          <span className="text-[10px] font-mono px-1.5 rounded bg-rose-950 text-rose-400">
                            Unavailable
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">{src.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleChoose(src.id)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isCurrent ? 'Playing' : 'Switch To'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search online button */}
          <button
            onClick={handleSearchMore}
            disabled={isSearchingOnline}
            className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSearchingOnline ? 'animate-spin' : ''}`} />
            <span>
              {isSearchingOnline ? 'Searching Alternative Sources...' : 'Find More Working Sources Online'}
            </span>
          </button>

          {/* Manual Input */}
          <div className="pt-2 border-t border-slate-800">
            <label className="block text-slate-400 font-medium mb-1">
              Or paste custom YouTube URL / Video ID:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleApplyManual}
                disabled={!manualInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
