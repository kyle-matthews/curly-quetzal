export type Profile = "early" | "developing" | "fluent";

export type Domain = "2a" | "2b" | "2c" | "2d" | "2e" | "2f" | "2g";

export type TargetType = "year_group" | "book_band";

export interface RawTextStats {
  word_count: number;
  avg_sentence_length: number;
  avg_syllables_per_word: number;
}

export interface VocabWord {
  word: string;
  sentence_index: number;
}

export interface VocabResult {
  tier2: VocabWord[];
  tier3: VocabWord[];
}

export interface EarlyReaderResult {
  profile: "early";
  book_band: string;
  book_band_colour: string;
  phonics_phase: number;
  decodability_pct: number;
  common_exception_words: string[];
  gpc_inventory: string[];
  raw_text_stats: RawTextStats;
  warnings: string[];
}

export interface DevelopingFluentResult {
  profile: "developing" | "fluent";
  flesch_kincaid_grade: number;
  flesch_reading_ease: number;
  gunning_fog: number;
  smog_index: number;
  year_group_estimate: string;
  book_band_estimate: string;
  book_band_colour: string;
  nc_rationale?: string;
  spelling_features?: string[];
  exception_words_found?: string[];
  vocabulary: VocabResult;
  raw_text_stats: RawTextStats;
  warnings: string[];
}

export type AnalysisResult = EarlyReaderResult | DevelopingFluentResult;

export interface AdjustTarget {
  type: TargetType;
  value: string;
}

export interface StreamDonePayload {
  event: "done";
  rewritten_text: string;
  scores: AnalysisResult;
}

export interface Question {
  domain: Domain;
  domain_label: string;
  question: string;
  model_answer: string;
  difficulty: "literal" | "inferential" | "evaluative";
}

export interface QuestionsResult {
  questions: Question[];
}

export interface ApiError {
  error?: string;
  errors?: string[];
}
