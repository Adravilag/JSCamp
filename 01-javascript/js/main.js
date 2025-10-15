// ==========================================
// PUNTO DE ENTRADA PRINCIPAL
// ==========================================

import { initElements } from './config.js';
import { loadAndRenderJobs } from './api.js';
import { setupEventListeners } from './events.js';
import { readUrlAndApply } from './url.js';
import { initTechFilter } from './tech-filter.js';
import { initCityFilter } from './city-filter.js';
import { tooltipManager } from './tooltips.js';
import { initializeUXEnhancements } from './ux-enhancements.js';
import { setupPaginationListeners } from './pagination-component.js';

/**
 * Inicializa la aplicación
 */
async function init() {
  console.log('🚀 Iniciando aplicación DevJobs...');
  
  try {
    // 1. Inicializar elementos del DOM
    const elements = initElements();
    
    if (!elements.jobsContainer) {
      throw new Error('Contenedor de empleos no encontrado');
    }
    
    // 2. Inicializar sistema de tooltips
    console.log('📝 Inicializando tooltips contextuales...');
    
    // 3. Configurar event listeners
    setupEventListeners();
    
    // 4. Inicializar sistema de paginación
    setupPaginationListeners();
    
    // 5. Inicializar filtros multi-select
    initTechFilter();
    initCityFilter();
    
    // 6. Cargar y renderizar empleos desde JSON
    await loadAndRenderJobs(elements.jobsContainer);
    
    // 7. Aplicar filtros desde URL
    readUrlAndApply();
    
    // 8. Inicializar mejoras de UX
    initializeUXEnhancements();
    
    console.log('✅ Aplicación inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
  }
}

// Iniciar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
