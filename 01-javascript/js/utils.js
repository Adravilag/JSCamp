// ==========================================
// FUNCIONES UTILITARIAS
// ==========================================

import { CONFIG } from './config.js';

/**
 * Obtiene el ícono SVG correspondiente a cada modalidad
 */
export function getModalidadIcon(modalidad) {
  const icons = {
    'remoto': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" stroke-width="2" fill="none"/>
      <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    'presencial': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" fill="none"/>
      <circle cx="12" cy="10" r="3" stroke="currentColor" stroke-width="2"/>
    </svg>`,
    'hibrido': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" stroke-width="2"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" stroke-width="2"/>
    </svg>`
  };
  return icons[modalidad] || '';
}

/**
 * Convierte valor de modalidad a clase CSS
 */
export function modalidadToClass(modalidad) {
  if (!modalidad) return '';
  if (modalidad === 'remoto' || modalidad === 'remote') return 'remote';
  if (modalidad === 'presencial' || modalidad === 'onsite') return 'presencial';
  if (modalidad === 'hibrido' || modalidad === 'hybrid') return 'hibrido';
  return modalidad;
}

/**
 * Convierte valor de modalidad a etiqueta legible
 */
export function modalidadToLabel(modalidad) {
  if (!modalidad) return '';
  if (modalidad === 'remoto' || modalidad === 'remote') return 'Remoto';
  if (modalidad === 'presencial' || modalidad === 'onsite') return 'Presencial';
  if (modalidad === 'hibrido' || modalidad === 'hybrid') return 'Híbrido';
  return modalidad.charAt(0).toUpperCase() + modalidad.slice(1);
}

/**
 * Formatea el rango salarial para mostrar
 */
export function formatSalaryLabel(range) {
  if (!range) return 'Salario no especificado';
  const r = String(range).replace(/\s/g, '');
  if (r.includes('-')) {
    const parts = r.split('-');
    return `€${Number(parts[0]).toLocaleString('es-ES')} - €${Number(parts[1]).toLocaleString('es-ES')}`;
  }
  if (r.endsWith('+')) return `€${r}`;
  return r;
}

/**
 * Convierte valor de área a etiqueta legible
 */
export function areaToLabel(area) {
  const labels = {
    'frontend': 'Frontend',
    'backend': 'Backend',
    'fullstack': 'Full Stack',
    'mobile': 'Mobile',
    'devops': 'DevOps',
    'data': 'Data Science',
    'product': 'Product',
    'qa': 'QA/Testing',
    'design': 'Design',
    'security': 'Security'
  };
  return labels[area] || area;
}

/**
 * Obtiene el ícono correspondiente a cada área
 */
export function getAreaIcon(area) {
  const icons = {
    'frontend': '🎨',
    'backend': '⚙️',
    'fullstack': '🔄',
    'mobile': '📱',
    'devops': '🚀',
    'data': '📊',
    'product': '📦',
    'qa': '🧪',
    'design': '🎨',
    'security': '🔒'
  };
  return icons[area] || '💼';
}

/**
 * Convierte valor de experiencia a etiqueta legible
 */
export function experienciaToLabel(nivel) {
  const labels = {
    'junior': 'Junior',
    'mid': 'Mid',
    'senior': 'Senior',
    'lead': 'Lead'
  };
  return labels[nivel] || nivel;
}

/**
 * Obtiene el ícono correspondiente a cada nivel de experiencia
 */
export function getExperienciaIcon(nivel) {
  const icons = {
    'junior': '🌱',
    'mid': '⭐',
    'senior': '👑',
    'lead': '🚀'
  };
  return icons[nivel] || '💼';
}

/**
 * Parsea un rango salarial de string a objeto {min, max}
 */
export function parseRange(rangeString) {
  if (!rangeString) return null;
  
  const str = String(rangeString).replace(/\./g, "").trim();
  
  // Formato: "30000-50000"
  let match = str.match(/^(\d+)-(\d+)$/);
  if (match) return { min: +match[1], max: +match[2] };
  
  // Formato: "90000+"
  match = str.match(/^(\d+)\+$/);
  if (match) return { min: +match[1], max: 999999 };
  
  return null;
}

/**
 * Verifica si dos rangos se solapan
 */
export function overlap(jobRange, filterRange) {
  if (!filterRange) return true; // Sin filtro => coincide con todo
  if (!jobRange) return false;   // Job sin rango => no coincide si hay filtro
  return jobRange.max > filterRange.min && jobRange.min < filterRange.max;
}

/**
 * Obtiene todas las tarjetas de empleo del DOM
 */
export function getJobCards() {
  return Array.from(document.querySelectorAll('.jobs-container .job-card'));
}
