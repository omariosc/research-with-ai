#!/usr/bin/env python3
"""Generate four MICCAI MEC submission PDFs from the edited form draft."""

from __future__ import annotations

import argparse
import hashlib
import re
import shutil
from dataclasses import dataclass
from html import escape
from pathlib import Path

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "output" / "MEC_2026_SUBMISSION_FORM_DRAFTS.md"
DEFAULT_SCREENSHOT_DIR = ROOT / "tmp" / "pdfs" / "landing-pages"
DEFAULT_OUTPUT_DIR = ROOT / "output" / "pdf"

PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT_MARGIN = 18 * mm
RIGHT_MARGIN = 18 * mm
TOP_MARGIN = 17 * mm
BOTTOM_MARGIN = 16 * mm
CONTENT_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

PAPER = colors.HexColor("#FAF9F5")
INK = colors.HexColor("#171715")
MUTED = colors.HexColor("#5D5A53")
RULE = colors.HexColor("#D8D4CA")
SOFT = colors.HexColor("#F0EEE7")

ACCENTS = (
    colors.HexColor("#315EB5"),
    colors.HexColor("#9A6418"),
    colors.HexColor("#28704A"),
    colors.HexColor("#A32D55"),
)

SCREENSHOTS = (
    "agentic-research.png",
    "interactive-paper.png",
    "annotation-tools.png",
    "ai-healthcare-conference.png",
)


@dataclass(frozen=True)
class SubmissionDraft:
    ordinal: int
    title: str
    keywords: tuple[str, ...]
    tldr: str
    abstract_paragraphs: tuple[str, ...]
    filename: str
    workshop_url: str
    screenshot: Path
    accent: colors.Color

    @property
    def abstract(self) -> str:
        return "\n\n".join(self.abstract_paragraphs)


def fenced_value(block: str, label: str) -> str:
    pattern = re.compile(
        rf"^### {re.escape(label)}\s*\n\n```text\n(.*?)\n```",
        flags=re.MULTILINE | re.DOTALL,
    )
    match = pattern.search(block)
    if not match:
        raise ValueError(f"Missing fenced field: {label}")
    return match.group(1).strip()


def parse_drafts(source: Path, screenshot_dir: Path) -> list[SubmissionDraft]:
    text = source.read_text(encoding="utf-8")
    if re.search(r"[\u2010-\u2015]", text):
        raise ValueError("The submission Markdown contains a non-ASCII dash.")

    matches = list(
        re.finditer(
            r"^# Submission ([1-4]) of 4\s*\n(.*?)(?=^# Submission [1-4] of 4|\Z)",
            text,
            flags=re.MULTILINE | re.DOTALL,
        )
    )
    if len(matches) != 4:
        raise ValueError(f"Expected four submission blocks, found {len(matches)}.")

    drafts: list[SubmissionDraft] = []
    for index, match in enumerate(matches):
        ordinal = int(match.group(1))
        if ordinal != index + 1:
            raise ValueError("Submission blocks are not ordered from 1 to 4.")

        block = match.group(2)
        title = fenced_value(block, "Title*")
        keywords_raw = fenced_value(block, "Keywords*")
        tldr = fenced_value(block, "TL;DR")
        abstract = fenced_value(block, "Abstract*")
        pdf_field = fenced_value(block, "PDF*")

        tutorial_match = re.search(
            r"^- \*\*Tutorial:\*\* <(https://[^>]+)>",
            block,
            flags=re.MULTILINE,
        )
        if not tutorial_match:
            raise ValueError(f"Submission {ordinal} has no Tutorial URL.")
        workshop_url = tutorial_match.group(1)

        filename_match = re.search(r"([A-Za-z0-9_.-]+\.pdf)", pdf_field)
        if not filename_match:
            raise ValueError(f"Submission {ordinal} has no valid PDF filename.")
        filename = filename_match.group(1)

        keywords = tuple(part.strip() for part in keywords_raw.split(","))
        if not keywords or any(not keyword for keyword in keywords):
            raise ValueError(f"Submission {ordinal} has an invalid keyword list.")
        if len(title) > 250:
            raise ValueError(f"Submission {ordinal} title exceeds 250 characters.")
        if len(tldr) > 250:
            raise ValueError(f"Submission {ordinal} TL;DR exceeds 250 characters.")
        if len(abstract) > 5000:
            raise ValueError(f"Submission {ordinal} abstract exceeds 5,000 characters.")

        screenshot = screenshot_dir / SCREENSHOTS[index]
        if not screenshot.is_file():
            raise FileNotFoundError(f"Missing landing-page screenshot: {screenshot}")
        with PILImage.open(screenshot) as image:
            if image.size != (1440, 900):
                raise ValueError(
                    f"Expected a 1440x900 screenshot at {screenshot}, got {image.size}."
                )

        drafts.append(
            SubmissionDraft(
                ordinal=ordinal,
                title=title,
                keywords=keywords,
                tldr=tldr,
                abstract_paragraphs=tuple(
                    paragraph.strip()
                    for paragraph in re.split(r"\n\s*\n", abstract)
                    if paragraph.strip()
                ),
                filename=filename,
                workshop_url=workshop_url,
                screenshot=screenshot,
                accent=ACCENTS[index],
            )
        )

    if len({draft.filename for draft in drafts}) != 4:
        raise ValueError("PDF filenames must be unique.")
    if len({draft.workshop_url for draft in drafts}) != 4:
        raise ValueError("Workshop URLs must be unique.")
    return drafts


