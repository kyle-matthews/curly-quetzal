import { useState } from "react";
import { useStore } from "../../store/readrightStore";
import { copyToClipboard } from "../../lib/copyToClipboard";

export default function ExportBar() {
  const originalText = useStore((s) => s.originalText);
  const analysisResult = useStore((s) => s.analysisResult);
  const rewrittenText = useStore((s) => s.rewrittenText);
  const rewrittenScores = useStore((s) => s.rewrittenScores);
  const questions = useStore((s) => s.questions);
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  async function handleCopy() {
    const parts = [
      "=== Original Text ===",
      originalText,
      rewrittenText ? "\n=== Rewritten Text ===" : "",
      rewrittenText,
      questions.length > 0 ? "\n=== Comprehension Questions ===" : "",
      ...questions.map((q, i) => `${i + 1}. [${q.domain}] ${q.question}\nModel answer: ${q.model_answer}`),
    ].filter(Boolean);

    await copyToClipboard(parts.join("\n\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handlePdf() {
    setPdfLoading(true);
    setPdfError(null);
    try {
      const response = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          original_text: originalText,
          analysis: analysisResult,
          rewritten_text: rewrittenText || null,
          rewritten_scores: rewrittenScores || null,
          questions: questions.length > 0 ? questions : null,
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "export.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError("PDF download failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-4 py-3 z-10">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        <span className="text-xs text-stone-400">Export your work</span>
        <div className="flex gap-2">
          {pdfError && (
            <span className="text-xs text-red-600">{pdfError}</span>
          )}
          <button onClick={() => void handleCopy()} className="btn-secondary text-xs">
            {copied ? "Copied!" : "Copy to clipboard"}
          </button>
          <button
            onClick={() => void handlePdf()}
            className="btn-primary text-xs"
            disabled={pdfLoading}
          >
            {pdfLoading ? "Generating PDF…" : "Download PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
