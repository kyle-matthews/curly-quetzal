import { useState } from "react";
import { useStore } from "../../store/readrightStore";
import { useAnalysis } from "../../hooks/useAnalysis";

export default function TextInputPanel() {
  const originalText = useStore((s) => s.originalText);
  const setOriginalText = useStore((s) => s.setOriginalText);
  const { analyse, isLoading, error } = useAnalysis();

  const [localText, setLocalText] = useState(originalText);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!localText.trim()) return;
    setOriginalText(localText);
    void analyse(localText);
  }

  return (
    <section className="card p-5">
      <h2 className="text-base font-semibold text-stone-700 mb-3">Paste your text</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          placeholder="Paste a passage here — up to 10,000 characters…"
          rows={8}
          className="input resize-none"
          maxLength={10000}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-400">{localText.length.toLocaleString()} / 10,000</span>
          <button type="submit" className="btn-primary" disabled={isLoading || !localText.trim()}>
            {isLoading ? "Analysing…" : "Analyse text"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
        )}
      </form>
    </section>
  );
}