def styles(accent: colors.Color) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "Kicker",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=10,
            textColor=accent,
            tracking=1.15,
            spaceAfter=7,
        ),
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Times-Bold",
            fontSize=26,
            leading=29,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=7,
        ),
        "author": ParagraphStyle(
            "Author",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.5,
            leading=12,
            textColor=MUTED,
            spaceAfter=10,
        ),
        "label": ParagraphStyle(
            "Label",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=11,
            textColor=accent,
            tracking=0.8,
            spaceBefore=4,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.4,
            leading=12.8,
            textColor=INK,
            spaceAfter=6,
        ),
        "keywords": ParagraphStyle(
            "Keywords",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.2,
            leading=12.2,
            textColor=INK,
            spaceAfter=6,
        ),
        "tldr": ParagraphStyle(
            "TLDR",
            parent=base["BodyText"],
            fontName="Times-Bold",
            fontSize=11.5,
            leading=15,
            textColor=INK,
            spaceAfter=0,
        ),
        "page_two_title": ParagraphStyle(
            "PageTwoTitle",
            parent=base["Heading1"],
            fontName="Times-Bold",
            fontSize=22,
            leading=25,
            textColor=INK,
            spaceAfter=8,
        ),
        "url": ParagraphStyle(
            "URL",
            parent=base["BodyText"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=accent,
            alignment=TA_LEFT,
            wordWrap="CJK",
        ),
        "caption": ParagraphStyle(
            "Caption",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.3,
            leading=10.8,
            textColor=MUTED,
            spaceBefore=5,
            spaceAfter=8,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.2,
            leading=11,
            textColor=MUTED,
            spaceAfter=4,
        ),
    }


def linked_url(url: str, accent: colors.Color) -> str:
    safe_url = escape(url, quote=True)
    color_value = accent.hexval()[2:]
    return (
        f'<link href="{safe_url}" color="#{color_value}">'
        f"<u>{escape(url)}</u></link>"
    )


def canvas_callback(draft: SubmissionDraft):
    def draw_page(canvas, document) -> None:
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, stroke=0, fill=1)
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.5)
        canvas.line(
            LEFT_MARGIN,
            BOTTOM_MARGIN - 3.5 * mm,
            PAGE_WIDTH - RIGHT_MARGIN,
            BOTTOM_MARGIN - 3.5 * mm,
        )
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(MUTED)
        canvas.drawString(
            LEFT_MARGIN,
            BOTTOM_MARGIN - 8 * mm,
            "MICCAI Educational Challenge 2026",
        )
        canvas.drawRightString(
            PAGE_WIDTH - RIGHT_MARGIN,
            BOTTOM_MARGIN - 8 * mm,
            f"Omar Choudhry  |  {document.page}",
        )
        canvas.setTitle(draft.title)
        canvas.setAuthor("Omar Choudhry")
        canvas.setSubject("MICCAI Educational Challenge 2026 interactive tutorial")
        canvas.setKeywords(", ".join(draft.keywords))
        canvas.setCreator("Research with AI")
        canvas._doc.Catalog.Lang = PDFString("en-GB")
        canvas.restoreState()

    return draw_page


