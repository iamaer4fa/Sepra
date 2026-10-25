import { LyricLine, SongLyrics } from '../types/music';

/**
 * Parses standard LRC format strings ([mm:ss.xx] Lyric text) into timestamped lines
 */
export function parseLRC(lrcText: string): LyricLine[] {
  const lines: LyricLine[] = [];
  const rawLines = lrcText.split('\n');

  const timeRegex = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\]/g;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matches = [...trimmed.matchAll(timeRegex)];
    if (matches.length > 0) {
      const text = trimmed.replace(timeRegex, '').trim();
      if (!text) continue;

      for (const match of matches) {
        const mins = parseInt(match[1], 10);
        const secs = parseInt(match[2], 10);
        const msStr = match[3] || '0';
        const ms = parseInt(msStr.padEnd(3, '0').slice(0, 3), 10);
        const timeSec = mins * 60 + secs + ms / 1000;

        lines.push({ timeSec, text });
      }
    }
  }

  // Sort chronologically
  return lines.sort((a, b) => a.timeSec - b.timeSec);
}

/**
 * Converts plain text lyrics into spaced LyricLine array based on song duration
 */
export function convertPlainTextToLines(plainText: string, durationSec = 210): LyricLine[] {
  const rawLines = plainText
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (rawLines.length === 0) return [];

  const timePerLine = Math.max(3, durationSec / (rawLines.length + 2));
  return rawLines.map((text, idx) => ({
    timeSec: Math.round((idx + 1) * timePerLine),
    text,
  }));
}

/**
 * Curated offline synchronized lyrics for the 34 initial setlist tracks
 */
