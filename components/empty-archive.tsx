import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyArchive({ filtered }: { filtered: boolean }) {
  if (filtered) {
    return (
      <div className="border-b border-white/15 py-24 text-center">
        <p className="text-lg">No films match your search.</p>
        <a href="/" className="mt-4 inline-block text-sm text-zinc-400 underline underline-offset-4 hover:text-white">Clear filters</a>
      </div>
    );
  }

  return (
    <section className="relative mt-8 min-h-[520px] overflow-hidden border border-white/15 text-white">
      <img src="/empty-cinema.png" alt="An empty cinema" className="absolute inset-0 h-full w-full object-cover opacity-55" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 max-w-xl p-6 sm:p-10">
        <p className="text-xs uppercase tracking-[0.24em] text-zinc-400">Archive No. 000</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight sm:text-5xl">Your first film starts here.</h2>
        <p className="mt-4 max-w-md text-base leading-7 text-zinc-300">Find a film in the admin panel, add your rating and review, and publish it to your collection.</p>
        <a href="/admin" className={`${buttonVariants()} mt-7 h-11 px-5`}>
          Add a film<ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
