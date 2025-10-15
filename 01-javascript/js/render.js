// ==========================================
// FUNCIONES DE RENDERIZADO
// ==========================================

import { CONFIG } from "./config.js";
import {
  getModalidadIcon,
  modalidadToClass,
  modalidadToLabel,
  formatSalaryLabel,
  areaToLabel,
  getAreaIcon,
  experienciaToLabel,
  getExperienciaIcon,
} from "./utils.js";
import { applicationManager } from "./ui-feedback.js";
import { createTechIcon, hasTechIcon } from "./tech-icons.js";

/**
 * Genera badges de estado para una oferta
 */
function generateStatusBadges(job) {
  const badges = [];
  const now = new Date();

  // Badge: Nueva (publicada hace menos de 7 días)
  if (job.metadata?.postedDate) {
    const postedDate = new Date(job.metadata.postedDate);
    const daysSincePosted = Math.floor(
      (now - postedDate) / (1000 * 60 * 60 * 24)
    );
    if (daysSincePosted <= 7) {
      badges.push({
        class: "badge-new",
        icon: "🆕",
        text: "Nueva",
      });
    }
  }

  // Badge: Urgente
  if (job.metadata?.urgency === "high") {
    badges.push({
      class: "badge-urgent",
      icon: "🔥",
      text: "Urgente",
    });
  }

  // Badge: Cierra pronto (deadline en menos de 7 días)
  if (job.metadata?.deadline) {
    const deadline = new Date(job.metadata.deadline);
    const daysUntilDeadline = Math.floor(
      (deadline - now) / (1000 * 60 * 60 * 24)
    );
    if (daysUntilDeadline > 0 && daysUntilDeadline <= 7) {
      badges.push({
        class: "badge-closing-soon",
        icon: "⏰",
        text: `Cierra en ${daysUntilDeadline}d`,
      });
    }
  }

  // Badge: Pocas vacantes
  if (job.metadata?.vacancies && job.metadata.vacancies <= 3) {
    badges.push({
      class: "badge-few-spots",
      icon: "👥",
      text: `Solo ${job.metadata.vacancies} vacante${
        job.metadata.vacancies > 1 ? "s" : ""
      }`,
    });
  }

  // Badge: Destacada
  if (job.metadata?.featured) {
    badges.push({
      class: "badge-featured",
      icon: "⭐",
      text: "Destacada",
    });
  }

  return badges
    .map(
      (badge) =>
        `<span class="status-badge ${badge.class}">${badge.icon} ${badge.text}</span>`
    )
    .join("");
}

/**
 * Crea un elemento de tarjeta de empleo
 */
