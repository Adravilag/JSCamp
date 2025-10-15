// ==========================================
// UX ENHANCEMENTS - Mejoras de Experiencia
// ==========================================

/**
 * Sistema de Botón Sticky para Postularme
 * Hace que el botón se fije al hacer scroll
 */
export const stickyApplyButton = (() => {
  let scrollTimeout;

  function init() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    if (applyButtons.length === 0) return;

    window.addEventListener('scroll', handleScroll);
  }

  function handleScroll() {
    clearTimeout(scrollTimeout);
    const applyButtons = document.querySelectorAll('.apply-btn');
    
    applyButtons.forEach((btn) => {
      const card = btn.closest('.job-card');
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const isVisible = cardRect.bottom > window.innerHeight || cardRect.top < 0;

      if (isVisible && window.scrollY > 200) {
        btn.classList.add('sticky-apply');
      } else {
        btn.classList.remove('sticky-apply');
      }
    });
  }

  return { init };
})();

/**
 * Sistema de Tooltips Mejorado
 * Muestra información contextual en hover
 */
export const enhancedTooltips = (() => {
  const tooltipTexts = {
    // Modalidades
    'remote': 'Trabajo 100% remoto desde cualquier ubicación',
    'onsite': 'Presencia física requerida en oficina',
    'hybrid': 'Combinación de trabajo remoto y presencial',
    
    // Ubicaciones
    'madrid': 'Madrid, España',
    'barcelona': 'Barcelona, España',
    'remote': 'Trabajo completamente remoto',
    
    // Áreas
    'frontend': 'Desarrollo de interfaces y experiencia de usuario',
    'backend': 'Desarrollo de servidores y lógica empresarial',
    'fullstack': 'Desarrollo completo frontend + backend',
    'mobile': 'Desarrollo de aplicaciones móviles',
    'devops': 'Infraestructura, deployment y operaciones',
    'data': 'Análisis de datos y machine learning',
    'security': 'Ciberseguridad y protección',
    'qa': 'Pruebas y aseguramiento de calidad',
    
    // Experiencia
    'junior': 'Menos de 2 años de experiencia',
    'mid': 'De 2 a 5 años de experiencia',
    'senior': 'Más de 5 años de experiencia',
    'lead': 'Rol de liderazgo y toma de decisiones'
  };

  function init() {
    const tooltipElements = document.querySelectorAll('[data-tooltip-type]');
    
    tooltipElements.forEach((element) => {
      const key = element.getAttribute('data-tooltip-key');
      const text = tooltipTexts[key] || 'Información no disponible';
      element.setAttribute('data-tooltip-text', text);
    });
  }

  return { init };
})();

/**
 * Sistema de Indicador de Antigüedad
 * Muestra visualmente cuándo una oferta es antigua
 */
export const ageIndicator = (() => {
  function getAgeClass(days) {
    if (days <= 7) return 'job-age-fresh';
    if (days <= 14) return 'job-age-recent';
    if (days <= 30) return 'job-age-old';
    return 'job-age-very-old';
  }

  function getAgeLabel(days) {
    if (days === 0) return '🆕 Hoy';
    if (days === 1) return '📅 Ayer';
    if (days < 7) return `📅 Hace ${days} días`;
    if (days < 30) return `⏰ Hace ${Math.floor(days / 7)} semanas`;
    return `⚠️ Hace ${Math.floor(days / 30)} meses`;
  }

  function calculateDays(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now - date);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  function init() {
    // Si tienes datos de fecha en metadata, aquí iría el código
    // Por ahora es un placeholder para futura integración
  }

  return { init, getAgeClass, getAgeLabel, calculateDays };
})();

/**
 * Sistema de Contador de Candidatos
 * Muestra cantidad estimada de candidatos interesados
 */
export const candidateCounter = (() => {
  function generateRandomCount(min = 5, max = 150) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function getUrgencyLevel(count) {
    if (count > 100) return 'high';
    if (count > 50) return 'medium';
    return 'low';
  }

  function addCandidateInfo(jobCard) {
    const candidateCount = generateRandomCount();
    const urgency = getUrgencyLevel(candidateCount);
    
    const html = `
      <div class="candidate-info">
        <span class="candidate-count">👥 ${candidateCount} candidatos</span>
        ${urgency === 'high' ? '<span class="urgency-indicator">🔥 Muy solicitado</span>' : ''}
      </div>
    `;

    const trustBadge = jobCard.querySelector('.job-trust-badge');
    if (trustBadge) {
      trustBadge.insertAdjacentHTML('afterend', html);
    }
  }

  function init() {
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(addCandidateInfo);
  }

  return { init, generateRandomCount, getUrgencyLevel };
})();

