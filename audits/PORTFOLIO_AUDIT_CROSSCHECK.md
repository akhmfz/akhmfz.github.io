# Cross-Check: Laporan Audit Portfolio 2026-10-30

**Tanggal:** 30 Oktober 2026
**Objek:** `C:\Users\Akhmfz\Downloads\Laporan_Audit_Portofolio_Akhmfz_2026-10-30.docx` (139 paragraf, 7 tabel)
**Repo:** `/home/akhmfz/apps/web/akhmfz.github.io` — baseline `1534c60`
**Tujuan:** uji ulang temuan laporan terhadap kondisi live dan source aktual, bukan menyalin klaimnya.

## 1. Ringkasan

Laporan itu benar pada arah prioritas (bukti, bukan dugaan), tetapi beberapa temuan P1-nya sudah tidak berlaku karena verifikasi live berhasil dilakukan di sesi ini dengan `curl` dan Playwright. Sebaliknya, satu rekomendasi laporan (F-02: konten tidak boleh bergantung pada animasi) **terbukti benar**: intro kembali `opacity: 0` bila animasi dimatikan. Itu sudah diperbaiki di perubahan ini.

| Klaim laporan | Kondisi aktual | Verdict |
|---|---|---|
| Live tidak dapat diambil, status route tidak diketahui (F-01, F-06, §10) | Semua route utama 200, route tak dikenal 404, sitemap identik dengan repo, social image sha256 sama | **Tidak berlaku** |
| Ikon 192/maskable hanya terverifikasi di file, live belum dicek (F-05) | `icon-192.png` 200 7.329 B, `icon-maskable-512.png` 200 14.374 B, manifest 200 | **Tidak berlaku** |
| Canonical/metadata produksi belum dinilai (F-06) | `canonical == og:url` di 8 route, tanpa canonical ganda, OG 1200×630 | **Tidak berlaku** |
| Klaim metrik proyek belum terbukti (F-04) | Angka 96/90/50/7 hanya ada di `projects.js`; repo sumber tidak ada di `/mnt/d/MintFz-Research` | **Masih terbuka** |
| Intro bergantung animasi (F-02) | Terbukti: dengan `animation: none` intro & role jadi `opacity: 0` | **Benar — diperbaiki** |
| A11y/performa belum diukur (F-08) | Lighthouse/CWV tetap belum dijalankan; QA browser hanya overflow/console/link/kartu | **Masih terbuka** |
| Lisensi belum diperiksa (F-09) | `site/LICENSE` = MIT, Copyright (c) 2020 Hamish Williams; tidak ada lisensi root tambahan | **Sebagian tidak berlaku** |

## 2. Verifikasi yang dijalankan

| Cek | Hasil |
|---|---|
| HTTP live 14 URL (`/`, 4 halaman, 3 project, route acak, manifest, sitemap, 3 aset) | 200 semua kecuali route acak 404. |
| Sitemap live vs repo | `diff` identik, 8 URL kanonik, tanpa `lastmod`. |
| Social image live vs repo | sha256 identik, 58.216 B, 1200×630. |
| Smoke lokal 9 route × 390/1440 (server meniru GitHub Pages) | Status, title, canonical/og, overflow, console error, 3 kartu artikel + 2 sumber: lolos. Satu-satunya console error adalah dokumen 404 yang memang diminta. |
| Intro: normal / animasi dimatikan / `prefers-reduced-motion: reduce` × 390/1440 | Opacity intro dan role `1` di ketiga kondisi, tanpa overflow. |

## 3. Temuan baru (N-01) — sudah diperbaiki

**Severity:** P1 visual (hanya muncul saat animasi tidak berjalan)
**Lokasi:** `site/app/routes/home/intro.module.css`
**Akar masalah:** `opacity: 0` adalah nilai dasar; satu-satunya yang membuat teks terlihat adalah animasi `fade-in`. Bila animasi diblokir (user stylesheet, kebijakan browser, atau aturan reduced-motion global di masa depan), teks intro dan baris role hilang.
**Patch:** `opacity: 1` sebagai nilai dasar, animasi memakai `both` agar koreografi 1,8 detik tetap sama, dan animasi dimatikan pada `prefers-reduced-motion: reduce`.
**Bukti sebelum:** `animation: none` → `{"intro":"0","role":"0"}`.
**Bukti sesudah:** normal, animasi dimatikan, dan reduced-motion → `{"intro":"1","role":"1"}` di 390 dan 1440.

## 4. Item yang masih terbuka

1. **F-04 metrik proyek.** 96/90 automated tests, 50 parameter, 7 CLI commands, dan versi (`v0.3.0-beta`, `v0.2.1-alpha`, `v2.0.0`) belum dapat direproduksi: repo sumber tidak ditemukan di `/mnt/d/MintFz-Research`. Perlu perintah test + commit yang diuji, atau copy diturunkan menjadi tanpa angka.
2. **F-08 performa/a11y.** Lighthouse/CWV, audit keyboard, contrast, dan heading order belum diukur. QA yang ada hanya membuktikan tidak ada overflow, console error, dan link mati.
3. **F-07 positioning.** Penilaian strategis; tidak diubah karena menyangkut isi personal.
4. **F-09 lisensi.** `site/LICENSE` sudah MIT milik Hamish Williams; asal tiap aset (foto, font) belum didokumentasikan dalam register.

## 5. File yang diubah

- `site/app/routes/home/intro.module.css` — N-01.
- Output generated dari `npm run publish` (HTML + aset hashed).
- Dokumen ini.

## 6. Residual risk

- Angka metrik proyek tetap klaim yang belum diaudit; jangan dianggap bukti sampai test dijalankan dari repo sumber.
- Verifikasi intro berbasis computed style dan geometri DOM; screenshot tidak diperiksa visual karena keterbatasan model.
- Lighthouse/Core Web Vitals dan WCAG penuh belum menjadi bukti.
