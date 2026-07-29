# Annotation showcase media and annotation record

Checked: 29 July 2026

This record covers the thirteen images and four annotation records published in the
interactive showcase. The browser creates an editable local working copy.
Visitor changes are not uploaded, written back to these files, or presented as
new research labels.

## Frame annotator examples

### Source, rights, and selection

The interface source is pinned to public
[omariosc/frame-annotator](https://github.com/omariosc/frame-annotator) commit
`0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a`. The vendored frontend files were
compared with that commit before adaptation. The repository is MIT licensed.

The ten published PNGs are not the synthetic sample frames distributed in that
repository. They were recovered from the author-owned `Group Project.pptx`
presentation used for the 2025 Hamlyn Winter School group project:

- PowerPoint SHA-256:
  `a12982546b8b1666859b09d7f7096c3a473e926c36eedeefc70edc2a3a7aee11`
- embedded member: `ppt/media/media1.mp4`
- embedded member SHA-256:
  `3a19c9a349ec4b48a76cc38744f82656b55906add831f85c5213db3b1fb5c587`
- video stream: MPEG-4, 640 by 480 pixels, 5 frames per second, 499 frames,
  99.8 seconds

The raw prototype `data/color_images` directory was unavailable. The first ten
sequential video frames were therefore decoded from the presentation member:

```sh
unzip -p "Group Project.pptx" ppt/media/media1.mp4 > hamlyn-media1.mp4
ffmpeg -i hamlyn-media1.mp4 -frames:v 10 -start_number 0 frame_%04d.png
```

This is a lossy presentation recovery, not a raw-frame recovery. The source
video was already compressed and the recovered frames retain the embedded
`Clip: 2`, `EXCESSIVE FORCE APPLIED`, and class-selection overlays. No new
overlay, crop, resize, or retouching was applied.

| Published file | Canonical position | Size | SHA-256 |
| --- | ---: | ---: | --- |
| `frame_0000.png` | 1 | 640 by 480 | `b9135360c32d2beb99bc92fc5758a69a10b9ca9a5237c52db468b0205e9a1ab1` |
| `frame_0001.png` | 2 | 640 by 480 | `63640edccefa31e3e702ddcd1d810f61994089d129eaeaced669870875a847f6` |
| `frame_0002.png` | 3 | 640 by 480 | `4012f237ad83084e9a9890689c2ba1ed52cf99c3f3cfee18cf1b45c40dd55f25` |
| `frame_0003.png` | 4 | 640 by 480 | `cc23e9008189d8733d45f8a762f0d8c5bd5df8044f16d4bffdd654783885b76b` |
| `frame_0004.png` | 5 | 640 by 480 | `820506b7668c3a95c5deae66d19f8ddff46b1e6a25da262012d656925274b01e` |
| `frame_0005.png` | 6 | 640 by 480 | `bf84be6e098d8d73b1233ba0b9c79be0d17be109b2dbd2c25809b620716cb5aa` |
| `frame_0006.png` | 7 | 640 by 480 | `6c2ce254198b41c5bc8f3397c3e7c4487436b0f9930a0751eaac8cd6500182ab` |
| `frame_0007.png` | 8 | 640 by 480 | `f938948fec27a22e448e846f4b633edb53fb3ef2c844a2f71aec513d3f2eb7d0` |
| `frame_0008.png` | 9 | 640 by 480 | `9d9b983be35af5fcf2d9a8db9d9536eb0ccc399484bff7db4570ca31c5ca1931` |
| `frame_0009.png` | 10 | 640 by 480 | `a6208111a7af8ac8984437c2cbebfd42b5bdaf03c002309fb9678a2fd1809a2a` |

Omar Choudhry is the only identifiable person in this ten-frame selection and
explicitly approved publication of these ten frames on 29 July 2026. This
approval does not extend to later frames or to missing raw prototype media.

### Teaching annotation

No original annotation JSON or CSV was recovered with the presentation video.
The demo therefore starts from a separately authored
`starter-annotations.json`. It reconstructs the visible Controller Collision
selection as one inclusive clip:

- status: nine labelled starting frames plus one empty practice frame
- native record shape: `{"clips":[{"start":0,"end":8,"class":"1c"}]}`
- SHA-256:
  `cf0a554d95dcade011e236f3c24a52d5d8db68861e2918712d617f0da4a27d54`

The record uses the tool's native clip structure and surgical-safety taxonomy.
The tenth frame is deliberately left empty so visitors can add a label
themselves. The record is included so the interface opens in a useful starting
state while keeping one frame ready for practice.

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

The browser demo uses the first two records as starting examples and clears the
annotations from frame 1800 at runtime. The original frame 1800 JSON remains in
this evidence pack, while the live interface gives visitors an empty final
frame to annotate themselves.

The public NPZ carries the released masks, keypoints, and visibility data. The
native JSON also retains working fields such as shaft lines and phase labels.
Those native-only fields should not be described as members of the Zenodo
archive.

| Published annotation | SHA-256 |
| --- | --- |
| `trial46_frame_0200.json` | `f3a14b5f5c1c9d29e1d5ba166de6d8e6ba9ad727fe3716559c3f53c7407f44ef` |
| `trial46_frame_1000.json` | `8ef8d291d6a12403eb6c7f7eb31a725e270331b8e3a48f16a39de5677f984378` |
| `trial46_frame_1800.json` | `6f5b8cca67b7ef64725778fdb03797ad74a3903b20a116cb9dd0072c0fdbded4` |

## Static demo implementation

Both demos vendor the original public frontend at commit
`0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a`. The frame demo retains the
original template's fonts, layout, timeline, controls, and shortcuts. The
surgical demo retains the original HTML, CSS, canvas workflow, sidebars,
controls, and JavaScript interaction model.

The server boundary was replaced with browser-only adapters:

- every `/api` request is intercepted locally;
- fixture reads come only from the files listed in this record;
- Save and Backup use localStorage;
- Reset removes the local draft and reloads the fixtures;
- SAM and other model services are unavailable; and
- no Flask server, filesystem write, debug mode, pickle loader, or
  administrative route is shipped.

The tutorial previews are browser captures of the static demos at 1512 by 827
pixels:

| Preview | SHA-256 |
| --- | --- |
| `annotation-demos/frame-annotator/preview.png` | `31cf3415a379dc9d8a1b53530fad3ba7f378a5fcf48799ceb680e1ac13899f7f` |
| `annotation-demos/surgical-annotator/preview.png` | `a763fa1b706e0718b96d7f4773c32ecf2b92b0ae5405d5bf61c9b203ff638bd6` |

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
