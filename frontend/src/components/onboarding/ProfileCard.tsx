import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface ProfileCardProps {
  title: string;
  ageRange: string;
  description: string;
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  isSelected: boolean;
  onSelect: () => void;
}

export default function ProfileCard({
  title,
  ageRange,
  description,
  Icon,
  iconBg,
  iconColor,
  isSelected,
  onSelect,
}: ProfileCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`card text-left p-5 w-full transition-all hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary-400
                  relative
                  ${isSelected
                    ? "border-primary-400 bg-primary-50 shadow-md dark:bg-primary-900/20 dark:border-primary-600"
                    : "hover:border-stone-300 dark:hover:border-stone-600"
                  }`}
    >
      {/* Selected checkmark */}
      {isSelected && (
        <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
          <Check size={14} strokeWidth={3} className="text-white" />
        </span>
      )}

      <div className="flex items-start gap-4">
        {/* Icon box */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          <Icon size={22} className={iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-6">
          <h2 className="text-base font-semibold text-stone-800 dark:text-stone-100 mb-1">
            {title}
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
            {description}
          </p>
          <span className="inline-block text-xs font-medium text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-700 rounded-full px-3 py-0.5">
            {ageRange}
          </span>
        </div>
      </div>
    </button>
  );
}
