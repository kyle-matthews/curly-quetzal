import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useStore } from "./store/readrightStore";
import AppShell from "./components/layout/AppShell";
import OnboardingPage from "./pages/OnboardingPage";
import AnalysisPage from "./pages/AnalysisPage";

function RequireProfile({ children }: { children: React.ReactNode }) {
  const profile = useStore((s) => s.profile);
  if (!profile) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route
            path="/analyse"
            element={
              <RequireProfile>
                <AnalysisPage />
              </RequireProfile>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
