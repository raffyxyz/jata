import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Characters revealed per millisecond of *real* elapsed time. Progress is
 * derived from `Date.now()` instead of "one character per tick", so a timer
 * that the browser throttled in a background tab simply jumps ahead on its
 * next tick instead of stalling the animation.
 */
const MS_PER_CHARACTER = 12;
const TICK_INTERVAL_MS = 50;

export interface Typewriter {
  /** The text revealed so far. */
  content: string;
  /** True from the moment `run` starts until the document is fully revealed. */
  streaming: boolean;
  /**
   * Produces the full document text and reveals it.
   *
   * Resolves once the text is fully revealed — immediately when the tab is
   * hidden, since browsers throttle timers in background tabs. Rejects if
   * `produce` throws, leaving the output empty.
   */
  run: (produce: () => Promise<string>) => Promise<void>;
  /** Reveals the remaining text right away. */
  finish: () => void;
}

/**
 * Reveals a generated document character by character, without ever requiring
 * the tab to stay focused: generation completes in the background and the
 * finished document is shown as soon as the text arrives.
 */
export function useTypewriter(): Typewriter {
  const [content, setContent] = useState("");
  const [streaming, setStreaming] = useState(false);

  const fullTextRef = useRef("");
  const startedAtRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settledRef = useRef<(() => void) | null>(null);
  const streamingRef = useRef(false);

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finish = useCallback(() => {
    stopTimer();
    setContent(fullTextRef.current);
    setStreaming(false);
    streamingRef.current = false;

    const settle = settledRef.current;
    settledRef.current = null;
    settle?.();
  }, [stopTimer]);

  const run = useCallback(
    async (produce: () => Promise<string>) => {
      // Abandon any animation still in flight before starting over.
      stopTimer();
      const previous = settledRef.current;
      settledRef.current = null;
      previous?.();

      fullTextRef.current = "";
      setContent("");
      setStreaming(true);
      streamingRef.current = true;

      let text: string;
      try {
        text = await produce();
      } catch (err) {
        setStreaming(false);
        streamingRef.current = false;
        throw err;
      }

      fullTextRef.current = text;

      // Background tabs throttle timers to a crawl, so reveal everything at
      // once instead of waiting for ticks that may never come.
      if (typeof document !== "undefined" && document.visibilityState === "hidden") {
        setContent(text);
        setStreaming(false);
        streamingRef.current = false;
        return;
      }

      startedAtRef.current = Date.now();
      setContent("");

      await new Promise<void>((resolve) => {
        settledRef.current = resolve;

        const tick = () => {
          const elapsed = Date.now() - startedAtRef.current;
          const revealed = Math.min(
            fullTextRef.current.length,
            Math.floor(elapsed / MS_PER_CHARACTER),
          );

          if (revealed >= fullTextRef.current.length) {
            finish();
            return;
          }

          setContent(fullTextRef.current.slice(0, revealed));
          timerRef.current = setTimeout(tick, TICK_INTERVAL_MS);
        };

        timerRef.current = setTimeout(tick, TICK_INTERVAL_MS);
      });
    },
    [finish, stopTimer],
  );

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Finish the reveal as soon as the tab is hidden (or restored) so the
      // document is never left half-written by a throttled timer.
      if (streamingRef.current && fullTextRef.current) {
        finish();
      }
    };

    const handlePageHide = () => {
      // The page is going away (or entering the back/forward cache): reveal
      // whatever is left so a restored page never shows a half-written doc.
      if (streamingRef.current && fullTextRef.current) {
        finish();
      } else {
        stopTimer();
        const settle = settledRef.current;
        settledRef.current = null;
        settle?.();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      // Never leave a `run` promise pending after unmount.
      stopTimer();
      const settle = settledRef.current;
      settledRef.current = null;
      settle?.();
    };
  }, [finish, stopTimer]);

  return { content, streaming, run, finish };
}
