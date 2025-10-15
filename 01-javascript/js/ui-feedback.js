// ==========================================
// UI FEEDBACK - Toasts, Loading, Notifications
// ==========================================

/**
 * Muestra un skeleton loader mientras se cargan los datos
 */
export function showSkeletonLoader(container, count = 6) {
  const skeletons = Array.from({ length: count }, (_, i) => `
    <div class="job-card skeleton-card" style="animation-delay: ${i * 0.1}s">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-info">
          <div class="skeleton-line title"></div>
          <div class="skeleton-line subtitle"></div>
          <div class="skeleton-line small"></div>
        </div>
      </div>
      <div class="skeleton-tags">
        <div class="skeleton-tag"></div>
        <div class="skeleton-tag"></div>
        <div class="skeleton-tag"></div>
      </div>
      <div class="skeleton-footer">
        <div class="skeleton-line small"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="loading-container">
      <div class="loading-message">
        <div class="loading-spinner"></div>
        <span>Cargando ${count} ofertas de empleo...</span>
      </div>
    </div>
    ${skeletons}
  `;
}

/**
 * Oculta el skeleton loader
 */
export function hideSkeletonLoader(container) {
  const loadingContainer = container.querySelector('.loading-container');
  const skeletons = container.querySelectorAll('.skeleton-card');
  
  if (loadingContainer) {
    loadingContainer.remove();
  }
  
  skeletons.forEach(skeleton => skeleton.remove());
}

/**
 * Sistema de Toasts para notificaciones
 */
class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = new Map();
    this.init();
  }

  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  show(options) {
    const {
      type = 'info', // 'success', 'error', 'info'
      title,
      message,
      duration = 5000,
      actions = []
    } = options;

    const toastId = Date.now() + Math.random();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.dataset.toastId = toastId;

    const icon = this.getIcon(type);

    const actionsHTML = actions.length > 0 ? `
      <div class="toast-actions">
        ${actions.map(action => `
          <button class="toast-action" data-action="${action.id}">
            ${action.label}
          </button>
        `).join('')}
      </div>
    ` : '';

    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-content">
        ${title ? `<div class="toast-title">${title}</div>` : ''}
        ${message ? `<div class="toast-message">${message}</div>` : ''}
        ${actionsHTML}
      </div>
      <button class="toast-close">×</button>
    `;

    this.container.appendChild(toast);
    this.toasts.set(toastId, toast);

    // Event listeners
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => this.hide(toastId));

    // Action buttons
    actions.forEach(action => {
      const btn = toast.querySelector(`[data-action="${action.id}"]`);
      if (btn) {
        btn.addEventListener('click', () => {
          action.callback();
          this.hide(toastId);
        });
      }
    });

    // Auto-hide
    if (duration > 0) {
      setTimeout(() => this.hide(toastId), duration);
    }

    return toastId;
  }

  hide(toastId) {
    const toast = this.toasts.get(toastId);
    if (toast) {
      toast.classList.add('toast-exit');
      setTimeout(() => {
        toast.remove();
        this.toasts.delete(toastId);
      }, 300);
    }
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }

  success(title, message, options = {}) {
    return this.show({ type: 'success', title, message, ...options });
  }

  error(title, message, options = {}) {
    return this.show({ type: 'error', title, message, ...options });
  }

  info(title, message, options = {}) {
    return this.show({ type: 'info', title, message, ...options });
  }
}

// Instancia singleton
export const toast = new ToastManager();

/**
 * Muestra el indicador de filtros activos
 */
export function showFiltersStatus(message) {
  const existingStatus = document.querySelector('.filters-active-status');
  if (existingStatus) {
    existingStatus.remove();
  }

  const statusBar = document.createElement('div');
  statusBar.className = 'filters-active-status';
  statusBar.innerHTML = message;

  const searchBar = document.querySelector('.search-bar');
  if (searchBar) {
    searchBar.insertAdjacentElement('afterend', statusBar);
  }
}

/**
 * Oculta el indicador de filtros activos
 */
export function hideFiltersStatus() {
  const statusBar = document.querySelector('.filters-active-status');
  if (statusBar) {
    statusBar.remove();
  }
}

/**
 * Sistema de gestión de postulaciones
 */
class ApplicationManager {
  constructor() {
    this.applications = this.loadApplications();
  }

  loadApplications() {
    try {
      const stored = localStorage.getItem('devjobs_applications');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  saveApplications() {
    try {
      localStorage.setItem('devjobs_applications', JSON.stringify(this.applications));
    } catch (error) {
      console.error('Error guardando postulaciones:', error);
    }
  }

  apply(jobId, jobTitle, company) {
    const timestamp = Date.now();
    this.applications[jobId] = {
      timestamp,
      jobTitle,
      company,
      date: new Date().toISOString()
    };
    this.saveApplications();

    // Mostrar toast con opción de deshacer
    const toastId = toast.success(
      '¡Postulación enviada!',
      `Tu aplicación para ${jobTitle} en ${company} ha sido enviada correctamente.`,
      {
        duration: 8000,
        actions: [
          {
            id: 'undo',
            label: 'Deshacer',
            callback: () => this.undoApplication(jobId, jobTitle, company)
          }
        ]
      }
    );

    // Actualizar UI del botón
    this.updateButtonState(jobId, true);

    return toastId;
  }

  undoApplication(jobId, jobTitle, company) {
    delete this.applications[jobId];
    this.saveApplications();

    toast.info(
      'Postulación cancelada',
      `Se ha retirado tu aplicación para ${jobTitle} en ${company}.`,
      { duration: 4000 }
    );

    // Actualizar UI del botón
    this.updateButtonState(jobId, false);
  }

  hasApplied(jobId) {
    return !!this.applications[jobId];
  }

  getApplicationDate(jobId) {
    return this.applications[jobId]?.date;
  }

  updateButtonState(jobId, applied) {
    const buttons = document.querySelectorAll(`[data-job-id="${jobId}"]`);
    buttons.forEach(button => {
      if (applied) {
        button.classList.add('applied');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Ya postulado
        `;
        button.disabled = true;
      } else {
        button.classList.remove('applied');
        button.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          Postularme
        `;
        button.disabled = false;
      }
    });
  }

  getAllApplications() {
    return this.applications;
  }

  getApplicationsCount() {
    return Object.keys(this.applications).length;
  }
}

// Instancia singleton
export const applicationManager = new ApplicationManager();
