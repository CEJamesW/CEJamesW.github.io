class SlidePresentation {
  constructor() {
    this.stage = document.getElementById("deckStage");
    this.slides = Array.from(document.querySelectorAll(".slide"));
    this.progressBar = document.getElementById("progressBar");
    this.progressTrack = this.progressBar?.parentElement;
    this.pageIndicator = document.getElementById("pageIndicator");
    this.overviewPanel = document.getElementById("overviewPanel");
    this.overviewGrid = document.getElementById("overviewGrid");
    this.current = this.readInitialSlide();
    this.lastWheelAt = 0;
    this.touchStartX = 0;
    this.touchStartY = 0;

    this.setupStageScale();
    this.setupNavigation();
    this.setupOverview();
    this.show(this.current, false);
  }

  readInitialSlide() {
    const raw = window.location.hash.replace("#/", "").replace("#", "");
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(n - 1, this.slides.length - 1)) : 0;
  }

  setupStageScale() {
    const scale = () => {
      const factor = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const x = (window.innerWidth - 1920 * factor) / 2;
      const y = (window.innerHeight - 1080 * factor) / 2;
      this.stage.style.transform = `translate(${x}px, ${y}px) scale(${factor})`;
    };

    scale();
    window.addEventListener("resize", scale, { passive: true });
  }

  setupNavigation() {
    document.addEventListener("keydown", (event) => {
      if (event.target.closest("button, input, textarea, [contenteditable='true']")) return;

      const key = event.key.toLowerCase();
      if (["arrowright", "arrowdown", " ", "pagedown"].includes(key)) {
        event.preventDefault();
        this.next();
      } else if (["arrowleft", "arrowup", "pageup"].includes(key)) {
        event.preventDefault();
        this.previous();
      } else if (key === "home") {
        event.preventDefault();
        this.show(0);
      } else if (key === "end") {
        event.preventDefault();
        this.show(this.slides.length - 1);
      } else if (key === "f") {
        event.preventDefault();
        this.toggleFullscreen();
      } else if (key === "escape") {
        event.preventDefault();
        this.toggleOverview();
      }
    });

    window.addEventListener("wheel", (event) => {
      if (this.overviewPanel.classList.contains("open")) return;
      if (Math.abs(event.deltaY) < 22) return;

      const now = Date.now();
      if (now - this.lastWheelAt < 560) return;
      this.lastWheelAt = now;

      if (event.deltaY > 0) {
        this.next();
      } else {
        this.previous();
      }
    }, { passive: true });

    window.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }, { passive: true });

    window.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      if (Math.abs(dx) < 70 && Math.abs(dy) < 70) return;

      if (Math.abs(dx) > Math.abs(dy)) {
        dx < 0 ? this.next() : this.previous();
      } else {
        dy < 0 ? this.next() : this.previous();
      }
    }, { passive: true });

    window.addEventListener("hashchange", () => {
      this.show(this.readInitialSlide(), false);
    });

    this.progressTrack?.addEventListener("click", (event) => {
      const rect = this.progressTrack.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const index = Math.round(Math.max(0, Math.min(1, ratio)) * (this.slides.length - 1));
      this.show(index);
    });
  }

  setupOverview() {
    this.overviewGrid.innerHTML = "";
    this.slides.forEach((slide, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `${index + 1}. ${slide.dataset.title || "Slide"}`;
      button.addEventListener("click", () => {
        this.closeOverview();
        this.show(index);
      });
      this.overviewGrid.appendChild(button);
    });

    this.overviewPanel.addEventListener("click", (event) => {
      if (event.target === this.overviewPanel) this.closeOverview();
    });
  }

  show(index, updateHash = true) {
    const nextIndex = Math.max(0, Math.min(index, this.slides.length - 1));
    this.current = nextIndex;

    this.slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === nextIndex);
      slide.classList.toggle("visible", i === nextIndex);
    });

    this.updateChrome();

    if (updateHash) {
      const hash = `#/${nextIndex + 1}`;
      if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
    }
  }

  updateChrome() {
    const total = this.slides.length;
    const current = this.current + 1;
    this.pageIndicator.textContent = `${current} / ${total}`;
    this.progressBar.style.width = `${(current / total) * 100}%`;

    Array.from(this.overviewGrid.children).forEach((button, i) => {
      button.classList.toggle("active", i === this.current);
    });
  }

  next() {
    this.show(this.current + 1);
  }

  previous() {
    this.show(this.current - 1);
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  toggleOverview() {
    if (this.overviewPanel.classList.contains("open")) {
      this.closeOverview();
    } else {
      this.overviewPanel.classList.add("open");
      this.overviewPanel.setAttribute("aria-hidden", "false");
    }
  }

  closeOverview() {
    this.overviewPanel.classList.remove("open");
    this.overviewPanel.setAttribute("aria-hidden", "true");
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.__deck = new SlidePresentation();
});
