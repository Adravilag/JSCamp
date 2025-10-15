// ==========================================
// INTEGRACIÓN WEB COMPONENT + PAGINACIÓN
// ==========================================

import { renderJobs } from './render.js';

/**
 * Configuración
 */
const PAGINATION_CONFIG = {
  LIMIT: 12,
};

/**
 * Estado global de paginación
 */
export const paginationState = {
  offset: 0,
  limit: PAGINATION_CONFIG.LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  filteredItems: [],
};

/**
 * Obtener referencia al Web Component
 */
function getPaginationComponent() {
  return document.querySelector('devjobs-pagination');
}

/**
 * Obtener items de una página
 */
export function getPageItems(items, page) {
  const offset = (page - 1) * paginationState.limit;
  paginationState.offset = offset;
  return items.slice(offset, offset + paginationState.limit);
}

/**
 * Calcular total de páginas
 */
function calculateTotalPages(itemsCount) {
  return Math.ceil(itemsCount / paginationState.limit);
}

/**
 * Inicializar paginación
 */
export function initPagination(filteredItems) {
  // Validar
  if (!Array.isArray(filteredItems)) {
    console.error('filteredItems no es un array');
    filteredItems = [];
  }
  
  // Actualizar estado
  paginationState.filteredItems = filteredItems;
  paginationState.totalItems = filteredItems.length;
  paginationState.totalPages = calculateTotalPages(filteredItems.length);
  paginationState.currentPage = 1;
  paginationState.offset = 0;
  
  // Obtener componente y actualizar
  const paginationComponent = getPaginationComponent();
  if (paginationComponent) {
    paginationComponent.setState(1, paginationState.totalPages, paginationState.limit);
  }
  
  // Renderizar primera página
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    const pageItems = getPageItems(filteredItems, 1);
    renderJobs(pageItems, jobsContainer);
  }
}

/**
 * Navegar a página (llamado por el Web Component)
 */
export function goToPage(page) {
  const { totalPages } = paginationState;
  
  if (page < 1 || page > totalPages || page === paginationState.currentPage) {
    return;
  }
  
  paginationState.currentPage = page;
  
  // Obtener items
  const pageItems = getPageItems(paginationState.filteredItems, page);
  
  // Renderizar
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    renderJobs(pageItems, jobsContainer);
  }
  
  // Desplazar
  jobsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Setup listeners del Web Component
 */
export function setupPaginationListeners() {
  const paginationComponent = getPaginationComponent();
  
  if (paginationComponent) {
    paginationComponent.addEventListener('page-change', (e) => {
      const { page } = e.detail;
      goToPage(page);
    });
  }
}
