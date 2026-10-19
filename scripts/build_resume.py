# /// script
# requires-python = ">=3.11"
# dependencies = ["reportlab>=4.4", "fonttools[woff]>=4.59", "pypdf>=6"]
# ///

"""使用 uv 运行，生成可搜索文字、嵌入字体的三页 A4 简历。"""

import json
import os
from html import escape
from pathlib import Path

from fontTools.ttLib import TTFont as FontFile
from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/吴伟东-前端工程师.pdf"
TEMP = ROOT / "tmp/pdfs"
TEMP.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
DATA = json.loads((ROOT / "docs/resume/content.json").read_text())

# 系统中文字体仅嵌入本次所需字形，不拷贝或分发完整字体文件。
CJK_REGULAR = os.getenv("RESUME_FONT_REGULAR", "/System/Library/Fonts/STHeiti Light.ttc")
CJK_BOLD = os.getenv("RESUME_FONT_BOLD", "/System/Library/Fonts/STHeiti Medium.ttc")
CJK_INDEX = int(os.getenv("RESUME_FONT_INDEX", "1"))
pdfmetrics.registerFont(TTFont("ResumeSC", CJK_REGULAR, subfontIndex=CJK_INDEX))
pdfmetrics.registerFont(TTFont("ResumeSCBold", CJK_BOLD, subfontIndex=CJK_INDEX))
pdfmetrics.registerFontFamily("ResumeSC", normal="ResumeSC", bold="ResumeSCBold")

for weight in ("400", "500", "600"):
    source = ROOT / f"node_modules/@fontsource/outfit/files/outfit-latin-{weight}-normal.woff2"
    font = FontFile(source)
    font.flavor = None
    target = TEMP / f"outfit-{weight}.ttf"
    font.save(target)
    pdfmetrics.registerFont(TTFont(f"Outfit{weight}", str(target)))

WIDTH, HEIGHT = A4
LEFT = 43
RIGHT = WIDTH - LEFT
CONTENT_WIDTH = RIGHT - LEFT
BOTTOM = 47
INK = colors.HexColor("#192D2A")
ACCENT = colors.HexColor("#25766B")
MUTED = colors.HexColor("#687B75")
LINE = colors.HexColor("#D9E3DE")
SOFT = colors.HexColor("#F0F5F2")

BODY = ParagraphStyle(
    "正文", fontName="ResumeSC", fontSize=9.5, leading=14.5,
    textColor=INK, wordWrap="CJK", alignment=TA_LEFT,
    splitLongWords=False, allowWidows=False, allowOrphans=False,
)
EXPERIENCE_BODY = ParagraphStyle(
    "工作经历正文", parent=BODY, fontSize=9, leading=13,
)
SMALL = ParagraphStyle(
    "技术细节", parent=BODY, fontSize=8.25, leading=11.5, textColor=MUTED,
)
SUBTITLE = ParagraphStyle(
    "定位", parent=BODY, fontSize=8.5, leading=12, textColor=ACCENT,
)
TITLE = ParagraphStyle(
    "项目名称", parent=BODY, fontName="ResumeSCBold", fontSize=12.4, leading=18,
)
SECTION = ParagraphStyle(
    "章节", parent=TITLE, fontSize=12.7, leading=20,
)


def para(text, style=BODY):
    return Paragraph(text, style)


def plain(text):
    return escape(text)


def section(title, english):
    return [
        para(f'{plain(title)} <font name="Outfit500" size="7" color="#687B75"> / {plain(english)}</font>', SECTION),
        Spacer(1, 8),
    ]


def rows(items, label_width=72):
    content = [[para(plain(label), SUBTITLE), para(plain(text), SMALL)] for label, text in items]
    table = Table(content, colWidths=[label_width, CONTENT_WIDTH - label_width])
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 1),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    return table


def bullets(items, style=BODY, spacing=4.2):
    result = []
    for label, text in items:
        result.extend([
            para(f'<font color="#25766B">•</font> <b>{plain(label)}</b>  {plain(text)}', style),
            Spacer(1, spacing),
        ])
    return result


def metrics(items):
    cells = [[para(
        f'<font name="Outfit600" size="17" color="#25766B">{plain(value)}</font><br/>'
        f'<font size="8" color="#687B75">{plain(label)}</font>',
        ParagraphStyle("成果", parent=BODY, leading=18),
    ) for value, label in items]]
    table = Table(cells, colWidths=[CONTENT_WIDTH / len(items)] * len(items))
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), SOFT),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
    ]))
    return table


def project(item, number):
    result = [
        para(f'<font name="Outfit600" color="#25766B">{number:02d}</font>  {plain(item["name"])}', TITLE),
        Spacer(1, 3),
        para(plain(item["label"]), SUBTITLE),
        Spacer(1, 6),
        para(plain(item["intro"])),
        Spacer(1, 8),
    ]
    if item.get("stack"):
        result.extend([rows(item["stack"], 64), Spacer(1, 8)])
    if item.get("metrics"):
        result.extend([metrics(item["metrics"]), Spacer(1, 9)])
    return result + bullets(item["bullets"])


def experience(item):
    title = Table([[
        para(plain(item["company"]), TITLE),
        para(plain(item["period"]), ParagraphStyle("日期", parent=SUBTITLE, alignment=2)),
    ]], colWidths=[CONTENT_WIDTH - 120, 120])
    title.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    return [title, Spacer(1, 3), para(plain(item["role"]), SUBTITLE), Spacer(1, 6)] + bullets(item["bullets"], EXPERIENCE_BODY, spacing=3)


