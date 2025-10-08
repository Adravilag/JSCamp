// 1. Apply button functionality

const jobsList = document.querySelector(".jobs-list");

jobsList?.addEventListener("click", function (e) {
  const element = e.target;
  if (element.classList.contains("apply-btn")) {
    e.preventDefault();
    element.textContent = "¡Aplicado!";
    element.classList.add("is-applied");
    element.disabled = true;
  }
});

// 2. Filter jobs by category

// TODO: Tarea - Completar el filtrado de empleos por categoría