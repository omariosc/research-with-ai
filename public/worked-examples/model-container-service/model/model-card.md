# Synthetic linear demo model

Model ID: `synthetic-linear-demo-v1`

This is a transparent three-feature logistic model created only to teach model
packaging, checksums, API contracts, container tests, and deployment records.
Its weights are synthetic. It has no relationship to a patient, dataset,
scientific hypothesis, or clinical task.

## Inputs

The request contains exactly three finite, unitless numbers in the order `x1`,
`x2`, `x3`. The teaching API accepts values from -10 to 10.

## Output

The service returns the logistic probability, threshold, integer class, class
name, model ID, and SHA-256 checksum. A result at or above 0.5 maps to
`demo-positive`.

## Intended use

- Learn how to separate a model contract from a web service.
- Verify model bytes before loading.
- Compare direct and container predictions.
- Practise local, ARM64, and remote-access acceptance checks.

## Out of scope

- Scientific or clinical inference
- Accuracy, fairness, robustness, or safety claims
- File uploads or arbitrary model loading
- Patient data
- Public deployment without a maintained access layer

The model data in `model.json` are released under CC0-1.0.
