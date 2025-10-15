/**
 * DevJobs Avatar Web Component
 * 
 * Uso:
 * 
 * 1. URL directa:
 *    <devjobs-avatar src="https://example.com/avatar.jpg"></devjobs-avatar>
 * 
 * 2. Desde GitHub:
 *    <devjobs-avatar provider="github" username="mdo"></devjobs-avatar>
 * 
 * 3. Desde email (Gravatar):
 *    <devjobs-avatar provider="gravatar" email="user@example.com"></devjobs-avatar>
 * 
 * 4. Desde Twitter/X:
 *    <devjobs-avatar provider="x" username="kikobeats"></devjobs-avatar>
 * 
 * 5. Otros proveedores: dribbble, soundcloud, twitch, youtube, telegram, etc.
 *    <devjobs-avatar provider="twitch" username="adravilag"></devjobs-avatar>
 * 
 * Atributos opcionales:
 * - size: "50px" (default: "50px")
 * - alt: "Avatar description" (default: "Avatar")
 * - fallback: URL de imagen fallback
 * - ttl: "1h", "24h", "7d" (default: "24h")
 */
class DevJobsAvatarElement extends HTMLElement {
    
    // Lista de proveedores soportados por unavatar.io
    static PROVIDERS = {
        github: 'github',
        gravatar: 'gravatar',
        x: 'x',
        twitter: 'x', // alias para x
        dribbble: 'dribbble',
        soundcloud: 'soundcloud',
        twitch: 'twitch',
        youtube: 'youtube',
        telegram: 'telegram',
        deviantart: 'deviantart',
        substack: 'substack',
        onlyfans: 'onlyfans',
        google: 'google',
        duckduckgo: 'duckduckgo',
        microlink: 'microlink'
    };

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    /**
     * Crea URL usando unavatar.io
     * @param {string} provider - Proveedor (github, gravatar, x, etc.)
     * @param {string} identifier - Username, email o domain
     * @param {object} options - Opciones adicionales (fallback, ttl)
     * @returns {string} URL completa
     */
    createUnavatarUrl(provider, identifier, options = {}) {
        const baseUrl = 'https://unavatar.io';
        const { fallback, ttl } = options;
        
        // Construir URL base
        let url = `${baseUrl}/${provider}/${encodeURIComponent(identifier)}`;
        
        // Agregar query parameters si existen
        const params = new URLSearchParams();
        if (fallback) params.append('fallback', fallback);
        if (ttl) params.append('ttl', ttl);
        
        const queryString = params.toString();
        return queryString ? `${url}?${queryString}` : url;
    }

    /**
     * Resuelve la URL del avatar basada en los atributos
     * @returns {string} URL del avatar
     */
    resolveAvatarUrl() {
        // 1. Si tiene 'src', usar directamente
        const directSrc = this.getAttribute('src');
        if (directSrc) {
            return directSrc;
        }

        // 2. Si tiene 'provider', construir URL con unavatar.io
        const provider = this.getAttribute('provider');
        if (provider) {
            const normalizedProvider = DevJobsAvatarElement.PROVIDERS[provider.toLowerCase()];
            
            if (!normalizedProvider) {
                console.warn(`[devjobs-avatar] Proveedor "${provider}" no soportado. Usando fallback.`);
                return this.getFallbackUrl();
            }

            // Obtener identificador según el proveedor
            let identifier = this.getAttribute('username') || 
                           this.getAttribute('email') || 
                           this.getAttribute('domain');

            if (!identifier) {
                console.warn('[devjobs-avatar] Falta identificador (username, email o domain)');
                return this.getFallbackUrl();
            }

            // Opciones adicionales
            const options = {
                fallback: this.getAttribute('fallback'),
                ttl: this.getAttribute('ttl') || '24h'
            };

            return this.createUnavatarUrl(normalizedProvider, identifier, options);
        }

        // 3. Fallback por defecto
        return this.getFallbackUrl();
    }

    /**
     * Obtiene URL de fallback
     * @returns {string} URL de imagen fallback
     */
    getFallbackUrl() {
        const customFallback = this.getAttribute('fallback');
        if (customFallback) {
            return customFallback;
        }

        // Fallback por defecto: Usar unavatar.io con el nombre como dominio
        const identifier = this.getAttribute('username') || 
                          this.getAttribute('email') || 
                          this.getAttribute('domain') ||
                          this.getAttribute('alt') || 
                          'user';
        
        // unavatar.io genera automáticamente avatares con UI Avatars si no encuentra el dominio
        return `https://unavatar.io/${encodeURIComponent(identifier)}`;
    }

    render() {
        const avatarUrl = this.resolveAvatarUrl();
        const altText = this.getAttribute('alt') || 'Avatar';
        const size = this.getAttribute('size') || '50px';
        const shape = this.getAttribute('shape') || 'circle'; // circle, square, rounded

        // Determinar border-radius según shape
        let borderRadius;
        switch(shape) {
            case 'square':
                borderRadius = '0';
                break;
            case 'rounded':
                borderRadius = '8px';
                break;
            case 'circle':
            default:
                borderRadius = '50%';
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }
                
                .avatar-container {
                    display: inline-block;
                    position: relative;
                }
                
                img {
                    width: ${size};
                    height: ${size};
                    border-radius: ${borderRadius};
                    object-fit: cover;
                    object-position: center;
                    display: block;
                    transition: transform 0.2s ease;
                }
                
                img:hover {
                    transform: scale(1.05);
                }
                
                .loading {
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: loading 1.5s infinite;
                }
                
                @keyframes loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                .error {
                    background: #fee;
                    border: 2px solid #fcc;
                }
            </style>
            <div class="avatar-container">
                <img 
                    src="${avatarUrl}" 
                    alt="${altText}"
                    loading="lazy"
                    onerror="this.classList.add('error')"
                >
            </div>
        `;
    }
}

customElements.define('devjobs-avatar', DevJobsAvatarElement);