#!/usr/bin/env python3
"""site.json -> index.html. Tanpa dependency, tanpa engine template.

    python3 scripts/render.py            # tulis index.html + file sampingan
    python3 scripts/render.py --stdout   # preview ke terminal
"""
import datetime
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = ROOT / "content" / "site.json"

# month id -> (label id, label en). Dipakai untuk "2026-10" -> "Okt 2026".
MONTHS = [
    ("", ""), ("Januari", "January"), ("Februari", "February"), ("Maret", "March"),
    ("April", "April"), ("Mei", "May"), ("Juni", "June"), ("Juli", "July"),
    ("Agustus", "August"), ("September", "September"), ("Oktober", "October"),
    ("November", "November"), ("Desember", "December"),
]

ICONS = {
    "linkedin": "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    "github": "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2",
    "mail": "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
    "trend": "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
    "arrow": "M5 12h14M12 5l7 7-7 7",
    "cap": "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
    "ext": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
}


LABELS = {
    "nav": [("about", "Tentang", "About"), ("experience", "Pengalaman", "Experience"),
            ("education", "Pendidikan", "Education"), ("skills", "Keterampilan", "Skills"),
            ("projects", "Proyek", "Projects"), ("contact", "Kontak", "Contact")],
    "head": {"about": ("Tentang Saya", "About"), "experience": ("Pengalaman", "Experience"),
             "education": ("Pendidikan & Beasiswa", "Education & Scholarship"),
             "skills": ("Keterampilan", "Skills"), "projects": ("Proyek", "Projects"),
             "contact": ("Kontak", "Contact"), "contact-title": ("Kontak", "Contact")},
}


def esc(v):
    return html.escape(str(v), quote=True)


# Dipakai sebagai nilai literal {tw} di f-string, bukan ditulis manual —
# menulis kurawal kurawal langsung di f-string mudah salah escape dan
# menghasilkan JS rusak yang membuat Tailwind diam-diam jalan tanpa palet.
TW_CONFIG = {"theme": {"extend": {
    "colors": {"page": "var(--bg)", "surface": "var(--surface)", "surface-2": "var(--surface-2)",
               "line": "var(--border)", "line-soft": "var(--border-soft)", "body": "var(--text)",
               "muted": "var(--muted)", "primary": "var(--primary)",
               "primary-soft": "var(--primary-soft)", "gold": "var(--gold)"},
    "fontFamily": {"heading": "var(--font-heading)", "body": "var(--font-body)", "mono": "var(--font-mono)"},
}}}


def tw():
    return json.dumps(TW_CONFIG, separators=(",", ":")).replace("<", "\\u003c")


def t(v, cls="", tag="span"):
    """{id,en} -> dua span data-lang. String polos -> escaped biasa."""
    a = f' class="{cls}"' if cls else ""
    if isinstance(v, dict):
        return (f'<{tag}{a} data-lang="id">{esc(v["id"])}</{tag}>'
                f'<{tag}{a} data-lang="en">{esc(v["en"])}</{tag}>')
    return f"<{tag}{a}>{esc(v)}</{tag}>"


def icon(name, cls="w-4 h-4"):
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            f'stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
            f'<path d="{ICONS[name]}"/></svg>')


def link_icon(name, href, label):
    if not href:
        return ""
    return (f'<a href="{esc(href)}" target="_blank" rel="noopener noreferrer" '
            f'class="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary '
            f'transition-colors duration-200" aria-label="{esc(label)}">{icon(name)}</a>')


def period_label(p):
    """"2026-10" -> tag Okt 2026 / Oct 2026. "2024 – 2028" -> apa adanya."""
    m = re.fullmatch(r"(\d{4})-(\d{2})", p)
    if not m:
        return {"id": esc(p), "en": esc(p)}
    y, mo = int(m.group(1)), int(m.group(2))
    return {"id": f"{MONTHS[mo][0]} {y}", "en": f"{MONTHS[mo][1]} {y}"}


def sort_key(p):
    m = re.match(r"(\d{4})(?:-(\d{2}))?", p or "")
    return (int(m.group(1)), int(m.group(2) or 0)) if m else (0, 0)


