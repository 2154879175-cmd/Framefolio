"use client";

import { useState } from "react";

export function FilmFrame({ src, alt }: { src?: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="film-strip-placeholder"><span aria-hidden="true">✦</span><p>{failed ? <>画面暂不可用<br />Frame unavailable</> : <>等待电影画面<br />Awaiting film frames</>}</p></div>;
  return <img src={src} alt={alt} loading="lazy" width={780} height={439} onError={() => setFailed(true)} />;
}
