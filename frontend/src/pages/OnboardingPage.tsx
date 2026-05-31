import { useNavigate } from "react-router-dom";
import { useStore } from "../store/readrightStore";
import ProfileCard from "../components/onboarding/ProfileCard";
import type { Profile } from "../types/api";

const PROFILES: Array<{
  id: Profile;
  title: string;
  ageRange: string;
  description: string;
  icon: string;
}> = [
  {
    id: "early",
    title: "Early readers",
    ageRange: "Reception – Year 1",
    description:
      "Phonics phase demand, book band estimate, decodability score, common exception words flagged.",
    icon: "🌱",
  },
  {
    id: "developing",
    title: "Developing readers",
    ageRange: "Year 2 – Year 3",
    description:
      "Flesch-Kincaid, Gunning Fog, SMOG scores mapped to UK year groups, vocabulary tier analysis.",
    icon: "📗",
  },
  {
    id: "fluent",
    title: "Fluent readers",
    ageRange: "Year 4 – Year 6",
    description:
      "Full readability suite, Tier 2 / Tier 3 vocabulary, text difficulty adjustment, KS2 comprehension questions.",
    icon: "📘",
  },
];

export default function OnboardingPage() {
  const setProfile = useStore((s) => s.setProfile);
  const currentProfile = useStore((s) => s.profile);
  const navigate = useNavigate();

  function handleSelect(profile: Profile) {
    setProfile(profile);
    navigate("/analyse");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl text-primary-800 mb-2">Who are you teaching today?</h1>
        <p className="text-stone-500 text-base">
          Select the reader profile that best matches your class. You can change this at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PROFILES.map((p) => (
          <ProfileCard
            key={p.id}
            title={p.title}
            ageRange={p.ageRange}
            description={p.description}
            icon={p.icon}
            isSelected={currentProfile === p.id}
            onSelect={() => handleSelect(p.id)}
          />
        ))}
      </div>
    </div>
  );
}
