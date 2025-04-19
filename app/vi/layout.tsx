import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chuyển Văn Bản Thành Giọng Nói | TTL Project",
  description: "Công cụ chuyển văn bản thành giọng nói tự nhiên hàng đầu. Dễ dàng tạo giọng nói AI chất lượng cao từ văn bản trong vài giây.",
  keywords: "chuyển văn bản thành giọng nói, text to speech, công cụ chuyển văn bản sang âm thanh, tạo giọng nói AI, văn bản thành giọng nói tiếng Việt",
  openGraph: {
    title: 'Chuyển Văn Bản Thành Giọng Nói | TTL Project',
    description: 'Công cụ chuyển văn bản thành giọng nói tự nhiên hàng đầu. Dễ dàng tạo giọng nói AI chất lượng cao từ văn bản trong vài giây.',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chuyển Văn Bản Thành Giọng Nói | TTL Project',
    description: 'Công cụ chuyển văn bản thành giọng nói tự nhiên hàng đầu. Dễ dàng tạo giọng nói AI chất lượng cao từ văn bản trong vài giây.',
  },
};

export default function VietnameseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 