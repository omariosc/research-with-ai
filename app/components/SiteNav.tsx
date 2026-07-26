"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { WorkshopSlug } from "@/lib/types";
import {
  TUTORIAL_HOMEPAGE,
  TUTORIAL_VERSION_LABEL,
  WORKSHOP_RELEASES,
} from "@/lib/version";
import { ArrowRight, Close, Menu } from "./Icons";
import { ThemeToggle } from "./ThemeToggle";

const workshops: Array<{
  href: string;
  number: string;
  title: string;
  slug: WorkshopSlug;
}> = [
  {
    href: WORKSHOP_RELEASES["agentic-research"].canonicalUrl,
    number: "1",
    title: "Agentic research",
    slug: "agentic-research",
  },
  {
    href: WORKSHOP_RELEASES["interactive-paper"].canonicalUrl,
    number: "2",
    title: "Interactive papers",
    slug: "interactive-paper",
  },
  {
    href: WORKSHOP_RELEASES["annotation-tools"].canonicalUrl,
    number: "3",
    title: "Annotation tools",
    slug: "annotation-tools",
  },
];

export function SiteNav({
  active,
}: {
  active?: WorkshopSlug | "home" | "versions" | "about";
}) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 900px)");

    function closeDrawerOnDesktop(event: MediaQueryListEvent) {
      if (!event.matches) {
        wasOpenRef.current = false;
        setOpen(false);
      }
    }

    mobileViewport.addEventListener("change", closeDrawerOnDesktop);
    return () =>
      mobileViewport.removeEventListener("change", closeDrawerOnDesktop);
  }, []);

  useEffect(() => {
    if (wasOpenRef.current && !open) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
    wasOpenRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const nav = navRef.current;
    const background = Array.from(
      document.querySelectorAll<HTMLElement>(
        "#main-content, .mobile-header, .privacy-note",
      ),
    );
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const focusable = nav?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const items = focusable ? Array.from(focusable) : [];
    items[0]?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="mobile-header">
        <a className="mobile-brand" href={TUTORIAL_HOMEPAGE}>
          Research with AI
        </a>
        <div className="mobile-header-actions">
          <ThemeToggle compact />
          <button
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="mobile-menu-button"
            onClick={() => setOpen((value) => !value)}
            ref={menuButtonRef}
            type="button"
          >
            {open ? <Close /> : <Menu />}
          </button>
        </div>
      </header>
      <aside
        aria-label="Site navigation"
        aria-modal={open ? "true" : undefined}
        className={`site-nav ${open ? "is-open" : ""}`}
        ref={navRef}
        role={open ? "dialog" : undefined}
      >
        <button
          aria-label="Close navigation"
          className="nav-dialog-close"
          onClick={() => setOpen(false)}
          type="button"
        >
          <Close />
        </button>
        <div className="nav-brand">
          <a href={TUTORIAL_HOMEPAGE} onClick={() => setOpen(false)}>
            <strong>Research with AI</strong>
            <span>by Omar Choudhry</span>
          </a>
          <p>Practical workshops for medical imaging researchers.</p>
        </div>
        <nav aria-label="Primary">
          <a
            aria-current={active === "home" ? "page" : undefined}
            className={`nav-home ${active === "home" ? "is-active" : ""}`}
            href={TUTORIAL_HOMEPAGE}
            onClick={() => setOpen(false)}
          >
            Overview
          </a>
          <p className="nav-label">Workshops</p>
          <ol className="workshop-nav-list">
            {workshops.map((workshop) => (
              <li key={workshop.slug}>
                <Link
                  aria-current={active === workshop.slug ? "page" : undefined}
                  className={`nav-workshop nav-${workshop.slug} ${
                    active === workshop.slug ? "is-active" : ""
                  }`}
                  href={workshop.href}
                  onClick={() => setOpen(false)}
                >
                  <span>{workshop.number}</span>
                  {workshop.title}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
        <div className="nav-note">
          <span>Local, not encrypted</span>
          <p>
            Checklists and drafts use browser storage. Never enter patient data,
            secrets, or sensitive research details.
          </p>
        </div>
        <ThemeToggle />
        <div className="nav-footer">
          <a
            aria-current={active === "about" ? "page" : undefined}
            className={active === "about" ? "is-active" : ""}
            href={`${TUTORIAL_HOMEPAGE}/about`}
            onClick={() => setOpen(false)}
          >
            Methods &amp; privacy
            <ArrowRight size={15} />
          </a>
          <a
            aria-current={active === "versions" ? "page" : undefined}
            className={active === "versions" ? "is-active" : ""}
            href={`${TUTORIAL_HOMEPAGE}/versions`}
            onClick={() => setOpen(false)}
          >
            Tutorial {TUTORIAL_VERSION_LABEL}
            <ArrowRight size={15} />
          </a>
          <a href="https://github.com/omariosc" rel="noreferrer" target="_blank">
            GitHub
            <ArrowRight size={15} />
          </a>
          <a
            href="https://miccai-sb.github.io/challenge"
            rel="noreferrer"
            target="_blank"
          >
            MICCAI MEC 2026
            <ArrowRight size={15} />
          </a>
        </div>
      </aside>
      {open ? (
        <button
          aria-label="Close navigation"
          className="nav-scrim"
          onClick={() => setOpen(false)}
          type="button"
        />
      ) : null}
    </>
  );
}
