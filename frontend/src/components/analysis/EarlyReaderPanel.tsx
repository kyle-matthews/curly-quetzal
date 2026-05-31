import type { EarlyReaderResult } from "../../types/api";

interface EarlyReaderPanelProps {
  analysis: EarlyReaderResult;
}

export default function EarlyReaderPanel({ analysis }: EarlyReaderPanelProps) {
  return (
    <section className="card p-5 space-y-4">
      <h2 className="text-base font-semibold text-stone-700">Phonics analysis</h2>

      {/* Book band + phase */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border border-stone-200 flex-shrink-0"
          style={{ backgroundColor: analysis.book_band_colour }}
        />
        <div>
          <span className="text-sm font-medium text-stone-800">{analysis.book_band} band</span>
          <span className="mx-2 text-stone-300">·</span>
          <span className="text-sm text-stone-500">Phase {analysis.phonics_phase}</span>
        </div>
      </div>

      {/* Decodability */}
      <div>
        <p className="text-xs text-stone-500 mb-1">Decodability at this phase</p>
        <div className="w-full bg-stone-100 rounded-full h-3">
          <div
            className="bg-primary-500 h-3 rounded-full transition-all"
            style={{ width: `${Math.min(analysis.decodability_pct, 100)}%` }}
          />
        </div>
        <p className="text-xs text-stone-400 mt-1">{analysis.decodability_pct}%</p>
      </div>

      {/* GPCs */}
      {analysis.gpc_inventory.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-500 mb-2">GPCs present</p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.gpc_inventory.map((gpc) => (
              <span key={gpc} className="text-xs bg-stone-100 text-stone-600 rounded px-2 py-0.5 font-mono">
                {gpc}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Common exception words */}
      {analysis.common_exception_words.length > 0 && (
        <div>
          <p className="text-xs font-medium text-stone-500 mb-2">
            Common exception words ({analysis.common_exception_words.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {analysis.common_exception_words.map((w) => (
              <span key={w} className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded px-2 py-0.5">
                {w}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-stone-400">
        {analysis.raw_text_stats.word_count} words ·{" "}
        {analysis.raw_text_stats.avg_sentence_length} words/sentence
      </div>

      {analysis.warnings.length > 0 && (
        <ul className="space-y-1">
          {analysis.warnings.map((w, i) => (
            <li key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
              ⚠ {w}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
