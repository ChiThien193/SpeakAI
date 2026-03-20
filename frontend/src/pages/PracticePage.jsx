import { Link } from "react-router-dom";
import "../styles/practice.css";

export default function PracticePage() {
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = currentUser?.full_name || "Người dùng";
  const userEmail = currentUser?.email || "user@speakai.com";
  const userAvatar =
    currentUser?.avatar ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBh0WMhiYhiZfIffkmYzYWSqc1t_MSL5nFkCVog9Ox3srZvV6dqu3Rl6UBTM9loU6oFuVsJfyAgm363qlVnSafLmwSeN5rvsgCNE-ZRlDjl2RM3cbNCBcSh0wAMOQYj4M4O0wDHiRbCp1e03x6qPaocgsstOHWHdvu37tvAF7O1CTUnltJm3iF9xApGcwcyHkL1Gn5cm2w_weKAA-RDMwyUnRVt1ujsd4eQbgI7XeAykSWs1AFdO_0aI1zFDyQaPMxpnO7mFA7M9vc";

  return (
    <div className="practice-page bg-[#f8f6f6] text-slate-900 transition-colors duration-200">
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        {/* Header */}
        <header className="shrink-0 border-b border-slate-200 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-800/10">
                  <span className="material-symbols-outlined text-blue-800">
                    record_voice_over
                  </span>
                </div>
                <h2 className="hidden text-lg font-bold leading-tight tracking-tight sm:block">
                  SpeakAI
                </h2>
              </div>

              <div className="mx-2 h-6 w-px bg-slate-200"></div>

              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-800">
                  Restaurant Ordering
                </span>
                <span className="text-sm text-slate-500">Role: Waiter</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 md:flex">
                <span className="material-symbols-outlined text-sm text-blue-800">
                  experiment
                </span>
                <span className="text-xs font-medium">
                  LAG+RAG Experiment Mode
                </span>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-3 py-1.5 text-green-700">
                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500"></div>
                <span className="text-xs font-bold uppercase">Ready</span>
              </div>

              <Link
                to="/profile"
                className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 transition hover:bg-slate-50 sm:flex"
              >
                <div className="h-10 w-10 overflow-hidden rounded-full border border-blue-200 bg-slate-100">
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="max-w-[140px] text-left">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {userName}
                  </p>
                  <p className="truncate text-xs text-slate-500">{userEmail}</p>
                </div>
              </Link>

              <Link
                to="/profile"
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-slate-100 transition hover:bg-slate-200 sm:hidden"
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              </Link>

              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 transition-colors hover:bg-slate-200">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main chat */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex justify-center">
              <span className="rounded-full bg-slate-200 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Session Started • 10:42 AM
              </span>
            </div>

            {/* AI message */}
            <div className="group flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-800/20 bg-blue-800/10">
                <span className="material-symbols-outlined text-blue-800">
                  robot_2
                </span>
              </div>

              <div className="flex max-w-[80%] flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Waiter
                  </span>
                  <button className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-blue-800">
                    <span className="material-symbols-outlined text-sm">
                      volume_up
                    </span>
                  </button>
                </div>

                <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-base leading-relaxed">
                    Welcome to the Bistro! It&apos;s a pleasure to have you. Are
                    you ready to order, or would you like to hear today&apos;s
                    specials first?
                  </p>
                </div>
              </div>
            </div>

            {/* User message */}
            <div className="group flex items-start justify-end gap-3">
              <div className="flex max-w-[80%] flex-col items-end gap-1.5">
                <span className="text-xs font-bold text-slate-500">You</span>

                <div className="rounded-2xl rounded-tr-none bg-blue-800 p-4 shadow-md shadow-blue-800/20">
                  <p className="text-base leading-relaxed text-white">
                    Yes, I&apos;d like to try the specialty seafood pasta
                    please. Does it come with any sides?
                  </p>
                </div>

                <div className="mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs text-green-500">
                    check_circle
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Pronunciation: 94%
                  </span>
                </div>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-300 bg-slate-200">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* AI message 2 */}
            <div className="group flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-800/20 bg-blue-800/10">
                <span className="material-symbols-outlined text-blue-800">
                  robot_2
                </span>
              </div>

              <div className="flex max-w-[80%] flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">
                    Waiter
                  </span>
                  <button className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-blue-800">
                    <span className="material-symbols-outlined text-sm">
                      volume_up
                    </span>
                  </button>
                </div>

                <div className="rounded-2xl rounded-tl-none border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-base leading-relaxed">
                    Excellent choice! The seafood pasta is served with a side of
                    garlic herb bread and a small garden salad. Would you like
                    to add a drink to your order?
                  </p>
                </div>
              </div>
            </div>

            {/* Typing skeleton */}
            <div className="flex items-center justify-end gap-3 opacity-50">
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>
                <div className="h-10 w-48 animate-pulse rounded-2xl bg-slate-200"></div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer controls */}
        <footer className="shrink-0 border-t border-slate-200 bg-white p-4 md:p-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {/* Visualizer */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-1 rounded-full bg-blue-800"></div>
                <div className="h-5 w-1 rounded-full bg-blue-800/60"></div>
                <div className="h-8 w-1 rounded-full bg-blue-800"></div>
                <div className="h-4 w-1 rounded-full bg-blue-800/40"></div>
                <div className="h-6 w-1 rounded-full bg-blue-800"></div>
              </div>

              <span className="text-sm font-medium text-slate-600">
                Listening...
              </span>

              <div className="flex items-center gap-1">
                <div className="h-6 w-1 rounded-full bg-blue-800"></div>
                <div className="h-4 w-1 rounded-full bg-blue-800/40"></div>
                <div className="h-8 w-1 rounded-full bg-blue-800"></div>
                <div className="h-5 w-1 rounded-full bg-blue-800/60"></div>
                <div className="h-3 w-1 rounded-full bg-blue-800"></div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="relative hidden flex-1 md:block">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full rounded-xl border-none bg-slate-100 px-4 py-3 text-sm transition-all focus:ring-2 focus:ring-blue-800/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-blue-800">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>

              <div className="flex flex-1 items-center justify-center gap-6">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100">
                  <span className="material-symbols-outlined">keyboard</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 animate-ping rounded-full bg-blue-800/20"></div>
                  <button className="relative flex h-20 w-20 items-center justify-center rounded-full bg-blue-800 text-white shadow-xl shadow-blue-800/30 transition-transform active:scale-95">
                    <span className="material-symbols-outlined !text-4xl">
                      mic
                    </span>
                  </button>
                </div>

                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 text-red-500 transition-colors hover:bg-red-50">
                  <span className="material-symbols-outlined">
                    stop_circle
                  </span>
                </button>
              </div>

              <div className="flex flex-1 justify-end">
                <button className="flex items-center gap-2 rounded-xl border border-blue-800/20 px-4 py-2 text-sm font-semibold text-blue-800 transition-colors hover:bg-blue-800/10">
                  <span className="material-symbols-outlined text-sm">
                    lightbulb
                  </span>
                  <span>Hint</span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[11px] font-medium text-slate-400">
                Tap the microphone to finish speaking
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}