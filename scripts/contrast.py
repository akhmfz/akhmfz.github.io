#!/usr/bin/env python3
"""Audit kontras WCAG 2.2 untuk theme.css. Exit != 0 = ada pasangan yang gagal.

    python3 scripts/contrast.py

Target: teks normal >= 4.5:1, teks besar (>=18.66px bold / 24px) >= 3:1,
komponen UI & boundary >= 3:1.
"""
import re
import sys
from pathlib import Path

CSS = Path(__file__).resolve().parent.parent / "assets" / "css" / "theme.css"


def srgb(c):
    c /= 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(hexstr):
    h = hexstr.lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    r, g, b = (int(h[i:i + 2], 16) for i in (0, 2, 4))
    return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b)


def ratio(a, b):
    la, lb = lum(a), lum(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def tokens(css):
    """:root = tema gelap (default), html.light = tema terang.

    html.dark hanya berisi color-scheme, jadi mewarisi :root."""
    out = {}
    for name, pattern in (("dark", r":root\s*\{(.*?)\n\}"),
                          ("light", r"html\.light\s*\{(.*?)\n\}")):
        m = re.search(pattern, css, re.S)
        block = {}
        if m:
            for var, val in re.findall(r"(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;", m.group(1)):
                block[var] = val
        out[name] = block
    return out


# (foreground, background, minimum, label)
PAIRS = [
    ("--text", "--bg", 4.5, "body text on page"),
    ("--text", "--surface", 4.5, "body text on card"),
    ("--muted", "--bg", 4.5, "secondary text on page"),
    ("--muted", "--surface", 4.5, "secondary text on card"),
    ("--muted", "--surface-2", 4.5, "secondary text on raised surface"),
    ("--accent", "--bg", 4.5, "accent text on page"),
    ("--accent", "--surface", 4.5, "accent text on card"),
    # Permukaan burgundy WAJIB pakai --on-brand, bukan --text/--muted/--accent
    # (yang ikut terang/gelap dan gagal di light mode). Aturan ini dijaga
    # scripts/check.py; pasangan di sini hanya menguji --on-brand itu sendiri.
    ("--on-brand", "--brand", 4.5, "any text or link on burgundy band"),
    ("--on-brand", "--brand-hover", 4.5, "any text on burgundy hover fill"),
    ("--border-strong", "--bg", 3.0, "focus ring / control border vs page"),
    ("--border-strong", "--surface", 3.0, "control border vs card"),
    ("--border-strong", "--surface-2", 3.0, "focus ring on raised surface"),
    ("--border", "--bg", 1.0, "decorative border (informational only)"),
    ("--border", "--surface", 1.0, "card border vs card (informational only)"),
]


def main():
    css = CSS.read_text(encoding="utf-8")
    tok = tokens(css)
    failures = []
    for scheme, block in tok.items():
        if not block:
            print(f"WARN  blok token '{scheme}' kosong — CSS mungkin tidak ditemukan")
            continue
        print(f"\n=== {scheme.upper()} ===")
        for fg, bg, minimum, label in PAIRS:
            if fg not in block or bg not in block:
                failures.append(f"[{scheme}] token {fg if fg not in block else bg} belum ada")
                continue
            r = ratio(block[fg], block[bg])
            ok = r >= minimum
            print(f"{'OK  ' if ok else 'FAIL'} {r:5.2f}:1  (min {minimum})  {label}"
                  f"  {block[fg]} on {block[bg]}")
            if not ok:
                failures.append(f"[{scheme}] {label}: {r:.2f}:1 < {minimum}:1")

    if failures:
        print()
        for f in failures:
            print(f"FAIL  {f}")
        print(f"\n{len(failures)} pasangan gagal")
        return 1
    print("\nSemua pasangan kontras lolos.")
    return 0


if __name__ == "__main__":
    sys.exit(main())