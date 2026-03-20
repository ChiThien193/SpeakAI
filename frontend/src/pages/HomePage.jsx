import MainHeader from "../components/common/MainHeader";
import MainFooter from "../components/common/MainFooter";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function HomePage() {
  return (
    <div className="bg-slate-50 text-slate-900 font-sans antialiased">
      <MainHeader />

      <main>
        <section className="relative overflow-hidden bg-white pb-20 pt-16 lg:pb-32 lg:pt-24">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 sm:px-6 lg:flex-row lg:px-8">
            <div className="flex-1 text-center lg:text-left">
              <span className="mb-4 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-bold uppercase tracking-wide text-blue-800">
                Designed for A2-B1 Learners
              </span>

              <h1 className="mb-6 text-4xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
                Practice English speaking with AI in{" "}
                <span className="text-blue-800">real-life scenarios</span>
              </h1>

              <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-600 lg:mx-0 lg:text-xl">
                Master English conversation through interactive AI roleplay and
                instant feedback. No judgment, just pure practice.
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                <Link
                to="/register"
                className="transform rounded-xl bg-blue-800 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl inline-block"
                >
                 Start Practice
                </Link>
                <button className="rounded-xl border border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:bg-slate-50">
                  Watch Demo
                </button>
              </div>
            </div>

            <div className="w-full max-w-xl flex-1">
              <div className="home-hero-mockup relative flex aspect-video flex-col overflow-hidden rounded-3xl border-8 border-slate-900 bg-slate-100 p-4 shadow-2xl lg:aspect-square">
                <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                  <div className="max-w-[80%] self-start rounded-2xl rounded-tl-none border border-blue-100 bg-white p-4 shadow-sm">
                    <p className="mb-1 text-sm font-semibold text-blue-800">
                      AI Tutor
                    </p>
                    <p className="text-slate-700">
                      "Welcome to the restaurant! Are you ready to order?"
                    </p>
                  </div>

                  <div className="max-w-[80%] self-end rounded-2xl rounded-tr-none bg-blue-800 p-4 shadow-sm">
                    <p className="mb-1 text-sm font-semibold text-blue-100">You</p>
                    <p className="text-sm text-white">
                      "I would like a burger and a cup of... er... water."
                    </p>
                  </div>

                  <div className="w-full self-start rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm">
                    <p className="mb-2 text-xs font-bold uppercase text-green-700">
                      Instant Feedback
                    </p>
                    <p className="text-sm text-green-800">
                      Great job! You could also say: "I'd like to order a burger
                      and some water, please."
                    </p>
                  </div>
                </div>

                <div className="flex h-20 items-center justify-center border-t border-slate-200 bg-white">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white animate-pulse">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 py-20" id="features">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                Why learn with SpeakAI?
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600">
                Build confidence and fluency with tools designed specifically for
                language learners.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold">Practice by scenarios</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Choose from dozens of realistic situations to prepare for the
                  real world.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-emerald-500">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold">Speak naturally</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Use your microphone and talk just like you would with a human
                  partner.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold">Context-aware AI</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  The AI understands the nuance of your conversation, not just
                  keywords.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <h3 className="mb-3 text-xl font-bold">Grammar Help</h3>
                <p className="text-sm leading-relaxed text-slate-600">
                  Get instant suggestions for better expressions and grammar as
                  you speak.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20" id="topics">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mb-4 text-3xl font-bold text-slate-900 lg:text-4xl">
                  Featured Topics
                </h2>
                <p className="text-slate-600">
                  Start a conversation in any of these popular scenarios.
                </p>
              </div>

              <a
                className="flex items-center gap-2 font-bold text-blue-800 hover:underline"
                href="#"
              >
                View all 50+ topics
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  />
                </svg>
              </a>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group cursor-pointer">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    alt="Restaurant Scenario"
                    className="home-topic-image h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuyoNhxTG_6A-m-lGt6SRyhDLQ6aydESE3EHTQLKw-7aeloaNEK54rR8A9mD37lqhwE9rWPmaudt8_INkHi0Jro03SGa8kqjdWZ-I_RAfa1_0JmSmNyEn9IGm05Cqj0_LWXqXNHa2hHdkB9lLXBi6HuPIX0ijurNlTftaFKEbMeVuP51xckAZlmQsdDO5-KTS6VaytghvQmvINWcvLlWPoAb8oaZALuYSV67loJmTj4Vt1bbHkIf6JBGUzp_PbA1Jvq5E024mpR-A"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="rounded bg-emerald-500/80 px-2 py-1 text-xs font-bold">
                      Beginner Friendly
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-800">
                  Restaurant
                </h4>
                <p className="text-sm text-slate-500">
                  Order food and handle special requests.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    alt="Travel Scenario"
                    className="home-topic-image h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5gP-pgdl0oIqopH_UF9xQGCC-t_TrchZ3N2hUPcm7TRaMRZ6KtVMMZbOjdbAVJ2TquG2Sm9SgaNgYwW00VCrPGBg-g0fZtEsAfBSNeu3mYYszSeoTDnIjVaoDtzwap7h7YouK8UX--Haj_uz85Vi1cezNfYdhNa9r1XAscXfd9fV6bNdrWvOUgEbipF37MsKAmUZFPgnJs929Oms0I6dDVETuBoTLJyddlR--PFkxh6BX2fHONFiR9uJCKpaCUTfcxV-Ti3t0xsw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="rounded bg-blue-800/80 px-2 py-1 text-xs font-bold">
                      Essential
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-800">
                  Travel
                </h4>
                <p className="text-sm text-slate-500">
                  Navigating airports, hotels, and directions.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    alt="Interview Scenario"
                    className="home-topic-image h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBrPqVGzvm7BzvGJxP1Z6mY-RNWwKahpfLvZdWEul7wwEcbYigt-bx4Qb03zFykUmPnSnnUOXq7__3jQHaOhemnR7YvYv1SNuS0Cyi3wQTHFEI8wcqqwEu0HEEBfPdVyEePoibEUKfSn690ncRZBi3rlLjBG3vYOszT1xKeDe_JxMvB-jC4aSS-UilNvepkpWqY-JhuSUErguk5Yl8wrb7JKz4Pd6JyTdi6X0ZRFjSABP9CPVaSCxkV4a_EKCmlfADswmD9sHdJEJI"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="rounded bg-purple-500/80 px-2 py-1 text-xs font-bold">
                      Career Focus
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-800">
                  Job Interview
                </h4>
                <p className="text-sm text-slate-500">
                  Answer common professional questions.
                </p>
              </div>

              <div className="group cursor-pointer">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl">
                  <img
                    alt="Daily Conversation"
                    className="home-topic-image h-full w-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpqR7C7cDUeTbvswEukAn5_hdWKEkwsQZ0QS0QQvx5ZESHFgXzbqxJGc6GAY_V7f2PU2xzoNX-3wUqpEEjrsTrMMZqXd1RbzYITXjbXq50qvd9oFlXw9KreQiTvU7dheQvixpVVChE1VCDKaJjl8zcxKpEKGFtaEOqDYonLH4muTp-MOa8I8E2XGWVSwlrwrLrxKmefZqGGAQirFK-8v5UZig8rddprR7ktwvs6l483CbX7aE1SHM095XCu8KGq_mM-hzcZl0LdAk"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="rounded bg-orange-500/80 px-2 py-1 text-xs font-bold">
                      Casual
                    </span>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-800">
                  Daily Talk
                </h4>
                <p className="text-sm text-slate-500">
                  Chatting with friends and making plans.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden bg-blue-800 py-20">
          <div className="absolute right-0 top-0 h-96 w-96 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 opacity-20" />
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/2 translate-y-1/2 rounded-full bg-green-400 opacity-20" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-white lg:text-5xl">
              Ready to find your voice?
            </h2>
            <p className="mb-10 text-xl text-blue-100">
              Join thousands of students who are gaining confidence every day with
              SpeakAI.
            </p>
            <button className="rounded-2xl bg-white px-10 py-5 text-xl font-bold text-blue-800 shadow-xl transition-all hover:bg-slate-50">
              Start Your First Session Free
            </button>
          </div>
        </section>
      </main>

      <MainFooter />
    </div>
  );
}