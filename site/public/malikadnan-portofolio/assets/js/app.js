/* Malik Adnan — portfolio interactions (no dependencies) */
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Tema ---------- */
const toggle = document.querySelector(".toggle");
const savedTheme = localStorage.getItem("theme");
root.dataset.theme =
  savedTheme || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
toggle.setAttribute("aria-pressed", String(root.dataset.theme === "light"));
const themeColor = document.querySelector('meta[name="theme-color"]');
const syncThemeColor = () =>
  themeColor && themeColor.setAttribute("content", root.dataset.theme === "light" ? "#fcfcfc" : "#0b0b0f");
syncThemeColor();
toggle.addEventListener("click", () => {
  const next = root.dataset.theme === "light" ? "dark" : "light";
  root.dataset.theme = next;
  toggle.setAttribute("aria-pressed", String(next === "light"));
  localStorage.setItem("theme", next);
  syncThemeColor();
});

/* ---------- Intro + panel warna ---------- */
const intro = document.querySelector(".intro");
const gatedContent = document.querySelectorAll(".topbar, main, .footer");
let introClosed = false;

function closeIntro() {
  if (introClosed) return;
  introClosed = true;
  document.body.classList.add("intro-done");
  document.body.classList.remove("intro-active");
  window.setTimeout(() => {
    if (intro) intro.remove();
    gatedContent.forEach((el) => (el.inert = false));
  }, reduceMotion ? 0 : 2600);
}

if (intro) {
  document.body.classList.add("intro-active");
  gatedContent.forEach((el) => (el.inert = true));
  intro.querySelector(".intro-btn").addEventListener("click", closeIntro);
} else {
  document.body.classList.add("intro-done");
  if (intro) intro.remove();
  gatedContent.forEach((el) => (el.inert = false));
}

/* ---------- Kursor lensa ---------- */
const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(hover: hover)").matches) {
  window.addEventListener(
    "mousemove",
    (e) => {
      cursor.style.setProperty("--x", e.clientX + "px");
      cursor.style.setProperty("--y", e.clientY + "px");
      cursor.classList.add("is-active");
    },
    { passive: true }
  );
  document.querySelectorAll("a, button, .hello").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("is-link"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("is-link"));
  });
}

/* ---------- Kartu Halo ---------- */
const hello = document.querySelector(".hello");
if (hello) {
  const helloTrigger = hello.querySelector(".hello__trigger");
  const helloContent = hello.querySelector(".hello__content");
  const setHello = (open) => {
    hello.classList.toggle("is-open", open);
    helloTrigger.setAttribute("aria-expanded", String(open));
    helloContent.inert = !open;
  };
  helloTrigger.addEventListener("click", () => {
    setHello(!hello.classList.contains("is-open"));
  });
  document.addEventListener("click", (e) => {
    if (!hello.contains(e.target)) setHello(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      setHello(false);
      helloTrigger.focus();
    }
  });
}

/* ---------- Topbar: latar muncul setelah hero ---------- */
const topbar = document.getElementById("topbar");
const hero = document.getElementById("hero");
if (topbar && hero && "IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) => topbar.classList.toggle("is-stuck", !entry.isIntersecting),
    { threshold: 0 }
  ).observe(hero);
}

/* ---------- Scrollspy ---------- */
const navLinks = Array.from(document.querySelectorAll(".nav a"));
const spySections = Array.from(document.querySelectorAll("main section[id]"));

function updateSpy() {
  if (!spySections.length) return;
  const marker = window.scrollY + window.innerHeight * 0.35;
  let current = spySections[0];
  for (const section of spySections) {
    if (section.offsetTop <= marker) current = section;
  }
  const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
  if (atBottom) current = spySections[spySections.length - 1];

  navLinks.forEach((a) => {
    if (a.getAttribute("href") === "#" + current.id) a.setAttribute("aria-current", "true");
    else a.removeAttribute("aria-current");
  });
}

let spyTick = false;
window.addEventListener(
  "scroll",
  () => {
    if (spyTick) return;
    spyTick = true;
    requestAnimationFrame(() => {
      updateSpy();
      spyTick = false;
    });
  },
  { passive: true }
);
updateSpy();

/* ---------- Salin email ---------- */
document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = btn.dataset.copy;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const field = document.createElement("textarea");
      field.value = text;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    btn.textContent = "Tersalin";
    btn.classList.add("is-done");
    window.setTimeout(() => {
      btn.textContent = "Salin";
      btn.classList.remove("is-done");
    }, 1600);
  });
});

/* ---------- Reveal saat scroll ---------- */
const revealTargets = document.querySelectorAll(
  ".section-title, .about-grid, .service, .project-box, .timeline li, .skills-grid > div, .contact-list"
);
revealTargets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealTargets.forEach((el) => io.observe(el));
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}
