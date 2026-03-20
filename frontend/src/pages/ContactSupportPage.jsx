import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
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
              to="/login"
              className="text-sm font-medium text-slate-600 hover:text-blue-800"
            >
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              Contact Support
            </h1>
            <p className="mt-3 text-slate-600">
              Nếu bạn cần hỗ trợ, vui lòng liên hệ với đội ngũ SpeakAI qua thông
              tin bên dưới.
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">Email hỗ trợ</h2>
              <p className="mt-2 text-slate-700">support@speakai-help.com</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Số điện thoại
              </h2>
              <p className="mt-2 text-slate-700">+84 912 345 678</p>
            </div>

            <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
              <h2 className="text-lg font-bold text-blue-900">
                Thời gian phản hồi
              </h2>
              <p className="mt-2 text-blue-800">
                Chúng tôi sẽ cố gắng phản hồi trong vòng 24–48 giờ làm việc.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl bg-blue-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}