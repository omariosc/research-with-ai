"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Close } from "./Icons";

export type WorkshopTocEntry = {
  id: string;
  label: string;
};

type WorkshopTocProps = {
  activeStage: string;
  completed: number;
  entries: ReadonlyArray<WorkshopTocEntry>;
  percent: number;
  total: number;
  trackTitle: string;
};

export function WorkshopToc({
  activeStage,
  completed,
  entries,
  percent,
  total,
  trackTitle,
}: WorkshopTocProps) {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(entries[0]?.id ?? "overview");

  useEffect(() => {
    const targets = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((target): target is HTMLElement => Boolean(target));
    if (targets.length === 0) return;

    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (observations) => {
        for (const observation of observations) {
          if (observation.isIntersecting) {
            visible.set(
              observation.target.id,
              Math.abs(observation.boundingClientRect.top),
            );
          } else {
            visible.delete(observation.target.id);
          }
        }

        if (visible.size > 0) {
          const next = [...visible.entries()].sort(
            (left, right) => left[1] - right[1],
          )[0]?.[0];
          if (next) setActiveId(next);
        }
      },
      {
        rootMargin: "-18% 0px -68% 0px",
        threshold: [0, 0.05, 0.4],
      },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [entries]);

  useEffect(() => {
    function closeWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
    }
    document.addEventListener("keydown", closeWithEscape);
    return () => document.removeEventListener("keydown", closeWithEscape);
  }, [open]);

  function followAnchor(id: string) {
    setActiveId(id);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
    setOpen(false);
  }

  return (
    <aside className={`workshop-toc${open ? " is-open" : ""}`}>
      <button
        aria-controls="workshop-toc-panel"
        aria-expanded={open}
        aria-label={open ? "Collapse page contents" : "Open page contents"}
        className="workshop-toc-handle"
        onClick={() => setOpen((value) => !value)}
        type="button"
      >
        {open ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
        <span>{percent}%</span>
      </button>
      <nav
        aria-label="On this workshop page"
        className="workshop-toc-panel"
        hidden={!open}
        id="workshop-toc-panel"
      >
        <header>
          <div>
            <span>On this page</span>
            <strong>{completed} of {total} track stages complete</strong>
          </div>
          <button
            aria-label="Collapse page contents"
            onClick={() => setOpen(false)}
            type="button"
          >
            <Close size={18} />
          </button>
        </header>
        <div className="workshop-toc-progress">
          <div
            aria-label={`${percent} percent complete on ${trackTitle}`}
            aria-valuemax={100}
            aria-valuemin={0}
            aria-valuenow={percent}
            role="progressbar"
          >
            <span style={{ width: `${percent}%` }} />
          </div>
          <small>{trackTitle}</small>
        </div>
        <ol>
          {entries.map((entry, index) => (
            <li key={entry.id}>
              <a
                aria-current={activeId === entry.id ? "location" : undefined}
                href={`#${entry.id}`}
                onClick={(event) => {
                  event.preventDefault();
                  followAnchor(entry.id);
                }}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {entry.label}
              </a>
            </li>
          ))}
        </ol>
        <footer>
          <span>Current stage</span>
          <strong>{activeStage}</strong>
        </footer>
      </nav>
    </aside>
  );
}
