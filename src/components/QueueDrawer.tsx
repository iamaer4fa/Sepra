import React from 'react';
import { X, Play, Trash2, ListMusic, Disc3, Sparkles } from 'lucide-react';
import { Song } from '../types/music';
import { formatTime } from '../utils/musicLinks';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onRemoveFromQueue: (index: number) => void;
  onClearQueue: () => void;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  currentSong,
  isPlaying,
  onPlaySong,
  onRemoveFromQueue,
  onClearQueue,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-slate-900/98 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListMusic className="w-5 h-5 text-cyan-400" />
          <h3 className="font-bold text-sm text-white">Up Next Playback Queue</h3>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
            {queue.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="text-xs text-slate-400 hover:text-rose-400 px-2 py-1 transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Now Playing Mini Card */}
      {currentSong && (
        <div className="p-4 bg-cyan-950/30 border-b border-cyan-800/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1.5 block">
            Now Playing
          </span>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-cyan-500/40">
              {currentSong.youtubeVideoId ? (
                <img
                  src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`}
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Disc3 className="w-full h-full p-2 text-slate-500" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{currentSong.title}</h4>
              <p className="text-[11px] text-slate-400 truncate">{currentSong.artist}</p>
            </div>
            <div className="flex items-end gap-0.5 h-3.5 w-3.5 shrink-0">
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-1' : 'h-1'}`} />
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-2' : 'h-2'}`} />
              <span className={`w-0.5 bg-cyan-400 rounded-full ${isPlaying ? 'animate-eq-3' : 'h-3'}`} />
            </div>
          </div>
        </div>
      )}

      {/* Upcoming List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Coming Up
        </span>

        {queue.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p>Your queue is currently empty.</p>
            <p className="mt-1 text-slate-400">
              The player will continue along the current setlist automatically.
            </p>
          </div>
        ) : (
          queue.map((song, idx) => (
            <div
              key={`${song.id}-${idx}`}
              className="group flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all text-xs"
            >
              <div
                onClick={() => onPlaySong(song)}
                className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
              >
                <span className="text-slate-400 font-mono w-4">{idx + 1}</span>
                <div className="min-w-0 flex-1">
                  <h5 className="font-semibold text-slate-200 truncate group-hover:text-cyan-400 transition-colors">
                    {song.title}
                  </h5>
                  <p className="text-slate-400 text-[11px] truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="font-mono text-[11px] text-slate-400 mr-1">
                  {formatTime(song.durationSec)}
                </span>
                <button
                  onClick={() => onRemoveFromQueue(idx)}
                  className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                  title="Remove from queue"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
