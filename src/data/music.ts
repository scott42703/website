export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Role credit line, shown on the track detail. */
  credit: string;
  year: string | null;
  /** A file under /public/music, for tracks hosted on this site. */
  src: string | null;
  /**
   * A SoundCloud player URL. Tracks that are not hosted here play through the
   * official embed instead, so the record stays on the owner's account and
   * their play count.
   */
  embedUrl: string | null;
  /** Link back to the track's own page, so credit leads somewhere. */
  sourceUrl: string | null;
  /** Seconds. Only meaningful for hosted files. */
  duration: number | null;
  /** Two colours for the generated cover art. */
  art: [string, string];
  collectionId: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
}

export const musicCollections: Collection[] = [
  {
    id: "produced",
    name: "Produced by Scott",
    description: "Beats and instrumentals written and produced in FL Studio.",
  },
  {
    id: "friends",
    name: "Friends & Collaborators",
    description:
      "Records by people I work with. Each one plays from the artist's own SoundCloud.",
  },
];

export const tracks: Track[] = [
  {
    id: "lights",
    title: "Lights",
    artist: "Scott Alessio",
    credit: "Written and produced by Scott Alessio",
    year: "2026",
    src: "/music/lights.mp3",
    embedUrl: null,
    sourceUrl: null,
    duration: 195,
    art: ["#5b6cff", "#12d1c4"],
    collectionId: "produced",
  },
  {
    id: "two-sides",
    title: "Two Sides",
    artist: "Scott Alessio",
    credit: "Written and produced by Scott Alessio",
    year: "2026",
    src: "/music/two-sides.mp3",
    embedUrl: null,
    sourceUrl: null,
    duration: 156,
    art: ["#ff7847", "#c4318f"],
    collectionId: "produced",
  },
  {
    id: "wave",
    title: "Wave",
    artist: "Scott Alessio",
    credit: "Written and produced by Scott Alessio",
    year: "2025",
    src: "/music/wave.mp3",
    embedUrl: null,
    sourceUrl: null,
    duration: 128,
    art: ["#7b4bff", "#ff5c8a"],
    collectionId: "produced",
  },
  {
    id: "ambient",
    title: "Ambient",
    artist: "Scott Alessio",
    credit: "Written and produced by Scott Alessio",
    year: "2025",
    src: "/music/ambient.mp3",
    embedUrl: null,
    sourceUrl: null,
    duration: 206,
    art: ["#1f6feb", "#8957e5"],
    collectionId: "produced",
  },
  {
    id: "come-on",
    title: "COME ON",
    artist: "imnotvrycreative",
    credit: "imnotvrycreative. Produced by Wolfgang Pander.",
    year: null,
    src: null,
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2326629470",
    sourceUrl: "https://soundcloud.com/imnotvrycreative/come-on",
    duration: null,
    art: ["#ff7a3d", "#ff2d6f"],
    collectionId: "friends",
  },
  {
    id: "i-know-you",
    title: "i know you",
    artist: "endri",
    credit: "endri, featuring shayan.",
    year: null,
    src: null,
    embedUrl:
      "https://w.soundcloud.com/player/?url=https%3A%2F%2Fapi.soundcloud.com%2Ftracks%2F2208385400",
    sourceUrl: "https://soundcloud.com/endrisdeath/i-know-you",
    duration: null,
    art: ["#2f6f6f", "#7bd6a8"],
    collectionId: "friends",
  },
];

export function tracksInCollection(collectionId: string): Track[] {
  return tracks.filter((t) => t.collectionId === collectionId);
}

/** Only locally hosted tracks take part in the play queue. */
export const playableTracks = tracks.filter((t) => t.src);

export function formatDuration(seconds: number | null): string {
  if (seconds == null || !Number.isFinite(seconds)) return "";
  const total = Math.max(0, Math.round(seconds));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
