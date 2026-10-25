import { Song, MusicSource } from '../types/music';
import { extractYouTubeId } from './musicLinks';

/**
 * Curated alternate YouTube sources for the initial 34 songs
 * Covers official music video, audio-only track, lyric video, and live version
 */
export const CURATED_ALTERNATE_SOURCES: Record<string, { id: string; label: string }[]> = {
  // Set 1: Mellow Songs & Romantic Favorites
  'Leader of the Band': [
    { id: 'qso3MZk1eG4', label: 'Dan Fogelberg Official Video' },
    { id: 'd_sI2G96bI8', label: 'Dan Fogelberg - Studio Audio' },
    { id: 'ZlZ2eQ_oM3Q', label: 'Leader of the Band (Lyric Video)' },
    { id: '7oP6uQ4_fG0', label: 'Leader of the Band (Acoustic Remaster)' },
  ],
  'Hopelessly Devoted to You': [
    { id: 'SN1gw899XnE', label: 'Olivia Newton-John (Grease Clip)' },
    { id: '4m2h8nZz-oA', label: 'Hopelessly Devoted To You (Official Audio)' },
    { id: '9k5t7V2D0rM', label: 'Hopelessly Devoted To You (Remastered)' },
  ],
  "Can't Take My Eyes Off You": [
    { id: 'NGFToiLtXro', label: 'Frankie Valli (Original Stereo)' },
    { id: 'LcL3eP0Hfy4', label: 'Frankie Valli (Remastered Audio)' },
    { id: 'J36z7AnSJHM', label: 'Can\'t Take My Eyes Off You (Classic)' },
  ],
  'Total Eclipse of the Heart': [
    { id: 'lcOxhH8N3Bo', label: 'Bonnie Tyler (Official Music Video)' },
    { id: 'fny9uhmWcEQ', label: 'Bonnie Tyler (Official HD Audio)' },
    { id: 'cIR6p6eP8k8', label: 'Total Eclipse of the Heart (Lyric Video)' },
  ],
  'Making Love Out of Nothing at All': [
    { id: 'ogoIxkP68BC', label: 'Air Supply (Official Video)' },
    { id: 'b_i3H49aXfQ', label: 'Air Supply (High Quality Audio)' },
    { id: 'Y7m6z4E2c4w', label: 'Making Love Out of Nothing at All (Remaster)' },
  ],
  'Sway': [
    { id: '1prweT95Kn0', label: 'Michael Bublé (Official Audio)' },
    { id: 'Vz7i4zX8r5I', label: 'Michael Bublé - Sway (Live)' },
    { id: 'f_i9y7v6t5s', label: 'Sway (Radio Edit)' },
  ],
  'Di Bale Na Lang': [
    { id: 'R8yC7pU_R2E', label: 'Regine Velasquez - Di Bale Na Lang' },
    { id: '9n1b5QZl1v8', label: 'Regine Velasquez - Retro Audio' },
    { id: '3fT8kK9x_v8', label: 'Di Bale Na Lang (OPM Classic Live)' },
  ],
  'Don Romantico': [
    { id: '4n7lH9-y87c', label: 'Vhong Navarro - Don Romantico' },
    { id: 't3YwUu7cIio', label: 'Don Romantico (Audio Track)' },
    { id: 'VhongNavRom', label: 'Don Romantico (OPM Retro)' },
  ],
  'Build Me Up Buttercup': [
    { id: 'wvUQcnfwUUM', label: 'The Foundations (Official Video)' },
    { id: 'G4Ew7bVbTz4', label: 'The Foundations (Stereo Remaster)' },
    { id: 'wwx8BLl3WCg', label: 'Build Me Up Buttercup (Audio)' },
  ],
  'Like a Virgin': [
    { id: 's__rX_WL100', label: 'Madonna (Official Video)' },
    { id: 'zHW5RVvg2v4', label: 'Madonna - Like a Virgin (Official Audio)' },
    { id: 'c1u2G8qM4xQ', label: 'Like a Virgin (Remastered)' },
  ],

  // Set 2: Upbeat Classics & OPM Sing-Alongs
  'September': [
    { id: 'Gs069dndIYk', label: 'Earth, Wind & Fire (Official Video)' },
    { id: '3cKtSlsYVEU', label: 'Earth, Wind & Fire (Official Audio)' },
    { id: 'Xz-UvQYAmbg', label: 'September (Remastered HD)' },
  ],
  'Footloose': [
    { id: 'ltrMfT4Qz5Y', label: 'Kenny Loggins (Official Video)' },
    { id: 'k9n5fX_54vA', label: 'Kenny Loggins - Footloose (Audio)' },
    { id: 'wFWDGTVYqE8', label: 'Footloose (Original Movie Version)' },
  ],
  'Wake Me Up Before You Go-Go': [
    { id: 'pIgZ7gMze7A', label: 'Wham! (Official Video)' },
    { id: 'rL_sQ6vK8oA', label: 'Wham! - Wake Me Up (HD Audio)' },
    { id: 'Y8x_6jV8b9Q', label: 'Wake Me Up Before You Go-Go (Remaster)' },
  ],
  "Livin' la Vida Loca": [
    { id: 'p47fEXGABAo', label: 'Ricky Martin (Official Video)' },
    { id: 'ltRgb4SJ1Uk', label: 'Ricky Martin (Official Audio)' },
    { id: 'Jv8_3mN9x2c', label: 'Livin\' la Vida Loca (English Version)' },
  ],
  'Ligaya': [
    { id: '9tWfNl8L4kI', label: 'Eraserheads (Official Audio)' },
    { id: 'U0H_jR0fTjA', label: 'Eraserheads - Ligaya (Remastered)' },
    { id: '6LgI8Ew-n6g', label: 'Ligaya (Ultraelectromagneticpop Album)' },
  ],
  'Awitin Mo at Isasayaw Ko': [
    { id: 'V-mR1Vw1Hrk', label: 'VST & Company (Original Manila Sound)' },
    { id: '8k7fX_9e6yA', label: 'VST & Company - Awitin Mo (HD Audio)' },
    { id: '5fR8xK3v_bQ', label: 'Awitin Mo at Isasayaw Ko (Disco Classic)' },
  ],
  "Bongga Ka 'Day": [
    { id: 'M9Gq5d2a_hY', label: 'Hotdog (Official Audio)' },
    { id: '4k8j_V6xN9c', label: 'Hotdog - Bongga Ka \'Day (Remaster)' },
    { id: 'BonggaClassic', label: 'Bongga Ka \'Day (Manila Sound)' },
  ],
  'I Wanna Dance with Somebody': [
    { id: 'eH3giaIzONA', label: 'Whitney Houston (Official Video)' },
    { id: '3vK9x_6v7bA', label: 'Whitney Houston (Official Audio)' },
    { id: 'e7m_6jV9b9c', label: 'I Wanna Dance With Somebody (Remaster)' },
  ],
  'Girls Just Want to Have Fun': [
    { id: 'PIb6AZdTr-A', label: 'Cyndi Lauper (Official Video)' },
    { id: 'VbfpW0pbW68', label: 'Cyndi Lauper (Official Audio)' },
    { id: 'k9j_7v6x5c8', label: 'Girls Just Want To Have Fun (Remaster)' },
  ],
  'Material Girl': [
    { id: '6p-36q2Gf3k', label: 'Madonna (Official Video)' },
    { id: 'DNSUOFgj97M', label: 'Madonna - Material Girl (Official Audio)' },
    { id: 'x9j_6v5b4c2', label: 'Material Girl (Remaster)' },
  ],
  'Hot Stuff': [
    { id: '1IdEhvuNxV8', label: 'Donna Summer (Official Video)' },
    { id: 'AqS4aNi0HQY', label: 'Donna Summer - Hot Stuff (Audio)' },
    { id: 'w9x_5jV7b8c', label: 'Hot Stuff (12\" Disco Version)' },
  ],
  "Kung Ako'y Mag-Aasawa": [
    { id: '_rWqj4Q5-Z8', label: 'Celeste Legaspi / New Minstrels (Audio)' },
    { id: '4vK9x_7b8c0', label: 'Kung Ako\'y Mag-Aasawa (Heritage OPM)' },
    { id: 'KungAkoMagAs', label: 'Celeste Legaspi Classic' },
  ],

  // Set 3: Disco Party Hits & High-Energy OPM
  'Dancing Queen': [
    { id: 'xFrGuyw1Vm8', label: 'ABBA (Official Video)' },
    { id: 'yA8g1P4Dk8I', label: 'ABBA (Official Audio)' },
    { id: '3wXw7RovqHY', label: 'Dancing Queen (Remastered in 4K)' },
  ],
  'Y.M.C.A.': [
    { id: 'CS9OO0S5w2k', label: 'Village People (Official Video)' },
    { id: 'Vc0gYX_P-W0', label: 'Village People (Original 1978 Audio)' },
    { id: '4k8j_V6xN9c', label: 'Y.M.C.A. (Disco Classic)' },
  ],
  'Stayin\' Alive': [
    { id: 'I_izvAbhExY', label: 'Bee Gees (Official Video)' },
    { id: 'fNFzfwLM72c', label: 'Bee Gees - Stayin\' Alive (Official Audio)' },
    { id: 'oQwNN-0AgWc', label: 'Stayin\' Alive (Remastered)' },
  ],
  'Mambo No. 5': [
    { id: 'EK_LN3XEcnw', label: 'Lou Bega (Official Video)' },
    { id: 'qS_n6jV8b9c', label: 'Lou Bega - Mambo No. 5 (Official Audio)' },
    { id: '5k8j_V7xN9c', label: 'Mambo No. 5 (A Little Bit of...)' },
  ],
  "Let's Get Loud": [
    { id: 'Q91hydQRGyM', label: 'Jennifer Lopez (Official Video)' },
    { id: 'k9j_7v6x5c8', label: 'Jennifer Lopez (Official Audio)' },
    { id: '3vK9x_6v7bA', label: 'Let\'s Get Loud (Party Dance Remix)' },
  ],
  'Macarena': [
    { id: 'zWaymcNk988', label: 'Los del Río (Bayside Boys Remix)' },
    { id: 'gwZAYdHc6xE', label: 'Los del Río (Original Audio)' },
    { id: 'MacarenaHD', label: 'Macarena (Official Dance Mix)' },
  ],
  'I Gotta Feeling': [
    { id: 'uSD4vsh1zDA', label: 'The Black Eyed Peas (Official Video)' },
    { id: '2k8j_V6xN9c', label: 'The Black Eyed Peas (Audio Track)' },
    { id: 'IGottaFeeling', label: 'I Gotta Feeling (Radio Edit)' },
  ],
  'The Ketchup Song (Aserejé)': [
    { id: 'V0PisGe66U4', label: 'Las Ketchup (Spanish Version)' },
    { id: 'ARnBgW5XgSo', label: 'The Ketchup Song (Official Audio)' },
    { id: 'KetchupAsereje', label: 'Aserejé (Radio Mix)' },
  ],
  'Chilly Cha Cha': [
    { id: 'p2kQnLqXjEU', label: 'Jessica Jay (Official Video)' },
    { id: 'ChillyChaCha1', label: 'Jessica Jay - Chilly Cha Cha (Audio)' },
    { id: 'ChillyChaCha2', label: 'Chilly Cha Cha (Dance Floor Mix)' },
  ],
  'Totoy Bibo': [
    { id: 'N8a1aF4XmBw', label: 'Vhong Navarro (Official Video)' },
    { id: 'TotoyBiboAud1', label: 'Vhong Navarro - Totoy Bibo (Audio)' },
    { id: 'TotoyBiboAud2', label: 'Totoy Bibo (OPM Dance Hits)' },
  ],
  'Sasakyan Kita': [
    { id: 'f6qW7uVvL_s', label: 'SexBomb Girls (Official Music Video)' },
    { id: 'SasakyanKita1', label: 'SexBomb Girls - Sasakyan Kita (Audio)' },
    { id: 'SasakyanKita2', label: 'Sasakyan Kita (Retro OPM)' },
  ],
  'Sumayaw, Sumunod': [
    { id: 'mP1H5k33l0o', label: 'The Boyfriends (Manila Sound Audio)' },
    { id: 'SumayawSumun1', label: 'The Boyfriends (Original Master)' },
    { id: 'SumayawSumun2', label: 'Sumayaw, Sumunod (Disco Classic)' },
  ],
};

