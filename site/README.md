# site/ — source Remix

Source untuk [akhmfz.github.io](https://akhmfz.github.io). Output statis ditulis ke
root repo oleh `npm run publish`; lihat [`../README.md`](../README.md) untuk struktur
dan cara deploy.

```bash
npm install
npm run dev        # dev server
npm run publish    # build + salin ke root repo
```

Konten yang sering diubah:

- `app/config.json` — nama, email, sosial, disiplin
- `app/routes/home/home.jsx` — proyek & urutan section
- `app/routes/home/experience.jsx` — pengalaman & pendidikan
- `app/components/theme-provider/theme.js` — warna & token desain
- `scripts/publish.mjs` — metadata `<head>` per halaman (title OG, description, canonical)

Desain diadaptasi dari template Hamish Williams (MIT, `LICENSE` di folder ini).
