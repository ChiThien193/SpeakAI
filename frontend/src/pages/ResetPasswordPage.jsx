import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";
import { resetPassword } from "../services/authService";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Token đặt lại mật khẩu không hợp lệ");
      return;
    }

    if (newPassword.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Xác nhận mật khẩu không khớp");
      return;
    }

    try {
      setLoading(true);
      const result = await resetPassword({
        token,
        new_password: newPassword,
      });

      setSuccess(result.message || "Đặt lại mật khẩu thành công");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(err.message || "Đặt lại mật khẩu thất bại");
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
              Đặt lại mật khẩu
            </h1>
            <p className="mt-2 text-center text-sm text-slate-600">
              Nhập mật khẩu mới cho tài khoản của bạn.
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
                htmlFor="newPassword"
                className="block text-sm font-semibold leading-6 text-slate-900"
              >
                Mật khẩu mới
              </label>
              <div className="relative mt-3">
                <input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold leading-6 text-slate-900"
              >
                Xác nhận mật khẩu mới
              </label>
              <div className="relative mt-3">
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 pr-12 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-blue-800 px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
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