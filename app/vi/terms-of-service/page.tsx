import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TermsOfService from '../../components/terms-of-service';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Điều khoản dịch vụ | TTL Project",
  description: "Điều khoản dịch vụ và điều kiện sử dụng của TTL Project. Tìm hiểu về quy tắc dịch vụ, trách nhiệm người dùng, chính sách nội dung và biện pháp bảo vệ quyền riêng tư của chúng tôi.",
  keywords: "điều khoản dịch vụ, điều kiện sử dụng, thỏa thuận người dùng, điều khoản pháp lý, TTL Project",
  openGraph: {
    title: 'Điều khoản dịch vụ | TTL Project',
    description: 'Điều khoản dịch vụ và điều kiện sử dụng của TTL Project. Tìm hiểu về quy tắc dịch vụ, trách nhiệm người dùng, chính sách nội dung và biện pháp bảo vệ quyền riêng tư của chúng tôi.',
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Điều khoản dịch vụ | TTL Project',
    description: 'Điều khoản dịch vụ và điều kiện sử dụng của TTL Project. Tìm hiểu về quy tắc dịch vụ, trách nhiệm người dùng, chính sách nội dung và biện pháp bảo vệ quyền riêng tư của chúng tôi.',
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <NavBar />
      <main>
        <TermsOfService />
      </main>
      <Footer />
    </>
  );
} 