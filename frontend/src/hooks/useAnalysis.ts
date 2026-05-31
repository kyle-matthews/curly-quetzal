import { useState } from "react";
import { useStore } from "../store/readrightStore";
import { post } from "../lib/apiClient";
import type { AnalysisResult } from "../types/api";

export function useAnalysis() {
  const profile = useStore((s) => s.profile)!;
  const setAnalysisResult = useStore((s) => s.setAnalysisResult);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function analyse(text: string) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await post<AnalysisResult>("/analyse", { text, profile });
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return { analyse, isLoading, error };
}
