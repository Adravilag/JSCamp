// ==========================================
// FILTRO DE TECNOLOGÍAS CON CHECKBOXES
// ==========================================

import { applyFilters } from './filters.js';

// Estado del filtro de tecnologías
export const techFilterState = {
  selectedTechs: new Set(),
  isOpen: false
};

/**
 * Inicializa el filtro de tecnologías con checkboxes
 */
export function initTechFilter() {
  const toggle = document.getElementById('tech-filter-toggle');
  const dropdown = document.getElementById('tech-filter-dropdown');
  const searchInput = document.getElementById('tech-search');
  const clearBtn = document.getElementById('tech-clear-btn');
  const applyBtn = document.getElementById('tech-apply-btn');
  const checkboxes = document.querySelectorAll('.tech-checkbox');

  if (!toggle || !dropdown) {
    console.warn('⚠️ Elementos del filtro de tecnologías no encontrados');
    return;
  }

  // Toggle dropdown
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    techFilterState.isOpen = !techFilterState.isOpen;
    toggle.classList.toggle('active');
    dropdown.classList.toggle('active');
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.tech-filter-container') && techFilterState.isOpen) {
      techFilterState.isOpen = false;
      toggle.classList.remove('active');
      dropdown.classList.remove('active');
    }
  });

  // Prevenir que el dropdown se cierre al hacer click dentro
  dropdown.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Buscar tecnologías
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const labels = document.querySelectorAll('.tech-checkbox-label');
      
      labels.forEach(label => {
        const text = label.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
          label.classList.remove('hidden');
        } else {
          label.classList.add('hidden');
        }
      });
    });
  }

  // Manejar cambios en checkboxes
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        techFilterState.selectedTechs.add(e.target.value);
      } else {
        techFilterState.selectedTechs.delete(e.target.value);
      }
      updateToggleLabel();
    });
  });

  // Botón limpiar
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      techFilterState.selectedTechs.clear();
      updateToggleLabel();
      applyFilters();
    });
  }

  // Botón aplicar
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      techFilterState.isOpen = false;
      toggle.classList.remove('active');
      dropdown.classList.remove('active');
      applyFilters();
    });
  }

  console.log('✅ Filtro de tecnologías inicializado');
}

/**
 * Actualiza la etiqueta del toggle con las tecnologías seleccionadas
 */
function updateToggleLabel() {
  const toggle = document.getElementById('tech-filter-toggle');
  const label = toggle?.querySelector('.tech-filter-label');
  
  if (!label) return;

  const count = techFilterState.selectedTechs.size;
  
  if (count === 0) {
    label.textContent = 'Seleccionar tecnologías';
  } else if (count === 1) {
    const tech = Array.from(techFilterState.selectedTechs)[0];
    // Capitalizar primera letra
    label.textContent = tech.charAt(0).toUpperCase() + tech.slice(1);
  } else {
    label.textContent = `${count} tecnologías seleccionadas`;
  }
}

/**
 * Obtiene las tecnologías seleccionadas
 */
export function getSelectedTechs() {
  return Array.from(techFilterState.selectedTechs);
}

/**
 * Limpia el filtro de tecnologías
 */
export function clearTechFilter() {
  const checkboxes = document.querySelectorAll('.tech-checkbox');
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
  });
  techFilterState.selectedTechs.clear();
  updateToggleLabel();
}
