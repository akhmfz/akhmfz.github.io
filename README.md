# akhmfz.github.io

Website portofolio pribadi — **[akhmfz.github.io](https://akhmfz.github.io)**

Statis, bilingual ID/EN, tanpa build step, tanpa framework. Konten berasal dari
[LinkedIn](https://www.linkedin.com/in/muhammadakhmal172) dan repo
[akhmfz](https://github.com/akhmfz).

## Struktur

```
content/site.json     ← SATU-SATUNYA sumber kebenaran. Semua teks & angka ada di sini
scripts/render.py     ← site.json → index.html + 404.html + sitemap + robots
scripts/check.py      ← self-check, wajib lolos sebelum push
assets/css/theme.css  ← design token. Ubah warna/font HANYA di sini
assets/js/main.js     ← 4 hal: tema, bahasa, detail proyek, scroll-reveal
```

`index.html` adalah **hasil generate**. Jangan edit langsung — edit `content/site.json`,
lalu jalankan ulang `render.py`.

## Menjalankan

```bash
python3 scripts/render.py          # regenerate
python3 scripts/check.py           # validasi (harus: 0 error)
python3 -m http.server 8000        # preview lokal
```

Validasi konten terpisah (dijalankan sebelum render):

```bash
python3 ~/.config/opencode/skills/portfolio-content/scripts/validate.py content/site.json
```

## Menambah konten

1. Edit `content/site.json` (skema + aturan kelayakan: `portfolio-content/references/schema.md`)
2. `python3 scripts/render.py`
3. `python3 scripts/check.py`
4. Commit & push — GitHub Pages rebuild otomatis

## Menambahkan CV

`content/site.json` → `identity.resume = "/assets/cv.pdf"`, lalu taruh PDF-nya di `assets/`,
`python3 scripts/render.py && python3 scripts/check.py`, commit & push.

> CV **belum** dipublikasikan. PDF `CV_ATS_Akhmal_v2_Fixed.pdf` menulis UNIDA Gontor 2022–sekarang
> dan KMI lulus 2022, sedangkan yang benar UNIDA 2024–2028 dan KMI 2018–2024. Perbaiki dulu
> di PDF-nya, baru taruh di sini. Perhatikan juga CV itu memuat nomor HP dan email kampus yang
> akan jadi publik.

## Kenapa begini

| Keputusan | Alasan |
|---|---|
| Tanpa npm, tanpa bundler | Satu halaman portofolio tidak butuh toolchain. Push langsung jalan. |
| Markup ganda `data-lang` + CSS | Toggle bahasa tanpa fetch JS. SEO dan mode no-JS tetap jalan. |
| Tailwind Play CDN | Bisa diganti CLI build satu perintah kalau nanti Lighthouse complains. |
| Design token terpusat | Redesign = ubah `theme.css`, bukan sentuh tiap halaman. |
| `cermin` tidak ditampilkan | Itu vault Obsidian pribadi, bukan karya publik. |

Proyek yang ditampilkan adalah **alat bantu analisis yang dibangun untuk mempelajari
methodologinya** — bukan produk komersial, dan bukan nasihat keuangan atau investasi.