import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  Mic2, 
  X, 
  RotateCcw, 
  Search, 
  Edit3, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Loader2,
  ScrollText,
  Volume2
} from 'lucide-react';
import { Song, SongLyrics, LyricLine } from '../types/music';
import { fetchLyrics } from '../utils/lyricsService';
import { formatTime } from '../utils/musicLinks';

interface LyricsPanelProps {
  currentSong: Song | null;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onSeek: (seconds: number) => void;
  onClose?: () => void;
  onSaveCustomLyrics?: (songId: string, lyricsText: string) => void;
  isCompact?: boolean;
}

export const LyricsPanel: React.FC<LyricsPanelProps> = ({
  currentSong,
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onClose,
  onSaveCustomLyrics,
  isCompact = false,
}) => {
  const [lyricsData, setLyricsData] = useState<SongLyrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [customText, setCustomText] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Fetch lyrics whenever currentSong changes
  useEffect(() => {
    if (!currentSong) {
      setLyricsData(null);
      setIsLoading(false);
      setHasSearched(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setHasSearched(false);

    fetchLyrics(
      currentSong.title,
      currentSong.artist,
      currentSong.fullLyrics,
      currentSong.durationSec || duration
    ).then((result) => {
      if (!isMounted) return;
      setLyricsData(result);
      setIsLoading(false);
      setHasSearched(true);
      setCustomText(result?.plainText || currentSong.fullLyrics || '');
    });

    return () => {
      isMounted = false;
    };
  }, [currentSong?.id, currentSong?.title, currentSong?.artist, currentSong?.fullLyrics, duration]);

  // Determine active lyric line index based on currentTime
  const activeIndex = useMemo(() => {
    if (!lyricsData || lyricsData.lines.length === 0) return -1;
    const lines = lyricsData.lines;

    for (let i = lines.length - 1; i >= 0; i--) {
      if (currentTime >= lines[i].timeSec) {
        return i;
      }
    }
    return -1;
  }, [lyricsData, currentTime]);

  // Auto-scroll to active line
  useEffect(() => {
    if (!autoScroll || !activeLineRef.current || !containerRef.current) return;
    activeLineRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }, [activeIndex, autoScroll]);

  const handleSaveLyrics = () => {
    if (!currentSong) return;
    if (onSaveCustomLyrics) {
      onSaveCustomLyrics(currentSong.id, customText);
    }
    setIsEditing(false);
  };

  if (!currentSong) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <Mic2 className="w-12 h-12 text-slate-700 mb-3" />
        <p className="text-sm font-medium">No song playing</p>
        <p className="text-xs text-slate-600 mt-1">
          Play any track to view real-time lyrics
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900/95">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <Mic2 className="w-4 h-4" />
          </div>
          <div className="truncate">
            <h3 className="text-xs font-bold text-white truncate flex items-center gap-1.5">
              <span>Lyrics</span>
              {lyricsData?.isSynced && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 uppercase">
                  Synced
                </span>
              )}
            </h3>
            <p className="text-[11px] text-slate-400 truncate">
              {currentSong.title} · {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Auto-scroll toggle */}
          {lyricsData && lyricsData.lines.length > 0 && (
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                autoScroll
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/80'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={autoScroll ? 'Auto-scroll is ON' : 'Auto-scroll is OFF'}
            >
              Auto-Scroll
            </button>
          )}

          {/* Edit / Paste lyrics */}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Edit or paste lyrics"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-300">Finding lyrics for &quot;{currentSong.title}&quot;...</p>
            <p className="text-[11px] text-slate-500 mt-1">Checking synced lyrics catalog</p>
          </div>
        ) : isEditing ? (
          /* Custom Lyrics Editor */
          <div className="h-full flex flex-col p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Paste custom or LRC timestamped lyrics:</span>
              <span className="text-[10px] text-cyan-400 font-mono">[mm:ss.xx] optional</span>
            </div>
            <textarea
              rows={12}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Paste song lyrics here..."
              className="flex-1 w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveLyrics}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Lyrics</span>
              </button>
            </div>
          </div>
        ) : !lyricsData || lyricsData.lines.length === 0 ? (
          /* Lyrics Not Available Display */
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-4 text-slate-500">
              <ScrollText className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-200 mb-1">
              Lyrics not available
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              We couldn&apos;t find synchronized lyrics for &quot;{currentSong.title}&quot;. You can paste custom lyrics anytime.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-950/40 transition-all hover:scale-105"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Add / Paste Lyrics</span>
            </button>
          </div>
        ) : (
          /* Interactive Synced / Scrollable Lyrics View */
          <div
            ref={containerRef}
            className="h-full overflow-y-auto px-6 py-12 space-y-4 no-scrollbar scroll-smooth"
          >
            {lyricsData.lines.map((line, idx) => {
              const isActive = idx === activeIndex;
              const isPast = idx < activeIndex;

              return (
                <div
                  key={`${line.timeSec}-${idx}`}
                  ref={isActive ? activeLineRef : null}
                  onClick={() => onSeek(line.timeSec)}
                  className={`group relative py-1.5 px-3 rounded-xl transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-cyan-950/60 border border-cyan-500/40 shadow-lg shadow-cyan-950/30 text-cyan-200 scale-105'
                      : isPast
                      ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      : 'text-slate-400/90 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`font-semibold tracking-tight leading-relaxed transition-all ${
                        isActive
                          ? 'text-base sm:text-lg font-bold text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                          : isCompact
                          ? 'text-xs'
                          : 'text-sm sm:text-base font-medium'
                      }`}
                    >
                      {line.text}
                    </p>

                    {/* Timestamp hint on hover / active */}
                    <span
                      className={`text-[10px] font-mono shrink-0 pt-1 transition-opacity ${
                        isActive
                          ? 'text-cyan-400 font-bold opacity-100'
                          : 'text-slate-500 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {formatTime(line.timeSec)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {lyricsData && (
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-900/95 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span>Source: {lyricsData.source || 'Synced Library'}</span>
          <span>Click any line to jump audio</span>
        </div>
      )}
    </div>
  );
};
