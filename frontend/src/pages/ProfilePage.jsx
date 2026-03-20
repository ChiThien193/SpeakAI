import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/profile.css";
import { changePassword } from "../services/authService";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBh0WMhiYhiZfIffkmYzYWSqc1t_MSL5nFkCVog9Ox3srZvV6dqu3Rl6UBTM9loU6oFuVsJfyAgm363qlVnSafLmwSeN5rvsgCNE-ZRlDjl2RM3cbNCBcSh0wAMOQYj4M4O0wDHiRbCp1e03x6qPaocgsstOHWHdvu37tvAF7O1CTUnltJm3iF9xApGcwcyHkL1Gn5cm2w_weKAA-RDMwyUnRVt1ujsd4eQbgI7XeAykSWs1AFdO_0aI1zFDyQaPMxpnO7mFA7M9vc";

export default function ProfilePage() {
  const fileInputRef = useRef(null);

  const [user, setUser] = useState({
    full_name: "",
    email: "",
    avatar: "",
    provider: "",
  });

  const [avatarPreview, setAvatarPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const normalizedUser = {
      full_name: storedUser?.full_name || "Người dùng",
      email: storedUser?.email || "user@speakai.com",
      avatar: storedUser?.avatar || "",
      provider: storedUser?.provider || "local",
    };

    setUser(normalizedUser);
    setAvatarPreview(normalizedUser.avatar || DEFAULT_AVATAR);
  }, []);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Vui lòng chọn file ảnh hợp lệ");
      setMessage("");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const newAvatar = reader.result;

      const updatedUser = {
        ...user,
        avatar: newAvatar,
      };

      setUser(updatedUser);
      setAvatarPreview(newAvatar);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setMessage("Đổi ảnh đại diện thành công");
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!passwordForm.old_password.trim()) {
      setError("Vui lòng nhập mật khẩu cũ");
      return;
    }

    if (passwordForm.new_password.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự");
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setError("Xác nhận mật khẩu mới không khớp");
      return;
    }

    try {
      setLoadingPassword(true);

      const result = await changePassword({
        email: user.email,
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });

      setMessage(result.message || "Đổi mật khẩu thành công");
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="profile-page min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SpeakAI Logo" className="h-8 w-auto object-contain" />
            <span className="text-xl font-bold tracking-tight text-slate-900">
              SpeakAI
            </span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            <Link to="/" className="text-sm font-medium text-slate-600 transition hover:text-blue-800">
              Trang chủ
            </Link>
            <Link to="/practice" className="text-sm font-medium text-slate-600 transition hover:text-blue-800">
              Luyện nói
            </Link>
            <Link to="/login" className="text-sm font-medium text-slate-600 transition hover:text-blue-800">
              Đăng nhập
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Hero profile */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col items-center gap-6 md:flex-row">
            <div className="relative">
              <div className="h-32 w-32 overflow-hidden rounded-full ring-4 ring-blue-800/10">
                <img
                  src={avatarPreview || DEFAULT_AVATAR}
                  alt={user.full_name}
                  className="h-full w-full object-cover"
                />
              </div>

              <button
                type="button"
                onClick={handleAvatarClick}
                className="absolute bottom-1 right-1 rounded-full border-2 border-white bg-blue-800 p-2 text-white shadow-lg transition hover:bg-blue-700"
              >
                <span className="material-symbols-outlined text-sm">
                  photo_camera
                </span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-slate-900">
                {user.full_name}
              </h1>
              <p className="mt-1 text-slate-500">{user.email}</p>

              <div className="mt-3 flex flex-wrap justify-center gap-3 md:justify-start">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-800">
                  Tài khoản: {user.provider === "google" ? "Google" : "Local"}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Thông tin cá nhân */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined">person</span>
              Thông tin cá nhân
            </h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={user.full_name}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Ảnh đại diện
                </label>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-slate-50"
                >
                  Chọn ảnh đại diện mới
                </button>
              </div>
            </div>
          </section>

          {/* Đổi mật khẩu */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="material-symbols-outlined">lock</span>
              Đổi mật khẩu
            </h2>

            {error && (
              <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {user.provider === "google" ? (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                  Tài khoản của bạn đang đăng nhập bằng Google. Bạn có thể dùng
                  chức năng quên mật khẩu nếu đã liên kết tài khoản local, hoặc
                  quản lý mật khẩu từ tài khoản Google.
                </div>

                <Link
                  to="/forgot-password"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Quên mật khẩu
                </Link>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmitChangePassword}>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Mật khẩu cũ
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="old_password"
                    value={passwordForm.old_password}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu cũ"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Mật khẩu mới
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new_password"
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm_password"
                    value={passwordForm.confirm_password}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-sm font-semibold text-blue-800 hover:underline"
                >
                  {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                </button>

                <button
                  type="submit"
                  disabled={loadingPassword}
                  className="w-full rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loadingPassword ? "Đang cập nhật..." : "Đổi mật khẩu"}
                </button>

                <Link
                  to="/forgot-password"
                  className="block text-center text-sm font-semibold text-blue-800 hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}