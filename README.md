# akhmfz.github.io

Website portofolio — **[akhmfz.github.io](https://akhmfz.github.io)**

Dibangun dengan [Remix](https://remix.run) (SPA mode) + Three.js, hasil port dari
template [Hamish Williams](https://github.com/HamishMW/portfolio) (MIT, lihat `site/LICENSE`).
Output-nya statis dan disajikan GitHub Pages dari root repo ini.

## Struktur

```
index.html            ← HASIL BUILD. Jangan edit langsung.
404.html              ← HASIL BUILD (fallback deep link SPA)
contact/index.html    ← HASIL BUILD (agar /contact dapat HTTP 200)
assets/, favicon*, manifest.json, shortcut.png, social-image.png
                        ← HASIL BUILD (kecuali social-image.png: gambar OG 1280×800)
site/                 ← SOURCE Remix. Semua perubahan dikerjakan di sini.
  app/config.json     ← identitas, sosial, disiplin (sumber teks global)
  app/routes/         ← halaman: home/, contact/, $.jsx (404)
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
```

Preview setelah build:

```bash
python3 -m http.server 8000   # dari root repo
```

## Deploy

GitHub Pages menyajikan branch `main` direktori root. Tidak ada CI: jalankan
`cd site && npm run publish`, lalu commit `index.html` + `assets/` + halaman lain
yang berubah, dan push.

Catatan:

- `index.html` masih berisi `<title>Loading...</title>` di source. Ini disengaja —
  React hydration mencocokkan markup shell apa adanya, dan mengganti teks `<title>`
  memicu hydration error di semua kunjungan. Judul asli dipasang oleh app setelah
  JS jalan; crawler non-JS membaca `og:title` / `og:description` yang ditambahkan
  `scripts/publish.mjs` di akhir `<head>`.
- Deep link seperti `/contact` dilayani `404.html` (GitHub Pages tanpa rewrite server),
  sedangkan `/contact/` dapat HTTP 200 dari `contact/index.html`.

## Riwayat

Versi sebelumnya (HTML + Python render script, bilingual ID/EN) masih bisa dilihat
di riwayat git.
