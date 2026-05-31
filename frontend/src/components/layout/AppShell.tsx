import { Link, useLocation } from "react-router-dom";
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

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <header className="bg-white border-b border-stone-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-primary-700 font-bold text-lg tracking-tight">
              Readability Tool
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {profile && onAnalysisPage && (
              <span className="text-sm text-stone-500 bg-primary-50 border border-primary-200 rounded-full px-3 py-0.5">
                {PROFILE_LABELS[profile]}
              </span>
            )}
            {profile && (
              <Link
                to="/"
                onClick={reset}
                className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
              >
                Change profile
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  );
}
