# Source notice

This static demo vendors the original `frame_annotator/templates/annotator.html`
from [omariosc/frame-annotator](https://github.com/omariosc/frame-annotator) at
public HEAD `0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a`. The frontend file is
byte-identical to the local `3e94ed03c1487331b8c041ca755421686b41d031`
checkout used for the adaptation.

The source is available under the MIT licence in `LICENSE.txt`.

Static-demo changes are limited to:

- replacing Flask template values with the surgical-safety example config;
- replacing the Flask frame URL with the bundled fixture path;
- adding `demo-adapter.js` for localStorage-backed load, save, and reset;
- adding one Reset button; and
- bundling ten explicitly approved Hamlyn prototype frames.

The ten frames were decoded from the first ten frames of
`ppt/media/media1.mp4` inside the author-owned `Group Project.pptx`. They are
lossy presentation-recovery frames, retain the presentation's existing
overlays, and are not the missing raw `data/color_images` frames. Omar Choudhry
is the only identifiable person and explicitly approved these ten frames for
publication on 29 July 2026. Per-frame hashes are recorded in
`/worked-examples/annotation-showcase/manifest.json`.

The browser adapter does not upload annotations or call a model. It does not
include the Flask server, filesystem writes, debug mode, pickle loading, or
administrative routes.
