"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  formatDuration,
  musicCollections,
  tracks as allTracks,
  tracksInCollection,
  type Track,
} from "@/data/music";
import { useMusic } from "@/lib/music-player";
import { useVolumeControlSupported } from "@/lib/store";
import {
  loadSoundCloudApi,
  PLAY_EVENT,
  READY_EVENT,
  widgetVolume,
  type SoundCloudWidget,
} from "@/lib/soundcloud";
import { ExternalIcon, SpeakerIcon } from "@/components/ui/icons";
import { TrackArt } from "./TrackArt";

type ViewId = "all" | string;

/**
 * Tracks that are not hosted here play through SoundCloud's own embed, so the
 * record stays on the artist's account and keeps their plays.
 */
function SoundCloudPlayer({ track }: { track: Track }) {
  const { volume, registerExternal, externalStarted } = useMusic();
  const frameRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const [attached, setAttached] = useState(false);
  // Snapshot of the volume at mount, so attaching does not have to depend on
  // a value that changes every time the slider moves.
  const [volumeAtMount] = useState(volume);

  // This component is keyed by track, so it mounts fresh for each embed.
  useEffect(() => {
    if (!frameRef.current) return;

    let cancelled = false;
    void loadSoundCloudApi().then((api) => {
      if (cancelled || !api || !frameRef.current) return;
      const widget = api.Widget(frameRef.current);
      widgetRef.current = widget;

      const applyVolume = () => widget.setVolume(widgetVolume(volumeAtMount));
      // Set it now in case READY already fired, and again on READY in case it
      // has not. Either way the embed never starts at its own default.
      applyVolume();
      widget.bind(api.Widget.Events?.READY ?? READY_EVENT, applyVolume);

      // Whichever player starts last wins, so the two never overlap.
      widget.bind(api.Widget.Events?.PLAY ?? PLAY_EVENT, externalStarted);
      registerExternal({
        pause: () => {
          try {
            widget.pause();
          } catch {
            // The iframe may already be gone; nothing left to pause.
          }
        },
      });

      if (!cancelled) setAttached(true);
    });

    return () => {
      cancelled = true;
      // No pause() here: React has already detached the iframe by this point,
      // so the widget would post to a null contentWindow and throw. Removing
      // the iframe stops playback on its own.
      widgetRef.current = null;
      registerExternal(null);
    };
  }, [volumeAtMount, registerExternal, externalStarted]);

  // Keep the embed in step with the volume slider.
  useEffect(() => {
    if (!attached) return;
    try {
      widgetRef.current?.setVolume(widgetVolume(volume));
    } catch {
      // Same story: never let a detached iframe take the app down.
    }
  }, [volume, attached]);

  if (!track.embedUrl) return null;
  const src =
    track.embedUrl +
    "&color=%230068d6&auto_play=false&hide_related=true" +
    "&show_comments=false&show_user=true&show_teaser=false&visual=false";
  return (
    <div className="px-5 pb-4 sm:px-6">
      <div className="overflow-hidden rounded-[9px] border border-[var(--hairline)]">
        <iframe
          ref={frameRef}
          title={"" + track.title + " by " + track.artist + " on SoundCloud"}
          src={src}
          width="100%"
          height="120"
          allow="autoplay"
          className="block w-full border-0"
        />
      </div>
      <p className="mt-2 text-[12px] text-[var(--ink-faint)]">
        {track.credit}{" "}
        {track.sourceUrl && (
          <a
            href={track.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-[var(--accent)] hover:underline"
          >
            Open on SoundCloud
          </a>
        )}
      </p>
    </div>
  );
}

export function Music() {
  const [view, setView] = useState<ViewId>("all");
  const [embedded, setEmbedded] = useState<Track | null>(null);
  const player = useMusic();

  const visible = useMemo(
    () => (view === "all" ? allTracks : tracksInCollection(view)),
    [view],
  );
  const heading =
    view === "all"
      ? { name: "All Music", description: "Everything in the library." }
      : (musicCollections.find((c) => c.id === view) ?? {
          name: "Music",
          description: "",
        });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <NowPlayingBar />

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <nav
          aria-label="Music library"
          className="retro-scroll hairline-b w-full shrink-0 overflow-x-auto bg-[var(--sidebar)] sm:hairline-r sm:w-[176px] sm:overflow-x-hidden sm:overflow-y-auto sm:border-b-0 sm:py-3"
        >
          <p className="label-micro hidden px-4 pb-1.5 text-[10px] text-[var(--ink-faint)] sm:block">
            Library
          </p>
          <ul className="flex sm:block">
            <SidebarItem
              label="All Music"
              active={view === "all"}
              onSelect={() => setView("all")}
            />
            {musicCollections.map((c) => (
              <SidebarItem
                key={c.id}
                label={c.name}
                active={view === c.id}
                onSelect={() => setView(c.id)}
              />
            ))}
          </ul>
        </nav>

        <div className="retro-scroll min-w-0 flex-1 overflow-y-auto">
          <div className="px-5 pt-5 pb-2 sm:px-6">
            <h2 className="display-tight text-[22px] leading-tight font-semibold text-[var(--ink)]">
              {heading.name}
            </h2>
            {heading.description && (
              <p className="mt-1 text-[13px] text-[var(--ink-soft)]">
                {heading.description}
              </p>
            )}
          </div>

          {embedded && <SoundCloudPlayer key={embedded.id} track={embedded} />}

          <TrackTable
            tracks={visible}
            onPlay={player.play}
            onSelectEmbed={(t) =>
              // Opening a player is not starting it, so nothing is paused
              // here. The embed's own PLAY event handles the handover.
              setEmbedded((prev) => (prev?.id === t.id ? null : t))
            }
            embeddedId={embedded?.id ?? null}
          />
        </div>
      </div>
    </div>
  );
}

