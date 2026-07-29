"use client";

import { useMemo, useState } from "react";
import { SiteFooter } from "@/app/components/HomeClient";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
} from "@/app/components/Icons";
import { SiteNav } from "@/app/components/SiteNav";
import type {
  BtpnExplorer,
  HtlBenchmarkRow,
  HtlExplorer,
  LaskExplorer,
  PaperDemo,
} from "@/lib/paper-demos";
import {
  INTERACTIVE_PAPER_ORIGIN,
  paperDemoList,
  paperDemoPath,
} from "@/lib/paper-demos";
import styles from "./PaperDemoPage.module.css";

function PaperNativeRecord({ demo }: { demo: PaperDemo }) {
  const record = demo.nativeAssets;
  if (!record) return null;

  const paperFigures = record.figures ?? [];

  return (
    <section
      aria-labelledby="paper-record-title"
      className={`${styles.section} ${styles.nativeRecord}`}
      id="paper-record"
    >
      <div className={styles.sectionHeading}>
        <p>Original paper</p>
        <h2 id="paper-record-title">
          Start with what the authors actually published
        </h2>
        <span>
          This record keeps the paper&apos;s abstract, section order, figures,
          captions, and tables together. The interactive material later on
          helps you examine the reported evidence, but it is not a substitute
          for the paper.
        </span>
      </div>

      {record.abstractText ? (
        <article className={styles.paperAbstract}>
          <div>
            <span>Abstract</span>
            <strong>From the paper</strong>
          </div>
          <p>{record.abstractText}</p>
        </article>
      ) : null}

      {record.sections?.length ? (
        <div className={styles.paperOutline}>
          <header>
            <span>Paper structure</span>
            <strong>
              Paper headings, with a short tutorial guide beneath each
            </strong>
          </header>
          <ol>
            {record.sections.map((section) => (
              <li key={`${section.number}-${section.title}`}>
                <span>{section.number}</span>
                <div>
                  <strong>{section.title}</strong>
                  <p>{section.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      {paperFigures.length ? (
        <div className={styles.nativeAssetGroup}>
          <header>
            <span>Figures from the paper</span>
            <strong>Captions and source details remain attached</strong>
          </header>
          <div className={styles.nativeFigureGrid}>
            {paperFigures.map((figure) => (
              <figure key={figure.src}>
                <a
                  aria-label={`Open ${figure.caption} at full resolution`}
                  className={styles.nativeAssetMedia}
                  href={figure.src}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt={figure.alt}
                    height={figure.height}
                    loading="lazy"
                    src={figure.src}
                    width={figure.width}
                  />
                </a>
                <figcaption>
                  <strong>{figure.caption}</strong>
                  <span>{figure.credit}</span>
                  <a
                    href={figure.src}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open full-size figure
                    <ExternalLink size={13} />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}

      {record.tables?.length ? (
        <div className={styles.nativeAssetGroup}>
          <header>
            <span>Tables from the paper</span>
            <strong>Tables with their original captions and source details</strong>
          </header>
          <div className={styles.nativeTableGrid}>
            {record.tables.map((table) => (
              <figure key={table.src}>
                <a
                  aria-label={`Open ${table.label} at full resolution`}
                  className={styles.nativeAssetMedia}
                  href={table.src}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt={table.alt}
                    height={table.height}
                    loading="lazy"
                    src={table.src}
                    width={table.width}
                  />
                </a>
                <figcaption>
                  <span>{table.label}</span>
                  <strong>{table.caption}</strong>
                  <p>{table.sourceNote}</p>
                  <a href={table.src} rel="noreferrer" target="_blank">
                    Open full-size table
                    <ExternalLink size={13} />
                  </a>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ClaimStates({ demo }: { demo: PaperDemo }) {
  return (
    <section
      aria-labelledby="claim-boundaries-title"
      className={styles.section}
      id="claim-boundaries"
    >
      <div className={styles.sectionHeading}>
        <p>Claim boundaries</p>
        <h2 id="claim-boundaries-title">
          What the evidence says, and what this page does
        </h2>
      </div>
      <div className={styles.claimGrid}>
        {demo.claimStates.map((claim) => (
          <article
            className={`${styles.claimCard} ${styles[claim.state]}`}
            key={claim.label}
          >
            <span>{claim.label}</span>
            <h3>{claim.title}</h3>
            <p>{claim.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

type HtlView = "main" | "jetson";
type HtlMetric = "map5095" | "fps";

function rowValue(row: HtlBenchmarkRow, metric: HtlMetric) {
  return metric === "map5095" ? row.map5095 : row.fps;
}

function HtlComparison({ explorer }: { explorer: HtlExplorer }) {
  const [view, setView] = useState<HtlView>("main");
  const [metric, setMetric] = useState<HtlMetric>("map5095");
  const rows = useMemo(
    () =>
      explorer.rows.filter((row) =>
        view === "main"
          ? row.source.startsWith("Table 3")
          : row.source.startsWith("Table 5"),
      ),
    [explorer.rows, view],
  );
  const maximum = Math.max(...rows.map((row) => rowValue(row, metric)));

  return (
    <div className={styles.explorerPanel}>
      <div className={styles.controlRow}>
        <fieldset>
          <legend>Evidence view</legend>
          <div className={styles.segmentedControl}>
            <button
              aria-pressed={view === "main"}
              onClick={() => setView("main")}
              type="button"
            >
              Main test benchmark
            </button>
            <button
              aria-pressed={view === "jetson"}
              onClick={() => setView("jetson")}
              type="button"
            >
              Jetson FP16
            </button>
          </div>
        </fieldset>
        <fieldset>
          <legend>Bar scale</legend>
          <div className={styles.segmentedControl}>
            <button
              aria-pressed={metric === "map5095"}
              onClick={() => setMetric("map5095")}
              type="button"
            >
              mAP50-95
            </button>
            <button
              aria-pressed={metric === "fps"}
              onClick={() => setMetric("fps")}
              type="button"
            >
              FPS
            </button>
          </div>
        </fieldset>
      </div>

      <div
        aria-label={`Selected ${metric === "fps" ? "frames per second" : "mAP50-95"} comparison`}
        className={styles.benchmarkRows}
      >
        {rows.map((row) => {
          const value = rowValue(row, metric);
          return (
            <article className={styles.benchmarkRow} key={`${row.source}-${row.model}`}>
              <div className={styles.benchmarkIdentity}>
                <strong>{row.model}</strong>
                <span>{row.source}</span>
              </div>
              <div className={styles.barCell}>
                <div
                  aria-hidden="true"
                  className={styles.metricBar}
                  style={{ "--bar-width": `${(value / maximum) * 100}%` } as React.CSSProperties}
                >
                  <i />
                </div>
                <strong>
                  {value}
                  {metric === "fps" ? " FPS" : "%"}
                </strong>
              </div>
              <dl className={styles.compactMetrics}>
                <div>
                  <dt>Latency</dt>
                  <dd>{row.latencyMs} ms</dd>
                </div>
                <div>
                  <dt>mAP50</dt>
                  <dd>{row.map50}%</dd>
                </div>
                <div>
                  <dt>mAP50-95</dt>
                  <dd>{row.map5095}%</dd>
                </div>
              </dl>
              <p>{row.note}</p>
            </article>
          );
        })}
      </div>

      {view === "jetson" ? (
        <aside className={styles.sourceMismatch} aria-label="Source discrepancy">
          <strong>Source discrepancy kept visible</strong>
          <p>
            The abstract says YOLOv11-N reached 3.1 ms and about 322.6 FPS.
            Table 5 gives that pair to YOLOv8-N and prints 3.2 ms and 312.5
            FPS for YOLOv11-N. The table values above are transcribed without
            silently resolving the conflict.
          </p>
        </aside>
      ) : null}
    </div>
  );
}

function LaskDenominatorExplorer({ explorer }: { explorer: LaskExplorer }) {
  const [selectedId, setSelectedId] =
    useState<LaskExplorer["snapshots"][number]["id"]>("manuscript");
  const selected =
    explorer.snapshots.find((snapshot) => snapshot.id === selectedId) ??
    explorer.snapshots[0];

  return (
    <div className={styles.explorerPanel}>
      <div
        aria-label="LASK evidence snapshot"
        className={styles.snapshotTabs}
        role="tablist"
      >
        {explorer.snapshots.map((snapshot) => (
          <button
            aria-controls={`snapshot-panel-${snapshot.id}`}
            aria-selected={selected.id === snapshot.id}
            id={`snapshot-tab-${snapshot.id}`}
            key={snapshot.id}
            onClick={() => setSelectedId(snapshot.id)}
            role="tab"
            type="button"
          >
            <span>{snapshot.date}</span>
            <strong>{snapshot.label}</strong>
            <small>{snapshot.trials} trials</small>
          </button>
        ))}
      </div>

      <article
        aria-labelledby={`snapshot-tab-${selected.id}`}
        className={styles.snapshotPanel}
        id={`snapshot-panel-${selected.id}`}
        role="tabpanel"
      >
        <div className={styles.snapshotLead}>
          <span>{selected.date}</span>
          <strong>{selected.trials}</strong>
          <p>trials in this evidence snapshot</p>
        </div>
        <dl className={styles.snapshotDetails}>
          <div>
            <dt>Frames</dt>
            <dd>{selected.frames}</dd>
          </div>
          <div>
            <dt>Annotations</dt>
            <dd>{selected.annotations}</dd>
          </div>
          <div>
            <dt>Access state</dt>
            <dd>{selected.access}</dd>
          </div>
        </dl>
        <div className={styles.snapshotExplanation}>
          <p>{selected.detail}</p>
          {selected.href && selected.hrefLabel ? (
            <a href={selected.href} rel="noreferrer" target="_blank">
              {selected.hrefLabel}
              <ExternalLink size={15} />
            </a>
          ) : (
            <span>Not offered as a public download</span>
          )}
        </div>
      </article>

      <aside className={styles.denominatorRule}>
        <strong>Reading rule</strong>
        <p>
          Choose the snapshot that matches the claim. A manuscript cohort,
          analysis inventory, and staged public release can all be correct
          while referring to different collections.
        </p>
      </aside>
    </div>
  );
}

function BtpnMethodExplorer({ explorer }: { explorer: BtpnExplorer }) {
  const [methodId, setMethodId] =
    useState<BtpnExplorer["methods"][number]["id"]>("vision");
  const [metricId, setMetricId] =
    useState<BtpnExplorer["metricGroups"][number]["id"]>("visual");
  const method =
    explorer.methods.find((entry) => entry.id === methodId) ??
    explorer.methods[0];
  const metricGroup =
    explorer.metricGroups.find((entry) => entry.id === metricId) ??
    explorer.metricGroups[0];

  return (
    <div className={styles.explorerPanel}>
      <div className={styles.btpnExplorerGrid}>
        <div>
          <p className={styles.controlLabel}>Method path</p>
          <div
            aria-label="BTPN method subsystem"
            className={styles.verticalTabs}
            role="tablist"
          >
            {explorer.methods.map((entry, index) => (
              <button
                aria-controls={`method-panel-${entry.id}`}
                aria-selected={method.id === entry.id}
                id={`method-tab-${entry.id}`}
                key={entry.id}
                onClick={() => setMethodId(entry.id)}
                role="tab"
                type="button"
              >
                <span>0{index + 1}</span>
                <strong>{entry.label}</strong>
              </button>
            ))}
          </div>
        </div>
        <article
          aria-labelledby={`method-tab-${method.id}`}
          className={styles.methodPanel}
          id={`method-panel-${method.id}`}
          role="tabpanel"
        >
          <span>{method.label}</span>
          <h3>{method.title}</h3>
          <p>{method.body}</p>
          <aside>
            <strong>Evidence in the accepted manuscript</strong>
            <p>{method.evidence}</p>
          </aside>
        </article>
      </div>

      <div className={styles.metricExplorer}>
        <div className={styles.metricExplorerHead}>
          <div>
            <p>Reported results</p>
            <h3>Keep unlike evaluations in separate groups</h3>
          </div>
          <div
            aria-label="BTPN metric group"
            className={styles.segmentedControl}
            role="tablist"
          >
            {explorer.metricGroups.map((group) => (
              <button
                aria-controls={`metric-panel-${group.id}`}
                aria-selected={metricGroup.id === group.id}
                id={`metric-tab-${group.id}`}
                key={group.id}
                onClick={() => setMetricId(group.id)}
                role="tab"
                type="button"
              >
                {group.label}
              </button>
            ))}
          </div>
        </div>
        <div
          aria-labelledby={`metric-tab-${metricGroup.id}`}
          className={styles.metricPanel}
          id={`metric-panel-${metricGroup.id}`}
          role="tabpanel"
        >
          <p>{metricGroup.scope}</p>
          <dl>
            {metricGroup.metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`}>
                <dd>{metric.value}</dd>
                <dt>{metric.label}</dt>
                <span>{metric.context}</span>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

function PaperExplorerView({ demo }: { demo: PaperDemo }) {
  const explorer = demo.explorer;
  if (explorer.kind === "htl") {
    return <HtlComparison explorer={explorer} />;
  }
  if (explorer.kind === "lask") {
    return <LaskDenominatorExplorer explorer={explorer} />;
  }
  return <BtpnMethodExplorer explorer={explorer} />;
}

function PaperNavigation({ demo }: { demo: PaperDemo }) {
  const currentIndex = paperDemoList.findIndex(
    (candidate) => candidate.slug === demo.slug,
  );
  const previous =
    paperDemoList[
      (currentIndex - 1 + paperDemoList.length) % paperDemoList.length
    ];
  const next = paperDemoList[(currentIndex + 1) % paperDemoList.length];

  return (
    <nav aria-label="Paper companion pages" className={styles.paperNavigation}>
      <a href={paperDemoPath(previous.slug)}>
        <ArrowLeft size={17} />
        <span>
          <small>Previous companion</small>
          <strong>{previous.shortTitle}</strong>
        </span>
      </a>
      <a href={paperDemoPath(next.slug)}>
        <span>
          <small>Next companion</small>
          <strong>{next.shortTitle}</strong>
        </span>
        <ArrowRight size={17} />
      </a>
    </nav>
  );
}

export function PaperDemoPage({ demo }: { demo: PaperDemo }) {
  const [copied, setCopied] = useState(false);
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: `${demo.shortTitle}: interactive paper companion`,
    headline: demo.title,
    description: demo.description,
    url: `${INTERACTIVE_PAPER_ORIGIN}${paperDemoPath(demo.slug)}`,
    author: demo.authors.map((name) => ({
      "@type": "Person",
      name,
    })),
    citation: demo.citation,
    image: `${INTERACTIVE_PAPER_ORIGIN}${demo.figure.src}`,
    learningResourceType: "Interactive paper companion",
    inLanguage: "en-GB",
    isAccessibleForFree: true,
  }).replaceAll("<", "\\u003c");

  async function copyCitation() {
    try {
      await navigator.clipboard.writeText(demo.citation);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={`site-frame ${styles.frame}`}>
      <script
        dangerouslySetInnerHTML={{ __html: structuredData }}
        type="application/ld+json"
      />
      <SiteNav active="interactive-paper" />
      <main className={styles.main} id="main-content">
        <header className={styles.hero} id="overview">
          <a
            className={styles.breadcrumb}
            href={`${INTERACTIVE_PAPER_ORIGIN}/#live-paper-demos`}
          >
            <ArrowLeft size={16} />
            Interactive paper workshop
          </a>
          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p>Interactive paper · built from the original source</p>
              <h1>{demo.title}</h1>
              <div className={styles.authorLine}>
                {demo.authors.map((author) => (
                  <span key={author}>{author}</span>
                ))}
              </div>
            </div>
            <div className={styles.heroPaper}>
              <figure className={styles.heroFigure}>
                <a
                  aria-label={`Open ${demo.figure.caption} at full resolution`}
                  className={styles.heroFigureMedia}
                  href={demo.figure.src}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    alt={demo.figure.alt}
                    height={demo.figure.height}
                    src={demo.figure.src}
                    width={demo.figure.width}
                  />
                </a>
                <figcaption>
                  <span>From the paper</span>
                  <strong>{demo.figure.caption}</strong>
                  <a
                    className={styles.fullSizeLink}
                    href={demo.figure.src}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open full-size figure
                    <ExternalLink size={13} />
                  </a>
                </figcaption>
              </figure>
              <aside className={styles.paperIdentity}>
                <span>Publication record</span>
                <strong>{demo.venue}</strong>
                <p>{demo.status}</p>
                <dl>
                  <div>
                    <dt>Source material</dt>
                    <dd>
                      {demo.nativeAssets?.tables?.length
                        ? "Paper abstract, figures, tables, captions, and public records"
                        : "Paper abstract, figures, captions, and public records"}
                    </dd>
                  </div>
                  <div>
                    <dt>Interactive layer</dt>
                    <dd>Rearranges reported evidence only</dd>
                  </div>
                  <div>
                    <dt>Source checked</dt>
                    <dd>29 July 2026</dd>
                  </div>
                </dl>
              </aside>
            </div>
            <div className={styles.heroSummary}>
              <p className={styles.heroDescription}>{demo.description}</p>
              <div className={styles.heroActions}>
                {demo.links.map((link, index) => (
                  <a
                    className={
                      index === 0
                        ? styles.primaryAction
                        : styles.secondaryAction
                    }
                    href={link.href}
                    key={link.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>
                      {link.label}
                      {link.note ? <small>{link.note}</small> : null}
                    </span>
                    <ExternalLink size={17} />
                  </a>
                ))}
                {demo.paperLinkPending ? (
                  <span className={styles.pendingAction}>
                    <span>
                      Paper link coming soon
                      <small>Official MICCAI proceedings URL pending</small>
                    </span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <nav aria-label="On this page" className={styles.onPage}>
          <span>On this page</span>
          {demo.nativeAssets ? <a href="#paper-record">Original paper</a> : null}
          <a href="#paper-reading">Plain-language reading</a>
          <a href="#claim-boundaries">Claim map</a>
          <a href="#numbers">Reported numbers</a>
          <a href="#interactive-explorer">Tables and explorer</a>
          <a href="#limits">Limits and citation</a>
        </nav>

        <PaperNativeRecord demo={demo} />

        <section
          aria-labelledby="plain-language-title"
          className={`${styles.section} ${styles.plainLanguage}`}
          id="paper-reading"
        >
          <div>
            <p>Plain-language reading</p>
            <h2 id="plain-language-title">What question did the paper ask?</h2>
          </div>
          <p>{demo.plainLanguage}</p>
        </section>

        <ClaimStates demo={demo} />

        <section
          aria-labelledby="numbers-title"
          className={`${styles.section} ${styles.numbersSection}`}
          id="numbers"
        >
          <div className={styles.sectionHeading}>
            <p>Key numbers</p>
            <h2 id="numbers-title">Read the scope beside the value</h2>
          </div>
          <dl className={styles.numberGrid}>
            {demo.keyNumbers.map((number) => (
              <div key={`${number.value}-${number.label}`}>
                <dd>{number.value}</dd>
                <dt>{number.label}</dt>
                <span>{number.context}</span>
              </div>
            ))}
          </dl>
        </section>

        <section
          aria-labelledby="explorer-title"
          className={`${styles.section} ${styles.explorerSection}`}
          id="interactive-explorer"
        >
          <div className={styles.sectionHeading}>
            <p>Interactive evidence view</p>
            <h2 id="explorer-title">{demo.explorerTitle}</h2>
            <span>{demo.explorerIntro}</span>
          </div>
          <PaperExplorerView demo={demo} />
        </section>

        <section
          aria-labelledby="takeaways-title"
          className={`${styles.section} ${styles.takeawaySection}`}
        >
          <div>
            <p>What to carry forward</p>
            <h2 id="takeaways-title">Three useful reading moves</h2>
          </div>
          <ol>
            {demo.takeaways.map((takeaway, index) => (
              <li key={takeaway}>
                <span>0{index + 1}</span>
                <p>{takeaway}</p>
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-labelledby="limits-title"
          className={`${styles.section} ${styles.limitSection}`}
          id="limits"
        >
          <div className={styles.sectionHeading}>
            <p>Limits and traceability</p>
            <h2 id="limits-title">How to read this companion</h2>
          </div>
          <div className={styles.limitGrid}>
            <div>
              <ul>
                {demo.limitations.map((limitation) => (
                  <li key={limitation}>
                    <Check size={17} />
                    <span>{limitation}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.sourceNotes}>
              {demo.sourceNotes.map((note) => (
                <article key={note.label}>
                  <strong>{note.label}</strong>
                  <p>{note.detail}</p>
                  {note.href ? (
                    <a href={note.href} rel="noreferrer" target="_blank">
                      Inspect source
                      <ExternalLink size={14} />
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          </div>
          <div className={styles.citationBox}>
            <div>
              <span>Suggested citation</span>
              <p>{demo.citation}</p>
            </div>
            <button onClick={copyCitation} type="button">
              <Copy size={16} />
              {copied ? "Copied" : "Copy citation"}
            </button>
            <span aria-live="polite" className="sr-only">
              {copied ? "Citation copied" : ""}
            </span>
          </div>
        </section>

        <aside className={styles.generationNote}>
          <div>
            <span>How this companion was made</span>
            <strong>Built with AI, checked against the paper</strong>
          </div>
          <p>
            AI helped extract structure, organise the page, and build the
            interactive views. I checked the title, authors, values, figures,
            captions, and source links against the original material.
          </p>
        </aside>

        <PaperNavigation demo={demo} />
        <SiteFooter />
      </main>
    </div>
  );
}
