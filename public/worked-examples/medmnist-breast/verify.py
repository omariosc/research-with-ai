#!/usr/bin/env python3
"""Re-evaluate three released BreastMNIST prediction files.

This checks source bytes before parsing them, reproduces the official
MedMNIST binary metric contract with an independent rank implementation, and
compares the three-run mean with the values reported in MedMNIST v2 Table 3.

It is a prediction-artifact metric re-evaluation. It does not retrain a model
or reproduce the complete paper.
"""

from __future__ import annotations

import argparse
import hashlib
import io
import json
import urllib.request
from pathlib import Path
from typing import Any

import numpy as np
from remotezip import RemoteZip


USER_AGENT = "Research-with-AI-MedMNIST-verifier/1.1"
DATASET_URL = (
    "https://zenodo.org/api/records/5208230/files/breastmnist.npz/content"
)
PREDICTIONS_URL = (
    "https://zenodo.org/api/records/7782114/files/predictions.zip/content"
)
DATASET_SIZE = 559_580
DATASET_MD5 = "750601b1f35ba3300ea97c75c52ff8f6"
DATASET_SHA256 = (
    "3a22d2a4625e7dd8903f0f59030e81a3d0c222bece2e5e10927456cb50efdec1"
)
PAPER_REPORTED = {"auc": 0.901, "acc": 0.863}
EXPECTED_LABEL_COUNTS = {0: 42, 1: 114}
EXPECTED_RUNS = [
    {
        "run": 1,
        "file": "breastmnist_test_[AUC]0.898_[ACC]0.872@resnet18_28_1.csv",
        "sha256": (
            "e440e58b346fa0ca7f716a32214cc21777d9e414b205e79b37c78d3d4991478c"
        ),
    },
    {
        "run": 2,
        "file": "breastmnist_test_[AUC]0.917_[ACC]0.872@resnet18_28_2.csv",
        "sha256": (
            "6d2aa475a6c7dfa183bb6eec50dc199f20ce2812bac6ed583da8a502a0c8d3ec"
        ),
    },
    {
        "run": 3,
        "file": "breastmnist_test_[AUC]0.889_[ACC]0.846@resnet18_28_3.csv",
        "sha256": (
            "a3dae28dd2f8d766167166ff49e578ff9d68843eb51e97385cb6150406d5dd70"
        ),
    },
]


def checksum(data: bytes, algorithm: str) -> str:
    if algorithm == "md5":
        return hashlib.md5(data, usedforsecurity=False).hexdigest()
    return hashlib.new(algorithm, data).hexdigest()


def require_checksum(data: bytes, algorithm: str, expected: str, label: str) -> None:
    observed = checksum(data, algorithm)
    if observed != expected:
        raise ValueError(
            f"{label} {algorithm.upper()} changed: expected {expected}, "
            f"observed {observed}"
        )


def rank_auc(labels: np.ndarray, scores: np.ndarray) -> float:
    """Calculate binary AUC from average ranks, including tied scores."""
    labels = np.asarray(labels, dtype=np.int8)
    scores = np.asarray(scores, dtype=np.float64)
    if labels.ndim != 1 or scores.shape != labels.shape:
        raise ValueError("AUC labels and scores must be one-dimensional peers.")
    if not np.isfinite(scores).all():
        raise ValueError("AUC scores contain a non-finite value.")
    if not set(np.unique(labels)).issubset({0, 1}):
        raise ValueError("AUC labels must contain only 0 and 1.")

    positive_count = int(np.sum(labels == 1))
    negative_count = int(np.sum(labels == 0))
    if positive_count == 0 or negative_count == 0:
        raise ValueError("AUC requires both a positive and a negative example.")

    order = np.argsort(scores, kind="stable")
    sorted_scores = scores[order]
    ranks = np.empty(scores.size, dtype=np.float64)
    start = 0
    while start < scores.size:
        stop = start + 1
        while stop < scores.size and sorted_scores[stop] == sorted_scores[start]:
            stop += 1
        ranks[order[start:stop]] = (start + 1 + stop) / 2
        start = stop

    positive_rank_sum = float(ranks[labels == 1].sum())
    numerator = positive_rank_sum - positive_count * (positive_count + 1) / 2
    return numerator / (positive_count * negative_count)


def validate_predictions(array: np.ndarray, labels: np.ndarray, source: str) -> None:
    if array.shape != (labels.size, 3):
        raise ValueError(
            f"{source} has shape {array.shape}; expected ({labels.size}, 3)."
        )
    if not np.isfinite(array).all():
        raise ValueError(f"{source} contains a non-finite value.")

    indexes = array[:, 0]
    expected_indexes = np.arange(labels.size)
    if not np.array_equal(indexes, expected_indexes):
        raise ValueError(f"{source} row identifiers are missing, duplicated, or reordered.")

    probabilities = array[:, 1:]
    if np.any(probabilities < 0) or np.any(probabilities > 1):
        raise ValueError(f"{source} contains a probability outside [0, 1].")
    if not np.allclose(probabilities.sum(axis=1), 1.0, atol=2e-6, rtol=0):
        raise ValueError(f"{source} probability rows do not sum to one.")


