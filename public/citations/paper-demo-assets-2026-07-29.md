# Paper companion asset provenance

Checked: 29 July 2026

This record covers the paper-native abstracts, section maps, figures and table
images used by the interactive paper companion pages. It deliberately omits
workstation paths, complete unpublished manuscript files, reviews, responses
and participant-level data.

## HTL paper-native package

- Public source: Choudhry, O., Ali, S., Biyani, C. S., and Jones, D. (2025), *Real-Time Tool Detection in Laparoscopic Datasets for Surgical Training in Low-Resource Settings*. https://doi.org/10.1049/htl2.70045
- Rights: the published article is licensed under CC BY 4.0.
- Published PDF SHA-256: `c7a7bb77192baa28c64d53dc0c9875a4f5ae49c42a5ca13518691b25358d33b3`
- Author source bundle SHA-256: `49ce646ee7d78ff2b213e0e00d6a81465df3f14dbde6a3f13dc7d825ac61efe0`
- The source bundle is used only to obtain the authors' original figure images. It is not distributed by this website.
- Image boundary: Figures 1 and 3 include already-published, deidentified ART-Net and EndoVis in-vivo panels. They contain no patient identifiers or embedded metadata and remain part of the attributed CC BY 4.0 paper record.

### `htl/figure-1-dataset-samples.webp`

- Source locator: published Figure 1, PDF page 4 of 13; author source image `updated_samples.png`.
- Source image SHA-256: `2ccd7df96022257bc7bfca69b67dc2f1b77b6be85db3f083b228344b551aa778`
- Transformation: resized to 2000 by 478 pixels, converted to WebP at quality 90, and stripped of metadata. The figure content, panel order, and labels were not edited.
- Output SHA-256: `3e41ed1fc04cbb290e2f322a5c5c86f2b98cc510ac11f77138290d5d8890a2d7`

### `htl/figure-2-experimental-pipeline.webp`

- Source locator: published Figure 2, PDF page 5 of 13; author source image `experiments.png`.
- Source image SHA-256: `36b0eddf11f2041a02d37a3f8f6d19113aecd3343b1ade75e9fa827707dc4b62`
- Transformation: resized to 2000 by 888 pixels, converted to WebP at quality 92, and stripped of metadata. The figure content, flow, and labels were not edited.
- Output SHA-256: `477c4453ce07cadf1ddfca4fd51950ac2075d6bb93774011630dfc66e95c6ced`

### `htl/figure-3-detection-results.webp`

- Source locator: published Figure 3, PDF page 10 of 13; author source image `detections and labels.png`.
- Source image SHA-256: `90f572bacf747381ad2f9d8b8e0073cac8837aed17ef0cf43b74a373ebd55ad0`
- Transformation: retained at 1920 by 1080 pixels, converted to WebP at quality 90, and stripped of metadata. The detections, labels, confidence values, panels, and dataset names were not edited.
- Output SHA-256: `30ca1f315470137d52449d0f1d2f44e82aa75b33a6675143d178ffbe864a2f9c`

### `htl/table-3-systematic-benchmark.webp`

- Source locator: published Table 3, PDF page 8 of 13.
- Transformation: the published page was rendered at 220 DPI and cropped to the complete caption, table, highlights, and footnotes. The crop was encoded as lossless WebP at 1660 by 2090 pixels and stripped of metadata.
- Output SHA-256: `149fab018a7992e4df32de7dcb5685048aff5c289e09b8c8347569d1c3f13336`

### `htl/table-4-generalisation.webp`

- Source locator: published Table 4, PDF page 9 of 13.
- Transformation: the published page was rendered at 220 DPI and cropped to the complete caption, table, colour coding, and footnotes. The crop was encoded as lossless WebP at 1660 by 1610 pixels and stripped of metadata.
- Output SHA-256: `3fa5d1d4d8b10570fdcaf22c1cf9bee287b21a041f450f3e445befef4abededf`

### `htl/table-5-jetson-compilation.webp`