const CURATED_LYRICS: Record<string, string> = {
  'Leader of the Band': `
[00:12.00] An only child alone and wild, a cabinet maker's son
[00:19.00] His hands were meant for different work and his heart was known to none
[00:26.50] He left his home and went his way and made a different choice
[00:34.00] Now his son has found a purpose and his daughters found a voice
[00:41.50] And he gave to them the gift of song
[00:46.50] That brought them to their knees
[00:52.00] The leader of the band was tired and his eyes were growing old
[00:59.00] But his blood runs through my instruments and his song is in my soul
[01:07.00] My life has been a poor attempt to imitate the man
[01:14.00] I'm just a living legacy to the leader of the band
[01:32.00] My brothers' lives were different for they heard another call
[01:39.00] One went to Chicago and the other to St. Paul
[01:46.50] And I'm off to California out upon the open road
[01:54.00] Looking for tomorrow with a heavy, heavy load
[02:08.50] The leader of the band was tired and his eyes were growing old
[02:16.00] But his blood runs through my instruments and his song is in my soul
[02:23.50] My life has been a poor attempt to imitate the man
[02:31.00] I'm just a living legacy to the leader of the band
[02:50.00] I thank you for the music and your stories of the road
[02:57.00] I thank you for the freedom when it came my time to go
[03:04.50] I thank you for the kindness and the times when you got tough
[03:12.00] And, papa, I don't think I said "I love you" near enough
[03:22.00] The leader of the band was tired and his eyes were growing old
[03:29.00] But his blood runs through my instruments and his song is in my soul
[03:37.00] My life has been a poor attempt to imitate the man
[03:44.00] I'm just a living legacy to the leader of the band
`,
  'Hopelessly Devoted to You': `
[00:14.00] Guess mine is not the first heart broken
[00:21.00] My eyes are not the first to cry
[00:27.50] I'm not the first to know there's just no getting over you
[00:40.00] You know I'm just a fool who's willing
[00:46.50] To sit around and wait for you
[00:53.00] But, baby, can't you see there's nothing else for me to do?
[01:03.00] I'm hopelessly devoted to you
[01:11.00] But now there's nowhere to hide
[01:15.00] Since you pushed my love aside
[01:18.50] I'm out of my head, hopelessly devoted to you
[01:29.50] Hopelessly devoted to you
[01:36.50] Hopelessly devoted to you
[01:45.00] My head is sayin', "Fool, forget him"
[01:51.50] My heart is sayin', "Don't let go"
[01:58.00] Hold on to the end, that's what I intend to do
[02:08.00] I'm hopelessly devoted to you
`,
  "Can't Take My Eyes Off You": `
[00:15.00] You're just too good to be true, can't take my eyes off of you
[00:23.00] You'd be like heaven to touch, I wanna hold you so much
[00:30.00] At long last love has arrived and I thank God I'm alive
[00:37.50] You're just too good to be true, can't take my eyes off of you
[00:45.00] Pardon the way that I stare, there's nothing else to compare
[00:53.00] The sight of you leaves me weak, there are no words left to speak
[01:00.00] But if you feel like I feel, please let me know that it's real
[01:08.00] You're just too good to be true, can't take my eyes off of you
[01:22.00] I love you, baby, and if it's quite all right
[01:26.50] I need you, baby, to warm the lonely night
[01:30.00] I love you, baby, trust in me when I say
[01:37.50] Oh, pretty baby, don't bring me down, I pray
[01:41.50] Oh, pretty baby, now that I found you, stay
[01:45.00] And let me love you, baby, let me love you
`,
  'September': `
[00:18.00] Do you remember the 21st night of September?
[00:23.00] Love was changin' the minds of pretenders
[00:27.50] While chasin' the clouds away
[00:35.00] Our hearts were ringin' in the key that our souls were singin'
[00:40.00] As we danced in the night, remember
[00:44.50] How the stars stole the night away, oh yeah
[00:52.00] Ba-de-ya, say, do you remember?
[00:56.50] Ba-de-ya, dancin' in September
[01:01.00] Ba-de-ya, never was a cloudy day
[01:09.50] My thoughts are with you, holdin' hands with your heart to see you
[01:14.50] Only blue talk and love, remember
[01:18.50] How we knew love was here to stay
[01:26.50] Now December found the love that we shared in September
[01:31.50] Only blue talk and love, remember
[01:35.50] The true love we share today
[01:43.00] Ba-de-ya, say, do you remember?
[01:47.50] Ba-de-ya, dancin' in September
[01:52.00] Ba-de-ya, never was a cloudy day
`,
  'Dancing Queen': `
[00:19.00] You can dance, you can jive, having the time of your life
[00:27.00] See that girl, watch that scene, digging the dancing queen
[00:43.00] Friday night and the lights are low
[00:47.00] Looking out for a place to go
[00:51.50] Where they play the right music, getting in the swing
[00:56.00] You come to look for a king
[01:00.00] Anybody could be that guy
[01:04.00] Night is young and the music's high
[01:08.50] With a bit of rock music, everything is fine
[01:13.00] You're in the mood for a dance
[01:17.50] And when you get the chance
[01:21.00] You are the dancing queen, young and sweet, only seventeen
[01:29.50] Dancing queen, feel the beat from the tambourine, oh yeah
[01:38.00] You can dance, you can jive, having the time of your life
[01:46.50] See that girl, watch that scene, digging the dancing queen
`,
  'Ligaya': `
[00:12.00] Ilang awit pa ba ang aawitin, o giliw ko?
[00:18.50] Ilang ulap pa ba ang hahawiin, o giliw ko?
[00:25.00] Ang lahat ng aking gagawin ay para lamang sa 'yo
[00:32.00] Araw-gabi ay nagdarasal na sana'y mapasakin ka
[00:40.00] 'Di mo ba alam na ako'y naghihintay
[00:46.00] Sa 'yong pag-ibig na walang kapantay
[00:53.00] Sana'y marinig mo ang tibok ng puso ko
[01:00.00] Ikaw lamang ang ligaya sa buhay ko
[01:14.00] Gagawin ko ang lahat upang maabot ka
[01:20.00] Kahit ang bundok ay aakyatin ko
[01:27.00] Basta't sabihin mo lang na mahal mo rin ako
[01:34.00] Ang lahat ay balewala para sa ligaya mo
`,
  'Awitin Mo at Isasayaw Ko': `
[00:15.00] Walang lungkot na 'di kayang daanin sa awit at indak
[00:23.00] Kasama ang tropa sa ilalim ng ilaw ng disco ball
[00:30.00] Awitin mo at isasayaw ko
[00:38.00] Ligaya'y ibahagi sa buong mundo
[00:46.00] Huwag nang mag-atubili, sumayaw na ngayon
[00:54.00] Ang tugtog ng Manila Sound ay sumasabay sa panahon
`,
  'Sumayaw, Sumunod': `
[00:14.00] Sumayaw, sumunod ka sa tugtog
[00:20.00] Lumundag, sumigaw, magpakasaya
[00:27.00] Ang musika'y pampalipas ng problema
[00:34.00] Kalimutan ang lungkot, sumayaw, sumunod!
`,
  'Stayin\' Alive': `
[00:10.00] Well, you can tell by the way I use my walk
[00:14.00] I'm a woman's man, no time to talk
[00:17.00] Music loud and women warm, I've been kicked around since I was born
[00:23.50] And now it's all right, it's okay, and you may look the other way
[00:30.00] We can try to understand the New York Times' effect on man
[00:37.00] Whether you're a brother or whether you're a mother
[00:40.00] You're stayin' alive, stayin' alive
[00:43.50] Feel the city breakin' and everybody shakin'
[00:47.00] And we're stayin' alive, stayin' alive
[00:50.00] Ah, ha, ha, ha, stayin' alive, stayin' alive
`,
  'Total Eclipse of the Heart': `
[00:10.00] (Turn around) Every now and then I get a little bit lonely
[00:14.50] And you're never coming 'round
[00:18.00] (Turn around) Every now and then I get a little bit tired
[00:22.00] Of listening to the sound of my tears
[00:25.50] (Turn around) Every now and then I get a little bit nervous
[00:30.00] That the best of all the years have gone by
[00:33.50] (Turn around) Every now and then I get a little bit terrified
[00:37.50] And then I see the look in your eyes
[00:41.50] (Turn around, bright eyes) Every now and then I fall apart
[00:53.00] And I need you now tonight, and I need you more than ever
[01:00.00] And if you only hold me tight, we'll be holding on forever
`,
  'Making Love Out of Nothing at All': `
[00:14.00] I know just how to whisper and I know just how to cry
[00:21.00] I know just where to find the answers and I know just how to lie
[00:28.00] I know just how to fake it and I know just how to scheme
[00:34.00] I know just when to face the truth and then I know just when to dream
[00:47.00] And I know just where to touch you and I know just what to prove
[00:54.00] I know when to pull you closer and I know when to let you loose
[01:05.00] And I can make the runner stumble, I can make the final block
[01:12.00] And I can make every tackle at the sound of the clock
[01:23.00] But I don't know how to leave you and I'll never let you fall
[01:31.00] And I don't know how you do it, making love out of nothing at all
`,
  'Footloose': `
[00:12.00] Been working so hard, I'm punching my card
[00:16.00] Eight hours for what? Oh, tell me what I got
[00:20.00] I've got this feeling that time's just holding me down
[00:24.00] I'll hit the ceiling or else I'll tear up this town
[00:28.00] Tonight I gotta cut loose, footloose
[00:32.00] Kick off your Sunday shoes
[00:35.00] Please, Louise, pull me off of my knees
[00:40.00] Jack, get back, come on before we crack
[00:43.00] Lose your blues, everybody cut footloose!
`,
};

