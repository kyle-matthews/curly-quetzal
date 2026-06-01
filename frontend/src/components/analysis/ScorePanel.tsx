import type { DevelopingFluentResult } from "../../types/api";
import ScoreBadge from "./ScoreBadge";

interface ScorePanelProps {
  analysis: DevelopingFluentResult;
}

export default function ScorePanel({ analysis }: ScorePanelProps) {
  const { warnings } = analysis;

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-4">Readability scores</h2>

      <div className="flex flex-wrap gap-4 mb-5">
        <ScoreBadge label="Flesch-Kincaid grade" value={analysis.flesch_kincaid_grade} />
        <ScoreBadge label="Flesch reading ease" value={analysis.flesch_reading_ease} />
        <ScoreBadge label="Gunning Fog" value={analysis.gunning_fog} />
        <ScoreBadge label="SMOG index" value={analysis.smog_index} />
      </div>

      <div className="flex items-center gap-3">
        <div
          className="w-6 h-6 rounded-full border border-stone-200 flex-shrink-0"
          style={{ backgroundColor: analysis.book_band_colour }}
        />
        <div>
          <span className="text-sm font-medium text-stone-700 dark:text-stone-200">
            {analysis.book_band_estimate} band
          </span>
          <span className="mx-2 text-stone-300">·</span>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {analysis.year_group_estimate} estimate
          </span>
        </div>
      </div>

      {analysis.nc_rationale && (
        <p className="mt-2 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
          {analysis.nc_rationale}
        </p>
      )}

      <div className="mt-3 text-xs text-stone-400">
        {analysis.raw_text_stats.word_count} words ·{" "}
        {analysis.raw_text_stats.avg_sentence_length} words/sentence ·{" "}
        {analysis.raw_text_stats.avg_syllables_per_word} syllables/word
      </div>

      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1">
          {warnings.map((w, i) => (
            <li key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1">
              ⚠ {w}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
