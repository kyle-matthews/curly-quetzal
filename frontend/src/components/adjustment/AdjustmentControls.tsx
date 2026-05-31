import { useState } from "react";
import { useStore } from "../../store/readrightStore";
import { useAdjust } from "../../hooks/useAdjust";
import type { TargetType } from "../../types/api";

const YEAR_GROUPS = ["Reception", "Y1", "Y2", "Y3", "Y4", "Y5", "Y6"];
const BOOK_BANDS = [
  "Lilac", "Pink", "Red", "Yellow", "Blue", "Green",
  "Orange", "Turquoise", "Purple", "Gold", "White", "Lime", "Lime+",
];

export default function AdjustmentControls() {
  const profile = useStore((s) => s.profile)!;
  const rewriteInProgress = useStore((s) => s.rewriteInProgress);
  const { adjust, error } = useAdjust();

  const [targetType, setTargetType] = useState<TargetType>(
    profile === "early" ? "book_band" : "year_group"
  );
  const [targetValue, setTargetValue] = useState("");

  const options = targetType === "year_group" ? YEAR_GROUPS : BOOK_BANDS;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!targetValue) return;
    void adjust({ type: targetType, value: targetValue });
  }

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-1">Adjust difficulty</h2>
      <p className="text-sm text-stone-500 mb-4">
        Rewrite the text for a different level. The before and after will appear side by side.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {profile !== "early" && (
          <div className="flex gap-3">
            {(["year_group", "book_band"] as TargetType[]).map((t) => (
              <label key={t} className="flex items-center gap-1.5 text-sm text-stone-600 cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value={t}
                  checked={targetType === t}
                  onChange={() => { setTargetType(t); setTargetValue(""); }}
                  className="accent-primary-600"
                />
                {t === "year_group" ? "Year group" : "Book band"}
              </label>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="label">
              Target {targetType === "year_group" ? "year group" : "book band"}
            </label>
            <select
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              className="input"
              disabled={rewriteInProgress}
            >
              <option value="">Select…</option>
              {options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={!targetValue || rewriteInProgress}
          >
            {rewriteInProgress ? "Rewriting…" : "Rewrite"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
        )}
      </form>
    </section>
  );
}
