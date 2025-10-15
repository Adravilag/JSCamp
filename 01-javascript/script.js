// ==========================================
// VARIABLES GLOBALES Y CONFIGURACIÓN
// ==========================================
let jobsData = [];

// Selección de elementos del DOM
const jobsList = document.querySelector(".jobs-list");
const qEl = document.querySelector("#search-input, .search-input");
const modalidadEl = document.querySelector("#modalidad-filter");
const areaEl = document.querySelector("#area-filter");
const expEl = document.querySelector("#experiencia-filter");
const salEl = document.querySelector("#salario-filter");
const clearBtn = document.querySelector(".clear-filters-btn");
const searchBtn = document.querySelector(".search-btn");
const statusEl = document.querySelector(".jobs-section-title");
const jobsContainer = document.querySelector('.jobs-container');

// Constantes
const LEVELS = ["junior", "mid", "senior", "lead"];

// Mapeo de valores del JSON a valores de filtros HTML
const MODALIDAD_MAP = {
  'remote': 'remoto',
  'onsite': 'presencial',
  'hybrid': 'hibrido'
};

// Helper para obtener todas las tarjetas de empleo
const getJobs = () => Array.from(document.querySelectorAll('.jobs-container .job-card'));

// ==========================================
// FUNCIONES DE RENDERIZADO
// ==========================================

/**
 * Obtiene el ícono SVG correspondiente a cada modalidad
 */
