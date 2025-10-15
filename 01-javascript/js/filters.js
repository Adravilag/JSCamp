// ==========================================
// SISTEMA DE FILTRADO
// ==========================================

import { CONFIG, state } from './config.js';
import { parseRange, overlap, getJobCards } from './utils.js';
import { updateStatusTitle } from './render.js';
import { getSelectedTechs, clearTechFilter } from './tech-filter.js';
import { getSelectedCity, clearCityFilter } from './city-filter.js';
import { showFiltersStatus, hideFiltersStatus, toast } from './ui-feedback.js';
import { initPagination } from './pagination-component.js';

/**
 * Genera un mensaje descriptivo de los filtros activos
 */
function generateFilterMessage(filters, visibleCount) {
  const activeFilters = [];
  
  if (filters.query) {
    activeFilters.push(`"${filters.query}"`);
  }
  
  if (filters.selectedTechs.length > 0) {
    activeFilters.push(filters.selectedTechs.join(' + '));
  }
  
  if (filters.selectedCity) {
    activeFilters.push(`📍 ${filters.selectedCity}`);
  }
  
  if (filters.modalidad && filters.modalidad !== 'all') {
    const modalidadNames = {
      'remoto': '🏠 Remoto',
      'presencial': '🏢 Presencial',
      'hibrido': '🔄 Híbrido'
    };
    activeFilters.push(modalidadNames[filters.modalidad] || filters.modalidad);
  }
  
  if (filters.area) {
    activeFilters.push(filters.area);
  }
  
  if (filters.experience) {
    activeFilters.push(`Experiencia: ${filters.experience}`);
  }
  
  if (filters.salary) {
    activeFilters.push(`Salario: ${filters.salary}`);
  }
  
  if (activeFilters.length === 0) {
    return null;
  }
  
  const filtersText = activeFilters.join(' • ');
  return `🔍 Mostrando <strong>${visibleCount}</strong> resultado${visibleCount !== 1 ? 's' : ''} para: <strong>${filtersText}</strong>`;
}

/**
 * Aplica los filtros a las tarjetas de empleo
 */
export function applyFilters() {
  const elements = state.elements;
  if (!elements) return;

  // Obtener valores de los filtros
  const query = (elements.searchInput?.value || "").trim().toLowerCase();
  const modalidad = elements.modalidadFilter?.value || "";
  const area = elements.areaFilter?.value || "";
  const experience = elements.experienciaFilter?.value || "";
  const salary = elements.salarioFilter?.value || "";
  
  // Obtener tecnologías seleccionadas del filtro multi-select
  const selectedTechs = getSelectedTechs();
  const hasTechFilter = selectedTechs.length > 0;

  // Obtener ciudad seleccionada del filtro autocomplete
  const selectedCity = getSelectedCity();
  const hasCityFilter = selectedCity.length > 0;

  const filterSalaryRange = parseRange(salary);
  const filterLevelIndex = CONFIG.LEVELS.indexOf(experience);

  // Verificar si hay filtros activos
  const hasFilters = query || (modalidad && modalidad !== 'all') || area || experience || salary || hasCityFilter || hasTechFilter;

  // Si no hay filtros, usar todos los datos directamente
  let filteredJobs = [];
  if (!hasFilters) {
    filteredJobs = state.jobsData || [];
    console.log(`✅ Sin filtros activos, usando todos los ${filteredJobs.length} empleos`);
  } else {
    // Si hay filtros, filtrar desde state.jobsData (no desde el DOM)
    filteredJobs = (state.jobsData || []).filter((jobData) => {
      // Búsqueda de texto
      const title = (jobData.title || "").toLowerCase();
      const description = (jobData.description || "").toLowerCase();
      const company = (jobData.company || "").toLowerCase();
      const techs = (jobData.details?.technologies || []).map(t => t.toLowerCase()).join(' ');
      
      const searchableText = `${title} ${description} ${company} ${techs}`;
      const matchesSearch = searchableText.includes(query);
      
      // Modalidad
      const jobModalidad = CONFIG.MODALIDAD_MAP[jobData.details?.workMode] || jobData.details?.workMode || "";
      const matchesModalidad = !modalidad || modalidad === 'all' || modalidad === jobModalidad;
      
      // Área
      const matchesArea = !area || area === jobData.details?.area;
      
      // Experiencia
      const jobLevelIndex = CONFIG.LEVELS.indexOf(jobData.details?.level || "");
      const matchesExperience = !experience || 
        (jobLevelIndex >= 0 && filterLevelIndex >= 0 
          ? jobLevelIndex >= filterLevelIndex 
          : experience === jobData.details?.level);
      
      // Salario
      const jobSalaryRange = parseRange(jobData.details?.salary || "");
      const matchesSalary = overlap(jobSalaryRange, filterSalaryRange);

      // Ciudad
      const jobCity = (jobData.details?.city || "").toLowerCase();
      const matchesCiudad = !hasCityFilter || jobCity.includes(selectedCity.toLowerCase());

      // Tecnologías
      const jobTechs = (jobData.details?.technologies || []).map(t => t.toLowerCase());
      const matchesTech = !hasTechFilter || selectedTechs.some(tech => 
        jobTechs.some(jobTech => jobTech.includes(tech.toLowerCase()))
      );

      return matchesSearch && matchesModalidad && matchesArea && 
             matchesExperience && matchesSalary && matchesCiudad && matchesTech;
    });
    
    console.log(`🔍 Filtros aplicados, ${filteredJobs.length} empleos coinciden`);
  }

  // Ahora actualizar la visualización en el DOM
  const jobs = getJobCards();
  let visibleCount = 0;
  const filteredJobIds = new Set(filteredJobs.map(j => j.id));
  
  jobs.forEach((job) => {
    const shouldShow = filteredJobIds.has(job.id);
    job.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  });
  
  // Actualizar el título de la sección con el resultado
  updateStatusTitle(elements.statusTitle, visibleCount, jobs.length, hasFilters);
  
  // Mostrar mensaje de estado de filtros si hay filtros activos
  if (hasFilters) {
    const filterMessage = generateFilterMessage({
      query,
      modalidad,
      area,
      experience,
      salary,
      selectedTechs,
      selectedCity
    }, visibleCount);
    
    if (filterMessage) {
      showFiltersStatus(filterMessage);
    }
    
    // Si no hay resultados, mostrar toast
    if (visibleCount === 0) {
      toast.info(
        'Sin resultados',
        'Intenta ajustar los filtros para ver más ofertas.',
        { duration: 4000 }
      );
    }
  } else {
    hideFiltersStatus();
  }
  
  // Inicializar paginación con los empleos filtrados
  initPagination(filteredJobs);
}

/**
 * Limpia todos los filtros
 */
export function clearFilters() {
  const elements = state.elements;
  if (!elements) return;

  if (elements.searchInput) elements.searchInput.value = '';
  if (elements.modalidadFilter) elements.modalidadFilter.value = 'all';
  if (elements.areaFilter) elements.areaFilter.value = '';
  if (elements.experienciaFilter) elements.experienciaFilter.value = '';
  if (elements.salarioFilter) elements.salarioFilter.value = '';
  
  // Limpiar los filtros avanzados
  clearTechFilter();
  clearCityFilter();
  
  // Mostrar toast de confirmación
  toast.success(
    'Filtros limpiados',
    'Se han eliminado todos los filtros aplicados.',
    { duration: 3000 }
  );
  
  applyFilters();
}
