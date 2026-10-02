import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export function FilterForm({
  genres,
  values,
}: {
  genres: string[];
  values: { query: string; genre: string; rating: string; sort: string };
}) {
  return (
    <form action="/" className="grid gap-3 border-y border-white/15 py-5 md:grid-cols-[minmax(240px,1fr)_auto_auto_auto]">
      <label className="relative block">
        <span className="sr-only">搜索片名</span>
        <Search aria-hidden="true" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
        <Input name="q" defaultValue={values.query} placeholder="搜索中文或原始片名" className="h-11 border-white/20 bg-transparent pl-10" />
      </label>
      <NativeSelect name="genre" defaultValue={values.genre} className="h-11 w-full min-w-36 border-white/20">
        <NativeSelectOption value="">全部类型</NativeSelectOption>
        {genres.map((genre) => <NativeSelectOption value={genre} key={genre}>{genre}</NativeSelectOption>)}
      </NativeSelect>
      <NativeSelect name="rating" defaultValue={values.rating} className="h-11 w-full min-w-36 border-white/20">
        <NativeSelectOption value="">全部评分</NativeSelectOption>
        <NativeSelectOption value="9">9 分及以上</NativeSelectOption>
        <NativeSelectOption value="8">8 分及以上</NativeSelectOption>
        <NativeSelectOption value="7">7 分及以上</NativeSelectOption>
        <NativeSelectOption value="6">6 分及以上</NativeSelectOption>
      </NativeSelect>
      <div className="flex gap-3">
        <NativeSelect name="sort" defaultValue={values.sort} className="h-11 w-full min-w-36 border-white/20">
          <NativeSelectOption value="watched">最近观看</NativeSelectOption>
          <NativeSelectOption value="rating">评分最高</NativeSelectOption>
          <NativeSelectOption value="release">最新上映</NativeSelectOption>
        </NativeSelect>
        <Button type="submit" className="h-11 px-5">筛选</Button>
      </div>
    </form>
  );
}
