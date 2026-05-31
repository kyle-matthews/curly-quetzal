import { useStore } from "../../store/readrightStore";
import { useQuestions } from "../../hooks/useQuestions";
import type { Domain } from "../../types/api";

const DOMAINS: Array<{ id: Domain; label: string }> = [
  { id: "2a", label: "Word meaning (2a)" },
  { id: "2b", label: "Retrieve information (2b)" },
  { id: "2c", label: "Summarise ideas (2c)" },
  { id: "2d", label: "Make inferences (2d)" },
  { id: "2e", label: "Predict (2e)" },
  { id: "2f", label: "How content relates (2f)" },
  { id: "2g", label: "Word & phrase choices (2g)" },
];

export default function QuestionControls() {
  const selectedDomains = useStore((s) => s.selectedDomains);
  const toggleDomain = useStore((s) => s.toggleDomain);
  const { generateQuestions, isLoading, error } = useQuestions();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedDomains.length === 0) return;
    void generateQuestions();
  }

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-1">Comprehension questions</h2>
      <p className="text-sm text-stone-500 mb-4">
        Select the KS2 reading domains you want questions for.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DOMAINS.map(({ id, label }) => (
            <label
              key={id}
              className={`flex items-center gap-2 text-sm cursor-pointer rounded-lg px-3 py-2 border transition-colors ${
                selectedDomains.includes(id)
                  ? "bg-primary-50 border-primary-300 text-primary-800"
                  : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
              }`}
            >
              <input
                type="checkbox"
                checked={selectedDomains.includes(id)}
                onChange={() => toggleDomain(id)}
                className="accent-primary-600"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">
            {selectedDomains.length} domain{selectedDomains.length !== 1 ? "s" : ""} selected
          </span>
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || selectedDomains.length === 0}
          >
            {isLoading ? "Generating…" : "Generate questions"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
        )}
      </form>
    </section>
  );
}
