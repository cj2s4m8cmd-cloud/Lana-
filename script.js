const WHATSAPP_NUMBER = "962792877358";

const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("[data-view-link]");
const viewButtons = document.querySelectorAll("[data-view-button]");
const navMenu = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const clickSound = document.getElementById("clickSound");
const siteMusic = document.getElementById("siteMusic");

function playClickSound() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.volume = 0.18;
  clickSound.play().catch(() => {});
}

document.addEventListener("click", event => {
  const clickable = event.target.closest("button, a, input, select, textarea, .card, .offer-card, .gallery-img");
  if (!clickable) return;
  playClickSound();
});

function showView(viewId, updateHash = true) {
  const target = document.getElementById(viewId);
  if (!target) return;

  views.forEach(view => view.classList.remove("active"));
  target.classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.viewLink === viewId);
  });

  if (navMenu) navMenu.classList.remove("open");

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (updateHash) {
    history.replaceState(null, "", "#" + viewId);
  }

  revealVisible();

  if (viewId === "home") {
    applyTwoHourStats();
    animateCounters();
  }
}

navLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    showView(link.dataset.viewLink);
  });
});

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    showView(button.dataset.viewButton);
  });
});

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

function openWhatsapp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
}

document.getElementById("whatsappFloat")?.addEventListener("click", () => {
  openWhatsapp("مرحبًا، وصلت إلى لنا الأصفر من خلال الموقع الإلكتروني وأريد الاستفسار عن الخدمات وحجز موعد.");
});

document.getElementById("directWhatsapp")?.addEventListener("click", () => {
  openWhatsapp("مرحبًا، وصلت إلى لنا الأصفر من خلال الموقع الإلكتروني وأريد حجز موعد.");
});

document.getElementById("contactWhatsapp")?.addEventListener("click", () => {
  openWhatsapp("مرحبًا، وصلت إلى لنا الأصفر من خلال الموقع الإلكتروني وأريد التواصل بخصوص الخدمات والعروض.");
});

document.querySelectorAll("[data-book-service]").forEach(button => {
  button.addEventListener("click", () => {
    const service = button.dataset.bookService;
    showView("booking");
    setTimeout(() => {
      const select = document.getElementById("serviceSelect");
      if (select) select.value = service;
    }, 250);
  });
});

const bookingForm = document.getElementById("bookingForm");

bookingForm?.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.getElementById("clientName").value.trim();
  const phone = document.getElementById("clientPhone").value.trim();
  const service = document.getElementById("serviceSelect").value;
  const date = document.getElementById("bookingDate").value;
  const time = document.getElementById("bookingTime").value;
  const notes = document.getElementById("bookingNotes").value.trim();

  if (!name || !phone || !service || !date || !time) {
    alert("يرجى تعبئة جميع الحقول المطلوبة.");
    return;
  }

  const message = `
حجز جديد من الموقع الرسمي لنا الأصفر 🌐

المصدر: تم إرسال الطلب بواسطة الموقع الإلكتروني
الاسم: ${name}
رقم الهاتف: ${phone}
الخدمة: ${service}
التاريخ المفضل: ${date}
الوقت المفضل: ${time}
ملاحظات: ${notes || "لا يوجد"}

يرجى التواصل معي لتأكيد الموعد.
`.trim();

  openWhatsapp(message);
});

function applyTwoHourStats() {
  const now = new Date();
  const twoHourBlock = Math.floor(now.getTime() / (1000 * 60 * 60 * 2));

  function blockNumber(min, max, offset) {
    const value = Math.abs(Math.sin(twoHourBlock + offset) * 10000);
    return Math.floor(min + (value % (max - min + 1)));
  }

  const stats = [
    { value: blockNumber(22, 29, 1) },
    { value: blockNumber(12, 18, 2) },
    { value: 6 },
    { value: blockNumber(2, 6, 3) },
    { value: blockNumber(190, 260, 4) },
    { value: blockNumber(3, 8, 5) }
  ];

  const counters = document.querySelectorAll("[data-count]");

  counters.forEach((counter, index) => {
    if (stats[index]) {
      counter.dataset.count = stats[index].value;
      counter.textContent = "0";
      counter.dataset.done = "false";
    }
  });
}

function animateCounters() {
  const counters = document.querySelectorAll("[data-count]");

  counters.forEach(counter => {
    if (counter.dataset.done === "true") return;

    const target = Number(counter.dataset.count);
    let current = 0;
    const duration = 900;
    const steps = 30;
    const increment = Math.max(1, Math.ceil(target / steps));
    const intervalTime = Math.floor(duration / steps);

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
        counter.dataset.done = "true";
      }
      counter.textContent = current;
    }, intervalTime);
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".gallery-img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
});

let musicStarted = false;

async function startMusicOnFirstTouch() {
  if (!siteMusic || musicStarted) return;

  try {
    siteMusic.volume = 0.18;
    await siteMusic.play();
    musicStarted = true;
  } catch (error) {
    // إذا المتصفح منع الصوت، سيحاول مرة أخرى مع اللمسة التالية
  }
}

function pauseMusicWhenLeaving() {
  if (!siteMusic) return;

  if (document.hidden) {
    siteMusic.pause();
    musicStarted = false;
  }
}

document.addEventListener("pointerdown", startMusicOnFirstTouch);
document.addEventListener("touchstart", startMusicOnFirstTouch);
document.addEventListener("click", startMusicOnFirstTouch);

document.addEventListener("visibilitychange", pauseMusicWhenLeaving);

window.addEventListener("pagehide", () => {
  if (siteMusic) {
    siteMusic.pause();
    musicStarted = false;
  }
});

function revealVisible() {
  const reveals = document.querySelectorAll(".reveal");
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.classList.add("visible");
    }
  });
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
window.addEventListener("scroll", revealVisible);

applyTwoHourStats();
const initialView = window.location.hash ? window.location.hash.replace("#", "") : "home";
showView(initialView, false);
if (initialView === "home") animateCounters();