def calculate_run(raw_csv: bytes, labels: np.ndarray, source: str) -> dict[str, Any]:
    array = np.loadtxt(io.BytesIO(raw_csv), delimiter=",", dtype=np.float64)
    validate_predictions(array, labels, source)
    probabilities = array[:, 1:]
    positive_scores = probabilities[:, 1]
    return {
        "auc": rank_auc(labels, positive_scores),
        "acc": float(np.mean((positive_scores > 0.5) == labels)),
    }


def read_dataset_labels(dataset_bytes: bytes) -> np.ndarray:
    if len(dataset_bytes) != DATASET_SIZE:
        raise ValueError(
            f"breastmnist.npz size changed: expected {DATASET_SIZE}, "
            f"observed {len(dataset_bytes)}"
        )
    require_checksum(dataset_bytes, "md5", DATASET_MD5, "breastmnist.npz")
    require_checksum(dataset_bytes, "sha256", DATASET_SHA256, "breastmnist.npz")

    with np.load(io.BytesIO(dataset_bytes), allow_pickle=False) as dataset:
        labels = np.asarray(dataset["test_labels"], dtype=np.int8).reshape(-1)

    observed_counts = {
        int(label): int(count)
        for label, count in zip(*np.unique(labels, return_counts=True))
    }
    if observed_counts != EXPECTED_LABEL_COUNTS:
        raise ValueError(
            f"Test-label distribution changed: expected {EXPECTED_LABEL_COUNTS}, "
            f"observed {observed_counts}"
        )
    return labels


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=60) as response:
        return response.read()


def build_report() -> dict[str, Any]:
    labels = read_dataset_labels(fetch(DATASET_URL))
    runs = []
    with RemoteZip(PREDICTIONS_URL, headers={"User-Agent": USER_AGENT}) as archive:
        for expected in EXPECTED_RUNS:
            raw_csv = archive.read(expected["file"])
            require_checksum(
                raw_csv,
                "sha256",
                expected["sha256"],
                expected["file"],
            )
            metrics = calculate_run(raw_csv, labels, expected["file"])
            runs.append(
                {
                    "run": expected["run"],
                    "file": expected["file"],
                    "sha256": expected["sha256"],
                    **metrics,
                }
            )

    mean = {
        "auc": float(np.mean([run["auc"] for run in runs])),
        "acc": float(np.mean([run["acc"] for run in runs])),
    }
    rounded_match = {
        metric: round(mean[metric], 3) == PAPER_REPORTED[metric]
        for metric in ("auc", "acc")
    }
    if not all(rounded_match.values()):
        raise ValueError(
            "The independently calculated three-run mean no longer recovers "
            "the two reported Table 3 values at three decimal places."
        )

    return {
        "verification_type": "prediction-artifact metric re-evaluation",
        "metric_contract": {
            "auc": "Average-rank AUC from the label-1 probability",
            "acc": "Accuracy from label-1 probability greater than 0.5",
        },
        "test_examples": int(labels.size),
        "test_label_counts": {str(key): value for key, value in EXPECTED_LABEL_COUNTS.items()},
        "runs": runs,
        "mean": mean,
        "paper_reported": PAPER_REPORTED,
        "rounded_match": rounded_match,
    }


def compare_with_record(report: dict[str, Any], record_path: Path) -> None:
    record = json.loads(record_path.read_text(encoding="utf-8"))
    expected = record["verification"]
    if report != expected:
        raise ValueError(
            f"Calculated report differs from the reviewed record at {record_path}."
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--record",
        type=Path,
        default=Path(__file__).with_name("reproduction-report.json"),
        help="Reviewed JSON record to compare with the independent calculation.",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print the calculated verification object as JSON.",
    )
    arguments = parser.parse_args()

    report = build_report()
    compare_with_record(report, arguments.record)
    if arguments.json:
        print(json.dumps(report, indent=2))
    else:
        for run in report["runs"]:
            print(
                f"Run {run['run']}  AUC {run['auc']:.16f}  "
                f"ACC {run['acc']:.16f}"
            )
        print(
            f"Mean   AUC {report['mean']['auc']:.16f}  "
            f"ACC {report['mean']['acc']:.16f}"
        )
        print(
            f"Paper  AUC {report['paper_reported']['auc']:.3f}"
            f"              ACC {report['paper_reported']['acc']:.3f}"
        )
        print("PASS: both means recover the Table 3 cells at three decimals")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
