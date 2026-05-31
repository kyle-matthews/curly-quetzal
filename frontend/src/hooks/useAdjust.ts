import { useState } from "react";
import { useStore } from "../store/readrightStore";
import { useStream } from "./useStream";
import type { AdjustTarget, AnalysisResult, StreamDonePayload } from "../types/api";

export function useAdjust() {
  const profile = useStore((s) => s.profile)!;
  const originalText = useStore((s) => s.originalText);
  const startRewrite = useStore((s) => s.startRewrite);
  const appendRewriteChunk = useStore((s) => s.appendRewriteChunk);
  const finaliseRewrite = useStore((s) => s.finaliseRewrite);
  const abortRewrite = useStore((s) => s.abortRewrite);
  const setAdjustmentTarget = useStore((s) => s.setAdjustmentTarget);

  const [error, setError] = useState<string | null>(null);
  const { startStream, cancel } = useStream<StreamDonePayload>();

  async function adjust(target: AdjustTarget) {
    setError(null);
    setAdjustmentTarget(target);
    startRewrite();

    await startStream(
      "/api/adjust",
      { text: originalText, profile, target },
      {
        onChunk: appendRewriteChunk,
        onDone: (payload) => {
          finaliseRewrite(payload.rewritten_text, payload.scores as AnalysisResult);
        },
        onError: (msg) => {
          setError(msg);
          abortRewrite();
        },
      }
    );
  }

  return { adjust, cancel, error };
}
