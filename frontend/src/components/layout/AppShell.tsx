import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useStore } from "../../store/readrightStore";
import type { Profile } from "../../types/api";

const PROFILE_LABELS: Record<Profile, string> = {
  early: "Early readers",
  developing: "Developing readers",
  fluent: "Fluent readers",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const profile = useStore((s) => s.profile);
  const reset = useStore((s) => s.reset);
  const location = useLocation();
  const onAnalysisPage = location.pathname === "/analyse";

  const [dark, setDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem("rr-theme") === "dark";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("rr-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("rr-theme", "light");
    }
  }, [dark]);

  return (
    <div className="min-h-screen flex flex-col bg-surface dark:bg-stone-900">
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary-700 dark:text-primary-400 font-bold text-lg tracking-tight">
              Readability Tool
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && onAnalysisPage && (
              <span className="text-sm text-stone-500 dark:text-stone-400 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-800 rounded-full px-3 py-0.5">
                {PROFILE_LABELS[profile]}
              </span>
            )}
            {profile && (
              <Link
                to="/"
                onClick={reset}
                className="text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 transition-colors"
              >
                Change profile
              </Link>
            )}

            <button
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="p-2 rounded-full text-stone-500 hover:text-stone-700 hover:bg-stone-100
                         dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-stone-800
                         transition-colors"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