def link_button(href, label, primary=False, external=True):
    if not href:
        return ""
    rel = ' target="_blank" rel="noopener noreferrer"' if external else ""
    style = ("bg-primary text-white hover:bg-primary-soft" if primary
             else "border border-line text-body hover:border-primary hover:text-primary")
    return (f'<a href="{esc(href)}"{rel} class="inline-flex items-center gap-2 rounded-lg '
            f'px-5 py-2.5 text-sm font-semibold transition-colors duration-200 {style}">'
            f'{t(label)}</a>')


def section_head(anchor):
    """Swiss grid 12 kolom: judul 4, isi 8. Judul ikut dua bahasa."""
    title = LABELS["head"][anchor]
    return (f'<div class="grid grid-cols-1 gap-6 border-t border-line pt-8 md:grid-cols-12">'
            f'<h2 id="{anchor}" class="font-mono text-xs uppercase tracking-widest text-muted '
            f'md:col-span-4 scroll-mt-24">{t({"id": title[0], "en": title[1]})}</h2>'
            f'<div class="md:col-span-8">')


def render(d):
    meta, ident, links = d["meta"], d["identity"], d["links"]
    url, lang = meta["siteUrl"].rstrip("/"), meta["defaultLang"]
    out = []

    # ---- Hero -------------------------------------------------------------
    loc = ident.get("location", {})
    hero_ctas = "".join([
        link_button(links.get("linkedin"), {"id": "Lihat profil LinkedIn", "en": "View LinkedIn profile"}, True),
        link_button(links.get("email"), {"id": "Email", "en": "Email"}, False, external=False),
        link_button(ident.get("resume"), {"id": "Unduh CV", "en": "Download CV"}, False),
    ])
    out.append(f'''<section id="hero" class="rise py-16 md:py-24">
  <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
    <p class="font-mono text-xs uppercase tracking-widest text-primary">{t(loc)}</p>
    <h1 class="mt-4 text-5xl">{t(ident["shortName"])}</h1>
    <p class="mt-4 text-xl text-muted">{t(ident["role"])}</p>
    <p class="mt-4 max-w-[var(--measure)] text-body">{t(ident["headline"])}</p>
    <div class="mt-8 flex flex-wrap gap-3">{hero_ctas}</div>
  </div>
</section>''')

    # ---- Credentials ------------------------------------------------------
    creds = d.get("credentials") or []
    if creds:
        cells = []
        for c in creds:
            colour = "text-gold" if c.get("accent") else "text-body"
            cells.append(f'<div class="px-4 py-6 text-center"><p class="font-mono text-2xl font-bold '
                         f'{colour}">{esc(c["value"])}</p>'
                         f'<p class="mt-1 text-xs uppercase tracking-wide text-muted">{t(c["label"])}</p></div>')
        out.append(f'<section class="border-y border-line bg-surface"><div class="mx-auto max-w-5xl '
                   f'px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-2 divide-line md:grid-cols-4 '
                   f'md:divide-x">{"".join(cells)}</div></div></section>')

    # ---- About ------------------------------------------------------------
    out.append(f'<section class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">'
               f'{section_head("about")}'
               f'<div class="max-w-[var(--measure)] space-y-4 text-muted">{t(ident["bio"], tag="p")}</div>'
               f'</div></div></section>')

    # ---- Experience -------------------------------------------------------
    exp = sorted(d.get("experience") or [], key=lambda e: sort_key(e.get("period", "")), reverse=True)
    if exp:
        items = []
        for e in exp:
            hl = "".join(f'<li>{t(h)}</li>' for h in e.get("highlights", []))
            items.append(f'''<li class="relative pl-6">
      <span class="absolute -left-[9px] top-2 size-[9px] rounded-full bg-primary" aria-hidden="true"></span>
      <p class="font-mono text-xs uppercase tracking-wide text-muted">{t(period_label(e.get("period", "")))}</p>
      <h3 class="mt-1 text-lg">{t(e["role"])}</h3>
      <p class="text-primary">{esc(e["org"])}</p>
      <ul class="mt-3 list-disc space-y-1.5 pl-4 text-sm text-muted marker:text-line-soft">{hl}</ul>
    </li>''')
        out.append(f'<section class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">'
                   f'{section_head("experience")}'
                   f'<ol class="space-y-10 border-l border-line">{"".join(items)}</ol>'
                   f'</div></div></section>')

    # ---- Education & awards ----------------------------------------------
    edu = d.get("education") or []
    awards = d.get("awards") or []
    if edu or awards:
        cards = []
        for ed in edu:
            detail = f'<p class="mt-3 text-sm text-muted">{t(ed["detail"])}</p>' if ed.get("detail") else ""
            cards.append(f'''<div class="rounded-xl border border-line bg-surface p-6">
      <h3 class="text-lg">{esc(ed["institution"])}</h3>
      <p class="mt-1 text-primary">{t(ed["program"])}</p>
      <p class="font-mono text-xs uppercase tracking-wide text-muted">{t(ed.get("period", ""))}</p>
      {detail}
    </div>''')
        for aw in awards:
            issuer = f' &middot; {esc(aw["issuer"])}' if aw.get("issuer") else ""
            per = f' &middot; {t(aw["period"])}' if aw.get("period") else ""
            cards.append(f'''<div class="rounded-xl border border-line bg-surface p-6">
      <p class="flex items-center gap-2 text-gold">{icon("cap", "w-5 h-5")}{t(aw["title"])}</p>
      <p class="mt-1 font-mono text-xs uppercase tracking-wide text-muted">{issuer}{per}</p>
      <p class="mt-3 text-sm text-muted">{t(aw["body"])}</p>
    </div>''')
        out.append(f'<section class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">'
                   f'{section_head("education")}'
                   f'<div class="grid gap-4 md:grid-cols-2">{"".join(cards)}</div>'
                   f'</div></div></section>')

    # ---- Skills -----------------------------------------------------------
    skills = d.get("skills") or []
    if skills:
        groups = []
        for g in skills:
            chips = "".join(f'<li><span class="inline-block rounded-full border border-line px-3 py-1 '
                            f'text-sm transition-colors duration-200 hover:border-primary '
                            f'hover:text-primary">{t(i)}</span></li>' for i in g["items"])
            groups.append(f'''<div>
      <h3 class="font-mono text-xs uppercase tracking-widest text-muted">{t(g["group"])}</h3>
      <ul class="mt-4 flex flex-wrap gap-2">{chips}</ul>
    </div>''')
        out.append(f'<section class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">'
                   f'{section_head("skills")}'
                   f'<div class="space-y-8">{"".join(groups)}</div>'
                   f'</div></div></section>')

    # ---- Projects ---------------------------------------------------------
    projs = d.get("projects") or []
    if projs:
        cards = []
        for p in projs:
            metrics = "".join(f'<div><span class="font-mono text-lg font-bold">{esc(m["value"])}</span>'
                              f'<span class="ml-1.5 text-xs text-muted">{t(m["label"])}</span></div>'
                              for m in p.get("metrics", []))
            lk = p.get("links", {})
            chips = "".join(f'<li class="font-mono text-[11px] text-muted">{esc(s)}</li>' for s in p.get("stack", []))
            toggle = ""
            if detail:
                pid = esc(p["slug"])
                short = (d["identity"]["shortName"]["id"]
                         if isinstance(d["identity"]["shortName"], dict) else d["identity"]["shortName"])
                toggle = f'''
      <button type="button" class="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-200 hover:text-primary-soft"
              aria-label="{esc(short)} — {esc("Rincian proyek / Project details")}"
              aria-expanded="false" aria-controls="d-{pid}" data-detail-toggle>
        <span data-detail-label>{t({"id": "Rincian proyek", "en": "Project details"})}</span>
        {icon("arrow", "w-4 h-4 transition-transform duration-200")}
      </button>
      <div id="d-{pid}" hidden class="mt-4 border-t border-line pt-4 text-sm text-muted">{t(detail)}</div>'''
            cards.append(f'''<div class="rounded-xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-primary">
    <div class="flex items-baseline justify-between gap-4">
      <h3 class="text-lg">{t(p["name"])}</h3>
      <span class="font-mono text-xs text-muted">{esc(p.get("year", ""))}</span>
    </div>
    <p class="mt-2 text-sm text-muted">{t(p["summary"])}</p>
    <div class="mt-5 border-t border-line pt-5">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-wrap gap-6">{metrics}</div>
        <div class="flex items-center gap-4">{link_icon("github", lk.get("github"), "Source code on GitHub")}{link_icon("trend", lk.get("demo"), "Live demo")}</div>
      </div>
      <ul class="mt-5 flex flex-wrap gap-x-4 gap-y-1">{chips}</ul>
      {toggle}
    </div>
  </div>''')
        out.append(f'<section class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">'
                   f'{section_head("projects")}'
                   f'<div class="space-y-4">{"".join(cards)}</div>'
                   f'</div></div></section>')

    # ---- Contact ----------------------------------------------------------
    c = d["contact"]
    socials = "".join(filter(None, [
        link_icon("linkedin", links.get("linkedin"), "LinkedIn"),
        link_icon("github", links.get("github"), "GitHub"),
        link_icon("mail", links.get("email"), "Email"),
    ]))
    nav = "".join(f'<li><a class="text-sm text-muted transition-colors duration-200 hover:text-primary" '
                  f'href="#{a}">{t({"id": id_, "en": en})}</a></li>'
                  for a, id_, en in LABELS["nav"])
    out.append(f'''<section id="contact" class="py-20 md:py-28"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
  {section_head("contact-title")}
  <div class="md:col-span-8">
    <div class="rounded-2xl border border-line bg-surface p-8 text-center md:p-12">
      <h2 class="text-3xl">{t(c["title"])}</h2>
      <p class="mx-auto mt-4 max-w-[var(--measure)] text-muted">{t(c["body"])}</p>
      <div class="mt-8 flex flex-wrap justify-center gap-3">
        {link_button(c.get("ctaHref"), c["ctaLabel"], True)}
        {link_button(links.get("email"), {"id": "Email", "en": "Email"}, False, external=False)}
      </div>
    </div>
  </div>
</div></section>''')

    footer = f'''<footer class="border-t border-line bg-surface py-10"><div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
  <div class="flex flex-col justify-between gap-6 sm:flex-row">
    <ul class="space-y-2">{nav}</ul>
    <div class="flex items-center gap-4">{socials}</div>
  </div>
  <p class="mt-8 max-w-[var(--measure)] text-xs text-muted">{t(d["disclaimer"])}</p>
  <p class="mt-4 font-mono text-xs text-muted">&copy; 2026 {esc(ident["shortName"]["id"] if isinstance(ident["shortName"], dict) else ident["shortName"])}</p>
</div></footer>'''

    # ---- Nav --------------------------------------------------------------
    nav_links = "".join(f'<li><a class="text-sm text-muted transition-colors duration-200 hover:text-primary" href="#{a}">{t({"id": i_, "en": e})}</a></li>'
                        for a, i_, e in LABELS["nav"] if a != "skills")
    other = "EN" if lang == "id" else "ID"
    header = f'''<a href="#main" class="skip-link">{t({"id": "Lewati ke konten utama", "en": "Skip to main content"})}</a>
<header class="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-md">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Utama / Main">
    <a href="#hero" class="font-heading text-sm font-semibold">{esc(ident["shortName"]["id"] if isinstance(ident["shortName"], dict) else ident["shortName"])}</a>
    <ul class="hidden items-center gap-7 md:flex">{nav_links}</ul>
    <div class="flex items-center gap-1">
      <button type="button" data-lang-toggle class="rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-primary"
              aria-label="Ganti bahasa / Switch language">{other}</button>
      <button type="button" data-theme-toggle class="rounded-lg p-1.5 text-muted transition-colors duration-200 hover:bg-surface-2 hover:text-primary"
              aria-label="Ganti tema / Toggle theme">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
      </button>
    </div>
  </nav>
</header>'''

    jsonld = {
        "@context": "https://schema.org", "@type": "Person",
        "name": ident["name"]["id"], "url": url + "/",
        "email": "mailto:" + ident["email"],
        "address": {"@type": "PostalAddress", "addressLocality": "Ponorogo",
                    "addressRegion": "Jawa Timur", "addressCountry": "ID"},
        "sameAs": [links["linkedin"], links["github"], links["tradingview"]],
        "alumniOf": {"@type": "CollegeOrUniversity", "name": "Universitas Darussalam Gontor"},
    }
    ld = json.dumps(jsonld, ensure_ascii=False).replace("<", "\\u003c")
    seo = d["seo"]

    return f'''<!DOCTYPE html>
<html lang="{esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{t(seo["title"], tag="title")}</title>
<meta name="description" content="{esc(seo["description"]["id"])}" data-alt-en="{esc(seo["description"]["en"])}">
<meta name="keywords" content="{esc(", ".join(seo.get("keywords", [])))}">
<meta name="author" content="{esc(ident["name"]["id"])}">
<meta name="theme-color" content="#0369a1">
<link rel="canonical" href="{esc(url)}/">
<meta property="og:type" content="website">
<meta property="og:url" content="{esc(url)}/">
<meta property="og:image" content="{esc(url)}/{esc(seo["ogImage"])}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/theme.css">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>tailwind.config={tw()};</script>
<script>
/* anti-FOUC: harus blocking, di atas CSS */
(() => {{ const s = localStorage;
  document.documentElement.lang = s.getItem("lang") || "{esc(lang)}";
  const th = s.getItem("theme");
  if (th) document.documentElement.classList.add(th);
  else if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark");
}})();
</script>
<script type="application/ld+json">{ld}</script>
</head>
<body>
{header}
<main id="main">
{"".join(out)}
</main>
{footer}
<script src="/assets/js/main.js" defer></script>
</body>
</html>
'''


