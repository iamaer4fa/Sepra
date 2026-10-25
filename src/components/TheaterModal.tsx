import React, { useEffect, useRef, useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Disc3,
  Radio,
  Youtube,
  Sparkles,
  Music2,
  Tv,
  Mic2,
  Tv2
} from 'lucide-react';
import { Song, RepeatMode } from '../types/music';
import { formatTime } from '../utils/musicLinks';
import { LyricsPanel } from './LyricsPanel';

interface TheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  nextSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRewind10: () => void;
  onFastForward10: () => void;
  onSeek: (sec: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onSaveCustomLyrics?: (songId: string, lyricsText: string) => void;
}

export const TheaterModal: React.FC<TheaterModalProps> = ({
  isOpen,
  onClose,
  currentSong,
  nextSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  onTogglePlay,
  onPrevious,
  onNext,
  onRewind10,
  onFastForward10,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onSaveCustomLyrics,
}) => {
  const [activeTab, setActiveTab] = useState<'visualizer' | 'lyrics'>('lyrics');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Visualizer animation loop on canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 48;
      const barWidth = canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        const freq = isPlaying
          ? Math.sin(phase + i * 0.25) * 0.5 + 0.5
          : 0.08;
        const barHeight = Math.max(4, freq * (canvas.height * 0.8));
        const x = i * barWidth;
        const y = canvas.height - barHeight;

        const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
        grad.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.85)');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 1.5, y, barWidth - 3, barHeight);
      }

      if (isPlaying) {
        phase += 0.12;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen, isPlaying]);

  if (!isOpen || !currentSong) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-3xl flex flex-col justify-between p-4 sm:p-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 shrink-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold uppercase tracking-wider text-slate-200">
              HarmoniQ Theater
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
            <button
              onClick={() => setActiveTab('lyrics')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'lyrics'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              <span>Synced Lyrics</span>
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'visualizer'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv2 className="w-3.5 h-3.5" />
              <span>Stage & Visualizer</span>
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
          title="Exit Theater Mode (Esc)"
        >
          <X className="w-4 h-4" />
          <span className="text-xs font-semibold">Exit</span>
        </button>
      </div>

      {/* Main Center Stage */}
      <div className="my-auto max-w-5xl mx-auto w-full flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 py-4 min-h-[420px]">
        {/* Left: Giant Album Art & Track Header */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left shrink-0">
          <div className="relative w-56 sm:w-72 lg:w-80 aspect-square rounded-3xl bg-slate-900 overflow-hidden shadow-2xl shadow-cyan-950/60 border border-slate-700/80 group">
            {currentSong.youtubeVideoId ? (
              <img
                src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <Disc3 className="w-20 h-20 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
          </div>

          <div className="mt-4 max-w-xs">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
              Track {currentSong.no} · {currentSong.vibe}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-1 truncate">
              {currentSong.title}
            </h2>
            <p className="text-sm font-medium text-cyan-300 truncate">
              {currentSong.artist}
            </p>
          </div>

          {/* External provider badges */}
          <div className="mt-3 flex items-center gap-2 text-xs">
            <a
              href={currentSong.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 hover:text-white"
              title="Spotify"
            >
              <Disc3 className="w-4 h-4" />
            </a>
            <a
              href={currentSong.youtubeMusicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-300 hover:text-white"
              title="YouTube Music"
            >
              <Radio className="w-4 h-4" />
            </a>
            <a
              href={currentSong.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-red-950/60 border border-red-800/60 text-red-300 hover:text-white"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Dynamic Synced Lyrics Panel OR Stage Visualizer */}
        <div className="flex-1 w-full h-[400px] sm:h-[460px] min-w-0">
          {activeTab === 'lyrics' ? (
            <LyricsPanel
              currentSong={currentSong}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              onSeek={onSeek}
              onSaveCustomLyrics={onSaveCustomLyrics}
            />
          ) : (
            <div className="h-full flex flex-col justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              {currentSong.lyricsSnippet && (
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-200 text-base italic font-serif leading-relaxed">
                  &ldquo;{currentSong.lyricsSnippet}&rdquo;
                </div>
              )}

              {currentSong.notes && (
                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Setlist Note: </span>
                  {currentSong.notes}
                </p>
              )}

              {/* Sound Visualizer Canvas */}
              <div className="h-24 w-full rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden p-3">
                <canvas ref={canvasRef} width={500} height={96} className="w-full h-full" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls Bar */}
      <div className="max-w-3xl mx-auto w-full pt-2 shrink-0">
        {/* Scrubber */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2">
          <span className="w-12 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <span className="w-12">{formatTime(duration)}</span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onPrevious}
            className="p-2 sm:p-3 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Previous track"
          >
            <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={onRewind10}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-mono"
            title="Rewind 10 seconds"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>10s</span>
          </button>

          <button
            onClick={onTogglePlay}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/30 transition-transform hover:scale-105"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950" />
            ) : (
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-slate-950 ml-1" />
            )}
          </button>

          <button
            onClick={onFastForward10}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs font-mono"
            title="Fast forward 10 seconds"
          >
            <span>10s</span>
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onNext}
            className="p-2 sm:p-3 rounded-full text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Next track"
          >
            <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Next Up preview */}
        {nextSong && (
          <div className="mt-2 text-center text-xs text-slate-400">
            <span>Up Next: </span>
            <span className="font-semibold text-slate-200">{nextSong.title}</span>
            <span> by {nextSong.artist}</span>
          </div>
        )}
      </div>
    </div>
  );
};
