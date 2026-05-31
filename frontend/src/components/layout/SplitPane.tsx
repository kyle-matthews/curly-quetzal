interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  leftLabel?: string;
  rightLabel?: string;
}

export default function SplitPane({
  left,
  right,
  leftLabel = "Original",
  rightLabel = "Rewritten",
}: SplitPaneProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
          {leftLabel}
        </p>
        {left}
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 mb-2">
          {rightLabel}
        </p>
        {right}
      </div>
    </div>
  );
}
