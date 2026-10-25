import { Song } from '../types/music';

/**
 * Extracts a YouTube Video ID from standard YouTube or YouTube Music URLs
 */
export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return '';
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|music\.youtube\.com\/watch\?v=))([\w-]{11})/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Builds universal provider search & playback links for a song
 */
export function buildProviderLinks(title: string, artist: string, customYoutubeId?: string) {
  const query = encodeURIComponent(`${title} ${artist}`.trim());
  const ytVideoId = customYoutubeId ? extractYouTubeId(customYoutubeId) : '';
  
  const youtubeUrl = ytVideoId
    ? `https://www.youtube.com/watch?v=${ytVideoId}`
    : `https://www.youtube.com/results?search_query=${query}`;

  const youtubeMusicUrl = ytVideoId
    ? `https://music.youtube.com/watch?v=${ytVideoId}`
    : `https://music.youtube.com/search?q=${query}`;

  const spotifyUrl = `https://open.spotify.com/search/${query}`;
  const appleMusicUrl = `https://music.apple.com/us/search?term=${query}`;
  const deezerUrl = `https://www.deezer.com/search/${query}`;

  return {
    youtubeVideoId: ytVideoId,
    youtubeUrl,
    youtubeMusicUrl,
    spotifyUrl,
    appleMusicUrl,
    deezerUrl,
  };
}

/**
 * Formats seconds into mm:ss
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Parses user-provided raw text or tab/table data into a structured song list
 * Handles formats like:
 * No. Song Title Artist
 * 1 Leader of the Band Dan Fogelberg
 * 1. Song - Artist
 * Song by Artist
 */
export function parseRawSongText(text: string, targetSetId = 'custom'): Partial<Song>[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const songs: Partial<Song>[] = [];
  let currentNo = 1;

  for (const line of lines) {
    // Skip table header lines
    if (/^(No\.?|#|Track)\s+(Song Title|Title|Name)\s+(Artist)/i.test(line)) continue;
    if (/^[-=|_]+$/.test(line)) continue;
    if (/^Set\s+\d+/i.test(line)) continue; // Set headers handled separately if needed
    if (/^(Easy listening|Transitioning|Full dance|Vibes)/i.test(line)) continue;

    // Check for tab-separated (e.g., copied from table: "1\tLeader of the Band\tDan Fogelberg")
    const tabParts = line.split('\t').map(p => p.trim()).filter(Boolean);
    if (tabParts.length >= 3) {
      const num = parseInt(tabParts[0].replace(/\D/g, ''), 10) || currentNo;
      const title = tabParts[1];
      const artist = tabParts[2];
      songs.push({
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        no: num,
        title,
        artist,
        setId: targetSetId,
        ...buildProviderLinks(title, artist),
        durationSec: 210,
        vibe: 'Custom Pick',
      });
      currentNo = num + 1;
      continue;
    } else if (tabParts.length === 2) {
      const title = tabParts[0].replace(/^\d+[\.\-\)]\s*/, '').trim();
      const artist = tabParts[1];
      songs.push({
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        no: currentNo,
        title,
        artist,
        setId: targetSetId,
        ...buildProviderLinks(title, artist),
        durationSec: 210,
        vibe: 'Custom Pick',
      });
      currentNo++;
      continue;
    }

    // Try hyphen/dash format: "1. Song Title - Artist" or "Song Title - Artist"
    const dashMatch = line.match(/^(?:(\d+)[\.\)\s\t]+)?(.*?)\s+[-–—]\s+(.*)$/);
    if (dashMatch) {
      const num = dashMatch[1] ? parseInt(dashMatch[1], 10) : currentNo;
      const title = dashMatch[2].trim();
      const artist = dashMatch[3].trim();
      if (title && artist) {
        songs.push({
          id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          no: num,
          title,
          artist,
          setId: targetSetId,
          ...buildProviderLinks(title, artist),
          durationSec: 210,
          vibe: 'Custom Pick',
        });
        currentNo = num + 1;
        continue;
      }
    }

    // Try "by" separator: "1. Song Title by Artist"
    const byMatch = line.match(/^(?:(\d+)[\.\)\s\t]+)?(.*?)\s+by\s+(.*)$/i);
    if (byMatch) {
      const num = byMatch[1] ? parseInt(byMatch[1], 10) : currentNo;
      const title = byMatch[2].trim();
      const artist = byMatch[3].trim();
      if (title && artist) {
        songs.push({
          id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          no: num,
          title,
          artist,
          setId: targetSetId,
          ...buildProviderLinks(title, artist),
          durationSec: 210,
          vibe: 'Custom Pick',
        });
        currentNo = num + 1;
        continue;
      }
    }

    // Fallback: Numbered single line or plain text
    const cleanLine = line.replace(/^\d+[\.\)\s\t]+/, '').trim();
    if (cleanLine.length > 2) {
      songs.push({
        id: `song-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        no: currentNo,
        title: cleanLine,
        artist: 'Various Artists',
        setId: targetSetId,
        ...buildProviderLinks(cleanLine, 'Various Artists'),
        durationSec: 210,
        vibe: 'Custom Pick',
      });
      currentNo++;
    }
  }

  return songs;
}