function SidebarItem({
  label,
  active,
  onSelect,
}: {
  label: string;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li className="shrink-0">
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className={`mx-2 flex w-auto shrink-0 items-center gap-2 rounded-[6px] px-2.5 py-[6px] text-left text-[13px] whitespace-nowrap transition-colors sm:w-[calc(100%-16px)] ${
          active
            ? "bg-[var(--accent)] font-medium text-[var(--accent-ink)]"
            : "text-[var(--ink-soft)] hover:bg-[color-mix(in_srgb,var(--ink)_7%,transparent)] hover:text-[var(--ink)]"
        }`}
      >
        {label}
      </button>
    </li>
  );
}

function TrackTable({
  tracks,
  onPlay,
  onSelectEmbed,
  embeddedId,
}: {
  tracks: Track[];
  onPlay: (t: Track) => void;
  onSelectEmbed: (t: Track) => void;
  embeddedId: string | null;
}) {
  const player = useMusic();

  if (tracks.length === 0) {
    return (
      <p className="px-6 py-8 text-center text-[13px] text-[var(--ink-faint)]">
        Nothing here yet.
      </p>
    );
  }

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr className="hairline-b">
          <th
            scope="col"
            className="label-micro w-[62px] py-2 pr-2 pl-5 text-[10px] font-semibold text-[var(--ink-faint)] sm:pl-6"
          >
            <span className="sr-only-block">Track number</span>
          </th>
          <th
            scope="col"
            className="label-micro px-2 py-2 text-[10px] font-semibold text-[var(--ink-faint)]"
          >
            Title
          </th>
          <th
            scope="col"
            className="label-micro hidden px-2 py-2 text-[10px] font-semibold text-[var(--ink-faint)] md:table-cell"
          >
            Artist
          </th>
          <th
            scope="col"
            className="label-micro hidden w-[64px] px-2 py-2 text-[10px] font-semibold text-[var(--ink-faint)] sm:table-cell"
          >
            Year
          </th>
          <th
            scope="col"
            className="label-micro w-[92px] py-2 pr-5 pl-3 text-right text-[10px] font-semibold text-[var(--ink-faint)] sm:pr-6"
          >
            Time
          </th>
        </tr>
      </thead>
      <tbody>
        {tracks.map((track, i) => {
          const isCurrent = player.current?.id === track.id;
          const isPlaying = isCurrent && player.playing;
          const playable = Boolean(track.src);
          const isEmbedOpen = embeddedId === track.id;

          return (
            <tr
              key={track.id}
              onDoubleClick={() =>
                playable
                  ? onPlay(track)
                  : track.embedUrl && onSelectEmbed(track)
              }
              className={`group transition-colors ${
                isCurrent || isEmbedOpen
                  ? "bg-[var(--accent-soft)]"
                  : "hover:bg-[color-mix(in_srgb,var(--ink)_5%,transparent)]"
              }`}
            >
              <td className="py-1.5 pr-2 pl-5 align-middle sm:pl-6">
                {playable ? (
                  <button
                    type="button"
                    onClick={() =>
                      isPlaying ? player.toggle() : onPlay(track)
                    }
                    aria-label={
                      isPlaying ? `Pause ${track.title}` : `Play ${track.title}`
                    }
                    className="grid h-[26px] w-[26px] place-items-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--ink)]"
                  >
                    {isPlaying ? (
                      <EqualiserBars />
                    ) : (
                      <>
                        <span className="tabular text-[12px] text-[var(--ink-faint)] group-hover:hidden">
                          {i + 1}
                        </span>
                        <PlayGlyph className="hidden group-hover:block" />
                      </>
                    )}
                  </button>
                ) : track.embedUrl ? (
                  <button
                    type="button"
                    onClick={() => onSelectEmbed(track)}
                    aria-expanded={isEmbedOpen}
                    aria-label={
                      (isEmbedOpen
                        ? "Hide the player for "
                        : "Show the player for ") + track.title
                    }
                    className="grid h-[26px] w-[26px] place-items-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--ink)]"
                  >
                    <span className="tabular text-[12px] text-[var(--ink-faint)] group-hover:hidden">
                      {i + 1}
                    </span>
                    <PlayGlyph className="hidden group-hover:block" />
                  </button>
                ) : (
                  <span className="tabular grid h-[26px] w-[26px] place-items-center text-[12px] text-[var(--ink-faint)]">
                    {i + 1}
                  </span>
                )}
              </td>

              <td className="min-w-0 px-2 py-1.5">
                <div className="flex items-center gap-2.5">
                  <TrackArt track={track} size={30} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`block truncate text-[13.5px] font-medium ${
                          isCurrent || isEmbedOpen
                            ? "text-[var(--accent)]"
                            : "text-[var(--ink)]"
                        }`}
                      >
                        {track.title}
                      </span>
                    </div>
                    <span className="block truncate text-[11.5px] text-[var(--ink-faint)] md:hidden">
                      {track.artist}
                    </span>
                  </div>
                </div>
              </td>

              <td className="hidden max-w-[180px] truncate px-2 py-1.5 text-[13px] text-[var(--ink-soft)] md:table-cell">
                {track.artist}
              </td>

              <td className="tabular hidden px-2 py-1.5 text-[13px] text-[var(--ink-faint)] sm:table-cell">
                {track.year ?? ""}
              </td>

              <td className="py-1.5 pr-5 pl-3 text-right sm:pr-6">
                {!playable && track.sourceUrl ? (
                  <a
                    href={track.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={
                      "Open " +
                      track.title +
                      " by " +
                      track.artist +
                      " on SoundCloud"
                    }
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--accent)] hover:underline"
                  >
                    SoundCloud
                    <ExternalIcon size={11} />
                  </a>
                ) : (
                  <span className="tabular text-[13px] text-[var(--ink-faint)]">
                    {formatDuration(
                      isCurrent && player.duration
                        ? player.duration
                        : track.duration,
                    )}
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function NowPlayingBar() {
  const player = useMusic();
  // On iOS the slider would be inert, so it is not offered at all.
  const canSetVolume = useVolumeControlSupported();
  const track = player.current;
  const total = player.duration || track?.duration || 0;

  return (
    <div className="hairline-b flex shrink-0 items-center gap-3 bg-[var(--titlebar)] px-3 py-2.5">
      <div className="flex shrink-0 items-center gap-0.5">
        <TransportButton label="Previous track" onClick={player.previous}>
          <SkipGlyph direction="back" />
        </TransportButton>
        <button
          type="button"
          onClick={player.toggle}
          aria-label={player.playing ? "Pause" : "Play"}
          className="grid h-[30px] w-[30px] place-items-center rounded-full text-[var(--ink)] transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)]"
        >
          {player.playing ? <PauseGlyph /> : <PlayGlyph />}
        </button>
        <TransportButton label="Next track" onClick={player.next}>
          <SkipGlyph direction="forward" />
        </TransportButton>
      </div>

      {/* The display panel, the way iTunes framed it. */}
      <div className="surface-inset flex min-w-0 flex-1 items-center gap-2.5 rounded-[7px] px-2.5 py-1.5">
        {track ? (
          <>
            <TrackArt track={track} size={30} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-[var(--ink)]">
                {track.title}
              </p>
              <p className="truncate text-[11px] text-[var(--ink-faint)]">
                {player.loading ? "Loading…" : track.artist}
              </p>
              <Scrubber
                time={player.time}
                duration={total}
                onSeek={player.seek}
                title={track.title}
              />
            </div>
            <span className="tabular hidden shrink-0 text-[11px] text-[var(--ink-faint)] sm:block">
              −{formatDuration(Math.max(0, total - player.time))}
            </span>
          </>
        ) : (
          <p className="w-full py-1.5 text-center text-[12px] text-[var(--ink-faint)]">
            Select a track to play
          </p>
        )}
      </div>

      {canSetVolume && (
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <SpeakerIcon
            size={13}
            muted={player.volume === 0}
            className="text-[var(--ink-faint)]"
          />
          <label className="sr-only-block" htmlFor="music-volume">
            Volume
          </label>
          <input
            id="music-volume"
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={player.volume}
            onChange={(e) => player.setVolume(Number(e.target.value))}
            className="h-1 w-[70px] cursor-pointer appearance-none rounded-full bg-[var(--hairline-strong)] accent-[var(--accent)]"
          />
        </div>
      )}
    </div>
  );
}

function Scrubber({
  time,
  duration,
  onSeek,
  title,
}: {
  time: number;
  duration: number;
  onSeek: (s: number) => void;
  title: string;
}) {
  const pct = duration > 0 ? Math.min(100, (time / duration) * 100) : 0;
  return (
    <div className="relative mt-1 h-[4px]">
      <div className="absolute inset-0 rounded-full bg-[var(--hairline-strong)]" />
      <div
        className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
        style={{ width: `${pct}%` }}
      />
      <input
        type="range"
        min={0}
        max={Math.max(duration, 0.1)}
        step={0.1}
        value={Math.min(time, duration || 0)}
        onChange={(e) => onSeek(Number(e.target.value))}
        aria-label={`Seek within ${title}`}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0"
      />
    </div>
  );
}

function TransportButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-[28px] w-[28px] place-items-center rounded-full text-[var(--ink-soft)] transition-colors hover:bg-[color-mix(in_srgb,var(--ink)_10%,transparent)] hover:text-[var(--ink)]"
    >
      {children}
    </button>
  );
}

/* --------------------------------------------------------------- glyphs */

function PlayGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      aria-hidden
      className={className}
    >
      <path d="M3.5 2.2l8 4.8-8 4.8z" fill="currentColor" />
    </svg>
  );
}

function PauseGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M3.6 2.4h2.6v9.2H3.6zM7.8 2.4h2.6v9.2H7.8z"
        fill="currentColor"
      />
    </svg>
  );
}

function SkipGlyph({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      aria-hidden
      style={direction === "back" ? { transform: "scaleX(-1)" } : undefined}
    >
      <path d="M2.6 2.6l7 4.4-7 4.4z" fill="currentColor" />
      <path d="M10.4 2.6h1.6v8.8h-1.6z" fill="currentColor" />
    </svg>
  );
}

/** Animated bars marking the row that is currently sounding. */
function EqualiserBars() {
  return (
    <span aria-hidden className="flex h-[13px] items-end gap-[2px]">
      {[0, 140, 280].map((delay) => (
        <span
          key={delay}
          className="eq-bar block w-[3px] rounded-[1px] bg-[var(--accent)]"
          style={{ height: "100%", animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  );
}