def build_pdf(draft: SubmissionDraft, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    page_styles = styles(draft.accent)
    document = SimpleDocTemplate(
        str(destination),
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN,
        title=draft.title,
        author="Omar Choudhry",
        subject="MICCAI Educational Challenge 2026 interactive tutorial",
    )

    story = [
        Paragraph("MICCAI EDUCATIONAL CHALLENGE 2026", page_styles["kicker"]),
        Paragraph(escape(draft.title), page_styles["title"]),
        Paragraph("Omar Choudhry", page_styles["author"]),
        Paragraph("KEYWORDS", page_styles["label"]),
        Paragraph(escape(", ".join(draft.keywords)), page_styles["keywords"]),
    ]

    tldr_box = Table(
        [[Paragraph(f"<b>TL;DR</b><br/>{escape(draft.tldr)}", page_styles["tldr"])]],
        colWidths=[CONTENT_WIDTH],
        hAlign="LEFT",
    )
    tldr_box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                ("BOX", (0, 0), (-1, -1), 0.8, draft.accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.extend(
        [
            tldr_box,
            Spacer(1, 5 * mm),
            Paragraph("ABSTRACT", page_styles["label"]),
        ]
    )
    for paragraph in draft.abstract_paragraphs:
        story.append(Paragraph(escape(paragraph), page_styles["body"]))

    with PILImage.open(draft.screenshot) as screenshot:
        screenshot_width, screenshot_height = screenshot.size
    rendered_height = CONTENT_WIDTH * screenshot_height / screenshot_width

    story.extend(
        [
            PageBreak(),
            Paragraph("INTERACTIVE WORKSHOP", page_styles["kicker"]),
            Paragraph(escape(draft.title), page_styles["page_two_title"]),
            Paragraph("Open the complete workshop", page_styles["label"]),
            Table(
                [[Paragraph(linked_url(draft.workshop_url, draft.accent), page_styles["url"])]],
                colWidths=[CONTENT_WIDTH],
                hAlign="LEFT",
                style=TableStyle(
                    [
                        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
                        ("BOX", (0, 0), (-1, -1), 0.8, draft.accent),
                        ("LEFTPADDING", (0, 0), (-1, -1), 10),
                        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                        ("TOPPADDING", (0, 0), (-1, -1), 9),
                        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
                    ]
                ),
            ),
            Spacer(1, 7 * mm),
            Image(
                str(draft.screenshot),
                width=CONTENT_WIDTH,
                height=rendered_height,
            ),
            Paragraph(
                "Landing page of the live interactive workshop. The written URL above "
                "is clickable in this PDF.",
                page_styles["caption"],
            ),
            Spacer(1, 4 * mm),
            Paragraph(
                "<b>Citation:</b> "
                f"Choudhry, O. (2026). <i>{escape(draft.title)}</i>. "
                "MICCAI Educational Challenge 2026.",
                page_styles["small"],
            ),
            Paragraph(
                '<b>Repository:</b> '
                '<link href="https://github.com/omariosc/research-with-ai" '
                'color="#315EB5"><u>https://github.com/omariosc/research-with-ai</u></link>',
                page_styles["small"],
            ),
            Paragraph(
                "<b>Licence:</b> Original tutorial text and interface graphics are "
                "CC BY 4.0. Repository software is MIT licensed.",
                page_styles["small"],
            ),
            Paragraph(
                "<b>AI use:</b> ChatGPT, Codex, and Claude assisted with research, "
                "drafting, implementation, and testing. The examples, judgements, "
                "and final text come from Omar Choudhry's research and event work.",
                page_styles["small"],
            ),
        ]
    )

    callback = canvas_callback(draft)
    document.build(story, onFirstPage=callback, onLaterPages=callback)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--screenshots", type=Path, default=DEFAULT_SCREENSHOT_DIR)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument(
        "--copy-downloads",
        action="store_true",
        help="Copy the generated PDFs to the current user's Downloads folder.",
    )
    arguments = parser.parse_args()

    drafts = parse_drafts(arguments.source.resolve(), arguments.screenshots.resolve())
    generated: list[Path] = []
    for draft in drafts:
        output_path = arguments.output.resolve() / draft.filename
        build_pdf(draft, output_path)
        generated.append(output_path)

    downloads = Path.home() / "Downloads"
    if arguments.copy_downloads:
        downloads.mkdir(parents=True, exist_ok=True)
        for output_path in generated:
            shutil.copy2(output_path, downloads / output_path.name)

    for path in generated:
        message = (
            f"{path.name}\t{path.stat().st_size} bytes\tsha256={sha256(path)}"
        )
        if arguments.copy_downloads:
            copied = downloads / path.name
            if sha256(copied) != sha256(path):
                raise RuntimeError(f"Downloads copy differs from {path.name}.")
            message += f"\tDownloads={copied}"
        print(message)


if __name__ == "__main__":
    main()