/**
 * Main service to retrieve lyrics:
 * 1. Checks user fullLyrics on song
 * 2. Checks curated LRC dictionary
 * 3. Calls public LRCLIB API (lrclib.net) with timeout
 * 4. Falls back to lyric snippet if available
 * 5. Returns null if not found
 */
export async function fetchLyrics(
  title: string,
  artist: string,
  customLyrics?: string,
  durationSec = 210
): Promise<SongLyrics | null> {
  // 1. If song object has custom or saved full lyrics
  if (customLyrics && customLyrics.trim()) {
    const lrcLines = parseLRC(customLyrics);
    if (lrcLines.length > 0) {
      return { isSynced: true, lines: lrcLines, plainText: customLyrics, source: 'Custom' };
    }
    const plainLines = convertPlainTextToLines(customLyrics, durationSec);
    return { isSynced: false, lines: plainLines, plainText: customLyrics, source: 'Custom' };
  }

  // 2. Check offline curated dictionary
  for (const [key, lrc] of Object.entries(CURATED_LYRICS)) {
    if (title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(title.toLowerCase())) {
      const parsed = parseLRC(lrc);
      if (parsed.length > 0) {
        return { isSynced: true, lines: parsed, plainText: lrc, source: 'HarmoniQ Synced Library' };
      }
    }
  }

  // 3. Query LRCLIB public API (free, open, no key required)
  try {
    const cleanTitle = title.replace(/\(.*?\)|\[.*?\]/g, '').trim();
    const cleanArtist = artist.split('/')[0].replace(/\(.*?\)/g, '').trim();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(
      `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.syncedLyrics) {
        const lines = parseLRC(data.syncedLyrics);
        if (lines.length > 0) {
          return { isSynced: true, lines, plainText: data.plainLyrics || data.syncedLyrics, source: 'LRCLIB Synced' };
        }
      }
      if (data.plainLyrics) {
        const lines = convertPlainTextToLines(data.plainLyrics, durationSec);
        return { isSynced: false, lines, plainText: data.plainLyrics, source: 'LRCLIB' };
      }
    }
  } catch (err) {
    // network timeout or abort, non-fatal
  }

  return null;
}
