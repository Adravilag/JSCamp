// ==========================================
// SISTEMA DE PAGINACIÓN
// ==========================================

import { state } from './config.js';
import { renderJobs } from './render.js';

/**
 * Configuración de paginación
 */
export const PAGINATION_CONFIG = {
  LIMIT: 12,           // Items por página (equivalente a ITEMS_PER_PAGE)
  MAX_BUTTONS: 5,      // Botones numerados máximo
};

/**
 * Estado de paginación
 */
export const paginationState = {
  offset: 0,           // Desplazamiento actual (para backend)
  limit: PAGINATION_CONFIG.LIMIT,
  currentPage: 1,      // Página actual (para UI)
  totalPages: 1,
  totalItems: 0,
  filteredItems: [],
};

/**
 * Calcula el total de páginas
 */
export function calculateTotalPages(itemsCount) {
  return Math.ceil(itemsCount / paginationState.limit);
}

/**
 * Obtiene los items para la página actual usando LIMIT y OFFSET
 */
export function getPageItems(items, page) {
  const offset = (page - 1) * paginationState.limit;
  const limit = paginationState.limit;
  
  // Actualizar estado con offset para futuro uso con backend
  paginationState.offset = offset;
  paginationState.limit = limit;
  
  return items.slice(offset, offset + limit);
}

/**
 * Genera los números de página a mostrar
 */
export function generatePageNumbers(currentPage, totalPages) {
  const pages = [];
  const maxButtons = PAGINATION_CONFIG.MAX_BUTTONS;
  
  if (totalPages <= maxButtons) {
    // Si hay pocas páginas, mostrarlas todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Mostrar primeras páginas
    for (let i = 1; i <= Math.min(maxButtons - 1, totalPages); i++) {
      pages.push(i);
    }
    
    // Agregar puntos suspensivos si es necesario
    if (currentPage > maxButtons) {
      pages.push('...');
    }
    
    // Agregar última página
    if (currentPage <= totalPages - maxButtons + 1) {
      pages.push(totalPages);
    } else {
      pages.push(currentPage);
    }
  }
  
  return pages;
}

/**
 * Renderiza los controles de paginación
 */
export function renderPagination() {
  const paginationContainer = document.querySelector('.pagination');
  
  if (!paginationContainer) {
    console.warn('⚠️ Contenedor de paginación no encontrado');
    return;
  }
  
  const { currentPage, totalPages, filteredItems } = paginationState;
  
  console.log(`🎯 renderPagination: página ${currentPage}/${totalPages}, items: ${filteredItems.length}`);
  
  // Limpiar paginación anterior
  paginationContainer.innerHTML = '';
  
  // Si hay menos de 1 página, no mostrar paginación
  if (totalPages <= 1) {
    console.log(`⏭️ Ocultando paginación (totalPages=${totalPages})`);
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  // Botón "Anterior"
  const prevBtn = document.createElement('button');
  prevBtn.className = 'pagination-arrow prev';
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Anterior
  `;
  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  paginationContainer.appendChild(prevBtn);
  
  // Números de página
  const pageNumbers = generatePageNumbers(currentPage, totalPages);
  
  pageNumbers.forEach((page) => {
    if (page === '...') {
      const dots = document.createElement('span');
      dots.className = 'pagination-dots';
      dots.textContent = '...';
      paginationContainer.appendChild(dots);
    } else {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'pagination-btn';
      if (page === currentPage) {
        pageBtn.classList.add('active');
      }
      pageBtn.textContent = page;
      pageBtn.addEventListener('click', () => goToPage(page));
      paginationContainer.appendChild(pageBtn);
    }
  });
  
  // Botón "Siguiente"
  const nextBtn = document.createElement('button');
  nextBtn.className = 'pagination-arrow next';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = `
    Siguiente
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));
  paginationContainer.appendChild(nextBtn);
  
  // Mostrar información de página
  const startIndex = (currentPage - 1) * PAGINATION_CONFIG.ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(currentPage * PAGINATION_CONFIG.ITEMS_PER_PAGE, paginationState.totalItems);
  console.log(`📄 Página ${currentPage} de ${totalPages} (mostrando ${startIndex}-${endIndex} de ${paginationState.totalItems})`);
}

/**
 * Navega a una página específica
 */
export function goToPage(page) {
  const { totalPages } = paginationState;
  
  // Validar página
  if (page < 1 || page > totalPages || page === paginationState.currentPage) {
    console.warn(`⚠️ Navegación inválida: página ${page} de ${totalPages}`);
    return;
  }
  
  // Actualizar página actual
  paginationState.currentPage = page;
  
  // Calcular offset para backend
  const offset = (page - 1) * paginationState.limit;
  paginationState.offset = offset;
  
  console.log(`📍 Navegando a página ${page} | limit=${paginationState.limit}, offset=${offset}`);
  
  // Obtener items de la página
  const pageItems = getPageItems(paginationState.filteredItems, page);
  
  // Renderizar empleos de la página
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    renderJobs(pageItems, jobsContainer);
  }
  
  // Actualizar controles de paginación
  renderPagination();
  
  // Desplazar al inicio de la lista
  jobsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Inicializa la paginación después de filtrar
 */
export function initPagination(filteredItems) {
  console.log(`🔧 initPagination llamado con ${filteredItems.length} items`);
  
  // Validar que filteredItems sea un array
  if (!Array.isArray(filteredItems)) {
    console.error('❌ filteredItems no es un array:', filteredItems);
    return;
  }
  
  paginationState.filteredItems = filteredItems;
  paginationState.totalItems = filteredItems.length;
  paginationState.totalPages = calculateTotalPages(filteredItems.length);
  paginationState.currentPage = 1;
  paginationState.offset = 0;
  
  console.log(`� Paginación inicializada: ${filteredItems.length} items = ${paginationState.totalPages} páginas`);
  console.log(`📌 Parámetros para backend: limit=${paginationState.limit}, offset=${paginationState.offset}`);
  
  // Renderizar la primera página
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    const pageItems = getPageItems(filteredItems, 1);
    console.log(`📄 Renderizando primera página: ${pageItems.length} items`);
    renderJobs(pageItems, jobsContainer);
  }
  
  // Mostrar controles de paginación
  renderPagination();
}

/**
 * Inicializa los event listeners de paginación
 */
export function setupPaginationListeners() {
  // Los listeners se configuran dinámicamente en renderPagination()
  // No se necesita configuración adicional aquí
}
