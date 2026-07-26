# Third-party notices

The project links to many external papers, standards, repositories, datasets,
and product pages. Those links do not change the rights in the source material.
The items below are the third-party materials copied into this repository or
retrieved by a bundled worked example.

## MedMNIST v2 Figure 1

- Local file:
  `public/worked-examples/medmnist-breast/medmnist-figure-1.jpg`
- Source: Jiancheng Yang et al., "MedMNIST v2 - A large-scale lightweight
  benchmark for 2D and 3D biomedical image classification", Figure 1,
  <https://doi.org/10.1038/s41597-022-01721-8>
- Retrieved image:
  <https://cdn.ncbi.nlm.nih.gov/pmc/blobs/3ac8/9852451/45d10a61d7e2/41597_2022_1721_Fig1_HTML.jpg>
- Licence: Creative Commons Attribution 4.0 International
- Change: the same-sized PMC JPEG is reused without further visual editing;
  the website adds responsive presentation, concise alt text, attribution, and
  a separately authored long description
- SHA-256:
  `490bafbc9a24fec64a825b4e18cfc0544e3b897140097116175cefa482edca65`

The source figure title is "An overview of MedMNIST v2." The recorded hash is
for the local JPEG. The website does not copy the publisher's performance table
as an image.

## MedMNIST data and released predictions

The worked verifier temporarily retrieves:

- `breastmnist.npz` from
  <https://doi.org/10.5281/zenodo.5208230>, version 2.0, CC BY 4.0; and
- three members of `predictions.zip` from
  <https://doi.org/10.5281/zenodo.7782114>, CC BY 4.0.

Those source files are not redistributed in this repository. Their versions,
checksums, use, and claim boundary are recorded in
`public/worked-examples/medmnist-breast/source-manifest.json`.
The manifest also traces BreastMNIST to the original BUSI dataset paper rather
than treating the derivative benchmark as the start of the provenance chain.

## Historical frame-annotator interface image

The immutable v1.1.0 and v1.2.0 source snapshots contain
`public/frame-annotator-safety-interface.png`, taken from the author's public
`omariosc/frame-annotator` repository at commit
`3e94ed03c1487331b8c041ca755421686b41d031`. It remains subject to the source
repository's rights. The current annotation demo replaces it with the original
vector fixture `public/worked-examples/annotation-synthetic-frame.svg`, which
contains no patient or clinical image.

## Generated social preview

`public/research-with-ai-social.png` was generated for this project with an
OpenAI image model. Its AI origin is disclosed in `AI_USE.md`.