def linked_text(pdf, text, url, x, y, font="ResumeSC", size=8.5):
    pdf.setFont(font, size)
    pdf.setFillColor(MUTED)
    pdf.drawString(x, y, text)
    pdf.linkURL(url, (x, y - 2, x + pdfmetrics.stringWidth(text, font, size), y + size), relative=0)


def header(pdf, page):
    pdf.setFillColor(colors.white)
    pdf.rect(0, 0, WIDTH, HEIGHT, stroke=0, fill=1)
    pdf.setFillColor(ACCENT)
    pdf.rect(LEFT, HEIGHT - 42, 33, 3, stroke=0, fill=1)
    if page == 1:
        pdf.setFillColor(INK)
        pdf.setFont("ResumeSCBold", 27)
        pdf.drawString(LEFT, HEIGHT - 79, DATA["name"])
        pdf.setFont("Outfit500", 8)
        pdf.setFillColor(ACCENT)
        pdf.drawString(LEFT + 101, HEIGHT - 75, DATA["englishName"])
        pdf.setFillColor(INK)
        pdf.setFont("ResumeSCBold", 13)
        pdf.drawRightString(RIGHT, HEIGHT - 65, DATA["role"])
        pdf.setFont("Outfit400", 7)
        pdf.setFillColor(MUTED)
        pdf.drawRightString(RIGHT, HEIGHT - 79, "FRONTEND / AI / ENGINEERING")
        linked_text(pdf, DATA["email"], f'mailto:{DATA["email"]}', LEFT, HEIGHT - 104)
        linked_text(pdf, DATA["phone"], f'tel:{DATA["phone"]}', LEFT + 165, HEIGHT - 104)
        linked_text(pdf, "github.com/shindouhiro", DATA["github"], LEFT + 277, HEIGHT - 104)
        pdf.setFont("ResumeSC", 8.5)
        pdf.drawString(LEFT, HEIGHT - 121, f'地点：{DATA["location"]}')
        linked_text(pdf, "作品演示：" + DATA["website"], DATA["website"], LEFT + 73, HEIGHT - 121, size=7.5)
        linked_text(pdf, "在线简历：" + DATA["portfolio"], DATA["portfolio"], LEFT + 73, HEIGHT - 136, size=7.5)
        top = HEIGHT - 162
    else:
        pdf.setFont("ResumeSCBold", 10)
        pdf.setFillColor(INK)
        pdf.drawString(LEFT, HEIGHT - 61, f'{DATA["name"]} / {DATA["role"]}')
        pdf.setFont("Outfit500", 7)
        pdf.setFillColor(MUTED)
        pdf.drawRightString(RIGHT, HEIGHT - 61, "SELECTED PROJECTS" if page == 2 else "EXPERIENCE & EDUCATION")
        top = HEIGHT - 84
    pdf.setStrokeColor(LINE)
    pdf.setLineWidth(0.6)
    pdf.line(LEFT, 35, RIGHT, 35)
    pdf.setFillColor(MUTED)
    pdf.setFont("Outfit400", 7)
    pdf.drawString(LEFT, 23, DATA["englishName"])
    pdf.drawRightString(RIGHT, 23, f"{page:02d} / 03")
    return top


def page_content():
    first = section("技术专长", "TECHNICAL TOOLKIT") + [rows(DATA["skills"]), Spacer(1, 13)]
    first += section("核心项目", "SELECTED PROJECTS") + project(DATA["projects"][0], 1)
    second = section("核心项目", "SELECTED PROJECTS")
    for i, item in enumerate(DATA["projects"][1:], start=2):
        second += project(item, i) + [Spacer(1, 17)]
    third = section("工作经历", "PROFESSIONAL EXPERIENCE")
    for item in DATA["experiences"]:
        third += experience(item) + [Spacer(1, 10)]
    education = DATA["education"]
    third += section("教育经历", "EDUCATION") + [
        para(plain(education["school"]), TITLE), Spacer(1, 4),
        para(f'{plain(education["major"])} / {plain(education["degree"])}'
             f' <font color="#687B75"> · {plain(education["period"])}</font>'),
    ]
    return [first, second, third]


def build():
    pdf = canvas.Canvas(str(OUTPUT), pagesize=A4, pageCompression=1)
    pdf.setTitle(f'{DATA["name"]} | {DATA["role"]}')
    pdf.setAuthor(DATA["name"])
    pdf.setSubject("项目经验、技术专长、工作与教育经历")
    pdf.setKeywords("吴伟东, 前端工程师, React, Angular, Vue, AI, 全栈")
    for page, content in enumerate(page_content(), start=1):
        cursor = header(pdf, page)
        available = cursor - BOTTOM
        measured = [(item, item.wrap(CONTENT_WIDTH, HEIGHT)[1]) for item in content]
        total_height = sum(height for _, height in measured)
        if total_height > available:
            raise ValueError(f"第 {page} 页内容高 {total_height:.1f}，可用 {available:.1f}；请调整分页或间距。")
        for item, height in measured:
            cursor -= height
            item.drawOn(pdf, LEFT, cursor)
        print(f"第 {page} 页：内容 {total_height:.1f}pt，可用 {available:.1f}pt，末行 y={cursor:.1f}pt")
        pdf.showPage()
    pdf.save()
    reader = PdfReader(OUTPUT)
    assert len(reader.pages) == 3, "页数不符合设计"
    assert all(len(page.extract_text()) > 100 for page in reader.pages), "存在空白页或不可提取文字"
    print(f"已生成 {OUTPUT}，{OUTPUT.stat().st_size:,} 字节")


if __name__ == "__main__":
    build()
