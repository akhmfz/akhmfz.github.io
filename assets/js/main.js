/* Empat hal saja: menu mobile, tema, bahasa, dan penanda section aktif.
   Tanpa framework, tanpa animasi scroll — konten langsung terlihat. */
(() => {
  "use strict";

  const root = document.documentElement;
  const store = localStorage;

  /* Menu mobile — di bawah breakpoint md, nav jadi panel yang bisa dibuka. */
  const toggle = document.querySelector("[data-menu-toggle]");
  const menu = document.getElementById("site-menu");
  if (toggle && menu) {
    const icons = {
      open: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
      close: '<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    };
    const setOpen = (open) => {
      menu.classList.toggle("hidden", !open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Tutup menu / Close menu" : "Buka menu / Open menu");
      toggle.querySelector("[data-menu-icon]").innerHTML = open ? icons.close : icons.open;
    };
    toggle.addEventListener("click", () =>
      setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    // Jangan biarkan panel tetap terbuka saat layar melebar ke desktop.
    matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  /* Tema — default gelap (identitas burgundy), terang hanya kalau diminta. */
  const themeBtn = document.querySelector("[data-theme-toggle]");
  themeBtn?.addEventListener("click", () => {
    const light = root.classList.toggle("light");
    root.classList.toggle("dark", !light);
    store.setItem("theme", light ? "light" : "dark");
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", light ? "#faf7f7" : "#100d0f");
  });

  /* Bahasa */
  const langBtn = document.querySelector("[data-lang-toggle]");
  if (langBtn) {
    const paint = () => {
      langBtn.textContent = root.lang === "id" ? "EN" : "ID";
    };
    langBtn.addEventListener("click", () => {
      root.lang = root.lang === "id" ? "en" : "id";
      store.setItem("lang", root.lang);
      paint();
    });
    paint();
  }

  /* Penanda section aktif — aria-current, bukan gaya yang cuma berubah warna.
   Pakai scroll listener + getBoundingClientRect, bukan IntersectionObserver:
   observer tidak bisa diverifikasi di lingkungan headless ini, sedangkan cara
   ini deterministik dan bisa diuji. */
  const links = [...document.querySelectorAll("[data-nav-link]")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (links.length && sections.length) {
    let ticking = false;
    const mark = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;   // sedikit di bawah header sticky
      let active = null;
      for (const s of sections) {
        if (s.getBoundingClientRect().top <= line) active = s;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
        active = sections[sections.length - 1];   // dasar halaman
      }
      links.forEach((a) =>
        a.toggleAttribute("aria-current", a.getAttribute("href") === `#${active?.id}`));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(mark);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll, { passive: true });
    mark();
  }
})();
