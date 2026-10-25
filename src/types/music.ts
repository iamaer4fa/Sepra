export type MusicProviderId = 'youtube' | 'spotify' | 'youtubemusic' | 'applemusic';

export interface LyricLine {
  timeSec: number;
  text: string;
}

export interface SongLyrics {
  isSynced: boolean;
  lines: LyricLine[];
  plainText?: string;
  source?: string;
}

export interface MusicSource {
  id: string; // video ID
  label: string; // e.g. "Primary", "Alternate Audio", "Lyric Video"
  isWorking?: boolean;
}

export interface Song {
  id: string;
  no: number;
  title: string;
  artist: string;
  setId: string; // original or primary set/playlist
  youtubeVideoId: string;
  youtubeUrl: string;
  youtubeMusicUrl: string;
  spotifyUrl: string;
  appleMusicUrl: string;
  deezerUrl: string;
  durationSec: number;
  vibe: string;
  year?: string;
  lyricsSnippet?: string;
  fullLyrics?: string; // custom or preloaded full text
  notes?: string;
  fallbackVideoIds?: string[];
  sources?: MusicSource[];
  failedSourceIds?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  accentColor: string;
  vibe?: string;
  iconName?: string;
  isSystem?: boolean; // true for Set 1, 2, 3
  songIds: string[];
  createdAt: number;
  updatedAt: number;
}

export interface SetDefinition {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  accentColor: string;
  vibe: string;
  iconName: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlaybackState {
  currentSongId: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
  preferredProvider: MusicProviderId;
  partyModeActive: boolean;
  videoVisible: boolean;
  theaterOpen: boolean;
  lyricsOpen: boolean;
}
