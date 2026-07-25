"use client";

import Link from "next/link";
import { useState } from "react";
import type { WorkshopSlug } from "@/lib/types";
import { ArrowRight, Close, Menu } from "./Icons";

const workshops: Array<{
  href: string;
  number: string;
  title: string;
  slug: WorkshopSlug;
}> = [
  {
    href: "/agentic-research",
    number: "1",
    title: "Agentic research",
    slug: "agentic-research",
  },
  {
    href: "/interactive-paper",
    number: "2",
    title: "Interactive papers",
    slug: "interactive-paper",
  },
  {
    href: "/annotation-tools",
    number: "3",
    title: "Annotation tools",
    slug: "annotation-tools",
  },
];

export function SiteNav({ active }: { active?: WorkshopSlug | "home" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="mobile-header">
        <Link className="mobile-brand" href="/">
          Research with AI
        </Link>
        <button
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="mobile-menu-button"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <Close /> : <Menu />}
        </button>
      </header>
      <aside className={`site-nav ${open ? "is-open" : ""}`}>
        <div className="nav-brand">
          <Link href="/" onClick={() => setOpen(false)}>
            <strong>Research with AI</strong>
            <span>by Omar Choudhry</span>
          </Link>
          <p>Practical workshops for medical imaging researchers.</p>
        </div>
        <nav aria-label="Primary">
          <Link
            aria-current={active === "home" ? "page" : undefined}
            className={`nav-home ${active === "home" ? "is-active" : ""}`}
            href="/"
            onClick={() => setOpen(false)}
          >
            Overview
          </Link>
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
          <span>Progress stays here</span>
          <p>
            Checklists and drafts are stored in this browser. No analytics or
            tracking cookies.
          </p>
        </div>
        <div className="nav-footer">
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
