// ==========================================
// MANEJADORES DE EVENTOS
// ==========================================

import { state } from './config.js';
import { applyFilters, clearFilters } from './filters.js';
import { updateUrl, readUrlAndApply } from './url.js';

/**
 * Configura todos los event listeners
 */
export function setupEventListeners() {
  const elements = state.elements;
  if (!elements) {
    console.error('❌ Elementos no inicializados');
    return;
  }

  // Búsqueda en tiempo real (sin actualizar historial en cada tecla)
  elements.searchInput?.addEventListener('input', () => {
    applyFilters();
    updateUrl(false);
  });

  // Búsqueda al presionar Enter
  elements.searchInput?.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') { 
      e.preventDefault(); 
      applyFilters(); 
      updateUrl(true); 
    } 
  });

  // Botón de búsqueda
  elements.searchBtn?.addEventListener('click', (e) => { 
    e.preventDefault(); 
    applyFilters(); 
    updateUrl(true); 
  });

  // Filtros desplegables
  [
    elements.modalidadFilter, 
    elements.areaFilter, 
    elements.experienciaFilter, 
    elements.salarioFilter,
    elements.ciudadFilter,
    elements.techFilter
  ].forEach((element) => {
    element?.addEventListener('change', () => {
      applyFilters();
      updateUrl(true);
    });
  });

  // Botón limpiar filtros
  elements.clearBtn?.addEventListener('click', () => {
    clearFilters();
    updateUrl(true);
  });

  // Botones "Aplicar" en las tarjetas
  elements.jobsContainer?.addEventListener("click", (e) => {
    const button = e.target;
    if (button.classList && button.classList.contains("apply-btn")) {
      e.preventDefault();
      button.textContent = "¡Aplicado!";
      button.classList.add("is-applied");
      button.disabled = true;
    }
  });

  // Navegación del historial del navegador
  window.addEventListener('popstate', () => {
    readUrlAndApply();
  });

  console.log('✅ Event listeners configurados');
}
