/**
 * 🎨 DEMOSTRACIÓN: Sistema de Iconos SVG para Tecnologías
 * 
 * Este archivo demuestra cómo funciona el nuevo sistema de iconos.
 * Importar en la consola del navegador para probar:
 * 
 * import('./js/demo-tech-icons.js');
 */

import { 
  getTechIconId, 
  createTechIcon, 
  hasTechIcon, 
  normalizeTechName,
  TECH_ICON_MAP 
} from './tech-icons.js';

console.log('%c🎨 Sistema de Iconos SVG - Demo', 'font-size: 20px; font-weight: bold; color: #3b82f6;');
console.log('='.repeat(50));

// 1. Normalización de nombres
console.log('\n%c1️⃣ Normalización de Nombres', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

const testNames = [
  'React Native',
  'Vue.js',
  'Tailwind CSS',
  'Node.js',
  'C#',
  'PostgreSQL'
];

testNames.forEach(name => {
  const normalized = normalizeTechName(name);
  const iconId = getTechIconId(name);
  console.log(`"${name}" → "${normalized}" → ${iconId ? `✅ "${iconId}"` : '❌ sin icono'}`);
});

// 2. Verificación de iconos disponibles
console.log('\n%c2️⃣ Verificación de Iconos', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

const popularTechs = [
  'React', 'Angular', 'Vue.js', 'Python', 'JavaScript',
  'TypeScript', 'Docker', 'Kubernetes', 'AWS', 'MongoDB'
];

const available = popularTechs.filter(hasTechIcon);
const missing = popularTechs.filter(tech => !hasTechIcon(tech));

console.log('✅ Disponibles:', available.length, '/', popularTechs.length);
console.log('📦 Con icono:', available.join(', '));
if (missing.length > 0) {
  console.log('❌ Sin icono:', missing.join(', '));
}

// 3. Generación de HTML
console.log('\n%c3️⃣ Generación de HTML', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

console.log('\n🔧 HTML generado para "React":');
const reactIcon = createTechIcon('React');
console.log(reactIcon);

console.log('\n🔧 HTML completo de una tech tag con icono:');
const techWithIcon = `
<span class="tech-tag with-icon" 
      data-tooltip-type="tech" 
      data-tooltip-key="react"
      style="cursor: help;">
  ${createTechIcon('React')}
  <span class="tech-name">React</span>
</span>`.trim();
console.log(techWithIcon);

console.log('\n🔧 HTML de una tech tag sin icono (fallback):');
const techWithoutIcon = `
<span class="tech-tag" 
      data-tooltip-type="tech" 
      data-tooltip-key="customtech"
      style="cursor: help;">
  <span class="tech-name">Custom Tech</span>
</span>`.trim();
console.log(techWithoutIcon);

// 4. Estadísticas del sistema
console.log('\n%c4️⃣ Estadísticas del Sistema', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

const totalMappings = Object.keys(TECH_ICON_MAP).length;
const uniqueIcons = new Set(Object.values(TECH_ICON_MAP)).size;

console.log(`📊 Total de mapeos: ${totalMappings}`);
console.log(`🎨 Iconos únicos: ${uniqueIcons}`);
console.log(`📦 Ratio: ${(uniqueIcons / totalMappings * 100).toFixed(1)}% iconos únicos`);

// 5. Categorías más populares
console.log('\n%c5️⃣ Top 10 Tecnologías Más Mapeadas', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

const iconCounts = {};
Object.values(TECH_ICON_MAP).forEach(iconId => {
  iconCounts[iconId] = (iconCounts[iconId] || 0) + 1;
});

const topIcons = Object.entries(iconCounts)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 10);

topIcons.forEach(([iconId, count], index) => {
  console.log(`${index + 1}. ${iconId}: ${count} variante${count > 1 ? 's' : ''}`);
});

// 6. Ejemplo de uso en render
console.log('\n%c6️⃣ Ejemplo de Uso en Render', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

console.log(`
// En js/render.js:

const technologies = ['React', 'TypeScript', 'Tailwind CSS'];

const techTagsHTML = technologies.map(tech => {
  const techKey = normalizeTechName(tech);
  const techIcon = createTechIcon(tech);
  const hasIcon = hasTechIcon(tech);
  
  return \`
    <span class="tech-tag \${hasIcon ? 'with-icon' : ''}" 
          data-tooltip-type="tech" 
          data-tooltip-key="\${techKey}"
          style="cursor: help;">
      \${techIcon}
      <span class="tech-name">\${tech}</span>
    </span>
  \`;
}).join('');
`);

// 7. Consejos de uso
console.log('\n%c7️⃣ 💡 Consejos de Uso', 'font-size: 16px; font-weight: bold; color: #f59e0b;');
console.log('─'.repeat(50));

console.log(`
✅ HACER:
  • Usar hasTechIcon() antes de añadir clase .with-icon
  • Mantener nombres de tecnologías consistentes
  • Añadir variantes comunes al mapeo
  • Envolver el nombre en <span class="tech-name">
  
❌ NO HACER:
  • No asumir que todas las tecnologías tienen icono
  • No usar IDs de sprite directamente sin verificar
  • No olvidar normalizar nombres antes de buscar
  • No duplicar lógica de normalización
`);

// 8. Tests rápidos
console.log('\n%c8️⃣ 🧪 Tests Rápidos', 'font-size: 16px; font-weight: bold; color: #10b981;');
console.log('─'.repeat(50));

const tests = [
  {
    name: 'Normalización lowercase',
    test: () => normalizeTechName('REACT') === 'react',
  },
  {
    name: 'Eliminación de espacios',
    test: () => normalizeTechName('React Native') === 'reactnative',
  },
  {
    name: 'Eliminación de .js',
    test: () => normalizeTechName('Vue.js') === 'vue',
  },
  {
    name: 'Icono existe para React',
    test: () => hasTechIcon('React') === true,
  },
  {
    name: 'Icono no existe para XYZ',
    test: () => hasTechIcon('XYZ') === false,
  },
  {
    name: 'createTechIcon retorna SVG',
    test: () => createTechIcon('React').includes('<svg'),
  },
  {
    name: 'createTechIcon retorna vacío para desconocido',
    test: () => createTechIcon('Unknown') === '',
  }
];

tests.forEach(({ name, test }) => {
  const passed = test();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
});

console.log('\n' + '='.repeat(50));
console.log('%c✨ Demo completada! Abre test-tech-icons.html para ver visualmente', 
  'font-size: 14px; color: #3b82f6; font-weight: bold;');
console.log('='.repeat(50) + '\n');

// Exportar funciones para uso en consola
export {
  getTechIconId,
  createTechIcon,
  hasTechIcon,
  normalizeTechName,
  TECH_ICON_MAP
};
