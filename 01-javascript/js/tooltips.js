// ==========================================
// SISTEMA DE TOOLTIPS CONTEXTUAL
// ==========================================

/**
 * Información adicional de empresas (simulado - en producción vendría de API)
 */
const COMPANY_INFO = {
  'google': {
    name: 'Google',
    employees: '150,000+',
    founded: '1998',
    industry: 'Tecnología',
    description: 'Líder global en búsqueda, publicidad online y servicios en la nube.',
    benefits: ['Seguro médico premium', 'Comida gratis', 'Gym', 'Stock options'],
    rating: 4.5,
    website: 'google.com'
  },
  'netflix': {
    name: 'Netflix',
    employees: '12,000+',
    founded: '1997',
    industry: 'Entretenimiento',
    description: 'Plataforma líder de streaming con presencia en 190+ países.',
    benefits: ['Vacaciones ilimitadas', 'Stock options', 'Desarrollo profesional'],
    rating: 4.3,
    website: 'netflix.com'
  },
  'amazon': {
    name: 'Amazon',
    employees: '1,600,000+',
    founded: '1994',
    industry: 'E-commerce & Cloud',
    description: 'Gigante del e-commerce y líder en cloud computing (AWS).',
    benefits: ['Seguro médico', 'Descuentos empleado', 'Stock options', 'Gym'],
    rating: 4.1,
    website: 'amazon.com'
  },
  'microsoft': {
    name: 'Microsoft',
    employees: '220,000+',
    founded: '1975',
    industry: 'Software & Cloud',
    description: 'Pionero en software empresarial y servicios en la nube.',
    benefits: ['Seguro médico', 'Retiro', 'Stock options', 'Formación continua'],
    rating: 4.4,
    website: 'microsoft.com'
  },
  'meta': {
    name: 'Meta (Facebook)',
    employees: '86,000+',
    founded: '2004',
    industry: 'Redes Sociales',
    description: 'Red social más grande del mundo y líder en VR/AR.',
    benefits: ['Comida gratis', 'Gym', 'Stock options', 'Oficinas premium'],
    rating: 4.2,
    website: 'meta.com'
  }
};

/**
 * Información adicional de tecnologías
 */
