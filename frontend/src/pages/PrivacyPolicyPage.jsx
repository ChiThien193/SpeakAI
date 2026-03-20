import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img
          src={logo}
          alt="SpeakAI Logo"
          className="h-14 w-auto object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900">
          SpeakAI
          </span>
        </Link>

          <nav className="flex items-center gap-5">
            
            <Link
              to="/register"
              className="text-sm font-medium text-slate-600 hover:text-blue-800"
            >
              Đăng ký
            </Link>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Cập nhật lần cuối: 19/03/2026
            </p>
            <p className="mt-4 leading-7 text-slate-700">
              SpeakAI (&quot;SpeakAI&quot;, &quot;chúng tôi&quot;) cam kết tôn
              trọng và bảo vệ quyền riêng tư của người dùng khi truy cập và sử
              dụng website, ứng dụng web, và các dịch vụ liên quan của chúng tôi
              (gọi chung là &quot;Dịch vụ&quot;).
            </p>
            <p className="mt-3 leading-7 text-slate-700">
              Chính sách quyền riêng tư này giải thích cách SpeakAI thu thập, sử
              dụng, lưu trữ, chia sẻ và bảo vệ thông tin của bạn khi bạn sử dụng
              hệ thống.
            </p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-slate-900">
                1. Phạm vi áp dụng
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Chính sách này áp dụng cho toàn bộ người dùng sử dụng website
                SpeakAI và các tính năng liên quan đến đăng ký, đăng nhập, hồ sơ
                cá nhân, luyện nói với AI, lịch sử hội thoại, quên mật khẩu và
                đăng nhập bằng Google.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                2. Thông tin chúng tôi thu thập
              </h2>

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                2.1. Thông tin bạn cung cấp trực tiếp
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                <li>Họ tên</li>
                <li>Địa chỉ email</li>
                <li>Mật khẩu đã được mã hóa</li>
                <li>Ảnh đại diện</li>
                <li>Nội dung hội thoại với AI</li>
                <li>Thông tin hỗ trợ bạn gửi cho chúng tôi</li>
              </ul>

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                2.2. Thông tin thu thập tự động
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                <li>Địa chỉ IP</li>
                <li>Loại trình duyệt</li>
                <li>Thiết bị và hệ điều hành</li>
                <li>Thời gian truy cập</li>
                <li>Ngôn ngữ trình duyệt</li>
                <li>Các trang đã truy cập</li>
              </ul>

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                2.3. Dữ liệu luyện nói và nội dung AI
              </h3>
              <p className="mt-3 leading-7 text-slate-700">
                Trong quá trình sử dụng tính năng luyện nói, SpeakAI có thể xử lý
                văn bản bạn nhập, nội dung hội thoại với AI, phản hồi do hệ
                thống AI tạo ra, và dữ liệu liên quan đến phiên luyện nói.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                3. Mục đích sử dụng thông tin
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                <li>Tạo và quản lý tài khoản người dùng</li>
                <li>Xác thực đăng nhập và bảo mật tài khoản</li>
                <li>Cung cấp tính năng luyện nói với AI</li>
                <li>Cá nhân hóa trải nghiệm học tập</li>
                <li>Hỗ trợ đổi mật khẩu và quên mật khẩu</li>
                <li>Gửi email xác thực hoặc email đặt lại mật khẩu</li>
                <li>Cải thiện hiệu suất và chất lượng dịch vụ SpeakAI</li>
                <li>Phát hiện và ngăn chặn hành vi lạm dụng hoặc truy cập trái phép</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                4. Cơ sở xử lý dữ liệu
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI xử lý dữ liệu cá nhân dựa trên sự đồng ý của bạn, sự cần
                thiết để cung cấp dịch vụ, lợi ích hợp pháp của SpeakAI trong
                việc vận hành và bảo mật hệ thống, hoặc nghĩa vụ tuân thủ pháp
                luật.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                5. Chia sẻ thông tin
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI không bán thông tin cá nhân của người dùng.
              </p>
              <p className="mt-3 leading-7 text-slate-700">
                Chúng tôi chỉ có thể chia sẻ thông tin với nhà cung cấp dịch vụ
                hỗ trợ hệ thống, theo yêu cầu pháp lý, hoặc trong trường hợp có
                giao dịch doanh nghiệp như sáp nhập hoặc chuyển nhượng tài sản.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                6. Lưu trữ và bảo mật dữ liệu
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức hợp lý để
                bảo vệ dữ liệu cá nhân khỏi truy cập trái phép, mất mát, sửa
                đổi hoặc tiết lộ ngoài ý muốn.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                <li>Mã hóa mật khẩu</li>
                <li>Giới hạn quyền truy cập dữ liệu</li>
                <li>Xác thực tài khoản</li>
                <li>Cơ chế đặt lại mật khẩu bằng token có thời hạn</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                7. Thời gian lưu trữ dữ liệu
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Chúng tôi lưu trữ dữ liệu trong thời gian cần thiết để duy trì
                tài khoản của bạn, cung cấp dịch vụ, tuân thủ nghĩa vụ pháp lý,
                hoặc giải quyết tranh chấp khi cần thiết.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                8. Quyền của người dùng
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                <li>Truy cập thông tin cá nhân của mình</li>
                <li>Yêu cầu chỉnh sửa thông tin không chính xác</li>
                <li>Yêu cầu xóa tài khoản hoặc dữ liệu cá nhân</li>
                <li>Đổi mật khẩu hoặc yêu cầu quên mật khẩu</li>
                <li>Rút lại sự đồng ý trong phạm vi pháp luật cho phép</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                9. Cookies và công nghệ tương tự
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI có thể sử dụng cookies hoặc công nghệ tương tự để duy trì
                phiên đăng nhập, ghi nhớ tùy chọn người dùng, cải thiện hiệu năng
                hệ thống và phân tích cách người dùng sử dụng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                10. Dịch vụ bên thứ ba
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI có thể tích hợp hoặc cho phép đăng nhập bằng dịch vụ bên
                thứ ba như Google. Khi bạn sử dụng tính năng này, SpeakAI có thể
                nhận một số thông tin như tên, email và ảnh đại diện theo quyền
                bạn cấp.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                11. Quyền riêng tư của trẻ em
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI không hướng tới trẻ em dưới độ tuổi tối thiểu theo quy
                định pháp luật áp dụng. Nếu phát hiện dữ liệu được cung cấp bởi
                người dùng chưa đủ điều kiện, chúng tôi có thể xóa hoặc vô hiệu
                hóa tài khoản tương ứng.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                12. Chuyển dữ liệu quốc tế
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Nếu SpeakAI sử dụng máy chủ hoặc nhà cung cấp dịch vụ đặt tại quốc
                gia khác, dữ liệu của bạn có thể được chuyển và lưu trữ ngoài
                quốc gia bạn cư trú. Trong trường hợp đó, chúng tôi sẽ áp dụng
                các biện pháp hợp lý để bảo vệ dữ liệu.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                13. Thay đổi Chính sách quyền riêng tư
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                SpeakAI có thể cập nhật Chính sách này theo thời gian để phản ánh
                thay đổi pháp lý, thay đổi kỹ thuật hoặc thay đổi trong mô hình
                vận hành và tính năng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-slate-900">
                14. Liên hệ
              </h2>
              <p className="mt-3 leading-7 text-slate-700">
                Nếu bạn có câu hỏi, yêu cầu hoặc khiếu nại liên quan đến Chính
                sách quyền riêng tư này, vui lòng liên hệ:
              </p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900">SpeakAI Support</p>
                <p className="mt-1 text-slate-700">Email: support@speakai.com</p>
                <p className="mt-1 text-slate-700">
                  Hoặc qua biểu mẫu liên hệ trên website SpeakAI
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}