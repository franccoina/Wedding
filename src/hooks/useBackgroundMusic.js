import { useCallback, useEffect, useRef, useState } from "react";

const preferenceKey = "wedding-background-music-enabled";
const defaultVolume = 0.24;

function readPreference() {
  return localStorage.getItem(preferenceKey) !== "false";
}

export function useBackgroundMusic(src) {
  const audioRef = useRef(null);
  const [enabled, setEnabled] = useState(readPreference);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  // The audio element's "play"/"pause" events are the single source of truth
  // for `playing`, so this function never calls setState directly.
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !enabled || unavailable) return;

    try {
      await audio.play();
    } catch {
      // Autoplay was blocked; playback will be retried after a user gesture.
    }
  }, [enabled, unavailable]);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = defaultVolume;
    audio.preload = "auto";
    audioRef.current = audio;

    const markPlaying = () => setPlaying(true);
    const markPaused = () => setPlaying(false);
    const markUnavailable = () => {
      setUnavailable(true);
      setPlaying(false);
    };

    audio.addEventListener("play", markPlaying);
    audio.addEventListener("pause", markPaused);
    audio.addEventListener("error", markUnavailable);

    return () => {
      audio.pause();
      audio.removeEventListener("play", markPlaying);
      audio.removeEventListener("pause", markPaused);
      audio.removeEventListener("error", markUnavailable);
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    localStorage.setItem(preferenceKey, String(enabled));

    if (!enabled) {
      // Pausing fires the "pause" event, whose listener updates `playing`,
      // so we avoid calling setState synchronously inside the effect body.
      audioRef.current?.pause();
      return undefined;
    }

    attemptPlay();

    const startAfterInteraction = () => attemptPlay();
    window.addEventListener("pointerdown", startAfterInteraction, { once: true });
    window.addEventListener("keydown", startAfterInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", startAfterInteraction);
      window.removeEventListener("keydown", startAfterInteraction);
    };
  }, [attemptPlay, enabled]);

  const toggle = useCallback(() => {
    setEnabled((current) => !current);
  }, []);

  return { enabled, playing, unavailable, toggle };
}
