import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "文字转语音 | TTL Project",
  description: "先进的文字转语音工具。几秒钟内轻松将文字转换成高质量AI语音。",
  keywords: "文字转语音, text to speech, 语音合成, AI语音生成, 文字朗读器",
  openGraph: {
    title: '文字转语音 | TTL Project',
    description: '先进的文字转语音工具。几秒钟内轻松将文字转换成高质量AI语音。',
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '文字转语音 | TTL Project',
    description: '先进的文字转语音工具。几秒钟内轻松将文字转换成高质量AI语音。',
  },
};

export default function ChineseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 