/* =========================================================
   AGATHA ABAKUMOVA — QA PORTFOLIO
   main.js
   ========================================================= */
(function () {
  "use strict";

  const doc = document;
  const body = doc.body;

  /* ---------------- Loader ---------------- */
  window.addEventListener("load", () => {
    const loader = doc.getElementById("loader");
    if (loader) {
      setTimeout(() => loader.classList.add("hidden"), 500);
    }
  });

  /* ---------------- Year in footer ---------------- */
  const yearEl = doc.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Theme toggle (dark / light) ---------------- */
  const themeToggle = doc.getElementById("themeToggle");
  const THEME_KEY = "agatha-portfolio-theme";

  function applyTheme(theme, save = true) {
    body.setAttribute("data-theme", theme);

    if (themeToggle) {
      const icon = themeToggle.querySelector("i");
      if (icon) {
        icon.className =
          theme === "dark"
            ? "fa-solid fa-moon"
            : "fa-solid fa-circle-half-stroke";
      }
    }

    if (save) {
      localStorage.setItem(THEME_KEY, theme);
    }
  }

  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    applyTheme(prefersDark ? "dark" : "light", false);
  }

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? "dark" : "light", false);
    }
  });

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        body.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(current);
    });
  }
  /* ---------------- Sticky header on scroll ---------------- */
  const header = doc.getElementById("siteHeader");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 30);
  }
  document.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------- Mobile nav ---------------- */
  const navToggle = doc.getElementById("navToggle");
  const navLinks = doc.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = Array.from(doc.querySelectorAll("main section[id]"));
  const navAnchors = Array.from(doc.querySelectorAll(".nav-link"));

  function setActiveLink() {
    let currentId = sections[0]?.id;
    const scrollPos = window.scrollY + 140;
    for (const section of sections) {
      if (section.offsetTop <= scrollPos) currentId = section.id;
    }
    navAnchors.forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`);
    });
  }
  document.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------------- Scroll-to-top button ---------------- */
  const scrollTopBtn = doc.getElementById("scrollTop");
  if (scrollTopBtn) {
    document.addEventListener(
      "scroll",
      () => scrollTopBtn.classList.toggle("visible", window.scrollY > 500),
      { passive: true },
    );
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- AOS ---------------- */
  if (window.AOS) {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }

  /* ---------------- Typed.js — hero role line ---------------- */
  if (window.Typed) {
    new Typed("#typed-role", {
      strings: [
        "QA Engineer",
        "Python Automation",
        "Playwright",
        "Pytest",
        "Automation Testing",
      ],
      typeSpeed: 55,
      backSpeed: 30,
      backDelay: 1400,
      startDelay: 300,
      loop: true,
      showCursor: false,
    });
  }

  /* ---------------- Terminal "pytest run" typewriter (signature element) ---------------- */
  const terminalBody = doc.getElementById("terminalBody");
  const terminalLines = [
    { text: "$ pytest test_agatha_qa_engineer.py -v", cls: "" },
    { text: "", cls: "" },
    {
      text: "test_experience.py::test_four_plus_years ............... PASSED",
      cls: "line-pass",
    },
    {
      text: "test_stack.py::test_python_playwright_pytest ............ PASSED",
      cls: "line-pass",
    },
    {
      text: "test_domains.py::test_fintech_saas_erp_messaging ........ PASSED",
      cls: "line-pass",
    },
    {
      text: "test_automation.py::test_page_object_model ............... PASSED",
      cls: "line-pass",
    },
    { text: "", cls: "" },
    {
      text: "======================== 4 passed in 0.42s ========================",
      cls: "line-dim",
    },
    { text: "✓ ALL TESTS PASSED", cls: "line-final" },
  ];

  let terminalStarted = false;
  async function runTerminal() {
    if (!terminalBody || terminalStarted) return;
    terminalStarted = true;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      terminalBody.innerHTML = terminalLines
        .map((l) => `<span class="${l.cls}">${l.text}</span>`)
        .join("\n");
      return;
    }

    for (const line of terminalLines) {
      const span = doc.createElement("span");
      if (line.cls) span.className = line.cls;
      terminalBody.appendChild(span);
      if (line.text.length === 0) {
        terminalBody.appendChild(doc.createTextNode("\n"));
        continue;
      }
      for (const char of line.text) {
        span.textContent += char;
        await new Promise((r) => setTimeout(r, 8));
      }
      terminalBody.appendChild(doc.createTextNode("\n"));
      await new Promise((r) => setTimeout(r, 90));
    }
  }

  const heroVisual = doc.querySelector(".hero-visual");
  if (heroVisual && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runTerminal();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(heroVisual);
  } else {
    runTerminal();
  }

  /* ---------------- Animated stat counters ---------------- */
  const statEls = Array.from(doc.querySelectorAll(".stat-num"));
  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1100;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (statEls.length && "IntersectionObserver" in window) {
    const statIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );
    statEls.forEach((el) => statIO.observe(el));
  }

  /* ---------------- tsParticles background ---------------- */
  if (window.tsParticles) {
    tsParticles.load("tsparticles", {
      fpsLimit: 60,
      fullScreen: { enable: false },
      particles: {
        number: { value: 46, density: { enable: true, area: 900 } },
        color: { value: ["#7c8cfb", "#3ddc97"] },
        opacity: { value: 0.25 },
        size: { value: { min: 1, max: 2.4 } },
        links: {
          enable: true,
          distance: 130,
          color: "#7c8cfb",
          opacity: 0.14,
          width: 1,
        },
        move: { enable: true, speed: 0.35, outModes: { default: "out" } },
      },
      interactivity: {
        events: { onHover: { enable: true, mode: "grab" }, resize: true },
        modes: { grab: { distance: 140, links: { opacity: 0.3 } } },
      },
      detectRetina: true,
    });
  }
})();

/* ---------------- GitHub widgets (JSON) ---------------- */

fetch("data/github-data.json")
  .then((res) => res.json())
  .then((data) => {
    document.getElementById("github-avatar").src = data.profile.avatar;
    // ---------- Profile ----------
    document.getElementById("github-profile").innerHTML = `
<div class="github-stat">
    <i class="fa-solid fa-box"></i>
    <div>
        <span>Public Repositories</span>
    </div>
    <strong>${data.profile.public_repos}</strong>
</div>

<div class="github-stat">
    <i class="fa-solid fa-users"></i>
    <div>
        <span>Followers</span>
    </div>
    <strong>${data.profile.followers}</strong>
</div>

<div class="github-stat">
    <i class="fa-solid fa-arrow-right"></i>
    <div>
        <span>Following</span>
    </div>
    <strong>${data.profile.following}</strong>
</div>
`;

    // ---------- Repositories ----------
    document.getElementById("github-repositories").innerHTML = data.repos
      .map(
        (repo) => `
        <div class="repo-item">

    <div class="repo-top">
        <i class="fa-solid fa-box"></i>

        <a href="${repo.url}" target="_blank" class="repo-link">
    <span>${repo.name}</span>
    <i class="fa-solid fa-arrow-up-right-from-square"></i>
</a>

    </div>

    <div class="repo-meta">
        Python • Playwright • Updated 2 days ago
    </div>

</div>
      `,
      )
      .join("");

    // ---------- Featured Repository ----------
    const featured = data.repos.find((repo) => repo.featured);

    document.getElementById("github-featured").innerHTML = `
<a href="${featured.url}" target="_blank" class="featured-link">
    <i class="fa-solid fa-box"></i>
    <span>${featured.display_name || featured.name}</span>
    <i class="fa-solid fa-arrow-up-right-from-square"></i>
</a>
`;

    // ---------- Activity ----------
    document.getElementById("github-events").innerHTML = data.events
      .map(
        (event) => `
        <div class="activity-item">

   <div class="activity-title">
  ${
    event.type === "Push"
      ? '<i class="fa-solid fa-upload"></i> Push'
      : event.type === "Issues"
        ? '<i class="fa-solid fa-bug"></i> Issue'
        : event.type === "PullRequest"
          ? '<i class="fa-solid fa-code-pull-request"></i> Pull Request'
          : '<i class="fa-solid fa-circle"></i> ' + event.type
  }
</div>

<div class="activity-repo">
  ${event.repo}
</div>

</div>
      `,
      )
      .join("");
  })
  .catch(() => {
    document.getElementById("github-profile").innerHTML =
      "<p>Unable to load GitHub data.</p>";

    document.getElementById("github-repositories").innerHTML = "";

    document.getElementById("github-events").innerHTML = "";
  });
