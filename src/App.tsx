import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_SETS, INITIAL_SONGS, INITIAL_PLAYLISTS } from './data/initialSongs';
import { Song, SetDefinition, Playlist, MusicProviderId, RepeatMode } from './types/music';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import { Header } from './components/Header';
import { SetHeroBanner } from './components/SetHeroBanner';
import { SetNavigation } from './components/SetNavigation';
import { SongTable } from './components/SongTable';
import { UnifiedPlayer } from './components/UnifiedPlayer';
import { VideoDock } from './components/VideoDock';
import { TheaterModal } from './components/TheaterModal';
import { ImportModal } from './components/ImportModal';
import { EditSongModal } from './components/EditSongModal';
import { AddSongModal } from './components/AddSongModal';
import { QueueDrawer } from './components/QueueDrawer';
import { LyricsDrawer } from './components/LyricsDrawer';
import { PlaylistManagerModal } from './components/PlaylistManagerModal';
import { AddToPlaylistModal } from './components/AddToPlaylistModal';
import { SourcePickerModal } from './components/SourcePickerModal';
import { findNextWorkingSource } from './utils/sourceResolver';

const LOCAL_STORAGE_KEY = 'harmoniq_songs_v2';
const LOCAL_STORAGE_PLAYLISTS_KEY = 'harmoniq_playlists_v2';
const YT_CONTAINER_ID = 'harmoniq-yt-iframe-instance';

