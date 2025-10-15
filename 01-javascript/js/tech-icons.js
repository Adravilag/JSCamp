// ==========================================
// MAPEO DE TECNOLOGÍAS A ICONOS SVG SPRITE
// ==========================================

/**
 * Mapeo de nombres de tecnologías a IDs del sprite.svg
 * Las claves están normalizadas (lowercase, sin espacios, sin .js)
 */
export const TECH_ICON_MAP = {
  // JavaScript ecosystem
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'nodejs': 'node-js',
  'node': 'node-js',
  'express': 'express',
  'expressjs': 'express',
  'nextjs': 'nextjs',
  'next': 'nextjs',
  'webpack': 'webpack',
  'babel': 'babel',
  'eslint': 'eslint',
  
  // Frontend frameworks
  'react': 'react',
  'reactjs': 'react',
  'reactnative': 'react',
  'angular': 'angular',
  'vue': 'vuejs',
  'vuejs': 'vuejs',
  'svelte': 'svelte',
  
  // CSS frameworks & tools
  'bootstrap': 'bootstrap',
  'tailwind': 'tailwindcss',
  'tailwindcss': 'tailwindcss',
  'sass': 'sass',
  'scss': 'sass',
  'css': 'css3',
  'html': 'html5',
  
  // Backend languages
  'python': 'python',
  'java': 'java',
  'csharp': 'csharp',
  'c#': 'csharp',
  'php': 'php',
  'ruby': 'ruby',
  'go': 'go',
  'golang': 'go',
  'rust': 'rust',
  
  // Databases
  'mongodb': 'mongodb',
  'mongo': 'mongodb',
  'mysql': 'mysql',
  'postgresql': 'postgresql',
  'postgres': 'postgresql',
  'redis': 'redis',
  'elasticsearch': 'elastic-search',
  'elastic': 'elastic-search',
  'sql': 'mysql',
  
  // Cloud & DevOps
  'aws': 'amazonwebservices',
  'amazon': 'amazonwebservices',
  'azure': 'azure',
  'gcp': 'googlecloud',
  'google-cloud': 'googlecloud',
  'docker': 'docker',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'jenkins': 'jenkins',
  'circleci': 'circleci',
  'ansible': 'ansible',
  'terraform': 'terraform',
  
  // Version control
  'git': 'git',
  'github': 'github',
  'gitlab': 'gitlab',
  'bitbucket': 'bitbucket',
  
  // Testing
  'jest': 'jest',
  'cypress': 'cypress',
  'mocha': 'mocha',
  'jasmine': 'jasmine',
  'selenium': 'selenium',
  
  // Design tools
  'figma': 'figma',
  'sketch': 'sketch',
  'adobexd': 'xd',
  'xd': 'xd',
  'photoshop': 'photoshop',
  'illustrator': 'illustrator',
  
  // Mobile
  'ios': 'swift',
  'android': 'android',
  'swift': 'swift',
  'flutter': 'flutter',
  'kotlin': 'kotlin',
  
  // Machine Learning
  'tensorflow': 'tensorflow',
  'pytorch': 'pytorch',
  
  // Other
  'graphql': 'graphql',
  'apollo': 'apollographql',
  'django': 'django',
  'flask': 'flask',
  'dotnet': 'dotnet',
  '.net': 'dotnet',
  'excel': 'excel',
  'claude': 'claude',
  'firebase': 'firebase',
  'heroku': 'heroku',
  'nginx': 'nginx',
  'apache': 'apache',
  'laravel': 'laravel',
  'wordpress': 'wordpress',
  'shopify': 'shopify',
  'salesforce': 'salesforce',
  'oracle': 'oracle',
  'sap': 'sap',
  'tableau': 'tableau',
};

/**
 * Normaliza un nombre de tecnología para búsqueda en el mapa
 */
export function normalizeTechName(techName) {
  return techName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace('.js', '')
    .replace(/[^\w-]/g, '');
}

/**
 * Obtiene el ID del sprite para una tecnología
 * @param {string} techName - Nombre de la tecnología
 * @returns {string|null} - ID del sprite o null si no se encuentra
 */
export function getTechIconId(techName) {
  const normalized = normalizeTechName(techName);
  return TECH_ICON_MAP[normalized] || null;
}

/**
 * Crea el elemento SVG para un icono de tecnología
 * @param {string} techName - Nombre de la tecnología
 * @returns {string} - HTML del SVG o string vacío si no hay icono
 */
export function createTechIcon(techName) {
  const iconId = getTechIconId(techName);
  if (!iconId) {
    return '';
  }
  
  return `<svg class="tech-icon" aria-hidden="true">
    <use href="assets/sprite.svg#${iconId}"></use>
  </svg>`;
}

/**
 * Verifica si una tecnología tiene icono disponible
 * @param {string} techName - Nombre de la tecnología
 * @returns {boolean}
 */
export function hasTechIcon(techName) {
  return getTechIconId(techName) !== null;
}
