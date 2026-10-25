import React from 'react';
import { 
  Play, 
  Shuffle, 
  Clock, 
  Music2, 
  Sparkles, 
  HeartHandshake, 
  Flame, 
  Edit3, 
  Trash2, 
  Download,
  ListMusic
} from 'lucide-react';
import { Playlist } from '../types/music';

interface SetHeroBannerProps {
  currentPlaylist: Playlist | null; // null if "all"
  songCount: number;
  totalDurationSec: number;
  onPlaySet: () => void;
  onShuffleSet: () => void;
  isPlayingCurrentSet: boolean;
  onEditPlaylist?: () => void;
  onDeletePlaylist?: () => void;
  onExportPlaylist?: () => void;
}

export const SetHeroBanner: React.FC<SetHeroBannerProps> = ({
  currentPlaylist,
  songCount,
  totalDurationSec,
  onPlaySet,
  onShuffleSet,
  isPlayingCurrentSet,
  onEditPlaylist,
  onDeletePlaylist,
  onExportPlaylist,
}) => {
  const formatTotalTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    if (hrs > 0) return `${hrs}h ${remMins}m`;
    return `${mins} mins`;
  };

  const getSetIcon = () => {
    if (!currentPlaylist) return <Music2 className="w-8 h-8 text-cyan-400" />;
    if (currentPlaylist.id === 'set-1') return <HeartHandshake className="w-8 h-8 text-sky-400" />;
    if (currentPlaylist.id === 'set-2') return <Flame className="w-8 h-8 text-amber-400" />;
    if (currentPlaylist.id === 'set-3') return <Sparkles className="w-8 h-8 text-pink-400" />;
    return <ListMusic className="w-8 h-8" style={{ color: currentPlaylist.accentColor || '#06b6d4' }} />;
  };

  const getGradient = () => {
    if (!currentPlaylist) return 'from-cyan-950/60 via-slate-900 to-slate-900 border-cyan-800/40';
    if (currentPlaylist.id === 'set-1') return 'from-sky-950/60 via-slate-900 to-slate-900 border-sky-800/40';
    if (currentPlaylist.id === 'set-2') return 'from-amber-950/60 via-slate-900 to-slate-900 border-amber-800/40';
    if (currentPlaylist.id === 'set-3') return 'from-pink-950/60 via-slate-900 to-slate-900 border-pink-800/40';
    return 'from-slate-900 via-slate-900 to-slate-900 border-slate-700/80';
  };

  const title = currentPlaylist ? currentPlaylist.name : 'All Night Setlist Tracks';
  const subtitle = currentPlaylist?.subtitle || (currentPlaylist ? 'Custom Curated Playlist' : 'Complete 3-Set event progression from acoustic warm-up to disco dance climax');
  const description = currentPlaylist?.description || 'Curated 3-stage party playlist: Mellow & Romantic warm-up, Upbeat 80s & OPM classics, and full dance floor disco hits.';

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${getGradient()} border p-5 sm:p-7 mb-6 shadow-xl`}>
      {/* Subtle ambient light */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-lg">
            {getSetIcon()}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-1">
              <span>{currentPlaylist?.vibe || 'Curated Collection'}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Music2 className="w-3.5 h-3.5 text-slate-400" />
                {songCount} Tracks
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatTotalTime(totalDurationSec)}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-xs sm:text-sm font-medium text-cyan-300/90 mt-0.5">
              {subtitle}
            </p>
            <p className="text-xs text-slate-300/80 mt-1.5 max-w-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            onClick={onPlaySet}
            disabled={songCount === 0}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{isPlayingCurrentSet ? 'Restart Playlist' : 'Play Playlist'}</span>
          </button>
          
          <button
            onClick={onShuffleSet}
            disabled={songCount === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 disabled:opacity-50 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all hover:text-white"
            title="Shuffle songs in this playlist"
          >
            <Shuffle className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Shuffle</span>
          </button>

          {/* Custom Playlist controls: Edit, Export, Delete */}
          {currentPlaylist && (
            <div className="flex items-center gap-1.5 pl-1">
              {onExportPlaylist && (
                <button
                  onClick={onExportPlaylist}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-400 border border-slate-700/80 transition-colors"
                  title="Export playlist JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}

              {onEditPlaylist && (
                <button
                  onClick={onEditPlaylist}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-amber-400 border border-slate-700/80 transition-colors"
                  title="Rename & Edit Playlist"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}

              {!currentPlaylist.isSystem && onDeletePlaylist && (
                <button
                  onClick={onDeletePlaylist}
                  className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700/80 transition-colors"
                  title="Delete Playlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
