import { useEffect } from "react";

const BLINK_INTERVAL_MS = 900;
const DEFAULT_MESSAGE = "📄 Document ready";
/** B5 and E6 — a soft two-note chime instead of a harsh beep. */
const CHIME_NOTES_HZ = [987.77, 1318.51];
const CHIME_GAP_SECONDS = 0.12;

// Module-level so a blink survives the component that started it unmounting
// (the title must be restored even if the page navigates away).
let originalTitle: string | null = null;
let blinkMessage: string | null = null;
let blinkTimer: ReturnType<typeof setInterval> | null = null;
let audioContext: AudioContext | null = null;

function stopBlinking(): void {
  if (blinkTimer !== null) {
    clearInterval(blinkTimer);
    blinkTimer = null;
  }

  if (originalTitle !== null) {
    // Only restore when the title is still ours — the app may have set a new
    // one after a client-side navigation while we were blinking.
    if (document.title === blinkMessage || document.title === originalTitle) {
      document.title = originalTitle;
    }
    originalTitle = null;
    blinkMessage = null;
  }

  document.removeEventListener("visibilitychange", stopWhenVisible);
  window.removeEventListener("focus", stopWhenVisible);
}

function stopWhenVisible(): void {
  if (document.visibilityState === "visible") stopBlinking();
}

function startBlinking(message: string): void {
  stopBlinking();

  const baseTitle = document.title;
  originalTitle = baseTitle;
  blinkMessage = message;
  document.title = message;

  let showingMessage = true;
  blinkTimer = setInterval(() => {
    showingMessage = !showingMessage;
    document.title = showingMessage ? message : baseTitle;
  }, BLINK_INTERVAL_MS);

  document.addEventListener("visibilitychange", stopWhenVisible);
  window.addEventListener("focus", stopWhenVisible);
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  const AudioContextCtor =
    window.AudioContext ??
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) return null;

  if (!audioContext) {
    try {
      audioContext = new AudioContextCtor();
    } catch {
      return null;
    }
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume().catch(() => undefined);
  }

  return audioContext;
}

function playChime(): void {
  const context = getAudioContext();
  if (!context) return;

  const schedule = () => {
    if (context.state !== "running") return;

    const firstNoteAt = context.currentTime;
    CHIME_NOTES_HZ.forEach((frequency, index) => {
      const noteAt = firstNoteAt + index * CHIME_GAP_SECONDS;
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, noteAt);
      gain.gain.exponentialRampToValueAtTime(0.12, noteAt + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteAt + 0.3);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(noteAt);
      oscillator.stop(noteAt + 0.35);
    });
  };

  if (context.state === "running") {
    schedule();
  } else {
    // Browsers only start audio after a user gesture; resume and then play.
    void context
      .resume()
      .then(schedule)
      .catch(() => undefined);
  }
}

/**
 * Flashes the browser tab title (and plays a soft chime) to signal that
 * something finished while the user was on another tab — the same trick
 * Messenger and WhatsApp Web use.
 *
 * Does nothing when this tab is already visible and focused, so the user is
 * never alerted about something they are already looking at.
 */
export function notifyTab(message: string = DEFAULT_MESSAGE): void {
  if (typeof document === "undefined") return;

  const isLookingAtThisTab =
    document.visibilityState === "visible" && document.hasFocus();
  if (isLookingAtThisTab) return;

  startBlinking(message);
  playChime();
}

/**
 * Returns {@link notifyTab}, priming the audio context on the first user
 * interaction so the chime is allowed to play when it is due.
 */
export function useTitleAlert(): (message?: string) => void {
  useEffect(() => {
    const unlock = () => {
      getAudioContext();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return notifyTab;
}
