import { useState } from "react";
import type { Question } from "../../types/api";

const DIFFICULTY_COLOURS: Record<Question["difficulty"], string> = {
  literal: "bg-green-50 text-green-700 border-green-200",
  inferential: "bg-blue-50 text-blue-700 border-blue-200",
  evaluative: "bg-violet-50 text-violet-700 border-violet-200",
};

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-4">
        Questions ({questions.length})
      </h2>

      <ol className="space-y-2">
        {questions.map((q, i) => (
          <li key={i} className="border border-stone-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-stone-50 transition-colors"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              <span
                className={`mt-0.5 flex-shrink-0 text-xs font-semibold border rounded px-1.5 py-0.5 ${DIFFICULTY_COLOURS[q.difficulty]}`}
              >
                {q.domain}
              </span>
              <span className="text-sm text-stone-800 flex-1">{q.question}</span>
              <span className="text-stone-400 text-xs mt-0.5 flex-shrink-0">
                {expandedIndex === i ? "▲" : "▼"}
              </span>
            </button>

            {expandedIndex === i && (
              <div className="px-4 pb-3 border-t border-stone-100 bg-stone-50">
                <p className="text-xs font-medium text-stone-400 mt-2 mb-1">Model answer</p>
                <p className="text-sm text-stone-600 leading-relaxed">{q.model_answer}</p>
                <p className="text-xs text-stone-400 mt-2">{q.domain_label}</p>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
