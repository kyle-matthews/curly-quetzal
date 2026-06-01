import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AnalysisResult,
  AdjustTarget,
  Domain,
  Profile,
  Question,
} from "../types/api";

interface AppState {
  // Session data
  profile: Profile | null;
  originalText: string;
  analysisResult: AnalysisResult | null;

  // Adjustment
  adjustmentTarget: AdjustTarget | null;
  rewrittenText: string;
  rewriteInProgress: boolean;
  rewrittenScores: AnalysisResult | null;

  // Questions
  questions: Question[];
  selectedDomains: Domain[];

  // Actions
  setProfile: (profile: Profile) => void;
  setOriginalText: (text: string) => void;
  setAnalysisResult: (result: AnalysisResult) => void;
  setAdjustmentTarget: (target: AdjustTarget) => void;
  startRewrite: () => void;
  appendRewriteChunk: (chunk: string) => void;
  finaliseRewrite: (rewrittenText: string, scores: AnalysisResult) => void;
  abortRewrite: () => void;
  setQuestions: (questions: Question[]) => void;
  toggleDomain: (domain: Domain) => void;
  reset: () => void;
}

const initialState = {
  profile: null,
  originalText: "",
  analysisResult: null,
  adjustmentTarget: null,
  rewrittenText: "",
  rewriteInProgress: false,
  rewrittenScores: null,
  questions: [],
  selectedDomains: ["2b", "2d"] as Domain[],
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setProfile: (profile) => set({ profile }),
      setOriginalText: (text) => set({ originalText: text }),
      setAnalysisResult: (result) =>
        set({ analysisResult: result, rewrittenText: "", rewrittenScores: null, questions: [] }),
      setAdjustmentTarget: (target) => set({ adjustmentTarget: target }),
      startRewrite: () => set({ rewriteInProgress: true, rewrittenText: "" }),
      appendRewriteChunk: (chunk) =>
        set((state) => ({ rewrittenText: state.rewrittenText + chunk })),
      finaliseRewrite: (rewrittenText, scores) =>
        set({ rewrittenText, rewrittenScores: scores, rewriteInProgress: false }),
      abortRewrite: () => set({ rewriteInProgress: false }),
      setQuestions: (questions) => set({ questions }),
      toggleDomain: (domain) =>
        set((state) => ({
          selectedDomains: state.selectedDomains.includes(domain)
            ? state.selectedDomains.filter((d) => d !== domain)
            : [...state.selectedDomains, domain],
        })),
      reset: () => set(initialState),
    }),
    {
      name: "cq-session-v2",
      // Only persist the data the teacher needs on refresh — not in-progress state
      partialize: (state) => ({
        profile: state.profile,
        originalText: state.originalText,
        analysisResult: state.analysisResult,
      }),
    }
  )
);
