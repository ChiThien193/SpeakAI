import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/login.css";
import { loginUser, googleAuthCode } from "../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  const codeClientRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
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
          navigate("/practice");
        } catch (err) {
          setError(err.message || "Đăng nhập Google thất bại");
        }
      },
    });
  }, [GOOGLE_CLIENT_ID, navigate]);

  const handleGoogleLogin = () => {
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

    if (!form.email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!form.password.trim()) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);
      const result = await loginUser(form);
      localStorage.setItem("token", result.access_token);
      localStorage.setItem("user", JSON.stringify(result.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="login-branding relative hidden overflow-hidden bg-blue-50 p-12 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
          <div className="relative z-10">
            <Link to = "/" className="mb-12 flex items-center gap-3">
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
                Continue your speaking journey with{" "}
                <span className="text-blue-800">AI-powered</span> practice.
              </h1>
            </div>
          </div>

          <div className="login-blob login-blob-lg"></div>
          <div className="login-blob login-blob-sm"></div>
        </div>

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
                Welcome back
              </h2>
              <p className="mt-2 text-slate-600">
                Continue your language learning journey today.
              </p>
            </div>

            <div className="mt-10">
              {error && (
                <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                  <span className="material-symbols-outlined text-sm text-red-600">
                    error
                  </span>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-slate-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@gmail.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-900"
                    >
                      Password
                    </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-blue-800 hover:underline"
                    >
                    Quên mật khẩu?
                  </Link>
                  </div>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-800"
                    >
                      <span className="material-symbols-outlined">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-xl bg-blue-800 py-3.5 font-bold text-white shadow-lg shadow-blue-800/20 transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Logging in..." : "Log in"}
                </button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white px-4 text-slate-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex w-full max-w-[360px] items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
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

              <p className="mt-8 text-center text-sm text-slate-500">
                Don&apos;t have an account?
                <Link
                  to="/register"
                  className="ml-1 font-bold text-blue-800 hover:underline"
                >
                  Sign up now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}