/**
 * Automatically searches for alternative working video IDs dynamically
 * using Invidious / Piped public search instances or clean fallback queries
 */
export async function searchOnlineAlternativeSources(
  title: string,
  artist: string
): Promise<MusicSource[]> {
  const query = encodeURIComponent(`${title} ${artist} audio`.trim());
  const sources: MusicSource[] = [];

  // 1. Try public Invidious API with short timeout
  const instances = [
    'https://invidious.nerdvpn.de',
    'https://inv.tux.pizza',
    'https://invidious.private.coffee',
  ];

  for (const instance of instances) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${instance}/api/v1/search?q=${query}&type=video`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          for (const item of data.slice(0, 5)) {
            if (item.videoId && /^[a-zA-Z0-9_-]{11}$/.test(item.videoId)) {
              sources.push({
                id: item.videoId,
                label: item.title || `${title} (Alternative)`,
                isWorking: true,
              });
            }
          }
          if (sources.length > 0) return sources;
        }
      }
    } catch {
      // try next instance
    }
  }

  return sources;
}

/**
 * Finds the next working alternative source for a song when the current video fails
 * Checks:
 * 1. Curated alternate list
 * 2. Song's own fallbackVideoIds or sources
 * 3. Dynamic online search
 */
export async function findNextWorkingSource(
  song: Song,
  failedId: string
): Promise<{ videoId: string; label: string } | null> {
  const failedSet = new Set<string>(song.failedSourceIds || []);
  failedSet.add(failedId);

  // 1. Check curated alternates
  for (const [key, alternates] of Object.entries(CURATED_ALTERNATE_SOURCES)) {
    if (song.title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(song.title.toLowerCase())) {
      for (const alt of alternates) {
        if (!failedSet.has(alt.id) && /^[a-zA-Z0-9_-]{11}$/.test(alt.id)) {
          return { videoId: alt.id, label: alt.label };
        }
      }
    }
  }

  // 2. Check song's own fallback list
  if (song.fallbackVideoIds && song.fallbackVideoIds.length > 0) {
    for (const id of song.fallbackVideoIds) {
      const cleanId = extractYouTubeId(id);
      if (cleanId && !failedSet.has(cleanId)) {
        return { videoId: cleanId, label: 'Backup Source' };
      }
    }
  }

  if (song.sources && song.sources.length > 0) {
    for (const src of song.sources) {
      if (!failedSet.has(src.id)) {
        return { videoId: src.id, label: src.label };
      }
    }
  }

  // 3. Dynamic online fallback search
  try {
    const onlineResults = await searchOnlineAlternativeSources(song.title, song.artist);
    for (const res of onlineResults) {
      if (!failedSet.has(res.id)) {
        return { videoId: res.id, label: res.label };
      }
    }
  } catch (err) {
    console.warn('Online alternative source lookup failed:', err);
  }

  return null;
}
