# frame-annotator repository audit

Audit date: 26 July 2026

Repository: <https://github.com/omariosc/frame-annotator>
Pinned commit: `3e94ed03c1487331b8c041ca755421686b41d031`

## Question

Can the repository be installed and can its existing test suite be run from a clean checkout before any research-facing change is proposed?

## Environment

- macOS Darwin 25.5.0 on arm64
- Python 3.14.6
- pip 26.1.2
- Fresh Git clone
- Fresh virtual environment named `.audit-venv` for dependency isolation

The repository is author-owned and the pinned revision was reviewed before
installation. A Python virtual environment is not a security sandbox and does
not restrict host files, secrets, processes, or network access.

## Recorded procedure

```sh
git clone https://github.com/omariosc/frame-annotator.git
cd frame-annotator
git checkout 3e94ed03c1487331b8c041ca755421686b41d031
python3 -m venv .audit-venv
.audit-venv/bin/python -m pip install -e .
.audit-venv/bin/python -m pytest -q
```

The clean-environment run reported:

```text
.............                                                            [100%]
13 passed in 0.35s
```

A repeat on the same installed environment on 26 July 2026 reported:

```text
.............                                                            [100%]
13 passed in 0.16s
```

The resolved environment was:

```text
blinker==1.9.0
click==8.4.2
Flask==3.1.3
frame-annotator @ 3e94ed03c1487331b8c041ca755421686b41d031
iniconfig==2.3.0
itsdangerous==2.2.0
Jinja2==3.1.6
MarkupSafe==3.0.3
numpy==2.5.1
packaging==26.2
pillow==12.3.0
pip==26.1.2
pluggy==1.6.0
Pygments==2.20.0
pytest==9.1.1
PyYAML==6.0.3
Werkzeug==3.1.8
```

## Human inspection

- `pytest --collect-only -q` listed 13 tests under `tests/test_app.py` and
  `tests/test_config.py`; none targeted `surgical_annotator`. The two test
  modules import only `frame_annotator`:
  [application test imports](https://github.com/omariosc/frame-annotator/blob/3e94ed03c1487331b8c041ca755421686b41d031/tests/test_app.py#L1-L8) and
  [configuration test imports](https://github.com/omariosc/frame-annotator/blob/3e94ed03c1487331b8c041ca755421686b41d031/tests/test_config.py#L1-L2).
- The surgical application defaults to `0.0.0.0` and calls Flask with
  `debug=True`:
  [`surgical_annotator/app.py`](https://github.com/omariosc/frame-annotator/blob/3e94ed03c1487331b8c041ca755421686b41d031/surgical_annotator/app.py#L81-L99).
- The exporter contains fixed Windows dataset paths:
  [`surgical_annotator/export_yolo.py`](https://github.com/omariosc/frame-annotator/blob/3e94ed03c1487331b8c041ca755421686b41d031/surgical_annotator/export_yolo.py#L97-L101).

The collection command returned:

```text
tests/test_app.py::test_index
tests/test_app.py::test_get_frames
tests/test_app.py::test_load_annotations_empty
tests/test_app.py::test_save_and_load_annotations
tests/test_config.py::test_default_config
tests/test_config.py::test_validate_minimal
tests/test_config.py::test_validate_rejects_no_classes
tests/test_config.py::test_validate_rejects_missing_fields
tests/test_config.py::test_validate_rejects_duplicate_ids
tests/test_config.py::test_validate_rejects_invalid_color
tests/test_config.py::test_validate_rejects_duplicate_shortcuts
tests/test_config.py::test_validate_subcategories
tests/test_config.py::test_validate_rejects_long_subcategory_id

13 tests collected in 0.13s
```

## Claim boundary

This record shows that 13 existing tests passed at one pinned commit in the stated environment. It does not validate the surgical annotation workflow, annotation accuracy, clinical use, data governance, security, or portability to another environment. Timings are incidental and are not a performance benchmark.
