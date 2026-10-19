#!/usr/bin/env python3
"""Self-check index.html sebelum push. Exit != 0 = jangan lanjut.

Cek yang dibuat portfolio-design aturan non-negotiable #1-#12, plus integrity.
"""
import re
import sys
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / "index.html").read_text(encoding="utf-8")

errors, warnings, checks = [], [], 0


def need(label, ok, hint=""):
    global checks
    checks += 1
    if not ok:
        errors.append(f"{label}" + (f" — {hint}" if hint else ""))


# 1. Anchor internal harus punya target
anchors = set(re.findall(r'id="([^"]+)"', html))
for href in re.findall(r'href="#([^"]+)"', html):
    need(f"anchor #{href} tidak ada targetnya", href in anchors, "section hilang atau id salah")

# 2. Tidak boleh ada kebocoran template / nilai kosong
for bad in ("{{", "undefined", "None", "null", "[object Object]"):
    need(f"kebocoran nilai: {bad}", bad not in html)
need("placeholder TODO masih ada", "TODO" not in html)

# Repr Python bocor ke HTML (mis. tuple ('a', 'b') dari label yang salah bentuk).
# Sudah pernah terjadi: heading Kontak render literally. Guard ini jenis bug
# yang tidak terlihat di diff, cuma kelihatan di screenshot.
need("repr tuple/dict Python bocor", not re.search(r"\(\s*'[A-Za-z]", html))
need("kutip tunggal tak Apertur", not re.search(r"[\w\)]\s*,\s*'[A-Z][a-z]+'", html))

# 2b. Atribut tidak boleh berisi markup — helper t() pernah bocor ke sini
for attr in ("aria-label", "title", "alt", "content"):
    for m in re.findall(rf'{attr}="([^"]*)"', html):
        need(f'{attr} berisi markup: {m[:40]}', "<" not in m)

# 3. Aksesibilitas
need("#1 skip link", 'class="skip-link"' in html and 'href="#main"' in html)
need("#2 smooth scroll", "scroll-behavior: smooth" in (ROOT / "assets/css/theme.css").read_text())
need("#3 prefers-reduced-motion", "prefers-reduced-motion" in (ROOT / "assets/css/theme.css").read_text())
need("#6 no emoji sebagai icon", not re.search(r'aria-hidden="true">[\U0001F300-\U0001FAFF☀-➿]', html))
need("#8 focus-visible", ":focus-visible" in (ROOT / "assets/css/theme.css").read_text())
need("setiap <img> punya alt", all('alt=' in i for i in re.findall(r"<img\b[^>]*>", html)))
for tag in re.findall(r"<button\b[^>]*>", html):
    need("tombol tanpa accessible name", "aria-label=" in tag or "sr-only" in tag, tag[:60])
for tag in re.findall(r'<a\b(?![^>]*aria-label)[^>]*>(?:\s*)</a>', html):
    need("<a> kosong tanpa nama aksesibel", False, tag[:60])

# 4. Bilingual
need("toggling bahasa (data-lang)", html.count("data-lang=") >= 40,
     f"hanya {html.count('data-lang=')} kemunculan")
need("rule html[lang] menyembunyikan bahasa lain",
     'html[lang="id"] [data-lang="en"]' in (ROOT / "assets/css/theme.css").read_text(),
     "tambahkan ke theme.css")

# 5. Link eksternal aman
for href in re.findall(r'href="(http[^"]+)"', html):
    need(f"link eksternal http:// : {href}", href.startswith("https://"))
for href in re.findall(r'<a\b[^>]*target="_blank"[^>]*>', html):
    need("target=_blank tanpa rel=noopener", "noopener" in href, href[:60])

# 6. SEO & wajib ada
need("canonical", 'rel="canonical"' in html)
need("Open Graph image", 'property="og:image"' in html)
need("JSON-LD Person", '"@type": "Person"' in html)
need("disclaimer ada di footer", "not financial or investment advice" in html or
     "nasihat keuangan atau investasi" in html)
need("viewport", 'name="viewport"' in html)
need("favicon", "favicon" in html)
need("preconnect Google Fonts", html.count('rel="preconnect"') >= 2)

