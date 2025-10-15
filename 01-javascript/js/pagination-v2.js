// ==========================================
// SISTEMA DE PAGINACIÓN - MEJORADO
// ==========================================

import { state } from './config.js';
import { renderJobs } from './render.js';

/**
 * Configuración de paginación
 */
export const PAGINATION_CONFIG = {
  LIMIT: 12,           // Items por página
  MAX_BUTTONS: 5,      // Botones numerados máximo
};

/**
 * Estado de paginación
 */
export const paginationState = {
  offset: 0,           // Para backend
  limit: PAGINATION_CONFIG.LIMIT,
  currentPage: 1,
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
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    for (let i = 1; i <= Math.min(maxButtons - 1, totalPages); i++) {
      pages.push(i);
    }
    
    if (currentPage > maxButtons) {
      pages.push('...');
    }
    
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
    console.warn('Contenedor de paginacion no encontrado');
    return;
  }
  
  const { currentPage, totalPages } = paginationState;
  
  // Limpiar
  paginationContainer.innerHTML = '';
  
  // Si solo hay 1 pagina o menos, ocultar
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
  // Boton anterior
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
  
  // Numeros de pagina
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
  
  // Boton siguiente
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
}

/**
 * Navega a una página específica
 */
export function goToPage(page) {
  const { totalPages } = paginationState;
  
  if (page < 1 || page > totalPages || page === paginationState.currentPage) {
    return;
  }
  
  paginationState.currentPage = page;
  
  const offset = (page - 1) * paginationState.limit;
  paginationState.offset = offset;
  
  const pageItems = getPageItems(paginationState.filteredItems, page);
  
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    renderJobs(pageItems, jobsContainer);
  }
  
  renderPagination();
  
  jobsContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Inicializa la paginación
 */
export function initPagination(filteredItems) {
  // Asegurar que es un array
  if (!Array.isArray(filteredItems)) {
    console.error('filteredItems no es un array');
    filteredItems = [];
  }
  
  paginationState.filteredItems = filteredItems;
  paginationState.totalItems = filteredItems.length;
  paginationState.totalPages = calculateTotalPages(filteredItems.length);
  paginationState.currentPage = 1;
  paginationState.offset = 0;
  
  // Renderizar primera página
  const jobsContainer = document.querySelector('.jobs-container');
  if (jobsContainer) {
    const pageItems = getPageItems(filteredItems, 1);
    renderJobs(pageItems, jobsContainer);
  }
  
  // Mostrar paginacion
  renderPagination();
}

/**
 * Setup listeners
 */
export function setupPaginationListeners() {
  // Los listeners se configuran dinamicamente en renderPagination()
}
