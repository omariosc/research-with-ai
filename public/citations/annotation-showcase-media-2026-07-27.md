# Annotation showcase media and annotation record

Checked: 27 July 2026

This record covers the six images and four annotation records published in the
interactive showcase. The browser creates an editable local working copy.
Visitor changes are not uploaded, written back to these files, or presented as
new research labels.

## Frame annotator examples

### Source, rights, and selection

The three PNG files are byte-for-byte copies of the first three sample images
in canonical filename order from
[omariosc/frame-annotator](https://github.com/omariosc/frame-annotator) at
commit `3e94ed03c1487331b8c041ca755421686b41d031`. The source repository identifies
Omar Choudhry as the copyright holder and uses the MIT licence. The images were
not cropped, resized, retouched, or overlaid.

| Published file | Canonical position | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `frame_0000.png` | 1 | 320 by 240 | `0e270f6cd8b57ee6fd7983b84e46e6a16f349ebcad77ce7409410494762e943a` |
| `frame_0001.png` | 2 | 320 by 240 | `f70d7bd4f52fa91fe071c8260744ff376205134fa8d7eadf8e4776565830bb67` |
| `frame_0002.png` | 3 | 320 by 240 | `087f68912d227bada81eff67de4ac3e7d68dc2e4440b61f1173d12dd1a3e32c8` |

This is a deliberate privacy selection, not a representative sample. The
author approved only these first three images because he is not clearly
identifiable in them. No later frame image is included. Later images were not
opened for this provenance review.

### Teaching annotation

The pinned sample directory contains no saved annotation JSON or CSV. The
showcase therefore starts from the separately authored
`starter-annotations.json`, which contains one inclusive positive clip covering
frames 0 and 1:

- status: three-frame teaching record
- native record shape: `{"clips":[{"start":0,"end":1,"class":"positive"}]}`
- SHA-256:
  `1ef19d0e7eb12a2d65bf7304e362ea5a88038fe170c4909e5fd0841cd5341983`

The record uses the tool's native clip structure and default Positive/Negative
taxonomy. It is not a historical annotation, source ground truth, or evidence
that either visible activity was judged positive in a research study.

## Surgical annotator examples

### Dataset attribution

The three JPEG files are non-in-vivo peg-transfer frames from the following
public dataset:

> Choudhry, O., and Jones, D. (2026). *LASK: A Dataset for Laparoscopic Skill
> and 7-DoF Kinematics* (Version 1.0) [Dataset]. Zenodo.
> https://doi.org/10.5281/zenodo.20752651

- creators: Omar Choudhry and Dominic Jones
- version DOI:
  [10.5281/zenodo.20752651](https://doi.org/10.5281/zenodo.20752651)
- all-versions DOI:
  [10.5281/zenodo.20752650](https://doi.org/10.5281/zenodo.20752650)
- licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/),
  formally Creative Commons Attribution 4.0 International
- source archive: `DatasetA_7DOF_train.zip`
- source archive MD5: `59ec32280bfe2874209ce5c5603a7de1`
- video member: `DatasetA_7DOF_train/videos/Trial46.mp4`
- released annotation member:
  `DatasetA_7DOF_train/annotations/Trial46.npz`

### Still extraction

The complete `Trial46.mp4` member was reconstructed from the Zenodo ZIP using
HTTP range requests, then decoded with FFmpeg. The extraction selected
zero-based source frames 200, 1000, and 1800:

```sh
ffmpeg -i Trial46.mp4 \
  -vf "select='eq(n,200)+eq(n,1000)+eq(n,1800)'" \
  -vsync 0 -q:v 2 selected_%04d.jpg
```

The three outputs were renamed to carry their source frame numbers. FFmpeg
decoded the source video and encoded new JPEG files at quality setting 2. No
crop, resize, retouching, or annotation overlay was applied, and all three
published stills remain 1280 by 720 pixels.

| Published still | Zero-based frame | SHA-256 |
| --- | ---: | --- |
| `trial46_frame_0200.jpg` | 200 | `8af5bc7f36b35342109b84073b89f158de29200b1bdfc56c46a4d069ae2593b5` |
| `trial46_frame_1000.jpg` | 1000 | `f2e0b75b81246c152c7e2a155c86c9b3180791a4b83d3e7f0aac471bc688f92e` |
| `trial46_frame_1800.jpg` | 1800 | `519af5c90080c605266a625a53929a21c08b64a212c7bca13b1e67a0b913fc8c` |

### Paired native annotations

Each paired JSON file is a byte-for-byte copy of Omar Choudhry's original
native `surgical-annotator` record for that frame. The JSON files were not
reconstructed from the public NPZ. Their mask and keypoint arrays were compared
with `Trial46.npz` and matched within float32 rounding, with a maximum observed
difference below 0.00006 pixels.

The public NPZ carries the released masks, keypoints, and visibility data. The
native JSON also retains working fields such as shaft lines and phase labels.
Those native-only fields should not be described as members of the Zenodo
archive.

| Published annotation | SHA-256 |
| --- | --- |
| `trial46_frame_0200.json` | `f3a14b5f5c1c9d29e1d5ba166de6d8e6ba9ad727fe3716559c3f53c7407f44ef` |
| `trial46_frame_1000.json` | `8ef8d291d6a12403eb6c7f7eb31a725e270331b8e3a48f16a39de5677f984378` |
| `trial46_frame_1800.json` | `6f5b8cca67b7ef64725778fdb03797ad74a3903b20a116cb9dd0072c0fdbded4` |

## Claim boundary

These examples demonstrate how the two real interfaces organise repeated
annotation work. The images are not clinical scenes. The showcase is not
evidence of annotation accuracy, inter-rater reliability, model performance,
clinical performance, or a fresh AI prediction.

The deposited LASK visual labels are manual. AI coding tools helped implement
and iterate the annotation software. The human researcher defined the protocol,
performed and checked the annotations, and remains responsible for the released
labels. A visitor's browser edits are temporary teaching changes and do not
alter LASK, the native source records, or the files in this repository.
