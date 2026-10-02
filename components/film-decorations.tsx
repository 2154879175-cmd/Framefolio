import frames from "@/data/archive/stills.json";

const archiveFrames: Record<string, { path: string; source: string; tmdbPath: string }[]> = frames;

export function FilmStrip({ tmdbId, title }: { tmdbId?: number; title?: string }) {
  const images = tmdbId ? archiveFrames[String(tmdbId)] ?? [] : [archiveFrames["157336"]?.[0], archiveFrames["1949"]?.[0], archiveFrames["489999"]?.[0]].filter(Boolean);
  if (!images.length) return null;
  return (
    <figure className="film-strip-figure">
      <div className="film-strip">
        {images.map((image, index) => <div className="film-strip-frame" key={image.path}><img src={image.path} alt={title ? `${title} · 电影画面 / Film frame ${index + 1}` : "电影画面 / Film frame"} loading="lazy" width={780} height={439} /><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>)}
      </div>
      <figcaption><span>画面拾遗 / Frames that stay</span><span>TMDB · 35mm inspired</span></figcaption>
    </figure>
  );
}

export function OrbitDecoration() {
  return (
    <svg className="orbit-decoration" viewBox="0 0 240 260" fill="none" aria-hidden="true">
      <circle cx="110" cy="125" r="44" fill="currentColor" opacity=".1" />
      <ellipse cx="115" cy="125" rx="97" ry="58" transform="rotate(-35 115 125)" stroke="currentColor" strokeWidth=".8" strokeDasharray="2 5" />
      <ellipse cx="115" cy="125" rx="62" ry="106" transform="rotate(-25 115 125)" stroke="currentColor" strokeWidth=".7" />
      <path d="M110 10v233M20 125h200" stroke="currentColor" strokeWidth=".5" opacity=".4" />
      <circle cx="167" cy="49" r="14" fill="currentColor" opacity=".18" /><circle cx="29" cy="156" r="4" fill="currentColor" /><circle cx="171" cy="207" r="3" fill="currentColor" />
      <path d="m193 100 3-11 3 11 11 3-11 3-3 11-3-11-11-3zm-134 86 2-7 2 7 7 2-7 2-2 7-2-7-7-2z" fill="currentColor" />
    </svg>
  );
}

export function CinemaSketch() {
  return <img src="/decorations/cinema-projector.png" alt="" aria-hidden="true" className="cinema-sketch" loading="lazy" width={1328} height={1200} />;
}
