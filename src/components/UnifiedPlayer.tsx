import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Maximize2, 
  ListMusic, 
  Tv, 
  Radio, 
  Disc3, 
  ExternalLink,
  Loader2,
  Mic2
} from 'lucide-react';
import { Song, RepeatMode, MusicProviderId } from '../types/music';
import { formatTime } from '../utils/musicLinks';

interface UnifiedPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  isBuffering: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  videoVisible: boolean;
  lyricsOpen: boolean;
  preferredProvider: MusicProviderId;
  queueCount: number;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onRewind10: () => void;
  onFastForward10: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleVideo: () => void;
  onToggleLyrics: () => void;
  onOpenTheater: () => void;
  onToggleQueue: () => void;
  onProviderChange: (provider: MusicProviderId) => void;
}

export const UnifiedPlayer: React.FC<UnifiedPlayerProps> = ({
  currentSong,
  isPlaying,
  isBuffering,
  currentTime,
  duration,
  volume,
  isMuted,
  repeatMode,
  isShuffle,
  videoVisible,
  lyricsOpen,
  preferredProvider,
  queueCount,
  onTogglePlay,
  onPrevious,
  onNext,
  onRewind10,
  onFastForward10,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleRepeat,
  onToggleShuffle,
  onToggleVideo,
  onToggleLyrics,
  onOpenTheater,
  onToggleQueue,
  onProviderChange,
}) => {
  const [isScrubbing, setIsScrubbing] = React.useState(false);
  const [scrubValue, setScrubValue] = React.useState(0);

  const displayTime = isScrubbing ? scrubValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;

  const handleScrubStart = () => {
    setIsScrubbing(true);
    setScrubValue(currentTime);
  };

  const handleScrubChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScrubValue(parseFloat(e.target.value));
  };

  const handleScrubEnd = () => {
    setIsScrubbing(false);
    onSeek(scrubValue);
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Disc3 className="w-5 h-5 text-slate-500 animate-spin" />
          <span>Select any song or click &quot;Play This Set&quot; to begin playback</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/90 shadow-2xl transition-all">
      {/* Top micro progress bar */}
      <div className="relative w-full h-1 bg-slate-800 overflow-hidden cursor-pointer group">
        <div 
          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-150"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
        
        {/* LEFT: Current Track Details */}
        <div className="flex items-center gap-3.5 w-full md:w-1/4 min-w-0">
          <div 
            onClick={onOpenTheater}
            className="relative w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/80 shadow-md group cursor-pointer"
            title="Open Fullscreen Theater"
          >
            {currentSong.youtubeVideoId ? (
              <img
                src={`https://img.youtube.com/vi/${currentSong.youtubeVideoId}/hqdefault.jpg`}
                alt={currentSong.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                <Disc3 className="w-6 h-6 animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4 
              onClick={onOpenTheater}
              className="text-sm font-bold text-white truncate hover:text-cyan-400 cursor-pointer transition-colors"
            >
              {currentSong.title}
            </h4>
            <p className="text-xs text-slate-400 truncate font-medium">
              {currentSong.artist}
            </p>
            {/* Quick Provider Icons for current song */}
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <a
                href={currentSong.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 flex items-center gap-0.5"
                title="Launch in Spotify"
              >
                <Disc3 className="w-3 h-3 text-emerald-400" />
                <span>Spotify</span>
              </a>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <a
                href={currentSong.youtubeMusicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-amber-400 flex items-center gap-0.5"
                title="Launch in YouTube Music"
              >
                <Radio className="w-3 h-3 text-amber-400" />
                <span>YT Music</span>
              </a>
            </div>
          </div>
        </div>

        {/* CENTER: Unified Playback Controls & Scrub Bar */}
        <div className="flex flex-col items-center w-full md:w-2/4 max-w-xl">
          {/* Main Button Cluster */}
          <div className="flex items-center gap-2 sm:gap-4 mb-1.5">
            {/* Shuffle */}
            <button
              onClick={onToggleShuffle}
              className={`p-2 rounded-lg text-xs transition-colors ${
                isShuffle ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-white'
              }`}
              title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Previous Song */}
            <button
              onClick={onPrevious}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Previous song (P)"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Rewind 10 Seconds */}
            <button
              onClick={onRewind10}
              className="px-2 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px] font-mono"
              title="Rewind 10 seconds (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">10s</span>
            </button>

            {/* Play / Pause Master Button */}
            <button
              onClick={onTogglePlay}
              className="w-11 h-11 rounded-full bg-cyan-400 hover:bg-cyan-300 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 active:scale-95"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isBuffering ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
              )}
            </button>

            {/* Fast Forward 10 Seconds */}
            <button
              onClick={onFastForward10}
              className="px-2 py-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px] font-mono"
              title="Fast forward 10 seconds (Right Arrow)"
            >
              <span className="hidden sm:inline">10s</span>
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Next Song */}
            <button
              onClick={onNext}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Next song (N)"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Repeat Mode */}
            <button
              onClick={onToggleRepeat}
              className={`p-2 rounded-lg text-xs transition-colors ${
                repeatMode !== 'off' ? 'text-cyan-400 bg-cyan-950/40' : 'text-slate-400 hover:text-white'
              }`}
              title={`Repeat: ${repeatMode.toUpperCase()}`}
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Time Scrubber */}
          <div className="w-full flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="w-10 text-right">{formatTime(displayTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.5}
                value={displayTime}
                onMouseDown={handleScrubStart}
                onTouchStart={handleScrubStart}
                onChange={handleScrubChange}
                onMouseUp={handleScrubEnd}
                onTouchEnd={handleScrubEnd}
                className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* RIGHT: Volume, Video Dock, and Queue Drawer Buttons */}
        <div className="flex items-center justify-end gap-2 w-full md:w-1/4">
          {/* Volume Control */}
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <button
              onClick={onToggleMute}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Lyrics Drawer Toggle */}
          <button
            onClick={onToggleLyrics}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
              lyricsOpen
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-white'
            }`}
            title={lyricsOpen ? 'Hide Song Lyrics' : 'Show Song Lyrics'}
          >
            <Mic2 className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-medium hidden xl:inline">Lyrics</span>
          </button>

          {/* Video Floating Window Toggle */}
          <button
            onClick={onToggleVideo}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition-all ${
              videoVisible
                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 shadow-sm'
                : 'bg-slate-800/80 border-slate-700/70 text-slate-400 hover:text-white'
            }`}
            title={videoVisible ? 'Hide Picture-in-Picture Video' : 'Show Picture-in-Picture Video'}
          >
            <Tv className="w-4 h-4" />
            <span className="text-[11px] font-medium hidden xl:inline">Video</span>
          </button>

          {/* Fullscreen Theater Button */}
          <button
            onClick={onOpenTheater}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 border border-slate-700/70 transition-colors"
            title="Open Fullscreen Visualizer & Theater (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Queue Drawer Button */}
          <button
            onClick={onToggleQueue}
            className="p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/70 flex items-center gap-1.5 transition-colors relative"
            title="Up Next Playlist Queue"
          >
            <ListMusic className="w-4 h-4 text-cyan-400" />
            {queueCount > 0 && (
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950">
                {queueCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
