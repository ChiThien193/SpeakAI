import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function MainHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 bg-white">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <img
            src={logo}
            alt="SpeakAI Logo"
            className="h-14 w-auto object-contain"
          />
          <span className="text-2xl font-bold tracking-tight text-slate-900">
                SpeakAI
              </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          <a
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-800"
            href="#features"
          >
            Features
          </a>
          <a
            className="text-sm font-medium text-slate-600 transition-colors hover:text-blue-800"
            href="#topics"
          >
            Topics
          </a>
          <Link
          to="/register"
          className="rounded-full bg-blue-800 px-5 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-blue-700"
          >
          Get Started
          </Link>
        </div>

        <button className="p-2 text-slate-600 md:hidden">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 6h16M4 12h16m-7 6h7"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        </button>
      </nav>
    </header>
  );
}