const TECH_INFO = {
  'react': {
    name: 'React',
    type: 'Library',
    category: 'Frontend',
    popularity: 'Muy Alta',
    description: 'Biblioteca de JavaScript para construir interfaces de usuario.',
    maintainedBy: 'Meta',
    learning: 'Media',
    jobDemand: 'Muy Alta'
  },
  'javascript': {
    name: 'JavaScript',
    type: 'Language',
    category: 'Full Stack',
    popularity: 'Muy Alta',
    description: 'Lenguaje de programación esencial para desarrollo web.',
    maintainedBy: 'ECMA International',
    learning: 'Media',
    jobDemand: 'Muy Alta'
  },
  'typescript': {
    name: 'TypeScript',
    type: 'Language',
    category: 'Full Stack',
    popularity: 'Alta',
    description: 'Superset de JavaScript con tipado estático.',
    maintainedBy: 'Microsoft',
    learning: 'Media-Alta',
    jobDemand: 'Alta'
  },
  'node.js': {
    name: 'Node.js',
    type: 'Runtime',
    category: 'Backend',
    popularity: 'Muy Alta',
    description: 'Entorno de ejecución de JavaScript del lado del servidor.',
    maintainedBy: 'OpenJS Foundation',
    learning: 'Media',
    jobDemand: 'Muy Alta'
  },
  'python': {
    name: 'Python',
    type: 'Language',
    category: 'Backend / Data',
    popularity: 'Muy Alta',
    description: 'Lenguaje versátil, popular en IA, data science y backend.',
    maintainedBy: 'Python Software Foundation',
    learning: 'Fácil',
    jobDemand: 'Muy Alta'
  },
  'vue.js': {
    name: 'Vue.js',
    type: 'Framework',
    category: 'Frontend',
    popularity: 'Alta',
    description: 'Framework progresivo para construir interfaces de usuario.',
    maintainedBy: 'Evan You & Community',
    learning: 'Fácil-Media',
    jobDemand: 'Media-Alta'
  },
  'angular': {
    name: 'Angular',
    type: 'Framework',
    category: 'Frontend',
    popularity: 'Alta',
    description: 'Framework completo para aplicaciones web empresariales.',
    maintainedBy: 'Google',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'docker': {
    name: 'Docker',
    type: 'Platform',
    category: 'DevOps',
    popularity: 'Muy Alta',
    description: 'Plataforma de contenedores para despliegue de aplicaciones.',
    maintainedBy: 'Docker Inc.',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'aws': {
    name: 'AWS',
    type: 'Cloud Platform',
    category: 'Cloud/DevOps',
    popularity: 'Muy Alta',
    description: 'Plataforma de servicios en la nube más completa del mercado.',
    maintainedBy: 'Amazon',
    learning: 'Alta',
    jobDemand: 'Muy Alta'
  },
  'react native': {
    name: 'React Native',
    type: 'Framework',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Framework para construir aplicaciones móviles nativas con JavaScript.',
    maintainedBy: 'Meta',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'sql': {
    name: 'SQL',
    type: 'Language',
    category: 'Database',
    popularity: 'Muy Alta',
    description: 'Lenguaje para consultas de bases de datos relacionales.',
    maintainedBy: 'ISO/IEC',
    learning: 'Media',
    jobDemand: 'Muy Alta'
  },
  'tableau': {
    name: 'Tableau',
    type: 'Tool',
    category: 'Analytics & BI',
    popularity: 'Alta',
    description: 'Plataforma de visualización de datos y business intelligence.',
    maintainedBy: 'Salesforce',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'flutter': {
    name: 'Flutter',
    type: 'Framework',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Framework para desarrollo de apps móviles cross-platform con Dart.',
    maintainedBy: 'Google',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'ios': {
    name: 'iOS',
    type: 'Platform',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Sistema operativo de Apple para iPhone e iPad.',
    maintainedBy: 'Apple',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'android': {
    name: 'Android',
    type: 'Platform',
    category: 'Mobile',
    popularity: 'Muy Alta',
    description: 'Sistema operativo móvil abierto basado en Linux.',
    maintainedBy: 'Google',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'swift': {
    name: 'Swift',
    type: 'Language',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Lenguaje moderno de Apple para desarrollo iOS y macOS.',
    maintainedBy: 'Apple',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'swiftui': {
    name: 'SwiftUI',
    type: 'Framework',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Framework declarativo de Apple para interfaces en iOS y macOS.',
    maintainedBy: 'Apple',
    learning: 'Media',
    jobDemand: 'Media-Alta'
  },
  'tailwindcss': {
    name: 'Tailwind CSS',
    type: 'Framework',
    category: 'Frontend',
    popularity: 'Muy Alta',
    description: 'Framework CSS utility-first para construcción rápida de interfaces.',
    maintainedBy: 'Tailwind Labs',
    learning: 'Fácil',
    jobDemand: 'Alta'
  },
  'tensorflow': {
    name: 'TensorFlow',
    type: 'Framework',
    category: 'Machine Learning',
    popularity: 'Muy Alta',
    description: 'Plataforma open-source para machine learning y deep learning.',
    maintainedBy: 'Google',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'pytorch': {
    name: 'PyTorch',
    type: 'Framework',
    category: 'Machine Learning',
    popularity: 'Muy Alta',
    description: 'Framework Python para machine learning con dynamic computation graphs.',
    maintainedBy: 'Meta',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'selenium': {
    name: 'Selenium',
    type: 'Framework',
    category: 'QA/Testing',
    popularity: 'Muy Alta',
    description: 'Framework open-source para automatización de pruebas web.',
    maintainedBy: 'Selenium Community',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'cypress': {
    name: 'Cypress',
    type: 'Framework',
    category: 'QA/Testing',
    popularity: 'Alta',
    description: 'Framework JavaScript para testing end-to-end moderno.',
    maintainedBy: 'Cypress.io',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'jest': {
    name: 'Jest',
    type: 'Framework',
    category: 'QA/Testing',
    popularity: 'Muy Alta',
    description: 'Framework de testing delightful para JavaScript.',
    maintainedBy: 'Meta',
    learning: 'Fácil',
    jobDemand: 'Alta'
  },
  'testng': {
    name: 'TestNG',
    type: 'Framework',
    category: 'QA/Testing',
    popularity: 'Alta',
    description: 'Framework de testing para Java inspirado en TestUnit y NUnit.',
    maintainedBy: 'Cedric Beust',
    learning: 'Media',
    jobDemand: 'Media-Alta'
  },
  'figma': {
    name: 'Figma',
    type: 'Design Tool',
    category: 'Design',
    popularity: 'Muy Alta',
    description: 'Herramienta colaborativa basada en web para diseño de interfaces.',
    maintainedBy: 'Figma Inc.',
    learning: 'Fácil',
    jobDemand: 'Alta'
  },
  'adobexd': {
    name: 'Adobe XD',
    type: 'Design Tool',
    category: 'Design',
    popularity: 'Alta',
    description: 'Herramienta de diseño de experiencia de usuario de Adobe.',
    maintainedBy: 'Adobe',
    learning: 'Fácil-Media',
    jobDemand: 'Media-Alta'
  },
  'sketch': {
    name: 'Sketch',
    type: 'Design Tool',
    category: 'Design',
    popularity: 'Alta',
    description: 'Herramienta de diseño vectorial para Mac enfocada en UI/UX.',
    maintainedBy: 'Sketch BV',
    learning: 'Fácil',
    jobDemand: 'Media-Alta'
  },
  'solidity': {
    name: 'Solidity',
    type: 'Language',
    category: 'Blockchain',
    popularity: 'Alta',
    description: 'Lenguaje para escribir smart contracts en Ethereum.',
    maintainedBy: 'Ethereum Foundation',
    learning: 'Media-Alta',
    jobDemand: 'Media-Alta'
  },
  'ethereum': {
    name: 'Ethereum',
    type: 'Platform',
    category: 'Blockchain',
    popularity: 'Alta',
    description: 'Plataforma blockchain descentralizada para smart contracts.',
    maintainedBy: 'Ethereum Community',
    learning: 'Alta',
    jobDemand: 'Media-Alta'
  },
  'web3.js': {
    name: 'Web3.js',
    type: 'Library',
    category: 'Blockchain',
    popularity: 'Alta',
    description: 'Librería JavaScript para interactuar con nodos de Ethereum.',
    maintainedBy: 'Ethereum Foundation',
    learning: 'Media',
    jobDemand: 'Media-Alta'
  },
  'security': {
    name: 'Security',
    type: 'Practice',
    category: 'Security',
    popularity: 'Muy Alta',
    description: 'Prácticas y principios de seguridad en sistemas y aplicaciones.',
    maintainedBy: 'Industry Standard',
    learning: 'Alta',
    jobDemand: 'Muy Alta'
  },
  'pentesting': {
    name: 'Pentesting',
    type: 'Practice',
    category: 'Security',
    popularity: 'Alta',
    description: 'Pruebas de penetración para identificar vulnerabilidades.',
    maintainedBy: 'Industry Standard',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'iso 27001': {
    name: 'ISO 27001',
    type: 'Standard',
    category: 'Security',
    popularity: 'Alta',
    description: 'Estándar internacional para gestión de seguridad de la información.',
    maintainedBy: 'ISO/IEC',
    learning: 'Media',
    jobDemand: 'Media-Alta'
  },
  'agile': {
    name: 'Agile',
    type: 'Methodology',
    category: 'Project Management',
    popularity: 'Muy Alta',
    description: 'Metodología ágil para desarrollo iterativo e incremental.',
    maintainedBy: 'Agile Alliance',
    learning: 'Fácil-Media',
    jobDemand: 'Muy Alta'
  },
  'scrum': {
    name: 'Scrum',
    type: 'Framework',
    category: 'Project Management',
    popularity: 'Muy Alta',
    description: 'Framework ágil estructurado para gestión de proyectos con sprints.',
    maintainedBy: 'Scrum.org',
    learning: 'Fácil',
    jobDemand: 'Muy Alta'
  },
  'xcode': {
    name: 'Xcode',
    type: 'IDE',
    category: 'Development',
    popularity: 'Alta',
    description: 'Entorno de desarrollo integrado de Apple para iOS y macOS.',
    maintainedBy: 'Apple',
    learning: 'Media',
    jobDemand: 'Alta'
  },
  'coredata': {
    name: 'Core Data',
    type: 'Framework',
    category: 'Mobile',
    popularity: 'Alta',
    description: 'Framework de Apple para gestión de datos persistentes.',
    maintainedBy: 'Apple',
    learning: 'Media',
    jobDemand: 'Media-Alta'
  },
  'mlops': {
    name: 'MLOps',
    type: 'Practice',
    category: 'DevOps',
    popularity: 'Media-Alta',
    description: 'Prácticas de DevOps aplicadas a machine learning y modelos de IA.',
    maintainedBy: 'Community',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'productmanagement': {
    name: 'Product Management',
    type: 'Discipline',
    category: 'Product',
    popularity: 'Muy Alta',
    description: 'Gestión del ciclo de vida completo de productos desde concepto hasta lanzamiento.',
    maintainedBy: 'Industry Standard',
    learning: 'Alta',
    jobDemand: 'Alta'
  },
  'prototyping': {
    name: 'Prototyping',
    type: 'Practice',
    category: 'Design',
    popularity: 'Muy Alta',
    description: 'Creación de prototipos interactivos para validar conceptos y experiencias.',
    maintainedBy: 'Industry Standard',
    learning: 'Fácil-Media',
    jobDemand: 'Alta'
  },
  'smartcontracts': {
    name: 'Smart Contracts',
    type: 'Practice',
    category: 'Blockchain',
    popularity: 'Alta',
    description: 'Programas autoejecutable en blockchain que funcionan sin intermediarios.',
    maintainedBy: 'Blockchain Community',
    learning: 'Alta',
    jobDemand: 'Media-Alta'
  }
};

/**
 * Clase para gestionar tooltips
 */
class TooltipManager {
  constructor() {
    this.tooltip = null;
    this.activeElement = null;
    this.hideTimeout = null;
    this.techStackData = null;
    this.init();
  }

  init() {
    this.createTooltip();
    this.loadTechStackData();
    this.setupGlobalListeners();
  }

  async loadTechStackData() {
    try {
      const response = await fetch('./data/tech-stack.json');
      const data = await response.json();
      
      // Extraer todas las tecnologías de la estructura jerárquica
      this.techStackData = {};
      const stack = data.stack;
      
      // Iterar sobre todas las categorías (frontend, backend, mobile, etc.)
      for (const category in stack) {
        if (typeof stack[category] === 'object' && !Array.isArray(stack[category])) {
          // Si es un objeto con subcategorías (ej: frontend.languages, frontend.frameworks)
          for (const subCategory in stack[category]) {
            if (Array.isArray(stack[category][subCategory])) {
              this.techStackData[subCategory] = stack[category][subCategory];
            }
          }
        } else if (Array.isArray(stack[category])) {
          // Si es un array directo
          this.techStackData[category] = stack[category];
        }
      }
      
      console.log('✅ Tech stack data cargado correctamente', this.techStackData);
    } catch (error) {
      console.warn('⚠️ No se pudo cargar tech-stack.json, usando datos por defecto', error);
    }
  }

  createTooltip() {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'contextual-tooltip';
    this.tooltip.style.display = 'none';
    document.body.appendChild(this.tooltip);
  }

  setupGlobalListeners() {
    // Delegación de eventos en el documento - Cambiar a CLICK
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-tooltip-type]');
      if (target) {
        // Si ya está visible y es el mismo elemento, ocultarlo
        if (this.activeElement === target) {
          this.hide();
        } else {
          // Mostrar tooltip del nuevo elemento
          this.show(target);
        }
        e.stopPropagation(); // Evitar que se propague el click
      }
    });

    // Ocultar tooltip al hacer click en otros lugares
    document.addEventListener('click', (e) => {
      if (!e.target.closest('[data-tooltip-type]') && !e.target.closest('.contextual-tooltip')) {
        this.hide();
      }
    });

    // Mantener tooltip visible al interactuar con él
    this.tooltip.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  show(element) {
    // Limpiar cualquier ocultamiento programado
    clearTimeout(this.hideTimeout);
    this.activeElement = element;

    const type = element.dataset.tooltipType;
    const key = element.dataset.tooltipKey;

    let content = '';

    if (type === 'company') {
      content = this.getCompanyTooltip(key);
    } else if (type === 'tech') {
      content = this.getTechTooltip(key);
    } else if (type === 'salary') {
      content = this.getSalaryTooltip(element);
    } else if (type === 'location') {
      content = this.getLocationTooltip(element);
    } else if (type === 'workmode') {
      content = this.getWorkmodeTooltip(key);
    } else if (type === 'area') {
      content = this.getAreaTooltip(key);
    } else if (type === 'experience') {
      content = this.getExperienceTooltip(key);
    }

    this.tooltip.innerHTML = content;
    this.position(element);
    this.tooltip.style.display = 'block';
    
    // Animación de entrada
    requestAnimationFrame(() => {
      this.tooltip.classList.add('visible');
    });
  }

  hide() {
    this.tooltip.classList.remove('visible');
    setTimeout(() => {
      this.tooltip.style.display = 'none';
      this.activeElement = null;
    }, 300); // Tiempo de la transición
  }

  position(element) {
    const rect = element.getBoundingClientRect();
    const tooltipRect = this.tooltip.getBoundingClientRect();
    
    let top = rect.bottom + window.scrollY + 10;
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipRect.width / 2);

    // Ajustar si se sale por la derecha
    if (left + tooltipRect.width > window.innerWidth - 20) {
      left = window.innerWidth - tooltipRect.width - 20;
    }

    // Ajustar si se sale por la izquierda
    if (left < 20) {
      left = 20;
    }

    // Si no cabe abajo, mostrar arriba
    if (top + tooltipRect.height > window.innerHeight + window.scrollY - 20) {
      top = rect.top + window.scrollY - tooltipRect.height - 10;
    }

    this.tooltip.style.top = `${top}px`;
    this.tooltip.style.left = `${left}px`;
  }

  getCompanyTooltip(companyKey) {
    const info = COMPANY_INFO[companyKey.toLowerCase()];
    
    if (!info) {
      return `<div class="tooltip-simple">
        <strong>${companyKey}</strong>
        <p>Información no disponible</p>
      </div>`;
    }

    const stars = '★'.repeat(Math.floor(info.rating)) + '☆'.repeat(5 - Math.floor(info.rating));

    return `
      <div class="tooltip-company">
        <div class="tooltip-header">
          <h4>${info.name}</h4>
          <div class="tooltip-rating">${stars} ${info.rating}</div>
        </div>
        <div class="tooltip-meta">
          <span>👥 ${info.employees} empleados</span>
          <span>📅 Fundada en ${info.founded}</span>
        </div>
        <p class="tooltip-description">${info.description}</p>
        <div class="tooltip-benefits">
          <strong>Beneficios:</strong>
          <ul>
            ${info.benefits.slice(0, 3).map(b => `<li>✓ ${b}</li>`).join('')}
          </ul>
        </div>
        <div class="tooltip-footer">
          <a href="https://${info.website}" target="_blank" rel="noopener">
            🔗 ${info.website}
          </a>
        </div>
      </div>
    `;
  }

  getTechTooltip(techKey) {
    // Primero intentar cargar del tech-stack.json
    let info = this.getTechInfoFromStack(techKey);
    
    // Si no encuentra, usar los datos por defecto
    if (!info) {
      info = TECH_INFO[techKey.toLowerCase()];
    }
    
    if (!info) {
      return `<div class="tooltip-simple">
        <strong>${techKey}</strong>
        <p>Información no disponible</p>
      </div>`;
    }

    const popularityBar = this.getPopularityBar(info.popularity);
    const demandBar = this.getPopularityBar(info.jobDemand);
    const useCases = info.useCases || [];
    const services = info.services || [];

    return `
      <div class="tooltip-tech">
        <div class="tooltip-header">
          <div class="tooltip-icon-wrapper">
            <svg class="tooltip-svg-icon" width="48" height="48" onerror="this.style.display='none'">
              <use xlink:href="./assets/sprite.svg#${this.getTechSpriteId(info.id)}"></use>
            </svg>
          </div>
          <div>
            <h4>${info.name}</h4>
            <span class="tech-badge">${info.type}</span>
          </div>
        </div>
        <div class="tooltip-category">${info.category}</div>
        <p class="tooltip-description">${info.description}</p>
        <div class="tooltip-stats">
          <div class="stat-row">
            <span>Popularidad:</span>
            <div class="stat-bar">${popularityBar}</div>
          </div>
          <div class="stat-row">
            <span>Demanda laboral:</span>
            <div class="stat-bar">${demandBar}</div>
          </div>
          <div class="stat-row">
            <span>Curva aprendizaje:</span>
            <span class="stat-value">${info.learning}</span>
          </div>
          ${info.yearsUsed ? `
          <div class="stat-row">
            <span>Años en uso:</span>
            <span class="stat-value">${info.yearsUsed} años</span>
          </div>
          ` : ''}
        </div>
        ${useCases.length > 0 ? `
        <div class="tooltip-use-cases">
          <strong>Casos de uso:</strong>
          <ul>
            ${useCases.map(u => `<li>• ${u}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        ${services.length > 0 ? `
        <div class="tooltip-services">
          <strong>Servicios/Herramientas:</strong>
          <ul>
            ${services.map(s => `<li>• ${s}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        <div class="tooltip-footer">
          Mantenido por: <strong>${info.maintainedBy}</strong>
        </div>
      </div>
    `;
  }

  getTechInfoFromStack(techKey) {
    if (!this.techStackData || Object.keys(this.techStackData).length === 0) return null;
    
    const key = techKey.toLowerCase();
    
    // Aliases para búsqueda más flexible
    const aliases = {
      'nodejs': 'node.js',
      'node': 'node.js',
      'vuejs': 'vue.js',
      'vue': 'vue.js',
      'reactnative': 'reactnative',
      'react-native': 'reactnative',
      'typescript': 'typescript',
      'ts': 'typescript',
      'js': 'javascript',
      'py': 'python',
      'tailwind': 'tailwindcss',
      'css': 'tailwindcss',
      'xd': 'adobexd',
      'adobe': 'adobexd',
      'web3': 'web3.js',
      'eth': 'ethereum',
      'sol': 'solidity',
      'tf': 'tensorflow',
      'torch': 'pytorch',
      'py-torch': 'pytorch',
      'tflow': 'tensorflow',
      'product': 'productmanagement',
      'pm': 'productmanagement',
      'prototype': 'prototyping',
      'smart': 'smartcontracts',
      'contracts': 'smartcontracts'
    };
    
    const searchKey = aliases[key] || key;
    
    // Búsqueda recursiva en toda la estructura
    const searchInObject = (obj) => {
      if (Array.isArray(obj)) {
        // Buscar en arrays
        return obj.find(item => 
          (item.id === searchKey || item.id === key || 
           item.name?.toLowerCase() === searchKey || 
           item.name?.toLowerCase() === key)
        );
      } else if (typeof obj === 'object' && obj !== null) {
        // Buscar recursivamente en objetos
        for (const value of Object.values(obj)) {
          const result = searchInObject(value);
          if (result) return result;
        }
      }
      return null;
    };
    
    return searchInObject(this.techStackData);
  }

  /**
   * Convierte el tech ID a un ID válido para el sprite SVG
   * Reemplaza puntos por guiones y maneja casos especiales
   */
  getTechSpriteId(techId) {
    if (!techId) return 'generic-code';

    // Mapeo de IDs especiales
    const spriteIdMap = {
      'node.js': 'node-js',
      'node-js': 'node-js',
      'web3.js': 'web3-js',
      'web3': 'web3-js',
      'c++': 'c-plus-plus',
      'c-plus-plus': 'c-plus-plus',
      '.net': 'dotnet',
      'dotnet': 'dotnet',
      'github-actions': 'github-actions',
      'github-copilot': 'github-copilot',
      'react-native': 'reactnative',
      'reactnative': 'reactnative',
      'elasticsearch': 'elastic-search',
      'elastic-search': 'elastic-search',
      'next.js': 'next-js',
      'nextjs': 'next-js',
      'next-js': 'next-js',
      'vue.js': 'vue-js',
      'vuejs': 'vue-js',
      'vue-js': 'vue-js',
      'ruby-on-rails': 'ruby-on-rails',
      'tailwind-css': 'tailwind-css',
      'tailwindcss': 'tailwind-css',
      'material-ui': 'material-ui',
      'materialui': 'material-ui',
      'css3': 'css3',
      'html5': 'html5',
      'github-copilot_black': 'github-copilot_black',
      'ios': 'ios',
      'ios-app': 'ios',
      'apple-ios': 'ios'
    };

    const normalizedId = techId.toLowerCase();
    
    // Retornar ID mapeado si existe
    if (spriteIdMap[normalizedId]) {
      return spriteIdMap[normalizedId];
    }

    // Si no existe mapeo, reemplazar puntos por guiones
    const spriteId = normalizedId.replace(/\./g, '-');
    
    // Retornar el ID convertido o generic-code como fallback
    return spriteId || 'generic-code';
  }

  getSalaryTooltip(element) {
    const salaryRange = element.textContent.trim();
    
    return `
      <div class="tooltip-salary">
        <h4>💶 Rango Salarial</h4>
        <p class="salary-amount">${salaryRange}</p>
        <div class="salary-info">
          <p><strong>Bruto anual</strong></p>
          <p>Este rango es orientativo y puede variar según:</p>
          <ul>
            <li>• Experiencia del candidato</li>
            <li>• Habilidades específicas</li>
            <li>• Negociación final</li>
            <li>• Beneficios adicionales</li>
          </ul>
        </div>
        <div class="tooltip-footer">
          💡 El salario puede incluir bonus y stock options
        </div>
      </div>
    `;
  }

  getLocationTooltip(element) {
    const location = element.textContent.trim().replace('📍', '').trim();
    
    const timezones = {
      'Madrid': 'UTC+1 (CET)',
      'Barcelona': 'UTC+1 (CET)',
      'Valencia': 'UTC+1 (CET)',
      'Sevilla': 'UTC+1 (CET)',
      'Remoto': 'Flexible',
      'Remote': 'Flexible'
    };

    const timezone = timezones[location] || 'UTC+1';

    return `
      <div class="tooltip-location">
        <h4>📍 Ubicación</h4>
        <p class="location-name">${location}</p>
        <div class="location-info">
          <div class="info-row">
            <span>🕐 Zona horaria:</span>
            <strong>${timezone}</strong>
          </div>
          ${location !== 'Remoto' && location !== 'Remote' ? `
            <div class="info-row">
              <span>🏢 Modalidad:</span>
              <strong>Oficina local</strong>
            </div>
          ` : `
            <div class="info-row">
              <span>🌍 Modalidad:</span>
              <strong>100% Remoto</strong>
            </div>
            <p style="margin-top: 0.5rem; color: var(--color-text-secondary); font-size: 0.875rem;">
              Trabajo desde cualquier ubicación con flexibilidad horaria
            </p>
          `}
        </div>
      </div>
    `;
  }

  getPopularityBar(level) {
    const levels = {
      'Muy Alta': 5,
      'Alta': 4,
      'Media-Alta': 3,
      'Media': 2,
      'Baja': 1
    };

    const value = levels[level] || 0;
    const filled = '▰'.repeat(value);
    const empty = '▱'.repeat(5 - value);
    
    return `<span class="popularity-bar">${filled}${empty}</span>`;
  }

  getWorkmodeTooltip(workmode) {
    const modesInfo = {
      'remote': {
        label: 'Remoto',
        icon: '🏠',
        description: 'Trabajo desde cualquier ubicación con total flexibilidad',
        benefits: [
          'Sin desplazamientos',
          'Mayor flexibilidad horaria',
          'Mejor balance vida-trabajo',
          'Productividad optimizada'
        ]
      },
      'onsite': {
        label: 'Presencial',
        icon: '🏢',
        description: 'Trabajo en oficina física de la empresa',
        benefits: [
          'Colaboración directa',
          'Integración con el equipo',
          'Mentoring en persona',
          'Networking empresarial'
        ]
      },
      'hybrid': {
        label: 'Híbrido',
        icon: '🔄',
        description: 'Combinación de trabajo remoto y en oficina',
        benefits: [
          'Flexibilidad con presencia',
          'Balance óptimo',
          'Días en oficina acordados',
          'Lo mejor de ambos mundos'
        ]
      }
    };

    const info = modesInfo[workmode?.toLowerCase()] || {
      label: workmode,
      icon: '💼',
      description: 'Modalidad de trabajo',
      benefits: []
    };

    return `
      <div class="tooltip-workmode">
        <div class="tooltip-header">
          <h4>${info.icon} ${info.label}</h4>
        </div>
        <p class="tooltip-description">${info.description}</p>
        ${info.benefits.length > 0 ? `
        <div class="tooltip-benefits">
          <strong>Ventajas:</strong>
          <ul>
            ${info.benefits.map(b => `<li>✓ ${b}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  }

  getAreaTooltip(area) {
    const areasInfo = {
      'frontend': {
        label: 'Frontend',
        icon: '🎨',
        description: 'Desarrollo de interfaz de usuario y experiencia visual',
        skills: [
          'HTML, CSS, JavaScript',
          'React, Vue, Angular',
          'Diseño responsivo',
          'User Experience'
        ]
      },
      'backend': {
        label: 'Backend',
        icon: '⚙️',
        description: 'Desarrollo del servidor y lógica de negocio',
        skills: [
          'Node.js, Python, Java',
          'Bases de datos',
          'APIs REST/GraphQL',
          'Escalabilidad'
        ]
      },
      'fullstack': {
        label: 'Full Stack',
        icon: '🔗',
        description: 'Desarrollo completo de frontend y backend',
        skills: [
          'Frontend y Backend',
          'Arquitectura de sistemas',
          'Base de datos',
          'DevOps básico'
        ]
      },
      'devops': {
        label: 'DevOps',
        icon: '🛠️',
        description: 'Infraestructura, despliegue y automatización',
        skills: [
          'Docker, Kubernetes',
          'CI/CD pipelines',
          'Cloud (AWS, GCP)',
          'Monitoreo'
        ]
      },
      'mobile': {
        label: 'Mobile',
        icon: '📱',
        description: 'Desarrollo de aplicaciones móviles',
        skills: [
          'React Native, Flutter',
          'iOS, Android',
          'App Store deployment',
          'UX Mobile'
        ]
      },
      'qa': {
        label: 'QA/Testing',
        icon: '✅',
        description: 'Aseguramiento de calidad y testing',
        skills: [
          'Automatización de tests',
          'Pruebas manuales',
          'Testing frameworks',
          'CI/CD integration'
        ]
      }
    };

    const info = areasInfo[area?.toLowerCase()] || {
      label: area,
      icon: '💼',
      description: 'Área de trabajo',
      skills: []
    };

    return `
      <div class="tooltip-area">
        <div class="tooltip-header">
          <h4>${info.icon} ${info.label}</h4>
        </div>
        <p class="tooltip-description">${info.description}</p>
        ${info.skills.length > 0 ? `
        <div class="tooltip-skills">
          <strong>Habilidades requeridas:</strong>
          <ul>
            ${info.skills.map(s => `<li>• ${s}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  }

  getExperienceTooltip(level) {
    const levelsInfo = {
      'junior': {
        label: 'Junior',
        icon: '🌱',
        yearsRange: '0-2 años',
        description: 'Desarrollador en inicio de carrera',
        expectations: [
          'Soporte en proyectos existentes',
          'Mentoría y aprendizaje activo',
          'Tareas bien definidas',
          'Crecimiento acelerado'
        ]
      },
      'mid': {
        label: 'Mid Level',
        icon: '⭐',
        yearsRange: '2-5 años',
        description: 'Desarrollador con experiencia intermedia',
        expectations: [
          'Liderazgo de módulos',
          'Mentoría a juniors',
          'Participación en arquitectura',
          'Autonomía en decisiones'
        ]
      },
      'senior': {
        label: 'Senior',
        icon: '👑',
        yearsRange: '5+ años',
        description: 'Desarrollador experimentado y experto',
        expectations: [
          'Liderazgo técnico',
          'Definición de arquitectura',
          'Entrevistas y selección',
          'Estrategia de producto'
        ]
      },
      'lead': {
        label: 'Lead/Principal',
        icon: '🚀',
        yearsRange: '7+ años',
        description: 'Líder técnico de proyecto/equipo',
        expectations: [
          'Gestión de equipo técnico',
          'Decisiones arquitectónicas',
          'Visión técnica de producto',
          'Mentoring senior'
        ]
      }
    };

    const info = levelsInfo[level?.toLowerCase()] || {
      label: level,
      icon: '💼',
      yearsRange: 'Variable',
      description: 'Nivel de experiencia',
      expectations: []
    };

    return `
      <div class="tooltip-experience">
        <div class="tooltip-header">
          <h4>${info.icon} ${info.label}</h4>
          <span class="experience-range">${info.yearsRange}</span>
        </div>
        <p class="tooltip-description">${info.description}</p>
        ${info.expectations.length > 0 ? `
        <div class="tooltip-expectations">
          <strong>Responsabilidades:</strong>
          <ul>
            ${info.expectations.map(e => `<li>→ ${e}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
    `;
  }

}

// Instancia singleton
export const tooltipManager = new TooltipManager();

/**
 * Helper para añadir tooltip a un elemento
 */
export function addTooltip(element, type, key) {
  element.dataset.tooltipType = type;
  element.dataset.tooltipKey = key;
  // El cursor se maneja vía CSS ahora
}