def not_found(d):
    """GitHub Pages selalu menyajikan 404.html untuk URL yang tidak ada."""
    url = d["meta"]["siteUrl"].rstrip("/")
    return f'''<!DOCTYPE html>
<html lang="{esc(d["meta"]["defaultLang"])}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>404 &middot; {esc(d["identity"]["shortName"]["id"] if isinstance(d["identity"]["shortName"], dict) else d["identity"]["shortName"])}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/theme.css">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>tailwind.config={tw()};</script>
</head>
<body>
<main class="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
  <p class="font-mono text-xs uppercase tracking-widest text-primary">HTTP 404</p>
  <h1 class="mt-4 text-5xl">Halaman tidak ditemukan<span data-lang="en">Page not found</span></h1>
  <p class="mt-4 max-w-[var(--measure)] text-muted">
    Tautan ini tidak ada atau sudah dipindahkan.<span data-lang="en">This link does not exist or has moved.</span>
  </p>
  <a href="{esc(url)}/" class="mt-8 inline-flex w-fit items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary-soft">
    Kembali ke beranda<span data-lang="en">Back to home</span>
  </a>
</main>
</body>
</html>
'''


def main():
    d = json.loads(DATA.read_text(encoding="utf-8"))
    html_out = render(d)
    if "--stdout" in sys.argv:
        print(html_out)
        return 0

    (ROOT / "index.html").write_text(html_out, encoding="utf-8")
    today = datetime.date.today().isoformat()
    (ROOT / "sitemap.xml").write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <url><loc>{d['meta']['siteUrl'].rstrip('/')}/</loc>"
        f"<lastmod>{today}</lastmod><changefreq>monthly</changefreq>"
        f"<priority>1.0</priority></url>\n</urlset>\n", encoding="utf-8")
    (ROOT / "robots.txt").write_text(
        f"User-agent: *\nAllow: /\n\nSitemap: {d['meta']['siteUrl'].rstrip('/')}/sitemap.xml\n",
        encoding="utf-8")
    (ROOT / ".nojekyll").touch()
    (ROOT / "404.html").write_text(not_found(d), encoding="utf-8")
    print(f"OK  index.html ({len(html_out):,} bita) + 404.html + sitemap.xml + robots.txt + .nojekyll")
    return 0


if __name__ == "__main__":
    sys.exit(main())