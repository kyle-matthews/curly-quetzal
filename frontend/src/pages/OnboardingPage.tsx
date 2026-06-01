import { useNavigate } from "react-router-dom";
import { BookOpen, Sparkles, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useStore } from "../store/readrightStore";
import ProfileCard from "../components/onboarding/ProfileCard";
import type { Profile } from "../types/api";

const PROFILES: Array<{
  id: Profile;
  title: string;
  ageRange: string;
  description: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}> = [
  {
    id: "early",
    title: "Early readers",
    ageRange: "Reception – Year 1",
    description:
      "Just beginning their reading journey. Simple vocabulary, short sentences, and phonics-based texts.",
    Icon: BookOpen,
    iconBg: "bg-teal-100 dark:bg-teal-900/40",
    iconColor: "text-teal-600 dark:text-teal-400",
  },
  {
    id: "developing",
    title: "Developing readers",
    ageRange: "Year 2 – Year 3",
    description:
      "Building confidence and fluency. Handling more complex sentences and expanding vocabulary.",
    Icon: Sparkles,
    iconBg: "bg-blue-100 dark:bg-blue-900/40",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "fluent",
    title: "Fluent readers",
    ageRange: "Year 4 – Year 6",
    description:
      "Reading independently with comprehension. Ready for longer texts and nuanced language.",
    Icon: GraduationCap,
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export default function OnboardingPage() {
  const setProfile = useStore((s) => s.setProfile);
  const currentProfile = useStore((s) => s.profile);
  const navigate = useNavigate();

  function handleContinue() {
    if (currentProfile) navigate("/analyse");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl text-primary-800 dark:text-primary-300 mb-2">
          Who are you teaching today?
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-base">
          Pick the profile that fits your class and we'll tailor everything to them.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {PROFILES.map((p) => (
          <ProfileCard
            key={p.id}
            title={p.title}
            ageRange={p.ageRange}
            description={p.description}
            Icon={p.Icon}
            iconBg={p.iconBg}
            iconColor={p.iconColor}
            isSelected={currentProfile === p.id}
            onSelect={() => setProfile(p.id)}
          />
        ))}
      </div>

      <button
        onClick={handleContinue}
        disabled={!currentProfile}
        className="btn-primary w-full justify-center py-3 text-base"
      >
        Continue to analysis
      </button>
    </div>
  );
}