# 7. Struktur repo
for f in ("robots.txt", "sitemap.xml", ".nojekyll", "assets/js/main.js", "assets/css/theme.css"):
    need(f"file wajib hilang: {f}", (ROOT / f).exists())
need("404.html belum dibuat", (ROOT / "404.html").exists(),
     "GitHub Pages selalu butuh 404.html")

# 8. Asset yang dirujuk harus ada (og.png hilang = preview sosmed rusak)
for ref in set(re.findall(r'(?:href|src|content)="(/assets/[^"]+)"', html)):
    need(f"asset hilang: {ref}", (ROOT / ref.lstrip("/")).exists())

# 9. Audit no-slop-ui + spesifikasi task
js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")

# Menu mobile harus benar-benar ada (v1: link nav hilang total di <768px)
need("tombol menu mobile", "data-menu-toggle" in html and "aria-controls=" in html)
need("menu mobile punya target", 'id="site-menu"' in html)
need("menu bisa ditutup dengan Escape", "Escape" in js)

# Landmark semantik
for tag in ("<header", "<nav", "<main", "<footer"):
    need(f"landmark {tag}> hilang", tag in html)
need("skip link menuju #main", 'href="#main"' in html and 'id="main"' in html)

# no-slop: banned-patterns menyebut "<small>SECTION LABEL</small> + h2".
# Dua aturan ini bisa diuji (regex "eyebrow sebelum h2" selalu lolos, jangan dipakai).
need("pakai <small> untuk label section", "<small" not in html)
need("heading di-cap all-caps + tracking",
     not re.search(r'<h[123][^>]*class="[^"]*uppercase[^"]*tracking-w', html))

# no-slop: tanpa scale/translate pada hover
for bad in ("hover:scale", "hover:-translate", "hover:translate", "group-hover:scale"):
    need(f"efek transform pada hover: {bad}", bad not in html)
need("ada animasi masuk (.rise) — konten tertunda", "rise" not in html and "rise" not in js)

# no-slop: radius tidak berlebihan
need("radius kartu > 12px", "rounded-2xl" not in html and "rounded-3xl" not in html)

# Permukaan brand tidak boleh mewarisi token body (kontras gagal di light mode)
for m in re.findall(r'class="([^"]*bg-brand[^"]*)"', html):
    need(f"permukaan brand pakai token non-on-brand: {m[:50]}",
         not re.search(r"text-(body|muted|accent|primary)\b", m))

# Tombol/link di dalam section brand tidak boleh memakai token body/muted/accent
brand_sec = re.search(r'<section[^>]*class="[^"]*bg-brand[^"]*".*?</section>', html, re.S)
need("section brand tidak ketemu", brand_sec is not None)
if brand_sec:
    for a in re.findall(r'<a\b[^>]*>', brand_sec.group(0)):
        need(f"tombol di surface brand pakai token non-on-brand: {a[:60]}",
             "text-on-brand" in a and not re.search(r"text-(body|muted|accent)\b", a))
need("ada gaya btn 'solid' yang tidak dikenal",
     '"solid"' not in (ROOT / "scripts/render.py").read_text(encoding="utf-8"))

# Model konten proyek: problem / role / approach / result
need("baris labelled <dt> untuk setiap proyek (problem/role/approach/result)",
     html.count("<dt ") >= 4 * html.count("<article class="))
need("proyek tanpa model konten lengkap", html.count('<dl class="mt-4">') >= 1)

# Gambar: dimensi eksplisit supaya tidak shift layout
for img in re.findall(r"<img\b[^>]*>", html):
    need("gambar tanpa width/height eksplisit", "width=" in img and "height=" in img, img[:60])
    need("gambar tanpa alt", "alt=" in img, img[:60])

# Penanda section aktif
need("tanpa dukungan aria-current", "aria-current" in js)

# 10. Ukuran wajar (Turun dari CDN bukan bundle, tapi jangan sampai gemsar)
need(f"index.html gemuk ({len(html):,} bita)", len(html) < 120_000)

for w in warnings:
    print(f"WARN  {w}")
for e in errors:
    print(f"FAIL  {e}")
if errors:
    print(f"\n{len(errors)}/{checks} cek gagal -> jangan lanjut push")
    sys.exit(1)
print(f"OK  {checks} cek lolos, 0 error")