import React from 'react';
import { 
  Play, 
  Pause, 
  ExternalLink, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ListPlus,
  Youtube,
  Radio,
  Disc3,
  Check,
  ChevronUp,
  ChevronDown,
  Mic2,
  FolderPlus,
  RefreshCw
} from 'lucide-react';
import { Song, MusicProviderId } from '../types/music';
import { formatTime } from '../utils/musicLinks';

interface SongRowProps {
  song: Song;
  index: number;
  isCurrent: boolean;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onPause: () => void;
  onEdit: (song: Song) => void;
  onDelete: (songId: string) => void;
  onQueueNext: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onRemoveFromPlaylist?: (songId: string) => void;
  onOpenLyrics: (song: Song) => void;
  onOpenSourcePicker?: (song: Song) => void;
  canReorder?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  preferredProvider: MusicProviderId;
}

export const SongRow: React.FC<SongRowProps> = ({
  song,
  index,
  isCurrent,
  isPlaying,
  onPlay,
  onPause,
  onEdit,
  onDelete,
  onQueueNext,
  onAddToPlaylist,
  onMoveUp,
  onMoveDown,
  onRemoveFromPlaylist,
  onOpenLyrics,
  onOpenSourcePicker,
  canReorder = false,
  isFirst = false,
  isLast = false,
  preferredProvider,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleRowClick = () => {
    if (isCurrent && isPlaying) {
      onPause();
    } else {
      onPlay(song);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(song.youtubeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group relative flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border transition-all cursor-pointer ${
        isCurrent
          ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-950/30'
          : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700/80'
      }`}
    >
      {/* Left: Reorder arrows, Number/Play, Thumbnail, Title & Artist */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
        {/* Reorder Buttons (if within custom playlist) */}
        {canReorder && (
          <div className="flex flex-col items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onMoveUp && onMoveUp(index)}
              disabled={isFirst}
              className="p-0.5 text-slate-500 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
              title="Move Up in Playlist"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onMoveDown && onMoveDown(index)}
              disabled={isLast}
              className="p-0.5 text-slate-500 hover:text-cyan-400 disabled:opacity-20 disabled:hover:text-slate-500 transition-colors"
              title="Move Down in Playlist"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Track Number / Play Indicator */}
        <div className="w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center shrink-0">
          {isCurrent && isPlaying ? (
            <div className="flex items-end gap-0.5 h-4 w-4">
              <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-1" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-2" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-3" />
              <span className="w-0.5 bg-cyan-400 rounded-full animate-eq-4" />
            </div>
          ) : (
            <div className="relative w-7 sm:w-8 h-7 sm:h-8 flex items-center justify-center">
              <span className="text-xs font-mono text-slate-400 group-hover:opacity-0 transition-opacity">
                {song.no || index + 1}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay(song);
                }}
                className="absolute inset-0 flex items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-cyan-500 hover:text-slate-950"
                title="Play track"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          )}
        </div>

        {/* Thumbnail preview */}
        <div className="relative w-10 sm:w-11 h-10 sm:h-11 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700/60 shadow-sm">
          {song.youtubeVideoId ? (
            <img
              src={`https://img.youtube.com/vi/${song.youtubeVideoId}/hqdefault.jpg`}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
              <Disc3 className="w-5 h-5" />
            </div>
          )}
        </div>

        {/* Title, Artist, Lyrics Snippet */}
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <h3 className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-cyan-300' : 'text-slate-100'}`}>
              {song.title}
            </h3>
            {song.year && (
              <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                ({song.year})
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400 mt-0.5 truncate">
            <span className="font-medium text-slate-300 truncate">{song.artist}</span>
            {song.vibe && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 truncate">{song.vibe}</span>
              </>
            )}
          </div>
          {song.notes && (
            <p className="text-[11px] text-slate-400/90 truncate hidden md:block mt-0.5 italic">
              {song.notes}
            </p>
          )}
        </div>
      </div>

      {/* Right: Music Provider Quick Launchers & Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick View Lyrics Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenLyrics(song);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
          title="View Lyrics"
        >
          <Mic2 className="w-4 h-4" />
        </button>

        {/* Add to Playlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist(song);
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
          title="Add to a playlist..."
        >
          <FolderPlus className="w-4 h-4" />
        </button>

        {/* Provider Buttons */}
        <div className="hidden lg:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <a
            href={song.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
            title="Open in YouTube"
          >
            <Youtube className="w-3.5 h-3.5" />
          </a>
          <a
            href={song.youtubeMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-950/40 transition-colors"
            title="YouTube Music"
          >
            <Radio className="w-3.5 h-3.5" />
          </a>
          <a
            href={song.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors"
            title="Spotify"
          >
            <Disc3 className="w-3.5 h-3.5" />
          </a>
          <a
            href={song.appleMusicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-pink-400 hover:bg-pink-950/40 transition-colors"
            title="Apple Music"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Duration */}
        <span className="text-xs font-mono text-slate-400 w-11 text-right hidden sm:inline">
          {formatTime(song.durationSec)}
        </span>

        {/* Actions Dropdown */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-8 z-40 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-xl py-1 text-xs text-slate-200">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onOpenLyrics(song);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                >
                  <Mic2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View Song Lyrics</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onAddToPlaylist(song);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Add to Playlist...</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onQueueNext(song);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                >
                  <ListPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Play Next in Queue</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(song);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Edit Track Details</span>
                </button>
                {onOpenSourcePicker && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onOpenSourcePicker(song);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Alternative Sources...</span>
                  </button>
                )}
                <button
                  onClick={handleCopyLink}
                  className="w-full px-3 py-2 text-left hover:bg-slate-800 flex items-center gap-2"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <ExternalLink className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Media Link'}</span>
                </button>

                {onRemoveFromPlaylist && (
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onRemoveFromPlaylist(song.id);
                    }}
                    className="w-full px-3 py-2 text-left hover:bg-amber-950/60 text-amber-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove from Playlist</span>
                  </button>
                )}

                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(song.id);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-950/60 text-rose-400 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Song Completely</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

interface SongTableProps {
  songs: Song[];
  currentSongId: string | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onPauseSong: () => void;
  onEditSong: (song: Song) => void;
  onDeleteSong: (songId: string) => void;
  onQueueNext: (song: Song) => void;
  onAddToPlaylist: (song: Song) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onRemoveFromPlaylist?: (songId: string) => void;
  onOpenLyrics: (song: Song) => void;
  onOpenSourcePicker?: (song: Song) => void;
  canReorder?: boolean;
  preferredProvider: MusicProviderId;
}

export const SongTable: React.FC<SongTableProps> = ({
  songs,
  currentSongId,
  isPlaying,
  onPlaySong,
  onPauseSong,
  onEditSong,
  onDeleteSong,
  onQueueNext,
  onAddToPlaylist,
  onMoveUp,
  onMoveDown,
  onRemoveFromPlaylist,
  onOpenLyrics,
  onOpenSourcePicker,
  canReorder = false,
  preferredProvider,
}) => {
  if (songs.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80">
        <p className="text-slate-400 text-sm">No songs found in this view or search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {songs.map((song, idx) => (
        <SongRow
          key={song.id}
          song={song}
          index={idx}
          isCurrent={currentSongId === song.id}
          isPlaying={isPlaying}
          onPlay={onPlaySong}
          onPause={onPauseSong}
          onEdit={onEditSong}
          onDelete={onDeleteSong}
          onQueueNext={onQueueNext}
          onAddToPlaylist={onAddToPlaylist}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onRemoveFromPlaylist={onRemoveFromPlaylist}
          onOpenLyrics={onOpenLyrics}
          onOpenSourcePicker={onOpenSourcePicker}
          canReorder={canReorder}
          isFirst={idx === 0}
          isLast={idx === songs.length - 1}
          preferredProvider={preferredProvider}
        />
      ))}
    </div>
  );
};
