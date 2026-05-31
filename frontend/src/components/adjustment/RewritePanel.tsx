import { useStore } from "../../store/readrightStore";
import SplitPane from "../layout/SplitPane";
import ScorePanel from "../analysis/ScorePanel";
import EarlyReaderPanel from "../analysis/EarlyReaderPanel";
import type { DevelopingFluentResult, EarlyReaderResult } from "../../types/api";

export default function RewritePanel() {
  const originalText = useStore((s) => s.originalText);
  const rewrittenText = useStore((s) => s.rewrittenText);
  const rewriteInProgress = useStore((s) => s.rewriteInProgress);
  const rewrittenScores = useStore((s) => s.rewrittenScores);
  const profile = useStore((s) => s.profile)!;

  const leftContent = (
    <div className="bg-stone-50 rounded-lg border border-stone-200 p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap min-h-32">
      {originalText}
    </div>
  );

  const rightContent = (
    <div className="bg-primary-50 rounded-lg border border-primary-200 p-4 text-sm text-stone-700 leading-relaxed whitespace-pre-wrap min-h-32">
      {rewrittenText}
      {rewriteInProgress && (
        <span className="inline-block w-0.5 h-4 bg-primary-500 animate-pulse ml-0.5 align-text-bottom" />
      )}
    </div>
  );

  return (
    <section className="card p-5 space-y-4">
      <h2 className="text-base font-semibold text-stone-700">Before / after</h2>
      <SplitPane left={leftContent} right={rightContent} />

      {rewrittenScores && !rewriteInProgress && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
            Rewritten text scores
          </p>
          {profile === "early" ? (
            <EarlyReaderPanel analysis={rewrittenScores as EarlyReaderResult} />
          ) : (
            <ScorePanel analysis={rewrittenScores as DevelopingFluentResult} />
          )}
        </div>
      )}
    </section>
  );
}
