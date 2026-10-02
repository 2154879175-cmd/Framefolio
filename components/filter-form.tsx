import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

const genreLabels: Record<string, string> = {
  "动作": "Action", "冒险": "Adventure", "动画": "Animation", "喜剧": "Comedy",
  "犯罪": "Crime", "纪录": "Documentary", "剧情": "Drama", "家庭": "Family",
  "奇幻": "Fantasy", "历史": "History", "恐怖": "Horror", "音乐": "Music",
  "悬疑": "Mystery", "爱情": "Romance", "科幻": "Science fiction", "电视电影": "TV movie",
  "惊悚": "Thriller", "战争": "War", "西部": "Western",
};

export function FilterForm({
  genres,
  values,
}: {
  genres: string[];
  values: { query: string; genre: string; rating: string; sort: string };
}) {
  return (
    <form action="/" className="grid gap-3 border-y border-white/15 py-5 sm:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_auto_auto_auto]">
      <label className="relative block">
        <span className="sr-only">Search by title</span>
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <Input name="q" defaultValue={values.query} placeholder="Search Chinese or original titles" className="h-11 border-white/20 bg-transparent pl-10" />
      </label>
      <NativeSelect aria-label="Genre" name="genre" defaultValue={values.genre} className="h-11 w-full min-w-36 border-white/20">
        <NativeSelectOption value="">All genres</NativeSelectOption>
        {genres.map((genre) => <NativeSelectOption value={genre} key={genre}>{genreLabels[genre] ?? genre}</NativeSelectOption>)}
      </NativeSelect>
      <NativeSelect aria-label="Minimum rating" name="rating" defaultValue={values.rating} className="h-11 w-full min-w-36 border-white/20">
        <NativeSelectOption value="">All ratings</NativeSelectOption>
        <NativeSelectOption value="9">9.0 & above</NativeSelectOption>
        <NativeSelectOption value="8">8.0 & above</NativeSelectOption>
        <NativeSelectOption value="7">7.0 & above</NativeSelectOption>
        <NativeSelectOption value="6">6.0 & above</NativeSelectOption>
      </NativeSelect>
      <div className="flex gap-3">
        <NativeSelect aria-label="Sort films" name="sort" defaultValue={values.sort} className="h-11 w-full min-w-36 border-white/20">
          <NativeSelectOption value="watched">Recently watched</NativeSelectOption>
          <NativeSelectOption value="rating">Highest rated</NativeSelectOption>
          <NativeSelectOption value="release">Latest releases</NativeSelectOption>
        </NativeSelect>
        <Button type="submit" className="h-11 px-5">Apply</Button>
      </div>
    </form>
  );
}
