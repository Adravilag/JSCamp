// 📦 Web Component: DevJobs Card con todos los métodos de parámetros

class DevJobsCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Estado interno
    this._jobData = null;
    this._highlighted = false;
  }

  // ==========================================
  // 1️⃣ OBSERVED ATTRIBUTES (Atributos observados)
  // ==========================================
  static get observedAttributes() {
    return ['job-id', 'highlighted', 'size'];
  }

  // Se ejecuta cuando cambia un atributo observado
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Atributo "${name}" cambió:`, oldValue, '→', newValue);
    
    switch(name) {
      case 'highlighted':
        this._highlighted = newValue !== null;
        break;
      case 'size':
        // Puedes reaccionar a cambios
        break;
    }
    
    this.render();
  }

  // ==========================================
  // 2️⃣ PROPERTIES (Propiedades JavaScript)
  // ==========================================
  
  // Propiedad para datos complejos (objeto)
  set jobData(value) {
    this._jobData = value;
    this.render();
  }

  get jobData() {
    return this._jobData;
  }

  // Sincronizar propiedad booleana con atributo
  set highlighted(value) {
    if (value) {
      this.setAttribute('highlighted', '');
    } else {
      this.removeAttribute('highlighted');
    }
  }

  get highlighted() {
    return this.hasAttribute('highlighted');
  }

  // ==========================================
  // 3️⃣ LIFECYCLE CALLBACKS
  // ==========================================
  
  connectedCallback() {
    console.log('✅ Componente conectado al DOM');
    this.render();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    console.log('❌ Componente desconectado del DOM');
    this.cleanup();
  }

  // ==========================================
  // 4️⃣ EVENT HANDLING (Eventos personalizados)
  // ==========================================
  
  setupEventListeners() {
    // Event delegation en shadow root
    this.shadowRoot.addEventListener('click', (e) => {
      if (e.target.classList.contains('apply-btn')) {
        this.handleApply();
      }
      if (e.target.classList.contains('favorite-btn')) {
        this.handleFavorite();
      }
    });
  }

  handleApply() {
    // Emitir evento personalizado
    this.dispatchEvent(new CustomEvent('job-apply', {
      detail: { 
        jobId: this._jobData?.id,
        jobTitle: this._jobData?.titulo 
      },
      bubbles: true,    // Puede burbujear hacia arriba
      composed: true    // Atraviesa shadow DOM
    }));
  }

  handleFavorite() {
    this.dispatchEvent(new CustomEvent('job-favorite', {
      detail: { jobId: this._jobData?.id },
      bubbles: true,
      composed: true
    }));
  }

  cleanup() {
    // Limpiar event listeners si es necesario
  }

  // ==========================================
  // 5️⃣ RENDER
  // ==========================================
  
  render() {
    if (!this._jobData) {
      this.shadowRoot.innerHTML = `
        <style>${this.getStyles()}</style>
        <div class="card loading">
          <p>⏳ Cargando empleo...</p>
        </div>
      `;
      return;
    }

    const jobId = this.getAttribute('job-id') || this._jobData.id;
    const size = this.getAttribute('size') || 'normal';
    const isHighlighted = this._highlighted;

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      
      <article 
        class="card ${isHighlighted ? 'highlighted' : ''} ${size}"
        data-job-id="${jobId}">
        
        <!-- Header con logo y acciones -->
        <header class="card-header">
          <div class="company-logo-wrapper">
            ${this.createCompanyAvatar(this._jobData.company || this._jobData.empresa || 'Company')}
          </div>
          
          <div class="card-title-section">
            <h3 class="job-title">${this._jobData.title || this._jobData.titulo || 'Sin título'}</h3>
            <p class="company-name">${this._jobData.company || this._jobData.empresa || 'Sin empresa'}</p>
          </div>
          
          <!-- Slot para acciones personalizadas -->
          <div class="card-actions">
            <slot name="actions">
              <button class="favorite-btn" title="Agregar a favoritos">
                ❤️
              </button>
            </slot>
          </div>
        </header>

        <!-- Descripción -->
        <div class="card-body">
          <!-- Slot por defecto para contenido personalizado -->
          <slot>
            <p class="job-description">${this._jobData.description || this._jobData.descripcion || 'Sin descripción'}</p>
          </slot>
        </div>

        <!-- Tecnologías -->
        <div class="tech-tags">
          ${(this._jobData.details?.technologies || this._jobData.data?.technology || []).map(tech => 
            `<span class="tech-tag">${tech}</span>`
          ).join('')}
        </div>

        <!-- Footer con info y botón -->
        <footer class="card-footer">
          <div class="job-info">
            <span class="info-tag">
              ${this.getModalidadIcon(this._jobData.details?.workMode || this._jobData.data?.modalidad)}
              ${this.getModalidadLabel(this._jobData.details?.workMode || this._jobData.data?.modalidad)}
            </span>
            <span class="info-tag">
              📍 ${this._jobData.details?.city || this._jobData.data?.city || 'No especificado'}
            </span>
            <span class="info-tag">
              💶 ${this.formatSalary(this._jobData.details?.salary || this._jobData.data?.salary)}
            </span>
          </div>
          
          <!-- Slot para botón personalizado -->
          <slot name="action-button">
            <button class="apply-btn">Aplicar</button>
          </slot>
        </footer>
      </article>
    `;
  }

  // ==========================================
  // 6️⃣ HELPER METHODS
  // ==========================================
  
  /**
   * Crea un avatar para la empresa usando devjobs-avatar con unavatar.io
   */
  createCompanyAvatar(companyName) {
    // Para empresas conocidas (Google, Netflix, Amazon, etc.)
    // usar directamente company.toLowerCase() + '.com'
    const unavatarUrl = `https://unavatar.io/${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    
    // Usar el componente devjobs-avatar con unavatar
    return `<devjobs-avatar 
              src="${unavatarUrl}"
              alt="Logo de ${companyName}"
              size="48px"
              shape="rounded"
              fallback="https://unavatar.io/${encodeURIComponent(companyName)}">
            </devjobs-avatar>`;
  }
  
  getModalidadIcon(modalidad) {
    const icons = {
      'remote': '🏠',
      'onsite': '🏢',
      'hybrid': '🔄'
    };
    return icons[modalidad] || '📍';
  }

  getModalidadLabel(modalidad) {
    const labels = {
      'remote': 'Remoto',
      'onsite': 'Presencial',
      'hybrid': 'Híbrido'
    };
    return labels[modalidad] || 'No especificado';
  }

  formatSalary(salary) {
    if (!salary) return 'No especificado';
    const [min, max] = salary.split('-');
    return `€${parseInt(min).toLocaleString()} - €${parseInt(max).toLocaleString()}`;
  }

  // ==========================================
  // 7️⃣ STYLES
  // ==========================================
  
  getStyles() {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .card:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .card.highlighted {
        border: 2px solid #3b82f6;
        background: linear-gradient(to bottom, #eff6ff, white);
      }

      .card.small {
        padding: 1rem;
        font-size: 0.875rem;
      }

      .card.large {
        padding: 2rem;
        font-size: 1.125rem;
      }

      /* Header */
      .card-header {
        display: flex;
        align-items: start;
        gap: 1rem;
        margin-bottom: 1rem;
      }

      .company-logo-wrapper {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      /* Estilos para el componente devjobs-avatar anidado */
      .company-logo-wrapper devjobs-avatar {
        width: 48px;
        height: 48px;
      }

      .card-title-section {
        flex: 1;
      }

      .job-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.25rem;
      }

      .company-name {
        color: #64748b;
        font-size: 0.875rem;
      }

      .card-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Body */
      .card-body {
        margin-bottom: 1rem;
      }

      .job-description {
        color: #475569;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      /* Tech Tags */
      .tech-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .tech-tag {
        background: #e0e7ff;
        color: #4338ca;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
      }

      /* Footer */
      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #e2e8f0;
      }

      .job-info {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        flex: 1;
      }

      .info-tag {
        color: #64748b;
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      /* Buttons */
      button {
        cursor: pointer;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        transition: all 0.2s;
      }

      .apply-btn {
        background: #3b82f6;
        color: white;
        padding: 0.5rem 1.5rem;
        font-size: 0.875rem;
      }

      .apply-btn:hover {
        background: #2563eb;
        transform: scale(1.05);
      }

      .favorite-btn {
        background: transparent;
        padding: 0.5rem;
        font-size: 1.25rem;
        border: 1px solid #e2e8f0;
      }

      .favorite-btn:hover {
        background: #fef2f2;
        border-color: #fca5a5;
      }

      /* Loading */
      .card.loading {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        color: #94a3b8;
      }

      /* Slots */
      ::slotted(*) {
        margin: 0;
      }

      ::slotted(h1),
      ::slotted(h2),
      ::slotted(h3) {
        color: #1e293b;
      }
    `;
  }
}

// Registrar el componente
customElements.define('devjobs-card', DevJobsCard);
