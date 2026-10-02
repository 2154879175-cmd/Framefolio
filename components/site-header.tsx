export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  return (
    <header className={`border-b border-white/15 ${overlay ? "absolute inset-x-0 top-0 z-10" : ""}`}>
      <div className="mx-auto flex min-h-20 max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <a href="/" className="group flex items-baseline gap-3 focus-visible:outline-2 focus-visible:outline-white">
          <span className="text-2xl font-semibold tracking-tight sm:text-3xl">framefolio<span className="text-violet-300">.</span></span>
        </a>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm text-zinc-300">
          <a className="hidden transition-colors hover:text-white sm:block" href="/">Film archive</a>
          <a className="transition-colors hover:text-white" href="/about">About</a>
          <a className="transition-colors hover:text-white" href="/admin">Admin</a>
        </nav>
      </div>
    </header>
  );
}
