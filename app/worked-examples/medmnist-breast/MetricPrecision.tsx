"use client";

import { useState } from "react";

type MetricPair = {
  auc: number;
  acc: number;
};

type MetricRun = MetricPair & {
  run: number;
};

export function MetricPrecision({
  mean,
  paper,
  runs,
}: {
  mean: MetricPair;
  paper: MetricPair;
  runs: MetricRun[];
}) {
  const [precision, setPrecision] = useState<"paper" | "full">("paper");
  const digits = precision === "paper" ? 3 : 16;
  const format = (value: number) => value.toFixed(digits);

  return (
    <section
      aria-labelledby="metric-check-title"
      className="worked-metrics"
    >
      <div className="worked-section-heading">
        <p>Independent calculation</p>
        <h2 id="metric-check-title">Three files, two metrics, one declared comparison</h2>
        <span>
          Change the display precision to see how the full means become the
          paper&apos;s reported cells. The underlying values do not change.
        </span>
      </div>
      <div className="precision-control">
        <span id="precision-label">Display precision</span>
        <div aria-labelledby="precision-label" role="group">
          <button
            aria-pressed={precision === "paper"}
            onClick={() => setPrecision("paper")}
            type="button"
          >
            Paper, 3 decimals
          </button>
          <button
            aria-pressed={precision === "full"}
            onClick={() => setPrecision("full")}
            type="button"
          >
            Full calculation
          </button>
        </div>
        <output aria-live="polite">
          {precision === "paper"
            ? "Showing the comparison precision declared before calculation."
            : "Showing 16 decimal places from the reviewed JSON record."}
        </output>
      </div>
      <div
        aria-label="BreastMNIST metric table, horizontally scrollable on small screens"
        className="metric-table-wrap"
        role="region"
        tabIndex={0}
      >
        <table>
          <caption>
            Independently calculated metrics for three released BreastMNIST
            test prediction files
          </caption>
          <thead>
            <tr>
              <th scope="col">Evidence state</th>
              <th scope="col">Run</th>
              <th scope="col">AUC</th>
              <th scope="col">ACC</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.run}>
                <td>
                  <span className="claim-state claim-recomputed">
                    We recalculated
                  </span>
                </td>
                <th scope="row">Released run {run.run}</th>
                <td>{format(run.auc)}</td>
                <td>{format(run.acc)}</td>
              </tr>
            ))}
            <tr className="metric-mean-row">
              <td>
                <span className="claim-state claim-recomputed">
                  We recalculated
                </span>
              </td>
              <th scope="row">Three-run mean</th>
              <td>{format(mean.auc)}</td>
              <td>{format(mean.acc)}</td>
            </tr>
            <tr>
              <td>
                <span className="claim-state claim-reported">
                  Paper reports
                </span>
              </td>
              <th scope="row">Table 3</th>
              <td>{paper.auc.toFixed(3)}</td>
              <td>{paper.acc.toFixed(3)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="metric-conclusion">
        <strong>Result:</strong> both calculated means recover the reported
        cells at three decimal places. This checks the released predictions,
        not the training run that produced them.
      </p>
    </section>
  );
}
