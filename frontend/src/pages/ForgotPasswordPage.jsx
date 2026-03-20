import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";
import { forgotPassword } from "../services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    try {
      setLoading(true);
      const result = await forgotPassword(email);
      setSuccess(result.message || "Link đặt lại mật khẩu đã được gửi");
      setEmail("");
    } catch (err) {
      setError(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center">
            <img
              src={logo}
              alt="SpeakAI Logo"
              className="mb-4 h-14 w-auto object-contain"
            />
            <h1 className="text-center text-3xl font-black tracking-tight text-slate-900">
              Quên mật khẩu
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600">
              Nhập email của bạn để nhận link đặt lại mật khẩu.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-slate-900"
              >
                Email address
              </label>
              <div className="mt-3">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-blue-800 px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            <Link to="/login" className="font-bold text-blue-800 hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}