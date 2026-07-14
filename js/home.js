(function () {
  "use strict";

  var header = document.querySelector("[data-header]");
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var clocks = document.querySelectorAll("[data-clock]");
  var years = document.querySelectorAll("[data-year]");
  var revealItems = document.querySelectorAll(".reveal");
  var mainContent = document.querySelector("main");
  var footer = document.querySelector(".site-footer");
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

    [mainContent, footer].forEach(function (region) {
      if (!region) return;
      if (open) {
        region.setAttribute("inert", "");
        region.setAttribute("aria-hidden", "true");
      } else {
        region.removeAttribute("inert");
        region.removeAttribute("aria-hidden");
      }
    });
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

  function initSectionNavigation() {
    var navLinks = Array.from(document.querySelectorAll('.site-nav a[href^="#"]'));
    var hero = document.querySelector("#top");
    var sections = navLinks
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (!("IntersectionObserver" in window) || !navLinks.length || !sections.length) return;

    function setCurrentSection(sectionId) {
      navLinks.forEach(function (link) {
        var isCurrent = link.getAttribute("href") === "#" + sectionId;
        if (isCurrent) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    }

    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          setCurrentSection(entry.target.id);
        });
      },
      {
        rootMargin: "-35% 0px -55%",
        threshold: 0,
      },
    );

    if (hero) sectionObserver.observe(hero);
    sections.forEach(function (section) {
      sectionObserver.observe(section);
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
      var link = event.target.closest("a");
      if (link) {
        var wasOpen = navToggle && navToggle.getAttribute("aria-expanded") === "true";
        var targetSelector = link.getAttribute("href");
        var targetSection =
          targetSelector && targetSelector.charAt(0) === "#"
            ? document.querySelector(targetSelector)
            : null;
        var targetHeading = targetSection && targetSection.querySelector("h1, h2");
        closeNav();
        if (wasOpen && targetHeading) {
          window.setTimeout(function () {
            targetHeading.focus({ preventScroll: true });
          }, 0);
        }
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && navToggle && navToggle.getAttribute("aria-expanded") === "true") {
      closeNav();
      navToggle.focus();
    }

    if (event.key === "Tab" && navToggle && navToggle.getAttribute("aria-expanded") === "true") {
      var menuLinks = Array.from(nav.querySelectorAll("a"));
      var focusableItems = [navToggle].concat(menuLinks);
      var firstItem = focusableItems[0];
      var lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
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
  initSectionNavigation();
  window.setInterval(updateClock, 30 * 1000);
})();