function getModalidadIcon(modalidad) {
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
function modalidadToClass(modalidad) {
  if (!modalidad) return '';
  if (modalidad === 'remoto' || modalidad === 'remote') return 'remote';
  if (modalidad === 'presencial' || modalidad === 'onsite') return 'presencial';
  if (modalidad === 'hibrido' || modalidad === 'hybrid') return 'hibrido';
  return modalidad;
}

/**
 * Convierte valor de modalidad a etiqueta legible
 */
function modalidadToLabel(modalidad) {
  if (!modalidad) return '';
  if (modalidad === 'remoto' || modalidad === 'remote') return 'Remoto';
  if (modalidad === 'presencial' || modalidad === 'onsite') return 'Presencial';
  if (modalidad === 'hibrido' || modalidad === 'hybrid') return 'Híbrido';
  return modalidad.charAt(0).toUpperCase() + modalidad.slice(1);
}

/**
 * Formatea el rango salarial para mostrar
 */
function formatSalaryLabel(range) {
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
 * Crea un elemento de tarjeta de empleo
 */
function createJobCard(job) {
  const div = document.createElement('div');
  div.className = 'job-card';
  div.id = job.id || '';
  
  // Mapear modalidad del JSON a valor del filtro HTML
  const modalidadFiltro = MODALIDAD_MAP[job.data?.modalidad] || job.data?.modalidad || '';
  
  // Establecer data attributes para filtrado
  div.dataset.modalidad = modalidadFiltro;
  div.dataset.area = job.data?.area || '';
  div.dataset.experience = job.data?.nivel || '';
  div.dataset.salary = job.data?.salary || '';
  div.dataset.city = job.data?.city || '';

  const modalidadClassName = modalidadToClass(modalidadFiltro);
  const modalidadIcon = getModalidadIcon(modalidadFiltro);

  // Construir HTML de la tarjeta
  div.innerHTML = `
    <div class="job-header">
      <div class="job-company">
        <div class="company-logo">
          <span>${(job.empresa || '').charAt(0) || 'E'}</span>
        </div>
        <div class="company-info">
          <h4 class="job-title">${job.titulo || 'Sin título'}</h4>
          <p class="company-name">${job.empresa || 'Sin empresa'}</p>
        </div>
      </div>
      <button class="apply-btn">Aplicar</button>
    </div>
    
    <p class="job-description">${job.descripcion || 'Sin descripción disponible'}</p>
    
    <div class="tech-tags">
      ${(job.data?.technology || []).map(tech => 
        `<span class="tech-tag">${tech}</span>`
      ).join('')}
    </div>
    
    <div class="job-info-tags">
      <span class="info-tag ${modalidadClassName}">
        ${modalidadIcon}
        ${modalidadToLabel(modalidadFiltro)}
      </span>
      <span class="info-tag location">
        📍 ${job.data?.city || job.ubicacion || 'Ubicación no especificada'}
      </span>
      <span class="info-tag salary">
        💶 ${formatSalaryLabel(job.data?.salary || '')}
      </span>
    </div>
  `;

  return div;
}

// ==========================================
// CARGA DE DATOS CON FETCH
// ==========================================

/**
 * Carga los empleos desde el archivo JSON y los renderiza
 */
async function fetchAndRenderJobs() {
  try {
    console.log('🔄 Cargando empleos desde JSON...');
    
    const response = await fetch('data/jobs.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    jobsData = await response.json();
    
    // Limpiar contenedor
    jobsContainer.innerHTML = '';
    
    // Renderizar todas las tarjetas
    jobsData.forEach(job => {
      const card = createJobCard(job);
      jobsContainer.appendChild(card);
    });
    
    console.log(`✅ ${jobsData.length} empleos cargados correctamente`);
    
    // Después de renderizar, aplicar filtros iniciales
    applyFilters();
    
  } catch (error) {
    console.error('❌ Error al cargar empleos:', error);
    
    jobsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Error al cargar empleos</p>
        <p>${error.message}</p>
        <p style="margin-top: 1rem;">Por favor, recarga la página.</p>
      </div>
    `;
  }
}

// ==========================================
// FUNCIONES DE FILTRADO
// ==========================================

/**
 * Parsea un rango salarial de string a objeto {min, max}
 */
function parseRange(rangeString) {
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
function overlap(jobRange, filterRange) {
  if (!filterRange) return true; // Sin filtro => coincide con todo
  if (!jobRange) return false;   // Job sin rango => no coincide si hay filtro
  return jobRange.max > filterRange.min && jobRange.min < filterRange.max;
}

/**
 * Aplica los filtros a las tarjetas de empleo
 */
function applyFilters() {
  // Obtener valores de los filtros
  const query = (qEl?.value || "").trim().toLowerCase();
  const modalidad = modalidadEl?.value || "";
  const area = areaEl?.value || "";
  const experience = expEl?.value || "";
  const salary = salEl?.value || "";

  const filterSalaryRange = parseRange(salary);
  const filterLevelIndex = LEVELS.indexOf(experience);

  let visibleCount = 0;
  const jobs = getJobs();
  
  jobs.forEach((job) => {
    // Extraer información de la tarjeta
    const title = (job.querySelector('.job-title')?.textContent || "").toLowerCase();
    const description = (job.querySelector('.job-description')?.textContent || "").toLowerCase();
    const company = (job.querySelector('.company-name')?.textContent || "").toLowerCase();
    const techTags = Array.from(job.querySelectorAll('.tech-tag'))
      .map(tag => tag.textContent.toLowerCase())
      .join(' ');
    
    // Datos de los filtros
    const jobModalidad = job.dataset.modalidad || "";
    const jobArea = job.dataset.area || "";
    const jobExperience = job.dataset.experience || "";
    const jobSalary = job.dataset.salary || "";

    const jobSalaryRange = parseRange(jobSalary);

    // Verificar búsqueda de texto
    const searchableText = `${title} ${description} ${company} ${techTags}`;
    const matchesSearch = !query || searchableText.includes(query);
    
    // Verificar modalidad
    const matchesModalidad = !modalidad || modalidad === jobModalidad;
    
    // Verificar área
    const matchesArea = !area || area === jobArea;
    
    // Verificar experiencia (permite niveles iguales o superiores)
    const jobLevelIndex = LEVELS.indexOf(jobExperience);
    const matchesExperience = !experience || 
      (jobLevelIndex >= 0 && filterLevelIndex >= 0 
        ? jobLevelIndex >= filterLevelIndex 
        : experience === jobExperience);
    
    // Verificar salario
    const matchesSalary = overlap(jobSalaryRange, filterSalaryRange);

    // Mostrar/ocultar según todos los filtros
    const shouldShow = matchesSearch && matchesModalidad && matchesArea && 
                       matchesExperience && matchesSalary;
    
    job.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount++;
  });

  // Actualizar el título de la sección con el resultado
  updateStatusTitle(visibleCount, jobs.length, query || modalidad || area || experience || salary);
  
  console.log(`📊 Filtros aplicados: ${visibleCount}/${jobs.length} empleos visibles`);
}

/**
 * Actualiza el título de la sección con el número de resultados
 */
function updateStatusTitle(visible, total, hasFilters) {
  if (!statusEl) return;
  
  if (hasFilters) {
    statusEl.textContent = `Mostrando ${visible} de ${total} empleos`;
  } else {
    statusEl.textContent = 'Resultados de búsqueda';
  }
}

// ==========================================
// GESTIÓN DE URL Y PARÁMETROS
// ==========================================

/**
 * Obtiene los parámetros de URL desde los campos del UI
 */
function getParamsFromUI() {
  const params = new URLSearchParams();
  const values = {
    q: qEl?.value?.trim(),
    modalidad: modalidadEl?.value,
    area: areaEl?.value,
    experience: expEl?.value,
    salary: salEl?.value
  };
  
  if (values.q) params.set('q', values.q);
  if (values.modalidad) params.set('modalidad', values.modalidad);
  if (values.area) params.set('area', values.area);
  if (values.experience) params.set('experience', values.experience);
  if (values.salary) params.set('salary', values.salary);
  
  return params.toString();
}

/**
 * Actualiza la URL con los parámetros actuales
 */
function updateUrl(pushToHistory = true) {
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
function readUrlAndApply() {
  const params = new URLSearchParams(window.location.search);
  
  const query = params.get('q');
  const modalidad = params.get('modalidad');
  const area = params.get('area');
  const experience = params.get('experience');
  const salary = params.get('salary');
  
  if (qEl && query !== null) qEl.value = query;
  if (modalidadEl && modalidad !== null) modalidadEl.value = modalidad;
  if (areaEl && area !== null) areaEl.value = area;
  if (expEl && experience !== null) expEl.value = experience;
  if (salEl && salary !== null) salEl.value = salary;
  
  applyFilters();
}

// ==========================================
// EVENT LISTENERS
// ==========================================

// Búsqueda en tiempo real (sin actualizar historial en cada tecla)
qEl?.addEventListener('input', () => {
  applyFilters();
  updateUrl(false);
});

// Búsqueda al presionar Enter
qEl?.addEventListener('keydown', (e) => { 
  if (e.key === 'Enter') { 
    e.preventDefault(); 
    applyFilters(); 
    updateUrl(true); 
  } 
});

// Botón de búsqueda
searchBtn?.addEventListener('click', (e) => { 
  e.preventDefault(); 
  applyFilters(); 
  updateUrl(true); 
});

// Filtros desplegables
[modalidadEl, areaEl, expEl, salEl].forEach((element) => {
  element?.addEventListener('change', () => {
    applyFilters();
    updateUrl(true);
  });
});

// Botón limpiar filtros
clearBtn?.addEventListener('click', () => {
  if (qEl) qEl.value = '';
  if (modalidadEl) modalidadEl.value = '';
  if (areaEl) areaEl.value = '';
  if (expEl) expEl.value = '';
  if (salEl) salEl.value = '';
  applyFilters(); 
  updateUrl(true);
});

// Botones "Aplicar" en las tarjetas
jobsContainer?.addEventListener("click", (e) => {
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

// ==========================================
// INICIALIZACIÓN
// ==========================================

console.log('🚀 Iniciando carga de empleos desde JSON...');

// Cargar empleos al iniciar y luego aplicar filtros de URL
fetchAndRenderJobs().then(() => {
  readUrlAndApply();
});
