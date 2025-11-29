// Utilidades de rendimiento
const throttle = (func, delay) => {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
};

const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
};

// Loader animado - optimizado
window.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
      loader.remove(); // Eliminar del DOM para mejor rendimiento
    }, 500);
  }, 1200);
});

// Botón volver arriba - optimizado con throttle y transform
const backToTop = document.getElementById('back-to-top');
let lastScrollY = 0;
let ticking = false;

const updateBackToTop = () => {
  const scrollY = window.scrollY;
  if (scrollY > 300 && !backToTop.classList.contains('show')) {
    backToTop.classList.add('show');
  } else if (scrollY <= 300 && backToTop.classList.contains('show')) {
    backToTop.classList.remove('show');
  }
  lastScrollY = scrollY;
  ticking = false;
};

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(updateBackToTop);
    ticking = true;
  }
}, { passive: true });

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

// Scroll suave entre secciones - optimizado
const navLinks = document.querySelectorAll('.main-nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Animaciones de scroll - optimizado con IntersectionObserver
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1
};

const revealCallback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // Dejar de observar una vez visible
    }
  });
};

const revealObserver = new IntersectionObserver(revealCallback, observerOptions);

// Observar elementos con lazy reveal
const observeElements = () => {
  const revealEls = document.querySelectorAll('.section, .features-list li, .requisito-item, .contact-btn, .btn-primary, .btn-secondary');
  revealEls.forEach(el => revealObserver.observe(el));
};

// Ejecutar cuando DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeElements);
} else {
  observeElements();
}

// Parallax header - optimizado con throttle y transform
let parallaxTicking = false;
const header = document.querySelector('.main-header');

const updateParallax = () => {
  if (header) {
    const scrollY = window.scrollY;
    const offset = scrollY * 0.3;
    header.style.transform = `translateY(${offset}px)`;
  }
  parallaxTicking = false;
};

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    window.requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
}, { passive: true });

// Descargar PDF - optimizado
const downloadBtn = document.getElementById('download-pdf');
if (downloadBtn) {
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = 'assets/docs/LocalEnRenta.pdf';
    link.download = 'LocalEnRenta.pdf';
    link.target = '_blank';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    // Cleanup inmediato
    setTimeout(() => document.body.removeChild(link), 100);
  });
}

// Botones flotantes de acción - optimizado
document.addEventListener('DOMContentLoaded', () => {
  const floatingButtons = document.querySelectorAll('.floating-btn');
  
  floatingButtons.forEach(button => {
    // Mejorar accesibilidad con teclado
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
});

// ===== CARRUSEL DE IMÁGENES =====
class ImageCarousel {
  constructor(container) {
    this.container = container;
    this.track = container.querySelector('.carousel-track');
    this.slides = Array.from(container.querySelectorAll('.carousel-slide'));
    this.prevBtn = container.querySelector('.carousel-btn-prev');
    this.nextBtn = container.querySelector('.carousel-btn-next');
    this.dots = Array.from(container.querySelectorAll('.carousel-dot'));
    
    this.currentIndex = 0;
    this.autoSlideInterval = null;
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isTransitioning = false;
    
    this.init();
  }
  
  init() {
    // Eventos de navegación
    this.prevBtn.addEventListener('click', () => this.goToPrevSlide());
    this.nextBtn.addEventListener('click', () => this.goToNextSlide());
    
    // Eventos de dots
    this.dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToSlide(index);
      });
    });
    
    // Soporte táctil (swipe)
    this.track.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
    this.track.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    
    // Soporte de teclado
    this.container.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.goToPrevSlide();
      if (e.key === 'ArrowRight') this.goToNextSlide();
    });
    
    // Auto-slide
    this.startAutoSlide();
    
    // Pausar auto-slide al hacer hover
    this.container.addEventListener('mouseenter', () => this.stopAutoSlide());
    this.container.addEventListener('mouseleave', () => this.startAutoSlide());
    
    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopAutoSlide();
      } else {
        this.startAutoSlide();
      }
    });
  }
  
  goToSlide(index) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    
    // Remover active de slide y dot actuales
    this.slides[this.currentIndex].classList.remove('active');
    this.dots[this.currentIndex].classList.remove('active');
    
    // Actualizar índice
    this.currentIndex = index;
    
    // Agregar active a nuevos elementos
    this.slides[this.currentIndex].classList.add('active');
    this.dots[this.currentIndex].classList.add('active');
    
    // Mover el track
    const offset = -this.currentIndex * 100;
    this.track.style.transform = `translateX(${offset}%)`;
    
    // Permitir nueva transición después de completar
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }
  
  goToNextSlide() {
    const nextIndex = (this.currentIndex + 1) % this.slides.length;
    this.goToSlide(nextIndex);
  }
  
  goToPrevSlide() {
    const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
    this.goToSlide(prevIndex);
  }
  
  handleTouchStart(e) {
    this.touchStartX = e.touches[0].clientX;
  }
  
  handleTouchEnd(e) {
    this.touchEndX = e.changedTouches[0].clientX;
    this.handleSwipe();
  }
  
  handleSwipe() {
    const swipeThreshold = 50;
    const diff = this.touchStartX - this.touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe izquierda - siguiente
        this.goToNextSlide();
      } else {
        // Swipe derecha - anterior
        this.goToPrevSlide();
      }
    }
  }
  
  startAutoSlide() {
    this.stopAutoSlide(); // Limpiar cualquier intervalo existente
    this.autoSlideInterval = setInterval(() => {
      this.goToNextSlide();
    }, 5000); // Cambiar cada 5 segundos
  }
  
  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const carouselContainer = document.querySelector('.carousel-container');
  if (carouselContainer) {
    new ImageCarousel(carouselContainer);
  }
});

// ===== VIDEO LOCAL CON REPRODUCCIÓN AUTOMÁTICA AL ENTRAR EN VIEWPORT =====
document.addEventListener('DOMContentLoaded', () => {
  const localVideo = document.getElementById('local-video');
  
  if (localVideo) {
    // Opciones del IntersectionObserver
    const videoObserverOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5 // Video debe estar al menos 50% visible
    };
    
    // Callback cuando el video entra/sale del viewport
    const videoObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Video entra en el viewport - reproducir
          localVideo.play().catch(error => {
            console.log('Autoplay bloqueado por el navegador:', error);
          });
        } else {
          // Video sale del viewport - pausar
          localVideo.pause();
        }
      });
    };
    
    // Crear y activar el observer
    const videoObserver = new IntersectionObserver(videoObserverCallback, videoObserverOptions);
    videoObserver.observe(localVideo);
    
    // Pausar cuando la página no está visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        localVideo.pause();
      }
    });
  }
});