- Source locator: published Table 5, PDF page 10 of 13.
- Transformation: the published page was rendered at 220 DPI and cropped to the complete caption, table, and precision-grouped column labels. The crop was encoded as lossless WebP at 1660 by 1070 pixels and stripped of metadata.
- Source discrepancy retained: the abstract attributes 3.1 ms and approximately 322.6 FPS to YOLOv11-N. Table 5 prints 3.2 ms and 312.5 FPS for YOLOv11-N, while 3.1 ms and 322.6 FPS appear in the YOLOv8-N row.
- Output SHA-256: `56b785f969539b04dba0b0e55c49ac5657eaf7423413ef5576a94ad40b53f020`

## LASK paper-native package

- Public source: Choudhry, O., Ali, S., Rajasundaram, R., Biyani, C. S., and Jones, D. (2025), *7-DoF Laparoscopic Peg Transfer Dataset for Surgical Skill Assessment*, in the MIUA 2025 proceedings. https://doi.org/10.3389/978-2-8325-5137-0
- Published proceedings extract SHA-256: `3277cd65e3a5df64b412cfa9f4df4a9f9e8c17b231d219801c7ba2f53d043545`
- Text boundary: the website displays the abstract exactly as it appears in the published Frontiers extract. The earlier accepted author manuscript contains a longer opening and uses different ordinal numbers for the two Urology Boot Camps, so the companion does not silently merge those versions.
- Rights: the figures are author-created and used here with the lead author's permission. The website does not grant additional rights to the underlying figure.
- Disclosure retained: the source paper says ChatGPT 4o helped produce the "6D Pose" inset in Figure 1.

### `lask/figure-1-setup.webp`

- Source locator: published Figure 1.
- Transformation: extracted from the published proceedings paper, resized to 2000 by 856 pixels, converted to WebP at quality 90, and stripped of metadata without visual editing.
- Output SHA-256: `e4c51a8d0e7b7529022a856f7d7e3e7f0613a7b6a6b1c6fe9103f9bf590e9ffb`

### `lask/figure-1-annotation-detail.webp`

- Source locator: detail from the sample bounding-box panel in published Figure 1.
- Transformation: cropped to the published sample annotation panel, retained at 760 by 510 pixels, converted to WebP at quality 90, and stripped of metadata. No annotation or image content was added.
- Output SHA-256: `66cbf3506bb3afc7f36b5bb7ff6ea1cef139c5eb84f316914d3679539661d868`

## BTPN paper-native package

