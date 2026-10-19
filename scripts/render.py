#!/usr/bin/env python3
"""site.json -> index.html. Tanpa dependency, tanpa engine template.

    python3 scripts/render.py            # tulis index.html + 404.html + sitemap + robots
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

MONTHS = [("", ""), ("Januari", "January"), ("Februari", "February"), ("Maret", "March"),
          ("April", "April"), ("Mei", "May"), ("Juni", "June"), ("Juli", "July"),
          ("Agustus", "August"), ("September", "September"), ("Oktober", "October"),
          ("November", "November"), ("Desember", "December")]

ICONS = {
    "linkedin": "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
    "github": "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4M9 18c-4.51 2-5-2-7-2",
    "mail": "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM22 6l-10 7L2 6",
    "trend": "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
    "cap": "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c3 3 9 3 12 0v-5",
    "ext": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
    "menu": "M3 6h18M3 12h18M3 18h18",
    "close": "M18 6 6 18M6 6l12 12",
}

LABELS = {
    "nav": [("about", "Tentang", "About"), ("experience", "Pengalaman", "Experience"),
            ("education", "Pendidikan", "Education"), ("skills", "Keterampilan", "Skills"),
            ("projects", "Proyek", "Projects"), ("contact", "Kontak", "Contact")],
    "head": {"about": ("Tentang saya", "About me"),
             "experience": ("Pengalaman", "Experience"),
             "education": ("Pendidikan dan beasiswa", "Education and scholarship"),
             "skills": ("Keterampilan", "Skills"),
             "projects": ("Proyek terpilih", "Selected projects"),
             "contact": ("Kontak", "Contact")},
    "row": {"problem": ("Masalah", "Problem"), "role": ("Peran saya", "My role"),
            "approach": ("Pendekatan", "Approach"), "result": ("Hasil", "Outcome")},
}

# Nilai literal {tw} di f-string. Menulis kurawal langsung di f-string mudah
# salah escape dan menghasilkan JS rusak yang membuat Tailwind diam-diam jalan
# tanpa palet — itu sempat terjadi dan gejelasnya CTA tak terlihat.
TW_CONFIG = {"theme": {"extend": {
    "colors": {"page": "var(--bg)", "surface": "var(--surface)", "elevated": "var(--surface-2)",
               "line": "var(--border)", "line-strong": "var(--border-strong)",
               "body": "var(--text)", "muted": "var(--muted)", "brand": "var(--brand)",
               "brand-hover": "var(--brand-hover)", "accent": "var(--accent)",
               "on-brand": "var(--on-brand)"},
    "fontFamily": {"display": "var(--font-display)", "body": "var(--font-body)",
                   "mono": "var(--font-mono)"},
    "borderRadius": {"DEFAULT": "var(--radius)"},
}}}


def tw():
    return json.dumps(TW_CONFIG, separators=(",", ":")).replace("<", "\\u003c")


def esc(v):
    return html.escape(str(v), quote=True)


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


def period_label(p):
    """"2026-10" -> Okt 2026 / Oct 2026. "2024 – 2028" -> apa adanya."""
    m = re.fullmatch(r"(\d{4})-(\d{2})", p or "")
    if not m:
        return {"id": esc(p), "en": esc(p)}
    y, mo = int(m.group(1)), int(m.group(2))
    return {"id": f"{MONTHS[mo][0]} {y}", "en": f"{MONTHS[mo][1]} {y}"}


def sort_key(p):
    m = re.match(r"(\d{4})(?:-(\d{2}))?", p or "")
    return (int(m.group(1)), int(m.group(2) or 0)) if m else (0, 0)


def shortname(ident):
    s = ident["shortName"]
    return s["id"] if isinstance(s, dict) else s


def btn(label, href, style="ghost", external=False):
    """Permukaan brand WAJIB pakai teks on-brand, bukan body/muted/accent."""
    if not href:
        return ""
    rel = ' target="_blank" rel="noopener noreferrer"' if external else ""
    if style == "primary":
        cls = "bg-brand text-on-brand hover:bg-brand-hover"
    elif style == "invert":
        # Di atas permukaan brand: pakai on-brand, bukan body/muted/accent.
        # body ikut terang/gelap dan gagal kontras di light mode.
        cls = "border border-on-brand text-on-brand hover:bg-brand-hover"
    else:
        cls = "border border-line-strong text-body hover:border-accent hover:text-accent"
    return (f'<a href="{esc(href)}"{rel} class="inline-flex items-center justify-center gap-2 '
            f'rounded-lg px-4 py-2.5 text-sm font-semibold no-underline transition-colors '
            f'duration-150 {cls}">{t(label)}</a>')


def link_row(href, icon_name, label):
    if not href:
        return ""
    return (f'<a href="{esc(href)}" target="_blank" rel="noopener noreferrer" '
            f'class="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 '
            f'text-sm text-muted no-underline transition-colors duration-150 '
            f'hover:border-accent hover:text-accent">{icon(icon_name, "w-4 h-4")}'
            f'<span class="sr-only">{esc(label)}</span></a>')


def section(anchor, children, extra=""):
    title = LABELS["head"][anchor]
    return (f'<section id="{anchor}" class="border-t border-line py-14 md:py-20{extra}">'
            f'<div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">'
            f'<h2 class="text-xl">{t({"id": title[0], "en": title[1]})}</h2>'
            f'<div class="mt-6">{children}</div></div></section>')


def render(d):
    meta, ident, links = d["meta"], d["identity"], d["links"]
    url, lang = meta["siteUrl"].rstrip("/"), meta["defaultLang"]
    name = shortname(ident)
    out = []

    # ---- Hero -------------------------------------------------------------
    ctas = "".join(btn(c["label"], c["href"], c.get("style", "ghost"),
                        c["href"].startswith("http")) for c in d["hero"]["ctas"])
    out.append(f'''<section id="hero" class="py-14 md:py-24">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <h1 class="text-5xl">{t(ident["shortName"])}</h1>
    <p class="mt-4 text-lg text-accent">{t(ident["role"])}</p>
    <p class="mt-6 max-w-[var(--measure)] text-lg">{t(ident["headline"])}</p>
    <p class="mt-4 text-sm text-muted">{t(ident["location"])}</p>
    <div class="mt-8 flex flex-wrap gap-3">{ctas}</div>
  </div>
</section>''')

    # ---- Credentials ------------------------------------------------------
    creds = d.get("credentials") or []
    if creds:
        cells = "".join(
            f'<div class="px-4 py-6 text-center"><p class="font-mono text-xl font-bold '
            f'{"text-accent" if c.get("accent") else "text-body"}">{esc(c["value"])}</p>'
            f'<p class="mt-1.5 text-xs text-muted">{t(c["label"])}</p></div>'
            for c in creds)
        out.append(f'<section class="border-y border-line bg-surface"><div class="mx-auto '
                   f'max-w-3xl px-4 sm:px-6 lg:px-8"><div class="grid grid-cols-2 '
                   f'divide-line md:grid-cols-4 md:divide-x">{cells}</div></div></section>')

    # ---- About ------------------------------------------------------------
    out.append(section("about", f'<div class="max-w-[var(--measure)] space-y-4 text-muted">'
                                f'{t(ident["bio"], tag="p")}</div>'))

    # ---- Experience -------------------------------------------------------
    exp = sorted(d.get("experience") or [], key=lambda e: sort_key(e.get("period", "")), reverse=True)
    if exp:
        items = []
        for e in exp:
            hl = "".join(f"<li>{t(h)}</li>" for h in e.get("highlights", []))
            loc = (f'<span class="text-muted">&middot; {t(e["location"])}</span>'
                   if e.get("location") else "")
            items.append(f'''<li class="relative border-l border-line pb-8 pl-6 last:pb-0">
      <span class="absolute -left-[5px] top-1.5 size-[9px] rounded-full bg-brand" aria-hidden="true"></span>
      <p class="font-mono text-xs text-muted">{t(period_label(e.get("period", "")))}{loc}</p>
      <h3 class="mt-1 text-lg">{t(e["role"])}</h3>
      <p class="text-accent">{esc(e["org"])}</p>
      <ul class="mt-3 space-y-1.5 pl-4 text-sm text-muted" style="list-style:disc">{hl}</ul>
    </li>''')
        out.append(section("experience", f'<ol class="space-y-8">{("".join(items))}</ol>'))

    # ---- Education & awards ----------------------------------------------
    edu, awards = d.get("education") or [], d.get("awards") or []
    if edu or awards:
        cards = "".join(
            f'''<div class="rounded-lg border border-line bg-surface p-5">
      <h3 class="text-base">{esc(e["institution"])}</h3>
      <p class="mt-1 text-accent">{t(e["program"])}</p>
      <p class="mt-1 font-mono text-xs text-muted">{t(e.get("period", ""))}</p>
      {f'<p class="mt-3 text-sm text-muted">{t(e["detail"])}</p>' if e.get("detail") else ""}
    </div>''' for e in edu)
        cards += "".join(
            f'''<div class="rounded-lg border border-line bg-surface p-5">
      <h3 class="flex items-center gap-2 text-base">{icon("cap", "w-4 h-4 text-accent")}{t(a["title"])}</h3>
      <p class="mt-1 font-mono text-xs text-muted">{esc(a.get("issuer", ""))}</p>
      {f'<p class="mt-3 text-sm text-muted">{t(a["body"])}</p>' if a.get("body") else ""}
    </div>''' for a in awards)
        out.append(section("education", f'<div class="grid gap-4 sm:grid-cols-2">{cards}</div>'))

    # ---- Skills -----------------------------------------------------------
    groups = "".join(
        f'''<div>
      <h3 class="text-sm font-semibold">{t(g["group"])}</h3>
      <ul class="mt-3 flex flex-wrap gap-2">{("".join(f'<li><span class="inline-block rounded-md border border-line px-2.5 py-1 text-sm text-muted">{t(i)}</span></li>' for i in g["items"]))}</ul>
    </div>''' for g in (d.get("skills") or []))
    if groups:
        out.append(section("skills", f'<div class="space-y-7">{groups}</div>'))

    # ---- Projects ---------------------------------------------------------
    cards = []
    for p in d.get("projects") or []:
        lk = p.get("links", {})
        rows = "".join(
            f'''<div class="grid gap-1 border-t border-line py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt class="font-mono text-xs text-muted">{t(LABELS["row"][k][0], "font-mono text-xs text-muted")}</dt>
      <dd class="text-sm text-muted">{t(p[k])}</dd>
    </div>''' for k in ("problem", "role", "approach", "result") if p.get(k))
        metrics = "".join(
            f'<div><span class="font-mono text-lg font-bold text-body">{esc(m["value"])}</span>'
            f'<span class="ml-1.5 text-xs text-muted">{t(m["label"])}</span></div>'
            for m in p.get("metrics", []))
        chips = "".join(f'<li class="font-mono text-xs text-muted">{esc(s)}</li>'
                        for s in p.get("stack", []))
        proj_links = (link_row(lk.get("github"), "github", "Source code on GitHub")
                      + link_row(lk.get("demo"), "trend", "Live demo"))
        media = ""
        if p.get("media"):
            src = esc(p["media"])
            media = (f'<img src="/{src}" alt="{esc(p["name"]["id"])} — screenshot dashboard" '
                     f'width="477" height="468" loading="lazy" decoding="async" '
                     f'class="mt-5 w-full max-w-md rounded-lg border border-line">')
        cards.append(f'''<article class="rounded-lg border border-line bg-surface p-5 md:p-6">
    <div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
      <h3 class="text-lg">{t(p["name"])}</h3>
      <p class="font-mono text-xs text-muted">{esc(p.get("category", {}).get("id", ""))} &middot; {esc(p.get("year", ""))}</p>
    </div>
    <p class="mt-2 text-sm text-muted">{t(p["summary"])}</p>
    {media}
    <dl class="mt-4">{rows}</dl>
    <div class="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
      <div class="flex flex-wrap gap-6">{metrics}</div>
      <div class="flex items-center gap-2">{proj_links}</div>
    </div>
    <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-1">{chips}</ul>
  </article>''')
    if cards:
        out.append(section("projects", f'<div class="space-y-6">{"".join(cards)}</div>'))

    # ---- Contact — satu-satunya bidang burgundy penuh ------------------
    c = d["contact"]
    out.append(f'''<section id="contact" class="bg-brand py-14 text-on-brand md:py-20">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <h2 class="text-xl text-on-brand">{t(dict(zip(("id", "en"), LABELS["head"]["contact"])))}</h2>
    <div class="mt-6 max-w-[var(--measure)]">
      <p class="text-lg text-on-brand">{t(c["title"])}</p>
      <p class="mt-3 text-on-brand">{t(c["body"])}</p>
      <div class="mt-7 flex flex-wrap gap-3">
        {btn(c["ctaLabel"], c.get("ctaHref"), "invert", c["ctaHref"].startswith("http"))}
        {btn({"id": "Email", "en": "Email"}, links.get("email"), "invert", False)}
      </div>
    </div>
  </div>
</section>''')

    # ---- Footer -----------------------------------------------------------
    socials = "".join(filter(None, [
        link_row(links.get("linkedin"), "linkedin", "LinkedIn profile"),
        link_row(links.get("github"), "github", "GitHub profile"),
        link_row(links.get("tradingview"), "trend", "TradingView profile"),
    ]))
    nav = "".join(f'<li><a class="text-sm text-muted transition-colors duration-150 '
                  f'hover:text-accent" href="#{a}">{t({"id": i_, "en": e_})}</a></li>'
                  for a, i_, e_ in LABELS["nav"])
    nav = f'<ul class="flex flex-wrap gap-x-5 gap-y-2">{nav}</ul>' 
    footer = f'''<footer class="border-t border-line py-10"><div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
  <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
    {nav}
    <div class="flex items-center gap-2">{socials}</div>
  </div>
  <p class="mt-8 max-w-[var(--measure)] text-xs text-muted">{t(d["disclaimer"])}</p>
  <p class="mt-3 font-mono text-xs text-muted">&copy; 2026 {esc(name)}</p>
</div></footer>'''

    # ---- Nav: desktop inline + panel mobile ------------------------------
    nav_links = "".join(f'<a class="block whitespace-nowrap rounded-lg px-2.5 py-2 text-sm text-muted '
                        f'transition-colors duration-150 hover:bg-elevated hover:text-accent" '
                        f'href="#{a}" data-nav-link>{t({"id": i_, "en": e_})}</a>'
                        for a, i_, e_ in LABELS["nav"])
    other = "EN" if lang == "id" else "ID"
    header = f'''<a href="#main" class="skip-link">{t({"id": "Lewati ke konten utama", "en": "Skip to main content"})}</a>
<header class="sticky top-0 z-50 border-b border-line bg-page">
  <nav class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8" aria-label="Utama">
    <div class="flex items-center justify-between py-3">
      <a href="#hero" class="shrink-0 whitespace-nowrap font-semibold no-underline hover:text-accent">{esc(name)}</a>
      <ul class="hidden items-center gap-0.5 md:flex">{nav_links}</ul>
      <div class="flex items-center gap-1">
        <button type="button" data-lang-toggle class="rounded-lg px-2.5 py-1.5 font-mono text-xs font-bold text-muted transition-colors duration-150 hover:bg-elevated hover:text-accent"
                aria-label="Ganti bahasa / Switch language">{other}</button>
        <button type="button" data-theme-toggle class="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-elevated hover:text-accent"
                aria-label="Ganti tema / Toggle theme">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>
        </button>
        <button type="button" data-menu-toggle class="rounded-lg p-2 text-muted transition-colors duration-150 hover:bg-elevated hover:text-accent md:hidden"
                aria-label="Buka menu / Open menu"
                aria-expanded="false" aria-controls="site-menu">
          <span data-menu-icon>{icon("menu", "w-5 h-5")}</span>
        </button>
      </div>
    </div>
    <div id="site-menu" class="hidden border-t border-line py-3 md:hidden">
      <ul class="space-y-1">{nav_links}</ul>
    </div>
  </nav>
</header>'''

    jsonld = {"@context": "https://schema.org", "@type": "Person",
              "name": ident["name"]["id"], "url": url + "/",
              "email": "mailto:" + ident["email"],
              "address": {"@type": "PostalAddress", "addressLocality": "Ponorogo",
                          "addressRegion": "Jawa Timur", "addressCountry": "ID"},
              "sameAs": [links["linkedin"], links["github"], links["tradingview"]],
              "alumniOf": {"@type": "CollegeOrUniversity", "name": "Universitas Darussalam Gontor"}}
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
<meta name="theme-color" content="#100d0f">
<link rel="canonical" href="{esc(url)}/">
<meta property="og:type" content="website">
<meta property="og:url" content="{esc(url)}/">
<meta property="og:title" content="{esc(seo["title"]["id"])}">
<meta property="og:description" content="{esc(seo["description"]["id"])}">
<meta property="og:image" content="{esc(url)}/{esc(seo["ogImage"])}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=IBM+Plex+Mono:wght@500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/theme.css">
<script src="https://cdn.tailwindcss.com/3.4.16"></script>
<script>tailwind.config={tw()};</script>
<script>
/* anti-FOUC: blocking, di atas CSS */
(() => {{ const s = localStorage;
  document.documentElement.lang = s.getItem("lang") || "{esc(lang)}";
  const th = s.getItem("theme");
  if (th) document.documentElement.classList.add(th);
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
<title>404 &middot; {esc(shortname(d["identity"]))}</title>
<meta name="robots" content="noindex">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/theme.css">
</head>
<body>
<main class="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-4 py-20 sm:px-6">
  <p class="font-mono text-xs text-muted">HTTP 404</p>
  <h1 class="mt-3 text-5xl">Halaman tidak ditemukan<span data-lang="en">Page not found</span></h1>
  <p class="mt-4 text-muted">Tautan ini tidak ada atau sudah dipindahkan.<span data-lang="en">This link does not exist or has moved.</span></p>
  <a href="{esc(url)}/" class="mt-8 inline-flex w-fit rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-on-brand no-underline transition-colors duration-150 hover:bg-brand-hover">Kembali ke beranda<span data-lang="en">Back to home</span></a>
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