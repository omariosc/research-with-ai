import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/HomeClient";
import { ExternalLink } from "@/app/components/Icons";
import { PrivacyNote } from "@/app/components/PrivacyNote";
import { SiteNav } from "@/app/components/SiteNav";
import reproductionReport from "@/public/worked-examples/medmnist-breast/reproduction-report.json";
import { TUTORIAL_HOMEPAGE, TUTORIAL_VERSION_LABEL } from "@/lib/version";
import { MetricPrecision } from "./MetricPrecision";

const canonicalUrl = `${TUTORIAL_HOMEPAGE}/worked-examples/medmnist-breast`;
const packRoot = "/worked-examples/medmnist-breast";
const description =
  "A first-hand, bounded re-evaluation of three released BreastMNIST prediction files, with source hashes, code audit, rights record, and explicit claim limits.";

export const metadata: Metadata = {
  title: "BreastMNIST worked evidence pack",
  description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "article",
    siteName: "Research with AI",
    title: "One table row, traced from paper to released predictions",
    description,
    url: canonicalUrl,
    images: [
      {
        url: `${TUTORIAL_HOMEPAGE}/research-with-ai-social.png`,
        width: 1200,
        height: 630,
        alt: "Research with AI worked evidence pack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BreastMNIST worked evidence pack",
    description,
    images: [`${TUTORIAL_HOMEPAGE}/research-with-ai-social.png`],
  },
};

const verification = reproductionReport.verification;

export default function MedMnistBreastWorkedExample() {
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "BreastMNIST prediction-artifact verification",
    description,
    url: canonicalUrl,
    version: TUTORIAL_VERSION_LABEL,
    datePublished: "2026-07-26",
    inLanguage: "en-GB",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
    author: {
      "@type": "Person",
      name: "Omar Choudhry",
    },
    citation: [
      "https://doi.org/10.1038/s41597-022-01721-8",
      "https://doi.org/10.5281/zenodo.5208230",
      "https://doi.org/10.5281/zenodo.7782114",
      "https://doi.org/10.1016/j.dib.2019.104863",
    ],
    learningResourceType: "Worked computational verification",
  }).replaceAll("<", "\\u003c");

  return (
    <div className="site-frame worked-theme">
      <script
        dangerouslySetInnerHTML={{ __html: structuredData }}
        type="application/ld+json"
      />
      <SiteNav />
      <main className="worked-main" id="main-content">
        <header className="worked-hero">
          <div className="worked-breadcrumb">
            <a href={`${TUTORIAL_HOMEPAGE}/agentic-research`}>
              Agentic research
            </a>
            <span>/</span>
            <strong>Worked evidence pack</strong>
          </div>
          <div className="worked-hero-grid">
            <div>
              <p>First-hand biomedical example · 26 July 2026</p>
              <h1>One table row, traced from paper to released predictions</h1>
              <div className="worked-hero-lead">
                We checked three author-released BreastMNIST prediction files
                against the official test labels. Their mean AUC and accuracy
                recover two MedMNIST v2 Table 3 cells at the paper&apos;s
                precision.
              </div>
            </div>
            <aside>
              <span>What this is</span>
              <strong>Prediction-artifact metric re-evaluation</strong>
              <p>
                Not model retraining, a whole-paper reproduction, or clinical
                validation.
              </p>
              <small>{TUTORIAL_VERSION_LABEL} · public benchmark data</small>
            </aside>
          </div>
        </header>

        <section
          aria-labelledby="claim-states-title"
          className="worked-claim-states"
        >
          <div className="worked-section-heading">
            <p>Claim discipline</p>
            <h2 id="claim-states-title">Say exactly which evidence you have</h2>
          </div>
          <div className="claim-state-grid">
            <article>
              <span className="claim-state claim-reported">Paper reports</span>
              <h3>AUC 0.901, ACC 0.863</h3>
              <p>
                MedMNIST v2 Table 3 attributes these three-decimal means to
                ResNet-18 with 28 by 28 BreastMNIST inputs. The accompanying
                benchmark text says the authors calculate means from at least
                three trials for each method on each dataset.
              </p>
            </article>
            <article>
              <span className="claim-state claim-recomputed">
                We recalculated
              </span>
              <h3>AUC 0.9014898357, ACC 0.8632478632</h3>
              <p>
                An independent implementation of the MedMNIST binary metric
                contract over the three released files recovered the
                paper&apos;s rounded cells.
              </p>
            </article>
            <article>
              <span className="claim-state claim-not-reproduced">
                Not reproduced
              </span>
              <h3>Training and clinical meaning</h3>
              <p>
                We did not retrain ResNet-18, identify the generating code
                revision, establish patient-independent splitting, or test a
                diagnostic system.
              </p>
            </article>
          </div>
          <p className="worked-label-note">
            In this benchmark, normal and benign breast ultrasound samples are
            combined as the positive class; malignant samples form the negative
            class. This unusual mapping is retained rather than silently
            relabelled.
          </p>
        </section>

        <section
          aria-labelledby="source-chain-title"
          className="worked-source-chain"
        >
          <div className="worked-section-heading">
            <p>Source chain</p>
            <h2 id="source-chain-title">Every arrow ends in an inspectable record</h2>
            <span>
              The agent helped locate and connect the artefacts. Checksums,
              calculations, claim wording, and approval remain reviewable.
            </span>
          </div>
          <ol>
            <li>
              <span>01</span>
              <div>
                <strong>Paper claim</strong>
                <p>DOI and exact Table 3 row, metric, model, and precision.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Pinned inputs</strong>
                <p>
                  Dataset size, MD5 and SHA-256, label counts, archive record,
                  and three selected-member hashes.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Independent calculation</strong>
                <p>
                  Average-rank AUC from the label <code>1</code> probability
                  and accuracy at a strict <code>0.5</code> threshold, without
                  the MedMNIST evaluator or scikit-learn.
                </p>
              </div>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Reviewed result</strong>
                <p>
                  Per-run values, full-precision means, code finding, and claim
                  boundary in a versioned JSON record.
                </p>
              </div>
            </li>
            <li>
              <span>05</span>
              <div>
                <strong>Public explanation</strong>
                <p>
                  This page keeps the result, source, rights, and unresolved
                  questions together.
                </p>
              </div>
            </li>
          </ol>
        </section>

        <MetricPrecision
          mean={verification.mean}
          paper={verification.paper_reported}
          runs={verification.runs.map(({ acc, auc, run }) => ({
            acc,
            auc,
            run,
          }))}
        />

        <section
          aria-labelledby="figure-title"
          className="worked-figure-section"
        >
          <div className="worked-section-heading">
            <p>Figure handling</p>
            <h2 id="figure-title">
              Preserve context, rights, caption, and description
            </h2>
            <span>
              A figure is not decoration. Its source, licence, meaning, and
              limits travel with it.
            </span>
          </div>
          <figure className="worked-paper-figure">
            <img
              alt="Eighteen labelled montages show the 2D and 3D biomedical image collections included in MedMNIST v2."
              height="410"
              src={`${packRoot}/medmnist-figure-1.jpg`}
              width="760"
            />
            <figcaption>
              <strong>Figure 1. An overview of MedMNIST v2.</strong>
              <span>
                <a
                  href="https://doi.org/10.1038/s41597-022-01721-8"
                  rel="noreferrer"
                  target="_blank"
                >
                  Yang et al., <cite>Scientific Data</cite> 10, 41 (2023)
                </a>
                . Reused from the PMC-hosted JPEG without further visual
                editing under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  rel="noreferrer"
                  target="_blank"
                >
                  CC BY 4.0
                </a>
                . Local file SHA-256 begins <code>490bafbc9a24</code>.
              </span>
            </figcaption>
          </figure>
          <details className="figure-description">
            <summary>Read the long description</summary>
            <p>
              The figure contains three rows of six labelled image montages.
              The first two rows show the twelve 2D collections: PathMNIST,
              ChestMNIST, DermaMNIST, OCTMNIST, PneumoniaMNIST, RetinaMNIST,
              BreastMNIST, BloodMNIST, TissueMNIST, and three abdominal organ
              views. The third row shows six 3D collections for organs,
              nodules, fractures, adrenal shapes, vessels, and synapses. Each
              panel combines many small standardised samples with one enlarged
              example. BreastMNIST is the first panel in the second row and
              contains greyscale breast ultrasound images. The overview shows
              the benchmark&apos;s breadth; it does not provide evidence of
              diagnostic performance.
            </p>
          </details>
        </section>

        <section
          aria-labelledby="repo-finding-title"
          className="worked-repo-finding"
        >
          <div>
            <p>Repository audit</p>
            <h2 id="repo-finding-title">A useful finding, with an unresolved link</h2>
          </div>
          <div>
            <p>
              At the fix&apos;s direct parent, dated 30 March 2023, the PyTorch
              script assigned <code>best_model = model</code>. That name
              continued to refer to the model being optimised, so it did not
              freeze the best validation epoch. The May 2023 fix changed the
              assignments to <code>deepcopy(model)</code>.
            </p>
            <p>
              The released predictions do not identify their generating commit.
              We therefore report a code-path reproducibility risk, not a claim
              that the defect affected these files.
            </p>
            <div className="worked-repo-links">
              <a
                href="https://github.com/MedMNIST/experiments/blob/12e9f40ad214f6f076b1672cf29fab9d2e7216cc/MedMNIST2D/train_and_eval_pytorch.py#L126-L154"
                rel="noreferrer"
                target="_blank"
              >
                Inspect the direct parent
                <ExternalLink size={14} />
              </a>
              <a
                href="https://github.com/MedMNIST/experiments/commit/8b0f553f95ea6b5f5517e49c539952cb21c79d89"
                rel="noreferrer"
                target="_blank"
              >
                Inspect the later fix
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="download-pack-title"
          className="worked-downloads"
        >
          <div className="worked-section-heading">
            <p>Take the evidence with you</p>
            <h2 id="download-pack-title">The page is not the only record</h2>
            <span>
              Download the exact inputs, checks, environment, result, and
              boundary used to build this explanation.
            </span>
          </div>
          <div className="download-grid">
            <a href={`${packRoot}/README.md`}>
              <span>Start here</span>
              <strong>Worked example README</strong>
              <small>Question, acceptance rule, command, and limits</small>
            </a>
            <a href={`${packRoot}/source-manifest.json`}>
              <span>Sources and rights</span>
              <strong>source-manifest.json</strong>
              <small>Versions, locators, hashes, licences, and use</small>
            </a>
            <a href={`${packRoot}/reproduction-report.json`}>
              <span>Reviewed result</span>
              <strong>reproduction-report.json</strong>
              <small>Per-run metrics, mean, code finding, and boundary</small>
            </a>
            <a href={`${packRoot}/verify.py`}>
              <span>Runnable check</span>
              <strong>verify.py</strong>
              <small>Input validation and independent metric calculation</small>
            </a>
            <a href={`${packRoot}/test_verify.py`}>
              <span>Negative controls</span>
              <strong>test_verify.py</strong>
              <small>Changed checksum and row-ID failures</small>
            </a>
            <a href={`${packRoot}/uv.lock`}>
              <span>Environment</span>
              <strong>uv.lock</strong>
              <small>Exact Python dependency resolution</small>
            </a>
          </div>
          <div className="worked-return-links">
            <a href={`${TUTORIAL_HOMEPAGE}/agentic-research`}>
              Use this case in Agentic AI in Research
            </a>
            <a href={`${TUTORIAL_HOMEPAGE}/interactive-paper`}>
              Use this case in Building a Website for Your Research
            </a>
          </div>
        </section>
        <SiteFooter />
      </main>
      <PrivacyNote />
    </div>
  );
}
