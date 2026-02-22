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

function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) {
    return;
  }

  const statusEl = document.querySelector("[data-form-status]");
  const submitLabel = document.querySelector("[data-submit-label]");

  const statusMessages = {
    sent: "Message sent successfully.",
    "invalid-method": "Invalid request type. Please submit the form directly.",
    "invalid-input": "Please complete required fields with a valid email.",
    "send-failed": "Could not send message. Please try again or email directly.",
  };

  const params = new URLSearchParams(window.location.search);
  const phpStatus = params.get("status");
  if (phpStatus && statusEl) {
    statusEl.textContent = statusMessages[phpStatus] || "Form status updated.";
  }

  const staticHost =
    window.location.protocol === "file:" ||
    /github\.io$/i.test(window.location.hostname);

  if (!staticHost) {
    if (statusEl && !phpStatus) {
      statusEl.textContent =
        "Form is set to post to contact.php on hosts that support PHP mail().";
    }
    return;
  }

  if (submitLabel) {
    submitLabel.textContent = "Open Email App";
  }

  if (statusEl && !phpStatus) {
    statusEl.textContent =
      "GitHub Pages is static, so this opens your email app with your message prefilled.";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);
    const recipient = (form.dataset.recipient || "tgreen@tdmss.com").trim();
    const subject = String(formData.get("subject") || "Website Contact").trim();
    const body = [
      `Name: ${String(formData.get("name") || "")}`,
      `Email: ${String(formData.get("email") || "")}`,
      `Phone: ${String(formData.get("phone") || "Not provided")}`,
      "",
      String(formData.get("message") || ""),
    ].join("\n");

    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    if (statusEl) {
      statusEl.textContent = "Opening your email app now.";
    }
  });
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
  initContactForm();
  setYear();
});
