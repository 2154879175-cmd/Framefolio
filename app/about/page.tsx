import type { Metadata } from "next";

import { ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = { title: "关于" };

const TMDB_LOGO = "https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg";

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-14 sm:px-8 lg:pt-20">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">About</p>
        <h1 className="mt-4 text-4xl font-medium tracking-tight sm:text-6xl">关于银幕手记</h1>
        <div className="mt-10 space-y-6 text-[17px] leading-8 text-zinc-300">
          <p>这里保存我看过的电影，以及当时留下的评分、短评与长评。它更像一册持续生长的私人观影档案，而不是一份电影排行榜。</p>
          <p>网站中的评分只代表个人感受。时间过去以后，感受也可能变化，但这些文字会尽量保留观看当时的样子。</p>
        </div>

        <section className="mt-16 border-t border-white/15 pt-8">
          <h2 className="text-sm font-medium">电影资料来源</h2>
          <div className="mt-5 flex items-start gap-5">
            <img src={TMDB_LOGO} alt="TMDB" className="h-12 w-12 shrink-0" />
            <div className="text-sm leading-7 text-zinc-500">
              <p>电影基本信息和海报来自 TMDB。</p>
              <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
              <a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-zinc-300 hover:text-white">
                访问 The Movie Database<ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </div>
          </div>
        </section>

        <a href="/" className="mt-16 inline-block text-sm text-zinc-400 underline underline-offset-4 hover:text-white">返回电影墙</a>
      </main>
    </>
  );
}
