"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { personal } from "@/data/personal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { playStartupChime, preloadStartupChime } from "@/lib/sound";
import { useDesktopPrefs } from "@/lib/theme";
import { Avatar } from "@/components/portfolio/Avatar";
import { RetroButton } from "@/components/ui/RetroButton";
import { SpeakerIcon } from "@/components/ui/icons";

const STARTUP_MS = 620;

/**
 * The startup screen. Deliberately a single click or keypress away from the
 * desktop, it sets the tone without standing between a recruiter and the
 * content. Not a real credential prompt: there is no password field, because
 * a portfolio has nothing to authenticate.
 */
export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [starting, setStarting] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const { soundOn, toggleSound } = useDesktopPrefs();
  const busy = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const login = useCallback(() => {
    if (busy.current) return;
    busy.current = true;

    // Logging in is a real user gesture, which is both what browsers require
    // before playing audio and the only decent moment to make a noise.
    if (soundOn) playStartupChime();

    // The startup beat is pure flavour; skip it when motion is unwelcome.
    if (reduceMotion) {
      onLogin();
      return;
    }
    setStarting(true);
    // A plain timeout, not an animation callback: a throttled or hidden tab
    // still gets here, so nobody can be stranded on the login screen.
    setTimeout(onLogin, STARTUP_MS);
  }, [reduceMotion, soundOn, onLogin]);

  useEffect(() => {
    buttonRef.current?.focus();
    if (soundOn) preloadStartupChime();
  }, [soundOn]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Escape") return;
      e.preventDefault();
      login();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [login]);

  return (
    <div className="relative h-dvh w-full overflow-hidden">
      <span aria-hidden className="desk-wall" />

      {/* The panel scrolls rather than being clipped on short viewports:
          a phone in landscape is shorter than the dialog is tall. */}
      <div className="relative flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6">
        <section
          aria-label="Startup"
          className="surface-raised relative w-full max-w-[340px] bg-[var(--chrome)] shadow-[var(--shadow-window)]"
        >
          {/* A classic dialog bar, without any window controls. */}
          <div className="relative flex h-[26px] items-center justify-center border-b border-[var(--hairline)] px-2">
            <span
              aria-hidden
              className="titlebar-stripes pointer-events-none absolute inset-x-2 top-[6px] bottom-[6px] opacity-70"
            />
            <h2 className="label-micro relative bg-[var(--chrome)] px-2 text-[11px] leading-none text-[var(--ink)]">
              Welcome
            </h2>
          </div>

          <div className="flex flex-col items-center bg-[var(--surface)] px-6 py-7 text-center">
            <Avatar className="mb-4" />

            <p className="font-[family-name:var(--font-display)] text-[22px] leading-none font-bold tracking-tight text-[var(--ink)]">
              {personal.name}
            </p>
            <p className="mt-1.5 text-[13px] font-semibold text-[var(--accent)]">
              {personal.title}
            </p>
            <p className="label-micro mt-2 text-[9px] leading-relaxed tracking-wide text-[var(--ink-faint)]">
              {personal.disciplines.join("  •  ")}
            </p>

            <div className="mt-6 h-[62px] w-full">
              {starting ? (
                <div>
                  <div
                    className="surface-inset h-[14px] w-full overflow-hidden bg-[var(--surface-sunken)]"
                    role="progressbar"
                    aria-label="Starting up"
                  >
                    <span className="login-progress block h-full bg-[var(--accent)]" />
                  </div>
                  <p
                    className="label-micro mt-2.5 text-[9px] tracking-wide text-[var(--ink-soft)]"
                    role="status"
                  >
                    Starting up…
                  </p>
                </div>
              ) : (
                <>
                  <RetroButton
                    ref={buttonRef}
                    variant="primary"
                    className="w-full"
                    onClick={login}
                  >
                    Log In
                  </RetroButton>
                  <p className="mt-2.5 text-[11px] text-[var(--ink-faint)]">
                    or press Enter to continue
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[var(--hairline)] px-2 py-1">
            <span className="label-micro text-[9px] tracking-wide text-[var(--ink-soft)]">
              PortfolioOS 1.0
            </span>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={soundOn}
              aria-label={
                soundOn ? "Mute the startup sound" : "Unmute the startup sound"
              }
              title={soundOn ? "Startup sound on" : "Startup sound muted"}
              className="grid h-[20px] w-[20px] place-items-center text-[var(--ink-soft)] hover:bg-black/8 hover:text-[var(--ink)]"
            >
              <SpeakerIcon size={13} muted={!soundOn} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
