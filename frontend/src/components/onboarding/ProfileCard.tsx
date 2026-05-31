interface ProfileCardProps {
  title: string;
  ageRange: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ProfileCard({
  title,
  ageRange,
  description,
  icon,
  isSelected,
  onSelect,
}: ProfileCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`card text-left p-5 w-full transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400 ${
        isSelected
          ? "border-primary-400 bg-primary-50 shadow-md"
          : "hover:border-stone-300"
      }`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h2 className="text-base font-semibold text-stone-800 mb-0.5">{title}</h2>
      <p className="text-xs text-primary-700 font-medium mb-2">{ageRange}</p>
      <p className="text-sm text-stone-500 leading-relaxed">{description}</p>
    </button>
  );
}
