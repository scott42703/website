"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { playableTracks, type Track } from "@/data/music";
import { assetPath } from "./asset";

/**
 * A player this app does not own, currently a SoundCloud embed. It registers
 * itself so the two can take turns instead of talking over each other.
 */
export interface ExternalPlayer {
  pause: () => void;
}

interface PlayerApi {
  current: Track | null;
  playing: boolean;
  /** Seconds elapsed in the current track. */
  time: number;
  /** Seconds, from the file's own metadata once it has loaded. */
  duration: number;
  volume: number;
  /** True between pressing play and the first frame of audio. */
  loading: boolean;
  play: (track: Track) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  setVolume: (value: number) => void;
  /** Called by an embed when it mounts and unmounts. */
  registerExternal: (player: ExternalPlayer | null) => void;
  /** Called by an embed the moment it starts playing. */
  externalStarted: () => void;
}

const MusicContext = createContext<PlayerApi | null>(null);

/**
 * One audio element for the whole desktop, owned above the window layer so
 * playback survives closing and reopening the Music window, the way it would
 * on a real machine.
 */
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [loading, setLoading] = useState(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const el = new Audio();
      el.preload = "none";
      el.volume = 0.8;
      audioRef.current = el;
    }
    return audioRef.current;
  }, []);

  const externalRef = useRef<ExternalPlayer | null>(null);

  const registerExternal = useCallback((player: ExternalPlayer | null) => {
    externalRef.current = player;
  }, []);

  /** An embed just took over, so whatever we were playing stands down. */
  const externalStarted = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  /** Mirror image: we are about to make noise, so silence the embed. */
  const silenceExternal = useCallback(() => {
    externalRef.current?.pause();
  }, []);

  const play = useCallback(
    (track: Track) => {
      if (!track.src) return;
      silenceExternal();
      const el = getAudio();
      if (current?.id !== track.id) {
        el.src = assetPath(track.src);
        setCurrent(track);
        setTime(0);
        setDuration(track.duration ?? 0);
      }
      setLoading(true);
      void el.play().catch(() => setLoading(false));
    },
    [current?.id, getAudio, silenceExternal],
  );

  const advance = useCallback(
    (delta: number) => {
      if (playableTracks.length === 0) return;
      const index = current
        ? playableTracks.findIndex((t) => t.id === current.id)
        : -1;
      const nextIndex =
        (index + delta + playableTracks.length) % playableTracks.length;
      play(playableTracks[nextIndex]);
    },
    [current, play],
  );

  // The media listeners are attached once, so they must not close over a
  // particular render's `advance`. This ref always points at the current one.
  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  useEffect(() => {
    const el = getAudio();
    const onTime = () => setTime(el.currentTime);
    const onDuration = () =>
      setDuration(Number.isFinite(el.duration) ? el.duration : 0);
    const onPlay = () => {
      setPlaying(true);
      setLoading(false);
    };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onEnded = () => {
      setPlaying(false);
      advanceRef.current(1);
    };
    const onError = () => {
      setPlaying(false);
      setLoading(false);
    };

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onDuration);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onDuration);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      el.pause();
    };
  }, [getAudio]);

  const toggle = useCallback(() => {
    const el = getAudio();
    if (!current) {
      const first = playableTracks[0];
      if (first) play(first);
      return;
    }
    if (el.paused) {
      silenceExternal();
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [current, getAudio, play, silenceExternal]);

  const previous = useCallback(() => {
    const el = getAudio();
    // Restart the track first, like every music player ever made.
    if (el.currentTime > 3) {
      el.currentTime = 0;
      return;
    }
    advance(-1);
  }, [advance, getAudio]);

  const next = useCallback(() => advance(1), [advance]);

  const seek = useCallback(
    (seconds: number) => {
      const el = getAudio();
      if (!Number.isFinite(seconds)) return;
      el.currentTime = Math.max(0, Math.min(seconds, el.duration || seconds));
      setTime(el.currentTime);
    },
    [getAudio],
  );

  const setVolume = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value));
      getAudio().volume = clamped;
      setVolumeState(clamped);
    },
    [getAudio],
  );

  const api = useMemo<PlayerApi>(
    () => ({
      current,
      playing,
      time,
      duration,
      volume,
      loading,
      play,
      toggle,
      next,
      previous,
      seek,
      setVolume,
      registerExternal,
      externalStarted,
    }),
    [
      current,
      playing,
      time,
      duration,
      volume,
      loading,
      play,
      toggle,
      next,
      previous,
      seek,
      setVolume,
      registerExternal,
      externalStarted,
    ],
  );

  return <MusicContext.Provider value={api}>{children}</MusicContext.Provider>;
}

export function useMusic(): PlayerApi {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic must be used inside <MusicProvider>");
  return ctx;
}
