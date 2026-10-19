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

# 9. Ukuran wajar (Turun dari CDN bukan bundle, tapi jangan sampai gemsar)
need(f"index.html gemuk ({len(html):,} bita)", len(html) < 120_000)

for w in warnings:
    print(f"WARN  {w}")
for e in errors:
    print(f"FAIL  {e}")
if errors:
    print(f"\n{len(errors)}/{checks} cek gagal -> jangan lanjut push")
    sys.exit(1)
print(f"OK  {checks} cek lolos, 0 error")