export function createJobCard(job) {
  const div = document.createElement("div");
  div.className = "job-card";
  div.id = job.id || "";

  // Mapear modalidad del JSON a valor del filtro HTML
  const modalidadFiltro =
    CONFIG.MODALIDAD_MAP[job.details?.workMode] || job.details?.workMode || "";

  // Establecer data attributes para filtrado
  div.dataset.modalidad = modalidadFiltro;
  div.dataset.area = job.details?.area || "";
  div.dataset.experience = job.details?.level || "";
  div.dataset.salary = job.details?.salary || "";
  div.dataset.city = job.details?.city || "";

  const modalidadClassName = modalidadToClass(modalidadFiltro);
  const modalidadIcon = getModalidadIcon(modalidadFiltro);

  // Verificar si ya se ha postulado
  const hasApplied = applicationManager.hasApplied(job.id);

  // Generar badges de estado
  const statusBadges = generateStatusBadges(job);

  // Construir HTML de la tarjeta
  // Para empresas conocidas, usar directamente company.toLowerCase() + '.com'
  // Esto funciona con: Google, Netflix, Amazon, Spotify, Apple, GitHub, Microsoft, Tesla, Airbnb, Meta
  const companyName = job.company || "empresa";
  const companyKey = companyName.toLowerCase().replace(/\s+/g, "");
  const unavatarUrl = `https://unavatar.io/${companyKey}.com`;

  // Renderizar Trust Badge si hay datos de confianza
  let trustBadgeHTML = "";
  if (job.trust) {
    const trustDataString = JSON.stringify(job.trust).replace(/"/g, '&quot;');
    trustBadgeHTML = `
      <devjobs-trust-badge 
        data-trust="${trustDataString}"
        company="${job.company || ""}"
        class="job-trust-badge">
      </devjobs-trust-badge>
    `;
  }

  div.innerHTML = `
    ${statusBadges ? `<div class="job-badges">${statusBadges}</div>` : ""}
    
    <button 
      class="apply-btn-floating ${hasApplied ? "applied" : ""}" 
      data-job-id="${job.id}"
      ${hasApplied ? "disabled" : ""}
      title="${hasApplied ? 'Ya postulado' : 'Postularme'}"
      aria-label="${hasApplied ? 'Ya postulado' : 'Postularme'}">
      ${
        hasApplied
          ? `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `
          : `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      `
      }
      <span class="btn-text">${hasApplied ? 'Ya postulado' : 'Postularme'}</span>
    </button>
    
    <div class="job-header">
      <div class="job-company">
        <div class="company-logo">
          <devjobs-avatar 
            src="${unavatarUrl}"
            alt="Logo de ${companyName}"
            size="56px"
            shape="rounded"
            fallback="https://unavatar.io/${encodeURIComponent(companyName)}">
          </devjobs-avatar>
        </div>
        <div class="company-info">
          <h4 class="job-title">${job.title || "Sin título"}</h4>
          <p 
            class="company-name" 
            data-tooltip-type="company" 
            data-tooltip-key="${companyKey}">
            ${companyName}
          </p>
        </div>
      </div>
    </div>
    
    <p class="job-description">${
      job.description || "Sin descripción disponible"
    }</p>
    
    <div class="tech-tags">
      ${(job.details?.technologies || [])
        .map((tech) => {
          const techKey = tech
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(".js", "");
          const techIcon = createTechIcon(tech);
          const hasIcon = hasTechIcon(tech);

          return `<span 
          class="tech-tag ${hasIcon ? "with-icon" : ""}" 
          data-tooltip-type="tech" 
          data-tooltip-key="${techKey}">
          ${techIcon}
          <span class="tech-name">${tech}</span>
        </span>`;
        })
        .join("")}
    </div>
    
    <div class="job-info-tags-enhanced">
      <div 
        class="info-tag-enhanced ${modalidadClassName}"
        data-tooltip-type="workmode"
        data-tooltip-key="${modalidadFiltro}">
        <span class="tag-icon">${modalidadIcon}</span>
        <span class="tag-label">Modalidad</span>
        <span class="tag-value">${modalidadToLabel(modalidadFiltro)}</span>
      </div>
      
      <div 
        class="info-tag-enhanced location" 
        data-tooltip-type="location" 
        data-tooltip-key="${job.details?.city || "unknown"}">
        <span class="tag-icon">📍</span>
        <span class="tag-label">Ubicación</span>
        <span class="tag-value">${
          job.details?.city || job.location || "No especificada"
        }</span>
      </div>
      
      ${
        job.details?.area
          ? `
      <div 
        class="info-tag-enhanced area"
        data-tooltip-type="area"
        data-tooltip-key="${job.details.area}">
        <span class="tag-icon">${getAreaIcon(job.details.area)}</span>
        <span class="tag-label">Área</span>
        <span class="tag-value">${areaToLabel(job.details.area)}</span>
      </div>
      `
          : ""
      }
      
      ${
        job.details?.level
          ? `
      <div 
        class="info-tag-enhanced experience"
        data-tooltip-type="experience"
        data-tooltip-key="${job.details.level}">
        <span class="tag-icon">${getExperienciaIcon(job.details.level)}</span>
        <span class="tag-label">Experiencia</span>
        <span class="tag-value">${experienciaToLabel(job.details.level)}</span>
      </div>
      `
          : ""
      }
      
      <div 
        class="info-tag-enhanced salary highlight" 
        data-tooltip-type="salary" 
        data-tooltip-key="${job.id}">
        <span class="tag-icon">💶</span>
        <span class="tag-label">Salario</span>
        <span class="tag-value">${formatSalaryLabel(
          job.details?.salary || ""
        )}</span>
      </div>
    </div>

    ${trustBadgeHTML}
  `;

  // Añadir event listener para postulación
  const applyBtn = div.querySelector(".apply-btn-floating");
  if (applyBtn && !hasApplied) {
    applyBtn.addEventListener("click", () => {
      applicationManager.apply(job.id, job.title, companyName);
    });
  }

  return div;
}

/**
 * Renderiza todas las tarjetas de empleo en el contenedor
 */
export function renderJobs(jobs, container) {
  if (!container) {
    console.error("❌ Contenedor no encontrado");
    return;
  }

  // Limpiar contenedor
  container.innerHTML = "";

  // Renderizar todas las tarjetas
  jobs.forEach((job) => {
    const card = createJobCard(job);
    container.appendChild(card);
  });

  console.log(`✅ ${jobs.length} empleos renderizados`);
}

/**
 * Muestra un mensaje de error en el contenedor
 */
export function renderError(container, error) {
  if (!container) return;

  container.innerHTML = `
    <div style="text-align: center; padding: 2rem; color: #666;">
      <p style="font-size: 1.2rem; margin-bottom: 1rem;">⚠️ Error al cargar empleos</p>
      <p>${error.message}</p>
      <p style="margin-top: 1rem;">Por favor, recarga la página.</p>
    </div>
  `;
}

/**
 * Actualiza el título de la sección con el número de resultados
 */
export function updateStatusTitle(statusElement, visible, total, hasFilters) {
  if (!statusElement) return;

  if (hasFilters) {
    if (visible === 0) {
      statusElement.textContent =
        "❌ No se encontraron empleos con los filtros aplicados";
      statusElement.classList.add("no-results");
    } else {
      statusElement.textContent = `Mostrando ${visible} de ${total} empleos`;
      statusElement.classList.remove("no-results");
    }
  } else {
    statusElement.textContent = "Resultados de búsqueda";
    statusElement.classList.remove("no-results");
  }
}
