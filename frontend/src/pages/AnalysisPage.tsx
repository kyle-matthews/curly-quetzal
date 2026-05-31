import { useStore } from "../store/readrightStore";
import TextInputPanel from "../components/analysis/TextInputPanel";
import ScorePanel from "../components/analysis/ScorePanel";
import EarlyReaderPanel from "../components/analysis/EarlyReaderPanel";
import VocabularyPanel from "../components/analysis/VocabularyPanel";
import AdjustmentControls from "../components/adjustment/AdjustmentControls";
import RewritePanel from "../components/adjustment/RewritePanel";
import QuestionControls from "../components/questions/QuestionControls";
import QuestionList from "../components/questions/QuestionList";
import ExportBar from "../components/export/ExportBar";

export default function AnalysisPage() {
  const profile = useStore((s) => s.profile)!;
  const analysisResult = useStore((s) => s.analysisResult);
  const rewrittenText = useStore((s) => s.rewrittenText);
  const rewriteInProgress = useStore((s) => s.rewriteInProgress);
  const questions = useStore((s) => s.questions);

  const isAnalysed = analysisResult !== null;
  const isAdjusted = rewrittenText.length > 0 || rewriteInProgress;
  const isQuestioned = questions.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 space-y-6">
      {/* Step 1: Text input */}
      <TextInputPanel />

      {/* Step 2: Analysis results — revealed after analysis */}
      {isAnalysed && (
        <>
          {profile === "early" ? (
            <EarlyReaderPanel analysis={analysisResult as import("../types/api").EarlyReaderResult} />
          ) : (
            <>
              <ScorePanel analysis={analysisResult as import("../types/api").DevelopingFluentResult} />
              <VocabularyPanel
                tier2={(analysisResult as import("../types/api").DevelopingFluentResult).vocabulary.tier2}
                tier3={(analysisResult as import("../types/api").DevelopingFluentResult).vocabulary.tier3}
              />
            </>
          )}

          {/* Step 3: Adjustment controls */}
          <AdjustmentControls />
        </>
      )}

      {/* Step 3b: Rewrite pane (streaming) */}
      {isAdjusted && <RewritePanel />}

      {/* Step 4: Question generation — only after a rewrite */}
      {isAdjusted && !rewriteInProgress && <QuestionControls />}

      {/* Step 4b: Generated questions */}
      {isQuestioned && <QuestionList questions={questions} />}

      {/* Export bar — sticky footer, visible once analysis complete */}
      {isAnalysed && <ExportBar />}
    </div>
  );
}
