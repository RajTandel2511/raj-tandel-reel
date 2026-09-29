import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Raj Tandel — Reel",
  description:
    "Raj Tandel builds forecasting, optimization, and decision-support systems. Data in, decisions out — never guessed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Anybody is a true variable font (wdth 50-150, wght 100-900); the
            reel animates its width axis, so the full ranges are requested. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=JetBrains+Mono:wght@400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
