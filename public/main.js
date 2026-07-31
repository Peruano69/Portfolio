// Portfolio — interacciones mínimas, sin librerías. Todo se degrada con gracia:
// sin JS la página es legible; con reduced-motion no hay animación.

// Año del footer.
document.getElementById("year").textContent = new Date().getFullYear();

// Reloj en vivo en la barra de estado — guiño al concepto de status page.
const clock = document.getElementById("clock");
if (clock) {
  const tick = () => {
    clock.textContent = new Date().toLocaleTimeString("es-ES", { hour12: false });
  };
  tick();
  setInterval(tick, 1000);
}

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Contador ascendente para la métrica de usuarios (efecto dashboard).
function countUp(el) {
  const to = parseInt(el.dataset.to, 10);
  const fmt = (n) => n.toLocaleString("es-ES");
  const dur = 1100;
  let start = null;
  const step = (ts) => {
    if (start === null) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3); // ease-out cúbico
    el.textContent = fmt(Math.round(to * eased));
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = fmt(to);
  };
  requestAnimationFrame(step);
}

// Revelado suave al entrar en pantalla + disparo del contador.
if (!reduce && "IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.dataset.to) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

  // Escalonado sutil dentro de grupos (pasos y lista de mantenimiento).
  const stagger = (sel) =>
    document.querySelectorAll(sel).forEach((el, i) => {
      el.style.transitionDelay = i * 55 + "ms";
    });
  stagger(".step");
  stagger(".cover__item");

  document
    .querySelectorAll(".row, .step, .cover__item, .section__title, .adapt, .note, .contact__hint, .mail")
    .forEach((el) => {
      el.classList.add("reveal");
      io.observe(el);
    });

  // El contador vive en la barra de prueba; se observa aparte.
  document.querySelectorAll(".count").forEach((el) => io.observe(el));
}
