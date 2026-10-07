import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartFind | 校園教室智慧失物招領系統 (資管系專題 Demo)',
  description: '專為大學校園教室打造的拍照即招領系統，結合 AI 視覺多模態辨識與講桌/系辦雙軌保管。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50">{children}</body>
    </html>
  );
}
