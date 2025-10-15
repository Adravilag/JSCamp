// ==========================================
// CARGA DE DATOS (API)
// ==========================================

import { CONFIG, state } from './config.js';
import { renderJobs, renderError } from './render.js';
import { applyFilters } from './filters.js';
import { showSkeletonLoader, hideSkeletonLoader } from './ui-feedback.js';

/**
 * Carga los empleos desde el archivo JSON
 */
export async function fetchJobs() {
  console.log('🔄 Cargando empleos desde JSON...');
  
  try {
    const response = await fetch(CONFIG.JSON_PATH);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} empleos cargados correctamente`);
    
    return data;
    
  } catch (error) {
    console.error('❌ Error al cargar empleos:', error);
    throw error;
  }
}

/**
 * Carga y renderiza los empleos
 */
export async function loadAndRenderJobs(container) {
  try {
    // Mostrar skeleton loader
    showSkeletonLoader(container, 6);
    
    // Simular delay mínimo para mostrar el loading (opcional)
    const [data] = await Promise.all([
      fetchJobs(),
      new Promise(resolve => setTimeout(resolve, 500))
    ]);
    
    state.jobsData = data;
    
    // Ocultar skeleton y renderizar trabajos reales
    hideSkeletonLoader(container);
    renderJobs(state.jobsData, container);
    applyFilters();
  } catch (error) {
    hideSkeletonLoader(container);
    renderError(container, error);
  }
}

