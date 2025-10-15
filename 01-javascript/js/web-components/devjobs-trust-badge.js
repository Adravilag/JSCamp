// ==========================================
// 🛡️ Web Component: DevJobs Trust Badge
// Muestra información de confianza de una empresa:
// - Badge de verificación
// - Número de ofertas activas
// - Última fecha de publicación
// - Ratings y reseñas de empleados
// ==========================================

class DevJobsTrustBadge extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._trustData = null;
    this._isExpanded = false; // Por defecto contraído
  }

  // Atributos observados
  static get observedAttributes() {
    return ['company', 'size', 'show-reviews'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  // Propiedades
  set trustData(value) {
    this._trustData = value;
    this.render();
  }

  get trustData() {
    return this._trustData;
  }

  connectedCallback() {
    // Intentar cargar datos del atributo data-trust
    const dataTrustAttr = this.getAttribute('data-trust');
    if (dataTrustAttr && !this._trustData) {
      try {
        this._trustData = JSON.parse(dataTrustAttr);
      } catch (e) {
        console.warn('⚠️ Error al parsear data-trust:', e);
      }
    }
    this.render();
    this.setupToggleListener();
  }

  /**
   * Configura el listener para el toggle de expansión
   */
  setupToggleListener() {
    const toggleBtn = this.shadowRoot.querySelector('.trust-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this._isExpanded = !this._isExpanded;
        this.render();
        this.setupToggleListener(); // Re-configurar después de re-render
      });
    }
  }

  /**
   * Calcula cuánto tiempo hace que se publicó la oferta
   */
  getTimeAgoText(dateString) {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMs = now - postDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
  }

  /**
   * Genera estrellas para el rating
   */
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars += '⭐';
      } else if (i === fullStars && hasHalfStar) {
        stars += '✨';
      } else {
        stars += '☆';
      }
    }

    return stars;
  }

  /**
   * Determina el color del badge según el rating
   */
  getRatingColor(rating) {
    if (rating >= 4.7) return '#10b981'; // Verde
    if (rating >= 4.0) return '#f59e0b'; // Amarillo
    if (rating >= 3.0) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  }

  /**
   * Determina si una oferta es "Muy solicitada"
   */
  isHighlyRequested(candidateCount) {
    return candidateCount && candidateCount >= 100;
  }

  /**
   * Renderiza el componente
   */
  render() {
    if (!this._trustData) {
      this.shadowRoot.innerHTML = `
        <style>${this.getStyles()}</style>
        <div class="trust-badge empty">
          <p>No hay datos de confianza disponibles</p>
        </div>
      `;
      return;
    }

    const {
      verified,
      verificationBadge,
      activeOffers,
      lastPostDate,
      companyWebsite,
      rating,
      reviewsCount,
      employeeReviews,
      candidateCount,
    } = this._trustData;

    const showReviews = this.getAttribute('show-reviews') !== null;
    const size = this.getAttribute('size') || 'normal';
    const companyName = this.getAttribute('company') || 'Empresa';

    const ratingColor = this.getRatingColor(rating || 0);
    const timeAgo = lastPostDate ? this.getTimeAgoText(lastPostDate) : 'N/A';

    let reviewsHTML = '';
    if (showReviews && employeeReviews && employeeReviews.length > 0) {
      reviewsHTML = `
        <div class="reviews-section">
          <h4 class="reviews-title">📝 Reseñas de empleados</h4>
          <div class="reviews-list">
            ${employeeReviews
              .map(
                (review) => `
              <div class="review-item">
                <div class="review-header">
                  <span class="review-author">${review.author}</span>
                  <span class="review-rating">${this.generateStars(review.rating)}</span>
                </div>
                <p class="review-comment">"${review.comment}"</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      `;
    }

    const websiteLink =
      companyWebsite && verified
        ? `<a href="${companyWebsite}" target="_blank" rel="noopener noreferrer" class="company-link">
             🌐 Sitio web oficial
           </a>`
        : '';

    this.shadowRoot.innerHTML = `
      <style>${this.getStyles()}</style>
      
      <div class="trust-badge ${size} ${verified ? 'verified' : 'unverified'} ${!this._isExpanded ? 'collapsed' : ''}">
        <!-- Encabezado con verificación y botón toggle -->
        <div class="trust-header-wrapper">
          <div class="trust-header">
            ${
              verified
                ? `
              <div class="verification-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span class="badge-text">${verificationBadge || 'Empresa verificada'}</span>
              </div>
            `
                : `
              <div class="unverified-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
                <span class="badge-text">No verificada</span>
              </div>
            `
            }
            ${
              this.isHighlyRequested(candidateCount)
                ? `
              <div class="highly-requested-badge">
                <span class="badge-icon">🔥</span>
                <span class="badge-text">Muy solicitado</span>
              </div>
            `
                : ''
            }
          </div>
          
          <button class="trust-toggle-btn" aria-label="Expandir/contraer información de confianza" title="${this._isExpanded ? 'Contraer' : 'Expandir'}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="${this._isExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"></polyline>
            </svg>
          </button>
        </div>

        <!-- Contenido colapsable -->
        <div class="trust-content">
          <!-- Información de ofertas -->
          <div class="trust-info-row">
            <div class="trust-info-item">
              <span class="info-icon">📋</span>
              <div class="info-content">
                <span class="info-label">Ofertas activas</span>
                <span class="info-value">${activeOffers || 0}</span>
              </div>
            </div>

            <div class="trust-info-item">
              <span class="info-icon">📅</span>
              <div class="info-content">
                <span class="info-label">Última publicación</span>
                <span class="info-value">${timeAgo}</span>
              </div>
            </div>

            ${
              candidateCount
                ? `
              <div class="trust-info-item">
                <span class="info-icon">👥</span>
                <div class="info-content">
                  <span class="info-label">Candidatos</span>
                  <span class="info-value">${candidateCount}</span>
                </div>
              </div>
            `
                : ''
            }

            ${
              rating
                ? `
              <div class="trust-info-item">
                <span class="info-icon">⭐</span>
                <div class="info-content">
                  <span class="info-label">Rating empresa</span>
                  <span class="info-value" style="color: ${ratingColor}; font-weight: bold;">
                    ${rating.toFixed(1)} (${reviewsCount || 0} reviews)
                  </span>
                </div>
              </div>
            `
                : ''
            }
          </div>

          <!-- Rating visual -->
          ${
            rating
              ? `
            <div class="rating-bar-container">
              <div class="rating-bar" style="--rating: ${(rating / 5) * 100}%; --color: ${ratingColor};">
                <div class="rating-fill"></div>
              </div>
              <span class="rating-text">${this.generateStars(rating)}</span>
            </div>
          `
              : ''
          }

          <!-- Reseñas de empleados -->
          ${reviewsHTML}

          <!-- Acciones -->
          <div class="trust-actions">
            ${websiteLink}
            <button class="trust-more-info" data-company="${companyName}">
              ℹ️ Más información sobre ${companyName}
            </button>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    const moreInfoBtn = this.shadowRoot.querySelector('.trust-more-info');
    if (moreInfoBtn) {
      moreInfoBtn.addEventListener('click', () => {
        this.dispatchEvent(
          new CustomEvent('trust-more-info', {
            detail: { company: companyName },
            bubbles: true,
            composed: true,
          })
        );
      });
    }
  }

  /**
   * Estilos del componente
   */
  getStyles() {
    return `
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      .trust-badge {
        background: linear-gradient(135deg, rgba(232, 76, 61, 0.08) 0%, rgba(232, 76, 61, 0.05) 100%);
        border: 1px solid rgba(232, 76, 61, 0.2);
        border-radius: 12px;
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        box-shadow: 0 2px 8px rgba(232, 76, 61, 0.1);
        transition: all 0.3s ease;
      }

      .trust-badge:hover {
        box-shadow: 0 4px 16px rgba(232, 76, 61, 0.15);
        border-color: rgba(232, 76, 61, 0.3);
      }

      .trust-badge.verified {
        border-color: rgba(232, 76, 61, 0.3);
        background: linear-gradient(135deg, rgba(232, 76, 61, 0.12) 0%, rgba(232, 76, 61, 0.08) 100%);
      }

      .trust-badge.unverified {
        border-color: rgba(232, 76, 61, 0.15);
        background: linear-gradient(135deg, rgba(232, 76, 61, 0.08) 0%, rgba(232, 76, 61, 0.05) 100%);
      }

      .trust-badge.collapsed {
        gap: 0;
      }

      .trust-badge.collapsed .trust-content {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        padding: 0;
      }

      .trust-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        max-height: 1000px;
        opacity: 1;
        transition: all 0.3s ease;
        overflow: hidden;
      }

      /* Header wrapper con toggle button */
      .trust-header-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      .trust-toggle-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #E84C3D;
        transition: all 0.2s;
        border-radius: 6px;
        flex-shrink: 0;
      }

      .trust-toggle-btn:hover {
        background: rgba(232, 76, 61, 0.1);
        color: #f97566;
      }

      .trust-toggle-btn svg {
        transition: transform 0.3s ease;
      }

      .trust-badge.collapsed .trust-toggle-btn svg {
        transform: rotate(180deg);
      }

      .trust-badge.small {
        padding: 0.875rem;
      }

      .trust-badge.large {
        padding: 1.5rem;
      }

      .trust-badge.empty {
        justify-content: center;
        align-items: center;
        min-height: 80px;
        color: #94a3b8;
        text-align: center;
      }

      /* Encabezado */
      .trust-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .verification-badge,
      .unverified-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        width: 100%;
      }

      .verification-badge {
        background: rgba(232, 76, 61, 0.15);
        color: #E84C3D;
      }

      .unverified-badge {
        background: rgba(232, 76, 61, 0.08);
        color: #E84C3D;
      }

      .highly-requested-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08));
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.2);
        animation: pulse-glow 2s ease-in-out infinite;
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.3);
        }
        50% {
          box-shadow: 0 0 16px rgba(239, 68, 68, 0.5);
        }
      }

      .verification-badge svg,
      .unverified-badge svg {
        flex-shrink: 0;
      }

      .badge-text {
        flex: 1;
      }

      /* Fila de información */
      .trust-info-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
      }

      .trust-info-item {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        padding: 0.75rem;
        background: rgba(18, 24, 32, 0.5);
        border-radius: 8px;
        border: 1px solid rgba(232, 76, 61, 0.2);
        transition: all 0.2s;
      }

      .trust-info-item:hover {
        background: rgba(232, 76, 61, 0.1);
        border-color: rgba(232, 76, 61, 0.4);
      }

      .info-icon {
        font-size: 1.25rem;
        flex-shrink: 0;
      }

      .info-content {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .info-label {
        font-size: 0.75rem;
        color: #94a3b8;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .info-value {
        font-size: 1rem;
        color: #f1f5f9;
        font-weight: 700;
      }

      /* Rating bar */
      .rating-bar-container {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .rating-bar {
        flex: 1;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        --rating: 0%;
        --color: #94a3b8;
      }

      .rating-fill {
        width: var(--rating);
        height: 100%;
        background: var(--color);
        border-radius: 4px;
        transition: width 0.5s ease;
      }

      .rating-text {
        font-size: 0.875rem;
        min-width: 120px;
        text-align: right;
        letter-spacing: 1px;
      }

      /* Sección de reseñas */
      .reviews-section {
        margin-top: 0.5rem;
      }

      .reviews-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.75rem;
      }

      .reviews-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .review-item {
        padding: 0.75rem;
        background: rgba(18, 24, 32, 0.5);
        border-left: 3px solid #E84C3D;
        border-radius: 6px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }

      .review-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .review-author {
        font-size: 0.75rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      .review-rating {
        font-size: 0.875rem;
        letter-spacing: 2px;
      }

      .review-comment {
        font-size: 0.8125rem;
        color: #94a3b8;
        line-height: 1.5;
        font-style: italic;
      }

      /* Acciones */
      .trust-actions {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      .company-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        color: #E84C3D;
        text-decoration: none;
        font-size: 0.875rem;
        font-weight: 500;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        transition: all 0.2s;
        border: 1px solid rgba(232, 76, 61, 0.3);
      }

      .company-link:hover {
        background: rgba(232, 76, 61, 0.1);
        border-color: rgba(232, 76, 61, 0.5);
        color: #f97566;
      }

      .trust-more-info {
        background: rgba(232, 76, 61, 0.08);
        border: 1px solid rgba(232, 76, 61, 0.2);
        color: #f1f5f9;
        padding: 0.625rem 1rem;
        border-radius: 6px;
        font-size: 0.8125rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .trust-more-info:hover {
        background: rgba(232, 76, 61, 0.15);
        border-color: rgba(232, 76, 61, 0.4);
        color: #ffffff;
      }

      .trust-more-info:active {
        transform: scale(0.98);
      }

      @media (max-width: 640px) {
        .trust-badge {
          padding: 1rem;
        }

        .trust-info-row {
          grid-template-columns: 1fr;
        }

        .rating-bar-container {
          flex-direction: column;
          align-items: flex-start;
        }

        .rating-text {
          text-align: left;
        }
      }
    `;
  }
}

// Registrar el componente
customElements.define('devjobs-trust-badge', DevJobsTrustBadge);
