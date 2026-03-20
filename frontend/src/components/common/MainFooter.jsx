import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function MainFooter() {
  return (
    <footer className="bg-slate-900 py-12 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center justify-between gap-8 border-b border-slate-800 pb-12 md:flex-row">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="SpeakAI Logo"
              className="h-10 w-auto object-contain"
            />
            
          </div>

          <div className="flex gap-8 text-sm">
            <Link to="/privacy-policy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="transition-colors hover:text-white"
            >
              Terms of Service
            </Link>
            <Link
              to="/contact-support"
              className="transition-colors hover:text-white"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <div className="text-center text-sm text-slate-500">
          © 2026 SpeakAI. All rights reserved. Built for learners worldwide.
        </div>
      </div>
    </footer>
  );
}