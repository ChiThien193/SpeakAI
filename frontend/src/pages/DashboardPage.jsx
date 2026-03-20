import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function DashboardPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  const userName = currentUser?.full_name || "Người dùng";
  const userAvatar =
    currentUser?.avatar ||
    "https://ui-avatars.com/api/?name=SpeakAI&background=1e40af&color=fff";

  const learningCards = [
    {
      title: "Trò chuyện",
      desc: "Nâng cao kỹ năng ngôn ngữ của bạn bằng cách trò chuyện với giáo viên AI của chúng tôi.",
      tags: ["#Viết", "#Đọc"],
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
      onClick: () => navigate("/practice"),
      variant: "yellow",
    },
    {
      title: "Chế độ câu",
      desc: "Xây dựng nền tảng vững chắc cho các kỹ năng ngôn ngữ của bạn bằng cách học những điều cơ bản.",
      tags: ["#Nói", "#Phát âm"],
      badge: "Người mới bắt đầu",
      image:
        "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1200&auto=format&fit=crop",
      onClick: () => navigate("/practice"),
      variant: "gray",
    },
    {
      title: "Chế độ Word",
      desc: "Học từ vựng cơ bản với các bộ bài từ.",
      tags: ["#Từ vựng", "#Nói"],
      badge: "Người mới bắt đầu",
      image:
        "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
      onClick: () => navigate("/practice"),
      variant: "gray",
    },
  ];

  const menuItems = [
    { label: "Trang chủ", icon: "dashboard", active: true, to: "/dashboard" },
    { label: "Tìm hiểu", icon: "menu_book", to: "/dashboard" },
    { label: "Khóa học", icon: "school", to: "/dashboard" },
    { label: "Khám phá", icon: "explore", to: "/dashboard" },
    { label: "Tiến độ", icon: "trending_up", to: "/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-[#f3f4fb] text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-[280px] shrink-0 border-r border-slate-200 bg-white px-8 py-8 lg:flex lg:flex-col">
          <Link to="/" className="mb-10 flex items-center gap-3">
            <img
              src={logo}
              alt="SpeakAI Logo"
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-4 rounded-2xl px-4 py-4 text-lg font-medium transition ${
                  item.active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto space-y-3">
            <button className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-lg font-medium text-slate-600 transition hover:bg-slate-50">
              <span className="material-symbols-outlined text-pink-500">
                redeem
              </span>
              <span>Một món quà cho bạn</span>
            </button>

            <Link
              to="/profile"
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-4 text-left text-lg font-medium text-slate-600 transition hover:bg-slate-50"
            >
              <span className="material-symbols-outlined">person</span>
              <span>Tài khoản</span>
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {/* Top bar mobile/tablet */}
          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-3">
              <img
                src={logo}
                alt="SpeakAI Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xl font-bold">SpeakAI</span>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm"
            >
              <img
                src={userAvatar}
                alt={userName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="hidden text-sm font-semibold sm:block">
                {userName}
              </span>
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
            {/* Left content */}
            <section className="space-y-6">
              {learningCards.map((card) => (
                <button
                  key={card.title}
                  type="button"
                  onClick={card.onClick}
                  className="group grid w-full overflow-hidden rounded-[28px] border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md md:grid-cols-[1.2fr_0.8fr]"
                >
                  <div className="p-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-6 max-w-xl text-[19px] leading-8 text-slate-600">
                      {card.desc}
                    </p>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {card.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-base font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="relative min-h-[230px]">
                    {card.variant === "yellow" ? (
                      <div className="absolute inset-0 bg-yellow-300">
                        <div className="absolute inset-y-0 left-0 w-20 skew-x-[-12deg] bg-white/80"></div>
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute bottom-0 right-0 h-full w-[78%] object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-slate-100">
                        <div className="absolute inset-y-0 left-0 w-20 skew-x-[-10deg] bg-white/70"></div>
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-y-0 right-0 h-full w-[78%] object-cover grayscale"
                        />
                        {card.badge && (
                          <div className="absolute bottom-4 right-4 rounded-full bg-indigo-600 px-5 py-3 text-center text-sm font-bold leading-5 text-white shadow-lg">
                            {card.badge}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </section>

            {/* Right content */}
            <aside className="space-y-6">
              <div className="rounded-[28px] bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">
                  Chào mừng trở lại
                </h3>
                <p className="mt-4 text-lg leading-8 text-slate-600">
                  Tiếp tục hành trình học cùng SpeakAI. Chọn một chế độ học phù
                  hợp để bắt đầu luyện tập ngay hôm nay.
                </p>
              </div>

              <div className="rounded-[28px] bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">Cấp độ 2</h3>
                <p className="mt-4 text-xl text-slate-500">
                  Cấp độ hiện tại của bạn.
                </p>

                <div className="mt-8 rounded-[24px] bg-indigo-50 px-6 py-6">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-indigo-700">2</span>
                    <div className="h-3 flex-1 rounded-full bg-indigo-200">
                      <div className="h-3 w-1/2 rounded-full bg-indigo-600"></div>
                    </div>
                    <span className="text-4xl font-bold text-indigo-300">3</span>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Chuỗi liên tục:
                  </h3>
                  <span className="rounded-full bg-indigo-600 px-6 py-4 text-xl font-bold text-white">
                    0 ngày
                  </span>
                </div>

                <div className="my-8 h-px bg-slate-200"></div>

                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-slate-900">
                    Chuỗi dài nhất:
                  </h3>
                  <span className="rounded-full bg-indigo-100 px-6 py-4 text-xl font-bold text-indigo-700">
                    1 ngày
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] bg-white p-6 shadow-sm">
                <Link
                  to="/profile"
                  className="flex items-center gap-4 rounded-2xl p-2 transition hover:bg-slate-50"
                >
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {userName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Xem hồ sơ cá nhân
                    </p>
                  </div>
                </Link>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}