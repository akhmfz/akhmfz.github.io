# akhmfz.github.io

Website portofolio pribadi — **[akhmfz.github.io](https://akhmfz.github.io)**

Statis, bilingual ID/EN, tanpa build step, tanpa framework. Konten berasal dari
[LinkedIn](https://www.linkedin.com/in/muhammadakhmal172) dan repo
[akhmfz](https://github.com/akhmfz).

## Struktur

```
content/site.json     ← SATU-SATUNYA sumber kebenaran. Semua teks & angka ada di sini
scripts/render.py     ← site.json → index.html + 404.html + sitemap + robots
scripts/check.py      ← self-check HTML, a11y, dan no-slop-ui (133 cek)
scripts/contrast.py   ← audit kontras WCAG 2.2 dari theme.css
assets/css/theme.css  ← design token. Ubah warna/font HANYA di sini
assets/js/main.js     ← 4 hal: menu mobile, tema, bahasa, section aktif
assets/og.src.html    ← sumber untuk regenerate assets/og.png
```

`index.html` adalah **hasil generate**. Jangan edit langsung — edit `content/site.json`,
lalu jalankan ulang `render.py`.

## Menjalankan

```bash
python3 scripts/render.py      # regenerate
python3 scripts/check.py       # 133 cek, harus 0 error
python3 scripts/contrast.py    # kontras token, harus 0 pasangan gagal
python3 -m http.server 8000    # preview lokal
```

Validasi konten terpisah (jalankan sebelum render):

```bash
python3 ~/.config/opencode/skills/portfolio-content/scripts/validate.py content/site.json
```

## Design system

Identitas: **deep-red / burgundy di atas charcoal gelap**. Dark adalah tema utama;
light diturunkan dari palet yang sama.

| Token | Dark | Light |
|---|---|---|
| `--bg` | `#100d0f` | `#faf7f7` |
| `--surface` | `#211619` | `#ffffff` |
| `--brand` | `#680d1b` | `#680d1b` |
| `--brand-hover` | `#86172a` | `#4e0914` |
| `--text` | `#f8f3f2` | `#1b1214` |
| `--muted` | `#c9b6b9` | `#5a474c` |
| `--border` | `#493037` | `#e4d6d8` |
| `--accent` | `#e6a0aa` | `#8e2c3c` |

Dua aturan yang sering dilanggar dan dijaga otomatis:

1. **`#680d1b` tidak boleh jadi teks di atas `--bg`** — kontrasnya 1.2:1. Teks aksen
   pakai `--accent`. Hanya `bg-brand` yang boleh dipakai, dan isinya wajib
   `--on-brand`.
2. **Permukaan burgundy tidak boleh mewarisi `--text` / `--muted` / `--accent`** —
   token itu ikut terang/gelap dan gagal di light mode. Band Kontak memakai
   `text-on-brand` eksplisit.

Keduanya dicek oleh `scripts/contrast.py` dan `scripts/check.py`.

## Aturan yang dipegang (no-slop-ui)

Tidak ada: gradient dekoratif, glow, glassmorphism, panel melayang, eyebrow label di atas
heading, transform/scale pada hover, kartu bersarang, radius di atas 12px, animasi scroll,
`::before` status dot, pill button.

Verifikasi: `scripts/check.py` gagal kalau salah satu muncul. Guard ini pernah menangkap
dua bug nyata (lihat `git log`).

## Batasan yang diketahui

- **Tailwind Play CDN** dipakai, bukan build. Alasannya: menambah toolchain npm untuk
  satu halaman statis tidak sepadan. Kalau Lighthouse performance
  jadi masalah, pindah ke CLI build satu perintah:
  `npx @tailwindcss/cli -i assets/css/tailwind.css -o assets/tailwind.css --minify`.
- **Scroll-spy `aria-current` belum terverifikasi** di lingkungan build ini
  (headless Chromium tidak menjalankan scroll event). Kodenya deterministik dan
  di-badge `passive`, tapi perlu dicek manual di browser sungguhan.
- `papan-gerak` dan `pine-semantic-platform` belum punya screenshot — kartu proyek
  menangani `media: null` dengan baik.

## Menambahkan CV

`content/site.json` → `identity.resume = "/assets/cv.pdf"`, lalu taruh PDF-nya di `assets/`,
`python3 scripts/render.py && python3 scripts/check.py`, commit & push.

> CV **belum** dipublikasikan. PDF `CV_ATS_Akhmal_v2_Fixed.pdf` menulis UNIDA Gontor
> 2022–sekarang dan KMI lulus 2022, sedangkan yang benar UNIDA 2024–2028 dan KMI
> 2018–2024. Perbaiki dulu di PDF-nya, baru taruh di sini. Perhatikan juga CV itu memuat
> nomor HP dan email kampus yang akan jadi publik. Detailnya ada di catatan privat
> di vault Obsidian (`04-Projects/Portfolio/TODO.md`), yang sengaja **tidak** ada di repo
> ini karena GitHub Pages menyajikan seluruh file repo sebagai situs statis.

Proyek yang ditampilkan adalah **alat bantu analisis yang dibangun untuk mempelajari
methodologinya** — bukan produk komersial, dan bukan nasihat keuangan atau investasi.