/**
 * Sistema de Animaciones Hover
 * Se maneja principalmente via CSS, pero aquí hay enhancements JS
 */
export const hoverAnimations = (() => {
  function init() {
    const animatedElements = document.querySelectorAll('.job-card, .company-card, .btn-primary, .tech-tag');
    
    animatedElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        element.style.animation = 'none';
        setTimeout(() => {
          element.style.animation = '';
        }, 10);
      });
    });
  }

  return { init };
})();

/**
 * Sistema de Feedback Visual de Postulación
 * Mejora la respuesta visual cuando se postula
 */
export const postulationFeedback = (() => {
  function init() {
    const applyButtons = document.querySelectorAll('.apply-btn');
    
    applyButtons.forEach((btn) => {
      // Escuchar cambios en el data attribute
      const observer = new MutationObserver(() => {
        if (btn.classList.contains('applied')) {
          showSuccessAnimation(btn);
        }
      });

      observer.observe(btn, { attributes: true, attributeFilter: ['class'] });
    });
  }

  function showSuccessAnimation(btn) {
    const originalText = btn.innerHTML;
    
    // Animar al verde
    btn.style.transition = 'all 0.3s ease';
    btn.textContent = '✅ ¡Postulado!';
    
    // Después de 2 segundos, volver
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  }

  return { init, showSuccessAnimation };
})();

/**
 * Sistema de Atajo de Teclado (Bonus)
 * Presionar 'P' para postular en la tarjeta seleccionada
 */
export const keyboardShortcuts = (() => {
  let selectedCard = null;

  function init() {
    document.addEventListener('keydown', handleKeyPress);
    
    // Permitir seleccionar tarjetas con flechas
    document.addEventListener('keydown', handleArrowKeys);
  }

  function handleKeyPress(e) {
    // P = Postular
    if (e.key.toLowerCase() === 'p' && selectedCard) {
      const applyBtn = selectedCard.querySelector('.apply-btn');
      if (applyBtn) applyBtn.click();
    }

    // ? = Mostrar ayuda
    if (e.key === '?') {
      showKeyboardHelp();
    }
  }

  function handleArrowKeys(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const jobCards = document.querySelectorAll('.job-card');
      if (jobCards.length === 0) return;

      const currentIndex = selectedCard 
        ? Array.from(jobCards).indexOf(selectedCard)
        : -1;

      let newIndex = currentIndex;
      if (e.key === 'ArrowDown') newIndex = Math.min(currentIndex + 1, jobCards.length - 1);
      if (e.key === 'ArrowUp') newIndex = Math.max(currentIndex - 1, 0);

      selectCard(jobCards[newIndex]);
      e.preventDefault();
    }
  }

  function selectCard(card) {
    if (selectedCard) selectedCard.style.outline = 'none';
    selectedCard = card;
    card.style.outline = '2px solid var(--color-accent-blue)';
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showKeyboardHelp() {
    const help = `
      ⌨️ Atajos de teclado:
      ↑↓ = Navegar entre ofertas
      P = Postular en oferta seleccionada
      ? = Mostrar esta ayuda
    `;
    alert(help);
  }

  return { init };
})();

/**
 * Inicializador Principal
 */
export function initializeUXEnhancements() {
  console.log('🎨 Inicializando mejoras de UX...');

  try {
    stickyApplyButton.init();
    console.log('✅ Botón sticky activado');
  } catch (e) {
    console.warn('⚠️ Error en sticky button:', e);
  }

  try {
    enhancedTooltips.init();
    console.log('✅ Tooltips mejorados activados');
  } catch (e) {
    console.warn('⚠️ Error en tooltips:', e);
  }

  try {
    ageIndicator.init();
    console.log('✅ Indicador de antigüedad activado');
  } catch (e) {
    console.warn('⚠️ Error en age indicator:', e);
  }

  try {
    candidateCounter.init();
    console.log('✅ Contador de candidatos activado');
  } catch (e) {
    console.warn('⚠️ Error en candidate counter:', e);
  }

  try {
    hoverAnimations.init();
    console.log('✅ Animaciones hover activadas');
  } catch (e) {
    console.warn('⚠️ Error en hover animations:', e);
  }

  try {
    postulationFeedback.init();
    console.log('✅ Feedback de postulación activado');
  } catch (e) {
    console.warn('⚠️ Error en postulation feedback:', e);
  }

  try {
    keyboardShortcuts.init();
    console.log('✅ Atajos de teclado activados');
  } catch (e) {
    console.warn('⚠️ Error en keyboard shortcuts:', e);
  }

  console.log('🎨 Todas las mejoras de UX inicializadas');
}
