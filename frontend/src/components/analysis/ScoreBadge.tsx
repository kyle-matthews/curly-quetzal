interface ScoreBadgeProps {
  label: string;
  value: string | number;
  colour?: string;
  size?: "sm" | "md";
}

export default function ScoreBadge({ label, value, colour, size = "md" }: ScoreBadgeProps) {
  const sizeClasses = size === "sm"
    ? "text-xs px-2 py-0.5"
    : "text-sm px-3 py-1";

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`rounded-lg font-semibold ${sizeClasses}`}
        style={colour ? { backgroundColor: colour + "33", color: colour } : undefined}
      >
        {value}
      </div>
      <span className="text-xs text-stone-400 text-center">{label}</span>
    </div>
  );
}
