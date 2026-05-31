import { useState } from "react";
import { useStore } from "../store/readrightStore";
import { post } from "../lib/apiClient";
import type { AnalysisResult, DevelopingFluentResult, EarlyReaderResult, QuestionsResult } from "../types/api";

function extractYearGroupAndBand(scores: AnalysisResult | null): { yearGroup: string; bookBand: string } {
  if (!scores) return { yearGroup: "Y4", bookBand: "Gold" };
  if (scores.profile === "early") {
    const early = scores as EarlyReaderResult;
    return { yearGroup: "Y1", bookBand: early.book_band ?? "Gold" };
  }
  const df = scores as DevelopingFluentResult;
  return {
    yearGroup: df.year_group_estimate ?? "Y4",
    bookBand: df.book_band_estimate ?? "Gold",
  };
}

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

    const { yearGroup, bookBand } = extractYearGroupAndBand(rewrittenScores ?? analysisResult);

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
