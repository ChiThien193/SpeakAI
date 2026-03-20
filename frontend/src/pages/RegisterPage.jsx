import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/register.css";
import { registerUser, googleAuthCode } from "../services/authService";

export default function RegisterPage() {
  const navigate = useNavigate();
  const codeClientRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!window.google || !GOOGLE_CLIENT_ID) return;

    codeClientRef.current = window.google.accounts.oauth2.initCodeClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: "openid email profile",
      ux_mode: "popup",
      callback: async (response) => {
        try {
          if (response.error) {
            setError(response.error);
            return;
          }

          const result = await googleAuthCode(response.code);
          localStorage.setItem("token", result.access_token);
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate("/dashboard");
        } catch (err) {
          setError(err.message || "Đăng ký bằng Google thất bại");
        }
      },
    });
  }, [GOOGLE_CLIENT_ID, navigate]);

  const handleGoogleSignup = () => {
    setError("");
    if (!codeClientRef.current) {
      setError("Google chưa sẵn sàng, vui lòng thử lại");
      return;
    }
    codeClientRef.current.requestCode();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.full_name.trim()) {
      setError("Vui lòng nhập họ tên");
      return;
    }

    if (!form.email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (form.password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự");
      return;
    }

    try {
      setLoading(true);
      const result = await registerUser(form);

      localStorage.setItem("token", result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setSuccess("Tạo tài khoản thành công");

      setTimeout(() => {
        navigate("/practice");
      }, 800);
    } catch (err) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Left Side */}
        <div className="register-branding relative hidden overflow-hidden bg-blue-50 p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link to="/" className="mb-12 flex items-center gap-3">
              <img
                src={logo}
                alt="SpeakAI Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                SpeakAI
              </span>
            </Link>

            <div className="max-w-md">
              <h1 className="mb-6 text-5xl font-extrabold leading-tight text-slate-900">
                Master any language with{" "}
                <span className="text-blue-800">AI-powered</span> conversations.
              </h1>

              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white">
                    <span className="material-symbols-outlined">analytics</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Track your progress
                    </h3>
                    <p className="text-slate-600">
                      Visualize your fluency growth and vocabulary expansion over time.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white">
                    <span className="material-symbols-outlined">history</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Conversation history
                    </h3>
                    <p className="text-slate-600">
                      Save every interaction to review mistakes and practice key phrases later.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white">
                    <span className="material-symbols-outlined">forum</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      Realistic scenarios
                    </h3>
                    <p className="text-slate-600">
                      Practice ordering food, business meetings, or casual travel talk.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="register-blob register-blob-lg"></div>
          <div className="register-blob register-blob-sm"></div>
        </div>

        {/* Right Side */}
        <div className="flex flex-1 flex-col justify-center bg-white px-6 py-12 lg:px-24">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
              <img
                src={logo}
                alt="SpeakAI Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold text-slate-900">SpeakAI</span>
            </div>

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-black tracking-tight text-slate-900">
                Create your account
              </h2>
              <p className="mt-2 text-slate-600">
                Start your language learning journey today.
              </p>
            </div>

            <div className="mt-10">
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

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="full_name"
                    className="block text-sm font-semibold leading-6 text-slate-900"
                  >
                    Full name
                  </label>
                  <div className="mt-3">
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

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
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="block w-full rounded-xl border-0 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-800 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold leading-6 text-slate-900"
                  >
                    Password
                  </label>
                  <div className="relative mt-3">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
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
                  <p className="mt-2 text-xs text-slate-500">
                    Must be at least 8 characters long.
                  </p>
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-xl bg-blue-800 px-3 py-3 text-sm font-bold leading-6 text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Creating..." : "Create account"}
                  </button>
                </div>
              </form>

              <div className="mt-8">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-slate-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-white px-4 text-slate-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="flex w-full max-w-[320px] items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Google</span>
                  </button>
                </div>
              </div>

              <p className="mt-10 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold leading-6 text-blue-800 hover:underline"
                >
                  Log in
                </Link>
              </p>
            </div>
          </div>

          <footer className="mt-auto pt-8 text-center text-xs text-slate-400">
            <p>
              © 2024 SpeakAI Inc. All rights reserved.{" "}
              <br className="sm:hidden" />
              <Link to="/privacy-policy" className="mx-2 hover:text-blue-800">
              Privacy Policy
              </Link>
              •
              <Link
              to="/terms-of-service"
              className="mx-2 hover:text-blue-800"
            >
              Terms of Service
            </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}