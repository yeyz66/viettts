import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Chính Sách Bảo Mật | Nền Tảng TTL Chuyển Văn Bản Thành Giọng Nói',
  description: 'Tìm hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn. Chúng tôi cam kết bảo vệ quyền riêng tư và an toàn dữ liệu của bạn.',
  keywords: 'chính sách bảo mật, bảo vệ dữ liệu, thông tin cá nhân, chuyển văn bản thành giọng nói',
  alternates: {
    canonical: '/vi/privacy-policy',
  },
  openGraph: {
    title: 'Chính Sách Bảo Mật | Nền Tảng TTL Chuyển Văn Bản Thành Giọng Nói',
    description: 'Tìm hiểu cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn. Chúng tôi cam kết bảo vệ quyền riêng tư và an toàn dữ liệu của bạn.',
    url: '/vi/privacy-policy',
    type: 'website',
  }
};

export default function ViPrivacyPolicyPage() {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Chính Sách Bảo Mật</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-sm text-gray-500 mb-6 text-center">Cập nhật lần cuối: {new Date().toISOString().split('T')[0]}</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Giới Thiệu</h2>
            <p>Chào mừng bạn đến với Nền Tảng TTL Chuyển Văn Bản Thành Giọng Nói (sau đây gọi là &ldquo;chúng tôi&rdquo;, &ldquo;của chúng tôi&rdquo; hoặc &ldquo;Nền Tảng&rdquo;). Chúng tôi rất coi trọng quyền riêng tư và việc bảo vệ thông tin cá nhân của bạn. Chính sách Bảo mật này nhằm giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin cá nhân của bạn, cũng như các quyền bạn có đối với thông tin này.</p>
            <p>Bằng việc sử dụng dịch vụ của chúng tôi, bạn đồng ý với các hoạt động xử lý dữ liệu được mô tả trong Chính sách Bảo mật này. Nếu bạn không đồng ý với bất kỳ phần nào của Chính sách Bảo mật này, vui lòng ngừng sử dụng dịch vụ của chúng tôi.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
            <p>Chúng tôi có thể thu thập các loại thông tin sau:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Thông Tin Tài Khoản</strong>: Khi bạn đăng ký tài khoản, chúng tôi thu thập địa chỉ email, mật khẩu (được lưu trữ dưới dạng mã hóa), tên người dùng và các thông tin hồ sơ tùy chọn khác.</li>
              <li><strong>Dữ Liệu Sử Dụng</strong>: Chúng tôi thu thập dữ liệu về cách bạn sử dụng dịch vụ của chúng tôi, bao gồm nội dung văn bản bạn chuyển đổi, loại giọng nói đã chọn, tệp âm thanh được tạo và thống kê tần suất sử dụng.</li>
              <li><strong>Thông Tin Thiết Bị</strong>: Chúng tôi có thể thu thập thông tin kỹ thuật như địa chỉ IP, loại thiết bị, hệ điều hành, loại trình duyệt, cài đặt ngôn ngữ, v.v.</li>
              <li><strong>Thông Tin Thanh Toán</strong>: Nếu bạn mua dịch vụ của chúng tôi, chúng tôi thu thập thông tin thanh toán cần thiết, nhưng chi tiết thẻ thanh toán đầy đủ được xử lý an toàn bởi đối tác xử lý thanh toán của chúng tôi.</li>
              <li><strong>Dữ Liệu Liên Lạc</strong>: Khi bạn liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi, chúng tôi lưu giữ bản ghi của các liên lạc này.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin Của Bạn</h2>
            <p>Chúng tôi sử dụng thông tin đã thu thập để:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Cung cấp, duy trì và cải thiện dịch vụ chuyển văn bản thành giọng nói của chúng tôi</li>
              <li>Tạo và quản lý tài khoản của bạn</li>
              <li>Xử lý các đăng ký và thanh toán của bạn</li>
              <li>Gửi thông báo dịch vụ và cập nhật</li>
              <li>Phản hồi các thắc mắc và yêu cầu của bạn</li>
              <li>Giám sát việc sử dụng dịch vụ để ngăn chặn lạm dụng</li>
              <li>Phân tích mô hình sử dụng để cải thiện trải nghiệm người dùng</li>
              <li>Tuân thủ các nghĩa vụ pháp lý</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Chia Sẻ Thông Tin</h2>
            <p>Chúng tôi không bán thông tin cá nhân của bạn. Chúng tôi chỉ chia sẻ thông tin của bạn trong các trường hợp sau:</p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Nhà Cung Cấp Dịch Vụ</strong>: Chúng tôi sử dụng các nhà cung cấp dịch vụ bên thứ ba để giúp chúng tôi cung cấp dịch vụ, như lưu trữ đám mây, xử lý thanh toán và dịch vụ phân tích. Các nhà cung cấp này chỉ có thể truy cập thông tin cần thiết để thực hiện dịch vụ và phải bảo vệ thông tin của bạn.</li>
              <li><strong>Yêu Cầu Pháp Lý</strong>: Chúng tôi có thể tiết lộ thông tin của bạn nếu pháp luật yêu cầu hoặc nếu cơ quan chính phủ đưa ra yêu cầu hợp pháp.</li>
              <li><strong>Chuyển Nhượng Kinh Doanh</strong>: Nếu chúng tôi tham gia vào việc sáp nhập, mua lại hoặc bán tài sản, thông tin của bạn có thể được chuyển giao như một phần của tài sản được chuyển nhượng.</li>
              <li><strong>Với Sự Đồng Ý Của Bạn</strong>: Chúng tôi có thể chia sẻ thông tin của bạn theo cách khác nếu bạn đồng ý.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Bảo Mật Dữ Liệu</h2>
            <p>Chúng tôi thực hiện các biện pháp bảo mật hợp lý để bảo vệ thông tin cá nhân của bạn khỏi truy cập, tiết lộ, sửa đổi hoặc phá hủy trái phép. Các biện pháp này bao gồm mã hóa dữ liệu, máy chủ an toàn và đánh giá bảo mật thường xuyên.</p>
            <p>Tuy nhiên, xin lưu ý rằng mặc dù chúng tôi nỗ lực bảo vệ thông tin của bạn, không có phương thức truyền tải qua Internet hoặc lưu trữ điện tử nào là an toàn 100%.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Quyền Của Bạn</h2>
            <p>Tùy thuộc vào luật bảo mật trong khu vực của bạn, bạn có thể có các quyền sau:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Truy cập thông tin cá nhân chúng tôi nắm giữ về bạn</li>
              <li>Sửa thông tin cá nhân không chính xác hoặc không đầy đủ</li>
              <li>Yêu cầu xóa thông tin cá nhân của bạn</li>
              <li>Hạn chế hoặc phản đối việc chúng tôi xử lý thông tin cá nhân của bạn</li>
              <li>Tính di động dữ liệu (nhận dữ liệu của bạn theo định dạng có cấu trúc, thường được sử dụng và có thể đọc được bằng máy)</li>
              <li>Rút lại sự đồng ý mà bạn đã cung cấp trước đó</li>
            </ul>
            <p>Để thực hiện các quyền này, vui lòng liên hệ với chúng tôi sử dụng thông tin liên hệ được cung cấp bên dưới.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Cookie và Công Nghệ Tương Tự</h2>
            <p>Chúng tôi sử dụng cookie và các công nghệ tương tự để thu thập và lưu trữ thông tin về thiết bị và hoạt động duyệt web của bạn. Các công nghệ này giúp chúng tôi nhận dạng bạn, lưu trữ tùy chọn của bạn, cung cấp trải nghiệm cá nhân hóa, phân tích lưu lượng trang web và cải thiện dịch vụ của chúng tôi.</p>
            <p>Bạn có thể kiểm soát việc sử dụng cookie thông qua cài đặt trình duyệt của mình. Tuy nhiên, việc vô hiệu hóa cookie có thể ảnh hưởng đến trải nghiệm của bạn đối với dịch vụ của chúng tôi.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Quyền Riêng Tư Của Trẻ Em</h2>
            <p>Dịch vụ của chúng tôi không hướng đến trẻ em dưới 13 tuổi. Chúng tôi không cố ý thu thập thông tin cá nhân từ trẻ em dưới 13 tuổi. Nếu bạn phát hiện rằng chúng tôi có thể đã thu thập thông tin cá nhân từ một đứa trẻ dưới 13 tuổi, vui lòng liên hệ với chúng tôi ngay lập tức, và chúng tôi sẽ thực hiện các bước để xóa thông tin này.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Chuyển Dữ Liệu Quốc Tế</h2>
            <p>Thông tin cá nhân của bạn có thể được chuyển đến và lưu trữ trên máy chủ đặt tại bên ngoài quốc gia/khu vực của bạn. Chúng tôi sẽ đảm bảo rằng các chuyển giao như vậy tuân thủ luật bảo vệ dữ liệu hiện hành và thông tin của bạn được bảo vệ đầy đủ.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Thay Đổi Đối Với Chính Sách Này</h2>
            <p>Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Khi chúng tôi thực hiện những thay đổi đáng kể, chúng tôi sẽ đăng thông báo trên trang web của chúng tôi và cập nhật ngày &ldquo;Cập nhật lần cuối&rdquo; ở đầu trang này.</p>
            <p>Chúng tôi khuyến khích bạn xem xét Chính sách Bảo mật này định kỳ để cập nhật thông tin về cách chúng tôi đang bảo vệ thông tin của bạn.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Liên Hệ Với Chúng Tôi</h2>
            <p>Nếu bạn có bất kỳ câu hỏi, nhận xét hoặc yêu cầu nào liên quan đến Chính sách Bảo mật này, vui lòng liên hệ với chúng tôi qua:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Email: uul0504@gmail.com</li>
            </ul>
          </section>
          
          <div className="text-sm text-gray-500 mt-12 border-t pt-6">
            <p>Lưu ý: Phiên bản tiếng Việt của Chính sách Bảo mật này chỉ mang tính tham khảo, trong trường hợp có bất kỳ tranh chấp nào, phiên bản tiếng Anh sẽ được ưu tiên.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 