- Source: the exact abstract, source section headings, selected author-owned figures and tightly bounded final camera-ready table crops from the accepted MICCAI 2026 paper *Bayesian Temporal Pose Networks for Uncertainty-Calibrated Laparoscopic Tool Pose Tracking*.
- Public project record: [github.com/omariosc/BTPN](https://github.com/omariosc/BTPN) already publishes the title, abstract, method overview, aggregate results, figures, tables, and reproduction guidance. The companion checks those public materials against the accepted camera-ready paper.
- Rights: the lead author explicitly approved these materials for this public companion. Copyright remains with the authors pending publication.
- Accepted camera-ready PDF SHA-256: `69dc0c01b6b240eff5e887647ff51bdbdb03c8c5e094562514fa3fac2b23c719`.
- Publication boundary: the official proceedings URL is not available yet. The complete manuscript PDF, reviews, responses, affiliations, emails and workstation paths are not distributed.

### `btpn/figure-1-datasets.webp`

- Source locator: accepted-paper Figure 1, *Representative annotated frames from each dataset*.
- Author source hashes: Dataset A `3ead05579fcb86912b262094183fa4b011fbadb889710227e1ad6c18f9f6e098`; Dataset B `28ab2577e9b0c363c69be6ac2c198a9229b0ef3dc7e33fb9683fd256f1563f51`; Dataset C `6f6977832ab82a98374c91712572a500a30fd6fae6bb4bbd6c18e6dd126cfaea`.
- Transformation: the three authorised source panels were resized to a common height, joined in their paper order, converted to 2000 by 379 WebP at quality 88, and stripped of metadata. No annotation content was changed.
- Output SHA-256: `9a4973531ee187ade106b63a5447537c63f412902d462aab209c16fd261f8b49`

### `btpn/figure-2-architecture.webp`

- Source locator: accepted-paper Figure 2, *BTPN architecture overview*.
- Figure-only source SHA-256: `3db5d96700cafad8451a6a52812890c0935a9c0cba10bc079f1e23e99dc331bc`.
- Transformation: rendered from the authorised figure-only source, resized to 2000 by 1401 pixels, converted to WebP at quality 90, and stripped of metadata without visual editing.
- Output SHA-256: `132933cda789ff3a1746cea7d931ca444be9a2ee8c3492fdd8d4a320fdbfbd42`

### `btpn/figure-3-trajectories.webp`

- Source locator: accepted-paper Figure 3, *7-DoF predictions for a held-out trial sequence*.
- Figure-only source SHA-256: `0c93cddf15975484893c96623f4c4daba22758039450b75f778ab36b52fcde9a`.
- Transformation: rendered from the authorised figure-only source, converted to 1282 by 975 WebP at quality 91, and stripped of metadata without visual editing.
- Output SHA-256: `ad269f22df39e1b3d605d82935911799808bbb031a7df48077a28e4464581ab3`

### `btpn/figure-4-uncertainty.webp`

- Source locator: accepted-paper Figure 4, *Uncertainty quality assessment*.
- Figure-only source SHA-256: `5973fac88cd73707a0691c9e4d3d9fe95eacca9a8e6d54440eb4b8b630681bcd`.
- Transformation: rendered from the authorised figure-only source, converted to 1280 by 1039 WebP at quality 91, and stripped of metadata without visual editing.
- Output SHA-256: `e25c7e3646ea65b1472ac6442acfbd6a6945906a0da031871b8f57d9a4f6efd6`

### `btpn/table-1-datasets.webp`

- Source locator: accepted camera-ready Table 1, *Dataset overview*.
- Transformation: rendered camera-ready PDF page 3 at 300 DPI, cropped to Table 1 only, encoded as a 1470 by 330 WebP, and stripped of metadata. The crop includes only dataset-level counts and roles.
- Exclusions: no surrounding manuscript prose, participant-level records, affiliations, reviews, responses, emails, or private file paths are included.
- Output SHA-256: `b668c756264533c48072d3b649d0938fbda1c9f84bf92be61c48ac57fa6ddf7d`

### `btpn/table-2-quantitative-results.webp`

- Source locator: accepted camera-ready Table 2, *Quantitative results overview*.
- Transformation: rendered camera-ready PDF page 7 at 300 DPI, cropped to the complete Table 2 only, encoded as a 1470 by 1235 WebP, and stripped of metadata. The crop preserves all three panels and every baseline and ablation row.
- Exclusions: no surrounding manuscript prose, private comments, review text, response text, affiliations, emails, or private file paths are included.
- Output SHA-256: `8f80389c52336fa606b1dffbf019283914ac373fc78b26646d952e3cfed9c01b`

## Gallery captures

The three gallery images were captured in Chrome from the final local
paper-native routes at a 1440 by 900 viewport. They were encoded as WebP at
quality 88 and stripped of metadata.

- `screenshots/real-time-tool-detection-landing.webp`: `7543e1f40cc5f3cddb1c47c40b80218549d287337ab850f6b7ff2f8ac934306c`
- `screenshots/lask-7dof-landing.webp`: `7f10021fb9ea915b0ccaa5da4144f1b3ebb8f728fbd60dc0d9d336b2ff20f042`
- `screenshots/btpn-landing.webp`: `c079249f57e3ee1817ab457bafa38997f6d46cd73159cbd510efe8491be837f7`

## Claim boundary

The companion pages restructure source material and provide controls for comparing reported values. They do not run model inference, retrain a method, independently reproduce results, or establish clinical validity.
