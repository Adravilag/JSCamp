// ==========================================
// WEB COMPONENT: DEVJOBS-PAGINATION
// ==========================================

/**
 * Web Component para paginación reutilizable
 * 
 * Uso:
 * <devjobs-pagination 
 *   :page="1"
 *   :total-pages="10"
 *   :limit="12"
 *   @page-change="onPageChange">
 * </devjobs-pagination>
 */
class DevJobsPagination extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Estado local
    this.currentPage = 1;
    this.totalPages = 1;
    this.limit = 12;
  }

  /**
   * Atributos observados
   */
  static get observedAttributes() {
    return ['page', 'total-pages', 'limit', 'disabled'];
  }

  /**
   * Ciclo de vida: cuando el elemento se inserta en el DOM
   */
  connectedCallback() {
    this.render();
    this.setupListeners();
  }

  /**
   * Ciclo de vida: cuando cambian atributos observados
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    
    if (name === 'page') {
      this.currentPage = parseInt(newValue) || 1;
    } else if (name === 'total-pages') {
      this.totalPages = parseInt(newValue) || 1;
    } else if (name === 'limit') {
      this.limit = parseInt(newValue) || 12;
    }
    
    this.render();
  }

  /**
   * Establecer estado (desde JavaScript)
   */
  setState(page, totalPages, limit = 12) {
    this.currentPage = page;
    this.totalPages = totalPages;
    this.limit = limit;
    this.render();
  }

  /**
   * Obtener estado actual
   */
  getState() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      limit: this.limit,
      offset: (this.currentPage - 1) * this.limit,
    };
  }

  /**
   * Navegar a página
   */
  goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.render();
    
    // Disparar evento
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: {
        page: this.currentPage,
        limit: this.limit,
        offset: (this.currentPage - 1) * this.limit,
      },
      bubbles: true,
      composed: true,
    }));
  }

  /**
   * Generar números de página
   */
  generatePageNumbers() {
    const pages = [];
    const maxButtons = 5;
    
    if (this.totalPages <= maxButtons) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      for (let i = 1; i <= Math.min(maxButtons - 1, this.totalPages); i++) {
        pages.push(i);
      }
      
      if (this.currentPage > maxButtons) {
        pages.push('...');
      }
      
      if (this.currentPage <= this.totalPages - maxButtons + 1) {
        pages.push(this.totalPages);
      } else {
        pages.push(this.currentPage);
      }
    }
    
    return pages;
  }

  /**
   * Renderizar componente
   */
  render() {
    // Si solo hay 1 página, ocultar
    if (this.totalPages <= 1) {
      this.shadowRoot.innerHTML = '';
      this.style.display = 'none';
      return;
    }
    
    this.style.display = 'contents';
    
    const pageNumbers = this.generatePageNumbers();
    const isFirstPage = this.currentPage === 1;
    const isLastPage = this.currentPage === this.totalPages;
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --pagination-gap: 0.75rem;
          --pagination-btn-min-width: 44px;
          --pagination-btn-height: 44px;
          --pagination-bg: rgba(30, 41, 59, 0.8);
          --pagination-border: 1px solid rgba(100, 116, 139, 0.3);
          --pagination-text: #f1f5f9;
          --pagination-text-muted: #94a3b8;
          --pagination-accent: #E84C3D;
          --pagination-radius: 0.5rem;
          --pagination-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          --transition-smooth: 0.3s ease;
        }
        
        .pagination-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--pagination-gap);
          margin-top: 3rem;
          padding: 1rem;
          flex-wrap: wrap;
        }
        
        .pagination-btn {
          min-width: var(--pagination-btn-min-width);
          height: var(--pagination-btn-height);
          padding: 0.5rem 0.75rem;
          background: var(--pagination-bg);
          border: var(--pagination-border);
          border-radius: var(--pagination-radius);
          color: var(--pagination-text-muted);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all var(--transition-smooth);
          backdrop-filter: blur(10px);
          box-shadow: var(--pagination-shadow);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .pagination-btn:hover:not(:disabled):not(.active) {
          background: rgba(30, 41, 59, 1);
          border-color: rgba(100, 116, 139, 0.5);
          color: var(--pagination-text);
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
        }
        
        .pagination-btn.active {
          background: linear-gradient(135deg, #E84C3D 0%, #d63f33 100%);
          border-color: #E84C3D;
          color: white;
          font-weight: 600;
          box-shadow: 0 0 20px rgba(232, 76, 61, 0.4);
        }
        
        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: var(--pagination-text-muted);
        }
        
        .pagination-arrow {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          white-space: nowrap;
        }
        
        .pagination-arrow svg {
          width: 16px;
          height: 16px;
          transition: transform var(--transition-smooth);
        }
        
        .pagination-btn.prev:hover:not(:disabled) .pagination-arrow svg {
          transform: translateX(-3px);
        }
        
        .pagination-btn.next:hover:not(:disabled) .pagination-arrow svg {
          transform: translateX(3px);
        }
        
        .pagination-dots {
          color: var(--pagination-text-muted);
          padding: 0.5rem 0.25rem;
          font-size: 0.875rem;
          user-select: none;
        }
        
        @media (max-width: 640px) {
          .pagination-wrapper {
            gap: 0.5rem;
            margin-top: 2rem;
            padding: 0.75rem;
          }
          
          .pagination-btn {
            min-width: 40px;
            height: 40px;
            font-size: 0.8rem;
          }
          
          .pagination-arrow {
            gap: 0.2rem;
            font-size: 0.75rem;
          }
        }
      </style>
      
      <div class="pagination-wrapper">
        <!-- Botón Anterior -->
        <button 
          class="pagination-btn prev" 
          ${isFirstPage ? 'disabled' : ''}
          aria-label="Página anterior"
          title="Ir a página anterior">
          <span class="pagination-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Anterior</span>
          </span>
        </button>
        
        <!-- Números de página -->
        ${pageNumbers.map(page => {
          if (page === '...') {
            return `<span class="pagination-dots">...</span>`;
          }
          return `
            <button 
              class="pagination-btn ${page === this.currentPage ? 'active' : ''}"
              aria-label="Página ${page}"
              title="Ir a página ${page}"
              data-page="${page}">
              ${page}
            </button>
          `;
        }).join('')}
        
        <!-- Botón Siguiente -->
        <button 
          class="pagination-btn next" 
          ${isLastPage ? 'disabled' : ''}
          aria-label="Página siguiente"
          title="Ir a página siguiente">
          <span class="pagination-arrow">
            <span>Siguiente</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
      </div>
    `;
    
    // Setup listeners después de renderizar
    this.setupListeners();
  }

  /**
   * Configurar event listeners
   */
  setupListeners() {
    const buttons = this.shadowRoot.querySelectorAll('button');
    
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.classList.contains('prev')) {
          this.goToPage(this.currentPage - 1);
        } else if (btn.classList.contains('next')) {
          this.goToPage(this.currentPage + 1);
        } else if (btn.dataset.page) {
          this.goToPage(parseInt(btn.dataset.page));
        }
      });
    });
  }
}

// Registrar componente
customElements.define('devjobs-pagination', DevJobsPagination);

export default DevJobsPagination;
