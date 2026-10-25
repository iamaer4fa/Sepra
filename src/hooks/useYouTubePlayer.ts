import { useEffect, useRef, useState, useCallback } from 'react';
import { Song, RepeatMode } from '../types/music';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface UseYouTubePlayerProps {
  currentSong: Song | null;
  onTrackEnded: () => void;
  repeatMode: RepeatMode;
}

export function useYouTubePlayer({
  currentSong,
  onTrackEnded,
  repeatMode,
}: UseYouTubePlayerProps) {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const [isMuted, setIsMutedState] = useState(false);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const playerRef = useRef<any>(null);
  const timeIntervalRef = useRef<any>(null);
  const isDraggingSeek = useRef(false);
  const repeatModeRef = useRef(repeatMode);
  repeatModeRef.current = repeatMode;

  const currentSongRef = useRef(currentSong);
  currentSongRef.current = currentSong;

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsReady(true);
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    const prevOnReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevOnReady) prevOnReady();
      setIsReady(true);
    };

    return () => {
      // clean up if needed
    };
  }, []);

  // Initialize player instance when API ready
  const initPlayer = useCallback((containerId: string) => {
    if (!window.YT || !window.YT.Player) return;

    if (playerRef.current) {
      return;
    }

    try {
      playerRef.current = new window.YT.Player(containerId, {
        height: '100%',
        width: '100%',
        videoId: currentSongRef.current?.youtubeVideoId || 'qso3MZk1eG4',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 1,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume);
            if (isMuted) event.target.mute();
            if (currentSongRef.current?.durationSec) {
              setDuration(currentSongRef.current.durationSec);
            }
          },
          onStateChange: (event: any) => {
            // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
            if (event.data === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
              setPlayerError(null);
              const dur = event.target.getDuration();
              if (dur && dur > 0) setDuration(dur);
            } else if (event.data === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (event.data === 3) {
              setIsBuffering(true);
            } else if (event.data === 0) {
              setIsPlaying(false);
              setIsBuffering(false);
              if (repeatModeRef.current === 'one') {
                event.target.seekTo(0);
                event.target.playVideo();
              } else {
                onTrackEnded();
              }
            }
          },
          onError: (event: any) => {
            console.warn('YouTube Player Event Error:', event.data);
            setIsBuffering(false);
            if (event.data === 101 || event.data === 150) {
              setPlayerError('Embedding is restricted by owner for this video. You can open direct links or select another video ID.');
            } else if (event.data === 2) {
              setPlayerError('Invalid video ID or parameter.');
            } else {
              setPlayerError('Playback interrupted. Click play or use provider link.');
            }
          },
        },
      });
    } catch (err) {
      console.error('Failed to init YT player:', err);
    }
  }, [volume, isMuted, onTrackEnded]);

  // Load new song when currentSong changes
  useEffect(() => {
    if (!currentSong) return;

    setPlayerError(null);
    setCurrentTime(0);
    setDuration(currentSong.durationSec || 0);

    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      try {
        if (currentSong.youtubeVideoId) {
          playerRef.current.loadVideoById(currentSong.youtubeVideoId);
          setIsPlaying(true);
        } else {
          // If no video ID, pause
          playerRef.current.stopVideo();
          setIsPlaying(false);
        }
      } catch (e) {
        console.warn('Error loading video by ID:', e);
      }
    }
  }, [currentSong?.id, currentSong?.youtubeVideoId]);

  // Progress ticker
  useEffect(() => {
    if (isPlaying) {
      timeIntervalRef.current = setInterval(() => {
        if (isDraggingSeek.current) return;
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime();
            const dur = playerRef.current.getDuration();
            if (typeof time === 'number') setCurrentTime(time);
            if (typeof dur === 'number' && dur > 0) setDuration(dur);
          } catch (e) {
            // ignore cross-frame errors
          }
        }
      }, 250);
    } else {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    }

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isPlaying]);

  const play = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
        setIsPlaying(true);
      } catch (e) {
        console.warn('Could not call playVideo', e);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } catch (e) {
        console.warn('Could not call pauseVideo', e);
      }
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seekTo = useCallback((seconds: number, allowSeekAhead = true) => {
    const target = Math.max(0, Math.min(seconds, duration || 99999));
    setCurrentTime(target);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(target, allowSeekAhead);
      } catch (e) {
        console.warn('Could not seek', e);
      }
    }
  }, [duration]);

  const rewind = useCallback((seconds = 10) => {
    const target = Math.max(0, currentTime - seconds);
    seekTo(target, true);
  }, [currentTime, seekTo]);

  const fastForward = useCallback((seconds = 10) => {
    const target = Math.min((duration || 99999), currentTime + seconds);
    seekTo(target, true);
  }, [currentTime, duration, seekTo]);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(clamped);
        if (clamped > 0 && isMuted) {
          setIsMutedState(false);
          playerRef.current.unMute();
        }
      } catch (e) {
        // ignore
      }
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    if (playerRef.current) {
      try {
        if (nextMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (e) {
        // ignore
      }
    }
  }, [isMuted]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
      try {
        playerRef.current.setPlaybackRate(rate);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  return {
    isReady,
    isPlaying,
    isBuffering,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
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
    setPlaybackRate,
    isDraggingSeek,
  };
}