export default function App() {
  // --- Persistent State ---
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_PLAYLISTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
    } catch {
      return INITIAL_PLAYLISTS;
    }
  });

  const [songs, setSongs] = useState<Song[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_SONGS;
    } catch {
      return INITIAL_SONGS;
    }
  });

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(songs));
    } catch (e) {
      console.warn('Could not save songs to localStorage', e);
    }
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLAYLISTS_KEY, JSON.stringify(playlists));
    } catch (e) {
      console.warn('Could not save playlists to localStorage', e);
    }
  }, [playlists]);

  // --- Active View & Filter State ---
  const [activePlaylistId, setActivePlaylistId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('all');

  // --- Playback & Queue State ---
  const [currentSongId, setCurrentSongId] = useState<string | null>(INITIAL_SONGS[0]?.id || null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [preferredProvider, setPreferredProvider] = useState<MusicProviderId>('youtube');
  const [partyModeActive, setPartyModeActive] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [theaterOpen, setTheaterOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);

  // --- Modals State ---
  const [playlistManagerOpen, setPlaylistManagerOpen] = useState(false);
  const [addToPlaylistSong, setAddToPlaylistSong] = useState<Song | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [addSongModalOpen, setAddSongModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);
  const [sourcePickerSong, setSourcePickerSong] = useState<Song | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  }, []);

  // Current Song Object
  const currentSong = useMemo(() => {
    return songs.find((s) => s.id === currentSongId) || null;
  }, [songs, currentSongId]);

  // Active Playlist Definition
  const currentPlaylist = useMemo(() => {
    if (activePlaylistId === 'all') return null;
    return playlists.find((p) => p.id === activePlaylistId) || null;
  }, [playlists, activePlaylistId]);

  // Ordered songs in the current view
  const playlistSongs = useMemo(() => {
    if (activePlaylistId === 'all') {
      return songs;
    }
    if (!currentPlaylist) return [];

    // Map song IDs preserving the playlist's specific order
    const ordered: Song[] = [];
    currentPlaylist.songIds.forEach((id) => {
      const found = songs.find((s) => s.id === id);
      if (found) ordered.push(found);
    });
    return ordered;
  }, [activePlaylistId, currentPlaylist, songs]);

  // Filtered songs (applying search query & vibe filters)
  const filteredSongs = useMemo(() => {
    return playlistSongs.filter((s) => {
      const matchesQuery =
        !searchQuery ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.lyricsSnippet && s.lyricsSnippet.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.notes && s.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesVibe = selectedVibe === 'all' || s.vibe === selectedVibe;
      return matchesQuery && matchesVibe;
    });
  }, [playlistSongs, searchQuery, selectedVibe]);

  // Available vibes across all songs
  const availableVibes = useMemo(() => {
    const list = Array.from(new Set(songs.map((s) => s.vibe))).filter(Boolean);
    return list.slice(0, 8);
  }, [songs]);

  // Track counts per playlist
  const countsByPlaylist = useMemo(() => {
    const counts: Record<string, number> = { all: songs.length };
    playlists.forEach((p) => {
      counts[p.id] = p.songIds.length;
    });
    return counts;
  }, [songs, playlists]);

  // Calculate Next Song
  const getNextSong = useCallback((): Song | null => {
    if (queue.length > 0) {
      return queue[0];
    }
    const currentList = playlistSongs;
    if (currentList.length === 0) return null;

    if (isShuffle) {
      const remaining = currentList.filter((s) => s.id !== currentSongId);
      if (remaining.length > 0) {
        return remaining[Math.floor(Math.random() * remaining.length)];
      }
      return currentList[0];
    }

    const currentIndex = currentList.findIndex((s) => s.id === currentSongId);
    if (currentIndex === -1 || currentIndex >= currentList.length - 1) {
      // Party mode continuous progression
      if (partyModeActive && activePlaylistId === 'set-1') {
        const nextPl = playlists.find((p) => p.id === 'set-2');
        if (nextPl && nextPl.songIds.length > 0) {
          const firstSong = songs.find((s) => s.id === nextPl.songIds[0]);
          if (firstSong) return firstSong;
        }
      } else if (partyModeActive && activePlaylistId === 'set-2') {
        const nextPl = playlists.find((p) => p.id === 'set-3');
        if (nextPl && nextPl.songIds.length > 0) {
          const firstSong = songs.find((s) => s.id === nextPl.songIds[0]);
          if (firstSong) return firstSong;
        }
      }

      if (repeatMode === 'all') {
        return currentList[0];
      }
      return null;
    }
    return currentList[currentIndex + 1];
  }, [queue, playlistSongs, isShuffle, currentSongId, partyModeActive, activePlaylistId, playlists, songs, repeatMode]);

  // Handle Next Track Action
  const handleNext = useCallback(() => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setCurrentSongId(next.id);
      return;
    }

    const next = getNextSong();
    if (next) {
      if (currentSong && next.setId !== currentSong.setId) {
        const targetPl = playlists.find((p) => p.id === next.setId);
        showToast(`🎉 Transitioning to ${targetPl?.name || 'Next Set'}!`);
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
        });
      }
      setCurrentSongId(next.id);
    }
  }, [queue, getNextSong, currentSong, playlists, showToast]);

  // Handle Previous Track Action
  const handlePrevious = useCallback(() => {
    const currentList = playlistSongs;
    if (currentList.length === 0) return;

    const currentIndex = currentList.findIndex((s) => s.id === currentSongId);
    if (currentIndex > 0) {
      setCurrentSongId(currentList[currentIndex - 1].id);
    } else {
      if (repeatMode === 'all') {
        setCurrentSongId(currentList[currentList.length - 1].id);
      }
    }
  }, [playlistSongs, currentSongId, repeatMode]);

  // Auto-recovery handler when current video ID is unavailable, deleted, or blocks embedding
  const handleSourceUnavailable = useCallback(
    async (failedVideoId: string, errorCode: number) => {
      if (!currentSong) return;

      console.warn(
        `[HarmoniQ Auto-Recovery] Source ${failedVideoId} unavailable for "${currentSong.title}" (code: ${errorCode}). Searching alternative source...`
      );
      showToast(`⚠️ Audio source unavailable. Auto-searching alternative source...`);

      const updatedFailed = Array.from(
        new Set([...(currentSong.failedSourceIds || []), failedVideoId])
      );

      const alt = await findNextWorkingSource(currentSong, failedVideoId);
      if (alt && alt.videoId) {
        console.log(
          `[HarmoniQ Auto-Recovery] Found working alternative source: ${alt.videoId} (${alt.label})`
        );

        setSongs((prev) =>
          prev.map((s) =>
            s.id === currentSong.id
              ? {
                  ...s,
                  youtubeVideoId: alt.videoId,
                  failedSourceIds: updatedFailed,
                }
              : s
          )
        );

        switchVideoSource(alt.videoId);
        showToast(`🔄 Auto-switched to: ${alt.label}`);
      } else {
        showToast(`⚠️ No backup source found. Please select an alternate or use Spotify.`);
        setSourcePickerSong(currentSong);
      }
    },
    [currentSong, showToast]
  );

  // YouTube Player Engine Hook
  const {
    isReady,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    playerError,
    initPlayer,
    play,
    pause,
    togglePlayPause,
    seekTo,
    rewind,
    fastForward,
    setVolume,
    toggleMute,
    switchVideoSource,
  } = useYouTubePlayer({
    currentSong,
    onTrackEnded: handleNext,
    onSourceUnavailable: handleSourceUnavailable,
    repeatMode,
  });

  // Mount YouTube Player
  useEffect(() => {
    if (isReady) {
      initPlayer(YT_CONTAINER_ID);
    }
  }, [isReady, initPlayer]);

  // Play a specific song
  const handlePlaySong = useCallback(
    (song: Song) => {
      setCurrentSongId(song.id);
      if (preferredProvider === 'spotify') {
        showToast(`Playing on unified deck · Available in Spotify`);
      }
    },
    [preferredProvider, showToast]
  );

  // Play entire current playlist
  const handlePlaySet = useCallback(() => {
    if (filteredSongs.length > 0) {
      setCurrentSongId(filteredSongs[0].id);
      showToast(`▶ Starting ${currentPlaylist ? currentPlaylist.name : 'All Tracks'}`);
    }
  }, [filteredSongs, currentPlaylist, showToast]);

  // Shuffle current playlist
  const handleShuffleSet = useCallback(() => {
    setIsShuffle(true);
    if (filteredSongs.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      setCurrentSongId(filteredSongs[randomIndex].id);
      showToast('🔀 Shuffled playback started');
    }
  }, [filteredSongs, showToast]);

  // --- Playlist Management Handlers ---

  // Create new playlist
  const handleCreatePlaylist = useCallback(
    (name: string, description: string, color: string) => {
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        name,
        description,
        accentColor: color,
        vibe: 'Custom Mix',
        isSystem: false,
        songIds: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
      setActivePlaylistId(newPlaylist.id);
      showToast(`Created playlist "${name}"`);
    },
    [showToast]
  );

  // Rename / Edit playlist
  const handleRenamePlaylist = useCallback(
    (id: string, name: string, description: string, color: string) => {
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, name, description, accentColor: color, updatedAt: Date.now() }
            : p
        )
      );
      showToast(`Updated playlist "${name}"`);
    },
    [showToast]
  );

  // Delete playlist
  const handleDeletePlaylist = useCallback(
    (id: string) => {
      const pl = playlists.find((p) => p.id === id);
      if (pl?.isSystem) {
        showToast('System setlists cannot be deleted');
        return;
      }
      setPlaylists((prev) => prev.filter((p) => p.id !== id));
      if (activePlaylistId === id) {
        setActivePlaylistId('all');
      }
      showToast(`Deleted playlist "${pl?.name || id}"`);
    },
    [playlists, activePlaylistId, showToast]
  );

  // Add song to playlist
  const handleAddToPlaylist = useCallback(
    (playlistId: string, songId: string) => {
      setPlaylists((prev) =>
        prev.map((p) => {
          if (p.id === playlistId) {
            if (p.songIds.includes(songId)) return p;
            return {
              ...p,
              songIds: [...p.songIds, songId],
              updatedAt: Date.now(),
            };
          }
          return p;
        })
      );
      const targetPl = playlists.find((p) => p.id === playlistId);
      const targetSong = songs.find((s) => s.id === songId);
      showToast(`Added "${targetSong?.title}" to "${targetPl?.name}"`);
    },
    [playlists, songs, showToast]
  );

  // Create new playlist and add song
  const handleCreateAndAdd = useCallback(
    (name: string, description: string, songId: string) => {
      const newPlaylist: Playlist = {
        id: `pl-${Date.now()}`,
        name,
        description,
        accentColor: '#06b6d4',
        vibe: 'Custom Mix',
        isSystem: false,
        songIds: [songId],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setPlaylists((prev) => [...prev, newPlaylist]);
      showToast(`Created "${name}" and added track!`);
    },
    [showToast]
  );

  // Reorder songs in current playlist: Move Up
  const handleMoveUp = useCallback(
    (index: number) => {
      if (!currentPlaylist || index <= 0) return;
      const newSongIds = [...currentPlaylist.songIds];
      const temp = newSongIds[index];
      newSongIds[index] = newSongIds[index - 1];
      newSongIds[index - 1] = temp;

      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === currentPlaylist.id
            ? { ...p, songIds: newSongIds, updatedAt: Date.now() }
            : p
        )
      );
    },
    [currentPlaylist]
  );

  // Reorder songs in current playlist: Move Down
  const handleMoveDown = useCallback(
    (index: number) => {
      if (!currentPlaylist || index >= currentPlaylist.songIds.length - 1) return;
      const newSongIds = [...currentPlaylist.songIds];
      const temp = newSongIds[index];
      newSongIds[index] = newSongIds[index + 1];
      newSongIds[index + 1] = temp;

      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === currentPlaylist.id
            ? { ...p, songIds: newSongIds, updatedAt: Date.now() }
            : p
        )
      );
    },
    [currentPlaylist]
  );

  // Remove song from current playlist
  const handleRemoveFromPlaylist = useCallback(
    (songId: string) => {
      if (!currentPlaylist) return;
      setPlaylists((prev) =>
        prev.map((p) =>
          p.id === currentPlaylist.id
            ? { ...p, songIds: p.songIds.filter((id) => id !== songId), updatedAt: Date.now() }
            : p
        )
      );
      showToast('Track removed from playlist');
    },
    [currentPlaylist, showToast]
  );

  // Load / Import custom playlist data from JSON
  const handleImportPlaylistData = useCallback(
    (importedPlaylist: Playlist, importedSongs?: Song[]) => {
      const plId = importedPlaylist.id || `pl-import-${Date.now()}`;
      const newPl: Playlist = {
        ...importedPlaylist,
        id: plId,
        isSystem: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      if (importedSongs && importedSongs.length > 0) {
        // Merge songs without duplicate IDs
        setSongs((prev) => {
          const existingIds = new Set(prev.map((s) => s.id));
          const toAdd = importedSongs.filter((s) => !existingIds.has(s.id));
          return [...prev, ...toAdd];
        });
      }

      setPlaylists((prev) => {
        const filtered = prev.filter((p) => p.id !== plId);
        return [...filtered, newPl];
      });

      setActivePlaylistId(plId);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast(`Loaded playlist "${newPl.name}"!`);
    },
    [showToast]
  );

  // Save custom lyrics to song
  const handleSaveCustomLyrics = useCallback(
    (songId: string, lyricsText: string) => {
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, fullLyrics: lyricsText } : s))
      );
      showToast('Lyrics updated for song');
    },
    [showToast]
  );

  // Add song to queue
  const handleQueueNext = useCallback(
    (song: Song) => {
      setQueue((prev) => [song, ...prev]);
      showToast(`Queued "${song.title}" up next`);
    },
    [showToast]
  );

  // Remove from queue
  const handleRemoveFromQueue = useCallback((index: number) => {
    setQueue((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Clear queue
  const handleClearQueue = useCallback(() => {
    setQueue([]);
    showToast('Queue cleared');
  }, [showToast]);

  // Edit song
  const handleSaveEditedSong = useCallback(
    (updatedSong: Song) => {
      setSongs((prev) => prev.map((s) => (s.id === updatedSong.id ? updatedSong : s)));
      showToast(`Updated "${updatedSong.title}"`);
    },
    [showToast]
  );

  // Switch or update a song's playback source
  const handleSelectSource = useCallback(
    (songId: string, newVideoId: string) => {
      setSongs((prev) =>
        prev.map((s) => (s.id === songId ? { ...s, youtubeVideoId: newVideoId } : s))
      );
      if (currentSongId === songId) {
        switchVideoSource(newVideoId);
      }
      showToast('Switched to selected playback source');
    },
    [currentSongId, switchVideoSource, showToast]
  );

  // Delete song globally
  const handleDeleteSong = useCallback(
    (songId: string) => {
      setSongs((prev) => prev.filter((s) => s.id !== songId));
      setQueue((prev) => prev.filter((s) => s.id !== songId));
      setPlaylists((prev) =>
        prev.map((p) => ({ ...p, songIds: p.songIds.filter((id) => id !== songId) }))
      );
      if (currentSongId === songId) {
        handleNext();
      }
      showToast('Track deleted from library');
    },
    [currentSongId, handleNext, showToast]
  );

  // Add single song
  const handleAddSong = useCallback(
    (newSong: Song) => {
      setSongs((prev) => [...prev, newSong]);
      // If currently viewing a custom playlist, add it there too
      if (currentPlaylist) {
        setPlaylists((prev) =>
          prev.map((p) =>
            p.id === currentPlaylist.id
              ? { ...p, songIds: [...p.songIds, newSong.id] }
              : p
          )
        );
      }
      showToast(`Added "${newSong.title}"`);
    },
    [currentPlaylist, showToast]
  );

  // Import raw text songs
  const handleImportSongs = useCallback(
    (importedSongs: Song[], targetSetId: string, customSetName?: string) => {
      setSongs((prev) => [...prev, ...importedSongs]);
      const songIds = importedSongs.map((s) => s.id);

      if (targetSetId === 'custom' && customSetName) {
        const newPl: Playlist = {
          id: `pl-${Date.now()}`,
          name: customSetName,
          description: 'Imported song list',
          accentColor: '#10b981',
          vibe: 'Custom Mix',
          isSystem: false,
          songIds,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        setPlaylists((prev) => [...prev, newPl]);
        setActivePlaylistId(newPl.id);
      } else {
        setPlaylists((prev) =>
          prev.map((p) => (p.id === targetSetId ? { ...p, songIds: [...p.songIds, ...songIds] } : p))
        );
        setActivePlaylistId(targetSetId);
      }

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
      showToast(`Imported ${importedSongs.length} songs!`);
    },
    [showToast]
  );

  // Export entire library JSON
  const handleExportLibrary = useCallback(() => {
    const exportData = {
      appName: 'HarmoniQ Universal Streamer',
      exportDate: new Date().toISOString(),
      playlists,
      songs,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harmoniq-all-playlists-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported all playlists & songs');
  }, [playlists, songs, showToast]);

  // Export active playlist
  const handleExportCurrentPlaylist = useCallback(() => {
    if (!currentPlaylist) {
      handleExportLibrary();
      return;
    }
    const includedSongs = songs.filter((s) => currentPlaylist.songIds.includes(s.id));
    const exportData = {
      playlist: currentPlaylist,
      songs: includedSongs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `harmoniq-playlist-${currentPlaylist.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported "${currentPlaylist.name}"`);
  }, [currentPlaylist, songs, handleExportLibrary, showToast]);

  // Toggle Repeat Mode
  const handleToggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        rewind(10);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        fastForward(10);
      } else if (e.key.toLowerCase() === 'n') {
        handleNext();
      } else if (e.key.toLowerCase() === 'p') {
        handlePrevious();
      } else if (e.key.toLowerCase() === 'm') {
        toggleMute();
      } else if (e.key.toLowerCase() === 'l') {
        setLyricsOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'f') {
        setTheaterOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, rewind, fastForward, handleNext, handlePrevious, toggleMute]);

  const activeDuration = useMemo(() => {
    return filteredSongs.reduce((acc, s) => acc + (s.durationSec || 210), 0);
  }, [filteredSongs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-36 selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-cyan-950/90 border border-cyan-500/60 text-cyan-200 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Player Error Alert */}
      {playerError && (
        <div className="bg-amber-950/80 border-b border-amber-800/80 px-4 py-2 text-xs text-amber-200 text-center flex items-center justify-center gap-2">
          <span>⚠️ {playerError}</span>
          {currentSong && (
            <a
              href={currentSong.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold text-amber-300 hover:text-white"
            >
              Open direct on YouTube
            </a>
          )}
        </div>
      )}

      {/* Top Header */}
      <Header
        preferredProvider={preferredProvider}
        onProviderChange={setPreferredProvider}
        partyModeActive={partyModeActive}
        onTogglePartyMode={() => {
          setPartyModeActive(!partyModeActive);
          showToast(
            !partyModeActive
              ? '🔥 Party Flow ON: Sets 1, 2, and 3 will play continuously!'
              : 'Party Flow OFF: standard single set loop'
          );
        }}
        onOpenImport={() => setImportModalOpen(true)}
        onOpenAddSong={() => setAddSongModalOpen(true)}
        onOpenManagePlaylists={() => setPlaylistManagerOpen(true)}
        onToggleLyrics={() => setLyricsOpen(!lyricsOpen)}
        lyricsOpen={lyricsOpen}
        onExport={handleExportLibrary}
        totalSongs={songs.length}
        currentSongTitle={currentSong ? `${currentSong.title} - ${currentSong.artist}` : undefined}
        isPlaying={isPlaying}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Set & Playlist Hero Banner */}
        <SetHeroBanner
          currentPlaylist={currentPlaylist}
          songCount={filteredSongs.length}
          totalDurationSec={activeDuration}
          onPlaySet={handlePlaySet}
          onShuffleSet={handleShuffleSet}
          isPlayingCurrentSet={Boolean(
            currentSong &&
              (activePlaylistId === 'all' || currentPlaylist?.songIds.includes(currentSong.id)) &&
              isPlaying
          )}
          onEditPlaylist={() => setPlaylistManagerOpen(true)}
          onDeletePlaylist={
            currentPlaylist && !currentPlaylist.isSystem
              ? () => handleDeletePlaylist(currentPlaylist.id)
              : undefined
          }
          onExportPlaylist={currentPlaylist ? handleExportCurrentPlaylist : undefined}
        />

        {/* Set & Playlist Navigation */}
        <SetNavigation
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          onSelectPlaylist={(id) => {
            setActivePlaylistId(id);
            setSearchQuery('');
          }}
          onOpenNewPlaylist={() => setPlaylistManagerOpen(true)}
          onOpenManagePlaylists={() => setPlaylistManagerOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedVibe={selectedVibe}
          onSelectVibe={setSelectedVibe}
          availableVibes={availableVibes}
          countsByPlaylist={countsByPlaylist}
        />

        {/* Songs List Table */}
        <SongTable
          songs={filteredSongs}
          currentSongId={currentSongId}
          isPlaying={isPlaying}
          onPlaySong={handlePlaySong}
          onPauseSong={pause}
          onEditSong={(song) => setEditingSong(song)}
          onDeleteSong={handleDeleteSong}
          onQueueNext={handleQueueNext}
          onAddToPlaylist={(song) => setAddToPlaylistSong(song)}
          onMoveUp={currentPlaylist ? handleMoveUp : undefined}
          onMoveDown={currentPlaylist ? handleMoveDown : undefined}
          onRemoveFromPlaylist={currentPlaylist ? handleRemoveFromPlaylist : undefined}
          onOpenLyrics={(song) => {
            setCurrentSongId(song.id);
            setLyricsOpen(true);
          }}
          onOpenSourcePicker={(song) => setSourcePickerSong(song)}
          canReorder={Boolean(currentPlaylist)}
          preferredProvider={preferredProvider}
        />
      </main>

      {/* Picture-in-Picture Floating Video Dock (Mounts YT iframe) */}
      <VideoDock
        currentSong={currentSong}
        videoVisible={videoVisible}
        onToggleVisible={() => setVideoVisible(!videoVisible)}
        onOpenTheater={() => setTheaterOpen(true)}
        containerId={YT_CONTAINER_ID}
      />

      {/* Master Unified Player Bar (Bottom Dock) */}
      <UnifiedPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        videoVisible={videoVisible}
        lyricsOpen={lyricsOpen}
        preferredProvider={preferredProvider}
        queueCount={queue.length}
        onTogglePlay={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRewind10={() => rewind(10)}
        onFastForward10={() => fastForward(10)}
        onSeek={seekTo}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleRepeat={handleToggleRepeat}
        onToggleShuffle={() => {
          setIsShuffle(!isShuffle);
          showToast(!isShuffle ? '🔀 Shuffle enabled' : 'Shuffle disabled');
        }}
        onToggleVideo={() => setVideoVisible(!videoVisible)}
        onToggleLyrics={() => setLyricsOpen(!lyricsOpen)}
        onOpenTheater={() => setTheaterOpen(true)}
        onOpenSourcePicker={() => currentSong && setSourcePickerSong(currentSong)}
        onToggleQueue={() => setQueueOpen(!queueOpen)}
        onProviderChange={setPreferredProvider}
      />

      {/* Live Synced Song Lyrics Drawer */}
      <LyricsDrawer
        isOpen={lyricsOpen}
        onClose={() => setLyricsOpen(false)}
        currentSong={currentSong}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onSeek={seekTo}
        onSaveCustomLyrics={handleSaveCustomLyrics}
      />

      {/* Up Next Queue Drawer */}
      <QueueDrawer
        isOpen={queueOpen}
        onClose={() => setQueueOpen(false)}
        queue={queue}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlaySong={handlePlaySong}
        onRemoveFromQueue={handleRemoveFromQueue}
        onClearQueue={handleClearQueue}
      />

      {/* Fullscreen Theater & Visualizer Modal */}
      <TheaterModal
        isOpen={theaterOpen}
        onClose={() => setTheaterOpen(false)}
        currentSong={currentSong}
        nextSong={getNextSong()}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        repeatMode={repeatMode}
        onTogglePlay={togglePlayPause}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onRewind10={() => rewind(10)}
        onFastForward10={() => fastForward(10)}
        onSeek={seekTo}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onToggleRepeat={handleToggleRepeat}
        onSaveCustomLyrics={handleSaveCustomLyrics}
      />

      {/* Playlist Manager Modal (Create, Rename, Delete, Export, Import) */}
      <PlaylistManagerModal
        isOpen={playlistManagerOpen}
        onClose={() => setPlaylistManagerOpen(false)}
        playlists={playlists}
        allSongs={songs}
        onCreatePlaylist={handleCreatePlaylist}
        onRenamePlaylist={handleRenamePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onImportPlaylistData={handleImportPlaylistData}
        onSelectPlaylist={(id) => {
          setActivePlaylistId(id);
          setSearchQuery('');
        }}
      />

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={Boolean(addToPlaylistSong)}
        onClose={() => setAddToPlaylistSong(null)}
        song={addToPlaylistSong}
        playlists={playlists}
        onAddToPlaylist={handleAddToPlaylist}
        onCreateAndAdd={handleCreateAndAdd}
      />

      {/* Import Setlist Modal */}
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImportSongs={handleImportSongs}
        currentSetId={activePlaylistId}
      />

      {/* Add Single Song Modal */}
      <AddSongModal
        isOpen={addSongModalOpen}
        onClose={() => setAddSongModalOpen(false)}
        onAddSong={handleAddSong}
        sets={playlists.map((p) => ({ id: p.id, name: p.name }))}
        activeSetId={activePlaylistId}
      />

      {/* Edit Song Details Modal */}
      <EditSongModal
        isOpen={Boolean(editingSong)}
        onClose={() => setEditingSong(null)}
        song={editingSong}
        onSave={handleSaveEditedSong}
        sets={playlists.map((p) => ({ id: p.id, name: p.name }))}
      />

      {/* Playback Source Picker Modal (Auto-detection & Alternate Switcher) */}
      <SourcePickerModal
        isOpen={Boolean(sourcePickerSong)}
        onClose={() => setSourcePickerSong(null)}
        song={sourcePickerSong}
        onSelectSource={handleSelectSource}
      />
    </div>
  );
}
