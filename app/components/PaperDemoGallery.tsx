import { ExternalLink, ArrowRight } from "./Icons";
import {
  paperDemos,
  paperDemoPath,
  type PaperDemoSlug,
} from "@/lib/paper-demos";

const GALLERY_ITEMS: ReadonlyArray<{
  slug: PaperDemoSlug;
  screenshot: string;
  screenshotAlt: string;
  kicker: string;
  boundary: string;
}> = [
  {
    slug: "real-time-tool-detection",
    screenshot:
      "/paper-demos/screenshots/real-time-tool-detection-landing.webp",
    screenshotAlt:
      "Landing page for the real-time laparoscopic tool detection paper companion, with the paper title, publication status, claim boundary, and reported key metrics",
    kicker: "Published benchmark",
    boundary:
      "The explorer rearranges published table values. It does not run the detector or resolve the paper's abstract and Table 5 discrepancy.",
  },
  {
    slug: "lask-7dof",
    screenshot: "/paper-demos/screenshots/lask-7dof-landing.webp",
    screenshotAlt:
      "Landing page for the LASK 7-DoF dataset companion, showing the paper title, public release links, and the three distinct dataset denominators",
    kicker: "Paper and staged dataset",
    boundary:
      "The 114-trial manuscript cohort, 115-trial analysis inventory, and 37-trial public release remain separate throughout.",
  },
  {
    slug: "btpn",
    screenshot: "/paper-demos/screenshots/btpn-landing.webp",
    screenshotAlt:
      "Landing page for the accepted BTPN paper companion, showing its title, accepted-paper status, code link, and reported pose and uncertainty metrics",
    kicker: "Accepted MICCAI 2026 paper",
    boundary:
      "The official proceedings link is marked coming soon. The page exposes no private submission, review, response, or source bundle.",
  },
];

export function PaperDemoGallery() {
  return (
    <section
      aria-labelledby="live-paper-demos-title"
      className="paper-demo-gallery"
      id="live-paper-demos"
    >
      <div className="paper-demo-gallery-heading">
        <p>Three real outputs from this workflow</p>
        <h2 id="live-paper-demos-title">
          Live websites made from real papers
        </h2>
        <span>
          These are not generic templates with placeholder claims. Each
          companion was assembled from Omar&apos;s paper, figures, tables, and
          public project records, then checked against the source. Open one to
          inspect the method, reported evidence, limitations, provenance, and
          interactive controls.
        </span>
      </div>

      <div className="paper-demo-gallery-list">
        {GALLERY_ITEMS.map((item, index) => {
          const demo = paperDemos[item.slug];
          const paperLink = demo.paperLinkPending
            ? undefined
            : demo.links.find((link) =>
                /paper|proceedings|white rose/i.test(link.label),
              );
          return (
            <article
              className={index % 2 === 1 ? "is-reversed" : undefined}
              key={demo.slug}
            >
              <a
                aria-label={`Open the ${demo.shortTitle} live paper companion`}
                className="paper-demo-gallery-screenshot"
                href={paperDemoPath(demo.slug)}
              >
                {/* This is a browser capture of the live companion page. */}
                <img
                  alt={item.screenshotAlt}
                  height={900}
                  loading="lazy"
                  src={item.screenshot}
                  width={1440}
                />
                <span>
                  Open live companion
                  <ArrowRight size={16} />
                </span>
              </a>

              <div className="paper-demo-gallery-copy">
                <div>
                  <span>{item.kicker}</span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <h3>{demo.title}</h3>
                <p>{demo.description}</p>
                <dl>
                  {demo.keyNumbers.slice(0, 3).map((number) => (
                    <div key={`${number.value}-${number.label}`}>
                      <dd>{number.value}</dd>
                      <dt>{number.label}</dt>
                    </div>
                  ))}
                </dl>
                <aside>
                  <strong>Claim boundary</strong>
                  <p>{item.boundary}</p>
                </aside>
                <div className="paper-demo-gallery-actions">
                  <a href={paperDemoPath(demo.slug)}>
                    Explore the live website
                    <ArrowRight size={16} />
                  </a>
                  {paperLink ? (
                    <a
                      href={paperLink.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open the paper
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span>Official paper link coming soon</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <footer className="paper-demo-gallery-footer">
        <div>
          <strong>What the system accelerated</strong>
          <p>
            Source inventory, structure, first-pass explanations, page
            implementation, accessibility descriptions, and repeated checks.
          </p>
        </div>
        <div>
          <strong>What still needed a person</strong>
          <p>
            Scientific emphasis, rights decisions, metric interpretation,
            privacy boundaries, discrepancy handling, and final approval.
          </p>
        </div>
        <a href="/citations/paper-demo-assets-2026-07-29.md">
          Read the figure and source record
          <ArrowRight size={15} />
        </a>
      </footer>
    </section>
  );
}
