// ==========================================
// CONFIGURACIÓN Y CONSTANTES
// ==========================================

/**
 * Constantes de la aplicación
 */
export const CONFIG = {
  JSON_PATH: 'data/jobs.json',
  LEVELS: ["junior", "mid", "senior", "lead"],
  MODALIDAD_MAP: {
    'remote': 'remoto',
    'onsite': 'presencial',
    'hybrid': 'hibrido'
  }
};

/**
 * Selectores del DOM
 */
export const SELECTORS = {
  jobsList: ".jobs-list",
  searchInput: "#search-input, .search-input",
  modalidadFilter: "#modalidad-filter",
  areaFilter: "#area-filter",
  experienciaFilter: "#experiencia-filter",
  salarioFilter: "#salario-filter",
  clearBtn: ".clear-filters-btn",
  searchBtn: ".search-btn",
  statusTitle: ".jobs-section-title",
  jobsContainer: '.jobs-container',
  jobCard: '.job-card'
};

/**
 * Estado global de la aplicación
 */
export const state = {
  jobsData: [],
  elements: {}
};

/**
 * Inicializa los elementos del DOM
 */
export function initElements() {
  state.elements = {
    jobsList: document.querySelector(SELECTORS.jobsList),
    searchInput: document.querySelector(SELECTORS.searchInput),
    modalidadFilter: document.querySelector(SELECTORS.modalidadFilter),
    areaFilter: document.querySelector(SELECTORS.areaFilter),
    experienciaFilter: document.querySelector(SELECTORS.experienciaFilter),
    salarioFilter: document.querySelector(SELECTORS.salarioFilter),
    clearBtn: document.querySelector(SELECTORS.clearBtn),
    searchBtn: document.querySelector(SELECTORS.searchBtn),
    statusTitle: document.querySelector(SELECTORS.statusTitle),
    jobsContainer: document.querySelector(SELECTORS.jobsContainer)
  };
  
  return state.elements;
}
