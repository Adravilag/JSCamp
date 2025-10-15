// ==========================================
// FILTRO AUTOCOMPLETE DE CIUDADES
// ==========================================

import { applyFilters } from './filters.js';

/**
 * Estado del filtro de ciudades
 */
export const cityFilterState = {
  selectedCity: '',
  localidades: [],
  isOpen: false
};

/**
 * Carga las localidades desde el JSON
 */
async function loadLocalidades() {
  try {
    const response = await fetch('data/localidades.json');
    const data = await response.json();
    cityFilterState.localidades = data.localidades;
    console.log(`✅ ${cityFilterState.localidades.length} localidades cargadas`);
  } catch (error) {
    console.error('❌ Error al cargar localidades:', error);
    cityFilterState.localidades = [];
  }
}

/**
 * Inicializa el filtro autocomplete de ciudades
 */
export async function initCityFilter() {
  const searchInput = document.getElementById('city-search-input');
  const suggestions = document.getElementById('city-suggestions');
  const clearIcon = document.getElementById('city-clear-icon');

  if (!searchInput || !suggestions) {
    console.warn('⚠️ Elementos del filtro de ciudades no encontrados');
    return;
  }

  // Cargar localidades desde JSON
  await loadLocalidades();

  // Manejar input de búsqueda
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    if (query.length < 2) {
      suggestions.innerHTML = '';
      suggestions.classList.remove('show');
      cityFilterState.isOpen = false;
      return;
    }

    // Filtrar localidades
    const filtered = cityFilterState.localidades.filter(loc => 
      loc.nombre.toLowerCase().includes(query) ||
      loc.provincia.toLowerCase().includes(query) ||
      loc.comunidad.toLowerCase().includes(query)
    ).slice(0, 10); // Limitar a 10 resultados

    if (filtered.length === 0) {
      suggestions.innerHTML = '<div class="city-suggestion-empty">No se encontraron ciudades</div>';
      suggestions.classList.add('show');
      cityFilterState.isOpen = true;
      return;
    }

    // Mostrar sugerencias
    suggestions.innerHTML = filtered.map(loc => `
      <div class="city-suggestion-item" data-city="${loc.nombre.toLowerCase()}">
        <span class="city-emoji">${loc.emoji}</span>
        <div class="city-info">
          <div class="city-name">${highlightMatch(loc.nombre, query)}</div>
          <div class="city-province">${loc.provincia}, ${loc.comunidad}</div>
        </div>
      </div>
    `).join('');

    suggestions.classList.add('show');
    cityFilterState.isOpen = true;

    // Añadir event listeners a las sugerencias
    suggestions.querySelectorAll('.city-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const city = item.dataset.city;
        selectCity(city, searchInput, suggestions);
      });
    });
  });

  // Manejar focus (mostrar sugerencias recientes o populares)
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length === 0) {
      showPopularCities(suggestions);
    }
  });

  // Cerrar sugerencias al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
      suggestions.classList.remove('show');
      cityFilterState.isOpen = false;
    }
  });

  // Botón limpiar
  if (clearIcon) {
    clearIcon.addEventListener('click', () => {
      searchInput.value = '';
      cityFilterState.selectedCity = '';
      suggestions.innerHTML = '';
      suggestions.classList.remove('show');
      clearIcon.style.display = 'none';
      applyFilters();
    });
  }

  // Mostrar/ocultar icono de limpiar
  searchInput.addEventListener('input', () => {
    clearIcon.style.display = searchInput.value ? 'flex' : 'none';
  });

  // Manejar teclas (Enter, Escape, Arrow Up/Down)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      suggestions.classList.remove('show');
      cityFilterState.isOpen = false;
    } else if (e.key === 'Enter') {
      const firstSuggestion = suggestions.querySelector('.city-suggestion-item');
      if (firstSuggestion) {
        const city = firstSuggestion.dataset.city;
        selectCity(city, searchInput, suggestions);
      }
    }
  });

  console.log('✅ Filtro de ciudades (autocomplete) inicializado');
}

/**
 * Selecciona una ciudad
 */
function selectCity(city, searchInput, suggestions) {
  const localidad = cityFilterState.localidades.find(
    loc => loc.nombre.toLowerCase() === city.toLowerCase()
  );

  if (localidad) {
    searchInput.value = `${localidad.emoji} ${localidad.nombre}`;
    cityFilterState.selectedCity = city;
    suggestions.classList.remove('show');
    cityFilterState.isOpen = false;
    
    // Aplicar filtros
    applyFilters();
    
    console.log(`🏙️ Ciudad seleccionada: ${localidad.nombre}`);
  }
}

/**
 * Muestra ciudades populares cuando el input está vacío
 */
function showPopularCities(suggestions) {
  const popular = [
    'Remoto',
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Bilbao'
  ];

  const popularLocalidades = cityFilterState.localidades.filter(
    loc => popular.includes(loc.nombre)
  );

  if (popularLocalidades.length === 0) return;

  suggestions.innerHTML = `
    <div class="city-suggestion-header">Ubicaciones populares</div>
    ${popularLocalidades.map(loc => `
      <div class="city-suggestion-item" data-city="${loc.nombre.toLowerCase()}">
        <span class="city-emoji">${loc.emoji}</span>
        <div class="city-info">
          <div class="city-name">${loc.nombre}</div>
          <div class="city-province">${loc.provincia}</div>
        </div>
      </div>
    `).join('')}
  `;

  suggestions.classList.add('show');
  cityFilterState.isOpen = true;

  // Añadir event listeners
  suggestions.querySelectorAll('.city-suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const city = item.dataset.city;
      const searchInput = document.getElementById('city-search-input');
      selectCity(city, searchInput, suggestions);
    });
  });
}

/**
 * Resalta el texto coincidente en las sugerencias
 */
function highlightMatch(text, query) {
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<strong>$1</strong>');
}

/**
 * Obtiene la ciudad seleccionada
 * @returns {string} Ciudad seleccionada
 */
export function getSelectedCity() {
  return cityFilterState.selectedCity;
}

/**
 * Limpia el filtro de ciudades
 */
export function clearCityFilter() {
  const searchInput = document.getElementById('city-search-input');
  const suggestions = document.getElementById('city-suggestions');
  const clearIcon = document.getElementById('city-clear-icon');
  
  if (searchInput) searchInput.value = '';
  if (suggestions) {
    suggestions.innerHTML = '';
    suggestions.classList.remove('show');
  }
  if (clearIcon) clearIcon.style.display = 'none';
  
  cityFilterState.selectedCity = '';
  cityFilterState.isOpen = false;
  
  console.log('🧹 Filtro de ciudades limpiado');
}
