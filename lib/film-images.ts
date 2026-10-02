export type TmdbBackdrop = {
  file_path: string;
  width: number;
  height: number;
  iso_639_1: string | null;
};

export function selectFilmImages(backdrops: TmdbBackdrop[] = []): string[] {
  const seen = new Set<string>();
  return backdrops.filter(image => {
    if (!/^\/[a-zA-Z0-9_.-]+\.(jpg|png|webp)$/.test(image.file_path) || image.width < image.height || image.iso_639_1 !== null || seen.has(image.file_path)) return false;
    seen.add(image.file_path);
    return true;
  }).slice(0, 3).map(image => `https://image.tmdb.org/t/p/w780${image.file_path}`);
}
