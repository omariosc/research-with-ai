# BreastMNIST prediction-artifact verification

This worked example traces one reported result from a biomedical paper to its
released test labels and prediction files. It then calculates AUC and accuracy
without using the MedMNIST evaluator.

## Question and acceptance rule

MedMNIST v2 Table 3 reports AUC `0.901` and accuracy `0.863` for ResNet-18
with 28 by 28 BreastMNIST inputs. In the accompanying benchmark text, the
authors say they calculate the mean of at least three trials for each method on
each dataset.

Before calculation, the acceptance rule was:

1. retrieve the official test labels and three named prediction files;
2. reject any input whose size, checksum, shape, row order, range, or label
   distribution differs from the reviewed record;
3. reproduce the official binary metric contract independently: calculate AUC
   from the label `1` probability and accuracy using a strict `0.5` threshold;
4. average the three runs; and
5. compare only after rounding the means to the paper's three decimal places.

## Run it

From this directory:

```sh
uv sync --frozen
uv run --frozen python -m unittest -v
uv run --frozen python verify.py
```

The verification makes byte-range requests into the approximately 2 GB
predictions archive, but it retrieves only the three selected CSV members. It
downloads the 559,580-byte BreastMNIST NPZ into memory and reads only the test
labels.

Expected final line:

```text
PASS: both means recover the Table 3 cells at three decimals
```

## What the result means

The three-run mean is AUC `0.9014898357003620` and accuracy
`0.8632478632478633`. Those values round to the two Table 3 cells.

This is narrower than a model reproduction. The script does not retrain
ResNet-18, establish the training environment or random seeds, verify
patient-independent splitting, or evaluate diagnostic value. The paper states
that MedMNIST is not intended for clinical use because substantial downsampling
may leave images unable to represent disease pathology adequately.

The paper combines normal and benign BreastMNIST samples into its positive
class and treats malignant samples as the negative class. The pinned test file
contains 114 and 42 examples respectively.

## Repository finding

At commit `12e9f40ad214f6f076b1672cf29fab9d2e7216cc`, the direct parent of
the fix, the experiments script assigned `best_model = model`. That kept an
alias to the model still being optimised instead of freezing the best
validation epoch. The May 2023 fix changed both assignments to
`deepcopy(model)`.

The released prediction files do not identify the code revision that generated
them. This review therefore does not claim that the defect affected the three
files or their reported metrics.

## Evidence pack

- `source-manifest.json` records versions, rights, locators, and hashes.
- `reproduction-report.json` records the exact per-run calculation and claim
  boundary.
- `verify.py` contains the independent metric implementation and input checks.
- `test_verify.py` includes negative controls for a changed checksum and row ID.
- `medmnist-figure-1.jpg` is reused from the paper's CC BY 4.0 PMC image with
  attribution, its exact source URL, and the local file hash recorded.

The verification code is MIT licensed. Original explanatory text and the
reviewed report are CC BY 4.0. Third-party material retains its stated licence.
