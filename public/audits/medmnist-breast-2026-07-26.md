# BreastMNIST prediction-artifact verification record

Record date: 26 July 2026

Accountable reviewer: Omar Choudhry
Tutorial release: `v1.1.0`

## Bounded question

Can an independent calculation from the official BreastMNIST test labels and
three author-released ResNet-18 28-pixel prediction files recover the AUC and
accuracy reported in MedMNIST v2 Table 3 when rounded to three decimals?

This is a prediction-artifact metric re-evaluation. It is not a training
reproduction or clinical validation.

## Pinned inputs

| Input | Record | Check |
| --- | --- | --- |
| Paper | DOI `10.1038/s41597-022-01721-8`, Table 3 and accompanying benchmark text | ResNet-18 (28), BreastMNIST: AUC `0.901`, ACC `0.863`; authors state they calculate the mean of at least three trials for each method on each dataset |
| Dataset | Paper-cited Zenodo `10.5281/zenodo.5208230`, version 2.0, `breastmnist.npz` | 559,580 bytes; MD5 `750601b1f35ba3300ea97c75c52ff8f6`; SHA-256 `3a22d2a4625e7dd8903f0f59030e81a3d0c222bece2e5e10927456cb50efdec1` |
| Predictions | Zenodo `10.5281/zenodo.7782114`, v1, `predictions.zip` | Zenodo lists MD5 `1a2563e89d3d36d0f29d7ca31e8a41c2`; selected member hashes are in the manifest |
| Repository | `MedMNIST/experiments` | Direct pre-fix revision `12e9f40ad214f6f076b1672cf29fab9d2e7216cc` and fix `8b0f553f95ea6b5f5517e49c539952cb21c79d89` inspected read-only |

The paper combines normal and benign as the positive class and classifies them
against malignant as negative. The pinned MedMNIST API maps label `0` to
malignant and label `1` to normal or benign. The test split contains 42
label-0 and 114 label-1 examples.
The MedMNIST paper traces BreastMNIST to Al-Dhabyani et al.'s BUSI dataset
paper, DOI `10.1016/j.dib.2019.104863`. This check uses the derivative
MedMNIST file and does not independently audit the original BUSI files.

## Procedure

The verifier checks source bytes before parsing. It confirms the dataset size,
MD5, SHA-256, label distribution, prediction-member SHA-256, array shape,
ordered row identifiers, finite values, probability range, and row sums.
Zenodo lists the complete predictions archive as 2,007,797,878 bytes with the
MD5 above. The verifier does not download or hash the full archive; it retrieves
and checks only the three named members.

It follows the official MedMNIST binary metric contract: AUC is calculated
from the label `1` probability with an independent average-rank
implementation, and accuracy uses a strict `score > 0.5` threshold. It does
not import the MedMNIST evaluator or scikit-learn.

The recorded run used Python 3.12.9, NumPy 2.3.2, RemoteZip 0.12.3, and the
locked environment in the worked-example folder.

```sh
uv sync --frozen --project public/worked-examples/medmnist-breast
uv run --frozen --project public/worked-examples/medmnist-breast \
  python public/worked-examples/medmnist-breast/verify.py
```

## Observed result

| Released run | AUC | ACC | SHA-256 prefix |
| --- | ---: | ---: | --- |
| 1 | 0.8984962406015038 | 0.8717948717948718 | `e440e58b346f` |
| 2 | 0.9172932330827067 | 0.8717948717948718 | `6d2aa475a6c7` |
| 3 | 0.8886800334168755 | 0.8461538461538461 | `a3dae28dd2f8` |
| Mean | 0.9014898357003620 | 0.8632478632478633 | |
| Paper, three decimals | 0.901 | 0.863 | |

Both means recover the reported cells at the paper's precision.

## Repository finding

At the fix's direct parent, revision
`12e9f40ad214f6f076b1672cf29fab9d2e7216cc` dated 30 March 2023, the 2D
PyTorch training script assigned `best_model = model` before training and again
when validation AUC improved. Because that name referred to the same live model
object, later optimisation could change the object intended to preserve the
best validation epoch.

Commit `8b0f553f95ea6b5f5517e49c539952cb21c79d89`, dated 18 May 2023,
changed both assignments to `deepcopy(model)`.

The prediction archive does not identify its generating code revision. The
finding is therefore a reproducibility risk in the public code path, not
evidence that the defect affected these prediction files.

## Rights and safety

The paper, Zenodo dataset record, and prediction record state CC BY 4.0. The
experiments repository is Apache-2.0. The source manifest records attribution,
hashes, and use decisions. No private or patient-identifiable material was
used.

MedMNIST is a lightweight educational benchmark. The authors say it is not
intended for clinical use because substantial downsampling may leave images
unable to represent or capture disease pathologies adequately.

## Claim boundary

We re-evaluated three author-released BreastMNIST test prediction files against
the official test labels. We did not retrain the model, reproduce the complete
paper, establish patient-independent splitting, or validate breast cancer
diagnosis.
