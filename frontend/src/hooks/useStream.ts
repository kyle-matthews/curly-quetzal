import { useRef } from "react";

interface StreamCallbacks<TDone> {
  onChunk: (chunk: string) => void;
  onDone: (payload: TDone) => void;
  onError: (message: string) => void;
}

export function useStream<TDone>() {
  const abortRef = useRef<AbortController | null>(null);

  async function startStream(
    url: string,
    body: unknown,
    callbacks: StreamCallbacks<TDone>
  ) {
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: abortRef.current.signal,
      });
    } catch {
      callbacks.onError("Connection failed. Please try again.");
      return;
    }

    if (!response.ok || !response.body) {
      callbacks.onError(`Server error (HTTP ${response.status})`);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (!json) continue;

          let parsed: Record<string, unknown>;
          try {
            parsed = JSON.parse(json);
          } catch {
            continue;
          }

          if (parsed.event === "done") {
            callbacks.onDone(parsed as TDone);
          } else if (parsed.event === "error") {
            callbacks.onError((parsed.message as string) || "Stream error");
            return;
          } else if (typeof parsed.chunk === "string") {
            callbacks.onChunk(parsed.chunk);
          }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      callbacks.onError("Stream interrupted. Please try again.");
    }
  }

  function cancel() {
    abortRef.current?.abort();
  }

  return { startStream, cancel };
}
