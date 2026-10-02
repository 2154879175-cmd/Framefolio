import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Framefolio · 银幕手记",
    template: "%s · Framefolio",
  },
  description: "一份私人而公开的观影档案，收录看过的电影与写下的感受。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="film-grain antialiased">
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
