import { useState } from "react";
import type { VocabWord } from "../../types/api";

interface VocabularyPanelProps {
  tier2: VocabWord[];
  tier3: VocabWord[];
}

export default function VocabularyPanel({ tier2, tier3 }: VocabularyPanelProps) {
  const [activeWord, setActiveWord] = useState<string | null>(null);

  if (tier2.length === 0 && tier3.length === 0) return null;

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-4">Vocabulary</h2>

      {tier3.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-medium text-violet-600 mb-2">
            Tier 3 — subject-specific ({tier3.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tier3.map((v) => (
              <button
                key={v.word}
                onClick={() => setActiveWord(activeWord === v.word ? null : v.word)}
                className={`text-sm rounded-full px-3 py-0.5 border transition-colors ${
                  activeWord === v.word
                    ? "bg-violet-100 border-violet-400 text-violet-800"
                    : "bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100"
                }`}
              >
                {v.word}
              </button>
            ))}
          </div>
        </div>
      )}

      {tier2.length > 0 && (
        <div>
          <p className="text-xs font-medium text-blue-600 mb-2">
            Tier 2 — academic vocabulary ({tier2.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {tier2.map((v) => (
              <button
                key={v.word}
                onClick={() => setActiveWord(activeWord === v.word ? null : v.word)}
                className={`text-sm rounded-full px-3 py-0.5 border transition-colors ${
                  activeWord === v.word
                    ? "bg-blue-100 border-blue-400 text-blue-800"
                    : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {v.word}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
