const placementItems = [
  {
    title: "Film Trailer Feature",
    outlet: "Sample Production House",
    image: "assets/placements/placement-1.svg",
    alt: "Abstract blue placeholder for a placement image",
  },
  {
    title: "TV Drama Underscore",
    outlet: "Sample Cable Network",
    image: "assets/placements/placement-2.svg",
    alt: "Abstract purple and cyan placeholder for a placement image",
  },
  {
    title: "Sports Promo Cue",
    outlet: "Sample Sports Channel",
    image: "assets/placements/placement-3.svg",
    alt: "Abstract neon waveform placeholder for a placement image",
  },
  {
    title: "Documentary Soundtrack",
    outlet: "Sample Streaming Platform",
    image: "assets/placements/placement-4.svg",
    alt: "Abstract cinematic placeholder for a placement image",
  },
];

function initNavToggle() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function highlightActiveNav() {
  const page = document.body.dataset.page;
  if (!page) {
    return;
  }

  const activeLink = document.querySelector(`[data-nav-link="${page}"]`);
  if (activeLink) {
    activeLink.classList.add("active");
    activeLink.setAttribute("aria-current", "page");
  }
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!revealItems.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -5% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initHeroNoteParticles() {
  const field = document.querySelector("[data-note-field]");
  if (!field) {
    return;
  }

  const symbols = ["♪", "♫", "♬", "♩"];
  const particleCount = window.innerWidth < 740 ? 12 : 18;

  for (let i = 0; i < particleCount; i += 1) {
    const note = document.createElement("span");
    note.className = "note-particle";
    note.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    note.style.left = `${Math.random() * 100}%`;
    note.style.fontSize = `${0.95 + Math.random() * 1.25}rem`;
    note.style.animationDuration = `${11 + Math.random() * 14}s`;
    note.style.animationDelay = `${Math.random() * -24}s`;
    note.style.setProperty("--drift", `${Math.random() * 170 - 85}px`);
    note.style.setProperty("--rotate", `${Math.random() * 36 - 18}deg`);
    field.appendChild(note);
  }
}

function initPlacementsMarquee() {
  const track = document.querySelector("[data-placement-track]");
  if (!track) {
    return;
  }

  if (!placementItems.length) {
    track.innerHTML = "<p>Add placement items in assets/js/main.js</p>";
    return;
  }

  const cards = placementItems
    .map(
      (item) => `
        <article class="placement-card">
          <img src="${item.image}" alt="${item.alt}">
          <div class="meta">
            <h3>${item.title}</h3>
            <p>${item.outlet}</p>
          </div>
        </article>
      `
    )
    .join("");

  track.innerHTML = `${cards}${cards}`;
}


function initBudgetGame() {
  const game = document.querySelector("[data-budget-game]");
  if (!game) {
    return;
  }

  const stage = game.querySelector("[data-stage]");
  const registerEl = game.querySelector("[data-register]");
  const moneyEl = game.querySelector("[data-money]");
  const overdueEl = game.querySelector("[data-overdue]");
  const timeEl = game.querySelector("[data-time]");
  const statusEl = game.querySelector("[data-status]");
  const startBtn = game.querySelector("[data-start-budget-game]");

  if (!stage || !registerEl || !moneyEl || !overdueEl || !timeEl || !statusEl || !startBtn) {
    return;
  }

  const itemPool = [
    { type: "bill", icon: "🧾", min: 80, max: 180 },
    { type: "bill", icon: "⚡", min: 95, max: 210 },
    { type: "necessity", icon: "🥦", min: 35, max: 90 },
    { type: "necessity", icon: "⛽", min: 45, max: 110 },
    { type: "necessity", icon: "🧼", min: 20, max: 70 },
    { type: "luxury", icon: "👟", min: 120, max: 260 },
    { type: "luxury", icon: "🛍️", min: 140, max: 300 },
    { type: "luxury", icon: "🎩", min: 90, max: 230 },
  ];

  const state = {
    running: false,
    money: 1500,
    overdue: 0,
    timeLeft: 45,
    registerX: 0,
    registerWidth: 78,
    items: [],
    rafId: null,
    spawnTimer: 0,
    countdownId: null,
    lastFrameTs: 0,
  };

  function randomRange(min, max) {
    return min + Math.round(Math.random() * (max - min));
  }

  function setStatus(message) {
    statusEl.textContent = message;
    statusEl.classList.remove("hidden");
  }

  function updateHud() {
    moneyEl.textContent = `$${Math.max(0, Math.round(state.money))}`;
    overdueEl.textContent = `$${Math.round(state.overdue)}`;
    timeEl.textContent = String(state.timeLeft);
  }

  function clearItems() {
    state.items.forEach((item) => item.el.remove());
    state.items = [];
  }

  function stopGame() {
    state.running = false;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (state.countdownId) {
      clearInterval(state.countdownId);
      state.countdownId = null;
    }
    startBtn.disabled = false;
  }

  function finishGame(reason) {
    stopGame();

    if (reason === "overdue") {
      setStatus("Game over: overdue bills hit $300. Catch bill cards to keep overdue down.");
      return;
    }

    if (state.money > 0) {
      setStatus(`You win! You ended with $${Math.round(state.money)} and overdue at $${Math.round(state.overdue)}.`);
    } else {
      setStatus("You finished out of cash. Try again and skip luxury purchases.");
    }
  }

  function startGame() {
    stopGame();
    clearItems();

    state.running = true;
    state.money = 1500;
    state.overdue = 0;
    state.timeLeft = 45;
    state.spawnTimer = 0;
    state.lastFrameTs = 0;
    startBtn.disabled = true;
    statusEl.classList.add("hidden");

    updateHud();

    state.countdownId = window.setInterval(() => {
      if (!state.running) {
        return;
      }

      state.timeLeft -= 1;
      updateHud();

      if (state.timeLeft <= 0) {
        finishGame("time");
      }
    }, 1000);

    state.rafId = requestAnimationFrame(gameLoop);
  }

  function spawnItem() {
    const template = itemPool[Math.floor(Math.random() * itemPool.length)];
    const item = {
      ...template,
      value: randomRange(template.min, template.max),
      x: 12 + Math.random() * Math.max(12, stage.clientWidth - 64),
      y: -56,
      speed: 120 + Math.random() * 120,
    };

    const itemEl = document.createElement("div");
    itemEl.className = `budget-item ${item.type}`;
    itemEl.textContent = item.icon;
    itemEl.style.left = `${item.x}px`;
    itemEl.style.top = `${item.y}px`;
    stage.appendChild(itemEl);

    item.el = itemEl;
    state.items.push(item);
  }

  function registerBounds() {
    return {
      left: state.registerX,
      right: state.registerX + state.registerWidth,
      top: stage.clientHeight - 58,
      bottom: stage.clientHeight - 8,
    };
  }

  function applyCatch(item) {
    state.money -= item.value;

    if (item.type === "bill") {
      state.overdue = Math.max(0, state.overdue - 45);
    }

    updateHud();
  }

  function applyMiss(item) {
    if (item.type === "bill") {
      state.overdue = Math.min(300, state.overdue + 60);
      updateHud();

      if (state.overdue >= 300) {
        finishGame("overdue");
      }
    }
  }

  function gameLoop(timestamp) {
    if (!state.running) {
      return;
    }

    if (!state.lastFrameTs) {
      state.lastFrameTs = timestamp;
    }

    const dt = (timestamp - state.lastFrameTs) / 1000;
    state.lastFrameTs = timestamp;

    state.spawnTimer += dt;
    if (state.spawnTimer >= 0.62) {
      state.spawnTimer = 0;
      spawnItem();
    }

    const catcher = registerBounds();
    const remaining = [];

    state.items.forEach((item) => {
      item.y += item.speed * dt;
      item.el.style.top = `${item.y}px`;

      const itemLeft = item.x;
      const itemRight = item.x + 52;
      const itemTop = item.y;
      const itemBottom = item.y + 52;

      const caught =
        itemBottom >= catcher.top &&
        itemTop <= catcher.bottom &&
        itemRight >= catcher.left &&
        itemLeft <= catcher.right;

      if (caught) {
        applyCatch(item);
        item.el.remove();
        return;
      }

      if (itemTop > stage.clientHeight + 20) {
        applyMiss(item);
        item.el.remove();
        return;
      }

      remaining.push(item);
    });

    state.items = remaining;

    if (state.running) {
      state.rafId = requestAnimationFrame(gameLoop);
    }
  }

  function moveRegister(clientX) {
    const rect = stage.getBoundingClientRect();
    const targetX = clientX - rect.left - state.registerWidth / 2;
    const clamped = Math.max(0, Math.min(rect.width - state.registerWidth, targetX));
    state.registerX = clamped;
    registerEl.style.left = `${clamped}px`;
    registerEl.style.transform = "none";
  }

  stage.addEventListener("pointermove", (event) => {
    moveRegister(event.clientX);
  });

  window.addEventListener("keydown", (event) => {
    if (!game.isConnected) {
      return;
    }

    if (event.key === "ArrowLeft") {
      state.registerX = Math.max(0, state.registerX - 22);
      registerEl.style.left = `${state.registerX}px`;
      registerEl.style.transform = "none";
    }

    if (event.key === "ArrowRight") {
      state.registerX = Math.min(stage.clientWidth - state.registerWidth, state.registerX + 22);
      registerEl.style.left = `${state.registerX}px`;
      registerEl.style.transform = "none";
    }
  });

  stage.addEventListener("pointerdown", (event) => moveRegister(event.clientX));

  startBtn.addEventListener("click", startGame);

  state.registerX = Math.max(0, stage.clientWidth / 2 - state.registerWidth / 2);
  registerEl.style.left = `${state.registerX}px`;
  registerEl.style.transform = "none";
  updateHud();
}

function setYear() {
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  highlightActiveNav();
  initRevealAnimations();
  initHeroNoteParticles();
  initPlacementsMarquee();
  initBudgetGame();
  setYear();
});
