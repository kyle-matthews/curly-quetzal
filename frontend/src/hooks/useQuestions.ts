import { useState } from "react";
import { useStore } from "../store/readrightStore";
import { post } from "../lib/apiClient";
import type { DevelopingFluentResult, QuestionsResult } from "../types/api";

export function useQuestions() {
  const profile = useStore((s) => s.profile)!;
  const originalText = useStore((s) => s.originalText);
  const analysisResult = useStore((s) => s.analysisResult);
  const rewrittenScores = useStore((s) => s.rewrittenScores);
  const selectedDomains = useStore((s) => s.selectedDomains);
  const setQuestions = useStore((s) => s.setQuestions);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateQuestions() {
    setIsLoading(true);
    setError(null);

    const scores = (rewrittenScores ?? analysisResult) as DevelopingFluentResult | null;
    const yearGroup = scores?.year_group_estimate ?? "Y4";
    const bookBand = scores?.book_band_estimate ?? "Gold";

    try {
      const result = await post<QuestionsResult>("/questions", {
        text: originalText,
        profile,
        domains: selectedDomains,
        target_year_group: yearGroup,
        target_book_band: bookBand,
      });
      setQuestions(result.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Question generation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { generateQuestions, isLoading, error };
}
