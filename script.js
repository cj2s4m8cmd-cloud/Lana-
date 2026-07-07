const WHATSAPP_NUMBER = "962792877358";

const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll("[data-view-link]");
const viewButtons = document.querySelectorAll("[data-view-button]");
const navMenu = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");

function showView(viewId, updateHash = true) {
  const target = document.getElementById(viewId);
  if (!target) return;

  views.forEach(view => view.classList.remove("active"));
  target.classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.viewLink === viewId);
  });

  if (navMenu) navMenu.classList.remove("open");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  if (updateHash) {
    history.replaceState(null, "", "#" + viewId);
  }

  revealVisible();
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
  openWhatsapp("مرحبًا، أريد الاستفسار عن الخدمات وحجز موعد لدى لنا الأصفر.");
});

document.getElementById("directWhatsapp")?.addEventListener("click", () => {
  openWhatsapp("مرحبًا، أريد حجز موعد لدى لنا الأصفر.");
});

document.getElementById("contactWhatsapp")?.addEventListener("click", () => {
  openWhatsapp("مرحبًا، أريد التواصل معكم بخصوص خدمات لنا الأصفر.");
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
مرحبًا، أريد حجز موعد لدى لنا الأصفر.

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

const initialView = window.location.hash ? window.location.hash.replace("#", "") : "home";
showView(initialView, false);
