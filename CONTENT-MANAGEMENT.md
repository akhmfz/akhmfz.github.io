# Editar konten portfolio

Konten portfolio bisa diedit lewat [Pages CMS](https://app.pagescms.org) tanpa menyunting kode:

1. Login dengan GitHub dan pasang Pages CMS pada repo `akhmfz/akhmfz.github.io`.
2. Buka repo di Pages CMS. Form editor dibaca dari `.pages.yml`.
3. Edit **Articles**, **Experience and education**, **Experience photo highlights**, atau **Projects / portfolio**. Foto bisa diunggah dari field gambar.
4. Simpan perubahan ke branch `main`. GitHub Actions akan build dan deploy otomatis.

## Setup satu kali

- Di GitHub, buka **Settings → Pages → Build and deployment → Source**, lalu pilih **GitHub Actions**.
- Pastikan Actions diizinkan untuk repository.

Konten sumber ada di `site/app/data/*.json`; gambar yang diunggah CMS masuk ke `site/public/uploads/`. Jangan edit file hasil build di root repo—file itu digenerate otomatis.

Artikel yang ditarik dari feed ada di `site/app/data/posts.json`; artikel manual/LinkedIn dikelola lewat Articles di CMS.
