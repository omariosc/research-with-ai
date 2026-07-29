# Source notice

This static demo vendors these original frontend files from
[omariosc/frame-annotator](https://github.com/omariosc/frame-annotator) at
public HEAD `0dcfc9e90dfd7867c58d3bc45f4508b19c4f4a5a`:

- `surgical_annotator/static/index.html`
- `surgical_annotator/static/css/styles.css`
- `surgical_annotator/static/js/main.js`

These frontend files are byte-identical to the local
`3e94ed03c1487331b8c041ca755421686b41d031` checkout used for the adaptation.

The source is available under the MIT licence in `LICENSE.txt`.

Static-demo changes are limited to:

- using demo-relative stylesheet and script paths;
- routing frame images and thumbnails through the bundled public fixtures;
- adding `demo-adapter.js` to serve the three disclosed LASK Trial46 examples;
- storing edits in localStorage; and
- adding one Reset demo control.

No Flask application, filesystem write, debug mode, pickle loader, model
service, or administrative route is included. The adapter handles every
`/api` request locally and does not send annotations to a server.
