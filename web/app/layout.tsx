import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "テラつなぎ（仮称）| お寺の空き枠 × 企画マッチング",
  description:
    "お寺の空いている場所と時間を、企画したい人へ。むずかしい調整は運営が包括サポートします。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-washi text-sumi antialiased">{children}</body>
    </html>
  );
}
