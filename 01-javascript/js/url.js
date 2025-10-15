// ==========================================
// GESTIÓN DE URL Y PARÁMETROS
// ==========================================

import { state } from './config.js';
import { applyFilters } from './filters.js';

/**
 * Obtiene los parámetros de URL desde los campos del UI
 */
export function getParamsFromUI() {
  const elements = state.elements;
  if (!elements) return '';

  const params = new URLSearchParams();
  const values = {
    q: elements.searchInput?.value?.trim(),
    modalidad: elements.modalidadFilter?.value,
    area: elements.areaFilter?.value,
    experience: elements.experienciaFilter?.value,
    salary: elements.salarioFilter?.value,
    ciudad: elements.ciudadFilter?.value,
    tech: elements.techFilter?.value
  };
  
  if (values.q) params.set('q', values.q);
  if (values.modalidad) params.set('modalidad', values.modalidad);
  if (values.area) params.set('area', values.area);
  if (values.experience) params.set('experience', values.experience);
  if (values.salary) params.set('salary', values.salary);
  if (values.ciudad) params.set('ciudad', values.ciudad);
  if (values.tech) params.set('tech', values.tech);
  
  return params.toString();
}

/**
 * Actualiza la URL con los parámetros actuales
 */
export function updateUrl(pushToHistory = true) {
  const basePath = window.location.pathname;
  const queryString = getParamsFromUI();
  const newUrl = queryString ? `${basePath}?${queryString}#empleos` : `${basePath}#empleos`;
  
  if (pushToHistory) {
    history.pushState({}, '', newUrl);
  } else {
    history.replaceState({}, '', newUrl);
  }
}

/**
 * Lee los parámetros de la URL y los aplica a los filtros
 */
export function readUrlAndApply() {
  const elements = state.elements;
  if (!elements) return;

  const params = new URLSearchParams(window.location.search);
  
  const query = params.get('q');
  const modalidad = params.get('modalidad');
  const area = params.get('area');
  const experience = params.get('experience');
  const salary = params.get('salary');
  const ciudad = params.get('ciudad');
  const tech = params.get('tech');
  
  if (elements.searchInput && query !== null) elements.searchInput.value = query;
  if (elements.modalidadFilter && modalidad !== null) elements.modalidadFilter.value = modalidad;
  if (elements.areaFilter && area !== null) elements.areaFilter.value = area;
  if (elements.experienciaFilter && experience !== null) elements.experienciaFilter.value = experience;
  if (elements.salarioFilter && salary !== null) elements.salarioFilter.value = salary;
  if (elements.ciudadFilter && ciudad !== null) elements.ciudadFilter.value = ciudad;
  if (elements.techFilter && tech !== null) elements.techFilter.value = tech;
  
  applyFilters();
}
