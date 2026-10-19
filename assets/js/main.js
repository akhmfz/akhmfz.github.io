/* 4 hal saja: tema, bahasa, reveal, dan detail proyek. Tanpa framework. */
(() => {
  "use strict";

  const root = document.documentElement;
  const store = localStorage;

  // Tema — default light; dark hanya ikut prefers-color-scheme
  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const dark = root.classList.toggle("dark");
    root.classList.toggle("light", !dark);
    store.setItem("theme", dark ? "dark" : "light");
  });

  // Bahasa
  const langBtn = document.querySelector("[data-lang-toggle]");
  if (langBtn) {
    const paint = () => {
      langBtn.textContent = root.lang === "id" ? "EN" : "ID";
      langBtn.setAttribute("aria-label", root.lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia");
    };
    langBtn.addEventListener("click", () => {
      root.lang = root.lang === "id" ? "en" : "id";
      store.setItem("lang", root.lang);
      paint();
    });
    paint();
  }

  // Detail proyek — <details> bawaan, cuma putar ikon
  document.querySelectorAll("[data-detail-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const box = document.getElementById(btn.getAttribute("aria-controls"));
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      box.hidden = open;
    });
  });

  // Reveal — dilewati total kalau user minta reduced motion
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const targets = document.querySelectorAll("section");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("rise");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  targets.forEach((el) => {
    if (!el.classList.contains("rise")) io.observe(el);
  });
})();