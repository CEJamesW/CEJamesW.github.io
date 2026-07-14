(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var clocks = document.querySelectorAll("[data-clock]");
  var years = document.querySelectorAll("[data-year]");
  var revealItems = document.querySelectorAll(".reveal");
  var desktopQuery = window.matchMedia("(min-width: 901px)");
  var reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function setNav(open) {
    if (!nav || !navToggle || !header) return;
    nav.classList.toggle("is-open", open);
    header.classList.toggle("nav-active", open);
    navToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("nav-open", open);
  }

  function closeNav() {
    setNav(false);
  }

  function updateClock() {
    var now = new Date();
    var formatter = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Asia/Shanghai",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    var label = "CST " + formatter.format(now);

    clocks.forEach(function (clock) {
      clock.textContent = label;
    });
  }

  function initReveal() {
    if (reduceMotionQuery.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10%",
        threshold: 0.08,
      },
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  years.forEach(function (year) {
    year.textContent = String(new Date().getFullYear());
  });

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });
  }

  if (nav) {
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navToggle && navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
      navToggle.focus();
    }
  });

  function handleDesktopChange(event) {
    if (event.matches) closeNav();
  }

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleDesktopChange);
  }

  window.addEventListener("scroll", setHeaderState, { passive: true });

  setHeaderState();
  updateClock();
  initReveal();
  window.setInterval(updateClock, 30 * 1000);
})();
