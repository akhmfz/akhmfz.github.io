# akhmfz.github.io

Website portofolio — **[akhmfz.github.io](https://akhmfz.github.io)**

Dibangun dengan [Remix](https://remix.run) (SPA mode) + Three.js, hasil port dari
template [Hamish Williams](https://github.com/HamishMW/portfolio) (MIT, lihat `site/LICENSE`).
Output-nya statis dan disajikan GitHub Pages. Konten bisa diedit lewat Pages CMS; lihat
[`CONTENT-MANAGEMENT.md`](CONTENT-MANAGEMENT.md).

## Struktur

```
index.html            ← HASIL BUILD. Jangan edit langsung.
404.html              ← HASIL BUILD (fallback deep link SPA)
articles/index.html   ← HASIL BUILD (halaman Articles)
contact/index.html    ← HASIL BUILD (agar /contact dapat HTTP 200)
projects/<slug>/index.html
                        ← HASIL BUILD (halaman detail tiap proyek)
assets/, favicon*, manifest.json, shortcut.png, social-image.png
                        ← HASIL BUILD (kecuali social-image.png: gambar OG 1280×800)
site/                 ← SOURCE Remix. Semua perubahan dikerjakan di sini.
  app/config.json     ← identitas, sosial, disiplin (sumber teks global)
  app/routes/         ← halaman: home/, articles, contact/, projects.$slug (detail proyek), $.jsx (404)
  app/data/projects-content.json ← isi proyek (bisa diedit dari CMS)
  app/data/manual-posts.json     ← artikel manual/LinkedIn (bisa diedit dari CMS)
  app/data/career-content.json   ← experience dan education (CMS)
  app/data/journal.json          ← Journal stories dengan foto (CMS)
  app/data/experience-highlights.json ← kartu foto Experience (CMS)
  public/uploads/                ← media yang diunggah melalui CMS
  app/data/posts.js              ← gabungan artikel manual + posts.json
  app/data/posts.json  ← hasil `npm run posts` (artikel Kompasiana)
  app/components/     ← komponen UI + design token (theme-provider/theme.js)
  scripts/publish.mjs ← build + salin ke root repo + patch <head> statis
```

## Menjalankan

```bash
cd site
npm install          # sekali saja
npm run dev          # http://localhost:5173
npm run build        # hasil di site/build/client
npm run publish      # build + salin ke root repo (index.html, assets/, 404.html, ...)
npm run posts -- https://www.kompasiana.com/<user>
                     # ambil daftar artikel Kompasiana → app/data/posts.json
```

Preview setelah build:

```bash
python3 -m http.server 8000   # dari root repo
```

## Deploy

GitHub Actions membangun dan menerbitkan website dari `site/`. Commit konten di
branch `main` otomatis memicu deploy; jangan edit hasil build di root repo.

Catatan:

- `index.html` masih berisi `<title>Loading...</title>` di source. Ini disengaja —
  React hydration mencocokkan markup shell apa adanya, dan mengganti teks `<title>`
  memicu hydration error di semua kunjungan. Judul asli dipasang oleh app setelah
  JS jalan; crawler non-JS membaca `og:title` / `og:description` yang ditambahkan
  `scripts/publish.mjs` di akhir `<head>`.
- Tiap halaman dimuat penuh (bukan transisi SPA): link internal memakai
  `reloadDocument`, jadi pindah halaman = request HTML baru seperti situs biasa.
  Anchor dalam satu halaman (`/#details`) tetap scroll halus.
- Deep link seperti `/contact` dilayani `404.html` (GitHub Pages tanpa rewrite server),
  sedangkan `/contact/` dapat HTTP 200 dari `contact/index.html`. `/projects/<slug>`
  tanpa slash akhir jatuh ke `404.html` lalu dirutekan React ke halaman proyeknya;
  versi `/projects/<slug>/` dapat HTTP 200 langsung.

## Riwayat

Versi sebelumnya (HTML + Python render script, bilingual ID/EN) masih bisa dilihat
di riwayat git.
