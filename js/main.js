// Loader animado
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);
  }, 1200);
});

// Modo claro/oscuro
const themeToggle = document.getElementById('theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const setTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};
const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
setTheme(currentTheme);
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});

// Botón volver arriba
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Navbar adaptativa: menú hamburguesa
const navToggle = document.getElementById('nav-toggle');
const navLinksMenu = document.getElementById('nav-links');

if (navToggle && navLinksMenu) {
  // Toggle menú al hacer clic en hamburguesa
  navToggle.addEventListener('click', () => {
    navLinksMenu.classList.toggle('open');
    navToggle.classList.toggle('open');
  });

  // Cerrar menú al hacer clic en un enlace (en móvil)
  navLinksMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 750) {
        navLinksMenu.classList.remove('open');
        navToggle.classList.remove('open');
      }
    });
  });

  // Cerrar menú al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinksMenu.contains(e.target)) {
      navLinksMenu.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });

  // Cerrar menú al redimensionar ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth > 750) {
      navLinksMenu.classList.remove('open');
      navToggle.classList.remove('open');
    }
  });
}

// Scroll suave entre secciones
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Animaciones de scroll y microinteracciones
const revealOnScroll = () => {
  const revealEls = document.querySelectorAll('.section, .features-list li, .requisito-item, .timeline-item, .contact-btn, .btn-primary, .btn-secondary');
  const windowHeight = window.innerHeight;
  revealEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
};
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Parallax header
window.addEventListener('scroll', () => {
  const header = document.querySelector('.main-header');
  if (header) {
    header.style.backgroundPositionY = `${window.scrollY * 0.3}px`;
  }
});

// Descargar PDF
document.getElementById('download-pdf').addEventListener('click', () => {
  // Crear un enlace temporal para descargar el PDF
  const link = document.createElement('a');
  link.href = 'assets/docs/LocalEnRenta.pdf';
  link.download = 'LocalEnRenta.pdf'; // Nombre del archivo al descargar
  link.target = '_blank'; // Abrir en nueva pestaña como respaldo
  
  // Añadir el enlace al DOM, hacer clic y removerlo
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
