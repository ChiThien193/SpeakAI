import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/profile.css";
import { changePassword } from "../services/authService";

const DEFAULT_AVATAR =
  "https://ui-avatars.com/api/?name=SpeakAI&background=1e40af&color=fff";

export default function ProfilePage() {
  const navigate = useNavigate();
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
  const [openProfile, setOpenProfile] = useState(true);
  const [openPassword, setOpenPassword] = useState(false);

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
      setError("");
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(err.message || "Đổi mật khẩu thất bại");
      setMessage("");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const sideMenu = [
    { label: "Home", icon: "dashboard", to: "/dashboard" },
    { label: "Learn", icon: "menu_book", to: "/dashboard" },
    { label: "Courses", icon: "school", to: "/dashboard" },
    { label: "Explore", icon: "explore", to: "/dashboard" },
    { label: "Progress", icon: "trending_up", to: "/dashboard" },
  ];

  return (
    <div className="profile-page min-h-screen bg-[#f3f4fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[300px] shrink-0 border-r border-slate-200 bg-white px-6 py-8 lg:flex lg:flex-col">
          <Link to="/" className="mb-14 flex items-center gap-3">
            <img
              src={logo}
              alt="SpeakAI Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="space-y-4">
            {sideMenu.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-4 rounded-2xl px-4 py-4 text-[18px] font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-4">
            <button
              type="button"
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-[18px] font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <span className="material-symbols-outlined text-pink-500">
                redeem
              </span>
              <span>A gift for you</span>
            </button>

            <div className="flex items-center gap-4 rounded-2xl bg-indigo-50 px-4 py-4 text-[18px] font-semibold text-slate-900">
              <span className="material-symbols-outlined">person</span>
              <span>Account</span>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 px-6 py-8 lg:px-12">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-8 text-[42px] font-bold tracking-tight text-slate-900">
              Account
            </h1>

            <div className="mb-10 h-px bg-slate-200"></div>

            {/* Target language */}
            <section className="mb-10">
              <h2 className="mb-6 text-[22px] font-bold text-slate-900">
                Target language
              </h2>

              <div className="flex items-center justify-between rounded-[26px] border border-slate-200 bg-white px-6 py-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-2xl">
                    🇬🇧
                  </div>
                  <span className="text-[20px] font-semibold text-slate-900">
                    English
                  </span>
                </div>

                <span className="material-symbols-outlined text-slate-700">
                  chevron_right
                </span>
              </div>
            </section>

            {/* Account settings */}
            <section>
              <h2 className="mb-6 text-[22px] font-bold text-slate-900">
                Account settings
              </h2>

              {/* Profile */}
              <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenProfile((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[32px] text-slate-900">
                      person
                    </span>
                    <div>
                      <h3 className="text-[20px] font-bold text-slate-900">
                        Profile
                      </h3>
                      <p className="mt-1 text-[16px] text-slate-500">
                        Manage your profile details.
                      </p>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-slate-700">
                    {openProfile ? "expand_less" : "chevron_right"}
                  </span>
                </button>

                {openProfile && (
                  <div className="mt-6 border-t border-slate-200 pt-6">
                    {message && (
                      <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {message}
                      </div>
                    )}

                    {error && (
                      <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <div className="mb-6 flex flex-col items-center gap-4 md:flex-row">
                      <img
                        src={avatarPreview || DEFAULT_AVATAR}
                        alt={user.full_name}
                        className="h-24 w-24 rounded-full object-cover ring-4 ring-blue-800/10"
                      />

                      <div className="flex-1">
                        <p className="text-lg font-bold text-slate-900">
                          {user.full_name}
                        </p>
                        <p className="text-slate-500">{user.email}</p>
                        <p className="mt-1 text-sm font-medium text-blue-700">
                          Tài khoản: {user.provider === "google" ? "Google" : "Local"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-blue-800 transition hover:bg-slate-50"
                      >
                        Đổi avatar
                      </button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user.email}
                          readOnly
                          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Personalization / password */}
              <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenPassword((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[32px] text-slate-900">
                      tune
                    </span>
                    <div>
                      <h3 className="text-[20px] font-bold text-slate-900">
                        Personalization
                      </h3>
                      <p className="mt-1 text-[16px] text-slate-500">
                        Adapt the app for your needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-pink-500 text-white">
                    <span className="material-symbols-outlined">lock</span>
                  </div>
                </button>

                {openPassword && (
                  <div className="mt-6 border-t border-slate-200 pt-6">
                    {user.provider === "google" ? (
                      <div className="space-y-4">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
                          Tài khoản của bạn đang đăng nhập bằng Google. Bạn có
                          thể dùng chức năng quên mật khẩu nếu đã liên kết tài
                          khoản local, hoặc quản lý mật khẩu từ tài khoản Google.
                        </div>

                        <Link
                          to="/forgot-password"
                          className="inline-flex w-full items-center justify-center rounded-xl bg-blue-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                        >
                          Quên mật khẩu
                        </Link>
                      </div>
                    ) : (
                      <form
                        className="space-y-4"
                        onSubmit={handleSubmitChangePassword}
                      >
                        <div>
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                          <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  </div>
                )}
              </div>

              {/* Support */}
              <div className="mb-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <Link
                  to="/contact-support"
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[32px] text-slate-900">
                      mail
                    </span>
                    <div>
                      <h3 className="text-[20px] font-bold text-slate-900">
                        Support
                      </h3>
                      <p className="mt-1 text-[16px] text-slate-500">
                        Help center and contact.
                      </p>
                    </div>
                  </div>

                  <span className="material-symbols-outlined text-slate-700">
                    chevron_right
                  </span>
                </Link>
              </div>

              {/* Log out */}
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 text-left"
                >
                  <span className="material-symbols-outlined text-[32px] text-pink-500">
                    logout
                  </span>
                  <div>
                    <h3 className="text-[20px] font-bold text-pink-500">
                      Log out
                    </h3>
                    <p className="mt-1 text-[16px] text-slate-500">
                      Log out from this profile.
                    </p>
                  </div>
                </button>
              </div>
            </section>

            {/* Footer links */}
            <div className="mt-12 pb-8 text-center text-[15px] leading-8 text-slate-600">
              <div>
                <Link to="/privacy-policy" className="hover:underline">
                  Privacy Policy
                </Link>
              </div>
              <div>
                <Link to="/terms-of-service" className="hover:underline">
                  Terms and Conditions
                </Link>
              </div>
              <div>
                <Link to="/cookie-policy" className="hover:underline">
                  Cookie Preferences
                </Link>
              </div>
              <div>
                <Link to="/contact-support" className="hover:underline">
                  Customer support: support@speakai.com
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}